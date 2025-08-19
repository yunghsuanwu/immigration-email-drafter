import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { NavBar } from "@/components/nav-bar"
import { FeedbackButton } from "@/components/feedback-button"

import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Re:Immigration – Contact Your MP",
  description: "Immigration rule change to skilled worker visas, social care worker visa, and other barriers is imminent. Our email drafter helps you write strong, personalized email to your MP. Act now and get your voice heard.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <NavBar />
        {children}
        <div className="fixed bottom-12 right-12 z-50">
          <FeedbackButton />
        </div>
      </body>
    </html>
  )
}
