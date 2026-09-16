import { envOr } from '@config/env';

export type Provider = 'deepseek' | 'openrouter' | 'groq' | 'openai' | 'codex' | 'anthropic';

export interface ProviderConfig {
    provider: Provider;
    model: string;
    baseURL: string;
    apiKey: string;
    timeoutMs: number;
    maxTokens: number;
    enabled: boolean;
}

const defaults: Record<Provider, { model: string; baseURL: string; key: string }> = {
    deepseek: { model: 'deepseek-flash', baseURL: 'https://api.deepseek.com', key: 'DEEPSEEK_API_KEY' },
    openrouter: { model: 'openai/gpt-4.1-mini', baseURL: 'https://openrouter.ai/api/v1', key: 'OPENROUTER_API_KEY' },
    groq: { model: 'llama-3.3-70b-versatile', baseURL: 'https://api.groq.com/openai/v1', key: 'GROQ_API_KEY' },
    openai: { model: 'gpt-4.1-mini', baseURL: 'https://api.openai.com/v1', key: 'OPENAI_API_KEY' },
    codex: { model: 'gpt-5.3-codex', baseURL: 'https://api.openai.com/v1', key: 'OPENAI_API_KEY' },
    anthropic: { model: 'claude-haiku-4-5-20251001', baseURL: 'https://api.anthropic.com/v1', key: 'ANTHROPIC_API_KEY' },
};

function isProvider(value: unknown): value is Provider {
    return typeof value === 'string' && Object.hasOwn(defaults, value);
}

/** Error messages deliberately contain no environment values or credentials. */
function invalidConfig(): never {
    throw new Error('Invalid AI configuration. Check AI_PROVIDER, AI_MODEL, AI_BASE_URL, AI_ENABLED and numeric limits.');
}

/** Also validates injected configurations, before any request can carry an API key. */
export function validateProviderConfig(config: ProviderConfig): void {
    if (!config || !isProvider(config.provider)
        || typeof config.enabled !== 'boolean'
        || typeof config.apiKey !== 'string'
        || /[\r\n]/.test(config.apiKey)
        || typeof config.model !== 'string'
        || !/^[A-Za-z0-9][A-Za-z0-9._:/-]{0,199}$/.test(config.model)
        || !Number.isInteger(config.timeoutMs) || config.timeoutMs < 1 || config.timeoutMs > 120_000
        || !Number.isInteger(config.maxTokens) || config.maxTokens < 1 || config.maxTokens > 32_768
        || typeof config.baseURL !== 'string') {
        invalidConfig();
    }

    let url: URL;
    try {
        url = new URL(config.baseURL);
    } catch {
        invalidConfig();
    }
    const loopback = url.hostname === 'localhost' || url.hostname === '[::1]'
        || /^127\.(?:\d{1,3}\.){2}\d{1,3}$/.test(url.hostname);
    if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback))
        || url.username || url.password || /[?#]/.test(config.baseURL)) {
        invalidConfig();
    }
}

/** Read lazily so each run can choose a provider; never fall back to a different key. */
export function getProviderConfig(): ProviderConfig {
    const provider = envOr('AI_PROVIDER', 'deepseek').toLowerCase();
    const enabled = envOr('AI_ENABLED', 'true').toLowerCase();
    if (!isProvider(provider) || !['true', 'false'].includes(enabled)) invalidConfig();
    const preset = defaults[provider];
    const config: ProviderConfig = {
        provider,
        model: envOr('AI_MODEL', preset.model),
        baseURL: envOr('AI_BASE_URL', preset.baseURL).replace(/\/+$/, ''),
        apiKey: enabled === 'false' ? '' : envOr(preset.key, ''),
        timeoutMs: Number(envOr('AI_TIMEOUT_MS', '15000')),
        maxTokens: Number(envOr('AI_MAX_TOKENS', '2048')),
        enabled: enabled === 'true',
    };
    validateProviderConfig(config);
    return config;
}

/** Includes the explicit off switch; invalid config is never considered available. */
export function hasApiKey(): boolean {
    try {
        const config = getProviderConfig();
        return config.enabled && config.apiKey.trim().length > 0;
    } catch {
        return false;
    }
}
