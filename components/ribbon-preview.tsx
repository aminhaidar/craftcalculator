"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Ribbon {
  name: string
  color: string
  loops: { quantity: number; length: number }[]
  tails: { quantity: number; length: number }[]
  streamers: { quantity: number; length: number }[]
}

interface RibbonPreviewProps {
  ribbons: Ribbon[]
}

export function RibbonPreview({ ribbons }: RibbonPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById("canvas-container")
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: 200,
        })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Draw bow
    drawBow(ctx, ribbons)
  }, [ribbons, dimensions])

  const drawBow = (ctx: CanvasRenderingContext2D, ribbons: Ribbon[]) => {
    const centerX = dimensions.width / 2
    const centerY = dimensions.height / 2
    const maxLoopSize = 40

    // Draw center knot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
    ctx.fillStyle = "#ffcc88"
    ctx.fill()
    ctx.strokeStyle = "#cc9966"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw ribbons
    ribbons.forEach((ribbon, ribbonIndex) => {
      const color = ribbon.color

      // Draw loops
      ribbon.loops.forEach((loop, loopIndex) => {
        const quantity = loop.quantity
        const size = Math.min(loop.length * 2, maxLoopSize)

        for (let i = 0; i < quantity; i++) {
          const angle = ((Math.PI * 2) / quantity) * i + ribbonIndex * 0.2
          const offsetX = Math.cos(angle) * 20
          const offsetY = Math.sin(angle) * 20

          // Draw loop
          ctx.beginPath()
          ctx.ellipse(centerX + offsetX, centerY + offsetY, size, size / 2, angle, 0, Math.PI * 2)
          ctx.fillStyle = color + "33" // Semi-transparent
          ctx.fill()
          ctx.strokeStyle = color
          ctx.lineWidth = 3
          ctx.stroke()
        }
      })

      // Draw tails
      ribbon.tails.forEach((tail, tailIndex) => {
        const quantity = tail.quantity
        const length = Math.min(tail.length * 3, dimensions.height / 2)

        for (let i = 0; i < quantity; i++) {
          const angle = (Math.PI / (quantity + 1)) * (i + 1) + Math.PI / 2 + ribbonIndex * 0.1
          const startX = centerX
          const startY = centerY + 10
          const endX = startX + Math.cos(angle) * length
          const endY = startY + Math.sin(angle) * length

          // Draw wavy tail
          ctx.beginPath()
          ctx.moveTo(startX, startY)

          const cp1x = startX + (endX - startX) * 0.3 + Math.cos(angle + Math.PI / 2) * 20
          const cp1y = startY + (endY - startY) * 0.3 + Math.sin(angle + Math.PI / 2) * 20
          const cp2x = startX + (endX - startX) * 0.7 + Math.cos(angle + Math.PI / 2) * -15
          const cp2y = startY + (endY - startY) * 0.7 + Math.sin(angle + Math.PI / 2) * -15

          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY)

          ctx.strokeStyle = color
          ctx.lineWidth = 6
          ctx.stroke()
        }
      })

      // Draw streamers
      ribbon.streamers.forEach((streamer, streamerIndex) => {
        const quantity = streamer.quantity
        const length = Math.min(streamer.length * 2, dimensions.height / 2)

        for (let i = 0; i < quantity; i++) {
          const angle = (Math.PI / (quantity + 1)) * (i + 1) + Math.PI / 2 + ribbonIndex * 0.2 + 0.5
          const startX = centerX
          const startY = centerY + 5
          const endX = startX + Math.cos(angle) * length
          const endY = startY + Math.sin(angle) * length

          // Draw spiral streamer
          ctx.beginPath()
          ctx.moveTo(startX, startY)

          const segments = 10
          for (let j = 1; j <= segments; j++) {
            const t = j / segments
            const x = startX + (endX - startX) * t + Math.cos(t * 10) * 10 * t
            const y = startY + (endY - startY) * t + Math.sin(t * 10) * 10 * t
            ctx.lineTo(x, y)
          }

          ctx.strokeStyle = color
          ctx.lineWidth = 4
          ctx.stroke()
        }
      })
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-medium mb-2">Bow Preview</h3>
            <div id="canvas-container" className="w-full">
              <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="mx-auto" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">This is a simplified visualization of your bow design</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
