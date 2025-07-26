"use client"

import { RecipeManager } from "@/components/recipe-manager"
import { Header } from "@/components/header"

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecipeManager />
      </main>
    </div>
  )
} 