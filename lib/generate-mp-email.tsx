"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { FormData } from "@/types/form-data"

export async function generateMPEmail(data: FormData): Promise<string> {
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured")
  }

  const prompt = `
    Write a professional and persuasive email to a Member of Parliament about concerns regarding the immigration white paper. Use the following constituent information:

    Constituent Details:
    - Name: ${data.constituentName}
    - Residential Status: ${data.residentialStatus === "uk-national" ? "UK national/resident" : "Visa holder"}
    - Yearly Income: ${data.yearlyIncome}
    ${data.profession ? `- Profession: ${data.profession}` : ""}
    ${data.annualTaxContribution ? `- Annual Tax Contribution: £${data.annualTaxContribution}` : ""}
    ${data.yearsInUK ? `- Years in UK: ${data.yearsInUK}` : ""}
    
    Immigration Concerns:
    ${data.immigrationConcerns}

    Guidelines for the email:
    1. Write in first person (even if writing for someone else, as advised)
    2. Be respectful and professional
    3. Start with a proper greeting to the MP
    4. Introduce yourself as a constituent
    5. Clearly state your concerns about the immigration white paper
    6. Use the personal details to demonstrate your contribution to the UK (economic, social, etc.)
    7. Make specific, reasonable requests for action
    8. End with a polite closing requesting a response
    9. Keep the tone constructive and solution-oriented
    10. Make it personal and compelling while remaining factual

    The email should be approximately 300-500 words and structured with clear paragraphs.
    Do not include the recipient address or signature block - just the body of the email.
  `

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    return text
  } catch (error) {
    console.error("Error generating MP email:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid API key. Please check your OpenAI API key configuration.")
      }
      if (error.message.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your usage limits.")
      }
      if (error.message.includes("rate limit")) {
        throw new Error("Rate limit exceeded. Please try again in a moment.")
      }
    }

    throw new Error("Failed to generate email. Please try again.")
  }
}
