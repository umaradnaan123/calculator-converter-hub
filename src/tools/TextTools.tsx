import React, { useState, useEffect } from 'react';
import { Type } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    chars: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(Boolean).length;
    
    // Avg reading speed: 200 words per minute
    const readingTime = Math.ceil(words / 200);

    setStats({ chars, words, sentences, paragraphs, readingTime });
  }, [text]);

  const handleCaseChange = (type: string) => {
    if (type === 'upper') setText(text.toUpperCase());
    if (type === 'lower') setText(text.toLowerCase());
    if (type === 'title') {
      setText(text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
  };

  const removeDuplicates = () => {
    const lines = text.split('\n');
    const uniqueLines = Array.from(new Set(lines));
    setText(uniqueLines.join('\n'));
  };

  const sortLines = () => {
    const lines = text.split('\n');
    lines.sort();
    setText(lines.join('\n'));
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Type className="text-gradient" /> Text Analyzer & Counter
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: '100%', height: '220px', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical' }}
            placeholder="Type or paste your content here..."
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button className="btn-secondary" onClick={() => handleCaseChange('upper')} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>UPPERCASE</button>
            <button className="btn-secondary" onClick={() => handleCaseChange('lower')} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>lowercase</button>
            <button className="btn-secondary" onClick={() => handleCaseChange('title')} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Title Case</button>
            <button className="btn-secondary" onClick={removeDuplicates} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Remove Duplicates</button>
            <button className="btn-secondary" onClick={sortLines} style={{ padding: '8px 12px', fontSize: '0.8rem' }}>Sort A-Z</button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.words}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Words</div>
            </div>
            <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.chars}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Characters</div>
            </div>
            <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.sentences}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sentences</div>
            </div>
            <div style={{ textAlign: 'center', background: 'var(--bg-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{stats.paragraphs}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Paragraphs</div>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            📖 Estimated Reading Time: <strong>{stats.readingTime} min</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
