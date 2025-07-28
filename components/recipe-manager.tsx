"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Clock, 
  Tag, 
  Palette,
  Layers,
  DollarSign,
  Scissors,
  Sparkles,
  ArrowRight,
  Eye,
  Copy,
  Share2,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { useRecipes, useBows, useRibbons } from "@/hooks/use-api-data"

// Constants for ribbon options
const RibbonTypeOptions = [
  'Burlap & Jute','Canvas','Cotton','Denim','Dupioni','Flannel',
  'Flocked','Fur','Glitter','Grosgrain','Lace','Metallic Foil',
  'Metallic Lamé','Organza','Poly Mesh','Sackcloth & Linen',
  'Satin','Sheer','Taffeta','Tinsel','Translucent PVC','Velvet',
  'Water Resistant','Webbing'
];

const WidthOptions = [
  0.625, 0.875, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0
];

const RollLengthOptions = [5, 10, 20, 25, 30, 50, 100, 500];

const DesignTypeOptions = [
  'Animal Print','Basket Weave','Camouflage','Check','Chevron',
  'Damask','Embroidered','Floral','Geometric','Harlequin',
  'Houndstooth','Marble','Ombre','Plaid','Polka Dot','Quatrefoil',
  'Seasonal Print','Solid','Stripes','Text','Two Tone','Windowpane'
];

const ColorOptions = [
  'Beige','Black','Blue','Brown','Gold','Green','Grey','Orange',
  'Pink','Purple','Red','Silver','White','Yellow','Iridescent'
];

// Type definitions
interface BowRecipe {
  id: string
  name: string
  description: string
  layers: {
    ribbonId: string
    ribbonName: string
    color: string
    loops: { quantity: number; length: number }[]
    tails: { quantity: number; length: number }[]
  }[]
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  tags: string[]
}

interface RibbonInventoryRecord {
  ribbonId: string
  ribbonType: string
  material: string
  wired: boolean
  widthInches: number
  rollLengthYards: number
  designType: string
  theme?: string
  colors?: string[]
  availability: 'In stock' | 'Out of stock'
  brand?: string
  costPerYard?: number
  supplier?: string
  lastOrdered?: string
  inStock?: number
  minStock?: number
  maxStock?: number
  imageUrl?: string
}

interface Bow {
  id: string
  name: string
  description: string
  image: string
  totalCost: number
  targetPrice: number
  profit: number
  profitMargin: number
  status: "excellent" | "good" | "low"
  createdAt: string
  ribbons: string[]
  layers: number
  timeToMake: string
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  tags: string[]
  materials: {
    name: string
    quantity: string
    cost: number
  }[]
  instructions: string[]
  salesHistory: {
    month: string
    sales: number
    revenue: number
  }[]
}

interface RecipeManagerProps {
  onRecipeSelect?: (recipe: BowRecipe) => void
  onClose?: () => void
}

