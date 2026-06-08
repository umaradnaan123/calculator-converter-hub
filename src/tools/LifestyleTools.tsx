import React, { useState, useEffect } from 'react';
import { Home, Lightbulb, PenTool } from 'lucide-react';

export const ElectricityCalculator: React.FC = () => {
  const [wattage, setWattage] = useState('1500'); // e.g. Heater or AC
  const [hours, setHours] = useState('5');
  const [rate, setRate] = useState('6.5'); // 6.5 rupees per kWh
  const [monthlyCost, setMonthlyCost] = useState('0.00');

  useEffect(() => {
    const w = parseFloat(wattage);
    const h = parseFloat(hours);
    const r = parseFloat(rate);

    if (isNaN(w) || isNaN(h) || isNaN(r) || w <= 0 || h <= 0 || r <= 0) return;

    // Cost = (Watts * hours * 30 days) / 1000 * rate
    const kwhPerMonth = (w * h * 30) / 1000;
    const cost = kwhPerMonth * r;

    setMonthlyCost(cost.toFixed(2));
  }, [wattage, hours, rate]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Lightbulb className="text-gradient" /> Electricity Bill Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Appliance Wattage (W)</label>
            <input type="number" value={wattage} onChange={(e) => setWattage(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Hours Used Per Day</label>
            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Utility Rate (₹ per kWh)</label>
            <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated Monthly Expense</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>₹{parseFloat(monthlyCost).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Based on 30 days of billing.</div>
        </div>
      </div>
    </div>
  );
};

export const RentAffordability: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState('50000');
  const [rentLimit, setRentLimit] = useState('15000');

  useEffect(() => {
    const inc = parseFloat(grossIncome);
    if (isNaN(inc) || inc <= 0) return;

    // Rent should be max 30% of gross income
    setRentLimit((inc * 0.3).toFixed(0));
  }, [grossIncome]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Home className="text-gradient" /> Rent Affordability Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Gross Monthly Income (₹)</label>
          <input type="number" value={grossIncome} onChange={(e) => setGrossIncome(e.target.value)} />
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recommended Max Monthly Rent</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '6px' }}>₹{parseInt(rentLimit).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
};

export const PaintCalculator: React.FC = () => {
  const [height, setHeight] = useState('2.5'); // in meters
  const [length, setLength] = useState('10'); // total width of walls
  const [coats, setCoats] = useState('2');
  const [paintNeeded, setPaintNeeded] = useState('0.0');

  useEffect(() => {
    const h = parseFloat(height);
    const l = parseFloat(length);
    const c = parseFloat(coats);

    if (isNaN(h) || isNaN(l) || isNaN(c) || h <= 0 || l <= 0 || c <= 0) return;

    // Total wall area = height * length
    const area = h * l;
    
    // 1 Liter of paint covers approx 10 sq meters
    const liters = (area / 10) * c;
    setPaintNeeded(liters.toFixed(1));
  }, [height, length, coats]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PenTool className="text-gradient" /> Wall Paint Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Total Wall Length (m)</label>
            <input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Wall Height (m)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Number of Paint Coats</label>
            <input type="number" value={coats} onChange={(e) => setCoats(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Required Paint Volume</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginTop: '8px' }}>{paintNeeded} Liters</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Estimated based on standard 10m²/L coverage rate.</div>
        </div>
      </div>
    </div>
  );
};
