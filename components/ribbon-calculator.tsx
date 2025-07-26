"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import {
  Plus,
  Trash2,
  Save,
  FileUp,
  Download,
  Info,
  Scissors,
  Calculator,
  DollarSign,
  ShoppingCart,
  Repeat,
  Ruler,
} from "lucide-react"
import * as z from "zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CostSummary } from "@/components/cost-summary"
import { RibbonUsageForm } from "@/components/ribbon-usage-form"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Define the schema for ribbon data
const ribbonSchema = z.object({
  name: z.string().min(1, "Ribbon name is required"),
  color: z.string().default("#ff5a8c"),
  spoolCost: z.coerce.number().min(0, "Cost must be a positive number"),
  spoolLength: z.coerce.number().min(0, "Length must be a positive number"),
  salesTax: z.coerce.number().min(0, "Tax must be a positive number").default(0),
  loops: z.array(
    z.object({
      quantity: z.coerce.number().min(0, "Quantity must be a positive number"),
      length: z.coerce.number().min(0, "Length must be a positive number"),
    }),
  ),
  tails: z.array(
    z.object({
      quantity: z.coerce.number().min(0, "Quantity must be a positive number"),
      length: z.coerce.number().min(0, "Length must be a positive number"),
    }),
  ),
  streamers: z.array(
    z.object({
      quantity: z.coerce.number().min(0, "Quantity must be a positive number"),
      length: z.coerce.number().min(0, "Length must be a positive number"),
    }),
  ),
})

const formSchema = z.object({
  ribbons: z.array(ribbonSchema),
  additionalCosts: z.object({
    picks: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    bushes: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    stems: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    misc: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    etsyFees: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    packaging: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    shipping: z.coerce.number().min(0, "Cost must be a positive number").default(0),
    labor: z.coerce.number().min(0, "Cost must be a positive number").default(0),
  }),
  salesPrice: z.coerce.number().min(0, "Price must be a positive number").default(0),
})

type FormValues = z.infer<typeof formSchema>

// Default values for the form
const defaultValues: FormValues = {
  ribbons: [
    {
      name: "Pink Satin",
      color: "#ff5a8c",
      spoolCost: 5.99,
      spoolLength: 3,
      salesTax: 7,
      loops: [{ quantity: 4, length: 6 }],
      tails: [{ quantity: 2, length: 12 }],
      streamers: [{ quantity: 0, length: 0 }],
    },
  ],
  additionalCosts: {
    picks: 0.5,
    bushes: 0,
    stems: 0.75,
    misc: 0.25,
    etsyFees: 1.2,
    packaging: 0.5,
    shipping: 0,
    labor: 5,
  },
  salesPrice: 25,
}

