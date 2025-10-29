import React, {useEffect, useState, useRef} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import PreviewArtworkList from '../components/PreviewArtworkList';

const ArtistPortfolio = () => {
    const {artistId} = useParams();
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
        const id = art?.id || art?.slug || art?.title;
        if (id) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            // navigate to artwork page and pass the art object in location.state
            navigate(`/artworks/${encodeURIComponent(id)}`, {state: {art}});
            return;
        }

        // fallback: show temporary notice if no id available
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

            <main style={{padding: '1rem'}}>
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