import express from "express";
import { register, login, resetPassword, forgotPassword } from "../controller/AuthController.js";

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
