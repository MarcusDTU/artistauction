import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  maxWidth: 320,
  padding: '0.75rem',
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  background: '#fff',
};

const bidStyle = {
  fontSize: '1.5rem',
  fontWeight: 600,
  margin: 0,
};

const inputRow = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
};

const inputStyle = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: 4,
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  border: 'none',
  background: '#007bff',
  color: '#fff',
  cursor: 'pointer',
};

const errorStyle = {
  color: '#b00020',
  fontSize: '0.875rem',
  margin: 0,
};

const BiddingComponent = ({ initialBid = 0, onBidUpdate }) => {
    const [bid, setBid] = useState(initialBid ?? 0);
    const [error, setError] = useState(null);

    useEffect(() => {
        setBid(initialBid ?? 0);
        setError(null);
    }, [initialBid]);

    const handleChange = (e) => {
        const v = Number(e.target.value);
        if (!Number.isFinite(v)) {
            setBid(0);
            setError('Invalid number');
            return;
        }
        if (v < 0) {
            setBid(v);
            setError('Bid must be 0 or greater');
            return;
        }
        setBid(v);
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error) return;
        onBidUpdate?.(bid);
    };

    return (
        <div style={containerStyle}>
            <p style={bidStyle}>Current: {bid}</p>

            <form onSubmit={handleSubmit}>
                <div style={inputRow}>
                    <input
                        type="number"
                        value={bid}
                        onChange={handleChange}
                        step="1"
                        min="0"
                        aria-label="bid amount"
                        style={inputStyle}
                    />
                    <button type="submit" style={buttonStyle}>Bid</button>
                </div>
            </form>

            {error && <p style={errorStyle}>{error}</p>}
        </div>
    );
};

BiddingComponent.propTypes = {
    initialBid: PropTypes.number,
    onBidUpdate: PropTypes.func,
};

export default BiddingComponent;