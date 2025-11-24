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

export const createBid = async (bid) => {
    try {
        const response = await supabase
            .from('Bid')
            .insert([bid])
            .select()
            .single();

        console.log('Supabase insert response:', response);

        const {data, error} = response;

        if (error) return {data: null, error};

        if (!data) {
            return {
                data: null,
                error: new Error('Insert succeeded but no row was returned. Check RLS, API key permissions, or table RETURNING settings.')
            };
        }

        return {data, error: null};
    } catch (err) {
        console.error('Unexpected error during insert:', err);
        return {data: null, error: err};
    }
}

export const getLatestBidByAuctionId = async (auctionId) => {
    const {data, error} = await supabase
        .from('Bid')
        .select('*')
        .eq('auction_id', auctionId)
        .order('bid_amount', {ascending: false})
        .limit(1)
        .single();
    return {data, error};
}