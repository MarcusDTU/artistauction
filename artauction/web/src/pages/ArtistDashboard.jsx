import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const LOGGED_IN_ARTIST_ID = 2; //hardcoded for demo purposes
const API_HOST = process.env.REACT_APP_API_HOST ?? 'http://localhost:8081';
const ARTWORK_URL = process.env.REACT_APP_ARTWORK_URL ?? `${API_HOST}/artwork/artist/${LOGGED_IN_ARTIST_ID}`;

const ArtistDashboard = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch(ARTWORK_URL, { headers: { Accept: 'application/json' } });
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.items || data.results || []);
                const mapped = list
                    .map((a) => {
                        const artworkId =
                            a.id ??
                            a.artwork_id ??
                            a.artworkId ??
                            a._id ??
                            a.uuid ??
                            a.external_id ??
                            a.externalId;

                        return {
                            ...a,
                            id: artworkId != null ? String(artworkId) : undefined,
                            imageUrl: a.image_url || a.imageUrl || a.image || '',
                            title: a.title || a.name || 'Untitled'
                        };
                    })
                    // drop any items without a valid id
                    .filter(a => a.id);

                if (mounted) {
                    setArtworks(mapped);
                    setLoading(false);
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Failed to load artworks', err);
                if (mounted) {
                    setError(err.message || 'Failed to load artworks');
                    setLoading(false);
                }
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    // Accept the artwork object and pass it directly into location.state
    const handleEdit = (artwork) => {
        const artworkId = artwork?.id;
        if (!artworkId) {
            // defensive: avoid navigating with undefined id
            alert('Cannot open editor: missing artwork id');
            return;
        }
        navigate(`/edit-artwork/${artworkId}`, { state: { artwork } });
    };

    const handleUpload = () => {
        navigate('/upload-artwork');
    }

    const styles = {
        page: {padding: 20, fontFamily: 'Arial, sans-serif'},
        list: {listStyle: 'none', margin: 0, padding: 0},
        item: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #eee'
        },
        left: {display: 'flex', alignItems: 'center', gap: 12},
        thumb: {width: 72, height: 72, objectFit: 'cover', borderRadius: 4, background: '#f2f2f2'},
        info: {display: 'flex', flexDirection: 'column'},
        title: {fontSize: 16, fontWeight: 600},
        right: {minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'},
        button: {padding: '6px 12px', fontSize: 14, cursor: 'pointer'},
        status: {marginTop: 8, fontSize: 12, color: '#666'},
        statusPublic: {color: 'green'},
        statusPrivate: {color: 'crimson'},
        uploadButton: {
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 24,
            padding: '12px 20px',
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
    };

    return (
        <div style={styles.page}>
            <h1>Your Artworks</h1>

            {loading ? (
                <div>Loading artworks...</div>
            ) : error ? (
                <div style={{color: 'crimson'}}>Error: {error}</div>
            ) : artworks.length === 0 ? (
                <div>No artworks found.</div>
            ) : (
                <ul style={styles.list}>
                    {artworks.map(a => (
                        <li key={a.id} style={styles.item}>
                            <div style={styles.left}>
                                <img src={a.imageUrl} alt={a.title} style={styles.thumb}/>
                                <div style={styles.info}>
                                    <div style={styles.title}>{a.title}</div>
                                </div>
                            </div>

                            <div style={styles.right}>
                                {/* pass the artwork object directly to handleEdit */}
                                <button style={styles.button} onClick={() => handleEdit(a)}>Edit</button>
                                <div
                                    style={{
                                        ...styles.status,
                                        ...(a.status === 'public' ? styles.statusPublic : styles.statusPrivate)
                                    }}
                                >
                                    {a.status || 'private'}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="button"
                style={styles.uploadButton}
                onClick={() => handleUpload()}
                aria-label="Upload new artwork"
            >
                Upload new artwork
            </button>
        </div>
    );
}

export default ArtistDashboard;