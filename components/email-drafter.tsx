"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Send, Download, Edit, ArrowRight, Info, Shield } from "lucide-react"
import { EmailEditor } from "@/components/email-editor"
import { EmailPreview } from "@/components/email-preview"
import { RepresentativeSelector } from "@/components/representative-selector"
import { generateMPEmail } from "@/lib/generate-mp-email"
import { saveUserSubmission } from "@/lib/database"
import { exportData } from "@/lib/export-data"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import type { FormData, salaryBrackets, visaTypes } from "@/types/form-data"

type EmailData = {
  recipient: string
  subject: string
  content: string
  timestamp: string
}

const salaryBracketOptions: salaryBrackets = [
  "Less than £10,000",
  "£10,000 - £20,000",
  "£20,001 - £30,000",
  "£30,001 - £40,000",
  "£40,001 - £50,000",
  "£50,001 - £60,000",
  "£60,001 - £70,000",
  "£70,001 - £80,000",
  "£80,001 - £90,000",
  "£90,001 - £100,000",
  "£100,001 or more",
]

const visaTypeOptions: visaTypes = [
  "Student visa",
  "Work visa (Skilled Worker)",
  "Work visa (Global Talent)",
  "Work visa (Health and Care Worker)",
  "Family visa (Spouse/Partner)",
  "Family visa (Child)",
  "Visitor visa",
  "Transit visa",
  "Settlement visa",
  "Ancestry visa",
  "Youth Mobility Scheme",
  "Start-up visa",
  "Innovator visa",
  "Investor visa",
  "Other",
]

