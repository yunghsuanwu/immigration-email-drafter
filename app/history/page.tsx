"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Trash2 } from "lucide-react"
import { exportData } from "@/lib/export-data"
import { useToast } from "@/hooks/use-toast"

type EmailData = {
  recipient: string
  subject: string
  content: string
  timestamp: string
}

export default function HistoryPage() {
  const [emailHistory, setEmailHistory] = useState<EmailData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, this would fetch from a database
    // For now, we'll get from localStorage
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem("emailHistory")
        if (storedHistory) {
          setEmailHistory(JSON.parse(storedHistory))
        }
      } catch (error) {
        console.error("Error loading history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  const handleExport = async () => {
    try {
      await exportData(emailHistory)
      toast({
        title: "Data exported",
        description: "Email history has been exported as CSV.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all email history? This cannot be undone.")) {
      localStorage.removeItem("emailHistory")
      setEmailHistory([])
      toast({
        title: "History cleared",
        description: "Your email history has been cleared.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">MP Email History</h1>
        <div className="flex justify-center items-center h-64">
          <p>Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">MP Email History</h1>
          <p className="text-muted-foreground">View and manage your previous emails to MPs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={emailHistory.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button variant="destructive" onClick={handleClearHistory} disabled={emailHistory.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </div>
      </div>

      {emailHistory.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground mb-2">No MP emails found</p>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Write to Your MP
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {emailHistory.map((email, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{email.subject}</CardTitle>
                <CardDescription>
                  To: {email.recipient} • {new Date(email.timestamp).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {email.content.split("\n").map((paragraph, idx) => (
                    <p key={idx} className="my-1 text-sm">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
