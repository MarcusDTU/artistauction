import React from 'react';
import PropTypes from 'prop-types';
import { SAMPLE_ARTWORK } from "../assets/SampleArtwork";

const containerStyle = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'flex-start',
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  flexWrap: 'wrap', // stack on small screens
};

const imageWrapper = (width) => ({
  flex: `0 0 ${width}px`,
  width: `${width}px`,
  height: 'auto',
  maxHeight: '80vh',
  overflow: 'hidden',
  borderRadius: 8,
  background: '#f3f4f6',
});

const imgStyle = {
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover', // important: fill wrapper without distortion
};

const contentStyle = {
  flex: '1 1 320px',
  minWidth: 0, // allow truncation and proper text wrapping inside flex
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const titleStyle = {
  margin: 0,
  fontSize: 22,
  lineHeight: 1.1,
};

const artistStyle = {
  margin: 0,
  fontSize: 16,
  color: '#374151',
};

const descStyle = {
  marginTop: '0.25rem',
  color: '#4b5563',
  whiteSpace: 'pre-wrap',
  lineHeight: 1.4,
  overflow: 'auto',
};

const DisplayArtwork = ({ art = {}, imageWidth = 420, style = {}, className }) => {

  const displayed = (art && Object.keys(art).length > 0) ? art : SAMPLE_ARTWORK;

  const imageSrc = displayed.image || '';
  const title = displayed.title || 'Untitled';
  const artistName = displayed.artist?.name || displayed.artistName || 'Unknown artist';
  const description = displayed.description || 'No description available.';

  return (
    <section className={className} style={{ ...containerStyle, ...style }}>
      <div style={imageWrapper(imageWidth)}>
        {imageSrc ? (
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img src={imageSrc} alt={title} style={imgStyle} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
            No image
          </div>
        )}
      </div>

      <div style={contentStyle}>
        <h2 style={titleStyle}>{title}</h2>
        <h3 style={artistStyle}>{artistName}</h3>
        <p style={descStyle}>{description}</p>
      </div>
    </section>
  );
};

DisplayArtwork.propTypes = {
  art: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    artist: PropTypes.shape({
      name: PropTypes.string,
    }),
    artistName: PropTypes.string,
  }),
  imageWidth: PropTypes.number,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default DisplayArtwork;