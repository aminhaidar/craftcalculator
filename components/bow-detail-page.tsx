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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/bows">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{bow.name}</h1>
            <p className="text-muted-foreground">{bow.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${bow.totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">With all fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Selling Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${bow.targetPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Recommended price</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit per Bow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${bow.profit.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After all costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{bow.profitMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Of selling price</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Cost Breakdown & Profit Analysis
          </CardTitle>
          <CardDescription>
            Detailed breakdown of all costs and profit calculations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground">Base Materials</p>
                             <p className="text-xl font-bold text-blue-600">
                 ${(bow.totalCost * 0.7).toFixed(2)}
               </p>
             </div>
             <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
               <p className="text-sm text-muted-foreground">Platform Fee</p>
               <p className="text-xl font-bold text-orange-600">
                 ${(bow.targetPrice * 0.1).toFixed(2)}
               </p>
             </div>
             <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
               <p className="text-sm text-muted-foreground">Sales Tax</p>
               <p className="text-xl font-bold text-red-600">
                 ${(bow.targetPrice * 0.08).toFixed(2)}
               </p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-muted-foreground">Your Profit</p>
              <p className="text-xl font-bold text-green-600">${bow.profit.toFixed(2)}</p>
            </div>
          </div>
          
                     <div className="p-4 bg-muted/30 rounded-lg">
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium">Vendor Information</span>
               <Badge variant="outline">Standard Vendor</Badge>
             </div>
             <div className="grid grid-cols-3 gap-4 text-sm">
               <div>
                 <span className="text-muted-foreground">Fee Rate:</span>
                 <span className="ml-1 font-medium">10.0%</span>
               </div>
               <div>
                 <span className="text-muted-foreground">Tax Rate:</span>
                 <span className="ml-1 font-medium">8.0%</span>
               </div>
               <div>
                 <span className="text-muted-foreground">Shipping:</span>
                 <span className="ml-1 font-medium">$5.95</span>
               </div>
             </div>
           </div>
        </CardContent>
      </Card>

      {/* Ribbon Usage Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ribbon Usage Optimization
          </CardTitle>
          <CardDescription>
            Efficiency analysis for each ribbon layer
          </CardDescription>
        </CardHeader>
        <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {bow.materials.map((material, index) => (
               <div 
                 key={index}
                 className="text-center p-4 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
               >
                 <div 
                   className="w-8 h-8 rounded-full mx-auto mb-2 border border-gray-300"
                   style={{ backgroundColor: '#ef4444' }}
                 />
                 <p className="text-sm font-medium">Layer {index + 1}</p>
                 <p className="text-lg font-bold text-blue-600">
                   {material.name}
                 </p>
                 <p className="text-xs text-muted-foreground">
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
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Layer Breakdown
          </CardTitle>
          <CardDescription>
            Detailed specifications for each layer
          </CardDescription>
        </CardHeader>
        <CardContent>
                     <div className="space-y-4">
             {bow.materials.map((material, index) => (
               <div 
                 key={index}
                 className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
               >
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div 
                       className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border border-gray-300"
                       style={{ backgroundColor: '#ef4444' }}
                     >
                       {index + 1}
                     </div>
                     <div>
                       <p className="font-semibold">{material.name}</p>
                       <p className="text-sm text-muted-foreground">
                         {material.quantity}
                       </p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-lg">${material.cost.toFixed(2)}</p>
                     <p className="text-sm text-muted-foreground">
                       Layer {index + 1}
                     </p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Link href="/bow-calculator">
          <Button variant="outline" className="gap-2">
            <Calculator className="h-4 w-4" />
            Design New Bow
          </Button>
        </Link>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Edit This Bow
        </Button>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Save as Recipe
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Bow
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Bow
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{bow.name}"? This action cannot be undone and will permanently remove the bow from your library.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
  )
} 