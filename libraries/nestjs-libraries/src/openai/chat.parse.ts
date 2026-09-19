import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import {
    aiConfig,
    supportsJsonSchema,
} from '@gitroom/nestjs-libraries/openai/ai.config';

/**
 * Structured chat completion that works on both OpenAI (strict json_schema) and
 * OpenAI-compatible providers that only support json_object (DeepSeek). Returns
 * the object validated by the zod schema, or null when the model produced
 * nothing usable.
 */

const JSON_INSTRUCTION =
    'Respond with a single valid JSON object only. No prose, no markdown fences.';

export async function chatParse<T extends z.ZodTypeAny>(
    client: any,
    schema: T,
    name: string,
    params: Record<string, any>,
    options?: Record<string, any>
): Promise<z.infer<T> | null> {
    const model = params.model || aiConfig.chat.model;

    if (supportsJsonSchema()) {
        const response = await client.chat.completions.parse(
            {
                ...params,
                model,
                response_format: zodResponseFormat(schema, name),
            },
            options
        );

        return response.choices[0]?.message?.parsed ?? null;
    }

    const response = await client.chat.completions.create(
        {
            ...params,
            model,
            messages: [
                ...(params.messages || []),
                { role: 'system', content: JSON_INSTRUCTION },
            ],
            response_format: { type: 'json_object' },
        },
        options
    );

    const raw = response.choices[0]?.message?.content;

    if (!raw) {
        return null;
    }

    try {
        return schema.parse(JSON.parse(raw));
    } catch {
        return null;
    }
}
