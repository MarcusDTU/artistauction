import React, { useState, useRef, useEffect } from 'react';

/**
 * Factory: createDropdownMenu(items, options)
 * - items: [{ label: 'Page', to: '/path', external: false, onClick: fn }, ...]
 * - options: { buttonLabel: 'Menu' }
 *
 * Returned component props:
 * - label: override button label
 * - className: wrapper class
 * - onNavigate: optional function (path) => { ... } (pass react-router's navigate)
 */
export default function createDropdownMenu(items = [], options = {}) {
  const { buttonLabel = 'Menu' } = options;

  return function DropdownMenu({ label, className, onNavigate }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const list = Array.isArray(items) ? items : [];

    useEffect(() => {
      function handleDocClick(e) {
        if (rootRef.current && !rootRef.current.contains(e.target)) {
          setOpen(false);
        }
      }
      document.addEventListener('mousedown', handleDocClick);
      return () => document.removeEventListener('mousedown', handleDocClick);
    }, []);

    function navigateTo(item) {
      setOpen(false);
      if (typeof item.onClick === 'function') {
        item.onClick();
        return;
      }
      if (typeof onNavigate === 'function') {
        onNavigate(item.to);
        return;
      }
      if (item.external) {
        window.open(item.to, '_blank', 'noopener');
        return;
      }
      // fallback to same-window navigation
      window.location.assign(item.to);
    }

    return (
      <div
        ref={rootRef}
        className={`dropdown-factory ${className || ''}`}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          style={{ padding: '6px 10px', cursor: 'pointer' }}
        >
          {label || buttonLabel}
        </button>

        {open && (
          <ul
            role="menu"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.12)',
              padding: 0,
              marginTop: 6,
              listStyle: 'none',
              minWidth: 160,
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              zIndex: 1000
            }}
          >
            {list.map((it, idx) => (
              <li key={idx} role="none">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => navigateTo(it)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
}