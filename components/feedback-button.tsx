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

export function FeedbackButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-[#ff8c5a] cursor-pointer">
          <MessageCircle className="mr-2 h-4 w-4" />
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
      </DialogContent>
    </Dialog>
  )
}