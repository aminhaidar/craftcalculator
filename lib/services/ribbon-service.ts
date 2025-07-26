import { prisma } from '../db'
import type { Ribbon } from '@prisma/client'

export interface CreateRibbonData {
  ribbonType: string
  material: string
  wired: boolean
  widthInches: number
  rollLengthYards: number
  designType: string
  theme?: string
  colors: string[]
  availability: 'In stock' | 'Out of stock'
  brand?: string
  costPerYard?: number
  supplier?: string
  lastOrdered?: Date
  inStock?: number
  minStock?: number
  maxStock?: number
}

export interface UpdateRibbonData extends Partial<CreateRibbonData> {
  id: string
}

export class RibbonService {
  // Get all ribbons
  static async getAllRibbons(): Promise<Ribbon[]> {
    return await prisma.ribbon.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get ribbon by ID
  static async getRibbonById(id: string): Promise<Ribbon | null> {
    return await prisma.ribbon.findUnique({
      where: { id }
    })
  }

  // Create new ribbon
  static async createRibbon(data: CreateRibbonData): Promise<Ribbon> {
    return await prisma.ribbon.create({
      data: {
        ribbonType: data.ribbonType,
        material: data.material,
        wired: data.wired,
        widthInches: data.widthInches,
        rollLengthYards: data.rollLengthYards,
        designType: data.designType,
        theme: data.theme,
        colors: data.colors,
        availability: data.availability,
        brand: data.brand,
        costPerYard: data.costPerYard,
        supplier: data.supplier,
        lastOrdered: data.lastOrdered,
        inStock: data.inStock,
        minStock: data.minStock,
        maxStock: data.maxStock
      }
    })
  }

  // Update ribbon
  static async updateRibbon(data: UpdateRibbonData): Promise<Ribbon> {
    const { id, ...updateData } = data
    return await prisma.ribbon.update({
      where: { id },
      data: updateData
    })
  }

  // Delete ribbon
  static async deleteRibbon(id: string): Promise<void> {
    await prisma.ribbon.delete({
      where: { id }
    })
  }

  // Search ribbons
  static async searchRibbons(query: string): Promise<Ribbon[]> {
    return await prisma.ribbon.findMany({
      where: {
        OR: [
          { ribbonType: { contains: query, mode: 'insensitive' } },
          { designType: { contains: query, mode: 'insensitive' } },
          { theme: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { supplier: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get ribbons by availability
  static async getRibbonsByAvailability(availability: 'In stock' | 'Out of stock'): Promise<Ribbon[]> {
    return await prisma.ribbon.findMany({
      where: { availability },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Get low stock ribbons
  static async getLowStockRibbons(): Promise<Ribbon[]> {
    return await prisma.ribbon.findMany({
      where: {
        AND: [
          { inStock: { not: null } },
          { minStock: { not: null } },
          { inStock: { lte: { minStock: true } } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Update stock levels
  static async updateStock(id: string, newStock: number): Promise<Ribbon> {
    return await prisma.ribbon.update({
      where: { id },
      data: { 
        inStock: newStock,
        availability: newStock > 0 ? 'In stock' : 'Out of stock'
      }
    })
  }
} 