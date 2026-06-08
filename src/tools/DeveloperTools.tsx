import React, { useState, useEffect } from 'react';
import { Code, Key, Settings, Copy, Check } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('{"name":"Calculator Hub","features":["tools","converters"],"active":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError('');
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    formatJson();
  }, [input]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Code className="text-gradient" /> JSON Formatter & Validator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Raw Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: '100%', height: '240px', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
            placeholder="Paste your JSON here..."
          />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.85rem' }}>Formatted Output</label>
            {output && (
              <button onClick={handleCopy} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}>
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          {error ? (
            <div style={{ border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '0.8rem', height: '240px', overflowY: 'auto' }}>
              ❌ JSON Parsing Error: <br /><br /> {error}
            </div>
          ) : (
            <textarea
              readOnly
              value={output}
              style={{ width: '100%', height: '240px', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'none', backgroundColor: 'var(--bg-tertiary)', cursor: 'text' }}
              placeholder="Beautified output appears here..."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const Base64Converter: React.FC = () => {
  const [input, setInput] = useState('Hello World!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode'); // encode | decode
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(input));
        setError('');
      } else {
        setOutput(atob(input));
        setError('');
      }
    } catch (e) {
      setError('Invalid base64 string for decoding');
      setOutput('');
    }
  }, [input, mode]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings className="text-gradient" /> Base64 Converter
      </h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={mode === 'encode' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('encode')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Encode</button>
        <button className={mode === 'decode' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('decode')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Decode</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: '100%', height: '120px', resize: 'none' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Result</label>
          {error ? (
            <div style={{ border: '1px solid var(--danger)', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', height: '120px' }}>{error}</div>
          ) : (
            <textarea
              readOnly
              value={output}
              style={{ width: '100%', height: '120px', resize: 'none', backgroundColor: 'var(--bg-tertiary)' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const HexRgbConverter: React.FC = () => {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');

  const hexToRgb = (hexStr: string) => {
    const cleanHex = hexStr.replace('#', '');
    if (cleanHex.length !== 3 && cleanHex.length !== 6) return null;
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHex = (rgbStr: string) => {
    const match = rgbStr.match(/\d+/g);
    if (!match || match.length < 3) return null;
    const r = parseInt(match[0]);
    const g = parseInt(match[1]);
    const b = parseInt(match[2]);
    if (r > 255 || g > 255 || b > 255) return null;
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    const converted = hexToRgb(val);
    if (converted) setRgb(converted);
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const converted = rgbToHex(val);
    if (converted) setHex(converted);
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Settings className="text-gradient" /> Hex ⇆ RGB Color Converter
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Hex Color</label>
            <input type="text" value={hex} onChange={(e) => handleHexChange(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>RGB Color</label>
            <input type="text" value={rgb} onChange={(e) => handleRgbChange(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: hex, border: '2px solid var(--border-color)', marginBottom: '10px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Color Preview</div>
        </div>
      </div>
    </div>
  );
};

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(12);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumber, setUseNumber] = useState(true);
  const [useSymbol, setUseSymbol] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let charset = '';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumber) charset += '0123456789';
    if (useSymbol) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!charset) {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generate();
  }, [length, useUpper, useLower, useNumber, useSymbol]);

  const getStrength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 14) score++;
    if (useUpper) score++;
    if (useLower) score++;
    if (useNumber) score++;
    if (useSymbol) score++;

    if (score <= 3) return { label: 'Weak', color: 'var(--danger)' };
    if (score <= 5) return { label: 'Moderate', color: 'var(--warning)' };
    return { label: 'Strong', color: 'var(--success)' };
  };

  const strength = getStrength();

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Key className="text-gradient" /> Secure Password Generator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontSize: '0.85rem' }}>Length: <strong>{length}</strong></label>
            <input type="range" min="6" max="32" value={length} onChange={(e) => setLength(parseInt(e.target.value))} style={{ width: '60%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} style={{ width: 'auto' }} /> Uppercase Letters (A-Z)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} style={{ width: 'auto' }} /> Lowercase Letters (a-z)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={useNumber} onChange={(e) => setUseNumber(e.target.checked)} style={{ width: 'auto' }} /> Numbers (0-9)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
              <input type="checkbox" checked={useSymbol} onChange={(e) => setUseSymbol(e.target.checked)} style={{ width: 'auto' }} /> Symbols (!@#$)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input type="text" readOnly value={password} style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '1.05rem', backgroundColor: 'var(--bg-tertiary)' }} />
            <button onClick={handleCopy} className="btn-secondary" style={{ padding: '12px' }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span>Strength:</span>
            <span style={{ fontWeight: 'bold', color: strength.color }}>{strength.label}</span>
          </div>
          <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: strength.label === 'Weak' ? '30%' : strength.label === 'Moderate' ? '65%' : '100%', backgroundColor: strength.color, transition: 'all 0.3s ease' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
