"use client"

import { useFieldArray } from "react-hook-form"
import { Plus, Trash2, Package } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RibbonUsageForm } from "@/components/ribbon-usage-form"

interface BowDesignerProps {
  control: any
  ribbonInventory: Array<{
    id: string
    name: string
    color: string
    costPerInch: number
    inStock: number
  }>
}

export function BowDesigner({ control, ribbonInventory }: BowDesignerProps) {
  const {
    fields: ribbonFields,
    append: appendRibbon,
    remove: removeRibbon,
  } = useFieldArray({
    name: "ribbons",
    control,
  })

  const addRibbon = (ribbonId?: string) => {
    const selectedRibbon = ribbonId ? ribbonInventory.find((r) => r.id === ribbonId) : ribbonInventory[0]

    if (selectedRibbon) {
      appendRibbon({
        ribbonId: selectedRibbon.id,
        ribbonName: selectedRibbon.name,
        color: selectedRibbon.color,
        costPerInch: selectedRibbon.costPerInch,
        loops: [{ quantity: 2, length: 6 }],
        tails: [{ quantity: 2, length: 12 }],
        streamers: [],
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ribbon Selection
          </CardTitle>
          <CardDescription>Choose ribbons from your inventory and specify how much to use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {ribbonInventory.map((ribbon) => (
              <Button
                key={ribbon.id}
                type="button"
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2 bg-transparent"
                onClick={() => addRibbon(ribbon.id)}
              >
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: ribbon.color }} />
                <span className="font-medium">{ribbon.name}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>${ribbon.costPerInch.toFixed(3)}/inch</span>
                  <Badge variant={ribbon.inStock > 5 ? "default" : "destructive"} className="text-xs">
                    {ribbon.inStock} in stock
                  </Badge>
                </div>
              </Button>
            ))}
          </div>

          {ribbonFields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No ribbons selected. Choose ribbons from your inventory above.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {ribbonFields.map((field, index) => (
        <motion.div
          key={field.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-l-4" style={{ borderLeftColor: control._getWatch(`ribbons.${index}.color`) }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: control._getWatch(`ribbons.${index}.color`) }}
                  />
                  <div>
                    <CardTitle className="text-lg">{control._getWatch(`ribbons.${index}.ribbonName`)}</CardTitle>
                    <CardDescription>
                      ${control._getWatch(`ribbons.${index}.costPerInch`)?.toFixed(3)} per inch
                    </CardDescription>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRibbon(index)}
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RibbonUsageForm
                control={control}
                index={index}
                ribbonData={{
                  name: control._getWatch(`ribbons.${index}.ribbonName`),
                  color: control._getWatch(`ribbons.${index}.color`),
                  costPerInch: control._getWatch(`ribbons.${index}.costPerInch`),
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {ribbonFields.length > 0 && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed bg-transparent"
          onClick={() => addRibbon()}
        >
          <Plus className="h-4 w-4" />
          Add Another Ribbon
        </Button>
      )}
    </div>
  )
} 