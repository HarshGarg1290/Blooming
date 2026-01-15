import { useEffect } from 'react';

const useImagePreloader = (imageUrls = []) => {
    useEffect(() => {
        if (!imageUrls.length) return;

        const preloadImages = imageUrls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = url;
            });
        });

        Promise.allSettled(preloadImages)
            .then(results => {
                const successful = results.filter(result => result.status === 'fulfilled').length;
                const failed = results.filter(result => result.status === 'rejected').length;
                
                if (failed > 0) {
                    console.warn(`Failed to preload ${failed} images`);
                }
                
                console.log(`Successfully preloaded ${successful} images`);
            });
    }, [imageUrls]);
};

export default useImagePreloader;
