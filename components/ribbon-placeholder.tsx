import { ImageIcon } from "lucide-react"

interface RibbonPlaceholderProps {
  ribbonType?: string
  colors?: string[]
  className?: string
}

export function RibbonPlaceholder({ ribbonType, colors, className = "" }: RibbonPlaceholderProps) {
  const primaryColor = colors?.[0]?.toLowerCase() || "gray"
  
  // Map color names to CSS color values for the gradient
  const colorMap: { [key: string]: string } = {
    'pink': '#ff69b4',
    'red': '#ff4444',
    'blue': '#4444ff',
    'green': '#44ff44',
    'purple': '#8844ff',
    'gold': '#ffd700',
    'silver': '#c0c0c0',
    'white': '#ffffff',
    'black': '#000000',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'brown': '#8b4513',
    'gray': '#808080',
    'grey': '#808080'
  }
  
  const ribbonColor = colorMap[primaryColor] || '#cccccc'
  
  return (
    <div className={`flex items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 ${className}`}>
      <div className="text-center p-4">
        <div 
          className="w-16 h-16 rounded-full mx-auto mb-3 border-4 border-gray-200"
          style={{ backgroundColor: ribbonColor }}
        />
        <ImageIcon className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground font-medium">
          {ribbonType || "Ribbon"}
        </p>
        <p className="text-xs text-muted-foreground">
          {colors?.join(", ") || "No image"}
        </p>
      </div>
    </div>
  )
} 