import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_submissions: {
        Row: {
          id: string
          submission_id: string
          postal_code: string
          residency_status: string
          visa_type: string | null
          other_status: string | null
          opted_in: boolean
          writing_for: string
          yearly_income?: string | null
          profession?: string | null
          annual_tax_contribution?: string | null
          years_in_uk?: string | null
          immigration_concerns?: string | null
          mp_name?: string | null
          mp_address_as?: string | null
          mp_party?: string | null
          mp_constituency?: string | null
          mp_email?: string | null
          mp_phone?: string | null
          mp_member_id?: string | number | null
          created_at: string
        }
        Insert: {
          submission_id: string
          postal_code: string
          residency_status: string
          visa_type?: string | null
          other_status?: string | null
          opted_in?: boolean
          writing_for?: string
          yearly_income?: string | null
          profession?: string | null
          annual_tax_contribution?: string | null
          years_in_uk?: string | null
          immigration_concerns?: string | null
          mp_name?: string | null
          mp_address_as?: string | null
          mp_party?: string | null
          mp_constituency?: string | null
          mp_email?: string | null
          mp_phone?: string | null
          mp_member_id?: string | number | null
        }
        Update: {
          submission_id?: string
          postal_code?: string
          residency_status?: string
          visa_type?: string | null
          other_status?: string | null
          opted_in?: boolean
          writing_for?: string
          yearly_income?: string | null
          profession?: string | null
          annual_tax_contribution?: string | null
          years_in_uk?: string | null
          immigration_concerns?: string | null
          mp_name?: string | null
          mp_address_as?: string | null
          mp_party?: string | null
          mp_constituency?: string | null
          mp_email?: string | null
          mp_phone?: string | null
          mp_member_id?: string | number | null
        }
      },
      employer_submissions: {
        Row: {
          id: string
          submission_id: string
          postal_code: string
          residency_status: string
          visa_type: string | null
          other_status: string | null
          opted_in: boolean
          writing_for: string
          industry?: string | null
          company_size?: string | null
          yearly_revenue?: string | null
          current_overseas_employees?: string | null
          planned_overseas_hires?: string | null
          immigration_concerns?: string | null
          mp_name?: string | null
          mp_address_as?: string | null
          mp_party?: string | null
          mp_constituency?: string | null
          mp_email?: string | null
          mp_phone?: string | null
          mp_member_id?: string | number | null
          created_at: string
        }
        Insert: {
          submission_id: string
          postal_code: string
          residency_status: string
          visa_type?: string | null
          other_status?: string | null
          opted_in?: boolean
          writing_for?: string
          industry?: string | null
          company_size?: string | null
          yearly_revenue?: string | null
          current_overseas_employees?: string | null
          planned_overseas_hires?: string | null
          immigration_concerns?: string | null
          mp_name?: string | null
          mp_address_as?: string | null
          mp_party?: string | null
          mp_constituency?: string | null
          mp_email?: string | null
          mp_phone?: string | null
          mp_member_id?: string | number | null
        }
        Update: {
          submission_id?: string
          postal_code?: string
          residency_status?: string
          visa_type?: string | null
          other_status?: string | null
          opted_in?: boolean
          writing_for?: string
          industry?: string | null
          company_size?: string | null
          yearly_revenue?: string | null
          current_overseas_employees?: string | null
          planned_overseas_hires?: string | null
          immigration_concerns?: string | null
          mp_name?: string | null
          mp_address_as?: string | null
          mp_party?: string | null
          mp_constituency?: string | null
          mp_email?: string | null
          mp_phone?: string | null
          mp_member_id?: string | number | null
        }
      },
    }
  }
}
