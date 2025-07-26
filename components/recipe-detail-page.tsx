"use client"

import { useState, useEffect } from "react"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Clock, 
  Tag, 
  DollarSign, 
  Scissors, 
  Layers,
  Palette,
  Copy,
  Share2,
  Eye,
  Plus,
  Calendar,
  TrendingUp,
  Package
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { type BowRecipe } from "@/lib/bow-data"
import { getAllBows, type Bow } from "@/lib/bow-data"
import { getAllRibbons, type RibbonInventoryRecord } from "@/lib/ribbon-data"

interface RecipeDetailPageProps {
  recipe: BowRecipe
}

export function RecipeDetailPage({ recipe }: RecipeDetailPageProps) {
  const [bows, setBows] = useState<Bow[]>([])
  const [ribbons, setRibbons] = useState<RibbonInventoryRecord[]>([])

  useEffect(() => {
    setBows(getAllBows())
    setRibbons(getAllRibbons())
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const calculateRecipeCost = () => {
    let totalCost = 0;
    let totalInches = 0;
    
    recipe.layers.forEach(layer => {
      const ribbon = ribbons.find(r => r.ribbonId === layer.ribbonId);
      if (ribbon && ribbon.costPerYard) {
        const loopInches = layer.loops.reduce((sum, loop) => sum + (loop.quantity * loop.length), 0);
        const tailInches = layer.tails.reduce((sum, tail) => sum + (tail.quantity * tail.length), 0);
        const layerInches = loopInches + tailInches;
        
        const layerYards = layerInches / 36;
        const layerCost = layerYards * ribbon.costPerYard;
        
        totalCost += layerCost;
        totalInches += layerInches;
      }
    });
    
    return {
      totalCost,
      totalInches,
      costPerInch: totalInches > 0 ? totalCost / totalInches : 0
    };
  }

  const getBowsUsingRecipe = () => {
    // This is a simplified check - in a real app, bows would have a recipeId field
    return bows.filter(bow => 
      bow.ribbons.some(ribbonName => 
        recipe.layers.some(layer => 
          layer.ribbonName.toLowerCase().includes(ribbonName.toLowerCase())
        )
      )
    )
  }

  const bowsUsingRecipe = getBowsUsingRecipe()
  const costInfo = calculateRecipeCost()

  const renderBowVisualization = () => {
    return (
      <div className="relative w-full h-48 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg overflow-hidden">
        {/* Bow Visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Bow Layers */}
            {recipe.layers.map((layer, index) => (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: '50%',
                  top: '50%',
                  width: `${60 - (index * 10)}px`,
                  height: `${60 - (index * 10)}px`,
                  backgroundColor: layer.color,
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  zIndex: recipe.layers.length - index
                }}
              />
            ))}
            
            {/* Bow Center */}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-300 shadow-sm z-10" />
            
            {/* Streamers */}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 mt-8">
              {recipe.layers.slice(0, 3).map((layer, index) => (
                <div
                  key={index}
                  className="w-1.5 h-12 mb-2 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Layer Count Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="text-sm">
            {recipe.layers.length} layers
          </Badge>
        </div>
      </div>
    )
  }

  const renderRibbonBreakdown = () => {
    return (
      <div className="space-y-4">
        {recipe.layers.map((layer, index) => {
          const ribbon = ribbons.find(r => r.ribbonId === layer.ribbonId)
          const totalInches = layer.loops.reduce((sum, loop) => sum + (loop.quantity * loop.length), 0) +
                             layer.tails.reduce((sum, tail) => sum + (tail.quantity * tail.length), 0)
          const layerCost = ribbon?.costPerYard ? ((totalInches / 36) * ribbon.costPerYard) : 0
          
          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div>
                      <CardTitle className="text-lg">{ribbon?.ribbonType || layer.ribbonName}</CardTitle>
                      <CardDescription>Layer {index + 1}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">${layerCost.toFixed(2)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ribbon Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{ribbon?.designType || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Width:</span>
                    <p className="font-medium">{ribbon?.widthInches || 'Unknown'}"</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost/Yard:</span>
                    <p className="font-medium">${ribbon?.costPerYard?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Inches:</span>
                    <p className="font-medium">{totalInches}"</p>
                  </div>
                </div>

                {/* Loops and Tails */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Loops</h4>
                    <div className="space-y-2">
                      {layer.loops.map((loop, loopIndex) => (
                        <div key={loopIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{loop.quantity} × {loop.length}"</span>
                          <span className="text-sm font-medium">{loop.quantity * loop.length}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tails</h4>
                    <div className="space-y-2">
                      {layer.tails.map((tail, tailIndex) => (
                        <div key={tailIndex} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{tail.quantity} × {tail.length}"</span>
                          <span className="text-sm font-medium">{tail.quantity * tail.length}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderRelatedBows = () => {
    if (bowsUsingRecipe.length === 0) {
      return (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bows using this recipe yet</h3>
          <p className="text-muted-foreground mb-4">
            Create bows using this recipe to see them listed here
          </p>
          <Link href="/bow/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Bow with This Recipe
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bowsUsingRecipe.map((bow) => (
          <Card key={bow.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{bow.name}</CardTitle>
              <CardDescription className="line-clamp-2">{bow.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Cost:</span>
                <span className="font-medium">${bow.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${bow.targetPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profit:</span>
                <span className="font-medium text-green-600">${bow.profit.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(bow.difficulty)}>
                  {bow.difficulty}
                </Badge>
                <Badge variant="outline">{bow.category}</Badge>
              </div>
              <Link href={`/bow/${bow.id}`}>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Eye className="h-4 w-4" />
                  View Bow
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/recipes">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Recipes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{recipe.name}</h1>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Recipe Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bow Visualization */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Bow Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBowVisualization()}
            </CardContent>
          </Card>
        </div>

        {/* Recipe Stats */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipe.layers.length}</div>
                  <div className="text-sm text-muted-foreground">Layers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${costInfo.totalCost.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Total Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{costInfo.totalInches.toFixed(0)}"</div>
                  <div className="text-sm text-muted-foreground">Total Length</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{bowsUsingRecipe.length}</div>
                  <div className="text-sm text-muted-foreground">Bows Using</div>
                </div>
              </div>

              <Separator />

              {/* Recipe Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Time to Make:</span>
                    <span className="font-medium">{recipe.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Category:</span>
                    <span className="font-medium">{recipe.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Cost per Inch:</span>
                    <span className="font-medium">${costInfo.costPerInch.toFixed(3)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="ribbons" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ribbons">Ribbon Breakdown</TabsTrigger>
          <TabsTrigger value="bows">Related Bows ({bowsUsingRecipe.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="ribbons" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ribbon Materials</CardTitle>
              <CardDescription>
                Detailed breakdown of all ribbons and measurements used in this recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderRibbonBreakdown()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bows Using This Recipe</CardTitle>
              <CardDescription>
                All bows that have been created using this recipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderRelatedBows()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Cost</span>
                    <span className="font-medium">${costInfo.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost per Inch</span>
                    <span className="font-medium">${costInfo.costPerInch.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Length</span>
                    <span className="font-medium">{costInfo.totalInches.toFixed(0)} inches</span>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {bowsUsingRecipe.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Bows created with this recipe
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recipe Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Difficulty Level</span>
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time to Make</span>
                    <span className="font-medium">{recipe.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Layer Complexity</span>
                    <span className="font-medium">{recipe.layers.length} layers</span>
                  </div>
                </div>
                <Separator />
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {recipe.tags.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recipe tags
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 