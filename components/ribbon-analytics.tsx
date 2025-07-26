"use client"

import { useRibbons, useBows } from "@/hooks/use-api-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Star, DollarSign, Package } from "lucide-react"

export function RibbonAnalytics() {
  const { ribbons } = useRibbons()
  const { bows } = useBows()

  const calculateRibbonAnalytics = () => {
    if (!ribbons.length || !bows.length) return []

    // Count ribbon usage in bows
    const ribbonUsage = ribbons.map(ribbon => {
      const usageCount = bows.filter(bow => 
        bow.materials?.some((material: any) => material.ribbonId === ribbon.id)
      ).length

      const totalValue = (ribbon.inStock || 0) * (ribbon.costPerYard || 0)
      const costPerBow = (24 / 36) * (ribbon.costPerYard || 0) // 24 inches per bow

      return {
        ...ribbon,
        usageCount,
        totalValue,
        costPerBow,
        popularity: usageCount > 0 ? 'Popular' : 'Unused',
        efficiency: ribbon.costPerYard ? (usageCount / (ribbon.costPerYard * 10)) : 0
      }
    })

    return ribbonUsage.sort((a, b) => b.usageCount - a.usageCount)
  }

  const analytics = calculateRibbonAnalytics()

  const mostPopular = analytics[0]
  const highestValue = analytics.sort((a, b) => b.totalValue - a.totalValue)[0]
  const mostEfficient = analytics.sort((a, b) => b.efficiency - a.efficiency)[0]
  const unusedRibbons = analytics.filter(r => r.usageCount === 0).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Most Popular Ribbon */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {mostPopular?.ribbonType || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Used in {mostPopular?.usageCount || 0} bows
            </p>
          </CardContent>
        </Card>

        {/* Highest Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {highestValue?.ribbonType || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${highestValue?.totalValue?.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>

        {/* Most Efficient */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Efficient</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium truncate">
              {mostEfficient?.ribbonType || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              ${mostEfficient?.costPerBow?.toFixed(2) || '0.00'} per bow
            </p>
          </CardContent>
        </Card>

        {/* Unused Ribbons */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unused Ribbons</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{unusedRibbons}</div>
            <p className="text-xs text-muted-foreground">
              Consider using or removing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popularity Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Ribbon Popularity Ranking</CardTitle>
          <CardDescription>
            Ribbons ranked by usage in bow designs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.slice(0, 5).map((ribbon, index) => (
              <div key={ribbon.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{ribbon.ribbonType}</div>
                    <div className="text-sm text-muted-foreground">
                      {ribbon.colors?.join(", ")} • {ribbon.widthInches}"
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={ribbon.usageCount > 0 ? "default" : "secondary"}>
                    {ribbon.usageCount} bows
                  </Badge>
                  <Badge variant="outline">
                    ${ribbon.costPerBow?.toFixed(2) || '0.00'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 