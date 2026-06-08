import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, QrCode, Download } from 'lucide-react';

export const QrCodeGenerator: React.FC = () => {
  const [text, setText] = useState('https://calculator-hub.com');
  const [size, setSize] = useState('200');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (!text.trim()) {
      setQrUrl('');
      return;
    }
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
  }, [text, size]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <QrCode className="text-gradient" /> QR Code Generator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Text or Link URL</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>QR Code Size</label>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="150">150 x 150 px</option>
              <option value="200">200 x 200 px</option>
              <option value="300">300 x 300 px</option>
              <option value="400">400 x 400 px</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="QR Code" style={{ border: '2px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '10px', backgroundColor: '#fff', maxWidth: '100%', height: 'auto' }} />
              <a href={qrUrl} download="qrcode.png" target="_blank" rel="noreferrer" className="btn-secondary" style={{ marginTop: '12px', fontSize: '0.8rem', padding: '6px 12px', gap: '4px' }}>
                <Download size={14} /> Open & Download
              </a>
            </>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter text to generate QR code</div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ImageCompressor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [originalSize, setOriginalSize] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setOriginalSize((file.size / 1024).toFixed(1) + ' KB');
      setCompressedUrl('');
      setCompressedSize('');
    }
  };

  const compressImage = () => {
    if (!selectedFile) return;

    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Maintain aspect ratio
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedUrl(URL.createObjectURL(blob));
              setCompressedSize((blob.size / 1024).toFixed(1) + ' KB');
            }
            setLoading(false);
          },
          'image/jpeg',
          quality
        );
      };
    };
  };

  useEffect(() => {
    if (selectedFile) {
      compressImage();
    }
  }, [quality, selectedFile]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ImageIcon className="text-gradient" /> Instant Image Compressor
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Upload Image (JPG / PNG)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {selectedFile && (
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Compression Quality: <strong>{Math.round(quality * 100)}%</strong></label>
              <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(parseFloat(e.target.value))} />
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {selectedFile ? (
            <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>Original Size: <strong>{originalSize}</strong></div>
              {loading ? (
                <div>Compressing...</div>
              ) : (
                compressedSize && (
                  <>
                    <div>Compressed Size: <strong style={{ color: 'var(--success)' }}>{compressedSize}</strong></div>
                    <a href={compressedUrl} download={`compressed_${selectedFile.name}`} className="btn-primary" style={{ width: '100%', marginTop: '10px', fontSize: '0.85rem', padding: '10px' }}>
                      <Download size={14} /> Download Compressed Image
                    </a>
                  </>
                )
              )}
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Upload an image to start compression
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
