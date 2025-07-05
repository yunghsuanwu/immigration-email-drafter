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
import { RepresentativeSelector } from "@/components/representative-selector"
import { generateMPEmail } from "@/lib/generate-mp-email"
import { saveUserSubmission } from "@/lib/database"
import { exportData } from "@/lib/export-data"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import type { FormData } from "@/types/form-data"
import { salaryBrackets, visaTypes } from "@/types/form-data"

type EmailData = {
  recipient: string
  subject: string
  content: string
  timestamp: string
}

const salaryBracketOptions = salaryBrackets
const visaTypeOptions = visaTypes

const industryOptions = [
  "Technology & Software",
  "Financial Services",
  "Healthcare & Pharmaceuticals",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Consulting & Professional Services",
  "Media & Entertainment",
  "Transportation & Logistics",
  "Construction & Real Estate",
  "Energy & Utilities",
  "Food & Beverage",
  "Hospitality & Tourism",
  "Non-profit & Charities",
  "Government & Public Sector",
  "Other",
]

const revenueBrackets = [
  "Less than £100,000",
  "£100,000 - £500,000",
  "£500,001 - £1,000,000",
  "£1,000,001 - £5,000,000",
  "£5,000,001 - £10,000,000",
  "£10,000,001 - £50,000,000",
  "£50,000,001 - £100,000,000",
  "£100,000,001 or more",
]

