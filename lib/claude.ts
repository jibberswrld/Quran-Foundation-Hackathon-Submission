/**
 * Server-side Claude API helper.
 *
 * This module is imported ONLY by app/api/claude/route.ts.
 * Never import this in client components or any file that runs in the browser.
 */

import type { ClaudeReflectionRequest, ClaudeReflectionResponse } from "./types";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicRequest {
  model: string;
  max_tokens: number;
  system: string;
  messages: AnthropicMessage[];
}

interface AnthropicContentBlock {
  type: "text";
  text: string;
}

interface AnthropicResponse {
  id: string;
  type: "message";
  role: "assistant";
  content: AnthropicContentBlock[];
  model: string;
  stop_reason: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface AnthropicErrorBody {
  error?: {
    message?: string;
    type?: string;
  };
}

export class ClaudeApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "ClaudeApiError";
  }
}

/**
 * Build the system prompt for Quran reflection generation.
 */
function buildSystemPrompt(): string {
  return `You are a compassionate and knowledgeable Quran reflection guide. Your role is to help Muslims engage deeply with the Quran by offering brief, thoughtful, and personally relevant reflections on the verses they are reading.

Guidelines:
- Keep reflections concise (3-5 sentences maximum)
- Ground insights in the verse text and tafsir provided
- Use warm, accessible language without being overly academic
- Encourage personal connection and spiritual reflection
- Do not add commentary beyond what is grounded in the provided context
- Do not include Quranic Arabic text in your response — the reader already has it
- Always end with a brief takeaway or practical reflection point`;
}

/**
 * Build the user message for a reflection request.
 */
function buildUserMessage(req: ClaudeReflectionRequest): string {
  const lines: string[] = [
    `Verse: ${req.verseKey}`,
    ``,
    `Translation:`,
    `"${req.translation}"`,
    ``,
  ];

  if (req.tafsir) {
    lines.push(`Scholar's Commentary (Tafsir):`);
    // Truncate very long tafsir to stay within a reasonable token budget
    const tafsirExcerpt =
      req.tafsir.length > 800 ? `${req.tafsir.slice(0, 800)}…` : req.tafsir;
    lines.push(tafsirExcerpt);
    lines.push(``);
  }

  lines.push(
    `Please provide a brief, meaningful reflection on this verse that I can carry with me today.`
  );

  return lines.join("\n");
}

/**
 * Call the Anthropic Messages API and return a personalised reflection.
 *
 * @throws ClaudeApiError on API failures or missing API key
 */
export async function generateReflection(
  req: ClaudeReflectionRequest
): Promise<ClaudeReflectionResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ClaudeApiError("ANTHROPIC_API_KEY environment variable is not set.", 500);
  }

  const body: AnthropicRequest = {
    model: MODEL,
    max_tokens: 300,
    system: buildSystemPrompt(),
    messages: [
      {
        role: "user",
        content: buildUserMessage(req),
      },
    ],
  };

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => ({}))) as AnthropicErrorBody;
    const message =
      errorBody.error?.message ?? `Anthropic API error ${res.status}`;
    throw new ClaudeApiError(message, res.status);
  }

  const data = (await res.json()) as AnthropicResponse;
  const textBlock = data.content.find((b) => b.type === "text");

  if (!textBlock) {
    throw new ClaudeApiError("Claude returned no text content.", 500);
  }

  return {
    reflection: textBlock.text.trim(),
    verseKey: req.verseKey,
  };
}
