"use client"

import { useState } from "react"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BowPlaceholder } from "@/components/bow-placeholder"
import { getAllBows } from "@/lib/bow-data"

// Get bow data from service and sort by most recent
const mockBows = getAllBows().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

export function BowLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBows, setFilteredBows] = useState(mockBows)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = mockBows.filter(
      (bow) =>
        bow.name.toLowerCase().includes(query.toLowerCase()) ||
        bow.description.toLowerCase().includes(query.toLowerCase()) ||
        bow.ribbons.some((ribbon) => ribbon.toLowerCase().includes(query.toLowerCase())),
    )
    setFilteredBows(filtered)
  }

  const getStatusBadge = (status: string, margin: number) => {
    switch (status) {
      case "excellent":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Excellent</Badge>
      case "good":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white">Good</Badge>
      case "low":
        return <Badge variant="outline" className="border-amber-500 text-amber-700 dark:text-amber-300">Low</Badge>
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
            <div className="text-2xl font-bold">{mockBows.length}</div>
            <p className="text-xs text-muted-foreground">Designs in library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockBows.reduce((sum, bow) => sum + bow.profit, 0) / mockBows.length).toFixed(2)}
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
              {(mockBows.reduce((sum, bow) => sum + bow.profitMargin, 0) / mockBows.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Profit margin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBows.filter((bow) => bow.profitMargin >= 50).length}</div>
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

      {/* Bow Grid */}
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBows.map((bow) => (
          <Card key={bow.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => window.location.href = `/bow/${bow.id}`}>
            <div className="aspect-video relative overflow-hidden">
              {bow.image ? (
                <img src={bow.image} alt={bow.name} className="object-cover w-full h-full" />
              ) : (
                <BowPlaceholder name={bow.name} />
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
                      <Link href={`/bow/${bow.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/bow/${bow.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
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
                  {bow.ribbons.map((ribbon, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {ribbon}
                    </Badge>
                  ))}
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

      {filteredBows.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No bows found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search terms" : "Create your first bow design to get started"}
          </p>
          <Link href="/bow/new">
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