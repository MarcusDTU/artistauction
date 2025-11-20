import { supabase } from '../dbConfig.js';

export const getAllArtworksbyProfileId = async (profileId) => {
    const { data, error } = await supabase
        .from('Artwork')
        .select('*')
        .eq('profile_id', profileId);
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
        .insert({id: artwork, name: [artwork]})
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