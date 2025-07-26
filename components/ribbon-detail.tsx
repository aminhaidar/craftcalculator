"use client"

import { useState } from "react"
import { 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Package, 
  Palette, 
  Ruler, 
  Tag,
  Calendar,
  Building,
  DollarSign,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
  updateRibbon,
  deleteRibbon
} from "@/lib/ribbon-data"

interface RibbonDetailProps {
  ribbon: RibbonInventoryRecord;
  onClose: () => void;
  onUpdate: (ribbon: RibbonInventoryRecord) => void;
  onDelete: (id: string) => void;
}

export function RibbonDetail({ ribbon, onClose, onUpdate, onDelete }: RibbonDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<RibbonInventoryRecord>(ribbon);

  const handleSave = () => {
    if (!formData.ribbonType.trim()) {
      toast({
        title: "Error",
        description: "Ribbon type is required.",
        variant: "destructive",
      });
      return;
    }

    updateRibbon(formData);
    onUpdate(formData);
    setIsEditing(false);
    toast({
      title: "Ribbon Updated",
      description: "Ribbon details have been updated successfully.",
    });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this ribbon?`)) {
      deleteRibbon(ribbon.ribbonId);
      onDelete(ribbon.ribbonId);
      toast({
        title: "Ribbon Deleted",
        description: "The ribbon has been removed from inventory.",
      });
    }
  };

  const handleCancel = () => {
    setFormData(ribbon);
    setIsEditing(false);
  };

  const getStockStatus = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    if (current <= min) return { status: "low", color: "bg-red-500", text: "Low Stock" };
    if (percentage <= 50) return { status: "medium", color: "bg-yellow-500", text: "Medium" };
    return { status: "good", color: "bg-green-500", text: "Good" };
  };

  const stockStatus = ribbon.inStock && ribbon.minStock && ribbon.maxStock 
    ? getStockStatus(ribbon.inStock, ribbon.minStock, ribbon.maxStock)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Ribbon" : ribbon.ribbonType}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? "Update ribbon details" : "Ribbon inventory details"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={onClose} className="gap-2">
                <X className="h-4 w-4" />
                Close
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="outline" onClick={handleCancel} className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stock Status Alert */}
      {stockStatus && stockStatus.status === "low" && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">Low Stock Alert</p>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Current stock ({ribbon.inStock}) is below minimum threshold ({ribbon.minStock})
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Ribbon Type</Label>
              {isEditing ? (
                <Select value={formData.ribbonType} onValueChange={(value) => setFormData(prev => ({ ...prev, ribbonType: value, material: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RibbonTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="secondary">{ribbon.ribbonType}</Badge>
                </div>
              )}
            </div>

            <div>
              <Label>Design Type</Label>
              {isEditing ? (
                <Select value={formData.designType} onValueChange={(value) => setFormData(prev => ({ ...prev, designType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DesignTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="outline">{ribbon.designType}</Badge>
                </div>
              )}
            </div>

            <div>
              <Label>Width (inches)</Label>
              {isEditing ? (
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
              ) : (
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  {ribbon.widthInches}"
                </div>
              )}
            </div>

            <div>
              <Label>Roll Length (yards)</Label>
              {isEditing ? (
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
              ) : (
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {ribbon.rollLengthYards} yards
                </div>
              )}
            </div>

            <div>
              <Label>Wired</Label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.wired}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wired: checked }))}
                  />
                  <Label>{formData.wired ? "Yes" : "No"}</Label>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant={ribbon.wired ? "default" : "secondary"}>
                    {ribbon.wired ? "Wired" : "Not Wired"}
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <Label>Availability</Label>
              {isEditing ? (
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
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant={ribbon.availability === "In stock" ? "default" : "destructive"}>
                    {ribbon.availability}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Colors</Label>
            {isEditing ? (
              <div className="space-y-2">
                {formData.colors?.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select 
                      value={color} 
                      onValueChange={(value) => {
                        const newColors = [...(formData.colors || [])];
                        newColors[index] = value;
                        setFormData(prev => ({ ...prev, colors: newColors }));
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ColorOptions.map(colorOption => (
                          <SelectItem key={colorOption} value={colorOption}>{colorOption}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newColors = formData.colors?.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, colors: newColors }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newColors = [...(formData.colors || []), "Black"];
                    setFormData(prev => ({ ...prev, colors: newColors }));
                  }}
                >
                  Add Color
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-md">
                <div className="flex flex-wrap gap-1">
                  {ribbon.colors?.map((color, index) => (
                    <Badge key={index} variant="outline">{color}</Badge>
                  )) || <span className="text-muted-foreground">No colors specified</span>}
                </div>
              </div>
            )}
          </div>

          {/* Theme */}
          {ribbon.theme && (
            <div>
              <Label>Theme</Label>
              {isEditing ? (
                <Select value={formData.theme} onValueChange={(value) => setFormData(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ThemeOptions.map(theme => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  <Badge variant="secondary">{ribbon.theme}</Badge>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Inventory & Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Cost per Yard</Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costPerYard || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, costPerYard: parseFloat(e.target.value) || undefined }))}
                  placeholder="0.00"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  ${ribbon.costPerYard?.toFixed(2) || "Not set"}
                </div>
              )}
            </div>

            <div>
              <Label>Brand</Label>
              {isEditing ? (
                <Input
                  value={formData.brand || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Brand name"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md">
                  {ribbon.brand || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <Label>Supplier</Label>
              {isEditing ? (
                <Input
                  value={formData.supplier || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Supplier name"
                />
              ) : (
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {ribbon.supplier || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <Label>Last Ordered</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={formData.lastOrdered || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastOrdered: e.target.value }))}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {ribbon.lastOrdered ? new Date(ribbon.lastOrdered).toLocaleDateString() : "Not specified"}
                </div>
              )}
            </div>
          </div>

          {/* Stock Levels */}
          <Separator />
          <div>
            <Label className="text-base font-medium">Stock Levels</Label>
            <div className="grid gap-4 md:grid-cols-3 mt-2">
              <div>
                <Label className="text-sm">Current Stock</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.inStock || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: parseInt(e.target.value) || undefined }))}
                    placeholder="0"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {ribbon.inStock || 0} yards
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm">Minimum Stock</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.minStock || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, minStock: parseInt(e.target.value) || undefined }))}
                    placeholder="0"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {ribbon.minStock || 0} yards
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm">Maximum Stock</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={formData.maxStock || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxStock: parseInt(e.target.value) || undefined }))}
                    placeholder="0"
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md">
                    {ribbon.maxStock || 0} yards
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status */}
            {stockStatus && (
              <div className="mt-4 p-3 rounded-md border">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stockStatus.color}`} />
                  <span className="font-medium">{stockStatus.text}</span>
                  {ribbon.inStock && ribbon.maxStock && (
                    <span className="text-sm text-muted-foreground">
                      ({Math.round((ribbon.inStock / ribbon.maxStock) * 100)}% of max)
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Button */}
      {!isEditing && (
        <Card className="border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-destructive">Delete Ribbon</h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete the ribbon from inventory.
                </p>
              </div>
              <Button variant="destructive" onClick={handleDelete} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 