import { createLogger } from '@utils/logger';
import { getProviderConfig, validateProviderConfig, type Provider, type ProviderConfig } from './config/providers';

export type AgentResult<T> =
    | { status: 'success'; data: T }
    | { status: 'unavailable'; reason: string }
    | { status: 'error'; code: string };

export interface LLMRequest {
    system: string;
    prompt: string;
}

export interface LLMReply {
    text: string;
    provider: Provider;
    model: string;
    latencyMs: number;
    usage?: { inputTokens: number; outputTokens: number };
}

export interface LLMClient {
    complete(request: LLMRequest): Promise<AgentResult<LLMReply>>;
}

const logger = createLogger('LLMClient');
type JsonObject = Record<string, unknown>;
type ParsedReply = AgentResult<Pick<LLMReply, 'text' | 'usage'>>;
const object = (value: unknown): value is JsonObject => typeof value === 'object' && value !== null && !Array.isArray(value);
const error = (code: string): { status: 'error'; code: string } => ({ status: 'error', code });

function usageOf(value: unknown, chat: boolean): LLMReply['usage'] {
    if (!object(value)) return undefined;
    const inputTokens = chat ? value.prompt_tokens : value.input_tokens;
    const outputTokens = chat ? value.completion_tokens : value.output_tokens;
    return Number.isSafeInteger(inputTokens) && (inputTokens as number) >= 0
        && Number.isSafeInteger(outputTokens) && (outputTokens as number) >= 0
        ? { inputTokens: inputTokens as number, outputTokens: outputTokens as number } : undefined;
}

function parseReply(value: unknown, provider: Provider): ParsedReply {
    if (!object(value) || value.error) return error('INVALID_RESPONSE');
    let text = '';
    const chat = provider === 'deepseek' || provider === 'openrouter' || provider === 'groq';

    if (chat) {
        if (!Array.isArray(value.choices) || value.choices.length !== 1) return error('INVALID_RESPONSE');
        const choice: unknown = value.choices[0];
        if (!object(choice) || !object(choice.message) || choice.error) return error('INVALID_RESPONSE');
        const message = choice.message;
        if (message.refusal || choice.finish_reason === 'content_filter') return error('REFUSAL');
        const hasToolCalls = Array.isArray(message.tool_calls) ? message.tool_calls.length > 0 : message.tool_calls != null;
        if (hasToolCalls || message.function_call != null || choice.finish_reason === 'tool_calls') {
            return error('UNEXPECTED_TOOL_CALL');
        }
        if (choice.finish_reason === 'length') return error('INCOMPLETE_RESPONSE');
        if (choice.finish_reason !== 'stop' || typeof message.content !== 'string') return error('INVALID_RESPONSE');
        text = message.content;
    } else if (provider === 'anthropic') {
        if (value.stop_reason === 'refusal') return error('REFUSAL');
        if (value.stop_reason === 'max_tokens' || value.stop_reason === 'model_context_window_exceeded') {
            return error('INCOMPLETE_RESPONSE');
        }
        if (value.stop_reason === 'tool_use' || value.stop_reason === 'pause_turn') return error('UNEXPECTED_TOOL_CALL');
        if (value.stop_reason !== 'end_turn' || !Array.isArray(value.content)) return error('INVALID_RESPONSE');
        for (const block of value.content as unknown[]) {
            if (!object(block)) return error('INVALID_RESPONSE');
            if (block.type === 'refusal') return error('REFUSAL');
            if (block.type === 'tool_use' || block.type === 'server_tool_use') return error('UNEXPECTED_TOOL_CALL');
            if (block.type === 'text' && typeof block.text === 'string') text += block.text;
            else if (block.type !== 'thinking' && block.type !== 'redacted_thinking') return error('INVALID_RESPONSE');
        }
    } else {
        if (value.status === 'incomplete' || value.incomplete_details) return error('INCOMPLETE_RESPONSE');
        if (value.status !== 'completed' || !Array.isArray(value.output)) return error('INVALID_RESPONSE');
        for (const item of value.output as unknown[]) {
            if (!object(item)) return error('INVALID_RESPONSE');
            if (item.type === 'reasoning') continue;
            if (item.type !== 'message') return error('UNEXPECTED_TOOL_CALL');
            if (item.status && item.status !== 'completed') return error('INCOMPLETE_RESPONSE');
            if (!Array.isArray(item.content)) return error('INVALID_RESPONSE');
            for (const block of item.content as unknown[]) {
                if (!object(block)) return error('INVALID_RESPONSE');
                if (block.type === 'refusal') return error('REFUSAL');
                if (block.type !== 'output_text' || typeof block.text !== 'string') return error('INVALID_RESPONSE');
                text += block.text;
            }
        }
    }

    if (!text.trim()) return error('INVALID_RESPONSE');
    return { status: 'success', data: { text, usage: usageOf(value.usage, chat) } };
}

