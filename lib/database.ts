"use server"

import { supabase } from "./supabase"
import type { FormData } from "@/types/form-data"

type MPInfo = {
  nameFullTitle?: string
  nameAddressAs?: string
  partyName?: string
  membershipFrom?: string
  email?: string | null
  phone?: string
  memberID?: string | number | null
}

export async function saveUserSubmission(data: FormData, mpInfo?: MPInfo): Promise<string> {
  const submissionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  let submissionData: Record<string, unknown> = {
    submission_id: submissionId,
    postal_code: data.postalCode,
    residency_status: data.residentialStatus,
    visa_type: data.visaType || null,
    other_status: data.residentialStatusOther || null,
    opted_in: data.optInDataCollection,
    mp_name: mpInfo?.nameFullTitle || null,
    mp_address_as: mpInfo?.nameAddressAs || null,
    mp_party: mpInfo?.partyName || null,
    mp_constituency: mpInfo?.membershipFrom || null,
    mp_email: mpInfo?.email || null,
    mp_phone: mpInfo?.phone || null,
    mp_member_id: mpInfo?.memberID || null,
  };

  if (data.whyWriting === "employer") {
    // Only include employer-specific fields if opted in
    if (data.optInDataCollection) {
      submissionData = {
        ...submissionData,
        industry: data.industry || null,
        company_size: data.companySize || null,
        yearly_revenue: data.yearlyRevenue || null,
        current_overseas_employees: data.currentOverseasEmployees || null,
        planned_overseas_hires: data.plannedOverseasHires || null,
        immigration_concerns: data.immigrationConcerns,
      };
    }
  } else {
    // Only include non-employer additional fields if opted in
    if (data.optInDataCollection) {
      submissionData = {
        ...submissionData,
        yearly_income: data.yearlyIncome,
        profession: data.profession || null,
        annual_tax_contribution: data.annualTaxContribution || null,
        years_in_uk: data.yearsInUK || null,
        immigration_concerns: data.immigrationConcerns,
      };
    }
  }

  // Save to different table for employers
  const tableName = data.whyWriting === "employer" ? "employer_submissions" : "user_submissions";
  const { error } = await supabase.from(tableName).insert(submissionData)

  if (error) {
    console.error("Error saving submission:", error)
    throw new Error("Failed to save submission")
  }

  return submissionId
}
