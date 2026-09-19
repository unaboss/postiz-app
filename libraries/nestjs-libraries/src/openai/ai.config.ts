/**
 * Central AI provider configuration.
 *
 * Chat/agent and image generation are configured independently so the text
 * features can point at any OpenAI-compatible endpoint (DeepSeek, Ollama,
 * OpenRouter, ...) while image generation keeps its own provider. Every value
 * falls back to the original OpenAI default, so an install that sets nothing
 * behaves exactly as before.
 */

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';

export const aiConfig = {
    chat: {
        baseUrl:
            process.env.AI_CHAT_BASE_URL ||
            process.env.OPENAI_BASE_URL ||
            process.env.OPENAI_API_BASE_URL ||
            DEFAULT_OPENAI_BASE_URL,
        apiKey:
            process.env.AI_CHAT_API_KEY ||
            process.env.OPENAI_API_KEY ||
            'sk-proj-',
        model:
            process.env.AI_CHAT_MODEL ||
            process.env.OPENAI_CHAT_MODEL ||
            process.env.OPENAI_MODEL ||
            'gpt-4.1',
    },
    image: {
        baseUrl:
            process.env.AI_IMAGE_BASE_URL ||
            process.env.OPENAI_IMAGE_BASE_URL ||
            DEFAULT_OPENAI_BASE_URL,
        apiKey:
            process.env.AI_IMAGE_API_KEY ||
            process.env.OPENAI_API_KEY ||
            'sk-proj-',
        model:
            process.env.AI_IMAGE_MODEL ||
            process.env.OPENAI_IMAGE_MODEL ||
            'chatgpt-image-latest',
    },
};

const isOpenAiNative = (baseUrl: string): boolean =>
    /(^|\.)api\.openai\.com/.test(baseUrl);

/**
 * OpenAI supports the strict json_schema response format. Most OpenAI-compatible
 * providers (DeepSeek included) only support json_object or function calling.
 * Detected from the base URL, overridable with AI_CHAT_STRUCTURED_OUTPUT.
 */
export const supportsJsonSchema = (): boolean => {
    const override = process.env.AI_CHAT_STRUCTURED_OUTPUT;

    if (override === 'json_schema') {
        return true;
    }

    if (override === 'json_object' || override === 'function_calling') {
        return false;
    }

    return isOpenAiNative(aiConfig.chat.baseUrl);
};

export const structuredOutputMethod = (): 'json_schema' | 'functionCalling' =>
    supportsJsonSchema() ? 'json_schema' : 'functionCalling';

export const isChatConfigured = (): boolean =>
    !!(process.env.AI_CHAT_API_KEY || process.env.OPENAI_API_KEY);
