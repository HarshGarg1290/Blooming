// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Adjust paths as needed
	theme: {
		extend: {
			
			fontFamily: {
				hubot: ['"Hubot Sans"', "sans-serif"], // Add Hubot Sans font
				lugrasimo: ['"Lugrasimo"', "cursive"], // Add Lugrasimo font
				raleway: ['"Raleway"', "sans-serif"], // Add Raleway font
			},
			scale: {
				200: "1.75",
			},

			spacing: {
				// Custom height values
				128: "32rem", // height: 32rem (512px)
				144: "34rem", // height: 36rem (576px)
				160: "40rem", // height: 40rem (640px)
				192: "48rem", // height: 48rem (768px)
				256: "64rem", // height: 64rem (1024px)
			},
		},
	},
	plugins: [],
};
