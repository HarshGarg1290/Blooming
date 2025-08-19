import { useState, useEffect, useCallback, useMemo } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import "../styles/hero.css"; 

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState("next");
    const [imagesLoaded, setImagesLoaded] = useState({});

    const slides = useMemo(() => [
        {
            id: 0,
            src: assets.hero_img,
            alt: "Luxury Summer Collection",
            subtitle: "Summer Exclusives",
            title: "Summer Breeze",
            description: "Light, fresh designs perfect for warm days and magical summer nights",
            accent: "bg-red-200",
        },
        {
            id: 1,
            src: assets.hero_img_2,
            alt: "Designer Collection",
            subtitle: "New Arrivals",
            title: "Timeless Elegance",
            description: "Simple shapes and beautiful fabrics that make you feel special, every day",
            accent: "bg-indigo-200",
        },
        {
            id: 2,
            src: assets.hero_img_3,
            alt: "Sustainable Fashion",
            subtitle: "Limited Collection",
            title: "Pure Beauty",
            description: "Thoughtfully designed pieces that bring out your natural confidence",
            accent: "bg-teal-200",
        },
    ], []);

    useEffect(() => {
        slides.forEach((slide, index) => {
            const img = new Image();
            img.onload = () => {
                setImagesLoaded((prev) => ({ ...prev, [index]: true }));
            };
            img.onerror = () => {
                console.warn(`Failed to load hero image ${index}`);
                setImagesLoaded((prev) => ({ ...prev, [index]: false }));
            };
            img.src = slide.src;
        });
    }, [slides]);

    const autoSlide = useCallback(() => {
        if (isAnimating) return;
        
        setSlideDirection("next");
        setIsAnimating(true);
        
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 700);
    }, [slides.length, isAnimating]);

    useEffect(() => {
        const interval = setInterval(autoSlide, 5000);
        return () => clearInterval(interval);
    }, [autoSlide]);

    const handlePrevSlide = useCallback(() => {
        if (isAnimating) return;
        
        setSlideDirection("prev");
        setIsAnimating(true);
        
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 500);
    }, [isAnimating, slides.length]);

    const handleNextSlide = useCallback(() => {
        if (isAnimating) return;
        
        setSlideDirection("next");
        setIsAnimating(true);
        
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setTimeout(() => setIsAnimating(false), 500);
        }, 500);
    }, [isAnimating, slides.length]);

    const handleSlideSelect = useCallback((index) => {
        if (!isAnimating && index !== currentSlide) {
            setSlideDirection(index > currentSlide ? "next" : "prev");
            setIsAnimating(true);
            
            setTimeout(() => {
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 500);
            }, 500);
        }
    }, [isAnimating, currentSlide]);

    const currentSlideData = slides[currentSlide];

    return (
        <div className="hero-container relative lg:min-h-screen overflow-hidden bg-gradient-to-br from-white to-gray-50 sm:mt-[120px]">
            
            <div className="relative inset-0 w-full">
                <div
                    className={`hero-decorative absolute sm:block w-[600px] h-[600px] transition-all duration-1000 ease-in-out 
                        ${currentSlideData.accent} left-64 opacity-10 rounded-xl blur-lg
                        ${isAnimating
                            ? slideDirection === "next"
                                ? "animate-roll-left"
                                : "animate-roll-right"
                            : ""
                        }`}
                />
            </div>

            <div className="relative container mx-auto px-4 py-8 flex flex-col lg:flex-row items-center">
                {/* Left Content Section */}
                <div className="w-full sm:relative lg:w-1/2 space-y-6 text-center lg:text-left z-10 lg:pl-[280px]">
                    <div className="space-y-2">
                        <p
                            className={`hidden sm:inline-block px-4 py-1 rounded-full text-sm tracking-wider uppercase bg-[#441752] text-white mb-4 font-sans
                                ${isAnimating ? "animate-fade-out" : "animate-fade-in"}`}
                        >
                            {currentSlideData.subtitle}
                        </p>
                        <h1
                            className={`text-5xl lg:text-8xl font-medium text-[#3d1a6e] font-display 
                                ${isAnimating
                                    ? slideDirection === "next"
                                        ? "animate-slide-out-left"
                                        : "animate-slide-out-right"
                                    : "animate-slide-in"
                                }`}
                        >
                            {currentSlideData.title}
                        </h1>
                        <p
                            className={`px-3 sm:px-0 text-gray-600 text-xl mt-6 max-w-lg mx-auto lg:mx-0 font-light tracking-wide font-sans
                                ${isAnimating ? "animate-fade-out" : "animate-fade-in"}`}
                        >
                            {currentSlideData.description}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link to="/collection">
                            <button className="group flex items-center gap-2 py-4 px-8 bg-purple-900 text-white font-medium tracking-wide rounded-full hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:shadow-xl">
                                Explore Collection
                                <ArrowRight
                                    className="transition-transform duration-500 group-hover:translate-x-1"
                                    size={20}
                                />
                            </button>
                        </Link>

                        <div className="hidden sm:flex items-center gap-4">
                            <button
                                onClick={handlePrevSlide}
                                className="p-3 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 hover:border-gray-900"
                                disabled={isAnimating}
                                aria-label="Previous slide"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={handleNextSlide}
                                className="p-3 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 hover:border-gray-900"
                                disabled={isAnimating}
                                aria-label="Next slide"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    <div className="relative top-[530px] flex justify-center lg:justify-start gap-3 mt-8 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlideSelect(index)}
                                className={`h-2 rounded-full transition-all duration-700 ease-in-out 
                                    ${currentSlide === index
                                        ? "w-12 bg-gray-900"
                                        : "w-2 bg-gray-300 hover:bg-gray-400"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Image Section */}
                <div className="w-full lg:w-1/2 lg:mt-0 relative">
                    <div className="relative mx-auto w-[300px] h-[500px]">
                        {/* Animated Decorative Elements */}
                        <div
                            className={`hero-decorative absolute w-48 h-48 transition-all duration-1000 ease-in-out
                                ${currentSlideData.accent} rounded-lg -top-10 -left-10 opacity-30
                                ${isAnimating
                                    ? slideDirection === "next"
                                        ? "animate-roll-block-left"
                                        : "animate-roll-block-right"
                                    : "hover:translate-y-[-10px]"
                                }`}
                        />
                        <div
                            className={`hero-decorative absolute w-48 h-48 transition-all duration-1000 ease-in-out
                                ${currentSlideData.accent} -bottom-16 -right-10 opacity-30
                                ${isAnimating
                                    ? slideDirection === "next"
                                        ? "animate-roll-block-right"
                                        : "animate-roll-block-left"
                                    : "hover:translate-y-[10px]"
                                }`}
                        />

                        <div className="relative overflow-hidden w-full h-full rounded-2xl shadow-xl">
                            <div
                                className={`absolute inset-0 bg-gradient-to-tr from-${currentSlideData.accent} to-white opacity-5 transition-all duration-1000`}
                            />
                            
                            {/* Loading Placeholder */}
                            {!imagesLoaded[currentSlide] && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>
                            )}
                            
                            {/* Optimized Image */}
                            <img
                                className={`hero-image w-full h-full object-cover object-center transition-all duration-500
                                    ${isAnimating
                                        ? slideDirection === "next"
                                            ? "animate-slide-out-left"
                                            : "animate-slide-out-right"
                                        : "animate-slide-in hover:scale-105"
                                    }
                                    ${!imagesLoaded[currentSlide] ? 'opacity-0' : 'opacity-100'}
                                `}
                                src={currentSlideData.src}
                                alt={currentSlideData.alt}
                                loading={currentSlide === 0 ? "eager" : "lazy"}
                                decoding="async"
                                onLoad={() =>
                                    setImagesLoaded((prev) => ({
                                        ...prev,
                                        [currentSlide]: true,
                                    }))
                                }
                                onError={(e) => {
                                    e.target.src = '/hero-placeholder.jpg';
                                    console.warn('Hero image failed to load:', currentSlideData.src);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
