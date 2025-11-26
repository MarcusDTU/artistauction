import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayArtwork from '../components/DisplayArtwork';
import BiddingComponent from "../components/BiddingComponent";

const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';
const AUCTION_URL = process.env.REACT_APP_AUCTION_URL ?? `${API_HOST}/auction`;
const BID_URL = process.env.REACT_APP_BID_URL ?? `${API_HOST}/bid`;
//const ARTWORK_URL = process.env.REACT_APP_ARTWORK_URL ?? `${API_HOST}/artwork`;

const normalizeArtwork = (raw = {}) => {
    const statusRaw = raw.status ?? raw.availability ?? '';
    const status = String(statusRaw).trim().toLowerCase();

    const availableStatuses = new Set(['available', 'active', 'open']);
    const soldStatuses = new Set(['sold', 'not available', 'unavailable', 'closed']);

    // prefer explicit boolean `raw.sold` when present
    let sold;
    let available;
    if (typeof raw.sold === 'boolean') {
        sold = raw.sold;
        available = !raw.sold;
    } else if (status) {
        if (availableStatuses.has(status)) {
            available = true;
            sold = false;
        } else if (soldStatuses.has(status)) {
            available = false;
            sold = true;
        } else {
            // unknown status string -> fallback to not-sold by default
            available = true;
            sold = false;
        }
    } else {
        // no status and no explicit sold -> fallback
        sold = false;
        available = true;
    }

    return {
        ...raw,
        id: raw.id ?? raw.artwork_id ?? raw.artworkNumber ?? raw.slug ?? null,
        startingBid: raw.startingBid ?? raw.starting_bid ?? null,
        currentBid: raw.currentBid ?? raw.current_price ?? raw.current_bid ?? null,
        endPrice: raw.endPrice ?? raw.end_price ?? null,
        available,
        sold,
    };
};

const ArtworkPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const initialRaw = location.state?.art || {};
    const normalizedInitial = normalizeArtwork(initialRaw);
    const artist = location.state?.artist;

    const [artwork, setArtwork] = useState(normalizedInitial);
    const [auctions, setAuctions] = useState([]);
    const [latestBids, setLatestBids] = useState([]);

    const artId = artwork?.id ?? null;

    useEffect(() => {
        if (!artId) return;

        let mounted = true;
        (async () => {
            try {
                const auctionsRes = await fetch(`${AUCTION_URL}/artwork/${encodeURIComponent(artId)}`);
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

        if (!artist) {
            navigate(-1);
            return;
        }

        const artistId = encodeURIComponent(artist.id || artist.slug || artist.name || '');

        navigate(`/artist/${artistId}`, { state: { artist }, replace: true });
    };

    async function handleBidUpdate(newBid) {
        const knownValues = [
            ...(latestBids || []).map(i => (i?.value != null ? Number(i.value) : NaN)),
            Number(artwork?.currentBid ?? artwork?.startingBid ?? NaN)
        ].filter(v => Number.isFinite(v));
        const highest = knownValues.length ? Math.max(...knownValues) : 0;

        if (Number.isNaN(newBid)) {
            return { success: false, message: 'Invalid bid value' };
        }

        if (newBid <= highest) {
            return {
                success: false,
                message: `Bid must be higher than the current bid of ${highest}`
            };
        }

        const auctionId = auctions?.[0]?.id ?? latestBids?.[0]?.auction_id ?? null;
        if (!auctionId) {
            return { success: false, message: 'No auction found for this artwork' };
        }

        const prevArtwork = artwork;
        const prevLatestBids = latestBids;

        try {
            const res = await fetch(`${BID_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    auction_id: auctionId,
                    bid_amount: newBid
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                const msg = body?.error?.message ?? `Server returned ${res.status}`;
                return { success: false, message: `Failed to save bid: ${msg}` };
            }

            const created = await res.json().catch(() => ({}));
            const createdBidId = created?.id ?? created?.bid_id ?? null;

            // Optimistically update local state
            // The DB trigger 'handle_new_bid' will update Artwork.current_price and check end_price

            setLatestBids(prev => {
                // Check if we already have an entry for this auction
                const exists = prev.some(info => String(info.auction_id) === String(auctionId));
                if (exists) {
                    return prev.map(info => {
                        if (String(info.auction_id) === String(auctionId)) {
                            return { ...info, value: newBid, bid_id: info.bid_id ?? createdBidId ?? 'pending' };
                        }
                        return info;
                    });
                } else {
                    // Add new entry
                    return [...prev, { auction_id: auctionId, bid_id: createdBidId ?? 'pending', value: newBid, rawBid: created }];
                }
            });

            setArtwork(prev => {
                if (!prev) return prev;
                const endPrice = Number(prev.endPrice ?? prev.end_price ?? null);
                const isSold = (Number.isFinite(endPrice) && newBid >= endPrice);

                return {
                    ...prev,
                    currentBid: newBid,
                    sold: isSold || prev.sold
                };
            });

            return { success: true };
        } catch (err) {
            setArtwork(prevArtwork);
            setLatestBids(prevLatestBids);
            return { success: false, message: `Failed to save bid: ${String(err)}` };
        }
    }

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

            <div style={{ marginTop: '1rem', marginLeft: '21.5rem' }}>
                <BiddingComponent initialBid={initialBid} onBidUpdate={handleBidUpdate} sold={!!artwork?.sold} />
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