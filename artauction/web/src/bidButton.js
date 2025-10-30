// web/src/bidButton.js
import React, { useState } from 'react';

export default function BidButton({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(value);
    if (!Number.isFinite(num) || num <= 0) {
      alert('Please enter a positive number');
      return;
    }
    if (typeof onSubmit === 'function') {
      onSubmit(num);
    } else {
      alert(`Submitted bid: ${num}`);
      console.log('Submitted bid:', num);
    }
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
      <input
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter bid"
        aria-label="bid amount"
      />
      <button type="submit">Submit</button>
    </form>
  );
}