import { NextRequest, NextResponse } from "next/server";
import type { ClaudeReflectionRequest, ClaudeApiError as ClaudeApiErrorType } from "@/lib/types";
import { generateReflection, ClaudeApiError } from "@/lib/claude";

/**
 * POST /api/claude
 *
 * Accepts a ClaudeReflectionRequest body and returns a ClaudeReflectionResponse.
 * Claude is ONLY called from this server-side route — never from client components.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ClaudeApiErrorType>(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!isValidReflectionRequest(body)) {
    return NextResponse.json<ClaudeApiErrorType>(
      {
        error:
          "Request must include verseKey (string), arabicText (string), and translation (string).",
      },
      { status: 422 }
    );
  }

  try {
    const result = await generateReflection(body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof ClaudeApiError) {
      const statusCode = err.statusCode ?? 500;
      // Don't expose internal details for server errors
      const message =
        statusCode >= 500
          ? "An error occurred while generating the reflection. Please try again."
          : err.message;
      return NextResponse.json<ClaudeApiErrorType>({ error: message }, { status: statusCode });
    }

    return NextResponse.json<ClaudeApiErrorType>(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}

function isValidReflectionRequest(body: unknown): body is ClaudeReflectionRequest {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b["verseKey"] === "string" &&
    typeof b["arabicText"] === "string" &&
    typeof b["translation"] === "string" &&
    (b["tafsir"] === null || b["tafsir"] === undefined || typeof b["tafsir"] === "string")
  );
}
