/**
 * RCA agent — explains why a test failed and how badly it matters.
 *
 * The reporter calls analyzeFailure() for each failed test and renders the
 * result in the AI Verdict tab: severity and priority as badges, the root
 * cause as prose, the fixes as a list. That shape predates this agent, so the
 * schema below matches it exactly rather than inventing a new one.
 *
 * Severity and priority live here rather than in a separate triage agent: one
 * call is cheaper, and it keeps the two consistent with the explanation that
 * justified them.
 */

import { createAgent } from '../agentFactory';
import schema from '@testdata/schemas/ai-rca-verdict.schema.json';

export interface RcaVerdict {
    severity: 'critical' | 'high' | 'medium' | 'low';
    priority: string;
    rootCause: string;
    fixes: string[];
}

export interface FailureInput {
    title: string;
    file: string;
    error: string;
    stack?: string;
}

const rcaAgent = createAgent<FailureInput, RcaVerdict>({
    name: 'rca',
    schema,
    prompt: ({ title, file, error, stack }) => `
You are a senior test automation engineer triaging a failed Playwright test. Be specific about
this failure. Never suggest deleting or skipping the test to make it pass.

Test:  ${title}
File:  ${file}
Error: ${error}
${stack ? `Stack:\n${stack.split('\n').slice(0, 12).join('\n')}` : ''}

Analyse this failure:
- severity: critical, high, medium or low, reflecting user impact if this were real.
- priority: P0, P1, P2 or P3, reflecting fix urgency. A wrong assertion in the test is usually
  medium/P2; a broken product path is high or critical.
- rootCause: name the specific assertion or call that broke, not a generic category.
- fixes: concrete steps, not "investigate further".
`.trim(),
});

/**
 * Analyse one failure. Throws when no verdict can be produced, which the
 * reporter catches per test so one bad analysis cannot lose the others.
 */
export async function analyzeFailure(input: FailureInput): Promise<RcaVerdict> {
    const result = await rcaAgent(input);
    if (result.status !== 'success') {
        const reason = result.status === 'unavailable' ? result.reason : result.code;
        throw new Error(`RCA agent unavailable: ${reason}`);
    }
    return result.data;
}
