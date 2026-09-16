import type { Booking } from '@api/BookingAPI';
import bookingSchema from '@testdata/schemas/create-booking.schema.json';
import { createAgent } from '../agentFactory';
import { createLLMClient, type AgentResult, type LLMClient } from '../LLMClient';

export type BookingScenario = 'weekend' | 'family' | 'business';

/** Stable values for a given date, with a future stay and no dependency on Faker or a model. */
export function fallbackBooking(today = new Date()): Booking {
    const day = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 7));
    const checkin = day.toISOString().slice(0, 10);
    day.setUTCDate(day.getUTCDate() + 3);
    return {
        firstname: 'Alex', lastname: 'Morgan', totalprice: 450, depositpaid: true,
        bookingdates: { checkin, checkout: day.toISOString().slice(0, 10) },
        additionalneeds: 'Breakfast',
    };
}

/** Sends only a synthetic scenario and dates; never reads a spec, credentials, or app data. */
export async function generateTestData(
    scenario: BookingScenario = 'weekend',
    client: LLMClient = createLLMClient(),
    today = new Date(),
): Promise<AgentResult<Booking>> {
    if (!['weekend', 'family', 'business'].includes(scenario)) {
        return { status: 'error', code: 'invalid_scenario' };
    }
    const dates = fallbackBooking(today).bookingdates;
    const agent = createAgent<BookingScenario, Booking>({
        name: 'booking-data',
        schema: bookingSchema,
        prompt: (kind) => `Create one fictional, realistic ${kind} hotel booking. `
            + 'Use invented people, a positive whole-number total price, and short additional needs. '
            + `Use checkin ${dates.checkin} and checkout ${dates.checkout} exactly.`,
    }, client);
    const result = await agent(scenario);
    if (result.status === 'success'
        && (result.data.bookingdates.checkin !== dates.checkin
            || result.data.bookingdates.checkout !== dates.checkout)) {
        return { status: 'error', code: 'invalid_booking_dates' };
    }
    return result;
}
