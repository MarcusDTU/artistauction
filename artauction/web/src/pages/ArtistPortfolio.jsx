// javascript
import React, {useEffect, useState, useRef} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import PreviewArtworkList from '../components/PreviewArtworkList';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop';

const normalizeArtist = (raw, fallbackId) => {
  if (!raw) return null;
  return {
    id: raw.artist_id ?? raw.id ?? raw.artist_number ?? fallbackId,
    name:
      (raw.name ?? raw.artist_name ?? `${raw.first_name ?? ''} ${raw.last_name ?? ''}`.trim()) ||
      'Unknown',
    bio: raw.bio ?? raw.description ?? raw.artist_bio ?? '',
    image: raw.image_url ?? raw.image ?? PLACEHOLDER_IMAGE,
    artworks: Array.isArray(raw.artworks) ? raw.artworks : [], // backend may not return artworks yet
    raw,
  };
};

const isArtworkAvailable = (a) => {
  const availRaw = a.status ?? a.availability ?? (typeof a.available === 'boolean' ? (a.available ? 'available' : 'not available') : undefined);
  return String(availRaw ?? '').toLowerCase() === 'available';
};

const ArtistPortfolio = () => {
    const { artistId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const initialArtist = location.state?.artist || null;

    const [artist, setArtist] = useState(initialArtist);
    const [loading, setLoading] = useState(!initialArtist || !initialArtist.bio);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        let mounted = true;

        const shouldFetchArtist = !artist || !artist.bio;
        const shouldFetchArtworks = !artist || artist.artworks == null;

        if ((shouldFetchArtist || shouldFetchArtworks) && artistId) {
            setLoading(true);
            const base = process.env.REACT_APP_API_BASE || 'http://localhost:8081';
            const artistUrl = `${base}/artist/${encodeURIComponent(artistId)}`;
            const artworksUrl = `${base}/artwork/artist/${encodeURIComponent(artistId)}`;

            (async () => {
                try {
                    const [artistRes, artworksRes] = await Promise.all([
                        fetch(artistUrl).catch(e => ({ ok: false, _err: e })),
                        fetch(artworksUrl).catch(e => ({ ok: false, _err: e }))
                    ]);

                    let fetchedArtist = null;
                    let fetchedArtworks = null;

                    if (artistRes) {
                        if (artistRes.ok) {
                            const ct = artistRes.headers.get('content-type') || '';
                            if (!ct.includes('application/json')) {
                                const body = await artistRes.text();
                                throw new Error(`Artist endpoint returned non-JSON: ${ct || 'unknown'} — ${body.slice(0, 300)}`);
                            }
                            fetchedArtist = await artistRes.json();
                        } else if (artistRes._err) {
                            throw artistRes._err;
                        } else {
                            const body = await artistRes.text();
                            throw new Error(`Artist fetch failed: ${artistRes.status} ${artistRes.statusText} - ${body.slice(0, 300)}`);
                        }
                    }

                    if (artworksRes) {
                        if (artworksRes.ok) {
                            const ct = artworksRes.headers.get('content-type') || '';
                            if (!ct.includes('application/json')) {
                                const body = await artworksRes.text();
                                throw new Error(`Artworks endpoint returned non-JSON: ${ct || 'unknown'} — ${body.slice(0, 300)}`);
                            }
                            fetchedArtworks = await artworksRes.json();
                        } else if (artworksRes._err) {
                            throw artworksRes._err;
                        } else {
                            const body = await artworksRes.text();
                            throw new Error(`Artworks fetch failed: ${artworksRes.status} ${artworksRes.statusText} - ${body.slice(0, 300)}`);
                        }
                    }

                    if (!mounted) return;

                    const mergedRaw = { ...(artist || {}), ...(fetchedArtist || {}) };
                    const normalized = normalizeArtist(mergedRaw, artistId);

                    // Determine source artworks (prefer fetchedArtworks when available)
                    const sourceArtworks = Array.isArray(fetchedArtworks)
                      ? fetchedArtworks
                      : Array.isArray(normalized.artworks)
                        ? normalized.artworks
                        : [];

                    // Normalize artwork fields and filter by availability == 'available'
                    normalized.artworks = sourceArtworks
                      .map(a => ({
                        ...a,
                        id: a.id ?? a.artwork_id ?? a._id ?? a.slug ?? a.title,
                        image: a.image ?? a.image_url ?? a.url ?? a.thumbnail ?? PLACEHOLDER_IMAGE,
                        title: a.title ?? a.name ?? 'Untitled',
                        artistName: normalized.name,
                        artist: { id: normalized.id, name: normalized.name },
                        // keep existing status/availability fields for downstream UI
                      }))
                      .filter(isArtworkAvailable);

                    setArtist(normalized);
                } catch (err) {
                    if (!mounted) return;
                    setError(err.message || String(err));
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        }

        return () => {
            mounted = false;
        };
    }, [artist, artistId]);

  const handleSelectArtwork = (art) => {
    const id = art?.id || art?.slug || art?.title;
    if (id) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      navigate(`/artworks/${encodeURIComponent(id)}`, {state: {art}});
      return;
    }
    setNotice(`Feature not yet implemented — viewing "${art?.title || 'Untitled'}"`);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setNotice(null), 3500);
  };

  if (loading) return <div>Loading artist…</div>;
  if (error) return <div>Error: {error}</div>;
  if (!artist) return <div>Artist not found</div>;

  return (
    <div>
      <div style={{padding: '1rem 1rem 0 1rem'}}>
        <a className="back-link" href="#/home">← Back to Home</a>
      </div>

      <div style={{padding: '1rem 1rem 0 1rem'}}>
        <h1 style={{margin: 0, fontSize: '1.75rem'}}>{artist.name}</h1>
      </div>

      <main style={{padding: '1rem 2rem'}}>
        {notice && (
          <div style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            background: '#fffae6',
            border: '1px solid #f5e6a6',
            borderRadius: 6
          }}>
            {notice}
          </div>
        )}

        <section>
          <h2>About</h2>
          <p>{artist.bio || 'No bio available.'}</p>
          <img src={artist.image || PLACEHOLDER_IMAGE} alt={artist.name} style={{maxWidth: 200, borderRadius: 6}}/>
        </section>

        <section>
          <h2>Artworks</h2>
          <PreviewArtworkList artworks={artist.artworks} onSelect={handleSelectArtwork}/>
        </section>
      </main>
    </div>
  );
};

export default ArtistPortfolio;