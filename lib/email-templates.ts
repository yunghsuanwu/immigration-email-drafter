export interface EmailTemplate {
  id: string
  name: string
  description: string
  subject: string
  purpose: string
  tone: string
  keyPoints: string
  additionalInfo: string
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "meeting-request",
    name: "Meeting Request",
    description: "Request a meeting with a colleague or client",
    subject: "Request for Meeting: [Topic]",
    purpose: "Schedule a meeting to discuss a specific topic",
    tone: "professional",
    keyPoints:
      "- Proposed meeting topic\n- Suggested dates and times\n- Meeting duration\n- Meeting format (in-person/virtual)",
    additionalInfo: "Include any relevant background information or agenda items",
  },
  {
    id: "follow-up",
    name: "Follow-up",
    description: "Follow up after a meeting or conversation",
    subject: "Follow-up: [Previous Meeting/Conversation]",
    purpose: "Follow up on a previous discussion",
    tone: "professional",
    keyPoints:
      "- Reference to previous meeting/conversation\n- Summary of key points discussed\n- Next steps or action items\n- Timeline for completion",
    additionalInfo: "Include any additional resources or information that was promised",
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Apply for a job position",
    subject: "Application for [Position] - [Your Name]",
    purpose: "Apply for a job position",
    tone: "formal",
    keyPoints:
      "- Position you're applying for\n- Your qualifications and experience\n- Why you're interested in the role\n- Your availability for interviews",
    additionalInfo: "Mention where you found the job posting and any referrals",
  },
  {
    id: "thank-you",
    name: "Thank You",
    description: "Express gratitude for help, opportunity, or gift",
    subject: "Thank You for [Reason]",
    purpose: "Express appreciation",
    tone: "friendly",
    keyPoints:
      "- Specific reason for thanks\n- Impact of their help/gift/opportunity\n- Expression of gratitude\n- Any next steps if applicable",
    additionalInfo: "Keep it sincere and specific about what you're thankful for",
  },
  {
    id: "introduction",
    name: "Introduction",
    description: "Introduce yourself to a new contact",
    subject: "Introduction: [Your Name] from [Your Company/Organization]",
    purpose: "Introduce yourself and establish a connection",
    tone: "professional",
    keyPoints: "- Who you are\n- Your role/organization\n- Reason for reaching out\n- Proposed next steps",
    additionalInfo: "Mention any mutual connections or how you found their contact",
  },
]
