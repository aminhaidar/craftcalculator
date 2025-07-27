
import { CostEstimatorWizard } from "@/components/cost-estimator-wizard"
import { Header } from "@/components/header"
import { Calculator } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Calculator */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CostEstimatorWizard />
        </div>
      </div>
    </div>
  )
}
