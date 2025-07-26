import { NextRequest, NextResponse } from 'next/server'
import { RibbonService } from '@/lib/services/ribbon-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const availability = searchParams.get('availability')

    let ribbons

    if (query) {
      ribbons = await RibbonService.searchRibbons(query)
    } else if (availability) {
      ribbons = await RibbonService.getRibbonsByAvailability(availability as 'In stock' | 'Out of stock')
    } else {
      ribbons = await RibbonService.getAllRibbons()
    }

    return NextResponse.json(ribbons)
  } catch (error) {
    console.error('Error fetching ribbons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ribbons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const ribbon = await RibbonService.createRibbon(body)
    return NextResponse.json(ribbon, { status: 201 })
  } catch (error) {
    console.error('Error creating ribbon:', error)
    return NextResponse.json(
      { error: 'Failed to create ribbon' },
      { status: 500 }
    )
  }
} 