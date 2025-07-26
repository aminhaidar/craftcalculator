"use client"

import { useFieldArray } from "react-hook-form"
import { Plus, Trash2, Info } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RibbonUsageFormProps {
  control: any
  index: number
  ribbonData: {
    name: string
    color: string
    costPerInch: number
  }
}

export function RibbonUsageForm({ control, index, ribbonData }: RibbonUsageFormProps) {
  const {
    fields: loopFields,
    append: appendLoop,
    remove: removeLoop,
  } = useFieldArray({
    name: `ribbons.${index}.loops`,
    control,
  })

  const {
    fields: tailFields,
    append: appendTail,
    remove: removeTail,
  } = useFieldArray({
    name: `ribbons.${index}.tails`,
    control,
  })

  const {
    fields: streamerFields,
    append: appendStreamer,
    remove: removeStreamer,
  } = useFieldArray({
    name: `ribbons.${index}.streamers`,
    control,
  })

  // Calculate usage statistics
  const calculateUsage = () => {
    const loops = loopFields.reduce((sum, _, i) => {
      const quantity = control._getWatch(`ribbons.${index}.loops.${i}.quantity`) || 0
      const length = control._getWatch(`ribbons.${index}.loops.${i}.length`) || 0
      return sum + quantity * length
    }, 0)

    const tails = tailFields.reduce((sum, _, i) => {
      const quantity = control._getWatch(`ribbons.${index}.tails.${i}.quantity`) || 0
      const length = control._getWatch(`ribbons.${index}.tails.${i}.length`) || 0
      return sum + quantity * length
    }, 0)

    const streamers = streamerFields.reduce((sum, _, i) => {
      const quantity = control._getWatch(`ribbons.${index}.streamers.${i}.quantity`) || 0
      const length = control._getWatch(`ribbons.${index}.streamers.${i}.length`) || 0
      return sum + quantity * length
    }, 0)

    const totalInches = loops + tails + streamers
    const totalCost = totalInches * ribbonData.costPerInch

    return {
      totalInches,
      totalCost,
      loops,
      tails,
      streamers,
    }
  }

  const usage = calculateUsage()

  return (
    <div className="space-y-6">
      {/* Usage Summary */}
      <Card className="bg-muted/20" style={{ borderLeftColor: ribbonData.color, borderLeftWidth: "4px" }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Used</p>
              <p className="text-lg font-semibold">{(Number(usage.totalInches) || 0).toFixed(1)}"</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cost/Inch</p>
              <p className="text-lg font-semibold">${ribbonData.costPerInch.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ribbon Cost</p>
              <p className="text-lg font-semibold">${(Number(usage.totalCost) || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cost/Inch</p>
              <p className="text-lg font-semibold">${((Number(usage.totalCost) || 0) / Math.max((Number(usage.totalInches) || 1), 1)).toFixed(3)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Loops Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Loops</CardTitle>
                <CardDescription className="text-xs">Bow loops and center pieces</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {(Number(usage.loops) || 0).toFixed(1)}"
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loopFields.map((field, loopIndex) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2"
              >
                <FormField
                  control={control}
                  name={`ribbons.${index}.loops.${loopIndex}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Qty</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`ribbons.${index}.loops.${loopIndex}.length`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Length (in)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loopFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLoop(loopIndex)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 no-print"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendLoop({ quantity: 1, length: 6 })}
              className="w-full h-8 text-xs no-print"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Loop
            </Button>
          </CardContent>
        </Card>

        {/* Tails Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Tails</CardTitle>
                <CardDescription className="text-xs">Hanging ribbon tails</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {(Number(usage.tails) || 0).toFixed(1)}"
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tailFields.map((field, tailIndex) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2"
              >
                <FormField
                  control={control}
                  name={`ribbons.${index}.tails.${tailIndex}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Qty</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`ribbons.${index}.tails.${tailIndex}.length`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Length (in)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {tailFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTail(tailIndex)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 no-print"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </motion.div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendTail({ quantity: 2, length: 12 })}
              className="w-full h-8 text-xs no-print"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Tail
            </Button>
          </CardContent>
        </Card>

        {/* Streamers Section */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm flex items-center gap-1">
                  Streamers
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Long decorative ribbons</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription className="text-xs">Optional long ribbons</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {(Number(usage.streamers) || 0).toFixed(1)}"
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {streamerFields.map((field, streamerIndex) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end gap-2"
              >
                <FormField
                  control={control}
                  name={`ribbons.${index}.streamers.${streamerIndex}.quantity`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Qty</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`ribbons.${index}.streamers.${streamerIndex}.length`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="text-xs">Length (in)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.5" {...field} className="h-8 text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStreamer(streamerIndex)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 no-print"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </motion.div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendStreamer({ quantity: 1, length: 20 })}
              className="w-full h-8 text-xs no-print"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Streamer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
