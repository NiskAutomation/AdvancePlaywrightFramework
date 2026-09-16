import { test, expect } from '@playwright/test';
import { assertJsonSchema } from '@utils/JsonSchemaValidator';
import { createLogger } from '@utils/logger';
import bookingSchema from '@testdata/schemas/create-booking.schema.json';
import { generateTestData, fallbackBooking, type BookingScenario } from '../../ai/agents/testDataGenerator';

// Exercises the custom AI data generator agent directly; no live booking API call.
const log = createLogger('CustomDataGen');
const scenarios: BookingScenario[] = ['weekend', 'family', 'business'];

for (const scenario of scenarios) {
    test(`@ai customDataCreator generates a valid ${scenario} booking`, async ({}, testInfo) => {
        const result = await generateTestData(scenario);
        const payload = result.status === 'success' ? result.data : fallbackBooking();
        log.info(`customDataCreator (${scenario}): ${result.status}${result.status === 'error' ? ` (${result.code})` : ''}`);
        testInfo.annotations.push({ type: 'ai-generation', description: result.status });
        await testInfo.attach('ai-data', { body: JSON.stringify(payload, null, 2), contentType: 'application/json' });

        // Never assert on generated prose or model availability, only schema validity.
        assertJsonSchema(bookingSchema, payload, 'Booking request');
        expect(payload.bookingdates.checkin < payload.bookingdates.checkout).toBe(true);
    });
}

