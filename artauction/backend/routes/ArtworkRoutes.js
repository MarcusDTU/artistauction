import express from "express";
import { fetchAllArtworksbyProfileId, fetchArtworkById, createNewArtwork, updateExistingArtwork } from "../controller/ArtworkController.js";

const router = express.Router();

// Route to get all artworks by profile ID
router.get('/profile/:profileId', fetchAllArtworksbyProfileId);

// Route to get an artwork by ID
router.get('/:id', fetchArtworkById);

// Route to create a new artwork
router.post('/', createNewArtwork);

// Route to update an existing artwork
router.put('/:id', updateExistingArtwork);

export default router;