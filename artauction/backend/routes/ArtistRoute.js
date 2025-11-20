import express from "express";
import { fetchAllArtists, fetchArtistByNumber} from "../controller/ArtistController.js";

const router = express.Router();

// Route to get all artists
router.get('/', fetchAllArtists);

// Route to get an artist by artist number
router.get('/:artist_number', fetchArtistByNumber);

export default router;