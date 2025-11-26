import React, {useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import {Box, Typography, IconButton, TextField, Button} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

//const LOGGED_IN_ARTIST_ID = 2;
const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';
const ARTWORK_URL = process.env.REACT_APP_ARTWORK_URL ?? `${API_HOST}/artwork/`;

const fallbackArtworks = [
    {
        id: 1,
        title: 'Sunset Over Lake',
        imageUrl: 'https://images.unsplash.com/vector-1751914322815-32930cd495b9?q=80&w=400&auto=format&fit=crop',
        end_price: 1500.00
    },
    {
        id: 2,
        title: 'Blue Portrait',
        imageUrl: 'https://images.unsplash.com/vector-1738236597535-1e80f2c2af1c?q=80&w=400&auto=format&fit=crop',
        end_price: 2250.50
    },
    {
        id: 3,
        title: 'City Lights',
        imageUrl: 'https://images.unsplash.com/vector-1752217168020-7c56583af863?q=80&w=400&auto=format&fit=crop',
        end_price: 3400.75
    }
];

const DEFAULT_SECRET_PRICE = 69420.00;

const EditArtwork = () => {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const fromState = location.state && location.state.artwork;
    const initialArtwork = fromState || fallbackArtworks.find(a => String(a.id) === String(id)) || null;

    const [artwork, setArtwork] = useState(initialArtwork);
    const [title, setTitle] = useState(initialArtwork ? initialArtwork.title : '');
    const [description, setDescription] = useState(initialArtwork ? initialArtwork.description || '' : '');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const [priceInput, setPriceInput] = useState(() => {
        if (!initialArtwork) return DEFAULT_SECRET_PRICE.toFixed(2);
        const storedPrice = initialArtwork.end_price ?? initialArtwork.price;
        return typeof storedPrice !== 'undefined' && storedPrice !== null
            ? Number(storedPrice).toFixed(2)
            : DEFAULT_SECRET_PRICE.toFixed(2);
    });

    useEffect(() => {
        if (initialArtwork) {
            setArtwork(initialArtwork);
            setTitle(initialArtwork.title);
            setDescription(initialArtwork.description || '');
        }
    }, [initialArtwork]);

    if (!artwork) {
        return (
            <Box sx={{p: 3}}>
                <Typography variant="h6">Artwork not found</Typography>
                <Button variant="contained" sx={{mt: 2}} onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </Box>
        );
    }

    const patchArtwork = async (patch) => {
        const artworkId = artwork?.id ?? id;
        if (!artworkId || String(artworkId).startsWith('idx-')) {
            const msg = `Missing/invalid artwork id: ${String(artworkId)}`;
            // eslint-disable-next-line no-console
            console.error(msg);
            throw new Error(msg);
        }

        // ensure base has no trailing slash and encode id
        const base = ARTWORK_URL.replace(/\/$/, '');
        const url = `${base}/${encodeURIComponent(String(artworkId))}`;

        // debug: show exact URL and payload
        // eslint-disable-next-line no-console
        console.debug('PATCH', url, patch);

        const res = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(patch)
        });

        if (!res.ok) {
            const bodyText = await res.text().catch(() => '');
            const errMsg = `Server returned ${res.status} for ${url}: ${bodyText}`;
            // eslint-disable-next-line no-console
            console.error(errMsg);
            if (res.status === 404) {
                alert(`Not found (404) when PATCHing ${url}. Confirm route and id format.`);
            }
            throw new Error(errMsg);
        }

        const data = await res.json().catch(() => ({}));
        setArtwork(prev => ({ ...prev, ...patch, ...data }));
        return data;
    };

    // Title handlers
    const handleStartEditTitle = () => setIsEditingTitle(true);
    const handleCancelTitle = () => {
        setTitle(artwork.title);
        setIsEditingTitle(false);
    };
    const handleSaveTitle = async () => {
        try {
            const payload = { title };
            await patchArtwork(payload);
            setIsEditingTitle(false);
            console.log(`Saved title for artwork ${artwork.id}:`, payload);
            alert(`Title changed to "${title}"`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to save title', err);
            alert(`Failed to save title for artwork ${artwork?.id ?? id}: ${err.message || 'unknown error'}`);
        }
    };

    // Description handlers (separate)
    const handleStartEditDescription = () => setIsEditingDescription(true);
    const handleCancelDescription = () => {
        setDescription(artwork.description || '');
        setIsEditingDescription(false);
    };
    const handleSaveDescription = async () => {
        try {
            const payload = { description };
            await patchArtwork(payload);
            setIsEditingDescription(false);
            console.log(`Saved description for artwork ${artwork.id}:`, payload);
            alert('Description changed to "' + description + '"');
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to save description', err);
            alert(`Failed to save description for artwork ${artwork?.id ?? id}: ${err.message || 'unknown error'}`);
        }
    };

    const handlePriceChange = (e) => {
        const v = e.target.value;
        if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v)) {
            setPriceInput(v);
        }
    };

    const handleSetPrice = async () => {
        const parsed = parseFloat(priceInput);
        if (isNaN(parsed) || parsed <= 0) {
            alert(`Please enter a positive price for artwork ${artwork?.id ?? id}.`);
            return;
        }
        const rounded = Number(parsed.toFixed(2));
        try {
            // send price only - do not change artist_id
            const payload = { end_price: rounded };
            await patchArtwork(payload);
            setPriceInput(rounded.toFixed(2));
            console.log(`Set secret price for artwork ${artwork.id}:`, payload);
            alert("Price updated to " + rounded.toFixed(2));
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to set price', err);
            alert(`Failed to set price for artwork ${artwork?.id ?? id}: ${err.message || 'unknown error'}`);
        }
    };

    const handleUploadMoreImages = () => {
        console.warn('handleUploadMoreImages() not implemented');
        alert(`Upload more images feature not implemented yet for artwork ${artwork?.id ?? id}.`);
    };

    const handleToggleAvailability = async () => {
        const current = artwork?.status ?? 'not available';
        const newStatus = current === 'available' ? 'not available' : 'available';

        try {
            await patchArtwork({ status: newStatus });
            // patchArtwork merges the returned data into state, but ensure UI reflects it
            setArtwork(prev => ({ ...prev, status: newStatus }));
            alert(`Status updated to "${newStatus}" for artwork ${artwork?.id ?? id}.`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to update status', err);
            alert(`Failed to update status for artwork ${artwork?.id ?? id}: ${err.message || 'unknown error'}`);
        }
    };

    return (
        <Box sx={{p: 3, position: 'relative', minHeight: '80vh', fontFamily: 'Arial, sans-serif'}}>
            <Box
                component="img"
                src={artwork.imageUrl || artwork.image}
                alt={title}
                sx={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    width: 160,
                    height: 160,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: '#f2f2f2'
                }}
            />

            <Box sx={{ml: {xs: 0, sm: '200px'}, pt: 2}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    {!isEditingTitle ? (
                        <>
                            <Typography variant="h4" component="h1" sx={{fontWeight: 600}}>
                                {artwork.title}
                            </Typography>
                            <IconButton aria-label="Edit title" onClick={handleStartEditTitle} size="large">
                                <EditIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <TextField
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                size="small"
                                sx={{minWidth: 300}}
                                inputProps={{'aria-label': 'Artwork title'}}
                            />
                            <Button aria-label="Save title" onClick={handleSaveTitle} color="primary" variant="contained" size="small">
                                Save title
                            </Button>
                            <Button aria-label="Cancel title edit" onClick={handleCancelTitle} color="secondary" variant="contained" size="small">
                                Cancel
                            </Button>
                        </>
                    )}
                </Box>
                <Box sx={{mt: 3, display: 'flex', alignItems: 'center', gap: 1}}>
                    <Typography variant="h6" component="h2" sx={{fontWeight: 600}}>
                        Description
                    </Typography>
                    {!isEditingDescription && (
                        <IconButton aria-label="Edit description" onClick={handleStartEditDescription} size="small">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Box sx={{mt: 1, maxWidth: 720}}>
                    {!isEditingDescription ? (
                        <Typography variant="body1" sx={{color: '#555', whiteSpace: 'pre-wrap'}}>
                            {artwork.description || description || 'No description provided.'}
                        </Typography>
                    ) : (
                        <>
                            <TextField
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                minRows={4}
                                variant="outlined"
                                inputProps={{'aria-label': 'Artwork description'}}
                            />
                            <Box sx={{mt: 1, display: 'flex', gap: 1}}>
                                <Button aria-label="Save description" onClick={handleSaveDescription} color="primary" variant="contained" size="small">
                                    Save
                                </Button>
                                <Button aria-label="Cancel description edit" onClick={handleCancelDescription} color="secondary" variant="contained" size="small">
                                    Cancel
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>

                <Box sx={{mt: 4, maxWidth: 480, p: 2, border: '1px solid #eee', borderRadius: 2, backgroundColor: '#fafafa'}}>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1}}>
                        <Typography variant="h6" component="h3" sx={{fontWeight: 600}}>
                            Set secret price
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                        <TextField
                            value={priceInput}
                            onChange={handlePriceChange}
                            type="number"
                            inputProps={{ step: '0.01', min: '0.01', 'aria-label': 'Secret price' }}
                            sx={{flex: 1}}
                            helperText="Enter a positive number (two decimals allowed)"
                            placeholder={DEFAULT_SECRET_PRICE.toFixed(2)}
                        />
                        <Button variant="contained" color="primary" onClick={handleSetPrice}>
                            Set
                        </Button>
                    </Box>

                    <Typography variant="caption" sx={{display: 'block', mt: 1, color: '#666'}}>
                        Current stored price: {(() => {
                            const storedPrice = artwork?.end_price ?? artwork?.price;
                            return typeof storedPrice !== 'undefined' && storedPrice !== null 
                                ? Number(storedPrice).toFixed(2) 
                                : 'None (will default to ' + DEFAULT_SECRET_PRICE.toFixed(2) + ')';
                        })()}
                    </Typography>
                </Box>

                <Box sx={{mt: 2, display: 'flex', alignItems: 'center', gap: 1}}>
                    <Typography variant="h6" component="h3" sx={{fontWeight: 600}}>
                        Availability
                    </Typography>

                    <Button
                        variant="contained"
                        color={artwork?.status === 'available' ? 'success' : 'secondary'}
                        onClick={handleToggleAvailability}
                    >
                        {artwork?.status === 'available' ? 'Set not available' : 'Set available'}
                    </Button>

                    <Typography variant="body2" sx={{ml: 1, color: '#666'}}>
                        Current: {artwork?.status ?? 'not available'}
                    </Typography>
                </Box>

                <Box sx={{mt: 2}}>
                    <Button variant="outlined" onClick={handleUploadMoreImages}>
                        Upload more images
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default EditArtwork;