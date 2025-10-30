import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayArtwork from '../components/DisplayArtwork';
import BiddingComponent from "../components/BiddingComponent";

const ArtworkPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialArt = location.state?.art || {};
    const artist = location.state?.artist;

    const [artwork, setArtwork] = useState(initialArt);

    const handleBack = (e) => {
        e.preventDefault();
        if (artist) {
            const artistId = encodeURIComponent(artist.id || artist.slug || artist.name || '');
            navigate(`/artists/${artistId}`, { state: { artist } });
        } else {
            navigate(-1);
        }
    };

    const handleBidUpdate = async (newBid) => {
        // update local UI
        setArtwork((prev) => (prev ? { ...prev, currentBid: newBid } : prev));

        // optional: persist to server if artwork id is available
        try {
            if (artwork?.id) {
                await fetch(`/api/artworks/${encodeURIComponent(artwork.id)}/bid`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bid: newBid }),
                });
            }
        } catch (err) {
            // keep this short — log and continue (UI already updated optimistically)
            // eslint-disable-next-line no-console
            console.warn('Failed to persist bid', err);
        }
    };

    const initialBid = (artwork?.currentBid ?? artwork?.startingBid ?? 0);

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

            <div style={{ marginTop: '1rem' , marginLeft: '21.5rem'}}>
                <BiddingComponent initialBid={initialBid} onBidUpdate={handleBidUpdate} />
            </div>

        </div>
    );
}

export default ArtworkPage;

// test