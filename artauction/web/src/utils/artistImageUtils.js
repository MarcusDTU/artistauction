// Artist portrait photos with specific characteristics
export const ARTIST_IMAGES = [
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face&auto=format', // Artist 1: Girl with golden hair and dark skin
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&auto=format', // Artist 2: Girl with long black hair and glasses
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format'  // Artist 3: Man with white/gray hair, no mask
];

export const getArtistImage = (artistId, name) => {
  // Use a simple hash to consistently assign the same image to the same artist
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };
  
  const key = String(artistId || name || 'default');
  const index = hashCode(key) % ARTIST_IMAGES.length;
  return ARTIST_IMAGES[index];
};