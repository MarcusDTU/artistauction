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
        .eq('id', artworkId)
        .single();
    return { data, error };
}

export const createArtwork = async (artwork) => {
    const { data, error } = supabase
        .from('Artwork')
        .insert([artwork])
        .single();
    return { data, error };
}

export const updateArtwork = async (artworkId, updates) => {
    const { data, error } = await supabase
        .from('Artwork')
        .update(updates)
        .eq('id', artworkId)
        .single();
    return { data, error };
}