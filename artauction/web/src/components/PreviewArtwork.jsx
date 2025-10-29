import React from 'react';
import PropTypes from 'prop-types';

export const SAMPLE_ARTWORK= {
    id: 1,
    title: 'Ceiling Mural',
    description: 'A beautiful ceiling mural depicting an elysian scene of angels viewing the clods down on Earth. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    image: 'https://images.unsplash.com/flagged/photo-1572392640988-ba48d1a74457?q=80&w=400&auto=format&fit=crop',
}

const cardStyle = {
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',       // fill the grid cell
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    background: 'white',
};

const imgWrapperStyle = {
    width: '100%',
    height: '65%',       // control image area within fixed cell
    overflow: 'hidden',
    background: '#f3f4f6',
};

const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',  // important to avoid stretching and keep cover
    display: 'block',
};

const metaStyle = {
    padding: '0.5rem',
    height: '35%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
};

const titleStyle = {
    fontSize: 14,
    lineHeight: '1.2',
    marginBottom: '0.25rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const descStyle = {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: '1.2',
    display: '-webkit-box',
    WebkitLineClamp: 2,          // limit to 2 lines
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '2.4em',         // fallback height (2 * line-height)
    margin: 0,
};

const PreviewArtwork = ({ art, onClick }) => (
    <div style={cardStyle} onClick={onClick}>
        <div style={imgWrapperStyle}>
            <img src={art.imageUrl || art.image} alt={art.title} style={imgStyle} />
        </div>
        <div style={metaStyle}>
            <strong style={titleStyle}>{art.title}</strong>
            <small style={descStyle}>{art.description}</small>
        </div>
    </div>
);

PreviewArtwork.propTypes = {
    art: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func,
};

export default PreviewArtwork;