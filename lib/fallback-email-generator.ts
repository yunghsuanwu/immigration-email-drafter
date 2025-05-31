import type { FormData } from "@/types/form-data"

export function generateFallbackEmail(data: FormData): string {
  const greeting = "Dear [MP Name],"

  const introduction = `I am writing to you as your constituent from ${data.postalCode}, ${data.constituentName}, to express my concerns about the recent immigration white paper and its potential impact on myself and the community.`

  const personalDetails = `
As a ${data.age}-year-old ${data.residentialStatus === "permanent-resident" ? "permanent resident" : "visa holder"} ${data.yearsInUK ? `who has lived in the UK for ${data.yearsInUK} years` : ""}, I am deeply concerned about the proposed changes. ${data.profession ? `I work as a ${data.profession}` : "I am employed"} and earn ${data.yearlyIncome} annually${data.annualTaxContribution ? `, contributing approximately £${data.annualTaxContribution} in taxes each year` : ""}.`

  const visaSection =
    data.residentialStatus === "visa-holder" && data.visaSituation
      ? `\n\nRegarding my visa situation: ${data.visaType ? `I hold a ${data.visaType}. ` : ""}${data.visaSituation} The proposed changes in the white paper could significantly affect my ability to remain in the UK and continue contributing to the economy and society.`
      : ""

  const concerns = `\n\nMy specific concerns about the immigration white paper are:\n\n${data.immigrationConcerns}`

  const request = `\n\nI would be grateful if you could:\n- Raise these concerns in Parliament\n- Advocate for policies that recognize the contributions of immigrants like myself\n- Ensure that any changes are fair and consider the human impact\n- Provide clarity on how these changes will be implemented`

  const closing = `\n\nI would very much appreciate your response on this matter and would welcome the opportunity to discuss this further if needed.\n\nThank you for your time and consideration.\n\nYours sincerely,\n${data.constituentName}`

  return `${greeting}\n\n${introduction}\n\n${personalDetails}${visaSection}${concerns}${request}${closing}`
}
