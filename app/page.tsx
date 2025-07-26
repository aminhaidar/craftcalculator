
import { CostEstimatorWizard } from "@/components/cost-estimator-wizard"
import { Header } from "@/components/header"
import { Calculator } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Clean Calculator App */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Simple Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="rounded-full bg-gradient-to-r from-pink-500 to-violet-500 p-2">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Bow Cost Calculator</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Calculate Your Bow Costs</h1>
            <p className="text-muted-foreground">Get instant pricing recommendations</p>
          </div>
          
          {/* Main Calculator */}
          <CostEstimatorWizard />
        </div>
      </div>
    </div>
  )
}
