import p_img1 from "./p_img1.png";
import p_img2_1 from "./p_img2_1.png";
import p_img2_2 from "./p_img2_2.png";
import p_img2_3 from "./p_img2_3.png";
import p_img3 from "./p_img3.png";
import p_img4 from "./p_img4.png";
import p_img5 from "./p_img5.png";
import p_img6 from "./p_img6.png";
import p_img7 from "./p_img7.png";
import p_img8 from "./p_img8.png";
import p_img9 from "./p_img9.png";
import p_img10 from "./p_img10.png";
import p_img11 from "./p_img11.png";
import p_img12 from "./p_img12.png";

import logo from "./logo2.png";
import logo2 from "./logo.png";
import hero_img from "./hero-removebg.png";
import hero_img_2 from "./hero2.png";
import cart_icon from "./cart_icon.png";
import bin_icon from "./bin_icon.png";
import dropdown_icon from "./dropdown_icon.png";
import exchange_icon from "./exchange_icon2.png";
import profile_icon from "./profile_icon.png";
import quality_icon from "./quality_icon.png";
import search_icon from "./search_icon.png";
import star_dull_icon from "./star_dull_icon.png";
import star_icon from "./star_icon.png";
import support_img from "./support_img2.png";
import menu_icon from "./menu_icon.png";
import about_img from "./about_img.png";
import contact_img from "./contact_img.png";
import razorpay_logo from "./razorpay_logo.png";
import stripe_logo from "./stripe_logo.png";
import cross_icon from "./cross_icon.png";
import custom_alter_icon from "./custom_alter_icon.png";

export const assets = {
	logo,
	logo2,
	hero_img,
	hero_img_2,
	cart_icon,
	dropdown_icon,
	exchange_icon,
	custom_alter_icon,
	profile_icon,
	quality_icon,
	search_icon,
	star_dull_icon,
	star_icon,
	bin_icon,
	support_img,
	menu_icon,
	about_img,
	contact_img,
	razorpay_logo,
	stripe_logo,
	cross_icon,
};

