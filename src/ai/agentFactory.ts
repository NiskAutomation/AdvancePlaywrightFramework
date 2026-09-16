import type { AnySchema } from 'ajv';
import { assertJsonSchema } from '@utils/JsonSchemaValidator';
import { createLLMClient, type AgentResult, type LLMClient } from './LLMClient';

export interface AgentDefinition<I> {
    name: string;
    prompt: (input: I) => string;
    schema: AnySchema;
}

/** A schema is the boundary: unchecked model JSON never leaves this factory. */
export function createAgent<I, O>(
    definition: AgentDefinition<I>,
    client: LLMClient = createLLMClient(),
): (input: I) => Promise<AgentResult<O>> {
    return async (input) => {
        try {
            const system = 'Return only a JSON value matching the supplied JSON Schema. '
                + 'Do not include Markdown, explanations, or extra properties. '
                + `JSON Schema: ${JSON.stringify(definition.schema)}`;
            const prompt = definition.prompt(input);
            let feedback = '';
            for (let attempt = 0; attempt < 2; attempt++) {
                const reply = await client.complete({ system, prompt: prompt + feedback });
                if (reply.status !== 'success') return reply;

                let value: unknown;
                try {
                    value = JSON.parse(reply.data.text);
                } catch {
                    // SyntaxError can echo response data; never use its message.
                    feedback = '\nThe previous response was not valid JSON. Return corrected JSON only.';
                    continue;
                }
                try {
                    assertJsonSchema(definition.schema, value, definition.name);
                    return { status: 'success', data: value as O };
                } catch (error) {
                    const validation = error instanceof Error ? error.message : 'Schema validation failed.';
                    feedback = '\nThe previous response failed validation. Correct these errors and return JSON only:\n'
                        + validation.slice(0, 2000);
                }
            }
            return { status: 'error', code: 'invalid_output' };
        } catch {
            // Keep prompt-building, validation, and unexpected client errors out of test results.
            return { status: 'error', code: 'agent_error' };
        }
    };
}
