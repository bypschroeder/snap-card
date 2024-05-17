"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { BusinessCard } from "~/components/business-card"
import { Button } from "~/components/ui/button"

const DashboardPage = () => {
  return (
    <>
      {/* TODO: Header border fixed and only shown in DashboardPage */}
      <div className="h-px w-screen bg-border" />
      <div className="flex w-full grow flex-col py-6">
        <div className="flex flex-col">
          <div className="flex w-full items-center justify-between gap-4 px-6">
            <span className="text-3xl font-semibold">Your Cards</span>
            <Link href="/dashboard/create">
              <Button className="flex gap-2">
                <Plus size={20} />
                <span className="hidden md:inline">Create a new card</span>
              </Button>
            </Link>
          </div>
        </div>
        <ul className="flex flex-wrap w-full items-center justify-between gap-4 overflow-auto p-6">
          <li className="col-span-1 w-full max-w-sm">
            <BusinessCard />
          </li>
          <li className="col-span-1 w-full max-w-sm">
            <BusinessCard />
          </li>
          <li className="col-span-1 w-full max-w-sm">
            <BusinessCard />
          </li>
        </ul>
      </div>
      <Link href="/images">
        <Button size="lg" className="mb-4">Upload Images Test</Button>
      </Link>
    </>
  )
}

export default DashboardPage
