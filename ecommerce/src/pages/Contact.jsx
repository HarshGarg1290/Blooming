import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		comment: "",
	});
	const [formErrors, setFormErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	const validateForm = () => {
		const errors = {};
		if (!formData.name.trim()) errors.name = "Name is required";
		if (!formData.email.trim()) {
			errors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Email is invalid";
		}
		if (formData.phone && !/^\+?[0-9]{10,14}$/.test(formData.phone)) {
			errors.phone = "Invalid phone number";
		}
		return errors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (formErrors[name]) {
			setFormErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const errors = validateForm();

		if (Object.keys(errors).length > 0) {
			setFormErrors(errors);
			return;
		}

		// Simulated form submission
		console.log("Form submitted:", formData);
		setIsSubmitted(true);

		// Reset form after 3 seconds
		setTimeout(() => {
			setFormData({
				name: "",
				email: "",
				phone: "",
				comment: "",
			});
			setIsSubmitted(false);
		}, 3000);
	};

	return (
		<div className="font-raleway container mx-auto px-4 py-12 max-w-6xl pt-24">
			<div className="grid md:grid-cols-2 gap-12 bg-white shadow-lg rounded-xl overflow-hidden">
				{/* Contact Form */}
				<div className="p-8 ">
					<h2 className="text-3xl font-bold mb-6 text-gray-800">
						Get In Touch
					</h2>
					{isSubmitted ? (
						<div className="bg-green-100 text-green-700 p-4 rounded-md">
							Thank you! We'll get back to you soon.
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4 font-hubot">
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<input
										type="text"
										name="name"
										placeholder="Your Name"
										value={formData.name}
										onChange={handleChange}
										className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
											formErrors.name
												? "border-red-500"
												: "border-gray-300 focus:ring-purple-300"
										}`}
									/>
									{formErrors.name && (
										<p className="text-red-500 text-sm mt-1">
											{formErrors.name}
										</p>
									)}
								</div>
								<div>
									<input
										type="email"
										name="email"
										placeholder="Your Email"
										value={formData.email}
										onChange={handleChange}
										className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
											formErrors.email
												? "border-red-500"
												: "border-gray-300 focus:ring-purple-300"
										}`}
									/>
									{formErrors.email && (
										<p className="text-red-500 text-sm mt-1">
											{formErrors.email}
										</p>
									)}
								</div>
							</div>
							<div>
								<input
									type="tel"
									name="phone"
									placeholder="Phone Number (Optional)"
									value={formData.phone}
									onChange={handleChange}
									className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
										formErrors.phone
											? "border-red-500"
											: "border-gray-300 focus:ring-purple-300"
									}`}
								/>
								{formErrors.phone && (
									<p className="text-red-500 text-sm mt-1">
										{formErrors.phone}
									</p>
								)}
							</div>
							<div>
								<textarea
									name="comment"
									placeholder="Your Message"
									rows="4"
									value={formData.comment}
									onChange={handleChange}
									className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
								></textarea>
							</div>
							<button
								type="submit"
								className="w-full bg-[#E6E6FA] text-black py-3 rounded-md hover:bg-purple-300 transition duration-300"
							>
								Send Message
							</button>
						</form>
					)}
				</div>

				{/* Contact Information */}
				<div className="bg-[#e8e8fd] p-8 flex flex-col justify-center">
					<h3 className="text-2xl font-bold mb-6 text-gray-800">
						Contact Information
					</h3>
					<div className="space-y-4 font-mono">
						<div className="flex items-center space-x-4">
							<MapPin className="text-purple-600" size={24} />
							<div>
								<p className="font-semibold text-gray-700">Our Address</p>
								<p className="text-gray-600">
									Plot 1, Bohra Ji ka Bagh,
									<br />
									Opp. Jal Mahal, Amer Road,
									<br />
									Jaipur, 302002
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Phone className="text-purple-600" size={24} />
							<div>
								<p className="font-semibold text-gray-700">Phone</p>
								<a
									href="https://wa.me/918209263864"
									target="_blank"
									rel="noopener noreferrer"
									className=" hover:underline"
								>
									+91 8209263864
								</a>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Mail className="text-purple-600" size={24} />
							<div>
								<p className="font-semibold text-gray-700">Email</p>
								<a
									href="https://mail.google.com/mail/?view=cm&fs=1&to=blooming@gmail.com"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
								>
									bloomingbymg@gmail.com
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
