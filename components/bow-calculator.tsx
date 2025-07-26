"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Sparkles, Calculator, Save, Copy, Upload, X, Camera } from "lucide-react"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BowDesigner } from "@/components/bow-designer"
import { CostSummary } from "@/components/cost-summary"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Separator } from "@/components/ui/separator"

const bowSchema = z.object({
  name: z.string().min(1, "Bow name is required"),
  description: z.string().optional(),
  image: z.string().optional(),
  ribbons: z.array(
    z.object({
      ribbonId: z.string(),
      ribbonName: z.string(),
      color: z.string(),
      costPerInch: z.number(),
      loops: z.array(
        z.object({
          quantity: z.number().min(0),
          length: z.number().min(0),
        }),
      ),
      tails: z.array(
        z.object({
          quantity: z.number().min(0),
          length: z.number().min(0),
        }),
      ),
      streamers: z.array(
        z.object({
          quantity: z.number().min(0),
          length: z.number().min(0),
        }),
      ),
    }),
  ),
  additionalCosts: z.object({
    picks: z.number().min(0).default(0),
    bushes: z.number().min(0).default(0),
    stems: z.number().min(0).default(0),
    misc: z.number().min(0).default(0),
    etsyFees: z.number().min(0).default(0),
    packaging: z.number().min(0).default(0),
    shipping: z.number().min(0).default(0),
    labor: z.number().min(0).default(0),
  }),
  targetPrice: z.number().min(0).default(0),
})

type BowFormValues = z.infer<typeof bowSchema>

// Mock ribbon inventory
const ribbonInventory = [
  {
    id: "1",
    name: "Pink Satin",
    color: "#ff5a8c",
    spoolCost: 5.99,
    spoolLength: 36,
    salesTax: 7,
    costPerInch: 0.18,
    inStock: 15,
  },
  {
    id: "2",
    name: "Blue Grosgrain",
    color: "#5a9cff",
    spoolCost: 4.99,
    spoolLength: 36,
    salesTax: 7,
    costPerInch: 0.15,
    inStock: 8,
  },
  {
    id: "3",
    name: "Green Velvet",
    color: "#5aff8c",
    spoolCost: 7.99,
    spoolLength: 24,
    salesTax: 7,
    costPerInch: 0.35,
    inStock: 5,
  },
]

const defaultBow: BowFormValues = {
  name: "New Bow Design",
  description: "",
  image: "",
  ribbons: [
    {
      ribbonId: "1",
      ribbonName: "Pink Satin",
      color: "#ff5a8c",
      costPerInch: 0.18,
      loops: [{ quantity: 4, length: 6 }],
      tails: [{ quantity: 2, length: 12 }],
      streamers: [],
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
  targetPrice: 15.99,
}

interface BowCalculatorProps {
  bowId?: string
}

export function BowCalculator({ bowId }: BowCalculatorProps) {
  const [activeTab, setActiveTab] = useState("design")
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<BowFormValues>({
    resolver: zodResolver(bowSchema),
    defaultValues: defaultBow,
    mode: "onChange",
  })

  const formValues = form.watch()

  // Calculate total costs
  const calculateRibbonCost = () => {
    return formValues.ribbons.reduce((total, ribbon) => {
      const loopsInches = ribbon.loops.reduce((sum, loop) => sum + loop.quantity * loop.length, 0)
      const tailsInches = ribbon.tails.reduce((sum, tail) => sum + tail.quantity * tail.length, 0)
      const streamersInches = ribbon.streamers.reduce((sum, streamer) => sum + streamer.quantity * streamer.length, 0)
      const totalInches = loopsInches + tailsInches + streamersInches
      return total + totalInches * ribbon.costPerInch
    }, 0)
  }

  const calculateAdditionalCosts = () => {
    const { picks, bushes, stems, misc, etsyFees, packaging, shipping, labor } = formValues.additionalCosts
    return picks + bushes + stems + misc + etsyFees + packaging + shipping + labor
  }

  const ribbonCost = calculateRibbonCost()
  const additionalCosts = calculateAdditionalCosts()
  const totalCost = ribbonCost + additionalCosts
  const profit = formValues.targetPrice - totalCost
  const profitMargin = formValues.targetPrice > 0 ? (profit / formValues.targetPrice) * 100 : 0

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        form.setValue("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    form.setValue("image", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onSubmit = (data: BowFormValues) => {
    toast({
      title: "Bow saved!",
      description: `${data.name} has been saved to your bow library.`,
    })
  }

  const duplicateBow = () => {
    const currentData = form.getValues()
    form.reset({
      ...currentData,
      name: `${currentData.name} (Copy)`,
    })
    toast({
      title: "Bow duplicated!",
      description: "You can now modify this copy.",
    })
  }

  return (
    <div className="space-y-6">
      {/* Bow Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {bowId === "new" ? "New Bow Design" : "Edit Bow Design"}
          </h1>
          <p className="text-muted-foreground">Design your bow and calculate the perfect price</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={duplicateBow} className="gap-2 bg-transparent">
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} className="gap-2">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Bow</span>
          </Button>
        </div>
      </div>

      {/* Bow Image - Pinterest Style */}
      {imagePreview && (
        <div className="relative w-full max-w-2xl mx-auto">
          <img
            src={imagePreview}
            alt="Bow preview"
            className="w-full h-64 sm:h-80 object-cover rounded-lg border shadow-sm"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Material Cost</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Ribbon: ${ribbonCost.toFixed(2)} + Other: ${additionalCosts.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Price</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formValues.targetPrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Your selling price</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit < 0 ? "text-destructive" : "text-green-600"}`}>
              ${profit.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">{profitMargin.toFixed(1)}% margin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {profitMargin >= 30 ? (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Excellent</Badge>
              ) : profitMargin >= 15 ? (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Good</Badge>
              ) : profitMargin > 0 ? (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Low Margin</Badge>
              ) : (
                <Badge variant="destructive">Loss</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="costs">Costs</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bow Details</CardTitle>
                  <CardDescription>Give your bow a name, description, and photo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bow Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Spring Garden Bow" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your bow design, colors, or special features..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <FormLabel>Bow Photo (Optional)</FormLabel>
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Bow preview"
                          className="w-full max-w-md h-48 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Upload a photo of your bow design</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose Image
                          </Button>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                  </div>
                </CardContent>
              </Card>

              <BowDesigner control={form.control} ribbonInventory={ribbonInventory} />
            </TabsContent>

            <TabsContent value="costs" className="space-y-6 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Costs</CardTitle>
                  <CardDescription>Enter costs for materials beyond ribbons</CardDescription>
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
                          <FormLabel>Etsy Fees ($)</FormLabel>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6 pt-6">
              <CostSummary
                ribbonCost={ribbonCost}
                additionalCosts={formValues.additionalCosts}
                totalCost={totalCost}
                salesPrice={formValues.targetPrice}
                profit={profit}
                profitMargin={profitMargin}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>

      <Toaster />
    </div>
  )
} 