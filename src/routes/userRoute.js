import { Router } from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, updateBalance } from "../controllers/usercontroller.js";
import { getEventsByDate } from "../controllers/eventControllers.js";
import { googleAuth } from "../controllers/googleAuthController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordResetController.js";
import validateDate from "../middlewares/valDateMiddleware.js";
import protect from "../middlewares/authMiddleware.js";

const router = Router();

// Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/auth/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// User Profile Routes (protected)
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/balance', protect, updateBalance);

// Event Timeline Routes (Under construction)
router.get('/events', validateDate, getEventsByDate);

export default router;