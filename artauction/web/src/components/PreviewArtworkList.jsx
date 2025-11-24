import React from 'react';
import PropTypes from 'prop-types';
import PreviewArtwork from './PreviewArtwork';
import { Link } from 'react-router-dom';
import { SAMPLE_ARTWORKS } from '../assets/SampleArtwork';

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 220px)',
    gridAutoRows: '320px',
    gap: '0.75rem',
    justifyContent: 'flex-start',
    alignItems: 'start',
    padding: '0.5rem 0',
};

const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    width: '100%',
    height: '100%',
};

const PreviewArtworkList = ({ artworks = [], onSelect }) => {

    if (artworks == null) {
        const list = SAMPLE_ARTWORKS;
        return (
            <section className="preview-artwork-list" style={gridStyle}>
                {list.map((art) => {
                    const id = art.id || art.slug || art.title || 'sample';
                    return (
                        <Link
                            key={id}
                            to={`/artworks/${encodeURIComponent(id)}`}
                            state={{ art }}
                            style={linkStyle}
                            onClick={() => onSelect && onSelect(art)}
                        >
                            <PreviewArtwork art={art} />
                        </Link>
                    );
                })}
            </section>
        );
    }
    // If an explicit empty array was provided -> render nothing
    if (Array.isArray(artworks) && artworks.length === 0) {
        return null;
    }

    // If artworks is a non-empty array -> render it
    if (Array.isArray(artworks)) {
        return (
            <section className="preview-artwork-list" style={gridStyle}>
                {artworks.map((art) => {
                    const id = art.id || art.slug || art.title || 'sample';
                    return (
                        <Link
                            key={id}
                            to={`/artworks/${encodeURIComponent(id)}`}
                            state={{ art }}
                            style={linkStyle}
                            onClick={() => onSelect && onSelect(art)}
                        >
                            <PreviewArtwork art={art} />
                        </Link>
                    );
                })}
            </section>
        );
    }

    // Fallback: render nothing for unexpected types
    return null;
};

PreviewArtworkList.propTypes = {
    artworks: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
};

export default PreviewArtworkList;