import React, { useState } from 'react';
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
  const [currentBid, setCurrentBid] = useState(Number(initialBid) || 0);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const parsePositiveNumber = (val) => {
    if (val === '' || val === null) return null;
    const n = Number(val);
    if (Number.isFinite(n) && n > 0) return n;
    return null;
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    setError(null);
  };

  const handleIncrement = () => {
    const value = parsePositiveNumber(input);
    if (value === null) {
      setError('Enter a positive number');
      return;
    }
    const next = +(currentBid + value).toFixed(2);
    setCurrentBid(next);
    setInput('');
    setError(null);
    if (typeof onBidUpdate === 'function') onBidUpdate(next);
  };

  const isDisabled = parsePositiveNumber(input) === null;

  return (
    <div style={containerStyle}>
      <div>
        <p style={bidStyle}>Current bid: ${currentBid.toFixed(2)}</p>
      </div>

      <div style={inputRow}>
        <input
          type="number"
          min="0.01"
          step="0.01"
          aria-label="Increment amount"
          placeholder="Enter positive amount"
          value={input}
          onChange={handleChange}
          style={inputStyle}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={isDisabled}
          style={{ ...buttonStyle, opacity: isDisabled ? 0.6 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
        >
          Add
        </button>
      </div>

      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

BiddingComponent.propTypes = {
  initialBid: PropTypes.number,
  onBidUpdate: PropTypes.func,
};

export default BiddingComponent;