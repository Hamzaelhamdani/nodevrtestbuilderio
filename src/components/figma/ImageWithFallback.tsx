import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}

export function ImageWithFallback({
  src,
  alt,
  className,
  width = 400,
  height = 300,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
  }

  return (
    <img
      src={error ? '/placeholder-image.png' : src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={handleError}
      {...props}
    />
  )
}
