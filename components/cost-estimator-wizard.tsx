"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
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
  Edit,
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
  BookOpen,
  Eye,
  Check
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
  const router = useRouter()
  const [showRibbonChoice, setShowRibbonChoice] = useState(false)
  const [pendingLayerId, setPendingLayerId] = useState<string | null>(null)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
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
  const [isSaving, setIsSaving] = useState(false)
 
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
        // Each loop uses 2x the loop length (front and back)
        const totalInches = (updatedLayer.loops * 2 * updatedLayer.loopLength) + 
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

  const saveBow = async () => {
    if (!bowName.trim() || !estimate) {
      toast({
        title: "Error",
        description: "Please enter a bow name and complete the calculation first.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const bowData = {
        name: bowName.trim(),
        description: `Bow with ${layers.length} layers, ${getTotalInches().toFixed(1)}" total length`,
        totalCost: getCostBreakdown().total,
        sellingPrice: priceSlider,
        profit: getDynamicPricing(priceSlider).profit,
        profitMargin: getDynamicPricing(priceSlider).profitMargin,
        layers: layers,
        primaryColor: layers[0]?.color || "#ef4444",
        vendorInfo: {
          name: selectedVendor,
          feePct: vendorFeePct,
          shippingCost: shippingCost,
          taxPct: taxPct
        },
        ribbonUsage: layers.map(layer => ({
          layerId: layer.id,
          ribbonType: layer.ribbonType,
          yardsUsed: layer.yardsUsed,
          percentUsed: ((layer.yardsUsed / layer.ribbonYards) * 100),
          wasteYards: layer.ribbonYards - layer.yardsUsed
        })),
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/bows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bowData),
      });

      if (response.ok) {
        const savedBow = await response.json();
        
        // Show success animation
        setShowSuccessAnimation(true);
        
        // Show immediate success toast
        toast({
          title: "🎉 Bow saved successfully!",
          description: "Your bow has been added to your library.",
        });
        
        // Auto-navigate to bow details after animation
        setTimeout(() => {
          router.push(`/bows/${savedBow.id}`);
        }, 3000);
        
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save bow');
      }
    } catch (error) {
      console.error('Error saving bow:', error);
      toast({
        title: "Error saving bow",
        description: "Please try again or check your connection.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
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
                          <Select value={layer.color} onValueChange={(value) => updateLayer(layer.id, 'color', value)}>
                            <SelectTrigger className="w-full">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: layer.color }}
                                />
                                <SelectValue placeholder="Choose a color..." />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {ColorOptions.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  <div className="flex items-center gap-2">
                                    <div 
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: color.hex }}
                                    />
                                    {color.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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

                    {/* Real-Time Ribbon Usage */}
                    {layer.ribbonYards > 0 && (
                      <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Ribbon Usage</span>
                            <span className="text-sm font-bold text-blue-800 dark:text-blue-200">
                              {((layer.yardsUsed / layer.ribbonYards) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-600 dark:text-blue-400">Used: {layer.yardsUsed.toFixed(3)} yards</span>
                            <span className="text-blue-600 dark:text-blue-400">Waste: {(layer.ribbonYards - layer.yardsUsed).toFixed(3)} yards</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-600 dark:text-blue-400">Bows per roll: {Math.floor(layer.ribbonYards / layer.yardsUsed)}</span>
                            <span className="text-blue-600 dark:text-blue-400">Efficiency: {layer.ribbonYards / layer.yardsUsed >= 25 ? 'Excellent' : layer.ribbonYards / layer.yardsUsed >= 20 ? 'Good' : 'Poor'}</span>
                          </div>
                          {(layer.ribbonYards - layer.yardsUsed) > 2 && (
                            <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
                              ⚠️ High waste! Consider making {Math.floor((layer.ribbonYards - layer.yardsUsed) / layer.yardsUsed)} more small bows
                            </div>
                          )}
                          {(layer.ribbonYards - layer.yardsUsed) > 1 && (layer.ribbonYards - layer.yardsUsed) <= 2 && (
                            <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                              💡 Consider making another small bow to use the extra {(layer.ribbonYards - layer.yardsUsed).toFixed(2)} yards
                            </div>
                          )}
                          {(layer.ribbonYards - layer.yardsUsed) <= 1 && ((layer.yardsUsed / layer.ribbonYards) * 100) >= 95 && (
                            <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800">
                              ✅ Excellent ribbon efficiency!
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
                    <span className="font-medium">{layer.loops} × {layer.loopLength}" (×2 for loop)</span>
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
    <div className="space-y-8">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="text-center space-y-6"
      >
        <motion.div 
          className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <Calculator className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
        </motion.div>
        <div className="space-y-3">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            🎉 Your Bow is Ready!
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Review your pricing strategy and save your design to start selling
          </motion.p>
        </div>
      </motion.div>

      {/* Quick Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">${getCostBreakdown().total.toFixed(2)}</div>
            <div className="text-sm font-medium text-red-700 dark:text-red-300">Total Cost</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${estimate?.suggestedPrice.toFixed(2)}</div>
            <div className="text-sm font-medium text-green-700 dark:text-green-300">Recommended Price</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">${estimate?.profitPerBow.toFixed(2)}</div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Profit per Bow</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{estimate?.profitMargin.toFixed(1)}%</div>
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">Profit Margin</div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Price Slider */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">🎯 Interactive Price Adjuster</h3>
          <p className="text-muted-foreground">Slide to see how different prices affect your profit</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <Label className="text-lg font-semibold">Your Selling Price</Label>
              <div className="text-3xl font-bold text-indigo-600">${priceSlider.toFixed(2)}</div>
            </div>
            <Slider
              value={[priceSlider]}
              onValueChange={(value) => setPriceSlider(value[0])}
              min={getCostBreakdown().total}
              max={getCostBreakdown().total * 5}
              step={0.01}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Break-even: ${getCostBreakdown().total.toFixed(2)}</span>
              <span>5x markup: ${(getCostBreakdown().total * 5).toFixed(2)}</span>
            </div>
          </div>

          {/* Real-time Impact Analysis */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="text-lg font-bold text-red-600 mb-1">${getDynamicPricing(priceSlider).vendorFee.toFixed(2)}</div>
              <div className="text-xs text-red-700 dark:text-red-300">Platform Fee</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="text-lg font-bold text-orange-600 mb-1">${getDynamicPricing(priceSlider).tax.toFixed(2)}</div>
              <div className="text-xs text-orange-700 dark:text-orange-300">Sales Tax</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-lg font-bold text-green-600 mb-1">${getDynamicPricing(priceSlider).profit.toFixed(2)}</div>
              <div className="text-xs text-green-700 dark:text-green-300">Your Profit</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg border-2 border-indigo-500">
              <div className="text-lg font-bold text-indigo-600 mb-1">{getDynamicPricing(priceSlider).profitMargin.toFixed(1)}%</div>
              <div className="text-xs text-indigo-700 dark:text-indigo-300">Profit Margin</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Section - Enhanced */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-800"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
            <Save className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">Save Your Design</h3>
          <p className="text-emerald-600 dark:text-emerald-400">Store your bow design with current pricing for future reference</p>
        </div>
        
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <Label htmlFor="bow-name" className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Bow Name
            </Label>
            <Input
              id="bow-name"
              placeholder="e.g., Classic Red Holiday Bow"
              value={bowName}
              onChange={(e) => setBowName(e.target.value)}
              className="mt-1 text-base border-emerald-300 focus:border-emerald-500"
            />
          </div>
          
          <Button 
            className="w-full gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 text-lg font-semibold" 
            disabled={!bowName.trim() || isSaving}
            onClick={saveBow}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving to Library...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Bow to Library
              </>
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              💡 Save now to access this design anytime and track your sales
            </p>
          </div>
        </div>
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
        {showSuccessAnimation ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="text-center space-y-8">
              {/* Success Icon Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 0.6, 
                  type: "spring",
                  stiffness: 200,
                  delay: 0.2
                }}
                className="mx-auto w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Check className="h-16 w-16 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-4"
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Bow Saved Successfully! 🎉
                </h2>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  Your beautiful bow "{bowName}" has been added to your library
                </p>
              </motion.div>

              {/* Loading Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                  <span>Redirecting to bow details...</span>
                </div>
              </motion.div>

              {/* Confetti Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      y: -100, 
                      x: Math.random() * window.innerWidth 
                    }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      y: window.innerHeight + 100,
                      x: Math.random() * window.innerWidth
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
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
        )}
      </AnimatePresence>
    </div>
  )
} 