"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calculator, Edit, Save, BookOpen, Eye, TrendingUp, Package, Scissors, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { calculateRibbonUsageSummary } from "@/lib/services/cost-calculator"

interface BowDetailPageProps {
  bowId: string
}

interface BowData {
  id: string
  name: string
  description: string
  totalCost: number
  targetPrice: number
  profit: number
  profitMargin: number
  status: string
  category: string
  tags: string[]
  layers: number
  createdAt: string
  materials: Array<{
    name: string
    quantity: string
    cost: number
  }>
}

export function BowDetailPage({ bowId }: BowDetailPageProps) {
  const [bow, setBow] = useState<BowData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchBow = async () => {
      try {
        const response = await fetch(`/api/bows/${bowId}`)
        if (!response.ok) {
          throw new Error('Bow not found')
        }
        const bowData = await response.json()
        setBow(bowData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bow')
      } finally {
        setLoading(false)
      }
    }

    fetchBow()
  }, [bowId])

  const handleDelete = async () => {
    if (!bow) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/bows/${bow.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "🎉 Bow deleted successfully",
          description: "The bow has been removed from your library.",
        })
        
        // Add a small delay for better UX
        setTimeout(() => {
          router.push('/bows')
        }, 1000)
      } else {
        throw new Error('Failed to delete bow')
      }
    } catch (error) {
      console.error('Error deleting bow:', error)
      toast({
        title: "Error deleting bow",
        description: "Please try again or check your connection.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-muted-foreground">Loading bow details...</p>
        </div>
      </div>
    )
  }

  if (error || !bow) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <Eye className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Bow not found</h3>
        <p className="text-muted-foreground mb-4">
          The bow you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/bows">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bow Library
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link href="/bows" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">{bow.name}</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">{bow.description}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <Card className="p-3 sm:p-4">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-red-600">${bow.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">With all fees</p>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Selling Price</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-green-600">${bow.targetPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Recommended price</p>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Profit per Bow</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-purple-600">${bow.profit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">After all costs</p>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4">
          <CardHeader className="pb-2 px-0">
            <CardTitle className="text-xs sm:text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-base sm:text-lg lg:text-2xl font-bold text-indigo-600">{bow.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Of selling price</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Cost Breakdown & Profit Analysis
          </CardTitle>
          <CardDescription className="text-sm">
            Detailed breakdown of all costs and profit calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <div className="text-center p-2 sm:p-3 lg:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs sm:text-sm text-muted-foreground">Base Materials</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-blue-600 mt-1">
                ${(bow.totalCost * 0.7).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 lg:p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-xs sm:text-sm text-muted-foreground">Platform Fee</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-orange-600 mt-1">
                ${(bow.targetPrice * 0.1).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 lg:p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xs sm:text-sm text-muted-foreground">Sales Tax</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-red-600 mt-1">
                ${(bow.targetPrice * 0.08).toFixed(2)}
              </p>
            </div>
            <div className="text-center p-2 sm:p-3 lg:p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs sm:text-sm text-muted-foreground">Your Profit</p>
              <p className="text-sm sm:text-lg lg:text-xl font-bold text-green-600 mt-1">${bow.profit.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="p-3 sm:p-4 bg-muted/30 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 sm:mb-2">
              <span className="text-sm font-medium">Vendor Information</span>
              <Badge variant="outline" className="w-fit">Standard Vendor</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
              <div className="flex justify-between sm:block">
                <span className="text-muted-foreground">Fee Rate:</span>
                <span className="font-medium sm:ml-1">10.0%</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-muted-foreground">Tax Rate:</span>
                <span className="font-medium sm:ml-1">8.0%</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium sm:ml-1">$5.95</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ribbon Usage Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            Ribbon Usage Optimization
          </CardTitle>
          <CardDescription className="text-sm">
            Efficiency analysis for each ribbon layer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            {bow.materials.map((material, index) => (
              <div 
                key={index}
                className="text-center p-2 sm:p-3 lg:p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div 
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full mx-auto mb-2 border border-gray-300"
                  style={{ backgroundColor: '#ef4444' }}
                />
                <p className="text-xs sm:text-sm font-medium">Layer {index + 1}</p>
                <p className="text-xs sm:text-sm lg:text-lg font-bold text-blue-600 mt-1">
                  {material.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {material.quantity}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${material.cost.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Layer Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Scissors className="h-4 w-4 sm:h-5 sm:w-5" />
            Layer Breakdown
          </CardTitle>
          <CardDescription className="text-sm">
            Detailed specifications for each layer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            {bow.materials.map((material, index) => (
              <div 
                key={index}
                className="p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold border border-gray-300 text-xs sm:text-sm lg:text-base"
                      style={{ backgroundColor: '#ef4444' }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-xs sm:text-sm lg:text-base">{material.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {material.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="font-bold text-sm sm:text-base lg:text-lg">${material.cost.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      Layer {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex flex-col gap-3 pt-6 pb-8 sm:pb-6">
        {/* Primary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <Link href="/bow-calculator" className="w-full">
            <Button variant="outline" className="w-full h-12 gap-2 text-sm sm:text-base">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Design New Bow</span>
              <span className="sm:hidden">New Bow</span>
            </Button>
          </Link>
          <Button className="w-full h-12 gap-2 text-sm sm:text-base">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Edit This Bow</span>
            <span className="sm:hidden">Edit Bow</span>
          </Button>
        </div>
        
        {/* Secondary Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <Button variant="outline" className="w-full h-12 gap-2 text-sm sm:text-base">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Save as Recipe</span>
            <span className="sm:hidden">Save Recipe</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full h-12 gap-2 text-sm sm:text-base">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete Bow</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Delete Bow
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{bow.name}"? This action cannot be undone and will permanently remove the bow from your library.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Bow
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
} 