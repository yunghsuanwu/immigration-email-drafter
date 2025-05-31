"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Mail, History, Users } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg">MP Immigration Contact Tool</span>
        </div>
        <div className="flex gap-2">
          <Button variant={pathname === "/" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/">
              <Mail className="h-4 w-4 mr-2" />
              Write to MP
            </Link>
          </Button>
          <Button variant={pathname === "/history" ? "default" : "ghost"} size="sm" asChild>
            <Link href="/history">
              <History className="h-4 w-4 mr-2" />
              Email History
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
