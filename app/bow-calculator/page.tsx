import { CostEstimatorWizard } from "@/components/cost-estimator-wizard"
import { Header } from "@/components/header"

export default function BowCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <CostEstimatorWizard />
      </main>
    </div>
  )
} 