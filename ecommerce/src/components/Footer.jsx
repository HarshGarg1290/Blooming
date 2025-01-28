import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoLocationOutline, IoMailOpenOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import React from "react";
const Footer = () => {
	const socialLinks = [
		{
			icon: <FaWhatsapp />,
			text: "+91 8209263864",
			link: "https://wa.me/918209263864",
		},
		{
			icon: <IoMailOpenOutline />,
			text: "bloomingbymg@gmail.com",
			link: "https://mail.google.com/mail/?view=cm&fs=1&to=blooming@gmail.com",
		},
		{
			icon: <FaInstagram />,
			text: "blooming_by_muskangarg",
			link: "https://www.instagram.com/blooming_by_muskangarg",
		},
	];

	const sections = [
		{
			title: "INFORMATION",
			links: [
				{ text: "About Us", href: "#about" },
				{ text: "Business Enquiry", href: "#business" },
				{ text: "Terms & Conditions", href: "#terms" },
				{ text: "Terms of Service", href: "#tos" },
				{ text: "Privacy Policy", href: "#privacy" },
			],
		},
		{
			title: "CUSTOMER SERVICE",
			links: [
				{ text: "Contact Us", href: "#contact-us" },
				{ text: "Shipping & Delivery Policy", href: "#shipping" },
				{ text: "Return & Exchange Policy", href: "#return" },
				{ text: "Frequently Asked Questions", href: "#faq" },
			],
		},
		{
			title: "MY ACCOUNT",
			links: [
				{ text: "My Account", href: "#account" },
				{ text: "Order History", href: "#orders" },
				{ text: "Wish List", href: "#wishlist" },
			],
		},
	];

	return (
		<motion.footer
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="bg-gradient-to-br from-purple-50 to-purple-100 
				w-full border-t-4 border-[#773397] mt-[100px] 
				shadow-2xl rounded-t-2xl overflow-hidden"
		>
			<div className="w-full grid grid-cols-1 md:grid-cols-4 gap-10 pt-10 px-5 md:px-20">
				{/* Contact Section */}
				<motion.div
					initial={{ x: -50, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="flex flex-col gap-4 bg-white/50 p-6 rounded-xl shadow-md"
				>
					<h4 className="font-raleway tracking-wider font-bold text-lg text-[#773397] border-b-2 border-[#773397] pb-2">
						CONTACT
					</h4>
					{socialLinks.map((item, index) => (
						<motion.p
							key={index}
							whileHover={{ scale: 1.05 }}
							className="flex items-center gap-3 text-gray-700 hover:text-[#773397] transition-all"
						>
							{React.cloneElement(item.icon, { className: "text-xl" })}
							<a
								href={item.link}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								{item.text}
							</a>
						</motion.p>
					))}
					<div className="flex items-start gap-3 text-gray-700">
						<IoLocationOutline className="text-3xl mt-1 ml-[-2px]" />
						<p>Plot no.1, Amer Road,<br/> Near Jal Mahal, Jaipur, Rajasthan 302002</p>
					</div>
				</motion.div>

				{/* Additional Sections */}
				{sections.map((section, sectionIndex) => (
					<motion.div
						key={section.title}
						initial={{ y: 50, opacity: 0 }}
						whileInView={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3 * (sectionIndex + 1), duration: 0.5 }}
						className="flex flex-col gap-4 bg-white/50 p-6 rounded-xl shadow-md"
					>
						<h4 className="font-raleway tracking-wider font-bold text-lg text-[#773397] border-b-2 border-[#773397] pb-2">
							{section.title}
						</h4>
						<ul className="space-y-3">
							{section.links.map((link, index) => (
								<motion.li
									key={index}
									whileHover={{ x: 10 }}
									className="transition-all"
								>
									<a
										href={link.href}
										className="text-sm text-gray-700 hover:text-[#773397] hover:underline"
									>
										{link.text}
									</a>
								</motion.li>
							))}
						</ul>
					</motion.div>
				))}
			</div>

			{/* Copyright Section */}
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="bg-[#773397] text-white"
			>
				<p className="py-3 text-xs text-center w-full">
					Copyright 2024 bloomingbyMuskanGarg - All Rights Reserved
				</p>
			</motion.div>
		</motion.footer>
	);
};

export default Footer;
