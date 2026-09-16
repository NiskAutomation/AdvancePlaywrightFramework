# Validate a Create Booking response with AJV

AJV checks actual JSON data against a JSON Schema at runtime. TypeScript types help
while writing code, but they do not verify the body returned by an API.

## Example response

```json
{
    "bookingid": 2657,
    "booking": {
        "firstname": "Jim",
        "lastname": "Brown",
        "totalprice": 111,
        "depositpaid": true,
        "bookingdates": {
            "checkin": "2018-01-01",
            "checkout": "2019-01-01"
        },
        "additionalneeds": "Breakfast"
    }
}
```

The request payload contains the booking fields. The create-booking **response**
wraps those fields inside `booking` and adds `bookingid`. Our schema validates that
response, so pass the whole response body to the validator.

## Turn the response into a schema

The schema lives in `src/testdata/schemas/create-booking-response.schema.json`.
Translate the response structure into rules instead of copying its example values:

- `$schema` selects JSON Schema draft-07.
- `type` describes a value: `object`, `string`, `number`, `integer`, or `boolean`.
- `properties` describes the fields an object can contain. It does not make them required.
- `required` lists fields that must exist in that particular object.
- `minimum: 1` makes `bookingid` a positive integer.
- `additionalProperties: true` allows extra fields. Set it on the root response,
  `booking`, and `bookingdates` so additions at any of those levels are accepted.
- `format: "date"` validates strings such as `"2018-01-01"`. The registered
  `ajv-formats` package also rejects impossible dates such as `"2026-02-30"`.

For example, `"firstname": { "type": "string" }` accepts different names; it does
not require the sample value `"Jim"`. Each nested object gets its own `properties`
and `required` rules.

`additionalneeds` is optional, matching the project's `Booking` interface. When
present, it must be a string. Date ordering (checkout after checkin) is a separate
business assertion; `format: "date"` checks each date independently.

## Reuse the validator

`ajv` and `ajv-formats` are already installed. The shared utility is
`src/utils/JsonSchemaValidator.ts`:

```ts
assertJsonSchema(schema: AnySchema, data: unknown, label?: string): void
```

Use it after reading the API response:

```ts
import createBookingResponseSchema from '@testdata/schemas/create-booking-response.schema.json';
import { assertJsonSchema } from '@utils/JsonSchemaValidator';

// Inside a test using the existing bookingApi fixture:
const response = await bookingApi.createBookingResponse(payload);
const responseBody: unknown = await response.json();

assertJsonSchema(
  createBookingResponseSchema,
  responseBody,
  'POST /booking response',
);
```

Successful validation returns normally. Invalid data throws an error containing
the label, field paths, and all validation errors. The default label is `Response`.
The utility supports synchronous schemas, uses one strict AJV instance with formats
registered once, and reuses AJV's compiled-schema cache. It does not change values,
insert defaults, coerce types, or remove extra properties.

Other tests can reuse the same utility with their own schemas. Keep HTTP status,
content type, expected field values, and business rules as separate assertions.

## Tests and commands

`create-booking-json-scheme.spec.ts` includes:

- `@local` cases that validate sample responses without calling the API: optional
  fields, extra fields, required fields, types, dates, and useful error messages.
- An `@live` case that creates a booking using generated data, checks HTTP `200`
  and JSON content type, validates the response schema, compares booking fields
  with the payload, and cleans up in `finally` using a captured booking ID.

Run the full folder, including the live Restful Booker request:

```bash
npx playwright test src/tests/apiTests/05_ajv_json_schema --project=api
```

Run only the local validation cases:

```bash
npx playwright test src/tests/apiTests/05_ajv_json_schema --project=api --grep '@local'
```

Check TypeScript:

```bash
npx tsc --noEmit
```

## API Test Case Flow

- Ping Request
- JSON Schema Validation of the Create APIs
- Indivual TestCase - GET, POST, PUT, PATCH, DELETE
- E2E Fixture based Test cases
