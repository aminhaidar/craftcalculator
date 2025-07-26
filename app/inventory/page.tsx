import { RibbonInventory } from "@/components/ribbon-inventory"
import { Header } from "@/components/header"

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RibbonInventory />
      </main>
    </div>
  )
} 