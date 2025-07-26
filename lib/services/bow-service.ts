import { prisma } from '../db'

export interface CreateBowData {
  name: string
  description?: string
  image?: string
  totalCost: number
  targetPrice: number
  profit: number
  profitMargin: number
  status: 'excellent' | 'good' | 'low'
  timeToMake: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  tags: string[]
  layers: number
  recipeId?: string
  materials: {
    ribbonId: string
    name: string
    quantity: string
    cost: number
  }[]
}

export interface UpdateBowData extends Partial<CreateBowData> {
  id: string
}

export class BowService {
  // Get all bows with materials and sales history
  static async getAllBows() {
    return await prisma.bow.findMany({
      include: {
        materials: {
          include: {
            ribbon: true
          }
        },
        salesHistory: {
          orderBy: { soldAt: 'desc' }
        },
        recipe: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get bow by ID with full details
  static async getBowById(id: string) {
    return await prisma.bow.findUnique({
      where: { id },
      include: {
        materials: {
          include: {
            ribbon: true
          }
        },
        salesHistory: {
          orderBy: { soldAt: 'desc' }
        },
        recipe: {
          include: {
            layers: {
              include: {
                ribbon: true
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })
  }

  // Create new bow with materials
  static async createBow(data: CreateBowData) {
    return await prisma.bow.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        totalCost: data.totalCost,
        targetPrice: data.targetPrice,
        profit: data.profit,
        profitMargin: data.profitMargin,
        status: data.status,
        timeToMake: data.timeToMake,
        difficulty: data.difficulty,
        category: data.category,
        tags: data.tags,
        layers: data.layers,
        recipeId: data.recipeId,
        materials: {
          create: data.materials.map(material => ({
            ribbonId: material.ribbonId,
            name: material.name,
            quantity: material.quantity,
            cost: material.cost
          }))
        }
      },
      include: {
        materials: {
          include: {
            ribbon: true
          }
        }
      }
    })
  }

  // Update bow
  static async updateBow(data: UpdateBowData) {
    const { id, materials, ...updateData } = data
    
    if (materials) {
      // Delete existing materials and recreate them
      await prisma.bowMaterial.deleteMany({
        where: { bowId: id }
      })
    }

    return await prisma.bow.update({
      where: { id },
      data: {
        ...updateData,
        ...(materials && {
          materials: {
            create: materials.map(material => ({
              ribbonId: material.ribbonId,
              name: material.name,
              quantity: material.quantity,
              cost: material.cost
            }))
          }
        })
      },
      include: {
        materials: {
          include: {
            ribbon: true
          }
        }
      }
    })
  }

  // Delete bow
  static async deleteBow(id: string): Promise<void> {
    await prisma.bow.delete({
      where: { id }
    })
  }

  // Search bows
  static async searchBows(query: string) {
    return await prisma.bow.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } }
        ]
      },
      include: {
        materials: {
          include: {
            ribbon: true
          }
        },
        salesHistory: {
          orderBy: { soldAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get bows by category
  static async getBowsByCategory(category: string) {
    return await prisma.bow.findMany({
      where: { category },
      include: {
        materials: {
          include: {
            ribbon: true
          }
        },
        salesHistory: {
          orderBy: { soldAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get bows by status
  static async getBowsByStatus(status: 'excellent' | 'good' | 'low') {
    return await prisma.bow.findMany({
      where: { status },
      include: {
        materials: {
          include: {
            ribbon: true
          }
        },
        salesHistory: {
          orderBy: { soldAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Record a sale
  static async recordSale(bowId: string, quantity: number, price: number, customer?: string, notes?: string) {
    return await prisma.sale.create({
      data: {
        bowId,
        quantity,
        price,
        customer,
        notes
      }
    })
  }

  // Get sales statistics
  static async getSalesStats() {
    const totalSales = await prisma.sale.aggregate({
      _sum: {
        price: true,
        quantity: true
      }
    })

    const recentSales = await prisma.sale.findMany({
      take: 10,
      orderBy: { soldAt: 'desc' },
      include: {
        bow: true
      }
    })

    return {
      totalRevenue: totalSales._sum.price || 0,
      totalUnitsSold: totalSales._sum.quantity || 0,
      recentSales
    }
  }
} 