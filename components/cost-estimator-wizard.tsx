"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calculator, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Minus,
  Layers,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingUp,
  CheckCircle,
  Package,
  Scissors
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const RIBBON_TYPES = [
  "Satin",
  "Grosgrain", 
  "Velvet",
  "Organza",
  "Taffeta",
  "Chiffon",
  "Silk",
  "Polyester",
  "Cotton",
  "Lace",
  "Wired",
  "Sheer",
  "Metallic",
  "Glitter",
  "Burlap",
  "Jute",
  "Bamboo",
  "Recycled",
  "Other"
] as const

const COMMON_LOOP_COUNTS = [3, 4, 5, 6, 8, 10, 12] as const
const COMMON_LOOP_LENGTHS = [3, 4, 5, 6, 8, 10, 12] as const
const COMMON_STREAMER_COUNTS = [0, 1, 2, 3, 4, 6] as const
const COMMON_STREAMER_LENGTHS = [8, 10, 12, 15, 18, 20, 24] as const

interface BowLayer {
  id: string
  ribbonType: string
  ribbonCost: number
  ribbonYards: number
  costPerYard: number
  loops: number
  loopLength: number
  streamers: number
  streamerLength: number
  totalInches: number
  yardsUsed: number
  totalCost: number
}

interface CostEstimate {
  layers: BowLayer[]
  totalCost: number
  suggestedPrice: number
  profitMargin: number
  bowsPerRoll: number
  totalProfit: number
  conservativePrice: number
  premiumPrice: number
  profitPerBow: number
  totalTimeForRoll: number
  costPerInch: number
  profitPerInch: number
}

