import express from 'express'


import { loginUser, registerUser, adminLogin, saveDeliveryInfo, getDeliveryInfo, getUserDetails, forgotPassword, resetPassword } from '../controllers/userController.js'
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/details',authUser, getUserDetails);
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post("/delivery",authUser, saveDeliveryInfo); 
userRouter.post("/saved",authUser, getDeliveryInfo);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);


export default userRouter;
