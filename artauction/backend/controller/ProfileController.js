import {getAllProfiles, getProfileById } from '../model/ProfileModel.js';

export const fetchAllProfiles = async (req, res) => {
    try {
        const { data, error } = await getAllProfiles();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const fetchProfileById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await getProfileById(id);
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
