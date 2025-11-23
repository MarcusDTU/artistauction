import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayArtwork from '../components/DisplayArtwork';
import BiddingComponent from "../components/BiddingComponent";

const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';
const AUCTION_URL = process.env.REACT_APP_AUCTION_URL ?? `${API_HOST}/auction`;
const BID_URL = process.env.REACT_APP_BID_URL ?? `${API_HOST}/bid`;

// Normalize incoming artwork objects from router state / backend
const normalizeArtwork = (raw = {}) => ({
  ...raw,
  id: raw.id ?? raw.artwork_id ?? raw.artworkNumber ?? raw.slug ?? null,
  startingBid: raw.startingBid ?? raw.starting_bid ?? null,
  currentBid: raw.currentBid ?? raw.current_bid ?? null,
});

const ArtworkPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // normalize initial art so `id` exists if backend returned `artwork_id`
    const initialRaw = location.state?.art || {};
    const normalizedInitial = normalizeArtwork(initialRaw);
    const artist = location.state?.artist;

    const [artwork, setArtwork] = useState(normalizedInitial);
    const [auctions, setAuctions] = useState([]);
    const [latestBids, setLatestBids] = useState([]);

    // use a stable artId for effects and lint
    const artId = artwork?.id ?? null;

    useEffect(() => {
        if (!artId) return;

        let mounted = true;
        (async () => {
            try {
                const auctionsRes = await fetch(`${AUCTION_URL}/artwork/${encodeURIComponent(artId)}`);
                console.log("Fetched auctions response:", auctionsRes);
                if (!auctionsRes.ok) return;
                const fetchedAuctions = await auctionsRes.json();

                if (!Array.isArray(fetchedAuctions) || fetchedAuctions.length === 0) {
                    if (mounted) {
                        setAuctions([]);
                        setLatestBids([]);
                    }
                    return;
                }

                const normalizedAuctions = fetchedAuctions.map(au => ({
                    ...au,
                    id: au.id ?? au.auction_id ?? null
                }));
                if (mounted) setAuctions(normalizedAuctions);

                const infos = await Promise.all(normalizedAuctions.map(async (au) => {
                    const auId = au.id ?? au.auction_id ?? null;
                    if (!auId) return { auction_id: auId, bid_id: null, value: null, rawBid: null };
                    try {
                        const r = await fetch(`${BID_URL}/latest/auction/${encodeURIComponent(auId)}`);
                        console.log("Fetched latest bid response for auction", auId, ":", r);
                        if (!r.ok) return { auction_id: auId, bid_id: null, value: null, rawBid: null };
                        const body = await r.json();
                        const bidObj = Array.isArray(body) ? (body[0] ?? null) : body;
                        if (!bidObj) return { auction_id: auId, bid_id: null, value: null, rawBid: null };
                        const normalizedBid = {
                            id: bidObj.id ?? bidObj.bid_id ?? null,
                            amount: bidObj.amount ?? bidObj.bid_amount ?? bidObj.value ?? null,
                            raw: bidObj
                        };
                        return {
                            auction_id: auId,
                            bid_id: normalizedBid.id,
                            value: normalizedBid.amount,
                            rawBid: normalizedBid.raw
                        };
                    } catch (e) {
                        return { auction_id: auId, bid_id: null, value: null, rawBid: null };
                    }
                }));

                if (!mounted) return;
                setLatestBids(infos);

                const numericValues = infos
                  .map(i => (i?.value != null ? Number(i.value) : NaN))
                  .filter(v => Number.isFinite(v));
                if (numericValues.length > 0) {
                  const highest = Math.max(...numericValues);
                  setArtwork(prev => {
                    const prevCurrent = Number(prev?.currentBid ?? prev?.startingBid ?? 0);
                    if (!Number.isFinite(prevCurrent) || highest > prevCurrent) {
                      return { ...(prev ?? {}), currentBid: highest };
                    }
                    return prev;
                  });
                }

            } catch (err) {
                // ignore
            }
        })();

        return () => { mounted = false; };
    }, [artId]);

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
                    bid_amount: newBid
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