// javascript
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
  fontSize: '0.95rem',
  color: '#333',
  margin: 0,
};

const inputRow = {
  display: 'flex',
  gap: '.5rem',
  alignItems: 'center',
};

const inputStyle = {
  flex: 1,
  padding: '.5rem',
  borderRadius: 4,
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '.5rem .75rem',
  borderRadius: 4,
  border: 'none',
  background: '#007bff',
  color: '#fff',
  cursor: 'pointer',
};

const errorStyle = {
  color: '#b00020',
  fontSize: '.9rem',
};

const twoDecimalRegex = /^\d*(?:\.\d{0,2})?$/;

const formatToTwo = (v) => {
  if (v == null || v === '') return '0.00';
  const n = Number(v);
  if (!Number.isFinite(n)) return '0.00';
  return n.toFixed(2);
};

const BiddingComponent = ({ initialBid = 0, onBidUpdate }) => {
  // initialBid is treated as the current highest known bid
  const [highest, setHighest] = useState(Number(initialBid) || 0);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHighest(Number(initialBid) || 0);
    setError(null);
    // keep user's current typed input untouched when highest changes
  }, [initialBid]);

  const handleChange = (e) => {
    const v = e.target.value;
    if (v.startsWith('-')) {
      setInput(v);
      setError('Bid must be 0 or greater');
      return;
    }
    if (v === '' || twoDecimalRegex.test(v)) {
      setInput(v);
      setError(null);
    } else {
      setError('Enter a number with up to two decimal places');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const str = input === '' ? '0' : input;
    const parsed = Number(str);
    if (!Number.isFinite(parsed)) {
      setError('Invalid number');
      return;
    }
    if (parsed < 0) {
      setError('Bid must be 0 or greater');
      return;
    }
    const rounded = Number(parsed.toFixed(2));

    if (rounded <= highest) {
      setError(`Bid must be higher than the current bid of ${formatToTwo(highest)}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const result = await Promise.resolve(onBidUpdate?.(rounded));
      // parent should return { success: boolean, message?: string } or truthy on success
      if (!result) {
        // no structured response — assume success (but keep highest update optimistic)
        setHighest(rounded);
        setInput('');
      } else if (result.success === false) {
        setError(result.message ?? 'Bid was rejected');
      } else {
        // success
        setHighest(rounded);
        setInput('');
      }
    } catch (err) {
      setError('Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={bidStyle}>
        Highest bid: <strong>{formatToTwo(highest)}</strong>
      </div>

      <form onSubmit={handleSubmit} style={inputRow}>
        <input
          type="text"
          inputMode="decimal"
          value={input}
          onChange={handleChange}
          placeholder="Enter your bid"
          aria-label="bid amount"
          style={inputStyle}
        />
        <button type="submit" disabled={submitting} style={buttonStyle}>
          {submitting ? '...' : 'Bid'}
        </button>
      </form>

      {error && <div style={errorStyle}>{error}</div>}
      <div style={{ fontSize: '.85rem', color: '#666' }}>
        Tip: bid must be strictly greater than the highest bid and have at most two decimals.
      </div>
    </div>
  );
};

BiddingComponent.propTypes = {
  initialBid: PropTypes.number, // current highest known bid
  onBidUpdate: PropTypes.func,  // async (newBid) => ({ success: boolean, message?: string }) or truthy
};

export default BiddingComponent;