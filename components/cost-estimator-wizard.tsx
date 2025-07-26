"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Calculator, 
  DollarSign, 
  Ruler, 
  Package, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Plus,
  Minus,
  Layers,
  Scissors,
  Copy,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
  totalCost: number
}

interface CostEstimate {
  layers: BowLayer[]
  totalCost: number
  suggestedPrice: number
  profitMargin: number
  bowsPerRoll: number
  totalProfit: number
}

export function CostEstimatorWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [layers, setLayers] = useState<BowLayer[]>([])
  const [estimate, setEstimate] = useState<CostEstimate | null>(null)
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showRibbonChoice, setShowRibbonChoice] = useState(false)
  const [pendingLayerId, setPendingLayerId] = useState<string | null>(null)
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
      totalCost: 0
    }
    setLayers([...layers, newLayer])
    
    // Collapse all previous layers and expand the new one
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
  }

  const updateLayer = (id: string, field: keyof BowLayer, value: string | number) => {
    setLayers(layers.map(layer => {
      if (layer.id === id) {
        const updatedLayer = { ...layer, [field]: value }
        
        // Auto-calculate cost per yard if ribbon cost or yards change
        if (field === 'ribbonCost' || field === 'ribbonYards') {
          updatedLayer.costPerYard = calculateCostPerYard(updatedLayer.ribbonCost, updatedLayer.ribbonYards)
        }
        
        // Calculate total inches and cost for this layer
        const totalInches = (updatedLayer.loops * updatedLayer.loopLength) + 
                           (updatedLayer.streamers * updatedLayer.streamerLength)
        const totalCost = (totalInches / 36) * updatedLayer.costPerYard // Convert inches to yards
        
        return {
          ...updatedLayer,
          totalInches,
          totalCost
        }
      }
      return layer
    }))
  }

  const calculateCostPerYard = (totalCost: number, totalYards: number) => {
    return totalYards > 0 ? totalCost / totalYards : 0
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

    const totalCost = layers.reduce((sum, layer) => sum + layer.totalCost, 0)
    const suggestedPrice = totalCost * 2.5 // 150% markup
    const profitMargin = ((suggestedPrice - totalCost) / suggestedPrice) * 100
    
    // Estimate bows per roll (assuming average 5 yards per roll)
    const averageInchesPerBow = layers.reduce((sum, layer) => sum + layer.totalInches, 0)
    const bowsPerRoll = Math.floor((5 * 36) / averageInchesPerBow) // 5 yards = 180 inches
    const totalProfit = (suggestedPrice - totalCost) * bowsPerRoll

    setEstimate({
      layers,
      totalCost,
      suggestedPrice,
      profitMargin,
      bowsPerRoll: Math.max(1, bowsPerRoll),
      totalProfit
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

  const toggleLayerExpansion = (layerId: string) => {
    const newExpanded = new Set(expandedLayers)
    if (newExpanded.has(layerId)) {
      newExpanded.delete(layerId)
    } else {
      newExpanded.add(layerId)
    }
    setExpandedLayers(newExpanded)
  }

  const useSameRibbon = () => {
    if (pendingLayerId && layers[0]) {
      const firstLayer = layers[0];
      
      // Update the layer with the same ribbon details
      setLayers(prevLayers => prevLayers.map(layer => {
        if (layer.id === pendingLayerId) {
          return {
            ...layer,
            ribbonType: firstLayer.ribbonType,
            ribbonCost: firstLayer.ribbonCost,
            ribbonYards: firstLayer.ribbonYards,
            costPerYard: calculateCostPerYard(firstLayer.ribbonCost, firstLayer.ribbonYards)
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

  const copyRibbonToAllLayers = () => {
    if (layers[0] && layers[0].ribbonType && layers[0].ribbonCost > 0 && layers[0].ribbonYards > 0) {
      const firstLayer = layers[0];
      layers.forEach((layer, index) => {
        if (index > 0) {
          updateLayer(layer.id, 'ribbonType', firstLayer.ribbonType);
          updateLayer(layer.id, 'ribbonCost', firstLayer.ribbonCost);
          updateLayer(layer.id, 'ribbonYards', firstLayer.ribbonYards);
        }
      });
      toast({
        title: "Ribbon copied!",
        description: "All layers now use the same ribbon details.",
      });
      // Scroll to top after copying ribbon details
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast({
        title: "Complete Layer 1 first",
        description: "Please fill in the ribbon details for Layer 1 before copying.",
        variant: "destructive",
      });
    }
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

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
          <Layers className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Design Your Bow</h3>
          <p className="text-muted-foreground">Add layers to your bow and specify the ribbon details</p>
        </div>

      </div>

      {/* Ribbon Choice Modal */}
      {showRibbonChoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg p-6 max-w-md w-full space-y-4">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
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
                <Copy className="h-4 w-4" />
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



      {/* Layers */}
      <div className="space-y-6">
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
                  className="space-y-4 p-4 bg-muted/20 rounded-lg border"
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
                      
                      <div className="space-y-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        {/* Ribbon Type */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Ribbon Type
                          </Label>
                          <Select
                            value={layer.ribbonType}
                            onValueChange={(value) => updateLayer(layer.id, 'ribbonType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ribbon type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="satin">Satin</SelectItem>
                              <SelectItem value="grosgrain">Grosgrain</SelectItem>
                              <SelectItem value="velvet">Velvet</SelectItem>
                              <SelectItem value="organza">Organza</SelectItem>
                              <SelectItem value="silk">Silk</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Ribbon Cost and Yards */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Total Ribbon Cost ($)
                            </Label>
                            
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                                $
                              </span>
                              <Input
                                id={`ribbonCost-${layer.id}`}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={layer.ribbonCost || ""}
                                onChange={(e) => updateLayer(layer.id, 'ribbonCost', parseFloat(e.target.value) || 0)}
                                className="pl-8 h-10 text-base"
                                inputMode="decimal"
                              />
                            </div>
                            
                            {/* Quick Cost Presets */}
                            <div className="flex gap-2 mt-2">
                              {[3, 5, 8, 10, 12, 15].map((cost) => (
                                <Button
                                  key={cost}
                                  type="button"
                                  variant={layer.ribbonCost === cost ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 text-xs px-2"
                                  onClick={() => updateLayer(layer.id, 'ribbonCost', cost)}
                                >
                                  ${cost}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Total Yards
                            </Label>
                            
                            <Input
                              id={`ribbonYards-${layer.id}`}
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                              value={layer.ribbonYards || ""}
                              onChange={(e) => updateLayer(layer.id, 'ribbonYards', parseFloat(e.target.value) || 0)}
                              className="h-10 text-base"
                              inputMode="decimal"
                            />
                            
                            {/* Quick Yards Presets */}
                            <div className="flex gap-2 mt-2">
                              {[3, 5, 8, 10, 15, 25].map((yards) => (
                                <Button
                                  key={yards}
                                  type="button"
                                  variant={layer.ribbonYards === yards ? "default" : "outline"}
                                  size="sm"
                                  className="h-8 text-xs px-2"
                                  onClick={() => updateLayer(layer.id, 'ribbonYards', yards)}
                                >
                                  {yards}y
                                </Button>
                              ))}
                            </div>
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
                      
                      <div className="space-y-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        {/* Loops */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Number of Loops
                          </Label>
                          
                          <Input
                            id={`loops-${layer.id}`}
                            type="number"
                            min="0"
                            placeholder="0"
                            value={layer.loops || ""}
                            onChange={(e) => updateLayer(layer.id, 'loops', parseInt(e.target.value) || 0)}
                            className="h-10 text-base"
                            inputMode="numeric"
                          />
                          
                          {/* Quick Loop Presets */}
                          <div className="flex gap-2 mt-2">
                            {[2, 4, 6, 8].map((loopCount) => (
                              <Button
                                key={loopCount}
                                type="button"
                                variant={layer.loops === loopCount ? "default" : "outline"}
                                size="sm"
                                className="h-8 text-xs px-2"
                                onClick={() => updateLayer(layer.id, 'loops', loopCount)}
                              >
                                {loopCount}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Loop Length (inches)
                          </Label>
                          <Input
                            id={`loopLength-${layer.id}`}
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0.0"
                            value={layer.loopLength || ""}
                            onChange={(e) => updateLayer(layer.id, 'loopLength', parseFloat(e.target.value) || 0)}
                            className="h-10 text-base"
                            inputMode="decimal"
                          />
                        </div>
                        
                        {/* Streamers */}
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Number of Streamers
                          </Label>
                          
                          <Input
                            id={`streamers-${layer.id}`}
                            type="number"
                            min="0"
                            placeholder="0"
                            value={layer.streamers || ""}
                            onChange={(e) => updateLayer(layer.id, 'streamers', parseInt(e.target.value) || 0)}
                            className="h-10 text-base"
                            inputMode="numeric"
                          />
                          
                          {/* Quick Streamer Presets */}
                          <div className="flex gap-2 mt-2">
                            {[0, 2, 4, 6].map((streamerCount) => (
                              <Button
                                key={streamerCount}
                                type="button"
                                variant={layer.streamers === streamerCount ? "default" : "outline"}
                                size="sm"
                                className="h-8 text-xs px-2"
                                onClick={() => updateLayer(layer.id, 'streamers', streamerCount)}
                              >
                                {streamerCount}
                              </Button>
                            ))}
                          </div>
                        </div>
                        
                        {layer.streamers > 0 && (
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Streamer Length (inches)
                            </Label>
                            <Input
                              id={`streamerLength-${layer.id}`}
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                              value={layer.streamerLength || ""}
                              onChange={(e) => updateLayer(layer.id, 'streamerLength', parseFloat(e.target.value) || 0)}
                              className="h-10 text-base"
                              inputMode="decimal"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Layer Summary */}
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
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
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <Calculator className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Review Your Design</h3>
          <p className="text-muted-foreground">Check your bow layers and prepare for calculation</p>
        </div>

      </div>

      <div className="space-y-4">
        {layers.map((layer, index) => (
          <Card key={layer.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Badge variant="outline">{index + 1}</Badge>
                Layer {index + 1} - {layer.ribbonType || "Unknown"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Ribbon Details</div>
                  <div className="text-sm text-muted-foreground">
                    ${layer.ribbonCost.toFixed(2)} for {layer.ribbonYards} yards
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cost: ${layer.costPerYard.toFixed(2)}/yard
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Components</div>
                  <div className="text-sm text-muted-foreground">
                    {layer.loops} loops, {layer.streamers} streamers
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium">Total Length</div>
                  <div className="text-sm text-muted-foreground">
                    {layer.totalInches.toFixed(1)} inches
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Layer Cost</div>
                  <div className="text-sm font-semibold text-green-600">
                    ${layer.totalCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Total Bow Cost</div>
                <div className="text-sm text-muted-foreground">
                  {layers.length} layer{layers.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${layers.reduce((sum, layer) => sum + layer.totalCost, 0).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      {/* Awesome Summary Animation */}
      <AnimatePresence>
        {showSummaryAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {/* Animated Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm"
            />
            
            {/* Floating Celebration Elements */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0,
                  rotate: 0,
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 100
                }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [0, 360],
                  y: -100,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                className="absolute"
              >
                <motion.div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#ff8b94'][Math.floor(Math.random() * 8)],
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            ))}
            
            {/* Success Message */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl"
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
              >
                Analysis Complete!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-white/90 drop-shadow-lg"
              >
                Your cost breakdown is ready
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
          <TrendingUp className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Your Cost Analysis</h3>
          <p className="text-muted-foreground">Here's what we calculated for your bow design</p>
        </div>

      </div>

      {estimate && (
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {/* Cost Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {estimate.layers.map((layer, index) => (
                <div key={layer.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium">Layer {index + 1} - {layer.ribbonType}</div>
                    <div className="text-sm text-muted-foreground">
                      {layer.totalInches.toFixed(1)} inches • ${layer.ribbonCost.toFixed(2)} for {layer.ribbonYards} yards
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Cost: ${layer.costPerYard.toFixed(2)}/yard
                    </div>
                  </div>
                  <div className="font-semibold">${layer.totalCost.toFixed(2)}</div>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-semibold text-lg">
                <span>Total Cost:</span>
                <span className="text-green-600">${estimate.totalCost.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Scenarios */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.6 }}
          >
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Pricing Scenarios
              </CardTitle>
              <CardDescription>Explore different pricing strategies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conservative Pricing (100% markup) */}
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-green-800 dark:text-green-200">Conservative</div>
                    <div className="text-sm text-green-600 dark:text-green-300">100% markup • Competitive</div>
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    ${(estimate.totalCost * 2).toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Profit: ${(estimate.totalCost).toFixed(2)} • Margin: 50%
                </div>
              </div>

              {/* Standard Pricing (150% markup) */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-blue-800 dark:text-blue-200">Standard</div>
                    <div className="text-sm text-blue-600 dark:text-blue-300">150% markup • Recommended</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    ${estimate.suggestedPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  Profit: ${(estimate.suggestedPrice - estimate.totalCost).toFixed(2)} • Margin: {estimate.profitMargin.toFixed(1)}%
                </div>
              </div>

              {/* Premium Pricing (200% markup) */}
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-purple-800 dark:text-purple-200">Premium</div>
                    <div className="text-sm text-purple-600 dark:text-purple-300">200% markup • High-end</div>
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    ${(estimate.totalCost * 3).toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">
                  Profit: ${(estimate.totalCost * 2).toFixed(2)} • Margin: 66.7%
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

          {/* Ribbon Usage Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
          >
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ribbon Usage Analysis
              </CardTitle>
              <CardDescription>Optimize your ribbon usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {estimate.layers.map((layer, index) => {
                const totalYardsNeeded = layer.totalInches / 36; // Convert inches to yards
                const bowsPerRoll = Math.floor(layer.ribbonYards / totalYardsNeeded);
                const unusedYards = layer.ribbonYards - (bowsPerRoll * totalYardsNeeded);
                const wastePercentage = (unusedYards / layer.ribbonYards) * 100;
                
                return (
                  <div key={layer.id} className="p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">Layer {index + 1} - {layer.ribbonType}</h4>
                      <Badge variant="outline">{bowsPerRoll} bows</Badge>
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Ribbon per bow:</div>
                        <div className="font-medium">{totalYardsNeeded.toFixed(2)} yards</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Unused per roll:</div>
                        <div className="font-medium">{unusedYards.toFixed(2)} yards</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Waste percentage:</div>
                        <div className={`font-medium ${wastePercentage > 20 ? 'text-orange-600' : 'text-green-600'}`}>
                          {wastePercentage.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Roll efficiency:</div>
                        <div className="font-medium text-green-600">
                          {((layer.ribbonYards - unusedYards) / layer.ribbonYards * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    {wastePercentage > 20 && (
                      <div className="mt-3 p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200 dark:border-orange-800">
                        <div className="text-sm text-orange-700 dark:text-orange-300">
                          💡 Consider adjusting loop/streamer lengths to reduce waste
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

          {/* Smart Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.7, duration: 0.6 }}
          >
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Smart Recommendations
              </CardTitle>
              <CardDescription>AI-powered insights for your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Pricing Recommendations */}
              {estimate.profitMargin >= 50 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Excellent profit margin! Consider the Premium pricing strategy.</span>
                </div>
              )}
              {estimate.profitMargin >= 30 && estimate.profitMargin < 50 && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Target className="h-4 w-4" />
                  <span>Good profit margin. The Standard pricing is perfect for most markets.</span>
                </div>
              )}
              {estimate.profitMargin < 30 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Zap className="h-4 w-4" />
                  <span>Lower profit margin. Consider the Conservative pricing or optimize costs.</span>
                </div>
              )}
              
              {/* Ribbon Efficiency Tips */}
              {estimate.layers.some(layer => {
                const totalYardsNeeded = layer.totalInches / 36;
                const bowsPerRoll = Math.floor(layer.ribbonYards / totalYardsNeeded);
                const unusedYards = layer.ribbonYards - (bowsPerRoll * totalYardsNeeded);
                const wastePercentage = (unusedYards / layer.ribbonYards) * 100;
                return wastePercentage > 20;
              }) && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Scissors className="h-4 w-4" />
                  <span>High ribbon waste detected. Consider adjusting loop/streamer lengths to optimize usage.</span>
                </div>
              )}
              
              {/* Bulk Order Insights */}
              <div className="flex items-center gap-2 text-blue-600">
                <Package className="h-4 w-4" />
                <span>For bulk orders, you can make {Math.min(...estimate.layers.map(layer => {
                  const totalYardsNeeded = layer.totalInches / 36;
                  return Math.floor(layer.ribbonYards / totalYardsNeeded);
                }))} bows per ribbon roll set.</span>
              </div>
              
              {/* Cost Optimization */}
              {estimate.totalCost > 10 && (
                <div className="flex items-center gap-2 text-purple-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>Consider buying ribbon in bulk to reduce cost per yard and increase profit margins.</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        </motion.div>
      </motion.div>
      )}
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
    <div className="min-h-screen flex flex-col">
      {/* Floating Live Summary - Native App Style */}
      <AnimatePresence>
        {currentStep === 1 && layers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-20 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4"
          >
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Total Bow Cost</p>
              <motion.p 
                className="text-2xl font-bold text-primary"
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
      </AnimatePresence>

      {/* Progress Bar - Minimal */}
      <motion.div 
        className="px-4 py-3 border-b bg-muted/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-muted-foreground">
            {currentStep === 1 && "Design Bow"}
            {currentStep === 2 && "Review Design"}
            {currentStep === 3 && "Results"}
          </span>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
        </motion.div>
      </motion.div>

      {/* Main Content - Native App Flow */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <AnimatePresence mode="wait" initial={false}>
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
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Navigation - Native App Style */}
      <motion.div 
        className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <motion.div 
          className="flex items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={currentStep >= 3 ? resetWizard : (currentStep === 1 && layers.length > 0 ? resetWizard : prevStep)}
              disabled={currentStep <= 1 && layers.length === 0}
              className="flex-1 sm:flex-none gap-2 h-12 sm:h-10"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {currentStep >= 3 ? "Start Over" : (currentStep === 1 && layers.length > 0 ? "Start Over" : "Previous")}
              </span>
            </Button>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Button
                type="button"
                onClick={nextStep}
                disabled={layers.length === 0}
                className="gap-2 h-12 sm:h-10 px-6"
              >
                <span className="hidden sm:inline">Review Design</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
            {currentStep > 1 && currentStep < 3 && (
              <Button
                type="button"
                onClick={calculateEstimate}
                disabled={layers.length === 0}
                className="gap-2 h-12 sm:h-10 px-6"
              >
                <span className="hidden sm:inline">Calculate Costs</span>
                <Calculator className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
} 