export function CostEstimatorWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [layers, setLayers] = useState<BowLayer[]>([])
  const [estimate, setEstimate] = useState<CostEstimate | null>(null)
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set())
  const [showRibbonChoice, setShowRibbonChoice] = useState(false)
  const [pendingLayerId, setPendingLayerId] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSummaryAnimation, setShowSummaryAnimation] = useState(false)
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward')

  const totalSteps = 3

  const addLayer = () => {
    const newLayer: BowLayer = {
      id: Date.now().toString(),
      ribbonType: "",
      ribbonCost: 0,
      ribbonYards: 0,
      costPerYard: 0,
      loops: 0,
      loopLength: 0,
      streamers: 0,
      streamerLength: 0,
      totalInches: 0,
      yardsUsed: 0,
      totalCost: 0
    }
    setLayers([...layers, newLayer])
    setExpandedLayers(new Set([newLayer.id]))
    
    // If this is the second layer and first layer has ribbon details, ask about ribbon choice
    if (layers.length === 1 && layers[0].ribbonType && layers[0].ribbonCost > 0 && layers[0].ribbonYards > 0) {
      setShowRibbonChoice(true)
      setPendingLayerId(newLayer.id)
    }
    
    // Scroll to top when adding a new layer
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeLayer = (id: string) => {
    setLayers(layers.filter(layer => layer.id !== id))
    const newExpanded = new Set(expandedLayers)
    newExpanded.delete(id)
    setExpandedLayers(newExpanded)
  }

  const updateLayer = (id: string, field: keyof BowLayer, value: string | number) => {
    setLayers(layers.map(layer => {
      if (layer.id === id) {
        const updatedLayer = { ...layer, [field]: value }
        
        // Auto-calculate cost per yard if ribbon cost or yards change
        if (field === 'ribbonCost' || field === 'ribbonYards') {
          updatedLayer.costPerYard = updatedLayer.ribbonYards > 0 ? updatedLayer.ribbonCost / updatedLayer.ribbonYards : 0
        }
        
        // Calculate total inches and yards used
        const totalInches = (updatedLayer.loops * updatedLayer.loopLength) + 
                           (updatedLayer.streamers * updatedLayer.streamerLength)
        const yardsUsed = totalInches / 36 // Convert inches to yards
        
        // Calculate total cost
        const totalCost = yardsUsed * updatedLayer.costPerYard
        
        return {
          ...updatedLayer,
          totalInches,
          yardsUsed,
          totalCost
        }
      }
      return layer
    }))
  }

  const toggleLayerExpansion = (layerId: string) => {
    const newExpanded = new Set(expandedLayers)
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId)
    } else {
      newExpanded.add(layerId)
    }
    setExpandedLayers(newExpanded)
  }



  const nextStep = () => {
    if (currentStep < totalSteps) {
      setStepDirection('forward')
      setCurrentStep(currentStep + 1)
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setStepDirection('backward')
      setCurrentStep(currentStep - 1)
      // Scroll to top when moving to previous step
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const useSameRibbon = () => {
    if (pendingLayerId && layers[0]) {
      const firstLayer = layers[0];
      
      setLayers(prevLayers => prevLayers.map(layer => {
        if (layer.id === pendingLayerId) {
          return {
            ...layer,
            ribbonType: firstLayer.ribbonType,
            ribbonCost: firstLayer.ribbonCost,
            ribbonYards: firstLayer.ribbonYards,
            costPerYard: firstLayer.costPerYard
          }
        }
        return layer
      }))
      
      toast({
        title: "Same ribbon applied!",
        description: "Layer 2 now uses the same ribbon as Layer 1.",
      });
    }
    setShowRibbonChoice(false)
    setPendingLayerId(null)
  }

  const useDifferentRibbon = () => {
    setShowRibbonChoice(false)
    setPendingLayerId(null)
    // Layer will remain with empty ribbon details for user to fill in
  }

  const getTotalBowCost = () => {
    return layers.reduce((sum, layer) => sum + layer.totalCost, 0)
  }

  const getTotalInches = () => {
    return layers.reduce((sum, layer) => sum + layer.totalInches, 0)
  }

  const calculateEstimate = () => {
    if (layers.length === 0) {
      toast({
        title: "No Layers Added",
        description: "Please add at least one layer to calculate costs.",
        variant: "destructive",
      })
      return
    }

    const totalCost = getTotalBowCost()
    const totalInches = getTotalInches()
    
    // Calculate multiple pricing strategies
    const conservativePrice = totalCost * 2.0 // 50% markup
    const recommendedPrice = totalCost * 2.5 // 60% markup  
    const premiumPrice = totalCost * 3.0 // 67% markup
    
    // Use recommended price as default
    const suggestedPrice = recommendedPrice
    const profitMargin = ((suggestedPrice - totalCost) / suggestedPrice) * 100
    
    // Calculate bows per roll more accurately
    const totalYardsUsed = layers.reduce((sum, layer) => sum + layer.yardsUsed, 0)
    const bowsPerRoll = totalYardsUsed > 0 ? Math.floor(25 / totalYardsUsed) : 0 // Assuming 25-yard rolls
    
    // Calculate profit scenarios
    const profitPerBow = suggestedPrice - totalCost
    const totalProfit = profitPerBow * bowsPerRoll
    
    // Calculate time estimates (rough estimate: 5-10 minutes per bow)
    const estimatedTimePerBow = 7.5 // minutes
    const totalTimeForRoll = (estimatedTimePerBow * bowsPerRoll) / 60 // hours
    
    // Calculate efficiency metrics
    const costPerInch = totalCost / totalInches
    const profitPerInch = profitPerBow / totalInches

    setEstimate({
      layers,
      totalCost,
      suggestedPrice,
      profitMargin,
      bowsPerRoll: Math.max(1, bowsPerRoll),
      totalProfit,
      conservativePrice,
      premiumPrice,
      profitPerBow,
      totalTimeForRoll,
      costPerInch,
      profitPerInch
    })

    setCurrentStep(3)
    // Scroll to top and trigger awesome animation
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setShowSummaryAnimation(true)
    setTimeout(() => setShowSummaryAnimation(false), 4000) // Hide animation after 4 seconds
  }

  const resetWizard = () => {
    setCurrentStep(1)
    setLayers([])
    setEstimate(null)
    setExpandedLayers(new Set())
    setShowConfetti(false)
    setShowRibbonChoice(false)
    setPendingLayerId(null)
    setShowSummaryAnimation(false)
    setStepDirection('forward')
  }

    const renderStep1 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bow Cost Calculator
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Design your bow and get instant pricing recommendations
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      {/* Ribbon Choice Modal */}
      {showRibbonChoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Ribbon Choice for Layer 2</h3>
              <p className="text-sm text-muted-foreground">
                Would you like to use the same ribbon as Layer 1?
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={useSameRibbon} 
                className="w-full gap-2 h-12"
              >
                <Layers className="h-4 w-4" />
                Yes, use same ribbon
              </Button>
              <Button 
                onClick={useDifferentRibbon} 
                variant="outline" 
                className="w-full gap-2 h-12"
              >
                <Plus className="h-4 w-4" />
                No, different ribbon
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Layer 1: {layers[0]?.ribbonType} • ${layers[0]?.ribbonCost} • {layers[0]?.ribbonYards} yards
            </div>
          </div>
        </div>
      )}

      {/* Running Total */}
      {layers.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="sticky top-16 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg p-3 sm:p-4"
        >
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">Total Bow Cost</p>
            <motion.p 
              className="text-xl sm:text-2xl font-bold text-primary"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
            >
              ${getTotalBowCost().toFixed(2)}
            </motion.p>
            <p className="text-xs text-muted-foreground">
              {layers.length} layer{layers.length !== 1 ? 's' : ''} • {getTotalInches().toFixed(1)}"
            </p>
          </div>
        </motion.div>
      )}

      {/* Layers */}
      <div className="space-y-4">
        {layers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Layers className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">No layers added yet</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={addLayer} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Layer
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {layers.map((layer, index) => (
              <motion.div 
                key={layer.id} 
                id={`layer-${layer.id}`} 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.4,
                  type: "spring",
                  stiffness: 200
                }}
                className="space-y-4 p-3 sm:p-4 bg-muted/20 rounded-lg border"
              >
                {/* Layer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayerExpansion(layer.id)}
                      className="p-1 h-auto"
                    >
                      {expandedLayers.has(layer.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <h4 className="text-lg font-semibold">Layer {index + 1}</h4>
                    {layer.ribbonType && (
                      <Badge variant="outline" className="text-xs">
                        {layer.ribbonType}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {layers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLayer(layer.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Layer Content */}
                {expandedLayers.has(layer.id) && (
                  <div className="space-y-4">
                    {/* Ribbon Details Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">Ribbon Details</h5>
                        <Badge variant="secondary" className="text-xs">Cost & Supply</Badge>
                      </div>
                      
                      <div className="space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                        {/* Ribbon Type */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Ribbon Type
                          </Label>
                          <Select
                            value={layer.ribbonType}
                            onValueChange={(value) => updateLayer(layer.id, 'ribbonType', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select ribbon type" />
                            </SelectTrigger>
                            <SelectContent>
                              {RIBBON_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {layer.ribbonType === "Other" && (
                            <Input
                              placeholder="Specify ribbon type"
                              value={layer.ribbonType === "Other" ? "" : layer.ribbonType}
                              onChange={(e) => updateLayer(layer.id, 'ribbonType', e.target.value)}
                              className="mt-2 text-base"
                            />
                          )}
                        </div>

                        {/* Ribbon Cost and Yards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Total Ribbon Cost ($)
                            </Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={layer.ribbonCost || ""}
                              onChange={(e) => updateLayer(layer.id, 'ribbonCost', parseFloat(e.target.value) || 0)}
                              className="text-base"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Total Ribbon Yards
                            </Label>
                            <Input
                              type="number"
                              inputMode="decimal"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                              value={layer.ribbonYards || ""}
                              onChange={(e) => updateLayer(layer.id, 'ribbonYards', parseFloat(e.target.value) || 0)}
                              className="text-base"
                            />
                          </div>
                        </div>

                        {/* Cost per Yard (Calculated) */}
                        <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                          <span className="text-sm text-muted-foreground">Cost per Yard:</span>
                          <span className="font-semibold text-blue-600">${layer.costPerYard.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Layer Design Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm">Layer Design</h5>
                        <Badge variant="secondary" className="text-xs">Loops & Streamers</Badge>
                      </div>
                      
                      <div className="space-y-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
                        {/* Loops */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                Number of Loops
                              </Label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                placeholder="0"
                                value={layer.loops || ""}
                                onChange={(e) => updateLayer(layer.id, 'loops', parseInt(e.target.value) || 0)}
                                className="text-base"
                              />
                              <div className="flex flex-wrap gap-1 mt-2">
                                {COMMON_LOOP_COUNTS.map((count) => (
                                  <Button
                                    key={count}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateLayer(layer.id, 'loops', count)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {count}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                Loop Length (inches)
                              </Label>
                              <Input
                                type="number"
                                inputMode="decimal"
                                step="0.5"
                                min="0"
                                placeholder="0.0"
                                value={layer.loopLength || ""}
                                onChange={(e) => updateLayer(layer.id, 'loopLength', parseFloat(e.target.value) || 0)}
                                className="text-base"
                              />
                              <div className="flex flex-wrap gap-1 mt-2">
                                {COMMON_LOOP_LENGTHS.map((length) => (
                                  <Button
                                    key={length}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateLayer(layer.id, 'loopLength', length)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {length}"
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Streamers */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                Number of Streamers
                              </Label>
                              <Input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                placeholder="0"
                                value={layer.streamers || ""}
                                onChange={(e) => updateLayer(layer.id, 'streamers', parseInt(e.target.value) || 0)}
                                className="text-base"
                              />
                              <div className="flex flex-wrap gap-1 mt-2">
                                {COMMON_STREAMER_COUNTS.map((count) => (
                                  <Button
                                    key={count}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateLayer(layer.id, 'streamers', count)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {count}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                Streamer Length (inches)
                              </Label>
                              <Input
                                type="number"
                                inputMode="decimal"
                                step="0.5"
                                min="0"
                                placeholder="0.0"
                                value={layer.streamerLength || ""}
                                onChange={(e) => updateLayer(layer.id, 'streamerLength', parseFloat(e.target.value) || 0)}
                                className="text-base"
                              />
                              <div className="flex flex-wrap gap-1 mt-2">
                                {COMMON_STREAMER_LENGTHS.map((length) => (
                                  <Button
                                    key={length}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateLayer(layer.id, 'streamerLength', length)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    {length}"
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layer Summary */}
                    <div className="p-3 sm:p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-purple-700 dark:text-purple-300">Total Length</div>
                          <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">{layer.totalInches.toFixed(1)} inches</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-purple-700 dark:text-purple-300">Layer Cost</div>
                          <div className="text-lg font-semibold text-purple-800 dark:text-purple-200">${layer.totalCost.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: layers.length * 0.1 + 0.2, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button onClick={addLayer} variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Add Another Layer
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" disabled>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={nextStep}
          disabled={layers.length === 0}
          className="gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Confirm Bow Design</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Review your bow design before calculating costs</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>

      {/* Bow Design Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {layers.map((layer, index) => (
          <motion.div 
            key={layer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold">Layer {index + 1}</h3>
              </div>
              <Badge variant="outline" className="text-sm">
                {layer.ribbonType || "Unnamed Ribbon"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ribbon Details */}
              <div className="space-y-3">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Ribbon Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{layer.ribbonType || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Cost:</span>
                    <span className="font-medium">${layer.ribbonCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Yards:</span>
                    <span className="font-medium">{layer.ribbonYards.toFixed(1)} yards</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost per Yard:</span>
                    <span className="font-medium text-blue-600">${layer.costPerYard.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Layer Design */}
              <div className="space-y-3">
                <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Layer Design
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loops:</span>
                    <span className="font-medium">{layer.loops} × {layer.loopLength}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Streamers:</span>
                    <span className="font-medium">{layer.streamers} × {layer.streamerLength}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Length:</span>
                    <span className="font-medium text-green-600">{layer.totalInches.toFixed(1)} inches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yards Used:</span>
                    <span className="font-medium text-green-600">{layer.yardsUsed.toFixed(3)} yards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Layer Cost */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="font-medium">Layer Cost:</span>
                <span className="text-lg font-bold text-purple-600">${layer.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Total Summary */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">Total Bow Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold text-purple-600">${getTotalBowCost().toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Length</p>
              <p className="text-2xl font-bold text-purple-600">{getTotalInches().toFixed(1)}"</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {layers.length} layer{layers.length !== 1 ? 's' : ''} • Ready to calculate pricing
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Design
        </Button>
        <Button onClick={calculateEstimate} className="gap-2">
          Calculate Pricing
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Header with Animation */}
      <motion.div 
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="text-center space-y-4"
      >
        <motion.div 
          className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <Calculator className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </motion.div>
        <div>
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Pricing Complete! 🎉
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Your bow cost calculation is ready
          </motion.p>
        </div>
      </motion.div>

      {/* Main Pricing Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
      >
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">Recommended Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg"
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Materials Cost</p>
                <p className="text-2xl font-bold text-red-600">${estimate?.totalCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Per bow</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg"
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Recommended Price</p>
                <p className="text-2xl font-bold text-green-600">${estimate?.suggestedPrice.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">60% margin</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg"
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Profit per Bow</p>
                <p className="text-2xl font-bold text-blue-600">${estimate?.profitPerBow.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pure profit</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg"
            >
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Bows per Roll</p>
                <p className="text-2xl font-bold text-purple-600">{estimate?.bowsPerRoll}</p>
                <p className="text-xs text-muted-foreground">25-yard rolls</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-lg font-bold text-purple-600">{estimate?.profitMargin.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Length</p>
                <p className="text-lg font-bold text-purple-600">{getTotalInches().toFixed(1)}"</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time per Roll</p>
                <p className="text-lg font-bold text-purple-600">{estimate?.totalTimeForRoll.toFixed(1)}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Layers</p>
                <p className="text-lg font-bold text-purple-600">{layers.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Pricing Strategy Options */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg border border-green-200 dark:border-green-800"
          >
            <h4 className="text-lg font-semibold text-center mb-4">Pricing Strategy Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <p className="text-sm text-muted-foreground">Conservative</p>
                <p className="text-xl font-bold text-orange-600">${estimate?.conservativePrice.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">50% markup • ${((estimate?.conservativePrice || 0) - (estimate?.totalCost || 0)).toFixed(2)} profit</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-green-500">
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-xl font-bold text-green-600">${estimate?.suggestedPrice.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">60% markup • ${estimate?.profitPerBow.toFixed(2)} profit</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <p className="text-sm text-muted-foreground">Premium</p>
                <p className="text-xl font-bold text-purple-600">${estimate?.premiumPrice.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">67% markup • ${((estimate?.premiumPrice || 0) - (estimate?.totalCost || 0)).toFixed(2)} profit</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Layer Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-center">Layer Breakdown</h3>
        <div className="space-y-3">
          {layers.map((layer, index) => (
            <motion.div 
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{layer.ribbonType || `Layer ${index + 1}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {layer.loops} loops × {layer.loopLength}" + {layer.streamers} streamers × {layer.streamerLength}"
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${layer.totalCost.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{layer.totalInches.toFixed(1)}" • {layer.yardsUsed.toFixed(3)} yards</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
      >
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Design
        </Button>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={resetWizard} className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
            <Plus className="h-4 w-4" />
            Start New Calculation
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4 md:p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ 
            opacity: 0, 
            x: stepDirection === 'forward' ? 50 : -50,
            scale: 0.95
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0, 
            x: stepDirection === 'forward' ? -50 : 50,
            scale: 0.95
          }}
          transition={{ 
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
} 