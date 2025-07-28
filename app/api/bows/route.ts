import { NextRequest, NextResponse } from 'next/server'
import { BowService } from '@/lib/services/bow-service'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let bows

    if (query) {
      bows = await BowService.searchBows(query)
    } else if (category) {
      bows = await BowService.getBowsByCategory(category)
    } else if (status) {
      bows = await BowService.getBowsByStatus(status as 'excellent' | 'good' | 'low')
    } else {
      bows = await BowService.getAllBows()
    }

    return NextResponse.json(bows)
  } catch (error) {
    console.error('Error fetching bows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bows' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Create the bow with the new data structure
    const bow = await prisma.bow.create({
      data: {
        name: data.name,
        description: `${data.description}\n\nVendor: ${data.vendorInfo?.name || 'Unknown'}\nPrimary Color: ${data.primaryColor || 'Unknown'}`,
        totalCost: data.totalCost,
        targetPrice: data.sellingPrice,
        profit: data.profit,
        profitMargin: data.profitMargin,
        status: data.profitMargin >= 50 ? 'excellent' : data.profitMargin >= 30 ? 'good' : 'low',
        timeToMake: '15-20 minutes',
        difficulty: 'Medium',
        category: 'Custom Bow',
        tags: ['custom', 'calculated'],
        layers: data.layers.length
      }
    })

    return NextResponse.json(bow, { status: 201 })
  } catch (error) {
    console.error('Error creating bow:', error)
    return NextResponse.json(
      { error: 'Failed to create bow' },
      { status: 500 }
    )
  }
} 