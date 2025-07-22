"use client"

import Link from "next/link"
import Image from "next/image"
{/*import { Button } from "@/components/ui/button"*/}
{/*import { Mail, History, Users } from "lucide-react"*/}
import { PencilLine } from "lucide-react"

export function NavBar() {

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <PencilLine className="h-6 w-6 mr-2 text-[#4a90e2]" />
          <span className="font-bold text-lg text-[#4a90e2]">Re:Immigration Email Drafter</span>
        </div>
        <div className="flex justify-end gap-2">
          {/*<Button variant={pathname === "/" ? "default" : "ghost"} size="sm" asChild>
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
          </Button>*/}
          <Link href="https://www.notastranger.org" className="flex items-center space-x-2">
            <Image
              src="/images/logo/not_a_stranger_1100x220_words_wlogo_temp.png"
              alt="Not A Stranger Logo"
              width={1100}
              height={220}
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}
