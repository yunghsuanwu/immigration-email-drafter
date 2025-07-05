"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface EmailEditorProps {
  initialContent: string
  onChange: (content: string) => void
  recipient: string
  subject: string
}

export function EmailEditor({ initialContent, onChange, recipient, subject }: EmailEditorProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    onChange(content)
  }, [content, onChange])

  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <div className="text-sm">
            <span className="font-semibold">To:</span> {recipient}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Subject:</span> {subject}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[300px] font-sans" />
      </CardContent>
    </Card>
  )
}