export function EmailDrafter() {
  const [activeTab, setActiveTab] = useState("input")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [submissionId, setSubmissionId] = useState("")
  const [emailHistory, setEmailHistory] = useState<EmailData[]>([])
  const { toast } = useToast()
  const isMobile = useMobile()

  const form = useForm<FormData>({
    defaultValues: {
      postalCode: "",
      constituentName: "",
      constituentEmail: "",
      writingFor: "myself",
      age: "",
      residentialStatus: "permanent-resident",
      visaType: "",
      visaSituation: "",
      yearlyIncome: "",
      profession: "",
      annualTaxContribution: "",
      yearsInUK: "",
      immigrationConcerns: "",
      optInDataCollection: false,
    },
  })

  const watchWritingFor = form.watch("writingFor")
  const watchResidentialStatus = form.watch("residentialStatus")
  const watchOptIn = form.watch("optInDataCollection")

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true)
    try {
      let email: string
      try {
        // Try to generate with AI first
        email = await generateMPEmail(data)
      } catch (aiError) {
        console.warn("AI generation failed, using fallback:", aiError)
        // Import the fallback generator
        const { generateFallbackEmail } = await import("@/lib/fallback-email-generator")
        email = generateFallbackEmail(data)

        toast({
          title: "Email generated (fallback mode)",
          description: "AI generation failed, but we've created a template email for you to customize.",
          variant: "default",
        })
      }

      setGeneratedEmail(email)
      setEditedEmail(email)
      setActiveTab("preview")

      if (!email.includes("template email")) {
        toast({
          title: "Email generated",
          description: "Your email to your MP has been generated successfully.",
        })
      }
    } catch (error) {
      console.error("Email generation error:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEdit = () => {
    setActiveTab("edit")
  }

  const handleSaveAndContinue = async () => {
    setIsSending(true)
    try {
      const formData = form.getValues()
      const submissionIdGenerated = await saveUserSubmission(formData, editedEmail)
      setSubmissionId(submissionIdGenerated)

      toast({
        title: "Data saved",
        description: "Your information has been saved. Now select representatives to contact.",
      })

      setActiveTab("representatives")
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleComplete = () => {
    const emailData: EmailData = {
      recipient: "Selected Representatives",
      subject: "Concerns about the Immigration White Paper",
      content: editedEmail,
      timestamp: new Date().toISOString(),
    }

    // Save to localStorage for history
    try {
      const existingHistory = localStorage.getItem("emailHistory")
      const history = existingHistory ? JSON.parse(existingHistory) : []
      history.unshift(emailData)
      localStorage.setItem("emailHistory", JSON.stringify(history))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    setEmailHistory((prev) => [emailData, ...prev])

    toast({
      title: "Process completed",
      description: "Your email has been prepared and representatives have been notified.",
    })

    // Reset form and state
    form.reset()
    setGeneratedEmail("")
    setEditedEmail("")
    setSubmissionId("")
    setActiveTab("input")
  }

  const handleExport = async () => {
    try {
      await exportData(emailHistory)
      toast({
        title: "Data exported",
        description: "Email data has been exported as CSV.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Write to Your MP About Immigration</CardTitle>
        <CardDescription>
          Help us draft a personalized email to your Member of Parliament about your concerns regarding the immigration
          white paper.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Your Details</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedEmail}>
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit" disabled={!generatedEmail}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="representatives" disabled={!submissionId}>
              Send
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Postal Code */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Location</h3>

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SW1A 1AA" {...field} />
                        </FormControl>
                        <FormDescription>We'll use this to find your MP and local councilors</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="constituentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Not saved to database
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="constituentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Not saved to database
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="writingFor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who are you writing this email for? *</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="myself"
                                checked={field.value === "myself"}
                                onChange={() => field.onChange("myself")}
                              />
                              <span>For myself</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="someone-else"
                                checked={field.value === "someone-else"}
                                onChange={() => field.onChange("someone-else")}
                              />
                              <span>For someone else</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchWritingFor === "someone-else" && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        When writing to your MP, it is recommended to write in the first-person tone. Please keep that
                        in mind as you compose this email.
                      </AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Residency Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Residency Status</h3>

                  <FormField
                    control={form.control}
                    name="residentialStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residential Status *</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="permanent-resident"
                                checked={field.value === "permanent-resident"}
                                onChange={() => field.onChange("permanent-resident")}
                              />
                              <span>I'm a permanent resident of the UK/UK national</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                value="visa-holder"
                                checked={field.value === "visa-holder"}
                                onChange={() => field.onChange("visa-holder")}
                              />
                              <span>I'm a visa holder</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchResidentialStatus === "visa-holder" && (
                    <>
                      <FormField
                        control={form.control}
                        name="visaType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visa Type</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" {...field}>
                                <option value="">Select visa type</option>
                                {visaTypeOptions.map((type) => (
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="visaSituation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Visa Situation Details</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Please describe your current visa situation in more detail..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              This helps us understand how the immigration policies might affect you specifically.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="yearsInUK"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Residence in the UK</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Number of years" {...field} />
                        </FormControl>
                        <FormDescription>Optional - helps demonstrate your connection to the UK</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Economic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Economic Information</h3>

                  <FormField
                    control={form.control}
                    name="yearlyIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yearly Income *</FormLabel>
                        <FormControl>
                          <select className="w-full p-2 border rounded-md" {...field}>
                            <option value="">Select income bracket</option>
                            {salaryBracketOptions.map((bracket) => (
                              <option key={bracket} value={bracket}>
                                {bracket}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profession</FormLabel>
                        <FormControl>
                          <Input placeholder="Your profession or job title" {...field} />
                        </FormControl>
                        <FormDescription>Optional - helps show your contribution to the UK economy</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annualTaxContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Tax Contribution</FormLabel>
                        <FormControl>
                          <Input placeholder="Approximate annual tax paid (£)" {...field} />
                        </FormControl>
                        <FormDescription>Optional - demonstrates your financial contribution to the UK</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Immigration Concerns */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Immigration Concerns</h3>

                  <FormField
                    control={form.control}
                    name="immigrationConcerns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What are your top concerns about the immigration white paper? *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your specific concerns about the immigration white paper and how it might affect you, your family, or your community..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about how the proposed changes would impact you personally or professionally.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Data Collection Opt-in */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Data Collection</h3>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Privacy Notice:</strong> By default, we only save your postal code and residency status to
                      our database. Your name and email are never saved. You can opt in below to help us with research
                      by saving additional anonymous data.
                    </AlertDescription>
                  </Alert>

                  <FormField
                    control={form.control}
                    name="optInDataCollection"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Help with research (optional)</FormLabel>
                          <FormDescription>
                            Allow us to save additional data (age, income, profession, concerns) to help with
                            immigration policy research. Your name and email will never be saved.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {watchOptIn && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Thank you! This additional data will help us understand the impact of immigration policies. All
                        data remains anonymous and your personal details are never stored.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Email...
                    </>
                  ) : (
                    <>
                      Generate Email to MP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preview">
            {generatedEmail && (
              <>
                <EmailPreview
                  recipient="Your Member of Parliament"
                  subject="Concerns about the Immigration White Paper"
                  content={generatedEmail}
                />
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setActiveTab("input")}>
                    Back to Details
                  </Button>
                  <Button onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Email
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="edit">
            {generatedEmail && (
              <>
                <EmailEditor
                  initialContent={generatedEmail}
                  onChange={setEditedEmail}
                  recipient="Your Member of Parliament"
                  subject="Concerns about the Immigration White Paper"
                />
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={() => setActiveTab("preview")}>
                    Back to Preview
                  </Button>
                  <Button onClick={handleSaveAndContinue} disabled={isSending}>
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Continue to Send
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="representatives">
            {submissionId && (
              <RepresentativeSelector
                postalCode={form.getValues("postalCode")}
                submissionId={submissionId}
                emailContent={editedEmail}
                onComplete={handleComplete}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {emailHistory.length > 0 ? `${emailHistory.length} emails prepared` : "No emails prepared yet"}
        </div>
        <Button variant="outline" onClick={handleExport} disabled={emailHistory.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </CardFooter>
    </Card>
  )
}
