import { NextRequest, NextResponse } from 'next/server'
import { RecipeService } from '@/lib/services/recipe-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')

    let recipes

    if (query) {
      recipes = await RecipeService.searchRecipes(query)
    } else if (category) {
      recipes = await RecipeService.getRecipesByCategory(category)
    } else if (difficulty) {
      recipes = await RecipeService.getRecipesByDifficulty(difficulty as 'Easy' | 'Medium' | 'Hard')
    } else {
      recipes = await RecipeService.getAllRecipes()
    }

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const recipe = await RecipeService.createRecipe(body)
    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Error creating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
} 