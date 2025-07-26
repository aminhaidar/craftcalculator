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
    // For now, we'll use the mock data directly since we don't have API routes for recipes yet
    // In a real app, this would fetch from an API
    const { getRecipeById } = await import("@/lib/bow-data")
    const recipe = getRecipeById(params.id)

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