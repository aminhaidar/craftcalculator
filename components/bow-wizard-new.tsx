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
  CheckCircle,
  Clock
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
  name: z.string().min(1, "Bow name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  image: z.string().optional(),
  recipe: z.string().optional(),
  layers: z.array(z.object({
    ribbonId: z.string().min(1, "Ribbon selection is required"),
    ribbonName: z.string().min(1, "Ribbon name is required"),
    color: z.string().min(1, "Color is required"),
    loops: z.array(z.object({
      quantity: z.number().min(0, "Quantity must be 0 or greater"),
      length: z.number().min(0, "Length must be 0 or greater"),
    })),
    tails: z.array(z.object({
      quantity: z.number().min(0, "Quantity must be 0 or greater"),
      length: z.number().min(0, "Length must be 0 or greater"),
    })),
    streamers: z.array(z.object({
      quantity: z.number().min(0, "Quantity must be 0 or greater"),
      length: z.number().min(0, "Length must be 0 or greater"),
    })),
  })),
  targetPrice: z.number().min(0, "Target price must be 0 or greater"),
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
    mode: "onChange",
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image upload triggered", event.target.files)
    
    const file = event.target.files?.[0]
    if (file) {
      console.log("File selected:", file.name, file.type, file.size)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error("Invalid file type:", file.type)
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF, etc.).",
          variant: "destructive",
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        console.error("File too large:", file.size)
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
          console.log("File read successfully")
          const result = e.target?.result as string
          if (result) {
            console.log("Setting image preview and form value")
            setImagePreview(result)
            form.setValue("image", result)
            toast({
              title: "Image uploaded successfully",
              description: "Your image has been added to the bow design.",
            })
          } else {
            console.error("No result from FileReader")
            toast({
              title: "Upload failed",
              description: "No image data received. Please try again.",
              variant: "destructive",
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

      reader.onerror = (error) => {
        console.error("FileReader error:", error)
        toast({
          title: "Upload failed",
          description: "There was an error reading your image file. Please try again.",
          variant: "destructive",
        })
      }

      reader.onabort = () => {
        console.log("FileReader aborted")
        toast({
          title: "Upload cancelled",
          description: "Image upload was cancelled.",
          variant: "destructive",
        })
      }

      console.log("Starting to read file as DataURL")
      reader.readAsDataURL(file)
    } else {
      console.log("No file selected")
    }
  }

  const removeImage = () => {
    console.log("Removing image")
    setImagePreview("")
    form.setValue("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast({
      title: "Image removed",
      description: "The image has been removed from your bow design.",
    })
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

  const calculateLayerCost = (layer: any) => {
    const ribbon = availableRibbons.find(r => r.ribbonId === layer.ribbonId)
    if (ribbon && ribbon.costPerYard) {
      const loopsInches = layer.loops.reduce((sum: number, l: any) => sum + l.quantity * l.length, 0)
      const tailsInches = layer.tails.reduce((sum: number, t: any) => sum + t.quantity * t.length, 0)
      const totalInches = loopsInches + tailsInches
      const totalYards = totalInches / 36
      return totalYards * ribbon.costPerYard
    }
    return 0
  }

  const calculateTotalCost = () => {
    const layers = form.getValues("layers")
    return layers.reduce((sum, layer) => sum + calculateLayerCost(layer), 0)
  }

  const handleComplete = () => {
    const data = form.getValues()
    const totalCost = calculateTotalCost()
    
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
      salesHistory: [], // Add empty sales history
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
        "Create loops according to specifications",
        "Attach tails and streamers",
        "Secure all layers together",
        "Add finishing touches"
      ]
    }
    
    addNewBow(newBow)
    
    toast({
      title: "Bow Created!",
      description: "Your new bow design has been saved to your library.",
    })
    
    onComplete(data)
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
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
            <FormItem className="mt-4">
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your bow design..." 
                  rows={3} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Add Image (Optional)</h3>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="mx-auto max-h-48 rounded-lg object-cover"
              />
              <Button variant="outline" onClick={removeImage}>
                <X className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload an image of your bow design
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button 
                type="button"
                variant="outline" 
                onClick={() => {
                  console.log("Choose Image button clicked")
                  console.log("fileInputRef.current:", fileInputRef.current)
                  if (fileInputRef.current) {
                    fileInputRef.current.click()
                  } else {
                    console.error("File input ref is null")
                  }
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose a Recipe (Optional)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start with a pre-designed recipe or create your own from scratch
        </p>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bowRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRecipe === recipe.id 
                  ? "ring-2 ring-primary border-primary" 
                  : "border-border"
              }`}
              onClick={() => selectRecipe(recipe.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{recipe.name}</h4>
                  <Badge 
                    variant={recipe.difficulty === "Easy" ? "default" : recipe.difficulty === "Medium" ? "secondary" : "destructive"}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {recipe.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Package className="h-4 w-4" />
                  <span>{recipe.layers.length} layers</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Create Custom Design</h3>
        <Button onClick={addLayer} className="gap-2">
          <Plus className="h-4 w-4" />
          Add First Layer
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => {
    const layers = form.watch("layers")
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ribbon Layers</h3>
          <Button onClick={addLayer} variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Layer
          </Button>
        </div>

        {layers.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">No layers added yet. Add your first layer to get started.</p>
            <Button onClick={addLayer} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Layer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {layers.map((layer, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Layer {index + 1}</h4>
                  {layers.length > 1 && (
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
                    <FormLabel className="text-sm font-medium">Ribbon Selection</FormLabel>
                    <Select 
                      value={layer.ribbonId} 
                      onValueChange={(value) => {
                        const selectedRibbon = availableRibbons.find(r => r.ribbonId === value);
                        if (selectedRibbon) {
                          form.setValue(`layers.${index}.ribbonId`, value);
                          form.setValue(`layers.${index}.ribbonName`, selectedRibbon.ribbonType);
                          form.setValue(`layers.${index}.color`, selectedRibbon.colors?.[0] ? `var(--${selectedRibbon.colors[0].toLowerCase()})` : '#ccc');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ribbon from inventory" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRibbons.map(ribbon => (
                          <SelectItem key={ribbon.ribbonId} value={ribbon.ribbonId}>
                            {ribbon.ribbonType} - {ribbon.designType} (${(ribbon.costPerYard || 0).toFixed(2)}/yard)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium">Color</FormLabel>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={layer.color}
                        onChange={(e) => form.setValue(`layers.${index}.color`, e.target.value)}
                        className="w-10 h-10 rounded border border-input bg-background"
                      />
                      <Input
                        value={layer.color}
                        onChange={(e) => form.setValue(`layers.${index}.color`, e.target.value)}
                        placeholder="#ef4444"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <FormLabel className="text-sm font-medium">Loops</FormLabel>
                    <div className="space-y-2">
                      {layer.loops.map((loop, loopIndex) => (
                        <div key={loopIndex} className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={loop.quantity}
                              onChange={(e) => {
                                const newLoops = [...layer.loops]
                                newLoops[loopIndex] = { ...loop, quantity: parseInt(e.target.value) || 0 }
                                form.setValue(`layers.${index}.loops`, newLoops)
                              }}
                              placeholder="Qty"
                              className="w-20"
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">×</span>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={loop.length}
                              onChange={(e) => {
                                const newLoops = [...layer.loops]
                                newLoops[loopIndex] = { ...loop, length: parseInt(e.target.value) || 0 }
                                form.setValue(`layers.${index}.loops`, newLoops)
                              }}
                              placeholder="Length"
                              className="w-20"
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">inches</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium">Tails</FormLabel>
                    <div className="space-y-2">
                      {layer.tails.map((tail, tailIndex) => (
                        <div key={tailIndex} className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={tail.quantity}
                              onChange={(e) => {
                                const newTails = [...layer.tails]
                                newTails[tailIndex] = { ...tail, quantity: parseInt(e.target.value) || 0 }
                                form.setValue(`layers.${index}.tails`, newTails)
                              }}
                              placeholder="Qty"
                              className="w-20"
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">×</span>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              value={tail.length}
                              onChange={(e) => {
                                const newTails = [...layer.tails]
                                newTails[tailIndex] = { ...tail, length: parseInt(e.target.value) || 0 }
                                form.setValue(`layers.${index}.tails`, newTails)
                              }}
                              placeholder="Length"
                              className="w-20"
                            />
                          </FormControl>
                          <span className="text-sm text-muted-foreground">inches</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Layer Cost:</span>
                    <span className="font-medium">${calculateLayerCost(layer).toFixed(2)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderStep4 = () => {
    const data = form.getValues()
    const totalCost = calculateTotalCost()
    const profit = data.targetPrice - totalCost
    const profitMargin = (profit / data.targetPrice) * 100
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Review & Complete</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bow Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span className="font-medium">{data.name}</span>
                </div>
                {data.description && (
                  <div className="flex justify-between">
                    <span>Description:</span>
                    <span className="font-medium">{data.description}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Layers:</span>
                  <span className="font-medium">{data.layers.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pricing & Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-medium">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <FormField
                    control={form.control}
                    name="targetPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {data.targetPrice > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between">
                      <span>Profit:</span>
                      <span className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margin:</span>
                      <span className={`font-medium ${profitMargin >= 30 ? 'text-green-600' : profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Materials Used</h4>
          <div className="space-y-2">
            {data.layers.map((layer, index) => {
              const ribbon = availableRibbons.find(r => r.ribbonId === layer.ribbonId)
              const totalInches = layer.loops.reduce((sum, l) => sum + l.quantity * l.length, 0) + layer.tails.reduce((sum, t) => sum + t.quantity * t.length, 0)
              const cost = calculateLayerCost(layer)
              
              return (
                <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <span className="font-medium">{layer.ribbonName}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({totalInches} inches)
                    </span>
                  </div>
                  <span className="font-medium">${cost.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              {step}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-primary" : "bg-muted"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Basic Information"}
            {currentStep === 2 && "Choose Recipe or Create Custom"}
            {currentStep === 3 && "Design Layers"}
            {currentStep === 4 && "Pricing & Review"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Start by providing basic information about your bow"}
            {currentStep === 2 && "Select a recipe or create your own custom design"}
            {currentStep === 3 && "Configure the ribbon layers for your bow"}
            {currentStep === 4 && "Set pricing and review your design"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              {renderStep()}
              
              {/* Navigation */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="gap-2"
                      disabled={currentStep === 1 && !form.getValues("name")}
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleComplete}
                      className="gap-2"
                      disabled={!form.getValues("name") || form.getValues("layers").length === 0}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Create Bow
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 