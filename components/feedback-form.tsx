"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type FeedbackValues = {
  tool_rating: number
  page_rating: number
  category: "Bug" | "User experience" | "Page" | "Idea" | "Other"
  comments: string
  userEmail?: string
  page: string
  userAgent: string
}

export function FeedbackForm({ onSubmitted }: { onSubmitted?: () => void}) {
  const form = useForm<FeedbackValues>({
    defaultValues: {
      tool_rating: 3,
      page_rating: 3,
      category: "Idea",
      comments: "",
      userEmail: "",
      page: "",
      userAgent: navigator.userAgent,
    },
  })

  const categoryOptions = [
    { value: "Idea", label: "Ideas for improvement."},
    { value: "Bug", label: "There is a bug with the tool."},
    { value: "User experience", label: "Something is confusing."},
    { value: "Page", label: "The page text needs clarification or edits."},
    { value: "Other", label: "I have other comments."}
  ]
  
  useEffect(() => {
    form.setValue("page", typeof window !== "undefined" ? window.location.pathname : "")
    form.setValue("userAgent", typeof navigator !== "undefined" ? navigator.userAgent : "")
  }, [form])

  const onSubmit = (values: FeedbackValues) => {
    console.log("feedback submit", values)
    onSubmitted?.()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Tool rating*/}
        <FormField
          name="tool_rating"
          control={form.control}
          rules={{ required: "Please select a rating" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>How useful do you find <strong>this tool</strong>?</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">(Not useful)</span>
                  {[1,2,3,4,5].map((n) => (
                    <label key={n} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        value={n}
                        checked={Number(field.value) === n}
                        onChange={() => field.onChange(n)}
                      />
                      {n}
                    </label>
                  ))}
                  <span className="text-xs text-muted-foreground">(Useful)</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Page rating */}
        <FormField
          name="page_rating"
          control={form.control}
          rules={{ required: "Please select a rating" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>How helpful do you find <strong>this page</strong>?</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">(Not helpful)</span>
                  {[1,2,3,4,5].map((n) => (
                    <label key={n} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        value={n}
                        checked={Number(field.value) === n}
                        onChange={() => field.onChange(n)}
                      />
                      {n}
                    </label>
                  ))}
                  <span className="text-xs text-muted-foreground">(Helpful)</span>
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField 
          name="category"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment category (optional)</FormLabel>
              <FormControl>
                <select className="w-full p-2 border rounded-md text-sm" {...field}>
                  <option value="" disabled>Select a category</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Comment */}
        <FormField 
          name="comments"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments (optional)</FormLabel>
              <FormControl>
                <Textarea className="min-h-[100px] text-gray-400 italic" placeholder="Tell us more..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" variant="default" className="bg-[#ff6b35] text-white hover:bg-[#ff8c5a] cursor-pointer">Submit feedback</Button>
        </div>
      </form>
    </Form>
  )
}