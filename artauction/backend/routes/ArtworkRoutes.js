import express from "express";
import { fetchAllArtworks, fetchAllArtworksByArtistNumber, fetchArtworkById, createNewArtwork, updateExistingArtwork } from "../controller/ArtworkController.js";

const router = express.Router();

// Route to get all artworks
router.get('/', fetchAllArtworks);

// Route to get all artworks by profile ID
router.get('/artist/:artist_id', fetchAllArtworksByArtistNumber);

// Route to get an artwork by ID
router.get('/:id', fetchArtworkById);

// Route to create a new artwork
router.post('/', createNewArtwork);

// Route to update an existing artwork
router.patch('/:id', updateExistingArtwork);
router.put('/:id', updateExistingArtwork);

export default router;