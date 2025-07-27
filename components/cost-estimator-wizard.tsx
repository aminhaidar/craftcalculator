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
import { Slider } from "@/components/ui/slider"
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
  Scissors,
  Save,
  BookOpen
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { calculateTotalCost, calculateYardsUsed, calculateRibbonUsageSummary, type CostBreakdown } from "@/lib/services/cost-calculator"
import { VendorOptions, ColorOptions } from "@/lib/vendor-data"

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
  color: string
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
  
  // New state for enhanced features
  const [showCostBreakdown, setShowCostBreakdown] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<string>('')
  const [vendorFeePct, setVendorFeePct] = useState(0.07)
  const [taxPct, setTaxPct] = useState(0.08)
  const [shippingCost, setShippingCost] = useState(5.95)
  const [bowName, setBowName] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [priceSlider, setPriceSlider] = useState(0)

  const totalSteps = 4

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
      totalCost: 0,
      color: "#ef4444" // Default red color
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
        
        // Calculate total inches and yards used using the new service
        const totalInches = (updatedLayer.loops * updatedLayer.loopLength) + 
                           (updatedLayer.streamers * updatedLayer.streamerLength)
        const yardsUsed = calculateYardsUsed(
          updatedLayer.loops,
          updatedLayer.loopLength,
          updatedLayer.streamers,
          updatedLayer.streamerLength
        )
        
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

    const baseCost = getTotalBowCost()
    const totalInches = getTotalInches()
    
    // Calculate cost breakdown including vendor fees and shipping
    const costBreakdown = getCostBreakdown()
    const totalCostWithFees = costBreakdown.total
    
    // Calculate multiple pricing strategies factoring in vendor fees
    const conservativePrice = totalCostWithFees * 2.0 // 50% markup
    const recommendedPrice = totalCostWithFees * 2.5 // 60% markup  
    const premiumPrice = totalCostWithFees * 3.0 // 67% markup
    
    // Use recommended price as default
    const suggestedPrice = recommendedPrice
    const profitMargin = ((suggestedPrice - totalCostWithFees) / suggestedPrice) * 100
    
    // Calculate bows per roll more accurately
    const totalYardsUsed = layers.reduce((sum, layer) => sum + layer.yardsUsed, 0)
    const bowsPerRoll = totalYardsUsed > 0 ? Math.floor(25 / totalYardsUsed) : 0 // Assuming 25-yard rolls
    
    // Calculate profit scenarios
    const profitPerBow = suggestedPrice - totalCostWithFees
    const totalProfit = profitPerBow * bowsPerRoll
    
    // Calculate time estimates (rough estimate: 5-10 minutes per bow)
    const estimatedTimePerBow = 7.5 // minutes
    const totalTimeForRoll = (estimatedTimePerBow * bowsPerRoll) / 60 // hours
    
    // Calculate efficiency metrics
    const costPerInch = totalCostWithFees / totalInches
    const profitPerInch = profitPerBow / totalInches

    setEstimate({
      layers,
      totalCost: totalCostWithFees,
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

    // Set initial price slider to recommended price
    setPriceSlider(suggestedPrice)

    setCurrentStep(4)
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
    setShowCostBreakdown(false)
    setSelectedVendor('')
    setVendorFeePct(0.07)
    setTaxPct(0.08)
    setShippingCost(5.95)
    setBowName('')
    setRecipeName('')
    setPriceSlider(0)
  }

  const handleVendorSelection = (vendorName: string) => {
    setSelectedVendor(vendorName)
    const vendor = VendorOptions.find(v => v.name === vendorName)
    if (vendor) {
      setVendorFeePct(vendor.vendorFeePct)
      setShippingCost(vendor.avgShipping)
    }
  }

  const getCostBreakdown = (): CostBreakdown => {
    const baseCost = getTotalBowCost()
    return calculateTotalCost(baseCost, vendorFeePct, taxPct, shippingCost)
  }

  const getDynamicPricing = (price: number) => {
    const costBreakdown = getCostBreakdown()
    const vendorFee = price * vendorFeePct
    const tax = (price + vendorFee) * taxPct
    const totalFees = vendorFee + tax + shippingCost
    const profit = price - costBreakdown.baseCost - totalFees
    const profitMargin = price > 0 ? (profit / price) * 100 : 0
    
    return {
      price,
      vendorFee,
      tax,
      totalFees,
      profit,
      profitMargin
    }
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
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: layer.color }}
                    />
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

                        {/* Color Selection */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Ribbon Color
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {ColorOptions.map((color) => (
                              <button
                                key={color.value}
                                type="button"
                                onClick={() => updateLayer(layer.id, 'color', color.value)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  layer.color === color.value 
                                    ? 'border-gray-800 scale-110' 
                                    : 'border-gray-300 hover:border-gray-500'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
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
          <p className="text-muted-foreground text-sm sm:text-base">Review your bow design before setting vendor options</p>
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

      {/* Total Summary - Moved to Top */}
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



      {/* Bow Design Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
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
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold border border-gray-300"
                  style={{ backgroundColor: layer.color }}
                >
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

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendor Options
        </Button>
        <Button onClick={nextStep} className="gap-2">
          Set Vendor Options
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Vendor & Shipping Options</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Configure vendor fees, taxes, and shipping costs</p>
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

      {/* Vendor Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <h4 className="text-lg font-semibold text-center mb-6">Select Your Vendor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Vendor Platform</Label>
            <Select value={selectedVendor} onValueChange={handleVendorSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a vendor..." />
              </SelectTrigger>
              <SelectContent>
                {VendorOptions.map((vendor) => (
                  <SelectItem key={vendor.name} value={vendor.name}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Select your selling platform to auto-populate typical fees
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Vendor Fee Percentage</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={vendorFeePct}
                onChange={(e) => setVendorFeePct(parseFloat(e.target.value) || 0)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Platform fee as a percentage of your selling price
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Tax Rate</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={taxPct}
                onChange={(e) => setTaxPct(parseFloat(e.target.value) || 0)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Sales tax rate for your location
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Shipping Cost</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Average shipping cost per order
              </p>
            </div>
          </div>
        </div>
        
        {/* Cost Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800"
        >
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Total Cost Breakdown</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Base Cost</p>
                <p className="font-bold text-blue-600">${getCostBreakdown().baseCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fees & Shipping</p>
                <p className="font-bold text-orange-600">${(getCostBreakdown().vendorFee + getCostBreakdown().tax + getCostBreakdown().shippingCost).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Cost</p>
                <p className="font-bold text-green-600">${getCostBreakdown().total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Design Review
        </Button>
        <Button onClick={calculateEstimate} className="gap-2">
          Calculate Pricing
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  const renderStep4 = () => (
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
            Pricing & Profit Analysis 🎯
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-base sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Adjust your price and see real-time profit calculations
          </motion.p>
        </div>
      </motion.div>

      {/* Consolidated Summary & Price Slider */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
      >
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-6">Pricing Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg">
                <p className="text-sm text-muted-foreground">Total Cost</p>
                <p className="text-2xl font-bold text-red-600">${getCostBreakdown().total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">With all fees</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg">
                <p className="text-sm text-muted-foreground">Recommended</p>
                <p className="text-2xl font-bold text-green-600">${estimate?.suggestedPrice.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">60% margin</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg">
                <p className="text-sm text-muted-foreground">Profit per Bow</p>
                <p className="text-2xl font-bold text-purple-600">${estimate?.profitPerBow.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">After fees</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border shadow-lg">
                <p className="text-sm text-muted-foreground">Bows per Roll</p>
                <p className="text-2xl font-bold text-blue-600">{estimate?.bowsPerRoll}</p>
                <p className="text-xs text-muted-foreground">25-yard rolls</p>
              </div>
            </div>
          </div>

          {/* Interactive Price Slider */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-center">Adjust Your Price</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Your Selling Price</Label>
                  <span className="text-lg font-bold text-indigo-600">${priceSlider.toFixed(2)}</span>
                </div>
                <Slider
                  value={[priceSlider]}
                  onValueChange={(value) => setPriceSlider(value[0])}
                  min={getCostBreakdown().total}
                  max={getCostBreakdown().total * 5}
                  step={0.01}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Break-even: ${getCostBreakdown().total.toFixed(2)}</span>
                  <span>5x markup: ${(getCostBreakdown().total * 5).toFixed(2)}</span>
                </div>
              </div>

              {/* Real-time Results */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Platform Fee</p>
                  <p className="text-lg font-bold text-orange-600">${getDynamicPricing(priceSlider).vendorFee.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Sales Tax</p>
                  <p className="text-lg font-bold text-red-600">${getDynamicPricing(priceSlider).tax.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <p className="text-xs text-muted-foreground">Your Profit</p>
                  <p className="text-lg font-bold text-green-600">${getDynamicPricing(priceSlider).profit.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-500">
                  <p className="text-xs text-muted-foreground">Profit Margin</p>
                  <p className="text-lg font-bold text-indigo-600">{getDynamicPricing(priceSlider).profitMargin.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>





      {/* Ribbon Usage Optimization */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
      >
        <h4 className="text-lg font-semibold text-center mb-4">Ribbon Usage Optimization</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {layers.map((layer, index) => {
            const usageSummary = calculateRibbonUsageSummary(layer.yardsUsed)
            return (
              <div key={layer.id} className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <div 
                  className="w-6 h-6 rounded-full mx-auto mb-2 border border-gray-300"
                  style={{ backgroundColor: layer.color }}
                />
                <p className="text-sm font-medium">Layer {index + 1}</p>
                <p className="text-lg font-bold text-blue-600">{usageSummary.bowsPerRoll} bows/roll</p>
                <p className="text-xs text-muted-foreground">{usageSummary.percentUsed.toFixed(1)}% of roll used</p>
                <p className="text-xs text-amber-600 mt-1">{usageSummary.recommendation}</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Layer Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-center">Layer Breakdown</h3>
        <div className="space-y-3">
          {layers.map((layer, index) => (
            <motion.div 
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
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

      {/* Save Options */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
      >
        <h4 className="text-lg font-semibold text-center mb-4">Save Your Design</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Bow Name</Label>
            <Input
              placeholder="Enter bow name..."
              value={bowName}
              onChange={(e) => setBowName(e.target.value)}
            />
            <Button className="w-full gap-2" disabled={!bowName.trim()}>
              <Save className="h-4 w-4" />
              Save Bow
            </Button>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-medium">Recipe Name</Label>
            <Input
              placeholder="Enter recipe name..."
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />
            <Button variant="outline" className="w-full gap-2" disabled={!recipeName.trim()}>
              <BookOpen className="h-4 w-4" />
              Save Recipe
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
      >
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Vendor Options
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
      case 4:
        return renderStep4()
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