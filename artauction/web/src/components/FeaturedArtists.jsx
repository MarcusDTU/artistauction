import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import '../styles/artists.css';
import { Link } from 'react-router-dom';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop';

const normalizeArtist = (a) => ({
  id: a.artist_id ?? a.id ?? a.artist_number ?? a.artistNumber ?? a.name?.toLowerCase().split(' ')[0],
  name: a.name ?? a.artist_name ?? `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim() ?? 'Unknown',
  image: a.image_url ?? a.image ?? PLACEHOLDER,
});

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:8081'; // set to http://localhost:8081 if no proxy
    const url = `${base}/artist`;

    (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!mounted) return;
        const list = Array.isArray(data) ? data.map(normalizeArtist) : [];
        setArtists(list);
      } catch (err) {
        if (!mounted) return;
        setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box component="section" className="artists-section">
        <Typography variant="h3" component="h2" className="artists-title">
          Featured Artists
        </Typography>
        <Typography>Loading artists…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box component="section" className="artists-section">
        <Typography variant="h3" component="h2" className="artists-title">
          Featured Artists
        </Typography>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

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
          <Link
            key={artist.id}
            to={`/artist/${artist.id}`}
            state={{ artist }}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box className="artist-card" data-testid={`artist-${artist.id}`}>
              <img className="artist-avatar" src={artist.image} alt={artist.name} />
              <Typography variant="h6" className="artist-name">
                {artist.name}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedArtists;