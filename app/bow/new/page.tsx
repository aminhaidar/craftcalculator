"use client"

import { BowWizard } from "@/components/bow-wizard-new"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"

export default function NewBowPage() {
  const router = useRouter()

  const handleWizardComplete = (data: any) => {
    // Here you would typically save the bow to your database
    console.log("New bow created:", data)
    // Redirect to the bow detail page
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BowWizard onComplete={handleWizardComplete} />
      </main>
    </div>
  )
} 