"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calculator, DollarSign, TrendingUp, ShoppingCart, Sparkles, Info } from "lucide-react"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CostSummaryProps {
  ribbonCost: number
  additionalCosts: {
    picks?: number
    bushes?: number
    stems?: number
    misc?: number
    etsyFees?: number
    packaging?: number
    shipping?: number
    labor?: number
  }
  totalCost: number
  salesPrice: number
  profit: number
  profitMargin: number
}

export function CostSummary({
  ribbonCost,
  additionalCosts,
  totalCost,
  salesPrice,
  profit,
  profitMargin,
}: CostSummaryProps) {
  // Calculate alternative pricing scenarios
  const calculateAlternativePricing = (multiplier: number) => {
    const alternativePrice = totalCost * multiplier
    const alternativeProfit = alternativePrice - totalCost
    const alternativeMargin = (alternativeProfit / alternativePrice) * 100

    return {
      price: alternativePrice,
      profit: alternativeProfit,
      margin: alternativeMargin,
    }
  }

  const times2 = calculateAlternativePricing(2)
  const times2_5 = calculateAlternativePricing(2.5)
  const times3 = calculateAlternativePricing(3)

  // Determine profit status for styling
  const getProfitStatus = (margin: number) => {
    if (margin < 15) return "low"
    if (margin < 30) return "medium"
    return "high"
  }

  const profitStatus = getProfitStatus(profitMargin)

  const additionalCostsTotal = Object.values(additionalCosts).reduce((sum, cost) => sum + (Number(cost) || 0), 0)

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Pricing Recommendations</CardTitle>
          </div>
          <CardDescription>Alternative pricing scenarios based on common multipliers</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium">2x Cost</h3>
              <div className="rounded-lg border p-4 bg-gradient-to-br from-pink-500/5 to-transparent">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">${(Number(times2.price) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="text-sm font-medium">${(Number(times2.profit) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="text-sm font-medium">{(Number(times2.margin) || 0).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium">2.5x Cost</h3>
              <div className="rounded-lg border p-4 bg-gradient-to-br from-violet-500/5 to-transparent">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">${(Number(times2_5.price) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="text-sm font-medium">${(Number(times2_5.profit) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="text-sm font-medium">{(Number(times2_5.margin) || 0).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-medium">3x Cost</h3>
              <div className="rounded-lg border p-4 bg-gradient-to-br from-fuchsia-500/5 to-transparent">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-lg font-semibold">${(Number(times3.price) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit</p>
                    <p className="text-sm font-medium">${(Number(times3.profit) || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="text-sm font-medium">{(Number(times3.margin) || 0).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 flex justify-center py-4">
          <Badge variant="outline" className="text-sm px-3 py-1 border-dashed">
            Recommended: ${(Number(times2_5.price) || 0).toFixed(2)} (2.5x Cost)
          </Badge>
        </CardFooter>
      </Card>
      <Card className="overflow-hidden print-break">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Cost Summary</CardTitle>
          </div>
          <CardDescription>Breakdown of all costs and profit calculations</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Scissors className="h-4 w-4" />
                  Ribbon Cost
                </h3>
                <p className="text-lg font-semibold">${(Number(ribbonCost) || 0).toFixed(2)}</p>
              </div>
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50 relative group">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Additional Costs
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="w-auto max-w-xs">
                        <div className="space-y-1 text-xs">
                          <p className="font-medium">Additional costs include:</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <span>Picks:</span>
                            <span>${(Number(additionalCosts.picks) || 0).toFixed(2)}</span>
                            <span>Bushes:</span>
                            <span>${(Number(additionalCosts.bushes) || 0).toFixed(2)}</span>
                            <span>Stems:</span>
                            <span>${(Number(additionalCosts.stems) || 0).toFixed(2)}</span>
                            <span>Misc:</span>
                            <span>${(Number(additionalCosts.misc) || 0).toFixed(2)}</span>
                            <span>Etsy Fees:</span>
                            <span>${(Number(additionalCosts.etsyFees) || 0).toFixed(2)}</span>
                            <span>Packaging:</span>
                            <span>${(Number(additionalCosts.packaging) || 0).toFixed(2)}</span>
                            <span>Shipping:</span>
                            <span>${(Number(additionalCosts.shipping) || 0).toFixed(2)}</span>
                            <span>Labor:</span>
                            <span>${(Number(additionalCosts.labor) || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </h3>
                <p className="text-lg font-semibold">${(Number(additionalCostsTotal) || 0).toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg border p-4 bg-muted/20">
              <h3 className="text-sm font-medium text-muted-foreground">Total Cost of Goods Sold (COGS)</h3>
              <p className="text-2xl font-bold">${(Number(totalCost) || 0).toFixed(2)}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Sales Price
                </h3>
                <p className="text-lg font-semibold">${(Number(salesPrice) || 0).toFixed(2)}</p>
              </div>
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Profit
                </h3>
                <p className={`text-lg font-semibold ${profit < 0 ? "text-destructive" : ""}`}>${(Number(profit) || 0).toFixed(2)}</p>
                {profit < 0 && (
                  <Badge variant="destructive" className="mt-1">
                    Loss
                  </Badge>
                )}
              </div>
              <div className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <h3 className="text-sm font-medium text-muted-foreground">Profit Margin</h3>
                <p className={`text-lg font-semibold ${profit < 0 ? "text-destructive" : ""}`}>
                  {(Number(profitMargin) || 0).toFixed(1)}%
                </p>
                {profitStatus === "low" && profitMargin > 0 && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 mt-1">
                    Low Margin
                  </Badge>
                )}
                {profitStatus === "medium" && (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mt-1">
                    Good Margin
                  </Badge>
                )}
                {profitStatus === "high" && (
                  <Badge variant="outline" className="bg-violet-500/10 text-violet-500 border-violet-500/20 mt-1">
                    Excellent Margin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Scissors(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
      <line x1="20" x2="8.12" y1="4" y2="15.88"></line>
      <line x1="14.47" x2="20" y1="14.48" y2="20"></line>
      <line x1="8.12" x2="12" y1="8.12" y2="12"></line>
    </svg>
  )
}
