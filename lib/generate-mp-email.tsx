"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { FormData } from "@/types/form-data"

export async function generateMPEmail(data: FormData, mpInfo?: {
  nameFullTitle?: string
  nameAddressAs?: string
  partyName?: string
  membershipFrom?: string
  email?: string | null
  phone?: string
  memberID?: string | number | null
}): Promise<string> {
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured")
  }

  const details: string[] = [
    `- Name: ${data.constituentName}`
  ];

  // Handle residential status with all possible cases
  if (data.residentialStatus === "uk-national") {
    details.push(`- Residential Status: UK national`);
  } else if (data.residentialStatus === "visa-holder") {
    let visaLine = `- Residential Status: Visa holder`;
    if (data.visaType) visaLine += ` (${data.visaType})`;
    details.push(visaLine);
  } else if (data.residentialStatus === "indefinite-leave-to-remain") {
    let visaLine = `- Residential Status: Indefinite leave to remain (ILR)`;
    details.push(visaLine)
  } else if (data.residentialStatus === "settled-status") {
    let visaLine = `- Residential Status: Settled status under the EU Settlement Scheme`
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

  // Use MP name and constituency if available
  const mpName = mpInfo?.nameAddressAs || "[MP's Name]";
  const constituency = mpInfo?.membershipFrom || "[Constituency]"

  const prompt = `
    You are helping people with lived experience of the UK immigration system--or know someone who does--write a letter to their Member of Parliament to explain the impact of the 2025 immigration rule change on them.  

    You are writing on behalf of someone who has filled in a form about their residency status and socioeconomic situation, whose data will be shared with you.
    Your job is to write a professional and compelling email to the MP from the constituent; make the writing style original so it does not read like an AI.

    This is a good example:
    Subject: Urgent Concern: Impact of Recent Immigration Rule Change on My Life
    Dear ${mpName},
    Good afternoon, I hope this message finds you well.
    I am writing to you as a resident of ${constituency}. I am directly impacted by the newly released immigration white paper, “Restoring Control Over the Immigration System” (https://www.gov.uk/government/publications/restoring-control-over-the-immigration-system-white-paper), and I feel deeply anxious about its implications for those of us living and contributing here under the Skilled Worker route.
    I have lived in the UK since XXXX as a Skilled Worker. I currently work as a [Job Title] at a [Industry] company based in [City], and have made long-term financial commitments in the UK—from publicly traded ISAs to investments in the national economy. More importantly, I’ve built strong personal and professional ties and have actively participated in community initiatives that promote well-being and integration.
    The white paper proposes sweeping changes, including an increase from 5 years to 10 years for settlement eligibility, yet it does not clearly state whether these will be applied retroactively to individuals already in the system. While the technical annex suggests that the increase in the settlement qualifying period to ten years may apply to “those currently in the UK,” it remains unclear whether this will be fully retroactive or include transitional protections. This ambiguity is causing significant anxiety for many of us who made life decisions based on the rules in place when we arrived.
    If these reforms were to apply to people already on the Skilled Worker route, it would be incredibly disheartening. Many of us have built our lives here based on a clear and stable pathway to settlement, contributing to the UK both professionally and personally. Changing the rules mid-way would create great uncertainty for individuals and families who have made long-term commitments to this country.
    I kindly ask you to raise this issue in Parliament and to advocate for a fair and considered approach—one that recognises the contributions of those already living and working here under the current system. I remain committed to building a future in the UK and have great faith in the Labour government’s values of fairness and inclusion. I believe your voice on this matter could help ensure that skilled workers continue to feel welcome, secure, and valued.
    Thank you for your time and consideration.
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
    – Start with a greeting, e.g., "Dear ${mpName}".
    - End with a respectful sign-off.
    – Check for grammar and typos; make sure the text follows standard British English.
    – End with a polite closing requesting a response.
    – The email should be approximately 300-500 words.
  `
  
  const prompt_employer = `
    You are helping employers currently or considering hiring overseas workers in the UK to write a letter to their Member of Parliament to explain the impact of the 2025 immigration rule change on them.  

    You are writing on behalf of someone who has filled in a form about information about their company and their dependency on overseas workers that need visas. The data will be shared with you.
    Your job is to write a professional and compelling email to the MP from the constituent; make the writing style original so it does not read like an AI.

    This is a good example:
    Subject: Urgent Concern: Impact of Recent Immigration Rule Change on My Company and Employees
    Dear ${mpName},
    I am writing to express my serious concerns about recent immigration policy changes that are severely impacting the care sector and the vulnerable people who depend on these essential services.
    The immigration policy changes in recent years, including the ban on care workers bringing their families to the UK and the end to overseas recruitment for care workers, are creating a crisis within our care sector. These draconian measures are counterproductive, and the Government needs to reform immigration rules rather than make them more restrictive. The evidence supports this view as these policies are not solving the workforce crisis but exacerbating it.
    These policy changes have created insurmountable challenges for care providers. Care employers can no longer access the international workforce that has been essential to filling critical staffing gaps, leading to increased costs and service disruption. Many care homes and domiciliary care services are struggling to maintain adequate staffing levels, directly impacting service quality. The complete end of overseas recruitment scheduled for 22 July 2025 threatens the sustainability of many care businesses already facing chronic understaffing.
    Perhaps most concerning is the human cost of these policies. The ban on family reunification for care workers is creating profound hardship, forcing workers to choose between their livelihoods and their families. The stress of family separation significantly affects workers' wellbeing and their ability to provide quality care. This policy essentially treats care workers as second-class migrants, despite their essential contribution to our society, and makes them more vulnerable to exploitation by unscrupulous employers.
    The reality is that foreign workers are absolutely essential to our care sector. Our aging population requires significantly more care workers than the domestic workforce can provide. The care sector has relied on international recruitment for decades because domestic recruitment has never met demand. These workers bring valuable experience, pay taxes, contribute to the economy, and enable British families to participate in the workforce by caring for their elderly relatives.
    I urge you to advocate for the reversal of the family separation ban for care workers, oppose the decision to end overseas recruitment in July 2025, and push for increased funding and pay improvements to make domestic recruitment more viable. The people who need care deserve better than policies that prioritize political messaging over practical solutions.
    I look forward to your response and to hearing how you will advocate for sensible immigration policies that support our care sector.
    Respectfully,
    [Constitutent Name]

    Use the following constituent details:
    ${details.join('\n')}
    
    Immigration Concerns:
    ${data.immigrationConcerns}

    You must:
    – Write in standard British English regardless of the input language; translate if necessary. 
    – Focus on specific business impacts like hiring delays, skill shortages, or project timelines.
    - Highlight any economic impact to the company and industry the immigration rule change is going to cause the UK.
    - Highlight the particular concerns of the constituent.
    - Write in first person as the affected constituent and preserve their own voice.
    - Do not include any harmful languages such as swear words or discriminatory remarks that are anti-immigrant, racist, sexist, transphobic, or hate-filled.
    – Do not use bullet points; write in structured clear paragraphs.
    – Do not be overly verbose or use obscure vocabularies.
    - Give a personalized subject line.
    – Start with a greeting, e.g., "Dear ${mpName}".
    - End with a respectful sign-off.
    – Check for grammar and typos; make sure the text follows standard British English.
    – End with a polite closing requesting a response.
    – The email should be approximately 300-500 words.
  `
  const promptToUse = data.whyWriting === "employer" ? prompt_employer : prompt;

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: promptToUse,
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
