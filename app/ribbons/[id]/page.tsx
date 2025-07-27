import { notFound } from "next/navigation"
import { RibbonDetailPage } from "@/components/ribbon-detail-page"

interface RibbonDetailPageProps {
  params: {
    id: string
  }
}

export default async function RibbonDetailPageRoute({ params }: RibbonDetailPageProps) {
  try {
    const { id } = await params
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ribbons/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      notFound()
    }
    
    const ribbon = await response.json()
    
    return <RibbonDetailPage ribbon={ribbon} />
  } catch (error) {
    console.error('Error fetching ribbon:', error)
    notFound()
  }
} 