"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface EmailEditorProps {
  initialContent: string
  onChange: (content: string) => void
}

export function EmailEditor({ initialContent, onChange }: EmailEditorProps) {
  const [content, setContent] = useState(initialContent)

  useEffect(() => {
    onChange(content)
  }, [content, onChange])

  return (
    <Card className="border-0">
      <CardContent>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[300px] font-sans" />
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Reminders:</h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground">
            <li>Include your <strong>full name</strong> and <strong>postal code</strong>. MPs only respond to their constituents.</li>
            <li>Include your <strong>contact information</strong> (phone or email).</li>
            <li>Be concise and clear.</li>
            <li>Check for spelling and grammar.</li>
            <li>Include a call to action if needed.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
