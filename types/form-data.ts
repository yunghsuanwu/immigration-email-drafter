export type FormData = {
  postalCode: string
  constituentName: string
  constituentEmail: string
  whyWriting: "visa-employee" | "employer" | "other-reasons"
  residentialStatus: "uk-national" | "visa-holder" | "other-status" | "indefinite-leave-to-remain" | "settled-status"
  residentialStatusOther?: string
  visaType?: string
  yearsInUK?: string
  yearlyIncome?: string
  profession?: string
  SOC?: string
  annualTaxContribution?: string
  // Employer-specific fields
  industry?: string
  companySize?: string
  yearlyRevenue?: string
  currentOverseasEmployees?: string
  plannedOverseasHires?: string
  immigrationConcerns: string
  optInDataCollection: boolean
  optInUpdates: boolean
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
  "High Potential Individual visa",
  "Other",
]

export const industryTypes = [
  "Technology & Software",
  "Financial Services",
  "Healthcare & Pharmaceuticals",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Consulting & Professional Services",
  "Media & Entertainment",
  "Transportation & Logistics",
  "Construction & Real Estate",
  "Energy & Utilities",
  "Food & Beverage",
  "Hospitality & Tourism",
  "Non-profit & Charities",
  "Government & Public Sector",
  "Other",
]

export const revenueBrackets = [
  "Less than £100,000",
  "£100,000 - £500,000",
  "£500,001 - £1,000,000",
  "£1,000,001 - £5,000,000",
  "£5,000,001 - £10,000,000",
  "£10,000,001 - £50,000,000",
  "£50,000,001 - £100,000,000",
  "£100,000,001 or more",
]

export const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-1000 employees",
  "1000+ employees",
]
