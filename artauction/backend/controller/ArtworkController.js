import {getAllArtworksbyProfileId, getArtworkById, createArtwork, updateArtwork} from "../model/ArtworkModel.js";

export const fetchAllArtworksbyProfileId = async (req, res) => {
    const { profileId } = req.params;
    try {
        const { data, error } = await getAllArtworksbyProfileId(profileId);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
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