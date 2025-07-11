import { EmailDrafter } from "@/components/email-drafter"
import { HeroSection } from "@/components/hero-section"
import { CallToAction } from "@/components/call-to-action"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <HeroSection />
      <CallToAction />
      <div className="my-12" />
      <EmailDrafter />
      <div className="my-18" />
    </main>
  )
}