export function EmailDrafter() {
  const [activeTab, setActiveTab] = useState("input")
  const [currentSection, setCurrentSection] = useState("basic-info")
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
      whyWriting: "visa-employee",
      residentialStatus: "visa-holder",
      residentialStatusOther: "",
      visaType: "",
      yearsInUK: "",
      yearlyIncome: "",
      profession: "",
      annualTaxContribution: "",
      // Employer-specific fields
      industry: "",
      companySize: "",
      yearlyRevenue: "",
      currentOverseasEmployees: "",
      plannedOverseasHires: "",
      immigrationConcerns: "",
      optInDataCollection: false,
    },
  })

  const watchResidentialStatus = form.watch("residentialStatus")
  const watchOptIn = form.watch("optInDataCollection")
  const watchWhyWriting = form.watch("whyWriting")

  const handleNextSection = () => {
    // Determine next section based on current section and whyWriting answer
    if (currentSection === "basic-info") {
      if (watchWhyWriting === "visa-employee" || watchWhyWriting === "other-reasons") {
        setCurrentSection("residency-status")
      } else if (watchWhyWriting === "employer") {
        setCurrentSection("company-information")
      }
    } else if (currentSection === "residency-status") {
      setCurrentSection("economic-info")
    } else if (currentSection === "economic-info") {
      setCurrentSection("concerns")
    } else if (currentSection === "company-information") {
      setCurrentSection("concerns")
    } else if (currentSection === "concerns") {
      setCurrentSection("data-collection")
    }
  }

  const handlePreviousSection = () => {
    if (currentSection === "data-collection") {
      setCurrentSection("concerns")
    } else if (currentSection === "concerns") {
      if (watchWhyWriting === "visa-employee" || watchWhyWriting === "other-reasons") {
        setCurrentSection("economic-info")
      } else {
        setCurrentSection("company-information")
      }
    } else if (currentSection === "economic-info") {
      setCurrentSection("residency-status")
    } else if (currentSection === "residency-status") {
      setCurrentSection("basic-info")
    } else if (currentSection === "company-information") {
      setCurrentSection("basic-info")
    }
  }

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
        })
      }

      setGeneratedEmail(email)
      setEditedEmail(email)
      setActiveTab("edit")

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
      })
    } finally {
      setIsGenerating(false)
    }
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
        <CardTitle>Re:Immigration – MP email drafter</CardTitle>
        <CardDescription>
          Answer a few questions to help us generate a personalised email. We only ask essential questions for your MP to know about your situation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Personal Details</TabsTrigger>
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
                {/* Basic Information Section */}
                {currentSection === "basic-info" && (
                  <div className="space-y-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Basic Information</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="constituentName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
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
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., SW1A 1AA" className="text-gray-400 italic" {...field} />
                            </FormControl>
                            <FormDescription className="text-gray-400 italic">We'll use this to find your MP and local councilors.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whyWriting"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why are you writing this email? *</FormLabel>
                            <FormControl>
                              <div className="space-y-2 pl-4">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    value="visa-employee"
                                    checked={field.value === "visa-employee"}
                                    onChange={() => field.onChange("visa-employee")}
                                  />
                                  <span>I am an employee on visa.</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    value="employer"
                                    checked={field.value === "employer"}
                                    onChange={() => field.onChange("employer")}
                                  />
                                  <span>I am an employer thinking of or is currently hiring overseas workers.</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    value="other-reasons"
                                    checked={field.value === "other-reasons"}
                                    onChange={() => field.onChange("other-reasons")}
                                  />
                                  <span>I am writing for other reasons.</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="button" onClick={handleNextSection} className="w-full">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Residency Status Section */}
                {currentSection === "residency-status" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Residency Status</h3>
                      
                      <FormField
                        control={form.control}
                        name="residentialStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What is your residential status? *</FormLabel>
                            <FormControl>
                              <div className="space-y-2 pl-4">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    value="visa-holder"
                                    checked={field.value === "visa-holder"}
                                    onChange={() => field.onChange("visa-holder")}
                                  />
                                  <span>I am a visa holder.</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    value="uk-national"
                                    checked={field.value === "uk-national"}
                                    onChange={() => field.onChange("uk-national")}
                                  />
                                  <span>I am a UK national/resident with settled status in the UK.</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    value="others"
                                    checked={field.value === "others"}
                                    onChange={() => field.onChange("others")}
                                  />
                                  <span>Others.</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchResidentialStatus === "others" && (
                        <FormField
                          control={form.control}
                          name="residentialStatusOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Please describe your residential status.</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., EU Settled Status, Tier 2 Visa" className="text-gray-400 italic" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      {watchResidentialStatus === "visa-holder" && (
                        <FormField
                          control={form.control}
                          name="visaType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>What is your visa type? *</FormLabel>
                              <FormControl>
                                <select className="w-full p-2 text-sm border rounded-md" {...field}>
                                  <option value="">Select visa type</option>
                                  {visaTypeOptions.map((type: string) => (
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
                      )}

                      <FormField
                        control={form.control}
                        name="yearsInUK"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How long have you been in the UK?</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Number of years" className="text-gray-400 italic" {...field} />
                            </FormControl>
                            <FormDescription>Optional - helps demonstrate your connection to the UK</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1">
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextSection} className="flex-1">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Economic Info Section (for visa-employee and other-reasons) */}
                {currentSection === "economic-info" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Economic Information</h3>
                      <p className="text-sm text-muted-foreground">This section is completely optional. You can skip it if you prefer.</p>
                      
                      <FormField
                        control={form.control}
                        name="yearlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yearly income</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" {...field}>
                                <option value="">Select income bracket</option>
                                {salaryBracketOptions.map((bracket: string) => (
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
                              <Input placeholder="Your profession or job title" className="text-gray-400 italic" {...field} />
                            </FormControl>
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
                              <Input placeholder="Approximate annual tax paid (£)" className="text-gray-400 italic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1">
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextSection} className="flex-1">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Employer Details Section */}
                {currentSection === "company-information" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Your Company Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry *</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" {...field}>
                                <option value="">Select industry</option>
                                {industryOptions.map((industry: string) => (
                                  <option key={industry} value={industry}>
                                    {industry}
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
                        name="companySize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size of your company (number of employees) *</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" {...field}>
                                <option value="">Select company size</option>
                                <option value="1-10 employees">1-10 employees</option>
                                <option value="11-50 employees">11-50 employees</option>
                                <option value="51-200 employees">51-200 employees</option>
                                <option value="201-1000 employees">201-1000 employees</option>
                                <option value="1000+ employees">1000+ employees</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="yearlyRevenue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yearly Revenue (£)</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md" {...field}>
                                <option value="">Select revenue bracket</option>
                                {revenueBrackets.map((bracket: string) => (
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
                        name="currentOverseasEmployees"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How many overseas employees (those on a visa) do you have right now?</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 5" className="text-gray-400 italic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="plannedOverseasHires"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How many overseas workers are you thinking of hiring?</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 10" className="text-gray-400 italic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1">
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextSection} className="flex-1">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Immigration Concerns Section */}
                {currentSection === "concerns" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Concerns about the rule change</h3>

                      <FormField
                        control={form.control}
                        name="immigrationConcerns"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {watchWhyWriting === "employer" 
                                ? "How would the immigration rule change affect your company? What are your top concerns about the immigration white paper? *"
                                : "How would the immigration rule change affect you or the people around you? What are your top concerns about the immigration white paper? *"
                              }
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  watchWhyWriting === "employer"
                                    ? "Please describe how the immigration changes might affect your business operations, hiring plans, or company growth..."
                                    : "Please describe your specific concerns about the immigration white paper and how it might affect you, your family, or your community..."
                                }
                                className="min-h-[120px] italic text-gray-400"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Feel free to write in the most suitable ways; bullet points, short sentences, full paragraphs, another language, anything works!
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1">
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextSection} className="flex-1">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Data Collection Section */}
                {currentSection === "data-collection" && (
                  <div className="space-y-6">
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

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isGenerating}>
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
                    </div>
                  </div>
                )}
              </form>
            </Form>
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
                  <Button variant="outline" onClick={() => setActiveTab("input")}>
                    Back to Details
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
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {emailHistory.length > 0 ? `${emailHistory.length} emails prepared` : "No emails prepared yet"}
          </div>
          <Button variant="outline" onClick={handleExport} disabled={emailHistory.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
        <div className="border-t pt-4 w-full">
          <p className="text-sm text-gray-500">
            Privacy notice: The only data we save by default is your postal code, your reason for writing the email, and your residency status. 
            You can find our full data and privacy policy{" "}
            <a 
              href="https://notastranger.org/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              here
            </a>.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
