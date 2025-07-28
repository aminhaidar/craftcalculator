import { notFound } from "next/navigation"
import { RecipeDetailPage } from "@/components/recipe-detail-page"
import { Header } from "@/components/header"

interface RecipeDetailPageProps {
  params: {
    id: string
  }
}

export default async function RecipeDetailPageRoute({ params }: RecipeDetailPageProps) {
  try {
    const { id } = await params
    
    // Fetch recipe from API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/recipes/${id}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error(`Failed to fetch recipe: ${response.status}`)
    }

    const recipe = await response.json()

    if (!recipe) {
      notFound()
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-6">
          <RecipeDetailPage recipe={recipe} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching recipe:', error)
    notFound()
  }
} 