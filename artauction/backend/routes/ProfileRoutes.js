import express from 'express';
import { fetchAllProfiles, fetchProfileById, fetchAllArtists } from '../controller/ProfileController.js';

const router = express.Router();

// Route to get all profiles
router.get('/', fetchAllProfiles);

// Route to get all artists
router.get('/artists/', fetchAllArtists);

// Route to get a profile by ID
router.get('/:id', fetchProfileById);

export default router;