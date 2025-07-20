"use server"

import { supabase } from "./supabase"
import type { FormData, Representative } from "@/types/form-data"

export async function saveUserSubmission(data: FormData): Promise<string> {
  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const submissionData = {
    submission_id: submissionId,
    postal_code: data.postalCode,
    residency_status: data.residentialStatus,
    visa_type: data.visaType || null,
    other_status: data.residentialStatusOther || null,
    opted_in: data.optInDataCollection,
    // Only include additional data if user opted in
    ...(data.optInDataCollection && {
      yearly_income: data.yearlyIncome,
      profession: data.profession || null,
      annual_tax_contribution: data.annualTaxContribution || null,
      years_in_uk: data.yearsInUK || null,
      immigration_concerns: data.immigrationConcerns,
    }),
  }

  const { error } = await supabase.from("user_submissions").insert(submissionData)

  if (error) {
    console.error("Error saving submission:", error)
    throw new Error("Failed to save submission")
  }

  return submissionId
}
