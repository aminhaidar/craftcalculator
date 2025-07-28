"use client"

import { motion } from "framer-motion"

interface BowColorPaletteProps {
  bow: {
    name: string
    layers: number
    materials: Array<{
      name: string
      quantity: string
      cost: number
    }>
    totalCost: number
    targetPrice: number
    profit: number
    profitMargin: number
  }
  className?: string
}

// Color mapping for different ribbon types
const getRibbonColor = (materialName: string): string => {
  const name = materialName.toLowerCase()
  
  // Satin colors
  if (name.includes('red')) return '#ef4444'
  if (name.includes('blue')) return '#3b82f6'
  if (name.includes('green')) return '#10b981'
  if (name.includes('yellow')) return '#f59e0b'
  if (name.includes('pink')) return '#ec4899'
  if (name.includes('purple')) return '#8b5cf6'
  if (name.includes('orange')) return '#f97316'
  if (name.includes('black')) return '#1f2937'
  if (name.includes('white')) return '#f3f4f6'
  if (name.includes('gold')) return '#fbbf24'
  if (name.includes('silver')) return '#9ca3af'
  
  // Material types
  if (name.includes('satin')) return '#ec4899'
  if (name.includes('velvet')) return '#7c3aed'
  if (name.includes('grosgrain')) return '#06b6d4'
  if (name.includes('organza')) return '#f0f9ff'
  if (name.includes('taffeta')) return '#fef3c7'
  if (name.includes('chiffon')) return '#fce7f3'
  if (name.includes('silk')) return '#fef2f2'
  if (name.includes('metallic')) return '#fbbf24'
  if (name.includes('glitter')) return '#f59e0b'
  if (name.includes('lace')) return '#f3f4f6'
  
  // Default colors for variety
  const defaultColors = [
    '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', 
    '#8b5cf6', '#f97316', '#06b6d4', '#84cc16', '#f43f5e'
  ]
  
  // Use hash of material name to get consistent color
  const hash = materialName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return defaultColors[Math.abs(hash) % defaultColors.length]
}

export function BowColorPalette({ bow, className = "" }: BowColorPaletteProps) {
  const colors = bow.materials.map(material => getRibbonColor(material.name))
  const layerCount = Math.max(bow.layers, bow.materials.length, 2)
  const layerColors = colors.length > 0 ? colors : ['#ec4899', '#8b5cf6', '#06b6d4']

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800" />
      </div>
      
      {/* Color Palette */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 w-full px-6"
      >
        {/* Main Color Strip */}
        <div className="relative mb-3">
          <div 
            className="h-6 rounded-lg shadow-lg"
            style={{
              background: `linear-gradient(90deg, ${layerColors.join(', ')})`
            }}
          />
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 rounded-lg opacity-30">
            <div className="w-full h-full bg-gradient-to-r from-white/20 via-transparent to-white/20 rounded-lg" />
          </div>
          
          {/* Bow icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              className="w-8 h-8 bg-white/90 rounded-full shadow-md flex items-center justify-center"
            >
              <span className="text-lg">🎀</span>
            </motion.div>
          </div>
        </div>
        
        {/* Individual Color Swatches */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex justify-center gap-2"
        >
          {layerColors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              className="relative group"
            >
              <div
                className="w-8 h-8 rounded-lg shadow-md border-2 border-white"
                style={{ backgroundColor: color }}
              />
              
              {/* Layer number tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Layer {index + 1}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Layer count badge */}
      <div className="absolute top-2 right-2">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          {layerCount} layers
        </div>
      </div>
      
      {/* Profit margin indicator */}
      <div className="absolute bottom-2 left-2">
        <div className={`rounded-full px-2 py-1 text-xs font-medium text-white shadow-sm ${
          bow.profitMargin >= 50 ? 'bg-green-500' : 
          bow.profitMargin >= 30 ? 'bg-blue-500' : 'bg-orange-500'
        }`}>
          {bow.profitMargin.toFixed(0)}%
        </div>
      </div>
      
      {/* Material tags preview */}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {bow.materials.slice(0, 2).map((material, index) => (
          <div
            key={index}
            className="w-3 h-3 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: getRibbonColor(material.name) }}
          />
        ))}
        {bow.materials.length > 2 && (
          <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 border border-white shadow-sm flex items-center justify-center">
            <span className="text-[6px] font-bold text-gray-600 dark:text-gray-300">+</span>
          </div>
        )}
      </div>
    </div>
  )
} 