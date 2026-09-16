import type { CreateBookingResponse } from '@api/BookingAPI';
import { test, expect } from '@fixtures/booker-fixture';
import { buildBookingFromGenerator } from '@testdata/booking.data';
import createBookingSchema from '@testdata/schemas/create-booking-response.schema.json';
import { assertJsonSchema } from '@utils/JsonSchemaValidator';

test.describe('@ajv Create Booking response schema', () => {
    test('@live validates a created booking and its submitted values', async ({ bookingApi }) => {
        const payload = buildBookingFromGenerator();
        let bookingId: number | undefined;

        try {
            const response = await bookingApi.createBookingResponse(payload);
            const body: unknown = await response.json().catch((cause: unknown) => {
                throw new Error(
                    `POST /booking returned invalid JSON (HTTP ${response.status()}, `
                    + `Content-Type: ${response.headers()['content-type'] ?? 'missing'}).`,
                    { cause },
                );
            });

            // Capture the ID before assertions so even a schema failure triggers cleanup.
            if (body !== null && typeof body === 'object' && 'bookingid' in body
                && typeof body.bookingid === 'number'
                && Number.isInteger(body.bookingid) && body.bookingid > 0) {
                bookingId = body.bookingid;
            }

            expect(response.status(), 'POST /booking status').toBe(200);
            expect(response.headers()['content-type'], 'POST /booking content type')
                .toMatch(/^application\/json\b/i);

            assertJsonSchema(createBookingSchema, body, 'POST /booking response');
            // Matching submitted values is a separate check from the response shape.
            expect(body).toMatchObject({ booking: payload });
        } finally {
            if (bookingId !== undefined) {
                // Soft checks retain the original assertion failure if cleanup also fails.
                await expect.soft(
                    bookingApi.deleteBooking(bookingId),
                    'DELETE /booking cleanup status',
                ).resolves.toBe(201);
            }
        }
    });

    test.describe('@local schema examples (no HTTP requests)', () => {
        function validResponse(): CreateBookingResponse {
            return {
                bookingid: 1,
                booking: buildBookingFromGenerator({
                    bookingdates: { checkin: '2028-02-29', checkout: '2028-03-03' },
                }),
            };
        }

        test('accepts valid responses with and without optional additionalneeds', () => {
            const body = validResponse();
            expect(() => assertJsonSchema(createBookingSchema, body)).not.toThrow();

            delete body.booking.additionalneeds;
            expect(() => assertJsonSchema(createBookingSchema, body)).not.toThrow();
        });

        test('allows extra fields at every object level and preserves them', () => {
            const sample = validResponse();
            const body = {
                ...sample,
                reference: 'external-reference',
                booking: {
                    ...sample.booking,
                    room: 'Suite',
                    bookingdates: { ...sample.booking.bookingdates, timezone: 'UTC' },
                },
            };
            const original = structuredClone(body);

            assertJsonSchema(createBookingSchema, body);
            expect(body).toEqual(original);
        });

        const requiredPaths = [
            ['bookingid'],
            ['booking'],
            ['booking', 'firstname'],
            ['booking', 'lastname'],
            ['booking', 'totalprice'],
            ['booking', 'depositpaid'],
            ['booking', 'bookingdates'],
            ['booking', 'bookingdates', 'checkin'],
            ['booking', 'bookingdates', 'checkout'],
        ];

        for (const path of requiredPaths) {
            test(`rejects a missing /${path.join('/')}`, () => {
                const body = validResponse();
                // Work with unknown values because these examples deliberately break the type.
                let parent = body as unknown as Record<string, unknown>;
                for (const key of path.slice(0, -1)) {
                    parent = parent[key] as Record<string, unknown>;
                }
                const field = path[path.length - 1];
                delete parent[field];

                expect(() => assertJsonSchema(createBookingSchema, body))
                    .toThrow(`must have required property '${field}'`);
            });
        }

        const invalidCases: { name: string; data: () => unknown; message: string }[] = [
            { name: 'null response', data: () => null, message: '/ must be object' },
            { name: 'array response', data: () => [], message: '/ must be object' },
            { name: 'string bookingid', data: () => ({ ...validResponse(), bookingid: '1' }), message: '/bookingid must be integer' },
            { name: 'fractional bookingid', data: () => ({ ...validResponse(), bookingid: 1.5 }), message: '/bookingid must be integer' },
            { name: 'zero bookingid', data: () => ({ ...validResponse(), bookingid: 0 }), message: '/bookingid must be >= 1' },
            { name: 'null booking', data: () => ({ ...validResponse(), booking: null }), message: '/booking must be object' },
        ];

        for (const { name, data, message } of invalidCases) {
            test(`rejects ${name}`, () => {
                expect(() => assertJsonSchema(createBookingSchema, data())).toThrow(message);
            });
        }

        const invalidBookingFields = [
            { field: 'firstname', value: 123, type: 'string' },
            { field: 'lastname', value: false, type: 'string' },
            { field: 'totalprice', value: '111', type: 'number' },
            { field: 'depositpaid', value: 'true', type: 'boolean' },
            { field: 'bookingdates', value: null, type: 'object' },
            { field: 'additionalneeds', value: null, type: 'string' },
        ];

        for (const { field, value, type } of invalidBookingFields) {
            test(`rejects an incorrect type for booking.${field}`, () => {
                const sample = validResponse();
                const body = { ...sample, booking: { ...sample.booking, [field]: value } };
                const original = structuredClone(body);

                expect(() => assertJsonSchema(createBookingSchema, body))
                    .toThrow(`/booking/${field} must be ${type}`);
                expect(body).toEqual(original);
            });
        }

        for (const field of ['checkin', 'checkout'] as const) {
            for (const date of ['2027-02-29', '2028-04-31', '29/02/2028']) {
                test(`rejects invalid ${field} date ${date}`, () => {
                    const body = validResponse();
                    body.booking.bookingdates[field] = date;

                    expect(() => assertJsonSchema(createBookingSchema, body))
                        .toThrow(`/booking/bookingdates/${field} must match format "date"`);
                });
            }
        }

        test('reports all errors with the supplied label and nested paths', () => {
            const sample = validResponse();
            const body = {
                ...sample,
                bookingid: '1',
                booking: {
                    ...sample.booking,
                    depositpaid: 'true',
                    bookingdates: { checkin: '2027-02-29' },
                },
            };
            let message = '';
            try {
                assertJsonSchema(createBookingSchema, body, 'POST /booking response');
            } catch (error) {
                if (!(error instanceof Error)) throw error;
                message = error.message;
            }

            expect(message).toContain('POST /booking response failed JSON schema validation');
            expect(message).toContain('/bookingid must be integer');
            expect(message).toContain('/booking/depositpaid must be boolean');
            expect(message).toContain('/booking/bookingdates/checkin must match format "date"');
            expect(message).toContain("/booking/bookingdates must have required property 'checkout'");
            // Reusing the schema after a failure must validate the next body independently.
            expect(() => assertJsonSchema(createBookingSchema, validResponse())).not.toThrow();
        });

        test('supports other schemas without adding defaults or coercing values', () => {
            const schema = {
                type: 'object',
                properties: { count: { type: 'integer', default: 1 } },
            };
            const empty = {};
            assertJsonSchema(schema, empty);
            expect(empty).toEqual({});

            const body = { count: '2' };
            expect(() => assertJsonSchema(schema, body)).toThrow('/count must be integer');
            expect(body.count).toBe('2');
        });

        test('rejects asynchronous schemas instead of accepting a Promise as success', () => {
            expect(() => assertJsonSchema({ $async: true, type: 'object' }, {}))
                .toThrow('asynchronous JSON schemas are not supported');
        });
    });
});
