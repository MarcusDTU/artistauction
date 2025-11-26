import { getAllArtists, getArtistByNumber, getArtistByEmail } from "../model/ArtistModel.js";

export const fetchAllArtists = async (req, res) => {
    try {
        const { data, error } = await getAllArtists();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const fetchArtistByNumber = async (req, res) => {
    const { artist_number } = req.params;
    try {
        const { data, error } = await getArtistByNumber(artist_number);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const fetchArtistByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const { data, error } = await getArtistByEmail(email);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}