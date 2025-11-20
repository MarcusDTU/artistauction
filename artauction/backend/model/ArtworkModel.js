import { supabase } from '../dbConfig.js';

export const getAllArtworks = async () => {
    const { data, error } = await supabase
        .from('Artwork')
        .select('*');
    return { data, error };
}

export const getAllArtworksByArtistNumber = async (artist_number) => {
    const { data, error } = await supabase
        .from('Artwork')
        .select('*')
        .eq('artist_id', artist_number);
    return { data, error };
}

export const getArtworkById = async (artworkId) => {
    const { data, error } = await supabase
        .from('Artwork')
        .select('*')
        .eq('artwork_id', artworkId)
        .single();
    return { data, error };
}

export const createArtwork = async (artwork) => {
    try {
        // request the created row back by chaining .select() and use .single() for one object
        const response = await supabase
            .from('Artwork')
            .insert([artwork])
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

export const updateArtwork = async (artworkId, updates) => {
    const { data, error } = await supabase
        .from('Artwork')
        .update(updates)
        .eq('artwork_id', artworkId)
        .single();
    return { data, error };
}