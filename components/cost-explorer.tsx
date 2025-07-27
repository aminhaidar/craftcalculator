"use client"

import { useState, useEffect } from "react"
import { Calculator, Target, TrendingUp, Package, DollarSign, Plus, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useRibbons } from "@/hooks/use-api-data"
import { getAllRecipes, BowRecipe } from "@/lib/bow-data"

interface Layer {
  id: string
  ribbonType: string
  ribbonId: string
  quantity: number
  costPerYard: number
  widthInches: number
  colors: string[]
}

export function CostExplorer() {
  const { ribbons } = useRibbons()
  const [layers, setLayers] = useState<Layer[]>([])
  const [markupPercentage, setMarkupPercentage] = useState(50)
  const [targetPrice, setTargetPrice] = useState(0)
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const recipes = getAllRecipes()

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      ribbonType: "",
      ribbonId: "",
      quantity: 24, // 24 inches per layer
      costPerYard: 0,
      widthInches: 1.5,
      colors: []
    }
    setLayers([...layers, newLayer])
  }

  const removeLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id))
  }

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, ...updates } : layer
    ))
  }

  const loadRecipe = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId)
    if (!recipe) return

    const recipeLayers: Layer[] = recipe.layers.map((layer, index) => {
      const ribbon = ribbons.find(r => r.id === layer.ribbonId)
      const totalLength = layer.loops.reduce((sum, loop) => sum + (loop.quantity * loop.length), 0)
      
      return {
        id: Date.now().toString() + index,
        ribbonType: layer.ribbonName,
        ribbonId: layer.ribbonId,
        quantity: totalLength,
        costPerYard: ribbon?.costPerYard || 0,
        widthInches: ribbon?.widthInches || 1.5,
        colors: ribbon?.colors || []
      }
    })

    setLayers(recipeLayers)
    setSelectedRecipe(recipeId)
  }

  const clearRecipe = () => {
    setLayers([])
    setSelectedRecipe("")
  }

  const calculateCosts = () => {
    const totalCost = layers.reduce((sum, layer) => {
      const yardsUsed = layer.quantity / 36 // Convert inches to yards
      return sum + (yardsUsed * layer.costPerYard)
    }, 0)

    const suggestedPrice = totalCost * (1 + markupPercentage / 100)
    const profit = suggestedPrice - totalCost
    const profitMargin = totalCost > 0 ? (profit / suggestedPrice) * 100 : 0

    return {
      totalCost,
      suggestedPrice,
      profit,
      profitMargin
    }
  }

  const calculateBowsPerRoll = (ribbonId: string) => {
    const ribbon = ribbons.find(r => r.id === ribbonId)
    if (!ribbon) return 0
    
    const layer = layers.find(l => l.ribbonId === ribbonId)
    if (!layer) return 0
    
    const yardsPerBow = layer.quantity / 36
    return Math.floor(ribbon.rollLengthYards / yardsPerBow)
  }

  const costs = calculateCosts()

  return (
    <div className="space-y-6">

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Bow Configuration
              </CardTitle>
              <CardDescription>
                Add ribbon layers and configure quantities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipe Selection */}
              <div className="space-y-3">
                <Label>Start with a Recipe (Optional)</Label>
                <div className="flex gap-2">
                  <Select value={selectedRecipe} onValueChange={loadRecipe}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choose a recipe to start with..." />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes.map(recipe => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          {recipe.name} - {recipe.difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRecipe && (
                    <Button variant="outline" size="sm" onClick={clearRecipe}>
                      Clear
                    </Button>
                  )}
                </div>
                {selectedRecipe && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Loaded recipe: {recipes.find(r => r.id === selectedRecipe)?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {recipes.find(r => r.id === selectedRecipe)?.description}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipes.find(r => r.id === selectedRecipe)?.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Layers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ribbon Layers</Label>
                  <Button onClick={addLayer} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Layer
                  </Button>
                </div>
                
                {layers.map((layer, index) => (
                  <Card key={layer.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">Layer {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLayer(layer.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-3">
                      <div>
                        <Label>Ribbon Type</Label>
                        <Select
                          value={layer.ribbonId}
                          onValueChange={(value) => {
                            const ribbon = ribbons.find(r => r.id === value)
                            updateLayer(layer.id, {
                              ribbonId: value,
                              ribbonType: ribbon?.ribbonType || "",
                              costPerYard: ribbon?.costPerYard || 0,
                              widthInches: ribbon?.widthInches || 1.5,
                              colors: ribbon?.colors || []
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select ribbon" />
                          </SelectTrigger>
                          <SelectContent>
                            {ribbons.map(ribbon => (
                              <SelectItem key={ribbon.id} value={ribbon.id}>
                                {ribbon.ribbonType} - {ribbon.colors?.join(", ")} ({ribbon.widthInches}")
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Quantity (inches)</Label>
                        <Input
                          type="number"
                          value={layer.quantity}
                          onChange={(e) => updateLayer(layer.id, { quantity: parseInt(e.target.value) || 0 })}
                          placeholder="24"
                        />
                      </div>
                      
                      {layer.ribbonId && (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Cost/Yard:</span>
                            <span className="ml-1 font-medium">${layer.costPerYard.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Bows/Roll:</span>
                            <span className="ml-1 font-medium">{calculateBowsPerRoll(layer.ribbonId)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
                
                {layers.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="text-center py-8 text-muted-foreground">
                      <Package className="h-8 w-8 mx-auto mb-2" />
                      <p>No layers added yet</p>
                      <p className="text-sm">Click "Add Layer" to get started</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <Separator />
              
              {/* Markup Configuration */}
              <div>
                <Label>Markup Percentage</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    type="number"
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(parseInt(e.target.value) || 0)}
                    placeholder="50"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <div className="mt-2 space-y-2">
                  <Progress value={Math.min(markupPercentage, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    This percentage will be added to your total cost to suggest a selling price
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Cost:</span>
                  <span className="font-bold text-lg">${costs.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Suggested Price:</span>
                  <span className="font-bold text-lg text-green-600">${costs.suggestedPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profit:</span>
                  <span className="font-bold text-green-600">${costs.profit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Profit Margin:</span>
                  <span className="font-bold text-green-600">{costs.profitMargin.toFixed(1)}%</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <Label>Target Price</Label>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="flex-1"
                  />
                </div>
                {targetPrice > 0 && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Profit at target price: </span>
                    <span className={`font-medium ${targetPrice > costs.totalCost ? 'text-green-600' : 'text-red-600'}`}>
                      ${(targetPrice - costs.totalCost).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {layers.length === 0 ? (
                <p className="text-muted-foreground">Add ribbon layers or select a recipe to see recommendations</p>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default" className="w-2 h-2 p-0 bg-green-500"></Badge>
                    <span>Consider pricing between ${(costs.totalCost * 1.3).toFixed(2)} - ${(costs.totalCost * 2.0).toFixed(2)} for competitive margins</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default" className="w-2 h-2 p-0 bg-blue-500"></Badge>
                    <span>You can make {Math.min(...layers.map(l => calculateBowsPerRoll(l.ribbonId)))} bows with your current ribbon inventory</span>
                  </div>
                  {selectedRecipe && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="default" className="w-2 h-2 p-0 bg-purple-500"></Badge>
                      <span>Based on recipe: {recipes.find(r => r.id === selectedRecipe)?.estimatedTime} to make</span>
                    </div>
                  )}
                  {costs.profitMargin < 30 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="default" className="w-2 h-2 p-0 bg-amber-500"></Badge>
                      <span>Consider increasing markup for better profit margins</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 gap-2">
              <Plus className="h-4 w-4" />
              Create Bow from This Design
            </Button>
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              Save as Recipe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 