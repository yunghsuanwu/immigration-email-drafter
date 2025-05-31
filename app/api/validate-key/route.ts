import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        valid: false,
        error: "No API key found in environment variables",
      })
    }

    if (!apiKey.startsWith("sk-")) {
      return NextResponse.json({
        valid: false,
        error: "API key format appears incorrect",
      })
    }

    // Test the API key with a simple request
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      return NextResponse.json({ valid: true })
    } else {
      const errorData = await response.text()
      return NextResponse.json({
        valid: false,
        error: `API key validation failed: ${response.status} ${errorData}`,
      })
    }
  } catch (error) {
    return NextResponse.json({
      valid: false,
      error: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
    })
  }
}
