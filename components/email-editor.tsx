"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
      </CardContent>
    </Card>
  )
}
