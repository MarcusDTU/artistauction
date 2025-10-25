import React from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/artists.css';

const artists = [
  {
    id: 'elena',
    name: 'Elena Martinez',
    // Using a placeholder image; can be replaced with local asset later
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'james',
    name: 'James Chen',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'sophia',
    name: 'Sophia Laurent',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
  },
];

const FeaturedArtists = () => {
  return (
    <Box component="section" className="artists-section">
      <Typography variant="h3" component="h2" className="artists-title">
        Featured Artists
      </Typography>
      <Typography variant="body1" className="artists-subtitle">
        Explore the portfolios of our talented artists and discover unique masterpieces
      </Typography>

      <Box className="artists-grid">
        {artists.map((artist) => (
          <Box key={artist.id} className="artist-card" data-testid={`artist-${artist.id}`}>
            <img
              className="artist-avatar"
              src={artist.image}
              alt={artist.name}
            />
            <Typography variant="h6" className="artist-name">{artist.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedArtists;
