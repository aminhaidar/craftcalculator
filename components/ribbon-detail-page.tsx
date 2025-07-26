"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Package, DollarSign, TrendingUp, Calendar, Eye, Edit, Trash2, Plus, AlertTriangle, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface RibbonDetailPageProps {
  ribbon: any
}

export function RibbonDetailPage({ ribbon }: RibbonDetailPageProps) {
  const [bowsUsingRibbon, setBowsUsingRibbon] = useState([])
  const [recipesUsingRibbon, setRecipesUsingRibbon] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [ribbon.id])

  const fetchUsageData = async () => {
    try {
      setLoading(true)
      
      // Fetch bows that use this ribbon
      const bowsResponse = await fetch('/api/bows')
      const bows = await bowsResponse.json()
      const bowsUsingThisRibbon = bows.filter((bow: any) => 
        bow.materials?.some((material: any) => material.ribbonId === ribbon.id)
      )
      setBowsUsingRibbon(bowsUsingThisRibbon)

      // Fetch recipes that use this ribbon
      const recipesResponse = await fetch('/api/recipes')
      const recipes = await recipesResponse.json()
      const recipesUsingThisRibbon = recipes.filter((recipe: any) => 
        recipe.layers?.some((layer: any) => layer.ribbonId === ribbon.id)
      )
      setRecipesUsingRibbon(recipesUsingThisRibbon)
    } catch (error) {
      console.error('Error fetching usage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRibbonColor = (colors: string[]) => {
    if (colors && colors.length > 0) {
      const color = colors[0].toLowerCase()
      const colorMap: { [key: string]: string } = {
        'pink': '#ff69b4',
        'red': '#ff4444',
        'blue': '#4444ff',
        'green': '#44ff44',
        'purple': '#8844ff',
        'gold': '#ffd700',
        'silver': '#c0c0c0',
        'white': '#ffffff',
        'black': '#000000',
        'yellow': '#ffff00',
        'orange': '#ffa500',
        'brown': '#8b4513',
        'gray': '#808080',
        'grey': '#808080'
      }
      return colorMap[color] || '#cccccc'
    }
    return '#cccccc'
  }

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current <= min) return { status: "low", color: "bg-red-500", text: "Low Stock", variant: "destructive" as const }
    if (percentage <= 50) return { status: "medium", color: "bg-yellow-500", text: "Medium", variant: "secondary" as const }
    return { status: "good", color: "bg-green-500", text: "Good", variant: "default" as const }
  }

  const calculateMetrics = () => {
    const averageBowUsage = 24 // inches
    const bowsWithCurrentStock = Math.floor((ribbon.inStock || 0) / averageBowUsage)
    const currentInventoryValue = (ribbon.inStock || 0) * (ribbon.costPerYard || 0)
    const costPerBow = (averageBowUsage / 36) * (ribbon.costPerYard || 0)
    const stockPercentage = ribbon.maxStock ? ((ribbon.inStock || 0) / ribbon.maxStock) * 100 : 0
    
    return {
      bowsWithCurrentStock,
      currentInventoryValue,
      costPerBow,
      stockPercentage
    }
  }

  const metrics = calculateMetrics()
  const stockStatus = getStockStatus(ribbon.inStock || 0, ribbon.minStock || 0, ribbon.maxStock || 1)
  const ribbonColor = getRibbonColor(ribbon.colors || [])

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <Link href="/inventory">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-12 h-12 rounded-full border-2 border-gray-200 flex-shrink-0"
              style={{ backgroundColor: ribbonColor }}
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{ribbon.ribbonType}</h1>
              <p className="text-lg text-muted-foreground">
                {ribbon.colors?.join(", ")} • {ribbon.widthInches}" × {ribbon.rollLengthYards}yd
              </p>
              {ribbon.theme && (
                <Badge variant="outline" className="mt-2">
                  {ribbon.theme}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stock
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ribbon.inStock || 0}</div>
            <p className="text-xs text-muted-foreground">
              {ribbon.minStock && ribbon.maxStock ? `${ribbon.minStock}-${ribbon.maxStock} range` : 'No range set'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.currentInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current stock value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bows Possible</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bowsWithCurrentStock}</div>
            <p className="text-xs text-muted-foreground">With current stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge 
              variant={stockStatus.variant}
              className="mb-1"
            >
              {stockStatus.text}
            </Badge>
            <p className="text-xs text-muted-foreground">
              {metrics.stockPercentage.toFixed(0)}% of max
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Level</CardTitle>
          <CardDescription>Current inventory level and target range</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{ribbon.inStock || 0} yards in stock</span>
            <span>{ribbon.maxStock ? `${ribbon.maxStock} yards max` : 'No max set'}</span>
          </div>
          <Progress value={metrics.stockPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {ribbon.minStock || 0} yards</span>
            <span>Max: {ribbon.maxStock || 'Not set'} yards</span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Ribbon Image */}
          {ribbon.imageUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Ribbon Image</CardTitle>
              </CardHeader>
              <CardContent>
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={ribbon.imageUrl}
                    alt={`${ribbon.ribbonType} ribbon`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </AspectRatio>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Ribbon Details */}
            <Card>
              <CardHeader>
                <CardTitle>Ribbon Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <p className="text-sm">{ribbon.ribbonType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Material</label>
                    <p className="text-sm">{ribbon.material}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Width</label>
                    <p className="text-sm">{ribbon.widthInches}"</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Roll Length</label>
                    <p className="text-sm">{ribbon.rollLengthYards} yards</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Design</label>
                    <p className="text-sm">{ribbon.designType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Wired</label>
                    <p className="text-sm">{ribbon.wired ? "Yes" : "No"}</p>
                  </div>
                </div>

                {ribbon.theme && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Theme</label>
                    <Badge variant="outline">{ribbon.theme}</Badge>
                  </div>
                )}

                {ribbon.colors && ribbon.colors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Colors</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {ribbon.colors.map((color: string, index: number) => (
                        <Badge key={index} variant="outline">{color}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost & Supplier Info */}
            <Card>
              <CardHeader>
                <CardTitle>Cost & Supplier</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cost per Yard</label>
                    <p className="text-2xl font-bold">${ribbon.costPerYard?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cost per Bow</label>
                    <p className="text-2xl font-bold">${metrics.costPerBow.toFixed(2)}</p>
                  </div>
                </div>

                {ribbon.brand && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Brand</label>
                    <p className="text-sm">{ribbon.brand}</p>
                  </div>
                )}

                {ribbon.supplier && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Supplier</label>
                    <p className="text-sm">{ribbon.supplier}</p>
                  </div>
                )}

                {ribbon.lastOrdered && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Ordered</label>
                    <p className="text-sm">{new Date(ribbon.lastOrdered).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Bows Using This Ribbon */}
            <Card>
              <CardHeader>
                <CardTitle>Bows Using This Ribbon</CardTitle>
                <CardDescription>
                  {bowsUsingRibbon.length} bow{bowsUsingRibbon.length !== 1 ? 's' : ''} use this ribbon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : bowsUsingRibbon.length > 0 ? (
                  <div className="space-y-3">
                    {bowsUsingRibbon.map((bow: any) => (
                      <div key={bow.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{bow.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {bow.materials?.find((m: any) => m.ribbonId === ribbon.id)?.quantity || 'Unknown amount'}
                          </p>
                        </div>
                        <Link href={`/bow/${bow.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-2" />
                    <p>No bows currently use this ribbon</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recipes Using This Ribbon */}
            <Card>
              <CardHeader>
                <CardTitle>Recipes Using This Ribbon</CardTitle>
                <CardDescription>
                  {recipesUsingRibbon.length} recipe{recipesUsingRibbon.length !== 1 ? 's' : ''} use this ribbon
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : recipesUsingRibbon.length > 0 ? (
                  <div className="space-y-3">
                    {recipesUsingRibbon.map((recipe: any) => (
                      <div key={recipe.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{recipe.name}</h4>
                          <p className="text-sm text-muted-foreground">{recipe.difficulty} • {recipe.estimatedTime}</p>
                        </div>
                        <Link href={`/recipes/${recipe.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="mx-auto h-8 w-8 mb-2" />
                    <p>No recipes currently use this ribbon</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>Insights about this ribbon's performance and usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{bowsUsingRibbon.length}</div>
                  <div className="text-sm text-muted-foreground">Bows Created</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{recipesUsingRibbon.length}</div>
                  <div className="text-sm text-muted-foreground">Recipes Used In</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{metrics.bowsWithCurrentStock}</div>
                  <div className="text-sm text-muted-foreground">Bows Possible</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 