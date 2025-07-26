"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Package, TrendingUp, DollarSign, Eye, MoreHorizontal, AlertTriangle, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { AddRibbonForm } from "@/components/add-ribbon-form"
import { RibbonAnalytics } from "@/components/ribbon-analytics"
import { RibbonPlaceholder } from "@/components/ribbon-placeholder"
import { useRibbons } from "@/hooks/use-api-data"

export function RibbonInventory() {
  const [searchQuery, setSearchQuery] = useState("")
  const { ribbons, loading, error, refetch } = useRibbons()
  const [filteredRibbons, setFilteredRibbons] = useState(ribbons)
  const [showAddForm, setShowAddForm] = useState(false)

  // Update filtered ribbons when ribbons data changes
  useEffect(() => {
    setFilteredRibbons(ribbons)
  }, [ribbons])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = ribbons.filter(ribbon => 
        ribbon.ribbonType?.toLowerCase().includes(query.toLowerCase()) ||
        ribbon.designType?.toLowerCase().includes(query.toLowerCase()) ||
        ribbon.theme?.toLowerCase().includes(query.toLowerCase()) ||
        ribbon.brand?.toLowerCase().includes(query.toLowerCase()) ||
        ribbon.colors?.some((color: string) => color.toLowerCase().includes(query.toLowerCase()))
      )
      setFilteredRibbons(filtered)
    } else {
      setFilteredRibbons(ribbons)
    }
  }

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100
    if (current <= min) return { status: "low", color: "bg-red-500", text: "Low Stock", variant: "destructive" as const }
    if (percentage <= 50) return { status: "medium", color: "bg-yellow-500", text: "Medium", variant: "secondary" as const }
    return { status: "good", color: "bg-green-500", text: "Good", variant: "default" as const }
  }

  const getRibbonDisplayName = (ribbon: any) => {
    const colorNames = ribbon.colors?.join(", ") || "Unknown"
    const type = ribbon.ribbonType || "Ribbon"
    const design = ribbon.designType !== "Solid" ? ` ${ribbon.designType}` : ""
    const theme = ribbon.theme ? ` - ${ribbon.theme}` : ""
    return `${colorNames} ${type}${design}${theme}`
  }

  const getRibbonColor = (ribbon: any) => {
    if (ribbon.colors && ribbon.colors.length > 0) {
      const color = ribbon.colors[0].toLowerCase()
      const colorMap: { [key: string]: string } = {
        'pink': '#ff69b4',
        'red': '#ff4444',
        'blue': '#4444ff',
        'green': '#44ff44',
        'purple': '#8844ff',
        'gold': '#ffd700',
        'silver': '#c0c0c0',
        'white': '#ffffff',
        'black': '#000000',
        'yellow': '#ffff00',
        'orange': '#ffa500',
        'brown': '#8b4513',
        'gray': '#808080',
        'grey': '#808080'
      }
      return colorMap[color] || '#cccccc'
    }
    return '#cccccc'
  }

  const calculateRibbonMetrics = (ribbon: any) => {
    const averageBowUsage = 24 // inches
    const bowsWithCurrentStock = Math.floor((ribbon.inStock || 0) / averageBowUsage)
    const currentInventoryValue = (ribbon.inStock || 0) * (ribbon.costPerYard || 0)
    const costPerBow = (averageBowUsage / 36) * (ribbon.costPerYard || 0)
    const stockPercentage = ribbon.maxStock ? ((ribbon.inStock || 0) / ribbon.maxStock) * 100 : 0
    
    return {
      bowsWithCurrentStock,
      currentInventoryValue,
      costPerBow,
      stockPercentage
    }
  }

  const handleRibbonAdded = () => {
    refetch() // Refresh data from API
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Ribbon Inventory</h1>
            <p className="text-muted-foreground">Loading ribbon data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading ribbons...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Ribbon Inventory</h1>
            <p className="text-muted-foreground">Error loading ribbon data</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={refetch} className="mt-2">Retry</Button>
          </div>
        </div>
      </div>
    )
  }

  // Calculate overall metrics
  const totalRibbons = ribbons.length
  const totalValue = ribbons.reduce((sum, ribbon) => sum + (ribbon.costPerYard || 0) * (ribbon.inStock || 0), 0)
  const lowStockCount = ribbons.filter((ribbon) => (ribbon.inStock || 0) <= (ribbon.minStock || 0)).length
  const avgCostPerYard = ribbons.reduce((sum, ribbon) => sum + (ribbon.costPerYard || 0), 0) / ribbons.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Ribbon Inventory</h1>
          <p className="text-muted-foreground">Manage your ribbon stock and discover insights</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4" />
          Add Ribbon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ribbons</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRibbons}</div>
            <p className="text-xs text-muted-foreground">Different types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Yard</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgCostPerYard.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average cost</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Need reordering</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <RibbonAnalytics />

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search ribbons by type, color, theme, or brand..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Ribbon Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRibbons.map((ribbon) => {
          const metrics = calculateRibbonMetrics(ribbon)
          const stockStatus = getStockStatus(ribbon.inStock || 0, ribbon.minStock || 0, ribbon.maxStock || 1)
          const displayName = getRibbonDisplayName(ribbon)
          const ribbonColor = getRibbonColor(ribbon)
          
          return (
            <Link key={ribbon.id} href={`/ribbons/${ribbon.id}`} className="block">
              <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                {/* Ribbon Image */}
                <div className="relative">
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    {ribbon.imageUrl ? (
                      <Image
                        src={ribbon.imageUrl}
                        alt={`${ribbon.ribbonType} ribbon`}
                        fill
                        className="object-cover rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <RibbonPlaceholder 
                        ribbonType={ribbon.ribbonType}
                        colors={ribbon.colors}
                      />
                    )}
                  </AspectRatio>
                </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold truncate leading-tight">
                      {ribbon.ribbonType}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {ribbon.colors?.join(", ")} • {ribbon.widthInches}" × {ribbon.rollLengthYards}yd
                    </CardDescription>
                    {ribbon.theme && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {ribbon.theme}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {/* Stock Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stock Level</span>
                    <Badge variant={stockStatus.variant} className="text-xs">
                      {stockStatus.text}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{ribbon.inStock || 0} yards</span>
                      <span>{ribbon.maxStock ? `${ribbon.maxStock} yards` : 'No max set'}</span>
                    </div>
                    <Progress value={metrics.stockPercentage} className="h-2" />
                  </div>
                </div>

                <Separator />

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Cost/Yard</p>
                    <p className="font-semibold">${ribbon.costPerYard?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Bows Possible</p>
                    <p className="font-semibold">{metrics.bowsWithCurrentStock}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Inventory Value</p>
                    <p className="font-semibold">${metrics.currentInventoryValue.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Cost/Bow</p>
                    <p className="font-semibold">${metrics.costPerBow.toFixed(2)}</p>
                  </div>
                </div>

                                                  </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredRibbons.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No ribbons found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms." : "Get started by adding your first ribbon."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Ribbon
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Ribbon Form */}
      {showAddForm && (
        <AddRibbonForm 
          onClose={() => setShowAddForm(false)} 
          onRibbonAdded={handleRibbonAdded}
        />
      )}
    </div>
  )
} 