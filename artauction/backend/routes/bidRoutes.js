// routes/bidRoutes.js
import express from 'express';
import { fetchAllBids, fetchBidPrice } from '../controller/bidController.js';

const router = express.Router();

router.get('/', fetchAllBids);
router.get('/:bidId', fetchBidPrice);

export default router;
