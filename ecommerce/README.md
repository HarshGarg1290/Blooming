Blooming E-commerce Website
Welcome to Blooming, a cutting-edge e-commerce platform built with modern technologies. The application is designed to provide a seamless shopping experience for users and a feature-rich admin panel for managing products, orders, and customers.

Technologies Used
Frontend:

React: A powerful JavaScript library for building dynamic user interfaces.
Vite: A next-generation, fast build tool that improves development speed.
Tailwind CSS: A utility-first CSS framework for creating modern, responsive designs with ease.
Backend:

Node.js: A JavaScript runtime for building fast and scalable server-side applications.
Express.js: A minimalist web framework for Node.js, used to handle HTTP requests and manage routing.
Database:

MongoDB: A NoSQL database used for storing user data, product information, and orders.
Cloud Storage:

Cloudinary: A cloud-based image management service used for storing and transforming product images into URLs.
Features
User Features:
Browse products in various categories.
Add products to the cart and proceed to checkout.
User authentication (login/signup).
Track and manage orders.
Admin Panel Features:
Manage product listings (add, update, delete).
View and process customer orders.
Upload and manage images (via Cloudinary).
User management.
Setup Instructions
Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14.x or later)
npm (v6.x or later) or yarn
MongoDB running locally or a cloud-based MongoDB instance
Cloudinary account (for image hosting)
Install Dependencies
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/Blooming.git
cd Blooming
Install frontend dependencies:

Navigate to the ecommerce folder:

bash
Copy
Edit
cd ecommerce
npm install
or if you're using Yarn:

bash
Copy
Edit
yarn install
Install backend dependencies:

Navigate to the backend folder:

bash
Copy
Edit
cd ../backend
npm install
Install admin panel dependencies:

Navigate to the admin folder:

bash
Copy
Edit
cd ../admin
npm install
Set Up Environment Variables
Create a .env file in both the backend and admin directories and add the following:

For backend (backend/.env):

plaintext
Copy
Edit
MONGODB_URI=your_mongo_connection_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
For frontend (ecommerce/.env):

plaintext
Copy
Edit
REACT_APP_API_URL=http://localhost:5000
Replace your_* with the appropriate credentials from your MongoDB and Cloudinary accounts.

Running the Application
Start the backend:

Navigate to the backend folder and run:

bash
Copy
Edit
npm run dev
This will start the Express server on http://localhost:5000.

Start the frontend:

Navigate to the ecommerce folder and run:

bash
Copy
Edit
npm run dev
The React app will run on http://localhost:3000.

Start the admin panel:

Navigate to the admin folder and run:

bash
Copy
Edit
npm run dev
The admin panel will run on http://localhost:4000.