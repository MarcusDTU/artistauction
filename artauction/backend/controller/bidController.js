import {getAllBids} from "../model/bidModel.js";

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