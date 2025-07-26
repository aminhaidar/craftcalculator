import { NextRequest, NextResponse } from 'next/server'
import { RibbonService } from '@/lib/services/ribbon-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ribbon = await RibbonService.getRibbonById(params.id)
    
    if (!ribbon) {
      return NextResponse.json(
        { error: 'Ribbon not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(ribbon)
  } catch (error) {
    console.error('Error fetching ribbon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ribbon' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const ribbon = await RibbonService.updateRibbon({
      id: params.id,
      ...body
    })
    return NextResponse.json(ribbon)
  } catch (error) {
    console.error('Error updating ribbon:', error)
    return NextResponse.json(
      { error: 'Failed to update ribbon' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await RibbonService.deleteRibbon(params.id)
    return NextResponse.json({ message: 'Ribbon deleted successfully' })
  } catch (error) {
    console.error('Error deleting ribbon:', error)
    return NextResponse.json(
      { error: 'Failed to delete ribbon' },
      { status: 500 }
    )
  }
} 