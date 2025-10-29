import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayArtwork from '../components/DisplayArtwork';

const ArtworkPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const artist = location.state?.artist;

    const handleBack = (e) => {
        e.preventDefault();
        if (artist) {
            const artistId = encodeURIComponent(artist.id || artist.slug || artist.name || '');
            navigate(`/artists/${artistId}`, { state: { artist } });
        } else {
            navigate(-1);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <button
                type="button"
                className="back-link"
                onClick={handleBack}
                style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: 'inherit', font: 'inherit' }}
            >
                ← Back to Artist
            </button>
            <DisplayArtwork />
        </div>
    );
}

export default ArtworkPage;