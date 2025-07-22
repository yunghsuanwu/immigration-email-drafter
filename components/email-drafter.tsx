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
import { Loader2, Send, ArrowRight, ArrowLeft, Info, PencilLine, Shield, ChevronDown } from "lucide-react"
import { EmailEditor } from "@/components/email-editor"
import { generateMPEmail } from "@/lib/generate-mp-email"
import { saveUserSubmission } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { findYourMP } from "@/lib/find-your-mp"

import type { FormData } from "@/types/form-data"
import { salaryBrackets, visaTypes, industryTypes, revenueBrackets, companySizes } from "@/types/form-data"

const salaryBracketOptions = salaryBrackets

const visaTypeOptions = visaTypes

const industryOptions = industryTypes

const revenueBracketsOptions = revenueBrackets

const compnaySizesOptions = companySizes

export function EmailDrafter() {
  const [activeTab, setActiveTab] = useState("input")
  const [currentSection, setCurrentSection] = useState("basic-info")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [canSend, setCanSend] = useState(false);
  const [isProTipsOpen, setIsProTipsOpen] = useState(false)
  const [isExplainerOpen, setIsExplainerOpen] = useState(false)
  const [yearsInUKInvalid, setYearsInUKInvalid] = useState(false)
  const [socInvalid, setSocInvalid] = useState(false)
  const [annualTaxInvalid, setAnnualTaxInvalid] = useState(false)
  const [currentOverseasInvalid, setCurrentOverseasInvalid] = useState(false)
  const [plannedHiresInvalid, setPlannedHiresInvalid] = useState(false)
  const [isFocused, setIsFocused] = useState<string | null>(null)
  const { toast } = useToast()
  const [mpInfo, setMpInfo] = useState<null | {
    nameFullTitle: string
    nameAddressAs: string
    partyName: string
    membershipFrom: string
    email: string | null
    phone: string
    memberID: string | number | null
  }>(null)
  const [mpLoading, setMpLoading] = useState(false)
  const [mpError, setMpError] = useState<string | null>(null)

  const [toCopied, setToCopied] = useState(false);
  const [subjectCopied, setSubjectCopied] = useState(false);
  const [bodyCopied, setBodyCopied] = useState(false);

  const handleCopyTo = (to: string) => {
    navigator.clipboard.writeText(to);
    setToCopied(true);
    setTimeout(() => setToCopied(false), 1500);
  };
  const handleCopySubject = (subject: string) => {
    navigator.clipboard.writeText(subject);
    setSubjectCopied(true);
    setTimeout(() => setSubjectCopied(false), 1500);
  };
  const handleCopyBody = (body: string) => {
    navigator.clipboard.writeText(body);
    setBodyCopied(true);
    setTimeout(() => setBodyCopied(false), 1500);
  };

  const handleFindMP = async () => {
    setMpLoading(true)
    setMpError(null)
    setMpInfo(null)
    const postalCode = form.getValues("postalCode")
    if (!postalCode || postalCode.trim() === "") {
      setMpError("Please enter a postal code.")
      setMpLoading(false)
      return
    }
    const result = await findYourMP(postalCode)
    if (!result) {
      setMpError("Could not find an MP for that postal code.")
    } else {
      setMpInfo(result)
    }
    setMpLoading(false)
  }

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
      optInUpdates: false,
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
      setCurrentSection("your-mp")
    } else if (currentSection === "your-mp") {
      setCurrentSection("data-collection")
    }
  }

  const handlePreviousSection = () => {
    if (currentSection === "data-collection") {
      setCurrentSection("your-mp")
    } else if (currentSection === "your-mp") {
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
    console.log("Form data submitted:", data)
    console.log("MP Info submitted:", mpInfo)
    let email: string | null = null;
    try {
      // 1. Generate the email using the full form data
      try {
        email = await generateMPEmail(data, mpInfo ?? undefined)
      } catch (aiError) {
        console.warn("AI generation failed, using fallback:", aiError)
        const { generateFallbackEmail } = await import("@/lib/fallback-email-generator")
        try {
          email = generateFallbackEmail(data)
          toast({
            title: "Email generated (fallback mode)",
            description: "AI generation failed, but we've created a template email for you to customize.",
          })
        } catch {
          toast({
            title: "Generation failed",
            description: "Failed to generate email. Please try again.",
          })
          setIsGenerating(false)
          return
        }
      }

      // 2. Save the form data to Supabase according to user permissions
      const formData = form.getValues()
      const saveForResearch = formData.optInDataCollection
      const saveForUpdates = formData.optInUpdates
      const dataToSave = { ...formData }
      if (formData.whyWriting === "employer") {
        if (!saveForResearch) {
          dataToSave.industry = undefined;
          dataToSave.companySize = undefined;
          dataToSave.yearlyRevenue = undefined;
          dataToSave.currentOverseasEmployees = undefined;
          dataToSave.plannedOverseasHires = undefined;
          dataToSave.immigrationConcerns = "";
        }
      } else {
        if (!saveForResearch) {
          dataToSave.yearlyIncome = undefined;
          dataToSave.profession = undefined;
          dataToSave.annualTaxContribution = undefined;
          dataToSave.yearsInUK = undefined;
          dataToSave.immigrationConcerns = "";
        }
      }
      if (!saveForUpdates) {
        dataToSave.constituentEmail = "";
      }
      try {
        await saveUserSubmission(dataToSave, mpInfo || undefined)
      } catch {
        toast({
          title: "Save failed",
          description: "Failed to save your information. Please try again.",
        })
      }

      // 3. When both finish, show the 'edit' tab
      if (email) {
        setGeneratedEmail(email)
        setEditedEmail(email)
        setActiveTab("edit")
        if (!email.includes("template email")) {
          toast({
            title: "Email generated",
            description: "Your email to your MP has been generated successfully.",
          })
        }
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full min-h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PencilLine className="h-4 w-4" />
          Re:Immigration Email Drafter
          </CardTitle>
        <CardDescription>
        <div>
          <Button 
            type="button"
            variant="ghost" 
            className="justify-between p-2 h-auto hover:bg-gray-200 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExplainerOpen(!isExplainerOpen);
            }}
          >
            <span className="flex items-center gap-2">How does it work?</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExplainerOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isExplainerOpen && (
            <div className="px-5 pt-1">
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>Answer the following questions to help your MP understand your situation.</li>
                <li>This tool then uses AI models (Claude and GPT) to generate a personalised email for you.</li>
                <li>Answer as much as you&apos;d like; but the more specific you are, the stronger your email.</li>
                <li>Questions with an asterisk (*) are highly recommended.</li>
              </ul>
            </div>
          )}
        </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Personalise</TabsTrigger>
            <TabsTrigger value="edit" disabled={!generatedEmail}>
              Edit
            </TabsTrigger>
            <TabsTrigger value="send" disabled={!canSend}>
              Send
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                {/* Basic Information Section */}
                {currentSection === "basic-info" && (
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Tell us a bit about yourself...</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="constituentName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Full Name *</FormLabel>
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
                                  <span>I am on a visa and will be affected.</span>
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
                                  <span>I am a UK national (with a British passport).</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="indefinite-leave-to-remain"
                                    checked={field.value === "indefinite-leave-to-remain"}
                                    onChange={() => field.onChange("indefinite-leave-to-remain")}
                                    className="cursor-pointer"
                                  />
                                  <span>I have indefinite leave to remain.</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="settled-status"
                                    checked={field.value === "settled-status"}
                                    onChange={() => field.onChange("settled-status")}
                                    className="cursor-pointer"
                                  />
                                  <span>I have settled status (from the EU Settlement Scheme).</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer select-text">
                                  <input
                                    type="radio"
                                    value="other-status"
                                    checked={field.value === "other-status"}
                                    onChange={() => field.onChange("other-status")}
                                    className="cursor-pointer"
                                  />
                                  <span>Other.</span>
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
                                <Input placeholder="e.g., EU pre-settled status, dependent of a visa holder" className="placeholder:text-gray-400 placeholder:italic" {...field} />
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
                                    setYearsInUKInvalid(false);
                                  } else {
                                    setYearsInUKInvalid(true);
                                  }
                                }}
                                onFocus={() => setIsFocused("yearsInUK")}
                                onBlur={() => setIsFocused(null)}
                              />
                            </FormControl>
                            {yearsInUKInvalid && (
                              <p className="text-red-500 text-sm mt-1">
                                Please only enter digits 0-9 and a decimal point.
                              </p>
                            )}
                            {isFocused === "yearsInUK" && (
                              <FormDescription className="text-gray-400 italic">Optional - helps demonstrate your connection to the UK</FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
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
                      <p className="text-sm text-muted-foreground">This section is completely optional. You can skip if preferred.</p>
                      
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Standard Occupational Code (SOC)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="This is a four-digit code. If unsure, leave it blank or look it up." 
                                className="placeholder:text-gray-400 placeholder:italic select-text" 
                                maxLength={4}
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Only allow digits and limit to 4 characters
                                  if (value === '' || /^\d{0,4}$/.test(value)) {
                                    field.onChange(value);
                                    setSocInvalid(false);
                                  } else {
                                    setSocInvalid(true);
                                  }
                                }}
                              />
                            </FormControl>
                            {socInvalid && (
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
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="annualTaxContribution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Tax Contribution (£)</FormLabel>
                            <FormControl>
                              <Input
                                className="placeholder:text-gray-400 placeholder:italic select-text"
                                {...field}
                                onChange={(e) => {
                                const value = e.target.value;
                                //only allow digits and decimal points.
                                  if (value === '' || /^[0-9.]*$/.test(value)) {
                                    field.onChange(value);
                                    setAnnualTaxInvalid(false);
                                  } else {
                                    setAnnualTaxInvalid(true);
                                  }
                                }}
                                onFocus={() => setIsFocused("annualTaxContribution")}
                                onBlur={() => setIsFocused(null)}
                              />
                            </FormControl>
                            {annualTaxInvalid && (
                              <p className="text-red-500 text-sm mt-1">
                                Please only enter digits 0-9 and a decimal point.
                              </p>
                            )}
                            {isFocused === "annualTaxContribution" && (
                              <FormDescription className="text-gray-400 italic">
                                Please provide an approximate.
                              </FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
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
                            <FormLabel>Size of your company (number of employees)</FormLabel>
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
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How many employees do you have are visa holders right now? *</FormLabel>
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
                                      setCurrentOverseasInvalid(false);
                                    } else {
                                      setCurrentOverseasInvalid(true);
                                    }
                                  }}
                              />
                            </FormControl>
                            {currentOverseasInvalid && (
                            <p className="text-red-500 text-sm mt-1">
                              Please only enter digits 0-9.
                            </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="plannedOverseasHires"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>How many overseas workers are you considering hiring? *</FormLabel>
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
                                      setPlannedHiresInvalid(false);
                                    } else {
                                      setPlannedHiresInvalid(true);
                                    }
                                  }}
                              />
                            </FormControl>
                            {plannedHiresInvalid && (
                            <p className="text-red-500 text-sm mt-1">
                              Please only enter digits 0-9.
                            </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
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
                                    ? "Please describe how the immigration changes might affect your business operations, hiring plans, or company growth...\n\nFor example, 'I fear that the new rules will make it harder for me to hire skilled workers in an industry highly reliant on foreign talents...'"
                                    : "Please describe how the immigration changes will affect you (professionally and personally), your family, or your community...\n\nFor example, 'I fear that the new rules will make it harder for me to move my family, even though I've established a life here...'"
                                }
                                className="min-h-[120px] placeholder:italic placeholder:text-gray-400 select-text"
                                {...field}
                                onFocus={() => setIsFocused("immigrationConcerns")}
                                onBlur={() => setIsFocused(null)}
                              />
                            </FormControl>
                            {isFocused === "immigrationConcerns" && (
                              <FormDescription className="text-gray-400 italic">
                                Write in any way you feel most comfortable; bullet points, short sentences, full paragraphs, or even in your native tongue!
                              </FormDescription>
                            )}
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
                                  <li>Mention concrete numbers if possible (e.g., &quot;We need 5 software developers&quot;).</li>
                                  <li>Explain how this affects your company&apos;s growth and contribution to the UK economy.</li>
                                  <li>Provide insights on how the rule change will affect your industry.</li>
                                  <li>Share any positive experiences with current visa holders in your team.</li>
                                </ul>
                              </div>
                            ) : (
                              <div className="space-y-2 text-sm">
                                <p className="font-medium">Mention specific information, including:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                  <li>Your journey to obtain the UK citizenship or indefinite leave to remain/settled status, if applicable.</li>
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

                {/* Your MP Section */}
                {currentSection === "your-mp" && (
                  <div className="space-y-12">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Find your MP</h3>
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="SW1A 1AA" 
                                className="placeholder:text-gray-400 placeholder:italic select-text" 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="hover:bg-gray-200 cursor-pointer"
                        onClick={handleFindMP}
                        disabled={mpLoading}
                      >
                        {mpLoading ? "Looking up MP..." : "Find MP"}
                      </Button>
                      {mpError && <p className="text-red-500 text-sm mt-2">{mpError}</p>}
                      {mpInfo && (
                        <div className="mt-4 p-4 border rounded bg-gray-50">
                          <div><strong>Name:</strong> {mpInfo.nameFullTitle}</div>
                          <div><strong>Address As:</strong> {mpInfo.nameAddressAs}</div>
                          <div><strong>Party:</strong> {mpInfo.partyName}</div>
                          <div><strong>Constituency:</strong> {mpInfo.membershipFrom}</div>
                          <div><strong>Email:</strong> {mpInfo.email ? (
                            <a href={`mailto:${mpInfo.email}`} className="underline text-blue-600">{mpInfo.email}</a>
                          ) : 'None'}</div>
                          <div><strong>Phone:</strong> {mpInfo.phone || 'None'}</div>
                          {mpInfo && mpInfo.memberID && (
                            <div className="mt-2">
                              <a
                                href={`https://members.parliament.uk/member/${mpInfo.memberID}/contact`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-600"
                              >
                                Full MP contact details
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                      <Button type="button" variant="outline" onClick={handleNextSection} className="w-1/2 hover:bg-gray-200 cursor-pointer">
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Data Collection Section */}
                {currentSection === "data-collection" && (
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Data Collection</h3>
                        <span className="flex items-start gap-2">
                          <Shield className="w-7 h-5" />
                          <p className="text-sm text-muted-foreground">
                            By default, we only save your <strong>postal code</strong>, <strong>reason for writing the email</strong>, and <strong>residency status</strong> to our database. Other data you filled in are not saved unless you consent to it. Opt in below to help us with research or to receive updates.
                          </p>
                        </span>
                      </div>
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
                                I consent to my form data (excluding my name and email address) being stored, processed, and used for immigration policy research purposes.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="optInUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="cursor-pointer" />
                            </FormControl>
                            <div className="space-y-1 leading-none cursor-pointer select-text">
                              <FormLabel>Save your email (optional)</FormLabel>
                              <FormDescription>
                                I consent to my email address being stored, processed, and used for the purpose of receiving updates about Re:Immigration, the Not A Stranger initiative, and relevant campaigns.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {(watchOptIn || form.watch("optInUpdates")) && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Thank you! Your preferences have been saved. All data remains anonymous and your personal details are never stored unless you opt in.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    

                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={handlePreviousSection} className="flex-1 hover:bg-gray-200 cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" />
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
                />
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" onClick={() => setActiveTab("input")}> 
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Personalise
                  </Button>
                  <Button variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" onClick={() => { setCanSend(true); setActiveTab("send"); }}> 
                    Continue to Send
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="send">
            {editedEmail && (
              <>
                <Card className="border-0 mb-4">
                  <CardHeader>
                    <CardTitle>Finally, it&apos;s time to send the email.</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      // Extract To, Subject, and Body from the editedEmail
                      const to = mpInfo?.email || "[MP Email]";
                      let subject = "";
                      let body = editedEmail;
                      const lines = editedEmail.split("\n");
                      if (lines[0].startsWith("Subject:")) {
                        subject = lines[0].replace("Subject:", "").trim();
                        body = lines.slice(1).join("\n").trim();
                      } else {
                        subject = "Email to your MP";
                      }
                      // Append postal code after sign-off (try to find 'Yours sincerely,' or 'Yours faithfully,')
                      let postalCode = form.getValues("postalCode");
                      if (postalCode) postalCode = postalCode.toUpperCase();
                      let bodyWithPostal = body;
                      const signOffMatch = body.match(/(Yours sincerely,|Yours faithfully,)([\s\S]*)/i);
                      if (signOffMatch && typeof signOffMatch.index === "number" && postalCode) {
                        // Insert postal code after the sign-off name
                        const before = body.slice(0, signOffMatch.index + signOffMatch[1].length);
                        const after = body.slice(signOffMatch.index + signOffMatch[1].length);
                        bodyWithPostal = `${before}\n${after.trim()}\n${postalCode}`;
                      } else if (postalCode) {
                        bodyWithPostal += `\n${postalCode}`;
                      }

                      return (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Copy the following fields respectively in your personal email to send.</p>
                          <div className="flex items-center text-sm">
                            <span className="font-bold mr-2">To:</span>
                            <span className="bg-gray-50 p-1 rounded border">{to}</span>
                            <button
                              type="button"
                              className="ml-2 px-2 py-1 border rounded text-xs bg-white hover:bg-gray-100"
                              onClick={() => handleCopyTo(to)}
                            >
                              {toCopied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-bold mr-2">Subject:</span>
                            <span className="bg-gray-50 p-1 rounded border text-sm">{subject}</span>
                            <button
                              type="button"
                              className="ml-2 px-2 py-1 border rounded text-xs bg-white hover:bg-gray-100"
                              onClick={() => handleCopySubject(subject)}
                            >
                              {subjectCopied ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <div className="flex flex-col text-sm space-y-2">
                            <span className="flex items-center">
                              <span className="font-bold">Body:</span>
                              <button
                                type="button"
                                className="ml-2 px-2 py-1 border rounded text-xs bg-white hover:bg-gray-100"
                                onClick={() => handleCopyBody(bodyWithPostal)}
                              >
                                {bodyCopied ? "Copied!" : "Copy"}
                              </button>
                            </span>
                            <span className="bg-gray-50 p-2 rounded border text-sm">
                              <pre className="whitespace-pre-wrap break-words bg-transparent p-0 border-0 text-sm">{bodyWithPostal}</pre>
                            </span>
                            <div className="flex gap-4 mt-6">
                            <Button variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" onClick={() => setActiveTab("edit")}>
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back to Edit
                            </Button>
                            <Button variant="outline" className="flex-1 hover:bg-gray-200 cursor-pointer" onClick={() => {
                              form.reset();
                              setGeneratedEmail("");
                              setEditedEmail("");
                              setMpInfo(null);
                              setCurrentSection("basic-info");
                              setActiveTab("input");
                              setCanSend(false);
                            }}>
                              <Send className="mr-2 h-4 w-4" />
                              Draft another email
                            </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="border-t pt-4 w-full">
          <p className="text-sm text-gray-500">
            Privacy notice: The only data we save by default is your postal code, your reason for writing the email, and your residency status. 
            You can find our full data and privacy policy{" "}
            <a 
              href="/privacy" 
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