export function RibbonCalculator() {
  const [activeTab, setActiveTab] = useState("ribbons")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ribbons",
  })

  // Calculate ribbon cost
  const calculateRibbonCost = (data: FormValues) => {
    return data.ribbons.reduce((total, ribbon) => {
      const spoolCostWithTax = ribbon.spoolCost * (1 + ribbon.salesTax / 100)
      const costPerInch = spoolCostWithTax / (ribbon.spoolLength * 12)
      const totalInches = ribbon.loops.reduce((sum, loop) => sum + loop.quantity * loop.length, 0) +
        ribbon.tails.reduce((sum, tail) => sum + tail.quantity * tail.length, 0) +
        ribbon.streamers.reduce((sum, streamer) => sum + streamer.quantity * streamer.length, 0)
      return total + totalInches * costPerInch
    }, 0)
  }

  // Calculate additional costs
  const calculateAdditionalCosts = (data: FormValues) => {
    const { picks, bushes, stems, misc, etsyFees, packaging, shipping, labor } = data.additionalCosts
    return (picks || 0) + (bushes || 0) + (stems || 0) + (misc || 0) + (etsyFees || 0) + (packaging || 0) + (shipping || 0) + (labor || 0)
  }

  const onSubmit = (data: FormValues) => {
    console.log(data)
  }

  const addNewRibbon = () => {
    const newRibbon = {
      name: `Ribbon ${fields.length + 1}`,
      color: getRandomColor(),
      spoolCost: 4.99,
      spoolLength: 3,
      salesTax: 7,
      loops: [{ quantity: 4, length: 6 }],
      tails: [{ quantity: 2, length: 12 }],
      streamers: [{ quantity: 0, length: 0 }],
    }
    append(newRibbon)
  }

  const getRandomColor = () => {
    const colors = ["#ff5a8c", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const saveCalculation = () => {
    const formData = form.getValues()
    const dataStr = JSON.stringify(formData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `bow-calculation-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({
      title: "Calculation saved!",
      description: "Your bow calculation has been saved to your device.",
    })
  }

  const loadCalculation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        form.reset(data)
        toast({
          title: "Calculation loaded!",
          description: "Your bow calculation has been loaded successfully.",
        })
      } catch (error) {
        toast({
          title: "Error loading file",
          description: "Please make sure you're loading a valid calculation file.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // Get form values for calculations
  const formValues = form.watch()
  const ribbonCost = calculateRibbonCost(formValues)
  const additionalCostsTotal = calculateAdditionalCosts(formValues)
  const totalCost = ribbonCost + additionalCostsTotal
  const profit = (formValues.salesPrice || 0) - totalCost
  const profitMargin = (formValues.salesPrice || 0) > 0 ? (profit / (formValues.salesPrice || 1)) * 100 : 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Scissors className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Bow Cost Calculator</h1>
                  <p className="text-muted-foreground">
                    Calculate costs and pricing for your ribbon bow business
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={saveCalculation}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="outline" size="sm" className="relative gap-2">
                        <FileUp className="h-4 w-4" />
                        Load
                        <input
                          type="file"
                          accept=".json"
                          onChange={loadCalculation}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Load a previously saved calculation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button type="button" variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
                  <Download className="h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
            <Separator />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ribbons" className="gap-2">
                <Scissors className="h-4 w-4" />
                Ribbon Details
              </TabsTrigger>
              <TabsTrigger value="costs" className="gap-2">
                <Calculator className="h-4 w-4" />
                Costs & Pricing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ribbons" className="space-y-6 pt-4">
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="text-sm">Quick Add Ribbon</CardTitle>
                  <CardDescription>Quickly add a ribbon with common measurements</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-6 flex flex-col gap-2 bg-transparent"
                      onClick={() =>
                        append({
                          name: "Standard Loops",
                          color: "#ff5a8c",
                          spoolCost: 4.99,
                          spoolLength: 3,
                          salesTax: 7,
                          loops: [{ quantity: 6, length: 6 }],
                          tails: [{ quantity: 2, length: 12 }],
                          streamers: [],
                        })
                      }
                    >
                      <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-3">
                        <Repeat className="h-6 w-6 text-pink-500" />
                      </div>
                      <span>Standard Loops</span>
                      <span className="text-xs text-muted-foreground">6 loops (6") + 2 tails (12")</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-6 flex flex-col gap-2 bg-transparent"
                      onClick={() =>
                        append({
                          name: "Long Tails",
                          color: "#5a9cff",
                          spoolCost: 5.99,
                          spoolLength: 3,
                          salesTax: 7,
                          loops: [{ quantity: 4, length: 5 }],
                          tails: [{ quantity: 4, length: 18 }],
                          streamers: [],
                        })
                      }
                    >
                      <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3">
                        <Ruler className="h-6 w-6 text-blue-500" />
                      </div>
                      <span>Long Tails</span>
                      <span className="text-xs text-muted-foreground">4 loops (5") + 4 tails (18")</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto py-6 flex flex-col gap-2 bg-transparent"
                      onClick={() =>
                        append({
                          name: "Streamers",
                          color: "#5aff8c",
                          spoolCost: 6.99,
                          spoolLength: 3,
                          salesTax: 7,
                          loops: [{ quantity: 4, length: 4 }],
                          tails: [{ quantity: 2, length: 10 }],
                          streamers: [{ quantity: 2, length: 20 }],
                        })
                      }
                    >
                      <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                        <Ruler className="h-6 w-6 rotate-45 text-green-500" />
                      </div>
                      <span>Streamers</span>
                      <span className="text-xs text-muted-foreground">
                        4 loops (4") + 2 tails (10") + 2 streamers (20")
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className="overflow-hidden border-t-4"
                    style={{ borderTopColor: form.watch(`ribbons.${index}.color`) }}
                  >
                    <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: form.watch(`ribbons.${index}.color`) }}
                          ></div>
                          <CardTitle className="text-lg">
                            {form.watch(`ribbons.${index}.name`) || `Ribbon ${index + 1}`}
                          </CardTitle>
                        </div>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              remove(index)
                              toast({
                                title: "Ribbon removed",
                                description: "The ribbon has been removed from your calculation.",
                              })
                            }}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 no-print"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove ribbon</span>
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid gap-6 md:grid-cols-5">
                        <FormField
                          control={form.control}
                          name={`ribbons.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ribbon Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Red Satin" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ribbons.${index}.color`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input type="color" {...field} className="w-12 h-10 p-1 cursor-pointer" />
                                  <Input type="text" value={field.value} onChange={field.onChange} className="flex-1" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ribbons.${index}.spoolCost`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spool Cost ($)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ribbons.${index}.spoolLength`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spool Length (ft)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`ribbons.${index}.salesTax`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sales Tax (%)</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.1" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Separator className="my-6" />

                      <RibbonUsageForm
                        control={form.control}
                        index={index}
                        spoolLength={form.watch(`ribbons.${index}.spoolLength`)}
                        spoolCost={form.watch(`ribbons.${index}.spoolCost`)}
                        salesTax={form.watch(`ribbons.${index}.salesTax`)}
                        color={form.watch(`ribbons.${index}.color`)}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full gap-2 border-dashed no-print bg-transparent"
                  onClick={addNewRibbon}
                >
                  <Plus className="h-4 w-4" />
                  Add Another Ribbon
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>Additional Costs</CardTitle>
                  </div>
                  <CardDescription>Enter any other materials or costs associated with your bow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="additionalCosts.picks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Picks ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalCosts.bushes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bushes ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalCosts.stems"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stems ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalCosts.misc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Miscellaneous ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="additionalCosts.etsyFees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span className="flex items-center gap-1">
                              Etsy Fees ($)
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Listing fees, transaction fees, etc.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalCosts.packaging"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Packaging ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalCosts.shipping"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="additionalCosts.labor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Labor ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="salesPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            Sales Price ($)
                          </FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 flex justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Ribbon Cost: ${(Number(ribbonCost) || 0).toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Additional: ${(Number(additionalCostsTotal) || 0).toFixed(2)}
                    </Badge>
                  </div>
                  <Badge className="text-md px-3 py-1">Total COGS: ${(Number(totalCost) || 0).toFixed(2)}</Badge>
                </CardFooter>
              </Card>

              <CostSummary
                ribbonCost={ribbonCost}
                additionalCosts={formValues.additionalCosts}
                totalCost={totalCost}
                salesPrice={formValues.salesPrice}
                profit={profit}
                profitMargin={profitMargin}
              />
            </TabsContent>
          </Tabs>
        </div>
      </form>
      <Toaster />
    </Form>
  )
}
