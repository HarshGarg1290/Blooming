import { useState, useEffect, useCallback } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const Hero = () => {
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides = [
		{
			id: 0,
			src: assets.hero_img,
			alt: "Hero Image 1",
			title: "Summer Collection",
			description: "Unveil Elegance Embrace Comfort",
		},
		{
			id: 1,
			src: assets.hero_img_2,
			alt: "Hero Image 2",
			title: "New Arrivals",
			description: "Discover Your Unique Style",
		},
	];

	const nextSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	}, [slides.length]);

	const prevSlide = useCallback(() => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	}, [slides.length]);

	useEffect(() => {
		const interval = setInterval(nextSlide, 7000);
		return () => clearInterval(interval);
	}, [nextSlide]);

	return (
		<div className="relative flex flex-col sm:flex-row min-h-[600px] overflow-hidden">
			{/* Left Content Section */}
			<div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6 relative z-30">
				<div className="text-[#414141] space-y-6 max-w-md">
					<div className="flex items-center gap-3">
						<div className="w-10 h-[2px] bg-[#414141]"></div>
						<p className="font-mono font-medium text-md uppercase tracking-wider">
							{slides[currentSlide].title}
						</p>
					</div>

					<h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl leading-tight">
						{slides[currentSlide].description}
					</h1>

					<div className="flex items-center gap-6">
						<Link to="/collection" className="group">
							<button className="flex items-center gap-3 py-3 px-6 bg-[#E5D9F2] font-hubot font-medium text-gray-700 text-lg rounded-full hover:bg-opacity-80 transition-all duration-300 transform hover:scale-105">
								Shop Now
								<ArrowRight
									className="transition-transform group-hover:translate-x-1"
									size={20}
								/>
							</button>
						</Link>
					</div>
				</div>
			</div>

			{/* Image Section */}
			<div className="relative w-full sm:w-3/5 h-[500px] md:h-[600px] overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#E6E6FA]/50 to-[#414141]/10">
				{/* Enhanced Visual Elements */}
				<div className="absolute inset-0 bg-gradient-to-r from-[#e9e7fc]/50 via-transparent to-[#e9e7fc]/50 z-10"></div>
				<div className="absolute inset-0 grid grid-cols-3 gap-2 opacity-10">
					<div className="bg-purple-500 rounded-lg"></div>
					<div className="bg-purple-300 rounded-lg"></div>
					<div className="bg-purple-500 rounded-lg"></div>
					<div className="bg-purple-300 rounded-lg"></div>
					<div className="bg-purple-500 rounded-lg"></div>
					<div className="bg-purple-300 rounded-lg"></div>
					<div className="bg-purple-500 rounded-lg"></div>
					<div className="bg-purple-300 rounded-lg"></div>
					<div className="bg-purple-500 rounded-lg"></div>
				</div>

				{slides.map((slide, index) => (
					<div
						key={slide.id}
						className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
							currentSlide === index
								? "opacity-100 scale-100 z-20"
								: "opacity-0 scale-95 z-10"
						}`}
					>
						<img
							className="absolute w-full h-full object-cover object-center z-0 transform scale-110 transition-transform duration-1000"
							src={slide.src}
							alt={slide.alt}
						/>
					</div>
				))}

				{/* Navigation Buttons */}
				<div className="absolute inset-0 z-30">
					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-[#d4d4f8] transition-all"
					>
						<ChevronLeft className="text-gray-700" size={24} />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-[#d4d4f8] transition-all"
					>
						<ChevronRight className="text-gray-700" size={24} />
					</button>
				</div>

				{/* Slide Indicators */}
				<div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`w-2 h-2 rounded-full transition-all duration-300 ${
								currentSlide === index
									? "bg-[#E6E6FA] w-6"
									: "bg-gray-300 hover:bg-[#E6E6FA]/50"
							}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Hero;
