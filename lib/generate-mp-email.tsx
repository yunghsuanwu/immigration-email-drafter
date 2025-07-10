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
    You are a caseworker helping people with lived experience of the UK immigration system--or know someone who does--write a letter to their Member of Parliament to explain the impact of the 2025 Labour-led immigration rule change on them.  

    You are writing on behalf of someone who has filled in a form that details their visa and socioeconomic situation, whose data will be shared with you.
    Your job is to write a professional and compelling email to the MP from the constituent; make the writing style original so it does not read like an AI.
    You must:
    - Highlight any economic contribution the constitutent has made to the UK, if any.
    – Highlight any potential social contribution the constituent has made to the UK, if any (given how long they've been in the UK).
    - Highlight the particular concerns the constitutent has.
    - Quote verbatim unless personal identifiable information is included. 
    - think about the story of the person affected in the first person.
    - Do not include names or any personally identifying information.
    - Do not include any harmful languages such as swear words or discriminatory remarks that are racist, sexist, transphobic, or hate-filled.
    - Start with a subject line and greeting.
    - End with a respectful sign-off.

    Make sure it does not read like an AI has written it and make sure every contribution is unique. 

    This is a good example:
    Subject: Urgent Concern: Impact of Recent Benefit Changes on My Life
    Dear [MP's Name],
    I'm reaching out to you because the recent changes to benefits have severely impacted my life, and I feel it's vital that you understand the true consequences these decisions have on people like me.
    I rely on these benefits not by choice but out of necessity. In the voice message I recorded, I shared: "Since they changed the benefits, I'm struggling every day to keep my head above water. My anxiety is through the roof—I don't even know how I'll pay my next bill or buy groceries."
    This isn't about politics for me; it's about survival. The system was already difficult, but now it feels impossible. As I said in my message, "I feel forgotten, invisible, like my dignity doesn't matter." It's deeply distressing to live with this uncertainty, never knowing if I'll have enough to meet even basic needs.
    I implore you to advocate for reversing or amending these changes. Please remember that your decisions directly affect real people—people who just want to live with dignity and stability.
    Thank you for taking the time to understand my situation.
    Respectfully,
    A concerned constituent

    Use the following constituent details:
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
