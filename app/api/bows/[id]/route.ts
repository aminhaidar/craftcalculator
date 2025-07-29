import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bow = await prisma.bow.findUnique({
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
    
    if (!bow) {
      return NextResponse.json(
        { error: 'Bow not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(bow)
  } catch (error) {
    console.error('Error fetching bow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bow' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const bow = await prisma.bow.update({
      where: { id },
      data: body,
      include: {
        materials: {
          include: {
            ribbon: true
          }
        }
      }
    })
    return NextResponse.json(bow)
  } catch (error) {
    console.error('Error updating bow:', error)
    return NextResponse.json(
      { error: 'Failed to update bow' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const bow = await prisma.bow.update({
      where: { id },
      data: body,
      include: {
        materials: {
          include: {
            ribbon: true
          }
        }
      }
    })
    return NextResponse.json(bow)
  } catch (error) {
    console.error('Error updating bow:', error)
    return NextResponse.json(
      { error: 'Failed to update bow' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.bow.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bow:', error)
    return NextResponse.json(
      { error: 'Failed to delete bow' },
      { status: 500 }
    )
  }
} 