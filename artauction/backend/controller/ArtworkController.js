import { getAllArtworks, getAllArtworksByArtistNumber, getArtworkById, createArtwork, updateArtwork } from "../model/ArtworkModel.js";

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

const getKeyRole = (key) => {
    try {
        if (!key) return 'missing';
        const payload = key.split('.')[1];
        if (!payload) return 'malformed';
        const decoded = Buffer.from(payload, 'base64').toString();
        return JSON.parse(decoded).role;
    } catch (e) {
        return 'error_decoding';
    }
};

export const updateExistingArtwork = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const keyRole = getKeyRole(process.env.SUPABASE_SERVICE_ROLE_KEY);

    console.log(`[UpdateArtwork] ID: ${id}, Updates:`, updates);
    console.log(`[UpdateArtwork] Key Role: ${keyRole}`);

    try {
        const { data, error } = await updateArtwork(id, updates);
        if (error) {
            console.error('[UpdateArtwork] Supabase Error:', error);
            return res.status(500).json({
                error: error.message,
                details: error,
                debug_key_role: keyRole
            });
        }
        return res.json(data);
    } catch (err) {
        console.error('[UpdateArtwork] Exception:', err);
        return res.status(500).json({ error: err.message, stack: err.stack, debug_key_role: keyRole });
    }
}