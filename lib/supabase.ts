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
          visa_situation: string | null
          opted_in: boolean
          age: string | null
          writing_for: string | null
          yearly_income: string | null
          profession: string | null
          annual_tax_contribution: string | null
          years_in_uk: string | null
          immigration_concerns: string | null
          email_content: string | null
          representatives_contacted: string[] | null
          created_at: string
        }
        Insert: {
          submission_id: string
          postal_code: string
          residency_status: string
          visa_type?: string | null
          visa_situation?: string | null
          opted_in?: boolean
          age?: string | null
          writing_for?: string | null
          yearly_income?: string | null
          profession?: string | null
          annual_tax_contribution?: string | null
          years_in_uk?: string | null
          immigration_concerns?: string | null
          email_content?: string | null
          representatives_contacted?: string[] | null
        }
        Update: {
          submission_id?: string
          postal_code?: string
          residency_status?: string
          visa_type?: string | null
          visa_situation?: string | null
          opted_in?: boolean
          age?: string | null
          writing_for?: string | null
          yearly_income?: string | null
          profession?: string | null
          annual_tax_contribution?: string | null
          years_in_uk?: string | null
          immigration_concerns?: string | null
          email_content?: string | null
          representatives_contacted?: string[] | null
        }
      }
      postal_code_representatives: {
        Row: {
          id: string
          postal_code: string
          representative_type: string
          name: string
          email: string
          party: string | null
          constituency: string | null
          created_at: string
        }
        Insert: {
          postal_code: string
          representative_type: string
          name: string
          email: string
          party?: string | null
          constituency?: string | null
        }
        Update: {
          postal_code?: string
          representative_type?: string
          name?: string
          email?: string
          party?: string | null
          constituency?: string | null
        }
      }
    }
  }
}