export function RecipeManager({ onRecipeSelect, onClose }: RecipeManagerProps) {
  const { recipes, loading: recipesLoading, refetch: refetchRecipes } = useRecipes()
  const { bows, loading: bowsLoading } = useBows()
  const { ribbons, loading: ribbonsLoading } = useRibbons()
  const [isCreating, setIsCreating] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState<BowRecipe | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showRibbonForm, setShowRibbonForm] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [newRibbonData, setNewRibbonData] = useState({
    ribbonType: "",
    widthInches: 1.5,
    rollLengthYards: 25,
    designType: "Solid",
    colors: ["Black"],
    availability: "In stock" as 'In stock' | 'Out of stock',
    costPerYard: 0,
    brand: "",
    supplier: ""
  })

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    estimatedTime: "",
    tags: "",
    layers: [
      {
        ribbonId: "",
        ribbonName: "",
        color: "#ef4444",
        loops: [{ quantity: 4, length: 6 }],
        tails: [{ quantity: 2, length: 8 }]
      }
    ]
  })

  const categories = ["all", "Classic", "Garden", "Holiday", "Custom"]

  const handleCreateNew = () => {
    setIsCreating(true)
    setEditingRecipe(null)
    setFormData({
      name: "",
      description: "",
      category: "",
      difficulty: "Medium",
      estimatedTime: "",
      tags: "",
      layers: [
        {
          ribbonId: "",
          ribbonName: "",
          color: "#ef4444",
          loops: [{ quantity: 4, length: 6 }],
          tails: [{ quantity: 2, length: 8 }]
        }
      ]
    })
  }

  const handleEdit = (recipe: BowRecipe) => {
    setEditingRecipe(recipe)
    setIsCreating(false)
    setFormData({
      name: recipe.name,
      description: recipe.description,
      category: recipe.category,
      difficulty: recipe.difficulty,
      estimatedTime: recipe.estimatedTime,
      tags: recipe.tags.join(", "),
      layers: recipe.layers
    })
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Recipe name is required.",
        variant: "destructive",
      })
      return
    }

    const invalidLayers = formData.layers.filter(layer => !layer.ribbonId.trim());
    if (invalidLayers.length > 0) {
      toast({
        title: "Error",
        description: "All layers must have ribbons selected from inventory.",
        variant: "destructive",
      })
      return
    }

    const recipeData = {
      name: formData.name,
      description: formData.description,
      category: formData.category || "Custom",
      difficulty: formData.difficulty,
      estimatedTime: formData.estimatedTime,
      tags: formData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
      layers: formData.layers.filter(layer => layer.ribbonId.trim())
    }

    try {
      if (editingRecipe) {
        const response = await fetch(`/api/recipes/${editingRecipe.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeData)
        })
        
        if (!response.ok) throw new Error('Failed to update recipe')
        
        toast({
          title: "Recipe Updated",
          description: "Your recipe has been updated successfully.",
        })
      } else {
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeData)
        })
        
        if (!response.ok) throw new Error('Failed to create recipe')
        
        toast({
          title: "Recipe Created",
          description: "Your new recipe has been saved successfully.",
        })
      }
      
      refetchRecipes()
      setIsCreating(false)
      setEditingRecipe(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (recipe: BowRecipe) => {
    if (confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      try {
        const response = await fetch(`/api/recipes/${recipe.id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) throw new Error('Failed to delete recipe')
        
        refetchRecipes()
        toast({
          title: "Recipe Deleted",
          description: "The recipe has been removed.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete recipe. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingRecipe(null)
  }

  const addLayer = () => {
    setFormData(prev => ({
      ...prev,
      layers: [
        ...prev.layers,
        {
          ribbonId: "",
          ribbonName: "",
          color: "#3b82f6",
          loops: [{ quantity: 4, length: 6 }],
          tails: [{ quantity: 2, length: 8 }]
        }
      ]
    }))
  }

  const removeLayer = (index: number) => {
    setFormData(prev => ({
      ...prev,
      layers: prev.layers.filter((_, i) => i !== index)
    }))
  }

  const updateLayer = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      layers: prev.layers.map((layer, i) => 
        i === index ? { ...layer, [field]: value } : layer
      )
    }))
  }

  const handleAddRibbonToInventory = async () => {
    if (!newRibbonData.ribbonType.trim()) {
      toast({
        title: "Error",
        description: "Ribbon type is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const ribbonData = {
        ...newRibbonData,
        material: newRibbonData.ribbonType,
        wired: false,
        inStock: 0,
        minStock: 0,
        maxStock: 0
      };

      const response = await fetch('/api/ribbons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ribbonData)
      });

      if (!response.ok) throw new Error('Failed to add ribbon');

      setShowRibbonForm(false);
      setNewRibbonData({
        ribbonType: "",
        widthInches: 1.5,
        rollLengthYards: 25,
        designType: "Solid",
        colors: ["Black"],
        availability: "In stock",
        costPerYard: 0,
        brand: "",
        supplier: ""
      });

      toast({
        title: "Ribbon Added",
        description: "New ribbon has been added to inventory.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add ribbon. Please try again.",
        variant: "destructive"
      });
    }
  };

  const findRibbonInInventory = (ribbonName: string): RibbonInventoryRecord | undefined => {
    return ribbons.find((ribbon: RibbonInventoryRecord) => 
      ribbon.ribbonType.toLowerCase().includes(ribbonName.toLowerCase()) ||
      ribbon.designType.toLowerCase().includes(ribbonName.toLowerCase())
    );
  };

  const filteredRecipes = recipes.filter(recipe => 
    selectedCategory === "all" || recipe.category === selectedCategory
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const calculateRecipeCost = (recipe: BowRecipe) => {
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
  };

  const getBowsUsingRecipe = (recipe: BowRecipe) => {
    // This is a simplified check - in a real app, bows would have a recipeId field
    return bows.filter(bow => 
      bow.ribbons && bow.ribbons.some((ribbonName: string) => 
        recipe.layers && recipe.layers.some(layer => 
          layer.ribbonName && layer.ribbonName.toLowerCase().includes(ribbonName.toLowerCase())
        )
      )
    )
  }

  const renderBowVisualization = (recipe: BowRecipe) => {
    return (
      <div className="relative w-full h-32 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg overflow-hidden">
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
                  width: `${40 - (index * 8)}px`,
                  height: `${40 - (index * 8)}px`,
                  backgroundColor: layer.color,
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: recipe.layers.length - index
                }}
              />
            ))}
            
            {/* Bow Center */}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300 shadow-sm z-10" />
            
            {/* Streamers */}
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 mt-6">
              {recipe.layers.slice(0, 2).map((layer, index) => (
                <div
                  key={index}
                  className="w-1 h-8 mb-1 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Layer Count Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {recipe.layers.length} layers
          </Badge>
        </div>
      </div>
    )
  }

  const renderRibbonDetails = (recipe: BowRecipe) => {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-muted-foreground">Ribbon Breakdown</h4>
        {recipe.layers.map((layer, index) => {
          const ribbon = ribbons.find(r => r.ribbonId === layer.ribbonId)
          const totalInches = layer.loops.reduce((sum, loop) => sum + (loop.quantity * loop.length), 0) +
                             layer.tails.reduce((sum, tail) => sum + (tail.quantity * tail.length), 0)
          
          return (
            <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
              <div 
                className="w-4 h-4 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: layer.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {ribbon?.ribbonType || layer.ribbonName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {layer.loops.length} loops, {layer.tails.length} tails • {totalInches} inches
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                ${ribbon?.costPerYard ? ((totalInches / 36) * ribbon.costPerYard).toFixed(2) : '0.00'}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">Recipe Library</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Discover and manage your custom bow recipes</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Recipe</span>
          </Button>
        </div>
      </div>

      {/* Recipe Form */}
      {(isCreating || editingRecipe) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingRecipe ? "Edit Recipe" : "Create New Recipe"}
            </CardTitle>
            <CardDescription>
              Define the structure and materials for your bow recipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Recipe Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Classic Double Loop"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Classic, Holiday, Custom"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your recipe..."
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Estimated Time</label>
                <Input
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
                  placeholder="e.g., 15-20 minutes"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g., Classic, Simple, Gift"
                />
              </div>
            </div>

            {/* Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recipe Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const costInfo = calculateRecipeCost({
                    id: "",
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    difficulty: formData.difficulty,
                    estimatedTime: formData.estimatedTime,
                    tags: formData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
                    layers: formData.layers.filter(layer => layer.ribbonId.trim())
                  });
                  return (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Cost:</span>
                        <span className="font-semibold">${costInfo.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Total Inches:</span>
                        <span>{costInfo.totalInches.toFixed(0)} inches</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Cost per Inch:</span>
                        <span>${costInfo.costPerInch.toFixed(3)}</span>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            <Separator />

            {/* Layers */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold">Ribbon Layers</h3>
                <Button variant="outline" size="sm" onClick={addLayer} className="gap-2 self-start sm:self-auto">
                  <Plus className="h-4 w-4" />
                  Add Layer
                </Button>
              </div>

              <div className="space-y-4">
                {formData.layers.map((layer, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Layer {index + 1}</h4>
                      {formData.layers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLayer(index)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium">Ribbon Name</label>
                        <Input
                          value={layer.ribbonName}
                          readOnly
                          placeholder="Select ribbon from inventory"
                          className="bg-muted"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={layer.color}
                            onChange={(e) => updateLayer(index, "color", e.target.value)}
                            className="w-10 h-10 rounded border"
                          />
                          <Input
                            value={layer.color}
                            onChange={(e) => updateLayer(index, "color", e.target.value)}
                            placeholder="#ef4444"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Ribbon Selection</label>
                        <div className="space-y-2">
                          <Select 
                            value={layer.ribbonId} 
                            onValueChange={(value) => {
                              const selectedRibbon = ribbons.find(r => r.ribbonId === value);
                              if (selectedRibbon) {
                                updateLayer(index, "ribbonId", value);
                                updateLayer(index, "ribbonName", selectedRibbon.ribbonType);
                                updateLayer(index, "color", selectedRibbon.colors?.[0] ? `var(--${selectedRibbon.colors[0].toLowerCase()})` : '#ccc');
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ribbon from inventory" />
                            </SelectTrigger>
                            <SelectContent>
                              {ribbons.map(ribbon => (
                                <SelectItem key={ribbon.ribbonId} value={ribbon.ribbonId}>
                                  {ribbon.ribbonType} - {ribbon.designType} (${(ribbon.costPerYard || 0).toFixed(2)}/yard)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {ribbons.length === 0 && (
                            <div className="text-center p-2 bg-amber-50 dark:bg-amber-950/20 rounded">
                              <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                                No ribbons in inventory. Add some ribbons first!
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowRibbonForm(true)}
                              >
                                Add Ribbon to Inventory
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 mt-4">
                      <div>
                        <label className="text-sm font-medium">Loops</label>
                        <div className="space-y-2">
                          {layer.loops.map((loop, loopIndex) => (
                            <div key={loopIndex} className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={loop.quantity}
                                onChange={(e) => {
                                  const newLoops = [...layer.loops]
                                  newLoops[loopIndex] = { ...loop, quantity: parseInt(e.target.value) || 0 }
                                  updateLayer(index, "loops", newLoops)
                                }}
                                placeholder="Qty"
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">×</span>
                              <Input
                                type="number"
                                value={loop.length}
                                onChange={(e) => {
                                  const newLoops = [...layer.loops]
                                  newLoops[loopIndex] = { ...loop, length: parseInt(e.target.value) || 0 }
                                  updateLayer(index, "loops", newLoops)
                                }}
                                placeholder="Length"
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">inches</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Tails</label>
                        <div className="space-y-2">
                          {layer.tails.map((tail, tailIndex) => (
                            <div key={tailIndex} className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={tail.quantity}
                                onChange={(e) => {
                                  const newTails = [...layer.tails]
                                  newTails[tailIndex] = { ...tail, quantity: parseInt(e.target.value) || 0 }
                                  updateLayer(index, "tails", newTails)
                                }}
                                placeholder="Qty"
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">×</span>
                              <Input
                                type="number"
                                value={tail.length}
                                onChange={(e) => {
                                  const newTails = [...layer.tails]
                                  newTails[tailIndex] = { ...tail, length: parseInt(e.target.value) || 0 }
                                  updateLayer(index, "tails", newTails)
                                }}
                                placeholder="Length"
                                className="w-20"
                              />
                              <span className="text-sm text-muted-foreground">inches</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
              <Button variant="outline" onClick={handleCancel} className="order-2 sm:order-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2 order-1 sm:order-2">
                <Save className="h-4 w-4" />
                {editingRecipe ? "Update Recipe" : "Save Recipe"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recipe List */}
      {!isCreating && !editingRecipe && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => {
            const costInfo = calculateRecipeCost(recipe)
            const bowsUsingRecipe = getBowsUsingRecipe(recipe)
            
            return (
              <Link key={recipe.id} href={`/recipes/${recipe.id}`} className="block">
                <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer">
                {/* Bow Visualization */}
                <div className="p-4">
                  {renderBowVisualization(recipe)}
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate leading-tight">
                        {recipe.name}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(recipe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(recipe)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  {/* Recipe Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{recipe.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{recipe.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">${costInfo.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-muted-foreground" />
                      <span>{costInfo.totalInches.toFixed(0)}" total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{bowsUsingRecipe.length} bows using</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(recipe.difficulty)}>
                      {recipe.difficulty}
                    </Badge>
                  </div>

                  {/* Ribbon Breakdown */}
                  {renderRibbonDetails(recipe)}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {onRecipeSelect && (
                      <Button 
                        onClick={() => onRecipeSelect(recipe)} 
                        className="flex-1 gap-2"
                        size="sm"
                      >
                        <Eye className="h-4 w-4" />
                        Use Recipe
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </Link>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isCreating && !editingRecipe && filteredRecipes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <Palette className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">No recipes found</h3>
                <p className="text-muted-foreground mt-2">
                  {selectedCategory === "all" 
                    ? "Create your first recipe to get started with beautiful bow designs" 
                    : `No recipes in the "${selectedCategory}" category`
                  }
                </p>
              </div>
              {selectedCategory === "all" && (
                <Button onClick={handleCreateNew} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Recipe
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Ribbon to Inventory Modal */}
      {showRibbonForm && (
        <Card className="fixed inset-4 z-50 overflow-y-auto bg-background border shadow-lg">
          <CardHeader>
            <CardTitle>Add Ribbon to Inventory</CardTitle>
            <CardDescription>
              Add a new ribbon to your inventory so it can be used in recipes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Ribbon Type</label>
                <Select value={newRibbonData.ribbonType} onValueChange={(value) => setNewRibbonData(prev => ({ ...prev, ribbonType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RibbonTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Design Type</label>
                <Select value={newRibbonData.designType} onValueChange={(value) => setNewRibbonData(prev => ({ ...prev, designType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DesignTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Width (inches)</label>
                <Select value={newRibbonData.widthInches.toString()} onValueChange={(value) => setNewRibbonData(prev => ({ ...prev, widthInches: parseFloat(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WidthOptions.map(width => (
                      <SelectItem key={width} value={width.toString()}>{width}"</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Roll Length (yards)</label>
                <Select value={newRibbonData.rollLengthYards.toString()} onValueChange={(value) => setNewRibbonData(prev => ({ ...prev, rollLengthYards: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RollLengthOptions.map(length => (
                      <SelectItem key={length} value={length.toString()}>{length} yards</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Cost per Yard</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRibbonData.costPerYard}
                  onChange={(e) => setNewRibbonData(prev => ({ ...prev, costPerYard: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Brand</label>
                <Input
                  value={newRibbonData.brand}
                  onChange={(e) => setNewRibbonData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Brand name"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Colors</label>
              <div className="space-y-2">
                {newRibbonData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select 
                      value={color} 
                      onValueChange={(value) => {
                        const newColors = [...newRibbonData.colors];
                        newColors[index] = value;
                        setNewRibbonData(prev => ({ ...prev, colors: newColors }));
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ColorOptions.map(colorOption => (
                          <SelectItem key={colorOption} value={colorOption}>{colorOption}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColors = newRibbonData.colors.filter((_, i) => i !== index);
                        setNewRibbonData(prev => ({ ...prev, colors: newColors }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newColors = [...newRibbonData.colors, "Black"];
                    setNewRibbonData(prev => ({ ...prev, colors: newColors }));
                  }}
                >
                  Add Color
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRibbonForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRibbonToInventory}>
                Add to Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 