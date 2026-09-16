import { test, expect } from '@playwright/test';
import { createAgent } from '../../../ai/agentFactory';
import type { AgentResult, LLMClient, LLMReply, LLMRequest } from '../../../ai/LLMClient';
import { fallbackBooking, generateTestData } from '../../../ai/agents/testDataGenerator';
import { assertJsonSchema } from '@utils/JsonSchemaValidator';
import bookingSchema from '@testdata/schemas/create-booking.schema.json';

function scripted(...responses: string[]): { client: LLMClient; requests: LLMRequest[] } {
    const requests: LLMRequest[] = [];
    return {
        requests,
        client: {
            async complete(request) {
                requests.push(request);
                return { status: 'success', data: {
                    text: responses[requests.length - 1], provider: 'deepseek', model: 'test', latencyMs: 0,
                } };
            },
        },
    };
}

const definition = {
    name: 'example', prompt: (name: string) => `Return a count for ${name}`,
    schema: { type: 'object', required: ['count'], additionalProperties: false,
        properties: { count: { type: 'integer', minimum: 1 } } },
};

test('validates output and exposes a typed result', async () => {
    const { client, requests } = scripted('{"count":2}');
    const result = await createAgent<string, { count: number }>(definition, client)('rooms');
    expect(result).toEqual({ status: 'success', data: { count: 2 } });
    expect(requests).toHaveLength(1);
});

test('repairs malformed JSON once without echoing the invalid body into feedback', async () => {
    const { client, requests } = scripted('private-response-not-json', '{"count":2}');
    const result = await createAgent(definition, client)('rooms');
    expect(result.status).toBe('success');
    expect(requests).toHaveLength(2);
    expect(requests[1].prompt).toContain('not valid JSON');
    expect(requests[1].prompt).not.toContain('private-response');
});

test('repairs schema failures using the validation path and error', async () => {
    const { client, requests } = scripted('{"count":"2"}', '{"count":2}');
    expect((await createAgent(definition, client)('rooms')).status).toBe('success');
    expect(requests).toHaveLength(2);
    expect(requests[1].prompt).toContain('/count must be integer');
});

test('two invalid outputs fail without passing unchecked data downstream', async () => {
    const { client, requests } = scripted('{"count":0}', '{"count":2,"unexpected":true}');
    expect(await createAgent(definition, client)('rooms')).toEqual({ status: 'error', code: 'invalid_output' });
    expect(requests).toHaveLength(2);
});

for (const response of [
    { status: 'unavailable', reason: 'missing_key' },
    { status: 'error', code: 'transport_failure' },
] satisfies AgentResult<LLMReply>[]) {
    test(`${response.status} propagates without a schema repair or throw`, async () => {
        let calls = 0;
        const client: LLMClient = { async complete() { calls++; return response; } };
        expect(await createAgent(definition, client)('rooms')).toEqual(response);
        expect(calls).toBe(1);
    });
}

test('unexpected prompt and client exceptions become safe failures', async () => {
    const client: LLMClient = { async complete() { throw new Error('secret network details'); } };
    expect(await createAgent(definition, client)('rooms')).toEqual({ status: 'error', code: 'agent_error' });
    expect(await createAgent({ ...definition, prompt: () => { throw new Error('private input'); } }, client)('rooms'))
        .toEqual({ status: 'error', code: 'agent_error' });
});

test('the booking generator enforces the request schema and stay dates', async () => {
    const today = new Date('2028-02-25T18:00:00Z');
    const booking = fallbackBooking(today);
    assertJsonSchema(bookingSchema, booking);
    const { client, requests } = scripted(JSON.stringify(booking));
    expect(await generateTestData('business', client, today)).toEqual({ status: 'success', data: booking });
    expect(requests[0].prompt).toContain('business');
    expect(booking.bookingdates).toEqual({ checkin: '2028-03-03', checkout: '2028-03-06' });
    const reversed = { ...booking, bookingdates: { checkin: '2028-03-06', checkout: '2028-03-03' } };
    expect(await generateTestData('business', scripted(JSON.stringify(reversed)).client, today))
        .toEqual({ status: 'error', code: 'invalid_booking_dates' });
});

test('a rejected booking schema is repaired and an unavailable model has a valid fallback', async () => {
    const today = new Date('2028-02-25T18:00:00Z');
    const booking = fallbackBooking(today);
    const { client, requests } = scripted(
        JSON.stringify({ ...booking, additionalneeds: 'x'.repeat(61) }), JSON.stringify(booking),
    );
    expect((await generateTestData('family', client, today)).status).toBe('success');
    expect(requests[1].prompt).toContain('/additionalneeds');
    const unavailable: LLMClient = { async complete() { return { status: 'unavailable', reason: 'missing_key' }; } };
    const result = await generateTestData('family', unavailable, today);
    const payload = result.status === 'success' ? result.data : fallbackBooking(today);
    expect(result.status).toBe('unavailable');
    expect(() => assertJsonSchema(bookingSchema, payload)).not.toThrow();
});

test('a new agent needs only a prompt and schema definition', async () => {
    const client = scripted('{"label":"smoke"}').client;
    const classify = createAgent<{ title: string }, { label: string }>({
        name: 'test-label', prompt: ({ title }) => `Classify synthetic title ${title}`,
        schema: { type: 'object', additionalProperties: false, required: ['label'],
            properties: { label: { type: 'string', enum: ['smoke', 'regression'] } } },
    }, client);
    expect(await classify({ title: 'Can create a booking' })).toEqual({ status: 'success', data: { label: 'smoke' } });
});
