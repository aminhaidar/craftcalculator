interface BowIconProps {
  size?: number
  className?: string
}

export function BowIcon({ size = 32, className = "" }: BowIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left loop */}
      <path
        d="M8 12C8 10.5 9 9 10.5 9C12 9 13 10.5 13 12C13 13.5 12 15 10.5 15C9 15 8 13.5 8 12Z"
        fill="currentColor"
        opacity="0.6"
      />
      
      {/* Right loop */}
      <path
        d="M11 12C11 10.5 12 9 13.5 9C15 9 16 10.5 16 12C16 13.5 15 15 13.5 15C12 15 11 13.5 11 12Z"
        fill="currentColor"
        opacity="0.6"
      />
      
      {/* Center knot */}
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
        opacity="0.8"
      />
      
      {/* Left tail */}
      <path
        d="M10.5 12L9 16L10.5 16L12 12Z"
        fill="currentColor"
        opacity="0.5"
      />
      
      {/* Right tail */}
      <path
        d="M13.5 12L15 16L13.5 16L12 12Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  )
} 