"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog"
import { MessageCircle } from "lucide-react"
import { FeedbackForm } from "@/components/feedback-form"

export function FeedbackButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="bg-[#ff6b35] text-white hover:bg-[#ff8c5a] hover:text-white text-md cursor-pointer shadow">
          <MessageCircle className="h-4 w-4" />
          Give feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick feedback</DialogTitle>
          <DialogDescription>
            Tell us what worked well and what could be improved. Helps us make the tool better for everyone.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm />
      </DialogContent>
    </Dialog>
  )
}