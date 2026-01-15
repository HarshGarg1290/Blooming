import { useState, useCallback } from "react";

const OptimizedImage = ({ 
    src, 
    alt, 
    className = "", 
    isCritical = false, 
    onError,
    style = {},
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
    }, []);

    const handleError = useCallback((e) => {
        setHasError(true);
        if (onError) {
            onError(e);
        } else {
            e.target.src = "/placeholder.svg";
            e.target.alt = "Image not available";
        }
    }, [onError]);

    // Generate srcSet for responsive images if using Cloudinary
    const generateSrcSet = (url) => {
        if (!url || !url.includes('cloudinary')) return undefined;
        
        const baseUrl = url.split('/upload/')[0] + '/upload/';
        const imagePath = url.split('/upload/')[1];
        
        return `
            ${baseUrl}w_300,q_auto,f_auto/${imagePath} 300w,
            ${baseUrl}w_600,q_auto,f_auto/${imagePath} 600w,
            ${baseUrl}w_900,q_auto,f_auto/${imagePath} 900w
        `;
    };

    return (
        <div className={`relative ${className}`}>
            {/* Loading placeholder with shimmer effect */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                </div>
            )}
            
            <img
                src={src}
                alt={alt}
                className={`w-full transition-opacity duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                } ${className}`}
                style={style}
                loading={isCritical ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={isCritical ? "high" : "auto"}
                srcSet={generateSrcSet(src)}
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 600px, 900px"
                onLoad={handleLoad}
                onError={handleError}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
