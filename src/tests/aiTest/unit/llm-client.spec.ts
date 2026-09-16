import { test, expect } from '@playwright/test';
import { Writable } from 'node:stream';
import winston from 'winston';
import { createLLMClient } from '../../../ai/LLMClient';
import type { Provider, ProviderConfig } from '../../../ai/config/providers';
import { logger } from '../../../utils/logger';

const request = {
    system: 'Return a JSON object.',
    prompt: 'Generate a synthetic booking.',
};
const answer = '{"firstname":"Synthetic"}';

function config(provider: Provider = 'deepseek', overrides: Partial<ProviderConfig> = {}): ProviderConfig {
    return {
        provider,
        model: 'test-model',
        baseURL: 'https://provider.invalid/v1',
        apiKey: 'synthetic-test-key',
        timeoutMs: 1_000,
        maxTokens: 321,
        enabled: true,
        ...overrides,
    };
}

function envelope(provider: Provider): unknown {
    if (provider === 'openai' || provider === 'codex') {
        return {
            status: 'completed',
            output: [{
                type: 'message',
                status: 'completed',
                role: 'assistant',
                content: [{ type: 'output_text', text: answer }],
            }],
            usage: { input_tokens: 11, output_tokens: 7 },
        };
    }
    if (provider === 'anthropic') {
        return {
            type: 'message',
            role: 'assistant',
            content: [{ type: 'text', text: answer }],
            stop_reason: 'end_turn',
            usage: { input_tokens: 11, output_tokens: 7 },
        };
    }
    return {
        choices: [{ message: { role: 'assistant', content: answer, tool_calls: [] }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 11, completion_tokens: 7 },
    };
}

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
    });
}

const providers: Provider[] = ['deepseek', 'openrouter', 'groq', 'openai', 'codex', 'anthropic'];

for (const provider of providers) {
    test(`${provider}: sends the provider's protocol and normalizes response metadata`, async () => {
        const calls: Array<{ url: string; init: RequestInit }> = [];
        const fetchMock: typeof fetch = async (input, init) => {
            // These tests only ever pass a plain string url/body; the fetch signature is a wider union.
            calls.push({ url: input as string, init: init ?? {} });
            return jsonResponse(envelope(provider));
        };

        const result = await createLLMClient(config(provider), fetchMock).complete(request);

        expect(calls).toHaveLength(1);
        const call = calls[0];
        const body = JSON.parse(call.init.body as string);
        const headers = new Headers(call.init.headers);
        expect(call.init.method).toBe('POST');
        expect(call.init.redirect).toBe('error');
        expect(headers.get('content-type')).toContain('application/json');
        expect(body.model).toBe('test-model');

        if (provider === 'openai' || provider === 'codex') {
            expect(call.url).toBe('https://provider.invalid/v1/responses');
            expect(headers.get('authorization')).toBe('Bearer synthetic-test-key');
            expect(body.max_output_tokens).toBe(321);
            expect(body.store).toBe(false);
            expect(JSON.stringify(body)).toContain(request.system);
            expect(JSON.stringify(body)).toContain(request.prompt);
        } else if (provider === 'anthropic') {
            expect(call.url).toBe('https://provider.invalid/v1/messages');
            expect(headers.get('x-api-key')).toBe('synthetic-test-key');
            expect(headers.get('anthropic-version')).toBeTruthy();
            expect(body.system).toContain(request.system);
            expect(body.messages).toEqual([{ role: 'user', content: request.prompt }]);
            expect(body.max_tokens).toBe(321);
        } else {
            expect(call.url).toBe('https://provider.invalid/v1/chat/completions');
            expect(headers.get('authorization')).toBe('Bearer synthetic-test-key');
            expect(body.messages).toEqual([
                { role: 'system', content: expect.stringContaining(request.system) },
                { role: 'user', content: request.prompt },
            ]);
            expect(body[provider === 'groq' ? 'max_completion_tokens' : 'max_tokens']).toBe(321);
        }

        expect(result.status).toBe('success');
        if (result.status !== 'success') throw new Error('Expected successful provider response');
        expect(result.data).toMatchObject({
            text: answer,
            provider,
            model: 'test-model',
            usage: { inputTokens: 11, outputTokens: 7 },
        });
        expect(result.data.latencyMs).toBeGreaterThanOrEqual(0);
    });
}

for (const unavailable of [
    { name: 'missing API key', overrides: { apiKey: '' } },
    { name: 'explicitly disabled', overrides: { enabled: false } },
]) {
    test(`${unavailable.name}: returns unavailable without contacting a provider`, async () => {
        let calls = 0;
        const fetchMock: typeof fetch = async () => {
            calls += 1;
            throw new Error('Unavailable AI must never call fetch');
        };

        const result = await createLLMClient(config('deepseek', unavailable.overrides), fetchMock).complete(request);

        expect(result.status).toBe('unavailable');
        expect(calls).toBe(0);
    });
}

