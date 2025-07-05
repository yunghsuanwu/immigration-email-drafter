"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Building } from "lucide-react"
import type { Representative } from "@/types/form-data"
import { getRepresentativesByPostalCode, updateRepresentativesContacted } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface RepresentativeSelectorProps {
  postalCode: string
  submissionId: string
  onComplete: () => void
}

export function RepresentativeSelector({
  postalCode,
  submissionId,
  onComplete,
}: RepresentativeSelectorProps) {
  const [representatives, setRepresentatives] = useState<Representative[]>([])
  const [selectedReps, setSelectedReps] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        const reps = await getRepresentativesByPostalCode(postalCode)
        setRepresentatives(reps)
      } catch {
        toast({
          title: "Error loading representatives",
          description: "Failed to load MPs and councilors for your area.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepresentatives()
  }, [postalCode, toast])

  const handleRepresentativeToggle = (repId: string) => {
    setSelectedReps((prev) => (prev.includes(repId) ? prev.filter((id) => id !== repId) : [...prev, repId]))
  }

  const handleSendEmails = async () => {
    if (selectedReps.length === 0) {
      toast({
        title: "No representatives selected",
        description: "Please select at least one representative to contact.",
      })
      return
    }

    setIsSending(true)
    try {
      const selectedRepEmails = representatives.filter((rep) => selectedReps.includes(rep.id)).map((rep) => rep.email)

      await updateRepresentativesContacted(submissionId, selectedRepEmails)

      toast({
        title: "Email prepared successfully",
        description: `Your email is ready to be sent to ${selectedReps.length} representative(s).`,
      })

      onComplete()
    } catch {
      toast({
        title: "Error preparing emails",
        description: "Failed to prepare emails. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <p>Loading representatives for {postalCode}...</p>
        </CardContent>
      </Card>
    )
  }

  if (representatives.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Representatives Found</CardTitle>
          <CardDescription>
            We couldn&apos;t find any MPs or councilors for postal code {postalCode}. Please check your postal code or
            contact us to add representatives for your area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onComplete} variant="outline">
            Continue Anyway
          </Button>
        </CardContent>
      </Card>
    )
  }

  const mps = representatives.filter((rep) => rep.representative_type === "MP")
  const councilors = representatives.filter((rep) => rep.representative_type === "Councilor")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Representatives to Contact</CardTitle>
          <CardDescription>
            Choose which MPs and local councilors you&apos;d like to send your email to for postal code {postalCode}.
          </CardDescription>
        </CardHeader>
      </Card>

      {mps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Members of Parliament
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mps.map((rep) => (
              <div key={rep.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={rep.id}
                  checked={selectedReps.includes(rep.id)}
                  onCheckedChange={() => handleRepresentativeToggle(rep.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor={rep.id} className="font-medium cursor-pointer">
                      {rep.name}
                    </label>
                    {rep.party && <Badge variant="secondary">{rep.party}</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {rep.email}
                    </div>
                    {rep.constituency && (
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {rep.constituency}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {councilors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Local Councilors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {councilors.map((rep) => (
              <div key={rep.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={rep.id}
                  checked={selectedReps.includes(rep.id)}
                  onCheckedChange={() => handleRepresentativeToggle(rep.id)}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label htmlFor={rep.id} className="font-medium cursor-pointer">
                      {rep.name}
                    </label>
                    {rep.party && <Badge variant="secondary">{rep.party}</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {rep.email}
                    </div>
                    {rep.constituency && (
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {rep.constituency}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{selectedReps.length} representative(s) selected</p>
        <Button onClick={handleSendEmails} disabled={isSending || selectedReps.length === 0}>
          {isSending ? "Preparing..." : `Prepare Email${selectedReps.length > 1 ? "s" : ""}`}
        </Button>
      </div>
    </div>
  )
}
