"use client"

import { useState } from "react"
import { Check, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type EmailTemplate, emailTemplates } from "@/lib/email-templates"

interface TemplateSelectorProps {
  onSelectTemplate: (template: EmailTemplate) => void
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
  }

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      setIsDialogOpen(false)
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Choose a Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select an Email Template</DialogTitle>
          <DialogDescription>Choose a template to quickly start your email draft</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 gap-4">
            {emailTemplates.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id ? "border-primary" : "hover:border-primary/50"
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {selectedTemplate?.id === template.id && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm">
                    <span className="font-semibold">Subject:</span> {template.subject}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Tone:</span> {template.tone}
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <Info className="h-4 w-4 mr-1" /> Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                        <DialogDescription>{template.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Subject</h4>
                          <p className="text-sm text-muted-foreground">{template.subject}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Purpose</h4>
                          <p className="text-sm text-muted-foreground">{template.purpose}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Tone</h4>
                          <p className="text-sm text-muted-foreground">{template.tone}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Key Points</h4>
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">{template.keyPoints}</pre>
                        </div>
                        <div>
                          <h4 className="font-medium">Additional Info</h4>
                          <p className="text-sm text-muted-foreground">{template.additionalInfo}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirmTemplate} disabled={!selectedTemplate}>
            Use Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
