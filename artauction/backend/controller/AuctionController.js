import { getAllAuctions, getAuctionById, getAuctionsByArtworkId, createAuction, updateAuction, deleteAuction } from "../model/AuctionModel.js";

export const fetchAllAuctions = async (req, res) => {
    const { data, error } = await getAllAuctions();
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
}

export const fetchAuctionById = async (req, res) => {
    const auctionId = req.params.id;
    const { data, error } = await getAuctionById(auctionId);
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
}

export const fetchAuctionsByArtworkId = async (req, res) => {
    const { artworkId } = req.params;
    if(!artworkId) {
        return res.status(400).json({ error: "Missing path param `artworkId`" });
    }
    const artworkIdInt = parseInt(artworkId, 10);
    if (Number.isNaN(artworkIdInt)) {
        return res.status(400).json({ error: "`artworkId` must be an integer" });
    }
    try {
        const { data, error } = await getAuctionsByArtworkId(artworkIdInt);
        if (error) return res.status(500).json({ error: error.message });
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export const createNewAuction = async (req, res) => {
    const auction = req.body;
    try {
        const { data, error } = await createAuction(auction);
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateExistingAuction = async (req, res) => {
    const auctionId = req.params.id;
    const updates = req.body;
    try {
        const { data, error } = await updateAuction(auctionId, updates);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteAuctionById = async (req, res) => {
    const auctionId = req.params.id;
    try {
        const { data, error } = await deleteAuction(auctionId);
        if (error) return res.status(500).json({ error: error.message });
        res.status(200).json({ message: 'Auction deleted successfully', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
