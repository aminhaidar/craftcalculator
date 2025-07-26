import { CostExplorer } from "@/components/cost-explorer"
import { Header } from "@/components/header"

export default function CostExplorerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6">
        <CostExplorer />
      </div>
    </div>
  )
} 