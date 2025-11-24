import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayArtwork from '../components/DisplayArtwork';
import BiddingComponent from "../components/BiddingComponent";

const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';
const AUCTION_URL = process.env.REACT_APP_AUCTION_URL ?? `${API_HOST}/auction`;
const BID_URL = process.env.REACT_APP_BID_URL ?? `${API_HOST}/bid`;
const ARTWORK_URL = process.env.REACT_APP_ARTWORK_URL ?? `${API_HOST}/artwork`;

const normalizeArtwork = (raw = {}) => ({
  ...raw,
  id: raw.id ?? raw.artwork_id ?? raw.artworkNumber ?? raw.slug ?? null,
  startingBid: raw.startingBid ?? raw.starting_bid ?? null,
  currentBid: raw.currentBid ?? raw.current_bid ?? null,
  sold: raw.sold ?? false,
});

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

            const patchRes = await fetch(`${ARTWORK_URL}/${encodeURIComponent(artId)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ current_price: newBid }),
            });

            if (!patchRes.ok) {
                if (createdBidId) {
                    try {
                        await fetch(`${BID_URL}/${encodeURIComponent(createdBidId)}`, { method: 'DELETE' });
                    } catch (deleteErr) {
                        // eslint-disable-next-line no-console
                        console.warn('Failed to delete created bid after patch failure', deleteErr);
                    }
                }

                const body = await patchRes.json().catch(() => ({}));
                const msg = body?.error?.message ?? `Server returned ${patchRes.status}`;
                return { success: false, message: `Failed to update artwork current_price: ${msg}` };
            }

            let fetchedArt = null;
            try {
                const artRes = await fetch(`${ARTWORK_URL}/${encodeURIComponent(artId)}`);
                if (artRes.ok) {
                    fetchedArt = await artRes.json().catch(() => null);
                }
            } catch (fErr) {
                fetchedArt = null;
            }

            let shouldDeactivateAuction = false;
            if (fetchedArt) {
                const fetchedCurrent = Number(fetchedArt.current_price ?? fetchedArt.currentBid ?? fetchedArt.current_bid ?? null);
                const endPrice = Number(fetchedArt.end_price ?? fetchedArt.endPrice ?? fetchedArt.end_price ?? null);
                if (Number.isFinite(fetchedCurrent) && Number.isFinite(endPrice) && fetchedCurrent >= endPrice) {
                    shouldDeactivateAuction = true;
                }
            }

            if (shouldDeactivateAuction) {
                const auctionPatchRes = await fetch(`${AUCTION_URL}/${encodeURIComponent(auctionId)}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ is_active: false }),
                });

                if (!auctionPatchRes.ok) {
                    if (createdBidId) {
                        try {
                            await fetch(`${BID_URL}/${encodeURIComponent(createdBidId)}`, { method: 'DELETE' });
                        } catch (deleteErr) {
                            // eslint-disable-next-line no-console
                            console.warn('Failed to delete created bid after auction-deactivate failure', deleteErr);
                        }
                    }
                    setArtwork(prevArtwork);
                    setLatestBids(prevLatestBids);

                    const body = await auctionPatchRes.json().catch(() => ({}));
                    const msg = body?.error?.message ?? `Server returned ${auctionPatchRes.status}`;
                    return { success: false, message: `Failed to deactivate auction: ${msg}` };
                }

                // mark auction inactive and mark artwork as sold locally
                setAuctions(prev => (Array.isArray(prev) ? prev.map(a => {
                    if (String(a.id ?? a.auction_id) === String(auctionId)) {
                        return { ...(a ?? {}), is_active: false };
                    }
                    return a;
                }) : prev));

                setArtwork(prev => (prev ? { ...prev, currentBid: newBid, sold: true } : prev));
            } else {
                // normal success: update current bid and ensure sold is false
                setArtwork(prev => (prev ? { ...prev, currentBid: newBid, sold: false } : prev));
            }

            setLatestBids(prev => prev.map(info => {
                if (String(info.auction_id) === String(auctionId)) {
                    return { ...info, value: newBid, bid_id: info.bid_id ?? createdBidId ?? 'pending' };
                }
                return info;
            }));

            return { success: true };
        } catch (err) {
            setArtwork(prevArtwork);
            setLatestBids(prevLatestBids);
            return { success: false, message: `Failed to save bid: ${String(err)}` };
        }
    }

    const initialBid = artwork?.currentBid ?? artwork?.startingBid ?? 0;

    return (
        <div style={{ padding: '1rem' }}>
            <button
                type="button"
                className="back-link"
                onClick={handleBack}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                    color: 'inherit',
                    font: 'inherit',
                }}
            >
                ← Back to Artist
            </button>


            <div
                style={{
                padding: '1rem',
                maxWidth: '900px',
                margin: '0 auto',
            }}
            >
                <DisplayArtwork />

                <div style={{ marginTop: '1rem' }}>
                    <BiddingComponent
                        initialBid={initialBid}
                        onBidUpdate={handleBidUpdate}
                        sold={!!artwork?.sold}
                    />

                    <div
                        style={{
                            marginTop: '0.5rem',
                            fontSize: '0.9rem',
                            color: '#444',
                        }}
                    >
                        {latestBids.length === 0 ? (
                            <div>No auctions / bids found</div>
                        ) : (
                            latestBids.map((info) => (
                                <div key={String(info.auction_id)}>
                                    Auction: {info.auction_id} — Latest bid id:{' '}
                                    {info.bid_id ?? 'none'} — value: {info.value ?? 'n/a'}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArtworkPage;