import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { IoLocationOutline, IoMailOpenOutline } from "react-icons/io5";

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

	return (
		<footer className="bg-gradient-to-br from-purple-50 to-purple-100 mt-24">
			<div className="max-w-7xl mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
					{/* Brand Section */}
					<div className="space-y-4">
						<h3 className="text-2xl font-semibold text-purple-900">Blooming</h3>
						<p className="text-gray-600 max-w-xs">
							Bringing elegance and beauty to every moment with our curated
							collection of blooms.
						</p>
					</div>

					{/* Contact Section */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-purple-900 border-b-2 border-purple-300 pb-2 mb-4">
							Get in Touch
						</h3>
						<div className="space-y-3">
							{socialLinks.map((item, index) => (
								<a
									key={index}
									href={item.link}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-3 text-gray-600 hover:text-purple-900 transition-colors duration-200 group"
								>
									<span className="text-xl group-hover:scale-110 transition-transform duration-200">
										{item.icon}
									</span>
									<span className="hover:underline">{item.text}</span>
								</a>
							))}
						</div>
					</div>

					{/* Location Section */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold text-purple-900 border-b-2 border-purple-300 pb-2 mb-4">
							Visit Us
						</h3>
						<div className="flex items-start gap-3 text-gray-600">
							<IoLocationOutline className="text-2xl flex-shrink-0 mt-1" />
							<p className="leading-relaxed">
								Plot no.1, Amer Road,
								<br />
								Near Jal Mahal, Jaipur,
								<br />
								Rajasthan 302002
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright Section */}
			<div className="bg-purple-900">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<p className="text-sm text-center text-white/90">
						Copyright © {new Date().getFullYear()} Blooming by Muskan Garg - All
						Rights Reserved
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
