import React, { useRef, useState, useEffect } from 'react';

const styles = {
  page: { padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 1000, margin: '0 auto' },
  box: {
    border: '2px dashed #cbd5e1',
    borderRadius: 8,
    padding: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    background: '#f8fafc',
    minHeight: 160,
    transition: 'border-color .15s, background .15s'
  },
  boxHover: { borderColor: '#60a5fa', background: '#eff8ff' },
  title: { fontSize: 18, fontWeight: 600, marginBottom: 8 },
  hint: { fontSize: 13, color: '#6b7280' },
  previews: { marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' },
  thumb: { width: 140, height: 100, objectFit: 'cover', borderRadius: 6, border: '1px solid #e5e7eb' },
  info: { marginTop: 8, fontSize: 13, color: '#374151' },
  clearBtn: {
    marginTop: 16,
    padding: '8px 12px',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  }
};

const UploadArtwork = () => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]); // { file, url }
  const [hover, setHover] = useState(false);

  useEffect(() => {
    // cleanup object URLs on unmount
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.url));
    };
  }, [files]);

  const openFileDialog = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFiles = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length === 0) return;

    // revoke previous urls
    files.forEach(f => URL.revokeObjectURL(f.url));

    const mapped = list.map(f => ({
      file: f,
      url: URL.createObjectURL(f)
    }));
    setFiles(mapped);
  };

  const clearSelection = () => {
    files.forEach(f => URL.revokeObjectURL(f.url));
    setFiles([]);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={styles.page}>
      <h1>Upload Artwork</h1>

      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFileDialog(); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ ...styles.box, ...(hover ? styles.boxHover : {}) }}
        aria-label="Upload images here"
      >
        <div style={styles.title}>Upload images here</div>
        <div style={styles.hint}>Click this box to open your files and select one or more images</div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <>
          <div style={styles.previews}>
            {files.map((f, i) => (
              <div key={i} aria-label={`preview-${i}`}>
                <img src={f.url} alt={f.file.name} style={styles.thumb} />
                <div style={styles.info}>{f.file.name}</div>
              </div>
            ))}
          </div>
          <button type="button" onClick={clearSelection} style={styles.clearBtn}>Clear selection</button>
        </>
      )}
    </div>
  );
};

export default UploadArtwork;