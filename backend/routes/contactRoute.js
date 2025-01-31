import express from "express";
import nodemailer from "nodemailer";

const contactRouter = express.Router();

contactRouter.post("/send-email", async (req, res) => {
	try {
		const { name, email, phone, comment } = req.body;

		
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.EMAIL_USER, 
				pass: process.env.EMAIL_PASS, 
			},
		});

		// Email content
		const mailOptions = {
			from: email,
			to: process.env.EMAIL_USER, 
			subject: `New Contact Form Submission from ${name}`,
			text: `
				Name: ${name}
				Email: ${email}
				Phone: ${phone || "Not provided"}

				Message:
				${comment}
			`,
		};

		await transporter.sendMail(mailOptions);

		res.json({ success: true, message: "Email sent successfully!" });
	} catch (error) {
		console.error("Error sending email:", error);
		res.json({ success: false, message: "Failed to send email" });
	}
});

export default contactRouter;
