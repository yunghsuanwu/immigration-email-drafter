export type FormData = {
  postalCode: string
  constituentName: string
  constituentEmail: string
  writingFor: "myself" | "someone-else"
  age: string
  residentialStatus: "permanent-resident" | "visa-holder"
  visaType?: string
  visaSituation?: string
  yearlyIncome: string
  profession?: string
  annualTaxContribution?: string
  yearsInUK?: string
  immigrationConcerns: string
  optInDataCollection: boolean
}

export const salaryBrackets = [
  "Less than £10,000",
  "£10,000 - £20,000",
  "£20,001 - £30,000",
  "£30,001 - £40,000",
  "£40,001 - £50,000",
  "£50,001 - £60,000",
  "£60,001 - £70,000",
  "£70,001 - £80,000",
  "£80,001 - £90,000",
  "£90,001 - £100,000",
  "£100,001 or more",
]

export const visaTypes = [
  "Student visa",
  "Work visa (Skilled Worker)",
  "Work visa (Global Talent)",
  "Work visa (Health and Care Worker)",
  "Family visa (Spouse/Partner)",
  "Family visa (Child)",
  "Visitor visa",
  "Transit visa",
  "Settlement visa",
  "Ancestry visa",
  "Youth Mobility Scheme",
  "Start-up visa",
  "Innovator visa",
  "Investor visa",
  "Other",
]

export type Representative = {
  id: string
  name: string
  email: string
  representative_type: "MP" | "Councilor"
  party?: string
  constituency?: string
}
