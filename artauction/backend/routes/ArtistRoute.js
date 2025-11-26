import express from "express";
import { fetchAllArtists, fetchArtistByNumber, fetchArtistByEmail } from "../controller/ArtistController.js";

const router = express.Router();

// Route to get all artists
router.get('/', fetchAllArtists);

// Route to get an artist by email
router.get('/email/:email', fetchArtistByEmail);

// Route to get an artist by artist number
router.get('/:artist_number', fetchArtistByNumber);

export default router;