import { BowDetailPageWrapper } from "@/components/bow-detail-page-wrapper"
import { Header } from "@/components/header"

export default async function BowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BowDetailPageWrapper bowId={id} />
      </main>
    </div>
  )
} 