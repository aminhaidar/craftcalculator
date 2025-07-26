"use client"

import { useState } from "react"
import { 
  Plus, 
  Save, 
  X, 
  Package, 
  Palette, 
  Ruler, 
  Tag,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { 
  RibbonInventoryRecord,
  RibbonTypeOptions,
  WidthOptions,
  RollLengthOptions,
  DesignTypeOptions,
  ThemeOptions,
  ColorOptions,
  AvailabilityOptions,
  addNewRibbon
} from "@/lib/ribbon-data"

interface AddRibbonFormProps {
  onClose: () => void;
  onRibbonAdded: (ribbon: RibbonInventoryRecord) => void;
}

export function AddRibbonForm({ onClose, onRibbonAdded }: AddRibbonFormProps) {
  const [formData, setFormData] = useState({
    ribbonType: "",
    widthInches: 1.5,
    rollLengthYards: 25,
    designType: "Solid",
    theme: "",
    colors: ["Black"],
    availability: "In stock" as 'In stock' | 'Out of stock',
    brand: "",
    costPerYard: 0,
    supplier: "",
    wired: false,
    inStock: 0,
    minStock: 0,
    maxStock: 0,
    imageUrl: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.ribbonType.trim()) {
      newErrors.ribbonType = "Ribbon type is required";
    }

    if (!formData.designType.trim()) {
      newErrors.designType = "Design type is required";
    }

    if (formData.costPerYard < 0) {
      newErrors.costPerYard = "Cost per yard cannot be negative";
    }

    if (formData.inStock < 0) {
      newErrors.inStock = "Current stock cannot be negative";
    }

    if (formData.minStock < 0) {
      newErrors.minStock = "Minimum stock cannot be negative";
    }

    if (formData.maxStock < 0) {
      newErrors.maxStock = "Maximum stock cannot be negative";
    }

    if (formData.maxStock > 0 && formData.minStock > formData.maxStock) {
      newErrors.minStock = "Minimum stock cannot be greater than maximum stock";
    }

    if (formData.colors.length === 0) {
      newErrors.colors = "At least one color is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    const newRibbon = addNewRibbon({
      ribbonType: formData.ribbonType,
      material: formData.ribbonType,
      wired: formData.wired,
      widthInches: formData.widthInches,
      rollLengthYards: formData.rollLengthYards,
      designType: formData.designType,
      theme: formData.theme || undefined,
      colors: formData.colors,
      availability: formData.availability,
      brand: formData.brand || undefined,
      costPerYard: formData.costPerYard || undefined,
      supplier: formData.supplier || undefined,
      inStock: formData.inStock || undefined,
      minStock: formData.minStock || undefined,
      maxStock: formData.maxStock || undefined,
      imageUrl: formData.imageUrl || undefined
    });

    onRibbonAdded(newRibbon);
    onClose();
    
    toast({
      title: "Ribbon Added",
      description: "New ribbon has been added to inventory successfully.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border shadow-lg">
        <CardHeader className="sticky top-0 bg-background border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Ribbon
              </CardTitle>
              <CardDescription>
                Add a new ribbon to your inventory with all the details
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ribbonType">Ribbon Type *</Label>
                <Select value={formData.ribbonType} onValueChange={(value) => setFormData(prev => ({ ...prev, ribbonType: value }))}>
                  <SelectTrigger className={errors.ribbonType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select ribbon type" />
                  </SelectTrigger>
                  <SelectContent>
                    {RibbonTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.ribbonType && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.ribbonType}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designType">Design Type *</Label>
                <Select value={formData.designType} onValueChange={(value) => setFormData(prev => ({ ...prev, designType: value }))}>
                  <SelectTrigger className={errors.designType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select design type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DesignTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.designType && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.designType}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="width">Width (inches)</Label>
                <Select value={formData.widthInches.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, widthInches: parseFloat(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WidthOptions.map(width => (
                      <SelectItem key={width} value={width.toString()}>{width}"</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rollLength">Roll Length (yards)</Label>
                <Select value={formData.rollLengthYards.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, rollLengthYards: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RollLengthOptions.map(length => (
                      <SelectItem key={length} value={length.toString()}>{length} yards</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Wired</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    checked={formData.wired}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wired: checked }))}
                  />
                  <Label className="text-sm">{formData.wired ? "Yes" : "No"}</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Availability</Label>
                <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value as 'In stock' | 'Out of stock' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AvailabilityOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Colors and Theme */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Colors & Theme</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Colors *</Label>
                <div className="space-y-3">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Select 
                        value={color} 
                        onValueChange={(value) => {
                          const newColors = [...formData.colors];
                          newColors[index] = value;
                          setFormData(prev => ({ ...prev, colors: newColors }));
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ColorOptions.map(colorOption => (
                            <SelectItem key={colorOption} value={colorOption}>{colorOption}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.colors.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newColors = formData.colors.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, colors: newColors }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newColors = [...formData.colors, "Black"];
                      setFormData(prev => ({ ...prev, colors: newColors }));
                    }}
                  >
                    Add Color
                  </Button>
                </div>
                {errors.colors && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.colors}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Theme (Optional)</Label>
                <Select value={formData.theme} onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {ThemeOptions.map(theme => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Image */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Ribbon Image</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/ribbon-image.jpg"
              />
              <p className="text-xs text-muted-foreground">
                Add a URL to an image of this ribbon for better visual identification
              </p>
            </div>
          </div>

          <Separator />

          {/* Pricing and Supplier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Pricing & Supplier</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="costPerYard">Cost per Yard ($)</Label>
                <Input
                  id="costPerYard"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPerYard}
                  onChange={(e) => setFormData(prev => ({ ...prev, costPerYard: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  className={errors.costPerYard ? "border-red-500" : ""}
                />
                {errors.costPerYard && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.costPerYard}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Brand name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Supplier name"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Levels */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Stock Levels</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="inStock">Current Stock (yards)</Label>
                <Input
                  id="inStock"
                  type="number"
                  min="0"
                  value={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className={errors.inStock ? "border-red-500" : ""}
                />
                {errors.inStock && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.inStock}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock (yards)</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className={errors.minStock ? "border-red-500" : ""}
                />
                {errors.minStock && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.minStock}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxStock">Maximum Stock (yards)</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  className={errors.maxStock ? "border-red-500" : ""}
                />
                {errors.maxStock && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.maxStock}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Add Ribbon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 