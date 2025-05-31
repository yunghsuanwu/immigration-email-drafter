"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function DebugPanel() {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null)

  const checkApiKey = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/validate-key")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        valid: false,
        error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-sm">API Configuration Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Button onClick={checkApiKey} disabled={isChecking} size="sm" variant="outline">
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Test API Key"
            )}
          </Button>
        </div>

        {result && (
          <Alert variant={result.valid ? "default" : "destructive"}>
            {result.valid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertDescription>
              {result.valid ? "API key is valid and working correctly" : `API key issue: ${result.error}`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
