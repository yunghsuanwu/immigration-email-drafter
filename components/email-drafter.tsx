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
import { Loader2, Send, Download, Edit, ArrowRight, ArrowLeft, Info, Shield, ChevronDown } from "lucide-react"
import { EmailEditor } from "@/components/email-editor"
import { RepresentativeSelector } from "@/components/representative-selector"
import { generateMPEmail } from "@/lib/generate-mp-email"
import { saveUserSubmission } from "@/lib/database"
import { exportData } from "@/lib/export-data"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import type { FormData } from "@/types/form-data"
import { salaryBrackets, visaTypes, industryTypes, revenueBrackets, companySizes } from "@/types/form-data"

type EmailData = {
  recipient: string
  subject: string
  content: string
  timestamp: string
}

const salaryBracketOptions = salaryBrackets

const visaTypeOptions = visaTypes

const industryOptions = industryTypes

const revenueBracketsOptions = revenueBrackets

const compnaySizesOptions = companySizes

export function EmailDrafter() {
  const [activeTab, setActiveTab] = useState("input")
  const [currentSection, setCurrentSection] = useState("basic-info")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [submissionId, setSubmissionId] = useState("")
  const [emailHistory, setEmailHistory] = useState<EmailData[]>([])
  const [isProTipsOpen, setIsProTipsOpen] = useState(false)
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
      SOC: "",
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
        <CardTitle>RE:Immigration Email Drafter</CardTitle>
        <CardDescription>
          Answer a few questions to generate a personalised email. We only ask the essentials for your MP to know about your situation.
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
                  <div className="space-y-12">
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
                                <Input {...field} className="select-text" />
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
                                <Input type="email" {...field} className="select-text" />
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
                                <Input placeholder="e.g., SW1A 1AA" className="placeholder:text-gray-400 placeholder:italic select-text" {...field} />
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
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="visa-employee"
                                    checked={field.value === "visa-employee"}
                                    onChange={() => field.onChange("visa-employee")}
                                    className="cursor-pointer"
                                  />
                                  <span>I am an employee on visa.</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="employer"
                                    checked={field.value === "employer"}
                                    onChange={() => field.onChange("employer")}
                                    className="cursor-pointer"
                                  />
                                  <span>I am an employer considering or is currently hiring overseas workers.</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="other-reasons"
                                    checked={field.value === "other-reasons"}
                                    onChange={() => field.onChange("other-reasons")}
                                    className="cursor-pointer"
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
                    <div className="flex justify-end">
                       <Button type="button" variant="outline" onClick={handleNextSection} className="w-1/2 hover:bg-gray-200 cursor-pointer">
                         Continue
                         <ArrowRight className="ml-2 h-4 w-4" />
                       </Button>
                     </div>
                  </div>
                )}

                {/* Residency Status Section */}
                {currentSection === "residency-status" && (
                  <div className="space-y-12">
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
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="visa-holder"
                                    checked={field.value === "visa-holder"}
                                    onChange={() => field.onChange("visa-holder")}
                                    className="cursor-pointer"
                                  />
                                  <span>I am a visa holder.</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="uk-national"
                                    checked={field.value === "uk-national"}
                                    onChange={() => field.onChange("uk-national")}
                                    className="cursor-pointer"
                                  />
                                  <span>I am a UK national/resident with settled status in the UK.</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="other-status"
                                    checked={field.value === "other-status"}
                                    onChange={() => field.onChange("other-status")}
                                    className="cursor-pointer"
                                  />
                                  <span>Other status.</span>
                                </label>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchResidentialStatus === "other-status" && (
                        <FormField
                          control={form.control}
                          name="residentialStatusOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Please describe your residential status.</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., EU Settled Status, Tier 2 Visa" className="placeholder:text-gray-400 placeholder:italic" {...field} />
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
                        render={({ field }) => {
                          const [hasInvalidInput, setHasInvalidInput] = useState(false);
                          
                          return (
                            <FormItem>
                              <FormLabel>How long have you been in the UK? (Please answer in years)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="text"
                                  placeholder="e.g., 1, 1.5, 2"
                                  className="placeholder:text-gray-400 placeholder:italic select-text"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow digits 0-9 and decimal point
                                    if (value === '' || /^[0-9.]*$/.test(value)) {
                                      field.onChange(value);
                                      setHasInvalidInput(false);
                                    } else {
                                      setHasInvalidInput(true);
                                    }
                                  }}
                                />
                              </FormControl>
                              {hasInvalidInput && (
                                <p className="text-red-500 text-sm mt-1">
                                  Please only enter digits 0-9 and a decimal point.
                                </p>
                              )}
                              <FormDescription className="text-gray-400 italic">Optional - helps demonstrate your connection to the UK</FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" variant="outline" onClick={handleNextSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Economic Info Section (for visa-employee and other-reasons) */}
                {currentSection === "economic-info" && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Economic Information</h3>
                      <p className="text-sm text-muted-foreground">This section is completely optional. You can skip it if you prefer.</p>
                      
                      <FormField
                        control={form.control}
                        name="yearlyIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yearly income (£)</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md text-sm" {...field}>
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
                            <FormLabel>Profession/Job Title</FormLabel>
                                                          <FormControl>
                                <Input {...field} className="select-text" />
                              </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="SOC"
                        render={({ field }) => {
                          const [hasInvalidInput, setHasInvalidInput] = useState(false);

                          return (
                            <FormItem>
                              <FormLabel>Standard Occupational Code (SOC)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 1111" 
                                  className="placeholder:text-gray-400 placeholder:italic select-text" 
                                  maxLength={4}
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Only allow digits and limit to 4 characters
                                    if (value === '' || /^\d{0,4}$/.test(value)) {
                                      field.onChange(value);
                                      setHasInvalidInput(false);
                                    } else {
                                      setHasInvalidInput(true);
                                    }
                                  }}
                                />
                              </FormControl>
                              {hasInvalidInput && (
                                <p className="text-red-500 text-sm mt-1">
                                  Please only input your four-digit SOC.
                                </p>
                              )}
                              <FormDescription className="text-gray-400 italic">The government uses SOC to determine Skilled Worker visa eligiblity. Find yours with the{" "}
                                <a
                                  href="https://www.gov.uk/government/publications/skilled-worker-visa-eligible-occupations/skilled-worker-visa-eligible-occupations-and-codes"
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="underline"
                                >
                                  official CASCOT tool
                                </a>.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="annualTaxContribution"
                        render={({ field }) => {
                          const [hasInvalidInput, setHasInvalidInput] = useState(false);

                          return (
                          <FormItem>
                            <FormLabel>Annual Tax Contribution (£)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Please provide an approximate."
                                className="placeholder:text-gray-400 placeholder:italic select-text"
                                {...field}
                                onChange={(e) => {
                                const value = e.target.value;
                                //only allow digits and decimal points.
                                  if (value === '' || /^[0-9.]*$/.test(value)) {
                                    field.onChange(value);
                                    setHasInvalidInput(false);
                                  } else {
                                    setHasInvalidInput(true);
                                  }
                                }}
                              />
                            </FormControl>
                            {hasInvalidInput && (
                              <p className="text-red-500 text-sm mt-1">
                                Please only enter digits 0-9 and a decimal point.
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" variant="outline" onClick={handleNextSection} className="flex-1 hover:bg-gray-200">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Employer Details Section */}
                {currentSection === "company-information" && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Your Company Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry *</FormLabel>
                            <FormControl>
                              <select className="w-full p-2 border rounded-md text-sm" {...field}>
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
                              <select className="w-full p-2 border rounded-md text-sm" {...field}>
                                <option value="">Select company size</option>
                                {compnaySizesOptions.map((bracket: string) => (
                                  <option key={bracket} value={bracket}>
                                    {bracket}
                                  </option>
                                ))
                                }
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
                              <select className="w-full p-2 border rounded-md text-sm" {...field}>
                                <option value="">Select revenue bracket</option>
                                {revenueBracketsOptions.map((bracket: string) => (
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
                        render={({ field }) => {
                          const [hasInvalidInput, setHasInvalidInput] = useState(false);
                          return(
                            <FormItem>
                              <FormLabel>How many employees do you have are visa holders right now?</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 5" 
                                  className="placeholder:text-gray-400 placeholder:italic select-text" 
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    //only allow digits.
                                      if (value === '' || /^[0-9]*$/.test(value)) {
                                        field.onChange(value);
                                        setHasInvalidInput(false);
                                      } else {
                                        setHasInvalidInput(true);
                                      }
                                    }}
                                />
                              </FormControl>
                              {hasInvalidInput && (
                              <p className="text-red-500 text-sm mt-1">
                                Please only enter digits 0-9.
                              </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="plannedOverseasHires"
                        render={({ field }) => {
                          const [hasInvalidInput, setHasInvalidInput] = useState(false);
                          return(
                            <FormItem>
                              <FormLabel>How many overseas workers are you considering hiring?</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 10" 
                                  className="placeholder:text-gray-400 placeholder:italic select-text" 
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    //only allow digits.
                                      if (value === '' || /^[0-9]*$/.test(value)) {
                                        field.onChange(value);
                                        setHasInvalidInput(false);
                                      } else {
                                        setHasInvalidInput(true);
                                      }
                                    }}
                                />
                              </FormControl>
                              {hasInvalidInput && (
                              <p className="text-red-500 text-sm mt-1">
                                Please only enter digits 0-9.
                              </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" variant="outline" onClick={handleNextSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Immigration Concerns Section */}
                {currentSection === "concerns" && (
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Concerns about the rule change</h3>

                      <FormField
                        control={form.control}
                        name="immigrationConcerns"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>
                              What are your top concerns about the immigration white paper? *
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={
                                  watchWhyWriting === "employer"
                                    ? "Write in any way you feel most comfortable; bullet points, short sentences, full paragraphs, anything works!\n\nPlease describe how the immigration changes might affect your business operations, hiring plans, or company growth..."
                                    : "Write in any way you feel most comfortable; bullet points, short sentences, full paragraphs, anything works!\n\nPlease describe how the immigration changes will affect you (professionally and personally), your family, or your community..."
                                }
                                className="min-h-[120px] placeholder:italic placeholder:text-gray-400 select-text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />


                      <div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          className="justify-between p-2 h-auto hover:bg-gray-200 cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsProTipsOpen(!isProTipsOpen);
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Pro Tips
                          </span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isProTipsOpen ? 'rotate-180' : ''}`} />
                        </Button>
                        
                        {isProTipsOpen && (
                          <div className="px-4 pt-4">
                            {watchWhyWriting === "employer" ? (
                              <div className="space-y-2 text-sm">
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                  <li>Focus on specific business impacts like hiring delays, skill shortages, or project timelines.</li>
                                  <li>Mention concrete numbers if possible (e.g., "We need 5 software developers").</li>
                                  <li>Explain how this affects your company's growth and contribution to the UK economy.</li>
                                  <li>Provide insights on how the rule change will affect your industry.</li>
                                  <li>Share any positive experiences with current visa holders in your team.</li>
                                </ul>
                              </div>
                            ) : (
                              <div className="space-y-2 text-sm">
                                <p className="font-medium">Mention specific information, including:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                  <li>Your living experience in the UK and/or personal journey in obtaining visas.</li>
                                  <li>Your contributions to the community (work, volunteering, taxes paid).</li>
                                  <li>Any specific skills or expertise you bring to the UK.</li>
                                  <li>How these changes would affect you, your family, or your partner.</li>
                                  <li>How these changes affect your short-term and long-term plans.</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                    </div>

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" variant="outline" onClick={handleNextSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Data Collection Section */}
                {currentSection === "data-collection" && (
                  <div className="space-y-12">
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
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="cursor-pointer" />
                            </FormControl>
                            <div className="space-y-1 leading-none cursor-pointer select-text">
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
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        Back
                      </Button>
                      <Button type="submit" variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" disabled={isGenerating}>
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
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" onClick={() => setActiveTab("input")}>
                    Back to Details
                  </Button>
                  <Button variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" onClick={handleSaveAndContinue} disabled={isSending}>
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
          <Button variant="outline" className="hover:bg-gray-200 cursor-pointer" onClick={handleExport} disabled={emailHistory.length === 0}>
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
              className="underline"
            >
              here
            </a>.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
