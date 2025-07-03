import { EmailDrafter } from "@/components/email-drafter"
import { HeroSection } from "@/components/hero-section"
import { RuleChange, CallToAction } from "@/components/project-intro"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <HeroSection />
      <RuleChange />
      <CallToAction />
      <div className="my-12" />
      <EmailDrafter />
    </main>
  )
}
