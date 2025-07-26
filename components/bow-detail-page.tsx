"use client"

import { useState } from "react"
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Edit, 
  Copy, 
  Trash2, 
  Package, 
  Calculator, 
  DollarSign,
  Star,
  Clock,
  Tag,
  Users,
  TrendingUp,
  Eye,
  Save,
  X,
  Plus,
  Minus,
  Camera,
  Upload
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BowPlaceholder } from "@/components/bow-placeholder"
import { getBowById, type Bow } from "@/lib/bow-data"
import { toast } from "@/components/ui/use-toast"

interface BowDetailPageProps {
  bowId: string
  onSave?: (bow: Bow) => void
}

export function BowDetailPage({ bowId, onSave }: BowDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  
  // Get the actual bow data based on the ID
  const originalBow = getBowById(bowId)
  
  // If bow not found, show error state
  if (!originalBow) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Bow Not Found</h2>
            <p className="text-muted-foreground">The bow you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Create editable state
  const [bow, setBow] = useState<Bow>(originalBow)

  const getStatusBadge = (status: string, margin: number) => {
    switch (status) {
      case "excellent":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Excellent Profit</Badge>
      case "good":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">Good Profit</Badge>
      case "low":
        return <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300">Low Margin</Badge>
      default:
        return <Badge variant="destructive">Loss</Badge>
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
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
        const result = e.target?.result as string
        setImagePreview(result)
        setBow(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Here you would typically save to a database
    if (onSave) {
      onSave(bow)
    }
    setIsEditing(false)
    toast({
      title: "Bow Updated",
      description: "Your bow design has been saved successfully.",
    })
  }

  const handleCancel = () => {
    setBow(originalBow)
    setImagePreview("")
    setIsEditing(false)
  }

  const addMaterial = () => {
    setBow(prev => ({
      ...prev,
      materials: [...prev.materials, { name: "", quantity: "", cost: 0 }]
    }))
  }

  const removeMaterial = (index: number) => {
    setBow(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }))
  }

  const updateMaterial = (index: number, field: string, value: string | number) => {
    setBow(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }))
  }

  const addInstruction = () => {
    setBow(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }))
  }

  const removeInstruction = (index: number) => {
    setBow(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }))
  }

  const updateInstruction = (index: number, value: string) => {
    setBow(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) => 
        i === index ? value : instruction
      )
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Library</span>
            </Button>
          </Link>
          <div className="hidden sm:block h-6 w-px bg-border" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{bow.name}</h1>
            <p className="text-sm text-muted-foreground">Bow Design #{bow.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorite</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="gap-2" onClick={handleCancel}>
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button size="sm" className="gap-2" onClick={handleSave}>
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Save Changes</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Left Column - Image and Stats */}
        <div className="lg:col-span-1 space-y-4 lg:space-y-6">
          {/* Image Section */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted relative">
                {(bow.image || imagePreview) ? (
                  <img 
                    src={imagePreview || bow.image} 
                    alt={bow.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BowPlaceholder name={bow.name} className="h-full" />
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Camera className="h-4 w-4" />
                        Change Photo
                      </Button>
                    </label>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">${bow.profit.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Profit</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{bow.profitMargin.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Margin</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{bow.layers}</div>
                <div className="text-xs text-muted-foreground">Layers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">${bow.totalCost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Cost</div>
              </CardContent>
            </Card>
          </div>

          {/* Status Badge */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Profit Status</span>
                {getStatusBadge(bow.status, bow.profitMargin)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details and Tabs */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Pricing & Profit Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Profit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Target Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={bow.targetPrice}
                      onChange={(e) => setBow(prev => ({ ...prev, targetPrice: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Time to Make</label>
                    <Input
                      value={bow.timeToMake}
                      onChange={(e) => setBow(prev => ({ ...prev, timeToMake: e.target.value }))}
                      placeholder="e.g., 15-20 minutes"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">${bow.targetPrice.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Target Price</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">${bow.totalCost.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">${bow.profit.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Profit</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{bow.profitMargin.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Margin</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={bow.name}
                        onChange={(e) => setBow(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Bow name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Input
                        value={bow.category}
                        onChange={(e) => setBow(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={bow.description}
                      onChange={(e) => setBow(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your bow design..."
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <label className="text-sm font-medium">Time to Make</label>
                      <Input
                        value={bow.timeToMake}
                        onChange={(e) => setBow(prev => ({ ...prev, timeToMake: e.target.value }))}
                        placeholder="e.g., 15-20 minutes"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Difficulty</label>
                      <Select value={bow.difficulty} onValueChange={(value) => setBow(prev => ({ ...prev, difficulty: value as any }))}>
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
                      <label className="text-sm font-medium">Target Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={bow.targetPrice}
                        onChange={(e) => setBow(prev => ({ ...prev, targetPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{bow.name}</h2>
                      <p className="text-muted-foreground mt-1">{bow.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {bow.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                     <div className="flex items-center gap-2">
                       <Clock className="h-4 w-4 text-muted-foreground" />
                       <span>{bow.timeToMake}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Tag className="h-4 w-4 text-muted-foreground" />
                       <span>{bow.category}</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <Package className="h-4 w-4 text-muted-foreground" />
                       <span>{bow.ribbons.length} ribbons</span>
                     </div>
                   </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="materials" className="text-xs sm:text-sm">Materials</TabsTrigger>
                <TabsTrigger value="instructions" className="text-xs sm:text-sm">Instructions</TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
              </TabsList>

                          <TabsContent value="overview" className="space-y-4 lg:space-y-6 pt-4 lg:pt-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Materials Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bow.materials.slice(0, 3).map((material, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{material.name}</div>
                            <div className="text-xs text-muted-foreground">{material.quantity}</div>
                          </div>
                          <div className="font-semibold text-sm">${material.cost.toFixed(2)}</div>
                        </div>
                      ))}
                      {bow.materials.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center pt-2">
                          +{bow.materials.length - 3} more materials
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Sales Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Sales</span>
                        <span className="font-semibold">{bow.salesHistory.reduce((sum, month) => sum + month.sales, 0)} units</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="font-semibold">${bow.salesHistory.reduce((sum, month) => sum + month.revenue, 0).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Monthly</span>
                        <span className="font-semibold">{Math.round(bow.salesHistory.reduce((sum, month) => sum + month.sales, 0) / bow.salesHistory.length)} units</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

                          <TabsContent value="materials" className="space-y-4 lg:space-y-6 pt-4 lg:pt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Materials List</CardTitle>
                    {isEditing && (
                      <Button size="sm" onClick={addMaterial} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Material
                      </Button>
                    )}
                  </div>
                  <CardDescription>Complete breakdown of all materials and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bow.materials.map((material, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        {isEditing ? (
                          <>
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <div className="flex-1 grid gap-2 sm:grid-cols-3">
                                <Input
                                  value={material.name}
                                  onChange={(e) => updateMaterial(index, "name", e.target.value)}
                                  placeholder="Material name"
                                  className="text-sm"
                                />
                                <Input
                                  value={material.quantity}
                                  onChange={(e) => updateMaterial(index, "quantity", e.target.value)}
                                  placeholder="Quantity"
                                  className="text-sm"
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={material.cost}
                                  onChange={(e) => updateMaterial(index, "cost", parseFloat(e.target.value) || 0)}
                                  placeholder="Cost"
                                  className="text-sm"
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMaterial(index)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-primary" />
                              <div>
                                <div className="font-medium">{material.name}</div>
                                <div className="text-sm text-muted-foreground">{material.quantity}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${material.cost.toFixed(2)}</div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {!isEditing && (
                      <>
                        <Separator />
                        <div className="flex items-center justify-between font-semibold">
                          <span>Total Materials Cost</span>
                          <span>${bow.totalCost.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                          <TabsContent value="instructions" className="space-y-4 lg:space-y-6 pt-4 lg:pt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Step-by-Step Instructions</CardTitle>
                    {isEditing && (
                      <Button size="sm" onClick={addInstruction} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Step
                      </Button>
                    )}
                  </div>
                  <CardDescription>How to recreate this bow design</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bow.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={instruction}
                                onChange={(e) => updateInstruction(index, e.target.value)}
                                placeholder="Enter instruction step..."
                                className="flex-1"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeInstruction(index)}
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <p className="text-sm">{instruction}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

                          <TabsContent value="analytics" className="space-y-4 lg:space-y-6 pt-4 lg:pt-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Monthly Sales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bow.salesHistory.map((month) => (
                        <div key={month.month} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{month.month}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">{month.sales} sold</span>
                            <span className="font-semibold">${month.revenue.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Profit Margin</span>
                        <span className="font-semibold text-green-600">{bow.profitMargin.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">ROI</span>
                        <span className="font-semibold text-green-600">{((bow.profit / bow.totalCost) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg Order Value</span>
                        <span className="font-semibold">${bow.targetPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 