import React from 'react';
import PropTypes from 'prop-types';
import PreviewArtwork , { SAMPLE_ARTWORK } from './PreviewArtwork';

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 220px)',
    gridAutoRows: '320px',
    gap: '0.75rem',
    justifyContent: 'center',
    alignItems: 'start',
    padding: '0.5rem',
};

const PreviewArtworkList = ({ artworks = [], onSelect }) => {

    const list = Array.isArray(artworks) && artworks.length > 0 ? artworks : [SAMPLE_ARTWORK];

    return (
        <section className="preview-artwork-list" style={gridStyle}>
            {list.map((art) => (
                <PreviewArtwork
                    key={art.id || art.title}
                    art={art}
                    onClick={onSelect ? () => onSelect(art) : undefined}
                />
            ))}
        </section>
    );
};

PreviewArtworkList.propTypes = {
    artworks: PropTypes.arrayOf(PropTypes.object),
    onSelect: PropTypes.func,
};

export default PreviewArtworkList;