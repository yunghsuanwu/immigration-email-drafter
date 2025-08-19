"use client"

import Link from "next/link"
import Image from "next/image"
import { PencilLine } from "lucide-react"

export function NavBar() {

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/">
          <div className="flex items-center">
            <PencilLine className="h-6 w-6 mr-2 text-[#4a90e2]" />
            <span className="font-bold text-lg text-[#4a90e2] hover:text-[#ff8c5a] no-underline hover:no-underline">
              Re:Immigration
            </span>
          </div>
          </Link>
          <Link href="/about">
            <span className="text-md text-[#4a90e2] hover:text-[#ff8c5a] no-underline hover:no-underline">
              About Immigration Rules
            </span>
          </Link>
          <Link href="/privacy">
            <span className="text-md text-[#4a90e2] hover:text-[#ff8c5a] no-underline hover:no-underline">
              Privacy Notice
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2">
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
