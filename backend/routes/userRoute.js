import express from 'express'


import { loginUser, registerUser, adminLogin, saveDeliveryInfo, getDeliveryInfo  } from '../controllers/userController.js'
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post("/delivery",authUser, saveDeliveryInfo); 
userRouter.post("/saved",authUser, getDeliveryInfo);


export default userRouter;
