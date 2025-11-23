// routes/bidRoutes.js
import express from 'express';
import { fetchAllBids, fetchBidPrice, createNewBid, fetchLatestBidByAuctionId } from '../controller/bidController.js';

const router = express.Router();

router.get('/', fetchAllBids);
router.get('/:bidId', fetchBidPrice);
router.post('/', createNewBid);
router.get('/latest/auction/:auctionId', fetchLatestBidByAuctionId);

export default router;
