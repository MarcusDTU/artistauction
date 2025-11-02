import React, {useState} from 'react';

const mockArtworks = [
    {
        id: 1,
        title: 'Sunset Over Lake',
        imageUrl: 'https://images.unsplash.com/vector-1751914322815-32930cd495b9?q=80&w=400&auto=format&fit=crop',
        status: 'public'
    },
    {
        id: 2,
        title: 'Blue Portrait',
        imageUrl: 'https://images.unsplash.com/vector-1738236597535-1e80f2c2af1c?q=80&w=400&auto=format&fit=crop',
        status: 'private'
    },
    {
        id: 3,
        title: 'City Lights',
        imageUrl: 'https://images.unsplash.com/vector-1752217168020-7c56583af863?q=80&w=400&auto=format&fit=crop',
        status: 'public'
    }
];

const ArtistDashboard = () => {
    const [artworks] = useState(mockArtworks);

    const handleEdit = (id) => {
        console.warn(`handleEdit(${id}) not implemented`);
        alert('Edit feature not implemented yet');
    };

    const handleUpload = () => {
        console.warn('handleUpload() not implemented');
        alert('Upload feature not implemented yet');
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
                            <button style={styles.button} onClick={() => handleEdit(a.id)}>Edit</button>
                            <div
                                style={{
                                    ...styles.status,
                                    ...(a.status === 'public' ? styles.statusPublic : styles.statusPrivate)
                                }}
                            >
                                {a.status}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

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