const invalidConfigs: Array<{ name: string; overrides: Partial<ProviderConfig> }> = [
    { name: 'unknown provider', overrides: { provider: 'unknown-provider' as Provider } },
    { name: 'URL with credentials', overrides: { baseURL: 'https://user:password@provider.invalid/v1' } },
    { name: 'URL with a query', overrides: { baseURL: 'https://provider.invalid/v1?key=synthetic' } },
    { name: 'URL with a fragment', overrides: { baseURL: 'https://provider.invalid/v1#fragment' } },
    { name: 'remote plaintext HTTP URL', overrides: { baseURL: 'http://provider.invalid/v1' } },
];

for (const invalid of invalidConfigs) {
    test(`${invalid.name}: rejects configuration before sending credentials`, async () => {
        let calls = 0;
        const fetchMock: typeof fetch = async () => {
            calls += 1;
            return jsonResponse(envelope('deepseek'));
        };

        const result = await createLLMClient(config('deepseek', invalid.overrides), fetchMock).complete(request);

        expect(result).toEqual({ status: 'error', code: 'INVALID_CONFIG' });
        expect(calls).toBe(0);
    });
}

test('allows a loopback HTTP URL for an explicitly configured local provider', async () => {
    let requestedURL = '';
    const fetchMock: typeof fetch = async (input) => {
        requestedURL = input as string;
        return jsonResponse(envelope('deepseek'));
    };

    const result = await createLLMClient(config('deepseek', {
        baseURL: 'http://127.0.0.1:8080/v1/',
    }), fetchMock).complete(request);

    expect(result.status).toBe('success');
    expect(requestedURL).toBe('http://127.0.0.1:8080/v1/chat/completions');
});

test('authentication failure is not retried', async () => {
    let calls = 0;
    const fetchMock: typeof fetch = async () => {
        calls += 1;
        return jsonResponse({ error: { message: 'Invalid credentials' } }, 401);
    };

    const result = await createLLMClient(config(), fetchMock).complete(request);

    expect(result.status).toBe('error');
    expect(calls).toBe(1);
});

for (const status of [429, 503]) {
    test(`HTTP ${status}: retries once and recovers`, async () => {
        let calls = 0;
        const fetchMock: typeof fetch = async () => {
            calls += 1;
            return calls === 1
                ? jsonResponse({ error: { message: 'Temporarily unavailable' } }, status)
                : jsonResponse(envelope('deepseek'));
        };

        const result = await createLLMClient(config(), fetchMock).complete(request);

        expect(result.status).toBe('success');
        expect(calls).toBe(2);
    });
}

test('repeated transient failures stop after the single allowed retry', async () => {
    let calls = 0;
    const fetchMock: typeof fetch = async () => {
        calls += 1;
        return jsonResponse({ error: { message: 'Still unavailable' } }, 503);
    };

    const result = await createLLMClient(config(), fetchMock).complete(request);

    expect(result.status).toBe('error');
    expect(calls).toBe(2);
});

test('timeout remains active while consuming the response body', async () => {
    test.setTimeout(2_000);
    let bodyAborted = false;
    const fetchMock: typeof fetch = async (_input, init) => {
        const signal = init?.signal;
        if (!signal) throw new Error('The transport must provide an abort signal');
        return new Response(new ReadableStream<Uint8Array>({
            start(controller) {
                const abort = () => {
                    bodyAborted = true;
                    controller.error(Object.assign(new Error('Aborted during body read'), { name: 'AbortError' }));
                };
                if (signal.aborted) abort();
                else signal.addEventListener('abort', abort, { once: true });
            },
        }), { headers: { 'content-type': 'application/json' } });
    };

    const result = await createLLMClient(config('deepseek', { timeoutMs: 25 }), fetchMock).complete(request);

    expect(bodyAborted).toBe(true);
    expect(result.status).toBe('error');
});

test('enforces the deadline even when a body reader ignores the abort signal', async () => {
    test.setTimeout(2_000);
    const fetchMock: typeof fetch = async () => new Response(new ReadableStream<Uint8Array>());

    const result = await createLLMClient(config('deepseek', { timeoutMs: 25 }), fetchMock).complete(request);

    expect(result).toEqual({ status: 'error', code: 'TIMEOUT' });
});

