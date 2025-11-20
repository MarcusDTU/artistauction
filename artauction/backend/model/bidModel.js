import {supabase} from "../dbConfig.js";

export const getAllBids = async () => {
    const {data, error} = await supabase
        .from('Bid')
        .select('*')
    return {data, error};
}

export const getBidPrice = async (bidId) => {
    const {data, error} = await supabase
        .from('Bid')
        .select('bid_amount')
        .eq('bid_id', bidId)
        .single();
    return {data, error};
}
