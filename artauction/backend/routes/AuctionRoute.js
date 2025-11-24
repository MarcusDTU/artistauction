import express from "express";
import { fetchAllAuctions, fetchAuctionById, fetchAuctionsByArtworkId, createNewAuction, updateExistingAuction, deleteAuctionById } from "../controller/AuctionController.js";

const router = express.Router();

// Route to get all auctions
router.get('/', fetchAllAuctions);

// Route to get an auction by ID
router.get('/:id', fetchAuctionById);

// Route to get auctions by artwork ID
router.get('/artwork/:artworkId', fetchAuctionsByArtworkId);

// Route to create a new auction
router.post('/', createNewAuction);

// Route to update an existing auction
router.patch('/:id', updateExistingAuction);
router.put('/:id', updateExistingAuction);

// Route to delete an auction by ID
router.delete('/:id', deleteAuctionById);

export default router;