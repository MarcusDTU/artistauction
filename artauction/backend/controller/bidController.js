import {getAllBids, getBidPrice, createBid, getLatestBidByAuctionId} from "../model/bidModel.js";

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

export const fetchLatestBidByAuctionId = async (req, res) => {
    const {auctionId} = req.params;
    if (!auctionId) {
        return res.status(400).json({error: 'auctionId parameter is required'});
    }
    try {
        const {data, error} = await getLatestBidByAuctionId(auctionId);
        if (error){
            return res.status(500).json({error: error.message});
        }
        return res.json(data);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}