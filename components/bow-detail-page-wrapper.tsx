"use client"

import { BowDetailPage } from "@/components/bow-detail-page"
import { updateBow, type Bow } from "@/lib/bow-data"
import { useRouter } from "next/navigation"

interface BowDetailPageWrapperProps {
  bowId: string
}

export function BowDetailPageWrapper({ bowId }: BowDetailPageWrapperProps) {
  const router = useRouter()
  
  const handleSave = (updatedBow: Bow) => {
    updateBow(updatedBow)
    // Force a refresh of the page to show updated data
    router.refresh()
  }
  
  return <BowDetailPage bowId={bowId} onSave={handleSave} />
} 