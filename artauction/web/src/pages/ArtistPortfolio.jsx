import React, { useEffect, useState , useRef} from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PreviewArtworkList from '../components/PreviewArtworkList';

const ArtistPortfolio = () => {
  const { artistId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(location.state?.artist || null);
  const [loading, setLoading] = useState(!artist);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const timeoutRef = useRef(null);

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

  useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleSelectArtwork = (art) => {
        // show a temporary notice; adjust message as desired
        setNotice(`Feature not yet implemented — viewing "${art.title || 'Untitled'}"`);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setNotice(null), 3500);
    };

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
            {notice && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: '#fffae6', border: '1px solid #f5e6a6', borderRadius: 6 }}>
                    {notice}
                </div>
            )}

            <section>
                <h2>About</h2>
                <p>{artist.bio || 'No bio available.'}</p>
            </section>

            <section>
                <h2>Artworks</h2>
                    <PreviewArtworkList artworks={artist.artworks} onSelect={handleSelectArtwork} />
            </section>
        </main>
    </div>
  );
};

export default ArtistPortfolio;