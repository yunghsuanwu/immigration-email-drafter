import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface EmailPreviewProps {
  recipient: string
  subject: string
  content: string
}

export function EmailPreview({ recipient, subject, content }: EmailPreviewProps) {
  return (
    <Card className="border-dashed">
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
        <div className="prose max-w-none">
          {content.split("\n").map((paragraph, index) => (
            <p key={index} className="my-2">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
