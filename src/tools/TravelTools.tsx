import React, { useState, useEffect } from 'react';
import { Globe, Clock, CheckSquare } from 'lucide-react';

export const TimeZoneConverter: React.FC = () => {
  const [baseTime, setBaseTime] = useState('12:00');
  const [baseTz, setBaseTz] = useState('UTC');
  const [targetTz, setTargetTz] = useState('IST');
  const [convertedTime, setConvertedTime] = useState('');

  const offsets: { [key: string]: number } = {
    UTC: 0,
    EST: -5,
    PST: -8,
    GMT: 0,
    IST: 5.5,
    JST: 9,
    AEST: 10
  };

  useEffect(() => {
    const [h, m] = baseTime.split(':').map(Number);
    const baseOffset = offsets[baseTz];
    const targetOffset = offsets[targetTz];

    // Convert to UTC first
    let utcHours = h - baseOffset;
    
    // Add target offset
    let targetHours = utcHours + targetOffset;
    let targetMinutes = m + (targetOffset % 1 !== 0 ? 30 : 0);

    if (targetMinutes >= 60) {
      targetHours += 1;
      targetMinutes -= 60;
    } else if (targetMinutes < 0) {
      targetHours -= 1;
      targetMinutes += 60;
    }

    targetHours = (targetHours + 24) % 24;
    const formattedHours = Math.floor(targetHours).toString().padStart(2, '0');
    const formattedMinutes = Math.floor(targetMinutes).toString().padStart(2, '0');

    setConvertedTime(`${formattedHours}:${formattedMinutes}`);
  }, [baseTime, baseTz, targetTz]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe className="text-gradient" /> Time Zone Converter
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Select Base Zone</label>
          <select value={baseTz} onChange={(e) => setBaseTz(e.target.value)}>
            {Object.keys(offsets).map(tz => (
              <option key={tz} value={tz}>{tz} (UTC{offsets[tz] >= 0 ? '+' : ''}{offsets[tz]})</option>
            ))}
          </select>
          <input type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} style={{ marginTop: '12px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Select Target Zone</label>
          <select value={targetTz} onChange={(e) => setTargetTz(e.target.value)}>
            {Object.keys(offsets).map(tz => (
              <option key={tz} value={tz}>{tz} (UTC{offsets[tz] >= 0 ? '+' : ''}{offsets[tz]})</option>
            ))}
          </select>
          <input type="text" readOnly value={convertedTime} style={{ marginTop: '12px', fontWeight: 'bold', backgroundColor: 'var(--bg-tertiary)' }} />
        </div>
      </div>
    </div>
  );
};

export const WorldClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCityTime = (offset: number) => {
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    const nd = new Date(utc + (3600000 * offset));
    return nd.toLocaleTimeString();
  };

  const cities = [
    { name: 'New York', offset: -5 },
    { name: 'London', offset: 0 },
    { name: 'Paris', offset: 1 },
    { name: 'New Delhi', offset: 5.5 },
    { name: 'Tokyo', offset: 9 },
    { name: 'Sydney', offset: 10 }
  ];

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock className="text-gradient" /> World Clock
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
        {cities.map(city => (
          <div key={city.name} style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{city.name}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '4px' }}>{getCityTime(city.offset)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PackingChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Passport & Travel Visa', checked: true },
    { id: 2, text: 'Phone charger & Adapter', checked: false },
    { id: 3, text: 'Toothbrush & Toiletries', checked: false },
    { id: 4, text: 'Comfortable walking shoes', checked: false }
  ]);
  const [newText, setNewText] = useState('');

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setItems([...items, { id: Date.now(), text: newText.trim(), checked: false }]);
    setNewText('');
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CheckSquare className="text-gradient" /> Packing Checklist
      </h3>
      <form onSubmit={addItem} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Add packing item..." />
        <button className="btn-primary" style={{ padding: '8px 16px' }}>Add</button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(item => (
          <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
            <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} style={{ width: 'auto' }} />
            <span style={{ textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
              {item.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