function requestPayload(config: ProviderConfig, request: LLMRequest): { route: string; headers: Record<string, string>; body: string } {
    const system = `${request.system}\nReturn only a JSON object, without Markdown or commentary.`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.provider === 'anthropic') {
        headers['x-api-key'] = config.apiKey.trim();
        headers['anthropic-version'] = '2023-06-01';
        return {
            route: 'messages', headers,
            body: JSON.stringify({ model: config.model, max_tokens: config.maxTokens, system,
                messages: [{ role: 'user', content: request.prompt }] }),
        };
    }
    headers.Authorization = `Bearer ${config.apiKey.trim()}`;
    if (config.provider === 'openai' || config.provider === 'codex') {
        return {
            route: 'responses', headers,
            body: JSON.stringify({ model: config.model, instructions: system, input: request.prompt,
                max_output_tokens: config.maxTokens, store: false, text: { format: { type: 'json_object' } } }),
        };
    }
    return {
        route: 'chat/completions', headers,
        body: JSON.stringify({
            model: config.model,
            messages: [{ role: 'system', content: system }, { role: 'user', content: request.prompt }],
            response_format: { type: 'json_object' },
            ...(config.provider === 'groq' ? { max_completion_tokens: config.maxTokens } : { max_tokens: config.maxTokens }),
            ...(config.provider === 'deepseek' ? { thinking: { type: 'disabled' } } : {}),
            ...(config.provider === 'openrouter' ? { provider: { allow_fallbacks: false, require_parameters: true } } : {}),
        }),
    };
}

/** Race each awaited operation with the same deadline, including response-body reads. */
function beforeAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const abort = () => reject(new Error('AI request timed out'));
        if (signal.aborted) {
            // Attach a rejection handler even when an injected operation ignores its signal.
            void promise.catch(() => undefined);
            abort();
            return;
        }
        signal.addEventListener('abort', abort, { once: true });
        promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    });
}

function retryDelay(response: Response): number {
    const value = response.headers.get('retry-after');
    if (!value) return 100;
    const seconds = Number(value);
    const delay = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(value) - Date.now();
    return Number.isFinite(delay) ? Math.max(0, Math.min(delay, 120_000)) : 100;
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (signal.aborted) { reject(new Error('AI request timed out')); return; }
        const abort = () => { clearTimeout(timer); reject(new Error('AI request timed out')); };
        const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
        signal.addEventListener('abort', abort, { once: true });
    });
}

/** Native fetch transport. One transient HTTP retry; no provider or model fallback. */
export function createLLMClient(config?: ProviderConfig, fetchImpl: typeof fetch = fetch): LLMClient {
    let selected: ProviderConfig;
    try {
        selected = { ...(config ?? getProviderConfig()) };
        validateProviderConfig(selected);
    } catch {
        return { complete: async () => error('INVALID_CONFIG') };
    }

    return {
        async complete(request): Promise<AgentResult<LLMReply>> {
            const started = Date.now();
            let attempts = 0;
            const finish = (result: AgentResult<LLMReply>): AgentResult<LLMReply> => {
                logger.info(JSON.stringify({ provider: selected.provider, model: selected.model,
                    status: result.status, latencyMs: Date.now() - started, attempts,
                    ...(result.status === 'success' && result.data.usage ? { usage: result.data.usage } : {}) }));
                return result;
            };
            if (!selected.enabled) return finish({ status: 'unavailable', reason: 'disabled' });
            if (!selected.apiKey.trim()) return finish({ status: 'unavailable', reason: 'missing_api_key' });
            if (!request || typeof request.system !== 'string' || typeof request.prompt !== 'string') {
                return finish(error('INVALID_REQUEST'));
            }
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), selected.timeoutMs);
            try {
                const payload = requestPayload(selected, request);
                const url = `${selected.baseURL.replace(/\/+$/, '')}/${payload.route}`;
                for (let attempt = 0; attempt < 2; attempt++) {
                    attempts++;
                    const response = await beforeAbort(fetchImpl(url, { method: 'POST', headers: payload.headers,
                        body: payload.body, signal: controller.signal, redirect: 'error' }), controller.signal);
                    if (!response.ok) {
                        // Do not read/log provider error bodies; they can echo prompts or credentials.
                        if (response.body) await beforeAbort(response.body.cancel(), controller.signal);
                        if (attempt === 0 && (response.status === 429 || response.status >= 500 && response.status <= 599)) {
                            await delay(retryDelay(response), controller.signal);
                            continue;
                        }
                        return finish(error(`HTTP_${response.status}`));
                    }
                    let value: unknown;
                    try {
                        value = await beforeAbort(response.json(), controller.signal);
                    } catch {
                        return finish(error(controller.signal.aborted ? 'TIMEOUT' : 'INVALID_RESPONSE'));
                    }
                    const parsed = parseReply(value, selected.provider);
                    if (parsed.status !== 'success') return finish(parsed);
                    return finish({ status: 'success', data: { ...parsed.data, provider: selected.provider,
                        model: selected.model, latencyMs: Date.now() - started } });
                }
                return finish(error('NETWORK_ERROR'));
            } catch {
                return finish(error(controller.signal.aborted ? 'TIMEOUT' : 'NETWORK_ERROR'));
            } finally {
                clearTimeout(timeout);
            }
        },
    };
}