export const products = [
	{
		_id: "aaaaa",
		name: "Women Round Neck Cotton Top",
		description:
			"A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
		features: [
			"Made with 100% cotton for all-day comfort",
			"Breathable fabric to keep you cool",
			"Relaxed fit for a casual look",
		],
		washCare: [
			"Machine wash cold with like colors",
			"Do not bleach",
			"Tumble dry low",
			"Warm iron if needed",
		],
		shippingExchangePolicy: [
			"Free shipping for orders above $50",
			"Easy 30-day returns and exchanges",
			"Items must be returned unused and with original tags",
		],
		price: 100,
		image: [p_img1],
		sizes: ["S", "M", "L"],
		date: 1716634345448,
		bestseller: true,
	},
	{
		_id: "aaaab",
		name: "Men Round Neck Pure Cotton T-shirt",
		description:
			"A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
		features: [
			"Premium 100% cotton for a soft feel",
			"Durable stitching for long-term wear",
			"Available in multiple colors",
		],
		washCare: [
			"Wash inside out in cold water",
			"Do not iron on print",
			"Tumble dry low",
		],
		shippingExchangePolicy: [
			"Free shipping for orders above $50",
			"30-day hassle-free returns",
			"Exchange available for size and fit issues",
		],
		price: 200,
		image: [p_img2_1, p_img2_2, p_img2_3],
		sizes: ["M", "L", "XL"],
		date: 1716621345448,
		bestseller: true,
	},
	{
		_id: "aaaac",
		name: "Girls Round Neck Cotton Top",
		description:
			"A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
		features: [
			"Soft cotton fabric for delicate skin",
			"Bright, vibrant colors for everyday wear",
			"Stretchable material for maximum comfort",
		],
		washCare: [
			"Machine wash gentle cycle",
			"Do not bleach",
			"Line dry in shade",
		],
		shippingExchangePolicy: [
			"Free shipping for orders above $50",
			"Return within 15 days of purchase",
			"Original packaging required for returns",
		],
		price: 220,
		image: [p_img3],
		sizes: ["S", "L", "XL"],
		date: 1716234545448,
		bestseller: true,
	},
	{
		_id: "aaaad",
		name: "Men Round Neck Pure Cotton T-shirt",
		description:
			"A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
		features: [
			"Eco-friendly cotton material",
			"Classic fit for a versatile style",
			"Double-stitched for extra durability",
		],
		washCare: [
			"Hand wash for longevity",
			"Avoid direct sunlight for drying",
			"Iron on low heat",
		],
		shippingExchangePolicy: [
			"Shipping within 5-7 business days",
			"Exchange available for defective items",
			"No returns on discounted items",
		],
		price: 110,
		image: [p_img4],
		sizes: ["S", "M", "XXL"],
		date: 1716621345448,
		bestseller: true,
	},
	{
		_id: "aaaae",
		name: "Women Round Neck Cotton Top",
		description:
			"A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
		features: [
			"Soft-touch cotton blend",
			"Lightweight and breathable",
			"Trendy design for casual outings",
		],
		washCare: [
			"Use mild detergent",
			"Wash in cold water only",
			"Dry flat to avoid shrinking",
		],
		shippingExchangePolicy: [
			"Free shipping on all orders",
			"Easy returns within 10 days",
			"Refund processed within 5-7 days",
		],
		price: 130,
		image: [p_img5],
		sizes: ["M", "L", "XL"],
		date: 1716622345448,
		bestseller: true,
	},
	{
		_id: "aaaaf",
		name: "Girls Round Neck Cotton Top",
		description:
			"A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
		features: [
			"Fun and playful prints",
			"Cotton fabric for breathability",
			"Stretchable fit for ease of movement",
		],
		washCare: [
			"Do not bleach",
			"Gentle machine wash recommended",
			"Dry on a flat surface",
		],
		shippingExchangePolicy: [
			"Free shipping for orders above $50",
			"Exchange available for size issues",
			"Returns accepted within 7 days",
		],
		price: 140,
		image: [p_img6],
		sizes: ["S", "L", "XL"],
		date: 1716623423448,
		bestseller: true,
	},
	{
		_id: "aaaag",
		name: "Boys Casual Cotton T-shirt",
		description:
			"A soft, casual T-shirt for everyday comfort, featuring a lightweight and breathable design.",
		features: [
			"100% organic cotton",
			"Round neck with double stitching",
			"Bright colors that don't fade easily",
		],
		washCare: ["Machine wash cold", "Do not tumble dry", "Cool iron if needed"],
		shippingExchangePolicy: [
			"Free shipping on orders over $30",
			"10-day return policy",
			"Exchange accepted for size issues",
		],
		price: 90,
		image: [p_img7],
		sizes: ["XS", "S", "M"],
		date: 1716724423448,
		bestseller: false,
	},
	{
		_id: "aaaah",
		name: "Women Embroidered Cotton Kurti",
		description:
			"A stylish and comfortable cotton kurti with intricate embroidery, perfect for casual or formal occasions.",
		features: [
			"Hand-embroidered design",
			"Pure cotton for ultimate comfort",
			"Available in multiple color options",
		],
		washCare: [
			"Dry clean recommended",
			"Do not bleach",
			"Iron on reverse side",
		],
		shippingExchangePolicy: [
			"Free shipping on all orders",
			"Returns accepted within 5 days",
			"No exchanges on altered items",
		],
		price: 250,
		image: [p_img8],
		sizes: ["M", "L", "XL", "XXL"],
		date: 1716724545448,
		bestseller: true,
	},
	{
		_id: "aaaai",
		name: "Men Polo Cotton T-shirt",
		description:
			"A classic polo T-shirt made from soft cotton fabric for a semi-formal look.",
		features: [
			"Premium 100% cotton fabric",
			"Collared neck with two-button placket",
			"Durable and wrinkle-resistant",
		],
		washCare: ["Wash with similar colors", "Do not wring", "Tumble dry low"],
		shippingExchangePolicy: [
			"Shipping within 3-5 business days",
			"Exchanges accepted for size issues",
			"Refunds processed in 3-5 days",
		],
		price: 300,
		image: [p_img9],
		sizes: ["M", "L", "XL", "XXL"],
		date: 1716824545448,
		bestseller: true,
	},
	{
		_id: "aaaaj",
		name: "Girls Frill Cotton Dress",
		description:
			"A lightweight and vibrant cotton dress with frill design, perfect for summer outings.",
		features: [
			"Made from breathable cotton",
			"Elegant frill detailing",
			"Elastic waist for added comfort",
		],
		washCare: [
			"Wash at 30°C with mild detergent",
			"Do not bleach",
			"Flat dry for best results",
		],
		shippingExchangePolicy: [
			"Free shipping on orders above $40",
			"Return within 7 days of delivery",
			"No returns for washed items",
		],
		price: 180,
		image: [p_img10],
		sizes: ["S", "M", "L"],
		date: 1716924545448,
		bestseller: true,
	},
	{
		_id: "aaaak",
		name: "Men Denim Shirt",
		description:
			"A rugged yet stylish denim shirt, suitable for casual wear and semi-formal occasions.",
		features: [
			"100% durable denim fabric",
			"Button-down front and cuffs",
			"Chest pockets with button closure",
		],
		washCare: [
			"Machine wash with cold water",
			"Wash separately to prevent color bleed",
			"Do not iron directly on buttons",
		],
		shippingExchangePolicy: [
			"Free shipping for orders over $50",
			"Return within 10 days",
			"No exchanges on discounted items",
		],
		price: 400,
		image: [p_img11],
		sizes: ["M", "L", "XL"],
		date: 1716927345448,
		bestseller: false,
	},
	{
		_id: "aaaal",
		name: "Women Striped Cotton Saree",
		description:
			"Elegant and lightweight striped cotton saree, ideal for summer events.",
		features: [
			"Soft cotton fabric for ultimate comfort",
			"Bold striped pattern",
			"Comes with a matching blouse piece",
		],
		washCare: ["Hand wash only", "Do not bleach", "Dry in shade"],
		shippingExchangePolicy: [
			"Free shipping for orders above $70",
			"7-day return policy",
			"No exchanges for custom-stitched blouses",
		],
		price: 500,
		image: [p_img12],
		sizes: ["Free Size"],
		date: 1717034545448,
		bestseller: true,
	},
];
