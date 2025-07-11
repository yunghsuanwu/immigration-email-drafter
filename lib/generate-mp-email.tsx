"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { FormData } from "@/types/form-data"

export async function generateMPEmail(data: FormData): Promise<string> {
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured")
  }

  const details: string[] = [
    `- Name: ${data.constituentName}`
  ];

  // Handle residential status with all possible cases
  if (data.residentialStatus === "uk-national") {
    details.push(`- Residential Status: UK national/resident`);
  } else if (data.residentialStatus === "visa-holder") {
    let visaLine = `- Residential Status: Visa holder`;
    if (data.visaType) visaLine += ` (${data.visaType})`;
    details.push(visaLine);
  } else if (data.residentialStatus === "other-status") {
    let otherLine = `- Residential Status: Other`;
    if (data.residentialStatusOther) otherLine += ` (${data.residentialStatusOther})`;
    details.push(otherLine);
  }

  if (data.yearlyIncome) details.push(`- Yearly Income: ${data.yearlyIncome}`);
  if (data.profession) details.push(`- Profession: ${data.profession}`);
  if (data.annualTaxContribution) details.push(`- Annual Tax Contribution: £${data.annualTaxContribution}`);
  if (data.yearsInUK) details.push(`- Years in UK: ${data.yearsInUK}`);
  if (data.SOC) details.push(`- SOC: ${data.SOC}`);

  const prompt = `
    You are helping people with lived experience of the UK immigration system--or know someone who does--write a letter to their Member of Parliament to explain the impact of the 2025 immigration rule change on them.  

    You are writing on behalf of someone who has filled in a form about their residency status and socioeconomic situation, whose data will be shared with you.
    Your job is to write a professional and compelling email to the MP from the constituent; make the writing style original so it does not read like an AI.

    This is a good example:
    Subject: Urgent Concern: Impact of Recent Immigration Rule Change on My Life
    Dear [MP's Name],
    I hope this email finds you well. My name is Harry Paulson, and I am writing to you not only as a concerned constituent but also as a dedicated contributor to our community here in the UK. I have been residing in the UK for the past 3.5 years, during which I have worked diligently as a architect assistant, earning an annual income between £20,001 and £30,000. I take pride in my profession and actively contribute to the economy through an annual tax contribution of £4,564.
    My primary concern stems from rapid changes in the field may threaten my job security. If the proposed immigration rule change makes securing new visa-sponsoring employment more difficult, I risk deportation despite having built a life here and contributed both economically and socially to the community.
    Throughout my time in the UK, I have actively engaged with the local community, using my skills to entertain and bring joy to many while supporting local businesses and cultural events. I am eager to continue contributing to the UK's vibrant society, but the proposed immigration changes create uncertainty that puts both my future and contributions at risk.
    I urge you to consider the impact these policy changes may have on individuals like myself who are committed to positive contributions. I request that you advocate for a more flexible and inclusive immigration framework that acknowledges the diverse skills of non-citizen residents and provides reasonable pathways to secure alternative employment without deportation threats for those vulnerable to technological displacement.
    Respectfully,
    Harry Paulson

    Use the following constituent details:
    ${details.join('\n')}
    
    Immigration Concerns:
    ${data.immigrationConcerns}

    You must:
    – Write in standard British English regardless of the input language; translate if necessary. 
    - Highlight the economic contribution the constituent has made to the UK, if any.
    – Highlight the social contribution the constituent has made to the UK, if any.
    - Highlight the particular concerns of the constituent.
    – Focus on concrete impacts and refrain from making generic statements. 
    - Write in first person as the affected constituent and preserve their own voice.
    - Do not include any harmful languages such as swear words or discriminatory remarks that are anti-immigrant, racist, sexist, transphobic, or hate-filled.
    – Do not use bullet points; write in structured clear paragraphs.
    – Do not be overly verbose or use obscure vocabularies.
    - Give a personalized subject line.
    – Start with a greeting, e.g., "Dear [MP's title and name]".
    - End with a respectful sign-off.
    – Check for grammar and typos; make sure the text follows standard British English.
    – End with a polite closing requesting a response.
    – The email should be approximately 300-500 words.
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
