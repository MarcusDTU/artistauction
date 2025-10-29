import React from 'react';
import PropTypes from 'prop-types';
import PreviewArtwork from './PreviewArtwork';
import { Link } from 'react-router-dom';
import { SAMPLE_ARTWORK } from '../assets/SampleArtwork';

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 220px)',
    gridAutoRows: '320px',
    gap: '0.75rem',
    justifyContent: 'center',
    alignItems: 'start',
    padding: '0.5rem',
};

const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    width: '100%',
    height: '100%',
};

const PreviewArtworkList = ({ artworks = [], onSelect }) => {

    const list = Array.isArray(artworks) && artworks.length > 0 ? artworks : [SAMPLE_ARTWORK];

    return (
        <section className="preview-artwork-list" style={gridStyle}>
            {list.map((art) => {
                const id = art.id || art.slug || art.title || 'sample';
                return (
                    <Link key={id} to={`/artworks/${encodeURIComponent(id)}`} style={linkStyle}>
                        <PreviewArtwork art={art} />
                    </Link>
                );
            })}
        </section>
    );
};

PreviewArtworkList.propTypes = {
    artworks: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
};

export default PreviewArtworkList;