import React, { useRef, useState } from 'react';

const styles = {
  box: {
    border: '2px dashed #cbd5e1',
    borderRadius: 8,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    background: '#f8fafc',
    cursor: 'text',
    maxWidth: 480
  },
  title: { fontSize: 16, fontWeight: 600 },
  input: {
    padding: '8px 10px',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    fontSize: 14,
    outline: 'none'
  },
  hint: { fontSize: 12, color: '#6b7280' }
};

export default function TextBox({
  title, // preferred prop name
  label = 'Add title', // kept for backward compatibility
  value: initial = '',
  onChange,
  placeholder, // optional - if omitted will be derived from title/label
  hint = 'Provide a short title for your artwork',
  id
}) {
  const effectiveLabel = title ?? label;
  const placeholderText = placeholder ?? `Enter ${effectiveLabel.toLowerCase()}`;

  const [value, setValue] = useState(initial);
  const inputRef = useRef(null);
  const labelId = id ? `${id}-label` : `${effectiveLabel.replace(/\s+/g, '-').toLowerCase()}-label`;

  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      style={styles.box}
      role="group"
      aria-labelledby={labelId}
      onClick={focusInput}
    >
      <div id={labelId} style={styles.title}>{effectiveLabel}</div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholderText}
        aria-label={`${effectiveLabel} input`}
        style={styles.input}
      />
      {hint ? <div style={styles.hint}>{hint}</div> : null}
    </div>
  );
}