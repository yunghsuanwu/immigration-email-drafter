export type FeedbackData = {
  tool_rating: number
  page_rating: number
  category: "Bug" | "User experience" | "Page" | "Idea" | "Other"
  comments: string
  userEmail?: string
  page: string
  userAgent: string
}