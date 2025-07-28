import * as React from 'react';
import { useState, useEffect } from 'react';
import { useIsMobile, useBreakpoint } from './use-responsive';

type ImageSet = {
  mobile: string;
  tablet?: string;
  desktop: string;
};

// Hook to load the appropriate image based on device size
export function useResponsiveImage(images: ImageSet) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const isMobile = !useBreakpoint('sm');
  const isTablet = useBreakpoint('sm') && !useBreakpoint('lg');
  const isDesktop = useBreakpoint('lg');

  useEffect(() => {
    if (isDesktop) {
      setCurrentSrc(images.desktop);
    } else if (isTablet && images.tablet) {
      setCurrentSrc(images.tablet);
    } else {
      setCurrentSrc(images.mobile);
    }
  }, [isMobile, isTablet, isDesktop, images]);

  return currentSrc;
}

// Component for responsive image
export function ResponsiveImage({
  sources,
  alt,
  className,
  ...props
}: {
  sources: ImageSet;
  alt: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const imageSrc = useResponsiveImage(sources);
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      loading="lazy" // Enable lazy loading by default
      {...props}
    />
  );
}

// Create a component that provides all responsive information to children
export function ResponsivePicture({
  sources,
  alt,
  className,
  imgClassName,
}: {
  sources: {
    mobile: string;
    tablet?: string;
    desktop: string;
    mobileFallback?: string;
    tabletFallback?: string;
    desktopFallback?: string;
  };
  alt: string;
  className?: string;
  imgClassName?: string;
} & Omit<React.HTMLAttributes<HTMLPictureElement>, 'src'>) {
  const isMobile = !useBreakpoint('sm');
  const isTablet = useBreakpoint('sm') && !useBreakpoint('lg');
  const isDesktop = useBreakpoint('lg');
  
  // Determine the most appropriate image based on device type
  const getCurrentImage = () => {
    if (isDesktop) {
      return sources.desktop;
    } else if (isTablet && sources.tablet) {
      return sources.tablet;
    } else {
      return sources.mobile;
    }
  };
  
  // Determine fallback image
  const getFallbackImage = () => {
    if (isDesktop && sources.desktopFallback) {
      return sources.desktopFallback;
    } else if (isTablet && sources.tabletFallback) {
      return sources.tabletFallback;
    } else if (sources.mobileFallback) {
      return sources.mobileFallback;
    } else {
      return getCurrentImage();
    }
  };
  
  return (
    <picture className={className}>
      {/* Mobile Source */}
      <source 
        media="(max-width: 639px)" 
        srcSet={sources.mobile} 
      />
      
      {/* Tablet Source (if provided) */}
      {sources.tablet && (
        <source 
          media="(min-width: 640px) and (max-width: 1023px)" 
          srcSet={sources.tablet} 
        />
      )}
      
      {/* Desktop Source */}
      <source 
        media="(min-width: 1024px)" 
        srcSet={sources.desktop} 
      />
      
      {/* Fallback Image */}
      <img 
        src={getFallbackImage()} 
        alt={alt}
        className={imgClassName}
        loading="lazy"
      />
    </picture>
  );
}

// Image with lazy loading for optimization
export function LazyImage({
  src,
  alt,
  className,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
}
