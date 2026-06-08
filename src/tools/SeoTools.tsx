import React, { useState, useEffect } from 'react';
import { Globe, Copy, Check } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
  const [title, setTitle] = useState('Calculator Hub');
  const [desc, setDesc] = useState('A complete online platform containing hundreds of calculators, converters, and developer utility tools.');
  const [keywords, setKeywords] = useState('calculators, converters, tools, online calculators');
  const [author, setAuthor] = useState('Hub Team');
  const [robots, setRobots] = useState('index, follow');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const html = `<!-- HTML Meta Tags -->
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="${robots}">`;
    setOutput(html);
  }, [title, desc, keywords, author, robots]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe className="text-gradient" /> Meta Tag Generator & Previewer
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Site Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Keywords (comma separated)</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Meta Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} style={{ height: '80px', resize: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Robots Indexing</label>
              <select value={robots} onChange={(e) => setRobots(e.target.value)}>
                <option value="index, follow">Index, Follow</option>
                <option value="noindex, nofollow">No Index, No Follow</option>
                <option value="index, nofollow">Index, No Follow</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem' }}>Generated HTML Markup</label>
            <button onClick={handleCopy} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}>
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            style={{ width: '100%', height: '140px', fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: 'var(--bg-tertiary)', resize: 'none' }}
          />

          <h4 style={{ margin: '14px 0 8px 0', fontSize: '0.9rem' }}>Google SERP Search Preview</h4>
          <div style={{ background: '#fff', border: '1px solid #dadce0', borderRadius: '8px', padding: '14px', fontFamily: 'arial, sans-serif' }}>
            <div style={{ fontSize: '12px', color: '#202124', marginBottom: '2px' }}>https://example.com</div>
            <div style={{ fontSize: '18px', color: '#1a0dab', textDecoration: 'hover', cursor: 'pointer', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
            <div style={{ fontSize: '13px', color: '#4d5156', lineHeight: '1.4' }}>{desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RobotsTxtGenerator: React.FC = () => {
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [robotsText, setRobotsText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const text = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

Sitemap: ${sitemap}`;
    setRobotsText(text);
  }, [sitemap]);

  const handleCopy = () => {
    navigator.clipboard.writeText(robotsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe className="text-gradient" /> Robots.txt Generator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Sitemap URL</label>
          <input type="url" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Robots.txt instructs web scrapers and crawlers where they are permitted to go on your domain.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem' }}>Robots.txt Output</label>
            <button onClick={handleCopy} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}>
              {copied ? <Check size={12} /> : <Copy size={12} />} Copy
            </button>
          </div>
          <textarea
            readOnly
            value={robotsText}
            style={{ width: '100%', height: '140px', fontFamily: 'monospace', fontSize: '0.85rem', backgroundColor: 'var(--bg-tertiary)', resize: 'none' }}
          />
        </div>
      </div>
    </div>
  );
};
