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

export default function NumberBox({
  title,
  label = 'Add number',
  value: initial = '',
  onChange,
  placeholder,
  hint = 'Enter a positive number',
  id
}) {
  const effectiveLabel = title ?? label;
  const placeholderText = placeholder ?? `Enter ${effectiveLabel.toLowerCase()}`;

  const [value, setValue] = useState(
    initial === null || initial === undefined ? '' : String(initial)
  );
  const inputRef = useRef(null);
  const labelId = id ? `${id}-label` : `${effectiveLabel.replace(/\s+/g, '-').toLowerCase()}-label`;

  // Accept digits and optional single decimal point (allow leading dot while typing)
  const validRe = /^(\d+(\.\d*)?|\.\d*)$/;

  const handleChange = (e) => {
    const next = e.target.value;
    if (next === '') {
      setValue('');
      if (onChange) onChange(null);
      return;
    }
    if (validRe.test(next)) {
      setValue(next);
      const parsed = parseFloat(next);
      if (!Number.isNaN(parsed)) {
        if (parsed >= 0) {
          if (onChange) onChange(parsed);
        } else {
          // negative numbers are not allowed — ignore calling onChange
        }
      }
    }
    // otherwise ignore invalid input (do not update state)
  };

  const handleBlur = () => {
    // if user leaves a trailing dot like "12." remove the dot and normalize
    if (value.endsWith('.')) {
      const normalized = value.slice(0, -1);
      setValue(normalized);
      const parsed = parseFloat(normalized);
      if (!Number.isNaN(parsed) && onChange) onChange(parsed);
      if (normalized === '') {
        if (onChange) onChange(null);
      }
    }
  };

  const preventInvalidKeys = (e) => {
    // disallow exponent, plus and minus
    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
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
        inputMode="decimal"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={preventInvalidKeys}
        placeholder={placeholderText}
        aria-label={`${effectiveLabel} input`}
        style={styles.input}
      />
      {hint ? <div style={styles.hint}>{hint}</div> : null}
    </div>
  );
}