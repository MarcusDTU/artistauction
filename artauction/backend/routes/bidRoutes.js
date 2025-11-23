// routes/bidRoutes.js
import express from 'express';
import { fetchAllBids, fetchBidPrice, createNewBid } from '../controller/bidController.js';

const router = express.Router();

router.get('/', fetchAllBids);
router.get('/:bidId', fetchBidPrice);
router.post('/', createNewBid);


export default router;
