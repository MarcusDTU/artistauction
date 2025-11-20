import {getAllBids, getBidPrice} from "../model/bidModel.js";

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