import Ajv, { type AnySchema } from 'ajv';
import addFormats from 'ajv-formats';

// One instance per worker lets AJV cache validators for imported schema objects.
const ajv = new Ajv({
    strict: true,
    allErrors: true,
    coerceTypes: false,
    useDefaults: false,
    removeAdditional: false,
});
addFormats(ajv);

/**
 * Assert that parsed JSON matches a synchronous JSON Schema, without changing it.
 * Throws all validation errors with JSON Pointer paths; usable outside Playwright.
 * Invalid schemas also throw when AJV compiles them.
 */
export function assertJsonSchema(
    schema: AnySchema,
    data: unknown,
    label = 'Response',
): void {
    const validate = ajv.compile(schema);

    // An async validator returns a Promise, which must never count as a valid body.
    if ('$async' in validate && validate.$async) {
        throw new Error(`${label}: asynchronous JSON schemas are not supported.`);
    }

    if (validate(data)) return;

    const errors = (validate.errors ?? []).map(
        ({ instancePath, message }) => `- ${instancePath || '/'} ${message}`,
    );
    throw new Error(`${label} failed JSON schema validation:\n${errors.join('\n')}`);
}
