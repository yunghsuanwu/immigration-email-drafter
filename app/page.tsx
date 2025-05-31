import { EmailDrafter } from "@/components/email-drafter"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Your MP About Immigration</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Make your voice heard on immigration policy. This tool helps you draft a personalized, professional email to
          your Member of Parliament about your concerns regarding the immigration white paper.
        </p>
      </div>
      <EmailDrafter />
    </main>
  )
}
