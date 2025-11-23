// javascript
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayArtwork from '../components/DisplayArtwork';
import BiddingComponent from "../components/BiddingComponent";

const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';
const AUCTION_URL = process.env.REACT_APP_AUCTION_URL ?? `${API_HOST}/auction`;
const BID_URL = process.env.REACT_APP_BID_URL ?? `${API_HOST}/bid`;

const ArtworkPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialArt = location.state?.art || {};
    const artist = location.state?.artist;

    const [artwork, setArtwork] = useState(initialArt);
    const [auctions, setAuctions] = useState([]);
    const [latestBids, setLatestBids] = useState([]);

    useEffect(() => {
        if (!artwork?.id) return;

        let mounted = true;
        (async () => {
            try {
                const auctionsRes = await fetch(`${AUCTION_URL}/artwork/${encodeURIComponent(artwork.id)}`);
                if (!auctionsRes.ok) return;
                const fetchedAuctions = await auctionsRes.json();
                if (!Array.isArray(fetchedAuctions) || fetchedAuctions.length === 0) {
                    if (mounted) {
                        setAuctions([]);
                        setLatestBids([]);
                    }
                    return;
                }
                if (mounted) setAuctions(fetchedAuctions);

                const infos = await Promise.all(fetchedAuctions.map(async (au) => {
                    try {
                        const r = await fetch(`${BID_URL}/latest/auction/${encodeURIComponent(au.id)}`);
                        if (!r.ok) return { auction_id: au.id, bid_id: null, value: null, rawBid: null };
                        const body = await r.json();
                        if (body && typeof body === 'object' && body.error) {
                            return { auction_id: au.id, bid_id: null, value: null, rawBid: null };
                        }
                        const bidObj = Array.isArray(body) ? (body[0] ?? null) : body;
                        if (!bidObj) return { auction_id: au.id, bid_id: null, value: null, rawBid: null };
                        return {
                            auction_id: au.id,
                            bid_id: bidObj?.id ?? null,
                            value: bidObj?.amount ?? bidObj?.value ?? null,
                            rawBid: bidObj ?? null
                        };
                    } catch (e) {
                        return { auction_id: au.id, bid_id: null, value: null, rawBid: null };
                    }
                }));

                if (!mounted) return;
                setLatestBids(infos);

                // --- NEW: set artwork.currentBid from latest fetched bids (use the highest value) ---
                const numericValues = infos
                  .map(i => (i?.value != null ? Number(i.value) : NaN))
                  .filter(v => Number.isFinite(v));
                if (numericValues.length > 0) {
                  const highest = Math.max(...numericValues);
                  setArtwork(prev => {
                    const prevCurrent = Number(prev?.currentBid ?? prev?.startingBid ?? 0);
                    // only update if fetched highest is greater than existing currentBid
                    if (!Number.isFinite(prevCurrent) || highest > prevCurrent) {
                      return { ...(prev ?? {}), currentBid: highest };
                    }
                    return prev;
                  });
                }
                // --- end NEW ---

            } catch (err) {
                // silent fail
            }
        })();

        return () => { mounted = false; };
    }, [artwork?.id]);

    const handleBack = (e) => {
        e.preventDefault();
        if (artist) {
            const artistId = encodeURIComponent(artist.id || artist.slug || artist.name || '');
            navigate(`/artist/${artistId}`, { state: { artist } });
        } else {
            navigate(-1);
        }
    };

    const handleBidUpdate = async (newBid) => {
        setArtwork((prev) => (prev ? { ...prev, currentBid: newBid } : prev));

        const auctionId = auctions?.[0]?.id ?? latestBids?.[0]?.auction_id ?? null;
        if (!auctionId) return;

        try {
            await fetch(`${BID_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    auction_id: auctionId,
                    artwork_id: artwork?.id ?? null,
                    amount: newBid
                }),
            });

            setLatestBids((prev) => prev.map(info => {
                if (String(info.auction_id) === String(auctionId)) {
                    return { ...info, value: newBid, bid_id: info.bid_id ?? 'pending' };
                }
                return info;
            }));
        } catch (err) {
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
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#444' }}>
                    {latestBids.length === 0 ? (
                        <div>No auctions / bids found</div>
                    ) : (
                        latestBids.map(info => (
                            <div key={String(info.auction_id)}>
                                Auction: {info.auction_id} — Latest bid id: {info.bid_id ?? 'none'} — value: {info.value ?? 'n/a'}
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
}

export default ArtworkPage;