import express from "express";
import { register, login, resetPassword, forgotPassword } from "../controller/AuthController.js";

const router = express.Router();

// Input validation middleware
const validateSignup = (req, res, next) => {
    const { email, password, full_name, role } = req.body;
    const errors = [];
    
    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    if (!full_name || full_name.trim().length < 2) {
        errors.push('Full name must be at least 2 characters long');
    }
    if (role && !['buyer', 'artist'].includes(role)) {
        errors.push('Role must be either "buyer" or "artist"');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join('. ') });
    }
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
    
    if (!email || !email.includes('@')) {
        errors.push('Valid email is required');
    }
    if (!password) {
        errors.push('Password is required');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({ error: errors.join('. ') });
    }
    next();
};

router.post('/signup', validateSignup, register);
router.post('/login', validateLogin, login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
