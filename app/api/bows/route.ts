import { NextRequest, NextResponse } from 'next/server'
import { BowService } from '@/lib/services/bow-service'

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
    const body = await request.json()
    const bow = await BowService.createBow(body)
    return NextResponse.json(bow, { status: 201 })
  } catch (error) {
    console.error('Error creating bow:', error)
    return NextResponse.json(
      { error: 'Failed to create bow' },
      { status: 500 }
    )
  }
} 