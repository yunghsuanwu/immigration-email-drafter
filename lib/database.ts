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
    // By default, it saves postal code, residency status, and the reason for writing
    submission_id: submissionId,
    postal_code: data.postalCode,
    residency_status: data.residentialStatus,
    visa_type: data.visaType || null,
    other_status: data.residentialStatusOther || null,
    opted_in_data: data.optInDataCollection,
    opted_in_updates: data.optInUpdates,
    writing_for: data.whyWriting,
    // MP info will be saved
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
    // Email data is now handled separately in the email_subscriptions table
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
    // Email data is now handled separately in the email_subscriptions table
  }

  // Save to different table for employers
  const tableName = data.whyWriting === "employer" ? "employer_submissions" : "user_submissions";
  const { error: submissionError } = await supabase.from(tableName).insert(submissionData)

  if (submissionError) {
    console.error("Error saving submission:", submissionError)
    throw new Error("Failed to save submission")
  }

  // Save email subscription if user opted in
  if (data.optInUpdates && data.constituentEmail) {
    const emailSubscriptionData = {
      submission_id: submissionId,
      constituent_email: data.constituentEmail,
      opted_in_updates: true,
      writing_for: data.whyWriting
    }

    const { error: emailError } = await supabase.from('email_subscriptions').insert(emailSubscriptionData)

    if (emailError) {
      console.error("Error saving email subscription:", emailError)
      // Don't throw error here as the main submission was successful
      // But you might want to log this for monitoring
    }
  }

  return submissionId
}
