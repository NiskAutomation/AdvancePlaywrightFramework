import { test, expect } from '@playwright/test';
import { envOr } from '@config/env';
import { ApiHelper } from '@utils/APiHelper';
import { assertJsonSchema } from '@utils/JsonSchemaValidator';
import requestSchema from '@testdata/schemas/create-booking.schema.json';
import responseSchema from '@testdata/schemas/create-booking-response.schema.json';
import type { CreateBookingResponse } from '@api/BookingAPI';
import { fallbackBooking, generateTestData } from '../../ai/agents/testDataGenerator';

// Replica of the Level 2 create-booking flow. Existing API examples stay independent.
test('@ai @live POST /booking accepts generated data or the deterministic fallback', async ({ request }, testInfo) => {
    test.skip(envOr('AI_LIVE_TESTS', 'false') !== 'true', 'Set AI_LIVE_TESTS=true to run against the booking service.');
    const result = await generateTestData('family');
    const payload = result.status === 'success' ? result.data : fallbackBooking();
    console.info(`AI booking data: ${result.status}${result.status === 'error' ? ` (${result.code})` : ''}`);
    testInfo.annotations.push({ type: 'ai-generation', description: result.status });
    if (result.status === 'success') {
        await testInfo.attach('ai-data', { body: JSON.stringify(payload, null, 2), contentType: 'application/json' });
    }
    // Never assert on generated prose or model availability.
    assertJsonSchema(requestSchema, payload, 'Booking request');
    const api = new ApiHelper(request);
    let body: CreateBookingResponse;
    await test.step('POST /booking with a validated booking payload', async () => {
        const response = await api.post('/booking', payload, {
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        });
        expect(response.status()).toBe(200);
        const json: unknown = await response.json();
        assertJsonSchema(responseSchema, json, 'Booking response');
        body = json as CreateBookingResponse;
        await testInfo.attach('create-booking-response', {
            body: JSON.stringify(body, null, 2), contentType: 'application/json',
        });
    });
    await test.step('Verify the created booking echoes the submitted values', async () => {
        expect(body.bookingid).toBeGreaterThan(0);
        expect(body.booking).toMatchObject({ ...payload });
    });
});
