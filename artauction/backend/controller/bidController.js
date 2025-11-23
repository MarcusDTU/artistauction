import {getAllBids, getBidPrice, createBid} from "../model/bidModel.js";

export const fetchAllBids = async (req, res) => {
    try {
        const {data, error} = await getAllBids();
        if (error){
            return res.status(500).json({error: error.message});
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

export const fetchBidPrice = async (req, res) => {
    const {bidId} = req.params;
    try {
        const {data, error} = await getBidPrice(bidId);
        if (error){
            return res.status(500).json({error: error.message});
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}

export const createNewBid = async (req, res) => {
    const bid = req.body;
    try {
        const {data, error} = await createBid(bid);
        if (error){
            return res.status(500).json({error: error.message});
        }
        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}