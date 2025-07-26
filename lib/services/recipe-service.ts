import { prisma } from '../db'
import type { Recipe, RecipeLayer } from '@prisma/client'

export interface CreateRecipeData {
  name: string
  description?: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  estimatedTime: string
  tags: string[]
  layers: {
    ribbonId: string
    color: string
    loops: { quantity: number; length: number }[]
    tails: { quantity: number; length: number }[]
    streamers: { quantity: number; length: number }[]
  }[]
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string
}

export class RecipeService {
  // Get all recipes with layers
  static async getAllRecipes(): Promise<(Recipe & { layers: (RecipeLayer & { ribbon: any })[] })[]> {
    return await prisma.recipe.findMany({
      include: {
        layers: {
          include: {
            ribbon: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get recipe by ID with layers
  static async getRecipeById(id: string): Promise<(Recipe & { layers: (RecipeLayer & { ribbon: any })[] }) | null> {
    return await prisma.recipe.findUnique({
      where: { id },
      include: {
        layers: {
          include: {
            ribbon: true
          },
          orderBy: { order: 'asc' }
        }
      }
    })
  }

  // Create new recipe with layers
  static async createRecipe(data: CreateRecipeData): Promise<Recipe> {
    return await prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        tags: data.tags,
        layers: {
          create: data.layers.map((layer, index) => ({
            ribbonId: layer.ribbonId,
            color: layer.color,
            loops: layer.loops,
            tails: layer.tails,
            streamers: layer.streamers,
            order: index
          }))
        }
      }
    })
  }

  // Update recipe
  static async updateRecipe(data: UpdateRecipeData): Promise<Recipe> {
    const { id, layers, ...updateData } = data
    
    if (layers) {
      // Delete existing layers and recreate them
      await prisma.recipeLayer.deleteMany({
        where: { recipeId: id }
      })
    }

    return await prisma.recipe.update({
      where: { id },
      data: {
        ...updateData,
        ...(layers && {
          layers: {
            create: layers.map((layer, index) => ({
              ribbonId: layer.ribbonId,
              color: layer.color,
              loops: layer.loops,
              tails: layer.tails,
              streamers: layer.streamers,
              order: index
            }))
          }
        })
      }
    })
  }

  // Delete recipe
  static async deleteRecipe(id: string): Promise<void> {
    await prisma.recipe.delete({
      where: { id }
    })
  }

  // Search recipes
  static async searchRecipes(query: string): Promise<(Recipe & { layers: (RecipeLayer & { ribbon: any })[] })[]> {
    return await prisma.recipe.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      },
      include: {
        layers: {
          include: {
            ribbon: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get recipes by category
  static async getRecipesByCategory(category: string): Promise<(Recipe & { layers: (RecipeLayer & { ribbon: any })[] })[]> {
    return await prisma.recipe.findMany({
      where: { category },
      include: {
        layers: {
          include: {
            ribbon: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get recipes by difficulty
  static async getRecipesByDifficulty(difficulty: 'Easy' | 'Medium' | 'Hard'): Promise<(Recipe & { layers: (RecipeLayer & { ribbon: any })[] })[]> {
    return await prisma.recipe.findMany({
      where: { difficulty },
      include: {
        layers: {
          include: {
            ribbon: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
} 