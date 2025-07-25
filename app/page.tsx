import { EmailDrafter } from "@/components/email-drafter"
import { HeroSection } from "@/components/hero-section"
import { CallToAction } from "@/components/call-to-action"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        <HeroSection />
        <CallToAction />
        <div className="my-12" />
        <EmailDrafter />
      </main>
      <div className="my-12" />
      <Footer />
    </div>
  )
}
