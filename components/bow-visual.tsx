"use client"

import { motion } from "framer-motion"
import { Layers, Palette, Sparkles } from "lucide-react"

interface BowVisualProps {
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

export function BowVisual({ bow, className = "" }: BowVisualProps) {
  const colors = bow.materials.map(material => getRibbonColor(material.name))
  const layerCount = Math.max(bow.layers, bow.materials.length, 2)
  const layerColors = colors.length > 0 ? colors : ['#ec4899', '#8b5cf6', '#06b6d4']

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 dark:from-pink-800 dark:to-purple-800" />
      </div>
      
      {/* Modern Icon + Colors Design */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 flex flex-col items-center space-y-4"
      >
        {/* Main Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
          className="relative"
        >
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-200">
            <Layers className="w-8 h-8 text-gray-600" />
          </div>
          
          {/* Layer count badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-xs font-bold text-white">{layerCount}</span>
          </div>
        </motion.div>
        
        {/* Color Palette */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col items-center space-y-2"
        >
          <div className="flex items-center space-x-1">
            <Palette className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600 font-medium">Colors</span>
          </div>
          
          <div className="flex space-x-2">
            {layerColors.slice(0, 4).map((color, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                className="w-6 h-6 rounded-lg shadow-sm border-2 border-white"
                style={{ backgroundColor: color }}
              />
            ))}
            {layerColors.length > 4 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center shadow-sm border-2 border-white"
              >
                <span className="text-xs font-bold text-gray-500">+</span>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Performance Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex items-center space-x-1"
        >
          <Sparkles className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-600 font-medium">
            {bow.profitMargin >= 50 ? 'Excellent' : 
             bow.profitMargin >= 30 ? 'Good' : 'Fair'}
          </span>
        </motion.div>
      </motion.div>
      
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