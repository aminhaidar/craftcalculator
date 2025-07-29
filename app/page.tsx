
"use client"

import { Calculator, Plus, BookOpen, TrendingUp, Clock, Star, ArrowRight, Package, Gift } from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBows } from "@/hooks/use-api-data"

export default function HomePage() {
  const { bows, loading } = useBows()
  
  // Get the 3 most recent bows
  const recentBows = bows.slice(0, 3)
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6">
              <Calculator className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bow Cost Calculator
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Design, calculate, and optimize your bow pricing with precision
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/bow-calculator">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="h-5 w-5" />
                  Start Designing
                </Button>
              </Link>
              <Link href="/bows">
                <Button variant="outline" size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  View Library
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Bows Section */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Recent Bows</h2>
              <Link href="/bows">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                // Loading state
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    </div>
                  </Card>
                ))
              ) : recentBows.length > 0 ? (
                // Real data
                recentBows.map((bow, index) => (
                  <Link key={bow.id} href={`/bows/${bow.id}`}>
                    <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      {/* Bow Image */}
                      {bow.image && (
                        <div className="mb-3 aspect-video rounded-lg overflow-hidden">
                          <img 
                            src={bow.image} 
                            alt={bow.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 bg-gradient-to-r ${
                          index === 0 ? 'from-pink-500 to-purple-500' :
                          index === 1 ? 'from-blue-500 to-teal-500' :
                          'from-purple-500 to-pink-500'
                        } rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{bow.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {bow.layers} layers • {bow.materials?.length || 0} materials
                          </p>
                        </div>
                      </div>
                      
                      {/* Ribbon Details */}
                      <div className="space-y-2 mb-3">
                        {bow.materials?.slice(0, 2).map((material: any, matIndex: number) => (
                          <div key={matIndex} className="flex items-center gap-2 text-xs">
                            <div 
                              className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                              style={{ 
                                backgroundColor: material.ribbon?.colors?.[0] || '#ef4444' 
                              }}
                            />
                            <span className="text-muted-foreground truncate">
                              {material.ribbon?.ribbonType || 'Ribbon'} • {material.ribbon?.material || 'Material'}
                            </span>
                            {material.ribbon?.widthInches && (
                              <span className="text-muted-foreground">
                                {material.ribbon.widthInches}" wide
                              </span>
                            )}
                          </div>
                        ))}
                        {bow.materials?.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{bow.materials.length - 2} more materials
                          </div>
                        )}
                      </div>

                      {/* Style & Category Info */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {bow.category && (
                          <Badge variant="secondary" className="text-xs">
                            {bow.category}
                          </Badge>
                        )}
                        {bow.difficulty && (
                          <Badge variant="outline" className="text-xs">
                            {bow.difficulty}
                          </Badge>
                        )}
                        {bow.status && (
                          <Badge 
                            variant={bow.status === 'excellent' ? 'default' : 
                                   bow.status === 'good' ? 'secondary' : 'destructive'}
                            className="text-xs"
                          >
                            {bow.status}
                          </Badge>
                        )}
                      </div>

                      {/* Price & Profit */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">${bow.targetPrice?.toFixed(2) || '0.00'}</span>
                        <span className="text-muted-foreground">{bow.profitMargin?.toFixed(1) || '0'}% margin</span>
                      </div>
                    </Card>
                  </Link>
                ))
              ) : (
                // Empty state
                <div className="col-span-full text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mb-4">
                    <Gift className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No bows yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first bow design to get started</p>
                  <Link href="/bow-calculator">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Bow
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/bow-calculator">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Design New Bow</CardTitle>
                  <CardDescription>
                    Create a new bow design with our step-by-step calculator
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">4-step process</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/bows">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Bow Library</CardTitle>
                  <CardDescription>
                    View and manage your saved bow designs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Saved designs</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/cost-explorer">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Cost Explorer</CardTitle>
                  <CardDescription>
                    Analyze costs and optimize your pricing strategy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pricing insights</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our Calculator?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional-grade tools designed specifically for bow makers and craft businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Precise Calculations</h3>
                <p className="text-sm text-muted-foreground">
                  Accurate cost breakdowns including vendor fees, taxes, and shipping
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Profit Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time profit analysis with dynamic pricing recommendations
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Ribbon Efficiency</h3>
                <p className="text-sm text-muted-foreground">
                  Optimize ribbon usage and minimize waste with smart calculations
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Save Time</h3>
                <p className="text-sm text-muted-foreground">
                  Streamlined workflow saves hours on pricing calculations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
