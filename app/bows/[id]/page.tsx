import { notFound } from "next/navigation"
import { BowDetailPage } from "@/components/bow-detail-page"
import { Header } from "@/components/header"

interface BowDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BowDetailPageRoute({ params }: BowDetailPageProps) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-8">
        <BowDetailPage bowId={id} />
      </main>
    </div>
  )
} 