test('Retry-After cannot extend the configured request deadline', async () => {
    test.setTimeout(2_000);
    let calls = 0;
    const fetchMock: typeof fetch = async () => {
        calls += 1;
        return new Response(null, { status: 429, headers: { 'retry-after': '3600' } });
    };

    const result = await createLLMClient(config('deepseek', { timeoutMs: 25 }), fetchMock).complete(request);

    expect(result).toEqual({ status: 'error', code: 'TIMEOUT' });
    expect(calls).toBe(1);
});

for (const malformed of [
    { name: 'unparseable JSON', makeResponse: () => new Response('not-json', { status: 200 }) },
    { name: 'missing provider envelope', makeResponse: () => jsonResponse({ text: answer }) },
    { name: 'missing completion marker', makeResponse: () => jsonResponse({ choices: [{ message: { content: answer } }] }) },
]) {
    test(`${malformed.name}: fails without retrying`, async () => {
        let calls = 0;
        const fetchMock: typeof fetch = async () => {
            calls += 1;
            return malformed.makeResponse();
        };

        const result = await createLLMClient(config(), fetchMock).complete(request);

        expect(result.status).toBe('error');
        expect(calls).toBe(1);
    });
}

const rejectedOutputs: Array<{ name: string; provider: Provider; body: unknown }> = [
    {
        name: 'Chat Completions tool call',
        provider: 'deepseek',
        body: { choices: [{ message: { content: answer, tool_calls: [{ type: 'function', function: { name: 'unexpected' } }] }, finish_reason: 'tool_calls' }] },
    },
    {
        name: 'Chat Completions refusal',
        provider: 'deepseek',
        body: { choices: [{ message: { content: answer, refusal: 'Cannot comply' }, finish_reason: 'stop' }] },
    },
    {
        name: 'Chat Completions truncated output',
        provider: 'groq',
        body: { choices: [{ message: { content: answer }, finish_reason: 'length' }] },
    },
    {
        name: 'Responses refusal',
        provider: 'codex',
        body: { status: 'completed', output: [{ type: 'message', status: 'completed', content: [{ type: 'refusal', refusal: 'Cannot comply' }] }] },
    },
    {
        name: 'Responses incomplete output',
        provider: 'openai',
        body: { status: 'incomplete', output: [{ type: 'message', status: 'incomplete', content: [{ type: 'output_text', text: answer }] }] },
    },
    {
        name: 'Messages refusal',
        provider: 'anthropic',
        body: { content: [{ type: 'text', text: answer }], stop_reason: 'refusal' },
    },
    {
        name: 'Messages truncated output',
        provider: 'anthropic',
        body: { content: [{ type: 'text', text: answer }], stop_reason: 'max_tokens' },
    },
];

for (const rejected of rejectedOutputs) {
    test(`${rejected.name}: never returns usable success data`, async () => {
        const fetchMock: typeof fetch = async () => jsonResponse(rejected.body);

        const result = await createLLMClient(config(rejected.provider), fetchMock).complete(request);

        expect(result.status).toBe('error');
    });
}

test('logs request metadata without logging keys, prompts, outputs, or provider errors', async () => {
    const logLines: string[] = [];
    const stream = new Writable({
        write(chunk, _encoding, callback) {
            logLines.push(String(chunk));
            callback();
        },
    });
    const transport = new winston.transports.Stream({ stream, format: winston.format.json() });
    const previousLevel = logger.level;
    logger.level = 'info';
    logger.add(transport);

    try {
        const privateRequest = { system: 'synthetic-system-secret', prompt: 'synthetic-prompt-secret' };
        const privateConfig = config('deepseek', { apiKey: 'synthetic-api-key-secret' });
        const successfulFetch: typeof fetch = async () => jsonResponse({
            choices: [{ message: { content: 'synthetic-output-secret' }, finish_reason: 'stop' }],
            usage: { prompt_tokens: 11, completion_tokens: 7 },
        });
        const failedFetch: typeof fetch = async () => jsonResponse({
            error: { message: 'synthetic-provider-error-secret' },
        }, 400);

        expect((await createLLMClient(privateConfig, successfulFetch).complete(privateRequest)).status).toBe('success');
        expect((await createLLMClient(privateConfig, failedFetch).complete(privateRequest)).status).toBe('error');

        const output = logLines.join('\n');
        expect(output).toContain('deepseek');
        expect(output).toContain('test-model');
        expect(output).toContain('latencyMs');
        expect(output).toContain('inputTokens');
        for (const secret of [
            privateRequest.system,
            privateRequest.prompt,
            privateConfig.apiKey,
            'synthetic-output-secret',
            'synthetic-provider-error-secret',
        ]) {
            expect(output).not.toContain(secret);
        }
    } finally {
        logger.remove(transport);
        logger.level = previousLevel;
        transport.close?.();
        stream.end();
    }
});
