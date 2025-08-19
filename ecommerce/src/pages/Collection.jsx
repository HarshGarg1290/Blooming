import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { transformCloudinary } from "../utils/image";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

// 🚀 OPTIMIZATION: Import AOS dynamically
let AOS;

const Collection = () => {
    const { products, search, showSearch } = useContext(ShopContext);
    const [sortedProducts, setSortedProducts] = useState(products);
    const [sortOption, setSortOption] = useState("default");
    const [gridReady, setGridReady] = useState(false);
    const observerRef = useRef(null);

    // 🚀 OPTIMIZATION: Initialize AOS only once and dynamically
    useEffect(() => {
        const initAOS = async () => {
            if (!AOS) {
                const AOSModule = await import("aos");
                AOS = AOSModule.default;
                await import("aos/dist/aos.css");
                AOS.init({
                    duration: 600,
                    once: true, // 🚀 Animation only happens once
                    offset: 100
                });
            }
        };
        
        if (products.length > 0) {
            initAOS();
        }
    }, [products.length]);

    useEffect(() => {
        let newSortedProducts = [...products];

        switch (sortOption) {
            case "low-high":
                newSortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "high-low":
                newSortedProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        if (showSearch && search) {
            newSortedProducts = newSortedProducts.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setSortedProducts(newSortedProducts);
    }, [products, sortOption, showSearch, search]);

    // Prepare list of primary image URLs to preload for the current grid
    const gridImageUrls = useMemo(() => {
        if (!sortedProducts || sortedProducts.length === 0) return [];
        return sortedProducts
            .map((p) => (Array.isArray(p?.image) ? p.image[0] : null))
            .filter((src) => typeof src === "string" && src.length > 0);
    }, [sortedProducts]);

    // Component-level preload: only the grid waits; title and controls show immediately
    useEffect(() => {
        // Reset readiness when product set changes
        setGridReady(false);

        if (gridImageUrls.length === 0) {
            // No images to load (e.g., empty results) -> don't block UI
            setGridReady(true);
            return;
        }

        let isCancelled = false;
        const preload = (src) =>
            new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = src;
            });

        Promise.all(gridImageUrls.map(preload)).then(() => {
            if (!isCancelled) {
                setGridReady(true);
                // Refresh AOS after content mounts so animations work
                try {
                    AOS?.refreshHard?.();
                } catch {
                    // no-op
                }
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [gridImageUrls]);

    // Prefetch next-row images when near viewport to avoid pop-in during scroll
    useEffect(() => {
        if (!('IntersectionObserver' in window)) return; // Fallback silently
        if (!sortedProducts || sortedProducts.length === 0) return;

        // Disconnect previous observer
        observerRef.current?.disconnect?.();
        observerRef.current = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const src = entry.target.getAttribute('data-preload-src');
                    if (src) {
                        const img = new Image();
                        img.src = src; // Browser caches it; decode may happen earlier
                        entry.target.removeAttribute('data-preload-src');
                    }
                    observerRef.current?.unobserve?.(entry.target);
                }
            }
        }, { rootMargin: '600px 0px 600px 0px' });

        // Attach to invisible sentinels per item (added in render below)
        const nodes = document.querySelectorAll('[data-preload-src]');
        nodes.forEach((n) => observerRef.current.observe(n));

        return () => observerRef.current?.disconnect?.();
    }, [sortedProducts]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <div className="flex flex-col gap-1 sm:gap-10 pt-10 sm:pt-20 border-t mb-[100px] sm:mb-[200px]">
            <div className="flex">
                <div className="w-full flex justify-between items-center gap-4 font-hubot text-xl sm:text-3xl mb-4">
                    <div className="flex items-center gap-2 sm:gap-4 font-semibold">
                        <Title text1="ALL " text2="COLLECTIONS" />
                        <span className="hidden sm:block w-8 sm:w-12 sm:h-[3px] bg-[#000000] mt-[-8px]"></span>
                    </div>
                    <select
                        className="border-2 border-gray-300 text-xs px-2 py-3"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>
            </div>

            <div>
                {!gridReady ? (
                    <div className="min-h-[40vh] flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 gap-y-3">
                        {sortedProducts.map((item, index) => {
                            // Eager load the first two rows to avoid pop-in on typical screens
                            const eager = index < 8; // 2 rows on desktop
                            const delay = eager ? 0 : Math.min(index * 80, 480);
                            const preloadSrc = Array.isArray(item.image) ? transformCloudinary(item.image[0], { width: 640, height: 800 }) : null;
                            return (
                            <div
                                key={item._id}
                                data-aos="zoom-in-up"
                                data-aos-duration="600"
                                data-aos-delay={delay}
                                className="border-2 border-[#3c3b3c] border-opacity-10"
                            >
                                {/* Invisible preload sentinel to trigger prefetch via IO */}
                                {preloadSrc && (
                                    <span className="sr-only" aria-hidden="true" data-preload-src={preloadSrc}></span>
                                )}
                                <ProductItem
                                    id={item._id}
                                    image={item.image}
                                    name={item.name}
                                    price={item.price}
                                    eager={eager}
                                />
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Collection;
