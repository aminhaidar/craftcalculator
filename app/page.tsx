
import { BowLibrary } from "@/components/bow-library"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Package, 
  Palette, 
  TrendingUp, 
  DollarSign, 
  Clock,
  ArrowRight,
  Sparkles,
  Scissors,
  Calculator,
  Target
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-2">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Bow Design Studio
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Your
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"> Bow Collection</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Design, calculate costs, and manage your ribbon bow business. 
              Create new bows, explore pricing, and track your inventory.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/bow/new">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <Plus className="h-5 w-5" />
                  Create New Bow
                </Button>
              </Link>
              <Link href="/cost-explorer">
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                  <Calculator className="h-5 w-5" />
                  Cost Explorer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-muted-foreground">Total Bows</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">$847</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-muted-foreground">Ribbon Types</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">8</div>
                <div className="text-sm text-muted-foreground">Recipes</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Quick Actions</h2>
            <p className="text-muted-foreground">Manage your bow collection and explore costs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/bow/new">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Create New Bow</CardTitle>
                  <CardDescription>
                    Design a new bow with our step-by-step wizard
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/cost-explorer">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Cost Explorer</CardTitle>
                  <CardDescription>
                    Experiment with different ribbon combinations and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Explore Costs
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href="/inventory">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Manage Inventory</CardTitle>
                  <CardDescription>
                    Track your ribbon stock and see what you can create
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button variant="outline" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Inventory
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Bow Library */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <BowLibrary />
        </div>
      </section>
    </div>
  )
}
