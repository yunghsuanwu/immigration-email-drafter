"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type EmailFormData = {
  recipient: string
  subject: string
  purpose: string
  tone: string
  keyPoints: string
  additionalInfo: string
}

export async function generateEmail(data: EmailFormData): Promise<string> {
  const prompt = `
    Write a professional email with the following details:
    
    Recipient: ${data.recipient}
    Subject: ${data.subject}
    Purpose: ${data.purpose}
    Tone: ${data.tone}
    
    Key Points to Include:
    ${data.keyPoints}
    
    Additional Context:
    ${data.additionalInfo}
    
    Write only the body of the email. Do not include the recipient, subject, or signature in your response.
    Format the email with appropriate greetings, paragraphs, and closing.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return text
  } catch (error) {
    console.error("Error generating email:", error)
    throw new Error("Failed to generate email")
  }
}
