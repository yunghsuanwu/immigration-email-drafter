"use server"

import { supabase } from "./supabase"
import type { FeedbackData } from "@/types/feedback-data"

export async function saveFeedback(data: FeedbackData): Promise<void> {
  const { error } = await supabase.from("feedback").insert({
    tool_rating: data.tool_rating,
    page_rating: data.page_rating,
    category: data.category || null,
    comments: data.comments || null,
    page: data.page || null,
    user_email: data.userEmail || null,
    user_agent: data.userAgent || null,
  })

  if (error) {
    console.error("Error saving feedback:", error)
    throw new Error("Failed to save feedback")
  }
}