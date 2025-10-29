// File: `artauction/web/src/pages/ArtistPortfolio.jsx`
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ArtistPortfolio = () => {
  const { artistId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(location.state?.artist || null);
  const [loading, setLoading] = useState(!artist);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artist && artistId) {
      setLoading(true);
      fetch(`/api/artists/${artistId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load artist');
          return res.json();
        })
        .then((data) => setArtist(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [artist, artistId]);

  if (loading) return <div>Loading artist…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!artist) return <div>Artist not found</div>;

  return (
    <div>
      <header style={{ background: '#1e3a8a', color: 'white', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ padding: '0.5rem 0.75rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.6)', background: 'transparent', color: 'white', cursor: 'pointer' }}
        >
          Back
        </button>
        <h1 style={{ margin: 0 }}>{artist.name}</h1>
      </header>

      <main style={{ padding: '1rem' }}>
        <section>
          <h2>About</h2>
          <p>{artist.bio || 'No bio available.'}</p>
        </section>

        <section>
          <h2>Artworks</h2>
          {artist.artworks && artist.artworks.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {artist.artworks.map((art) => (
                <article key={art.id} style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                  <img src={art.imageUrl} alt={art.title} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                  <h3 style={{ margin: '0.5rem 0 0 0' }}>{art.title}</h3>
                  <p style={{ margin: 0 }}>{art.year}</p>
                </article>
              ))}
            </div>
          ) : (
            <p>No artworks found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ArtistPortfolio;