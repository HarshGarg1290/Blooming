import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
	try {
		const { token } = req.headers;
		if (!token) {
			return res.json({ success: false, message: "User not authorized" });
		}

		const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

		if (tokenDecode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
			return res.json({ success: false, message: "User not authorized" });
		}

		next();
    } catch (error) {
        
        console.log(error);
        res.json({ success: false, message: error.message });
        
    }
};


export default adminAuth;