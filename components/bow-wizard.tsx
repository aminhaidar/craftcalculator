"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { 
  ArrowLeft, 
  ArrowRight, 
  Camera, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Package,
  Sparkles,
  Calculator,
  DollarSign,
  CheckCircle
} from "lucide-react"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addNewBow, getAllRecipes, type BowRecipe } from "@/lib/bow-data"
import { getAllRibbons, type RibbonInventoryRecord } from "@/lib/ribbon-data"

// Get recipes and ribbons from data service
const bowRecipes = getAllRecipes()
const availableRibbons = getAllRibbons()

// Quick ribbon selections from inventory
const quickRibbons = availableRibbons.slice(0, 6).map(ribbon => ({
  id: ribbon.ribbonId,
  name: ribbon.ribbonType,
  color: ribbon.colors?.[0] ? `var(--${ribbon.colors[0].toLowerCase()})` : '#ccc',
  costPerYard: ribbon.costPerYard || 0
}))

const bowWizardSchema = z.object({
  name: z.string().min(1, "Bow name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  recipe: z.string().optional(),
  layers: z.array(z.object({
    ribbonId: z.string(),
    ribbonName: z.string(),
    color: z.string(),
    loops: z.array(z.object({
      quantity: z.number().min(0),
      length: z.number().min(0),
    })),
    tails: z.array(z.object({
      quantity: z.number().min(0),
      length: z.number().min(0),
    })),
    streamers: z.array(z.object({
      quantity: z.number().min(0),
      length: z.number().min(0),
    })),
  })),
  targetPrice: z.number().min(0),
})

type BowWizardFormValues = z.infer<typeof bowWizardSchema>

interface BowWizardProps {
  onComplete: (data: BowWizardFormValues) => void
}

export function BowWizard({ onComplete }: BowWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<BowWizardFormValues>({
    resolver: zodResolver(bowWizardSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      recipe: "",
      layers: [],
      targetPrice: 0,
    },
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF, etc.).",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          if (result) {
            setImagePreview(result)
            form.setValue("image", result)
            toast({
              title: "Image uploaded successfully",
              description: "Your image has been added to the bow design.",
            })
          }
        } catch (error) {
          console.error("Error processing image:", error)
          toast({
            title: "Upload failed",
            description: "There was an error processing your image. Please try again.",
            variant: "destructive",
          })
        }
      }

      reader.onerror = () => {
        toast({
          title: "Upload failed",
          description: "There was an error reading your image file. Please try again.",
          variant: "destructive",
        })
      }

      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    form.setValue("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const selectRecipe = (recipeId: string) => {
    setSelectedRecipe(recipeId)
    form.setValue("recipe", recipeId)
    
    const recipe = bowRecipes.find(r => r.id === recipeId)
    if (recipe) {
      // Use the recipe's actual layers
      const layers = recipe.layers.map(layer => ({
        ribbonId: layer.ribbonId,
        ribbonName: layer.ribbonName,
        color: layer.color,
        loops: layer.loops,
        tails: layer.tails,
        streamers: [],
      }))
      form.setValue("layers", layers)
    }
  }

  const addLayer = () => {
    const currentLayers = form.getValues("layers")
    const newLayer = {
      ribbonId: quickRibbons[0].id,
      ribbonName: quickRibbons[0].name,
      color: quickRibbons[0].color,
      loops: [{ quantity: 4, length: 6 }],
      tails: [{ quantity: 2, length: 12 }],
      streamers: [],
    }
    form.setValue("layers", [...currentLayers, newLayer])
  }

  const removeLayer = (index: number) => {
    const currentLayers = form.getValues("layers")
    form.setValue("layers", currentLayers.filter((_, i) => i !== index))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    const data = form.getValues()
    
    // Calculate total cost from layers using inventory data
    const totalCost = data.layers.reduce((sum, layer) => {
      const ribbon = availableRibbons.find(r => r.ribbonId === layer.ribbonId)
      if (ribbon && ribbon.costPerYard) {
        const loopsInches = layer.loops.reduce((s, l) => s + l.quantity * l.length, 0)
        const tailsInches = layer.tails.reduce((s, t) => s + t.quantity * t.length, 0)
        const totalInches = loopsInches + tailsInches
        const totalYards = totalInches / 36
        return sum + (totalYards * ribbon.costPerYard)
      }
      return sum
    }, 0)
    
    // Calculate profit and margin
    const profit = data.targetPrice - totalCost
    const profitMargin = (profit / data.targetPrice) * 100
    
    // Determine status based on margin
    let status: "excellent" | "good" | "low" = "low"
    if (profitMargin >= 50) status = "excellent"
    else if (profitMargin >= 30) status = "good"
    
    // Create new bow object
    const newBow = {
      name: data.name,
      description: data.description || "",
      image: data.image || "",
      totalCost,
      targetPrice: data.targetPrice,
      profit,
      profitMargin,
      status,
      createdAt: new Date().toISOString().split('T')[0],
      ribbons: data.layers.map(layer => layer.ribbonName),
      layers: data.layers.length,
      timeToMake: "15-20 minutes", // Default value
      difficulty: "Medium" as const, // Default value
      category: "Custom",
      tags: ["Custom", "New"],
      materials: data.layers.map(layer => {
        const ribbon = availableRibbons.find(r => r.ribbonId === layer.ribbonId)
        const totalInches = layer.loops.reduce((sum, l) => sum + l.quantity * l.length, 0) + layer.tails.reduce((sum, t) => sum + t.quantity * t.length, 0)
        const totalYards = totalInches / 36
        const cost = ribbon && ribbon.costPerYard ? totalYards * ribbon.costPerYard : 0
        
        return {
          name: layer.ribbonName,
          quantity: `${totalInches} inches`,
          cost
        }
      }),
      instructions: [
        "Cut ribbon to required lengths",
        "Create loops and tails",
        "Layer ribbons as designed",
        "Secure with wire or glue",
        "Trim and shape as needed"
      ],
      salesHistory: [
        { month: "Jan", sales: 0, revenue: 0 },
        { month: "Feb", sales: 0, revenue: 0 },
        { month: "Mar", sales: 0, revenue: 0 },
        { month: "Apr", sales: 0, revenue: 0 }
      ]
    }
    
    // Save to data service
    const savedBow = addNewBow(newBow)
    
    toast({
      title: "Bow Created Successfully!",
      description: `"${savedBow.name}" has been added to your library.`,
    })
    
    onComplete(data)
  }

  const steps = [
    { id: 1, title: "Basic Info", description: "Name and photo" },
    { id: 2, title: "Choose Recipe", description: "Select a template or custom" },
    { id: 3, title: "Design Layers", description: "Configure ribbon layers" },
    { id: 4, title: "Pricing & Profit", description: "Set pricing and see profit analysis" },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-shrink-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= step.id 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-muted-foreground text-muted-foreground"
            }`}>
              {currentStep > step.id ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 ${
                currentStep > step.id ? "bg-primary" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-4 lg:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{steps[currentStep - 1].title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{steps[currentStep - 1].description}</p>
      </div>

      <Form {...form}>
        <form>
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4 lg:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Bow Information
                  </CardTitle>
                  <CardDescription>Give your bow a name and add a photo for reference</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 lg:space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bow Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Spring Garden Bow" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your bow design, colors, or special features..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <FormLabel>Bow Photo (Optional)</FormLabel>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Bow preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-8 text-center">
                        <Camera className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/50 mb-2 sm:mb-4" />
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm text-muted-foreground">Upload a photo of your bow design</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2 text-xs sm:text-sm"
                          >
                            <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                            Choose Image
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Choose Recipe */}
          {currentStep === 2 && (
            <div className="space-y-4 lg:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Choose a Recipe
                  </CardTitle>
                  <CardDescription>Select a pre-made recipe or create a custom design</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                    {bowRecipes.map((recipe) => (
                      <Card
                        key={recipe.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedRecipe === recipe.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => selectRecipe(recipe.id)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{recipe.name}</h3>
                            <p className="text-sm text-muted-foreground">{recipe.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{recipe.layers.length} layers</span>
                              <span>{recipe.estimatedTime}</span>
                            </div>
                            <Badge variant={recipe.difficulty === "Easy" ? "default" : recipe.difficulty === "Medium" ? "secondary" : "destructive"}>
                              {recipe.difficulty}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Design Layers */}
          {currentStep === 3 && (
            <div className="space-y-4 lg:space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Design Layers
                      </CardTitle>
                      <CardDescription>Configure each layer of your bow</CardDescription>
                    </div>
                    <Button type="button" onClick={addLayer} className="gap-2 self-start sm:self-auto">
                      <Plus className="h-4 w-4" />
                      Add Layer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {form.watch("layers").length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No layers added yet. Click "Add Layer" to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {form.watch("layers").map((layer, index) => (
                        <Card key={index} className="border-l-4" style={{ borderLeftColor: layer.color }}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-6 h-6 rounded-full"
                                  style={{ backgroundColor: layer.color }}
                                />
                                <div>
                                  <CardTitle className="text-base sm:text-lg">Layer {index + 1}</CardTitle>
                                  <CardDescription className="text-xs sm:text-sm">{layer.ribbonName}</CardDescription>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLayer(index)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <FormLabel className="text-sm">Loops</FormLabel>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Qty"
                                    className="w-16"
                                    value={layer.loops[0]?.quantity || 0}
                                    onChange={(e) => {
                                      const newLayers = [...form.getValues("layers")]
                                      newLayers[index].loops[0].quantity = Number(e.target.value)
                                      form.setValue("layers", newLayers)
                                    }}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Length"
                                    className="w-20"
                                    value={layer.loops[0]?.length || 0}
                                    onChange={(e) => {
                                      const newLayers = [...form.getValues("layers")]
                                      newLayers[index].loops[0].length = Number(e.target.value)
                                      form.setValue("layers", newLayers)
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <FormLabel className="text-sm">Tails</FormLabel>
                                <div className="flex gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Qty"
                                    className="w-16"
                                    value={layer.tails[0]?.quantity || 0}
                                    onChange={(e) => {
                                      const newLayers = [...form.getValues("layers")]
                                      newLayers[index].tails[0].quantity = Number(e.target.value)
                                      form.setValue("layers", newLayers)
                                    }}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Length"
                                    className="w-20"
                                    value={layer.tails[0]?.length || 0}
                                    onChange={(e) => {
                                      const newLayers = [...form.getValues("layers")]
                                      newLayers[index].tails[0].length = Number(e.target.value)
                                      form.setValue("layers", newLayers)
                                    }}
                                  />
                                </div>
                              </div>
                                                                        <div>
                                            <FormLabel className="text-sm">Ribbon</FormLabel>
                                            <Select
                                              value={layer.ribbonId}
                                              onValueChange={(value) => {
                                                const ribbon = quickRibbons.find(r => r.id === value)
                                                if (ribbon) {
                                                  const newLayers = [...form.getValues("layers")]
                                                  newLayers[index] = {
                                                    ...newLayers[index],
                                                    ribbonId: ribbon.id,
                                                    ribbonName: ribbon.name,
                                                    color: ribbon.color,
                                                    // costPerInch will be calculated from ribbon data
                                                  }
                                                  form.setValue("layers", newLayers)
                                                }
                                              }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select ribbon" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {quickRibbons.map((ribbon) => (
                                                  <SelectItem key={ribbon.id} value={ribbon.id}>
                                                    <div className="flex items-center gap-2">
                                                      <div 
                                                        className="w-4 h-4 rounded-full" 
                                                        style={{ backgroundColor: ribbon.color }}
                                                      />
                                                      {ribbon.name}
                                                    </div>
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

                                          {/* Step 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-4 lg:space-y-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Pricing Recommendations
                              </CardTitle>
                              <CardDescription>Smart pricing suggestions based on your materials and market</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-6">
                                {/* Cost Breakdown */}
                                <div>
                                  <h3 className="font-semibold mb-3">Cost Breakdown</h3>
                                  <div className="space-y-2">
                                    {form.watch("layers").map((layer, index) => {
                                      const loopsInches = layer.loops.reduce((sum, l) => sum + l.quantity * l.length, 0)
                                      const tailsInches = layer.tails.reduce((sum, t) => sum + t.quantity * t.length, 0)
                                      const totalInches = loopsInches + tailsInches
                                      const ribbon = availableRibbons.find(r => r.ribbonId === layer.ribbonId)
                                      const costPerYard = ribbon?.costPerYard || 0
                                      const costPerInch = costPerYard / 36
                                      const layerCost = totalInches * costPerInch
                                      
                                      return (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                          <div className="flex items-center gap-3">
                                            <div 
                                              className="w-4 h-4 rounded-full" 
                                              style={{ backgroundColor: layer.color }}
                                            />
                                            <div>
                                              <div className="font-medium text-sm">{layer.ribbonName}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {totalInches.toFixed(1)}" total
                                              </div>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <div className="font-semibold">${layerCost.toFixed(2)}</div>
                                            <div className="text-xs text-muted-foreground">
                                              ${costPerInch.toFixed(3)}/inch
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                  
                                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg mt-3">
                                    <span className="font-semibold">Total Materials Cost</span>
                                    <span className="font-bold text-lg">
                                      ${(form.watch("layers").reduce((sum, layer) => {
                                        const loopsInches = layer.loops.reduce((s, l) => s + l.quantity * l.length, 0)
                                        const tailsInches = layer.tails.reduce((s, t) => s + t.quantity * t.length, 0)
                                        const ribbon = availableRibbons.find(r => r.ribbonId === layer.ribbonId)
                                        const costPerYard = ribbon?.costPerYard || 0
                                        const costPerInch = costPerYard / 36
                                        return sum + (loopsInches + tailsInches) * costPerInch
                                      }, 0)).toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                <Separator />

                                {/* Pricing Recommendations */}
                                <div>
                                  <h3 className="font-semibold mb-3">Recommended Pricing</h3>
                                  <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {(() => {
                                      const totalCost = form.watch("layers").reduce((sum, layer) => {
                                        const loopsInches = layer.loops.reduce((s, l) => s + l.quantity * l.length, 0)
                                        const tailsInches = layer.tails.reduce((s, t) => s + t.quantity * t.length, 0)
                                        return sum + (loopsInches + tailsInches) * layer.costPerInch
                                      }, 0)
                                      
                                      const recommendations = [
                                        { margin: 0.3, label: "Competitive", description: "30% margin", color: "border-amber-500 bg-amber-50 dark:bg-amber-950/20" },
                                        { margin: 0.5, label: "Standard", description: "50% margin", color: "border-blue-500 bg-blue-50 dark:bg-blue-950/20" },
                                        { margin: 0.7, label: "Premium", description: "70% margin", color: "border-green-500 bg-green-50 dark:bg-green-950/20" },
                                      ]
                                      
                                      return recommendations.map((rec, index) => {
                                        const recommendedPrice = totalCost / (1 - rec.margin)
                                        const profit = recommendedPrice - totalCost
                                        const profitMargin = (profit / recommendedPrice) * 100
                                        
                                        return (
                                          <Card 
                                            key={index} 
                                            className={`cursor-pointer transition-all hover:shadow-md border-2 ${rec.color} ${
                                              form.watch("targetPrice") === recommendedPrice ? "ring-2 ring-primary" : ""
                                            }`}
                                            onClick={() => form.setValue("targetPrice", recommendedPrice)}
                                          >
                                            <CardContent className="p-4 text-center">
                                              <div className="text-lg font-bold">${recommendedPrice.toFixed(2)}</div>
                                              <div className="text-sm font-medium text-muted-foreground">{rec.label}</div>
                                              <div className="text-xs text-muted-foreground mb-2">{rec.description}</div>
                                              <div className="space-y-1 text-xs">
                                                <div className="flex justify-between">
                                                  <span>Profit:</span>
                                                  <span className="font-semibold text-green-600">+${profit.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span>Margin:</span>
                                                  <span className="font-semibold">{profitMargin.toFixed(1)}%</span>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        )
                                      })
                                    })()}
                                  </div>
                                </div>

                                <Separator />

                                {/* Custom Price Input */}
                                <div>
                                  <h3 className="font-semibold mb-3">Custom Price (Optional)</h3>
                                  <FormField
                                    control={form.control}
                                    name="targetPrice"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Set your own price</FormLabel>
                                        <FormControl>
                                          <Input 
                                            type="number" 
                                            step="0.01" 
                                            min="0" 
                                            placeholder="Enter custom price..."
                                            {...field} 
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  {form.watch("targetPrice") > 0 && (() => {
                                    const totalCost = form.watch("layers").reduce((sum, layer) => {
                                      const loopsInches = layer.loops.reduce((s, l) => s + l.quantity * l.length, 0)
                                      const tailsInches = layer.tails.reduce((s, t) => s + t.quantity * t.length, 0)
                                      return sum + (loopsInches + tailsInches) * layer.costPerInch
                                    }, 0)
                                    const customPrice = form.watch("targetPrice")
                                    const profit = customPrice - totalCost
                                    const profitMargin = (profit / customPrice) * 100
                                    
                                    return (
                                      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <span className="text-muted-foreground">Profit:</span>
                                            <div className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                              {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                                            </div>
                                          </div>
                                          <div>
                                            <span className="text-muted-foreground">Margin:</span>
                                            <div className={`font-semibold ${profitMargin >= 30 ? 'text-green-600' : profitMargin >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                                              {profitMargin.toFixed(1)}%
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 lg:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-2 order-2 sm:order-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <div className="flex gap-2 order-1 sm:order-2">
              {currentStep < 4 ? (
                <Button type="button" onClick={nextStep} className="gap-2 flex-1 sm:flex-none">
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="button" onClick={handleComplete} className="gap-2 flex-1 sm:flex-none">
                  <span className="hidden sm:inline">Create Bow</span>
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
} 