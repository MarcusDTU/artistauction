// routes/bidRoutes.js
import express from 'express';
import { fetchAllBids } from '../controller/bidController.js';

const router = express.Router();

router.get('/', fetchAllBids);

export default router;
