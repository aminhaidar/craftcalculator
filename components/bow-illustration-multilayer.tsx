"use client"

import React from "react"
import { motion } from "framer-motion"

interface LayerData {
  ribbonColor: string
  ribbonWidth: number // inches → convert to px
  loops: number
  tailLength: number
  ribbonName?: string
}

interface BowIllustrationProps {
  layers: LayerData[]
  size?: "small" | "medium" | "large"
  animated?: boolean
  className?: string
}

export default function BowIllustrationMultiLayer({ 
  layers, 
  size = "medium", 
  animated = true,
  className = ""
}: BowIllustrationProps) {
  const sizeMap = {
    small: { width: 200, height: 120, viewBox: "0 0 200 200" },
    medium: { width: 300, height: 180, viewBox: "0 0 300 300" },
    large: { width: 400, height: 240, viewBox: "0 0 400 400" }
  }
  
  const { width, height, viewBox } = sizeMap[size]
  const centerX = width / 2
  const centerY = height / 2

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg 
        viewBox={viewBox} 
        width={width} 
        height={height}
        className="drop-shadow-lg"
      >
        {layers.map((layer, index) => {
          const { ribbonColor, ribbonWidth, loops, tailLength } = layer
          const scaledWidth = ribbonWidth * (size === "small" ? 2 : size === "medium" ? 3 : 4)
          const scaledTail = tailLength * (size === "small" ? 1.5 : size === "medium" ? 2 : 3)
          const offset = index * (size === "small" ? 2 : size === "medium" ? 3 : 4)
          const opacity = 1 - (index * 0.1)
          
          // Scale the bow size based on the size prop
          const scale = size === "small" ? 0.6 : size === "medium" ? 1 : 1.4
          const bowWidth = 80 * scale
          const bowHeight = 60 * scale
          
          const LayerContent = () => (
            <g transform={`translate(0, ${offset})`}>
              {/* Left Bow Loop */}
              <path
                d={`M ${centerX - bowWidth/2},${centerY} Q ${centerX - bowWidth/2 - 20},${centerY - bowHeight/2} ${centerX - bowWidth/2},${centerY - bowHeight/2} Q ${centerX - bowWidth/2 + 20},${centerY - bowHeight/2 - 20} ${centerX},${centerY - bowHeight/2} Q ${centerX + 20},${centerY - bowHeight/2 - 20} ${centerX + bowWidth/2},${centerY - bowHeight/2} Q ${centerX + bowWidth/2 + 20},${centerY - bowHeight/2} ${centerX + bowWidth/2},${centerY} Q ${centerX + bowWidth/2 + 20},${centerY + bowHeight/2} ${centerX + bowWidth/2},${centerY + bowHeight/2} Q ${centerX + 20},${centerY + bowHeight/2 + 20} ${centerX},${centerY + bowHeight/2} Q ${centerX - 20},${centerY + bowHeight/2 + 20} ${centerX - bowWidth/2},${centerY + bowHeight/2} Q ${centerX - bowWidth/2 - 20},${centerY + bowHeight/2} ${centerX - bowWidth/2},${centerY} Z`}
                fill={ribbonColor}
                opacity={opacity}
                stroke={ribbonColor}
                strokeWidth="1"
                className="drop-shadow-sm"
              />
              
              {/* Right Bow Loop */}
              <path
                d={`M ${centerX + bowWidth/2},${centerY} Q ${centerX + bowWidth/2 + 20},${centerY - bowHeight/2} ${centerX + bowWidth/2},${centerY - bowHeight/2} Q ${centerX + bowWidth/2 - 20},${centerY - bowHeight/2 - 20} ${centerX},${centerY - bowHeight/2} Q ${centerX - 20},${centerY - bowHeight/2 - 20} ${centerX - bowWidth/2},${centerY - bowHeight/2} Q ${centerX - bowWidth/2 - 20},${centerY - bowHeight/2} ${centerX - bowWidth/2},${centerY} Q ${centerX - bowWidth/2 - 20},${centerY + bowHeight/2} ${centerX - bowWidth/2},${centerY + bowHeight/2} Q ${centerX - 20},${centerY + bowHeight/2 + 20} ${centerX},${centerY + bowHeight/2} Q ${centerX + 20},${centerY + bowHeight/2 + 20} ${centerX + bowWidth/2},${centerY + bowHeight/2} Q ${centerX + bowWidth/2 + 20},${centerY + bowHeight/2} ${centerX + bowWidth/2},${centerY} Z`}
                fill={ribbonColor}
                opacity={opacity}
                stroke={ribbonColor}
                strokeWidth="1"
                className="drop-shadow-sm"
              />

              {/* Center Knot */}
              <circle
                cx={centerX}
                cy={centerY}
                r={scaledWidth * 1.2}
                fill={ribbonColor}
                opacity={opacity + 0.1}
                stroke={ribbonColor}
                strokeWidth="2"
                className="drop-shadow-md"
              />

              {/* Left Tail */}
              <path
                d={`M ${centerX - 10},${centerY} L ${centerX - 30},${centerY + scaledTail} L ${centerX - 10},${centerY + scaledTail} Z`}
                fill={ribbonColor}
                opacity={opacity}
                className="drop-shadow-sm"
              />
              
              {/* Right Tail */}
              <path
                d={`M ${centerX + 10},${centerY} L ${centerX + 30},${centerY + scaledTail} L ${centerX + 10},${centerY + scaledTail} Z`}
                fill={ribbonColor}
                opacity={opacity}
                className="drop-shadow-sm"
              />
              
              {/* Left Streamer */}
              <path
                d={`M ${centerX - 30},${centerY + scaledTail} Q ${centerX - 50},${centerY + scaledTail + 5} ${centerX - 60},${centerY + scaledTail + 15}`}
                stroke={ribbonColor}
                strokeWidth="2"
                fill="none"
                opacity={opacity * 0.7}
              />
              
              {/* Right Streamer */}
              <path
                d={`M ${centerX + 30},${centerY + scaledTail} Q ${centerX + 50},${centerY + scaledTail + 5} ${centerX + 60},${centerY + scaledTail + 15}`}
                stroke={ribbonColor}
                strokeWidth="2"
                fill="none"
                opacity={opacity * 0.7}
              />
            </g>
          )

          if (animated) {
            return (
              <motion.g key={index}>
                <motion.g
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <LayerContent />
                </motion.g>
              </motion.g>
            )
          }

          return <LayerContent key={index} />
        })}
      </svg>
    </div>
  )
} 