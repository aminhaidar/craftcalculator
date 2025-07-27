import { BowLibrary } from "@/components/bow-library"
import { Header } from "@/components/header"

export default function BowsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BowLibrary />
      </main>
    </div>
  )
} 