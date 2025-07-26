interface BowPlaceholderProps {
  name: string
  className?: string
}

export function BowPlaceholder({ name, className = "" }: BowPlaceholderProps) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 ${className}`}>
      <div className="text-center p-6">
        <svg
          viewBox="0 0 200 120"
          className="w-full h-full max-w-32 max-h-20 mx-auto mb-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bow loops */}
          <path
            d="M60 60 Q80 40 100 60 Q120 40 140 60"
            stroke="url(#bowGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M60 60 Q80 80 100 60 Q120 80 140 60"
            stroke="url(#bowGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Center knot */}
          <circle cx="100" cy="60" r="6" fill="url(#bowGradient)" />
          
          {/* Tails */}
          <path
            d="M100 60 L100 90"
            stroke="url(#bowGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M90 90 L110 90"
            stroke="url(#bowGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Streamers */}
          <path
            d="M140 60 Q160 50 170 70"
            stroke="url(#bowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          <path
            d="M60 60 Q40 50 30 70"
            stroke="url(#bowGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="bowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        
        <div className="text-sm font-medium text-muted-foreground truncate">
          {name}
        </div>
        <div className="text-xs text-muted-foreground/70">
          Bow Design
        </div>
      </div>
    </div>
  )
} 