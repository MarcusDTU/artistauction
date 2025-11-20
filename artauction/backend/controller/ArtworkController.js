import {getAllArtworks, getAllArtworksByArtistNumber, getArtworkById, createArtwork, updateArtwork} from "../model/ArtworkModel.js";

export const fetchAllArtworks = async (req, res) => {
    try {
        const { data, error } = await getAllArtworks();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const fetchAllArtworksByArtistNumber = async (req, res) => {
    const { artist_id } = req.params;
    if (!artist_id) {
        return res.status(400).json({ error: "Missing path param `artist_id`" });
    }
    const artistId = parseInt(artist_id, 10);
    if (Number.isNaN(artistId)) {
        return res.status(400).json({ error: "`artist_id` must be an integer" });
    }

    try {
        const { data, error } = await getAllArtworksByArtistNumber(artistId);
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const fetchArtworkById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await getArtworkById(id);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const createNewArtwork = async (req, res) => {
    const artwork = req.body;
    try {
        const { data, error } = await createArtwork(artwork);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const updateExistingArtwork = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await updateArtwork(id, updates);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}