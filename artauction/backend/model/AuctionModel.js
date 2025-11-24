import { supabase } from '../dbConfig.js';

export const getAllAuctions = async () => {
    const { data, error } = await supabase
        .from('Auction')
        .select('*');
    return { data, error };
}

export const getAuctionById = async (auctionId) => {
    const { data, error } = await supabase
        .from('Auction')
        .select('*')
        .eq('auction_id', auctionId)
        .single();
    return { data, error };
}

export const getAuctionsByArtworkId = async (artworkId) => {
    const { data, error } = await supabase
        .from('Auction')
        .select('*')
        .eq('artwork_id', artworkId);
    return { data, error };
}

export const createAuction = async (auction) => {
    try {
        const response = await supabase
            .from('Auction')
            .insert([auction])
            .select()
            .single();

        console.log('Supabase insert response:', response);

        const { data, error } = response;

        if (error) return { data: null, error };

        if (!data) {
            return {
                data: null,
                error: new Error('Insert succeeded but no row was returned. Check RLS, API key permissions, or table RETURNING settings.')
            };
        }

        return { data, error: null };
    } catch (err) {
        console.error('Unexpected error during insert:', err);
        return { data: null, error: err };
    }
}

export const updateAuction = async (auctionId, updates) => {
    const { data, error } = await supabase
        .from('Auction')
        .update(updates)
        .eq('auction_id', auctionId)
        .select()
        .single();
    return { data, error };
}

export const deleteAuction = async (auctionId) => {
    const { data, error } = await supabase
        .from('Auction')
        .delete()
        .eq('auction_id', auctionId)
        .select()
        .single();
    return { data, error };
}
