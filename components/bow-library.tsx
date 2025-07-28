"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BowPlaceholder } from "@/components/bow-placeholder"
import { BowVisual } from "@/components/bow-visual"
import { toast } from "@/components/ui/use-toast"

interface Bow {
  id: string
  name: string
  description: string
  totalCost: number
  targetPrice: number
  profit: number
  profitMargin: number
  status: string
  category: string
  tags: string[]
  layers: number
  createdAt: string
  image?: string
  materials: Array<{
    name: string
    quantity: string
    cost: number
  }>
}

export function BowLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [bows, setBows] = useState<Bow[]>([])
  const [filteredBows, setFilteredBows] = useState<Bow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBows = async () => {
      try {
        const response = await fetch('/api/bows')
        if (!response.ok) {
          throw new Error('Failed to fetch bows')
        }
        const data = await response.json()
        setBows(data)
        setFilteredBows(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bows')
      } finally {
        setLoading(false)
      }
    }

    fetchBows()
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = bows.filter(
      (bow: Bow) =>
        bow.name.toLowerCase().includes(query.toLowerCase()) ||
        bow.description.toLowerCase().includes(query.toLowerCase()) ||
        bow.materials.some((material) => material.name.toLowerCase().includes(query.toLowerCase())),
    )
    setFilteredBows(filtered)
  }

  const handleDelete = async (bowId: string) => {
    if (!confirm('Are you sure you want to delete this bow? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/bows/${bowId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the bow from the local state
        setBows(bows.filter(bow => bow.id !== bowId))
        setFilteredBows(filteredBows.filter(bow => bow.id !== bowId))
        
        toast({
          title: "Bow deleted successfully",
          description: "The bow has been removed from your library.",
        })
      } else {
        throw new Error('Failed to delete bow')
      }
    } catch (error) {
      toast({
        title: "Error deleting bow",
        description: "Please try again or check your connection.",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string, margin: number) => {
    switch (status) {
      case "excellent":
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium shadow-sm">
            ⭐ Excellent
          </Badge>
        )
      case "good":
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-sm">
            ✓ Good
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium shadow-sm">
            ⚠ Low
          </Badge>
        )
      default:
        return <Badge variant="destructive">Loss</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Bows</h1>
          <p className="text-muted-foreground">Manage your bow designs and pricing calculations</p>
        </div>
        <Link href="/bow/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Bow
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bows.length}</div>
            <p className="text-xs text-muted-foreground">Designs in library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${bows.length > 0 ? (bows.reduce((sum: number, bow: Bow) => sum + bow.profit, 0) / bows.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Per bow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bows.length > 0 ? (bows.reduce((sum: number, bow: Bow) => sum + bow.profitMargin, 0) / bows.length).toFixed(1) : '0.0'}%
            </div>
            <p className="text-xs text-muted-foreground">Profit margin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bows.filter((bow: Bow) => bow.profitMargin >= 50).length}</div>
            <p className="text-xs text-muted-foreground">50%+ margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bows..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bows...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Error loading bows</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Bow Grid */}
      {!loading && !error && (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBows.map((bow) => (
          <Card key={bow.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-1" onClick={() => window.location.href = `/bows/${bow.id}`}>
            <div className="aspect-video relative overflow-hidden">
              {bow.image ? (
                <img src={bow.image} alt={bow.name} className="object-cover w-full h-full" />
              ) : (
                <BowVisual bow={bow} />
              )}
              <div className="absolute top-2 right-2">{getStatusBadge(bow.status, bow.profitMargin)}</div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{bow.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{bow.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/bows/${bow.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/bows/${bow.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        handleDelete(bow.id)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {bow.materials.slice(0, 3).map((material, index) => {
                    // Extract color from material name
                    const getMaterialColor = (name: string): string => {
                      const materialName = name.toLowerCase()
                      if (materialName.includes('red')) return '#ef4444'
                      if (materialName.includes('blue')) return '#3b82f6'
                      if (materialName.includes('green')) return '#10b981'
                      if (materialName.includes('yellow')) return '#f59e0b'
                      if (materialName.includes('pink')) return '#ec4899'
                      if (materialName.includes('purple')) return '#8b5cf6'
                      if (materialName.includes('orange')) return '#f97316'
                      if (materialName.includes('black')) return '#1f2937'
                      if (materialName.includes('white')) return '#f3f4f6'
                      if (materialName.includes('gold')) return '#fbbf24'
                      if (materialName.includes('silver')) return '#9ca3af'
                      return '#6b7280'
                    }
                    
                    const color = getMaterialColor(material.name)
                    
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-2"
                        style={{ 
                          borderColor: color,
                          color: color,
                          backgroundColor: `${color}10`
                        }}
                      >
                        {material.name}
                      </Badge>
                    )
                  })}
                  {bow.materials.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{bow.materials.length - 3} more
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Cost</p>
                    <p className="font-semibold text-sm sm:text-base">${bow.totalCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Price</p>
                    <p className="font-semibold text-sm sm:text-base">${bow.targetPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs sm:text-sm">Profit</p>
                    <p className="font-semibold text-sm sm:text-base text-green-600">${bow.profit.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created {new Date(bow.createdAt).toLocaleDateString()}</span>
                  <span>{bow.profitMargin.toFixed(1)}% margin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBows.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No bows found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first bow design to get started"}
          </p>
          <Link href="/bow-calculator">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Bow
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
} 