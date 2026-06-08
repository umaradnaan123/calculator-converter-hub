import React, { useState, useEffect } from 'react';
import { Landmark, TrendingUp, Hourglass } from 'lucide-react';

export const BreakEvenCalculator: React.FC = () => {
  const [fixedCosts, setFixedCosts] = useState('50000');
  const [sellingPrice, setSellingPrice] = useState('100');
  const [variableCost, setVariableCost] = useState('40');
  const [breakEvenUnits, setBreakEvenUnits] = useState('0');
  const [breakEvenRevenue, setBreakEvenRevenue] = useState('0');

  useEffect(() => {
    const fixed = parseFloat(fixedCosts);
    const price = parseFloat(sellingPrice);
    const variable = parseFloat(variableCost);

    if (isNaN(fixed) || isNaN(price) || isNaN(variable) || (price - variable) <= 0) return;

    // Break Even Units = Fixed Costs / (Selling Price - Variable Cost)
    const units = fixed / (price - variable);
    const revenue = units * price;

    setBreakEvenUnits(Math.ceil(units).toString());
    setBreakEvenRevenue(Math.ceil(revenue).toString());
  }, [fixedCosts, sellingPrice, variableCost]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Landmark className="text-gradient" /> Break-Even Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Fixed Overhead Costs (₹)</label>
            <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Selling Price (₹ / unit)</label>
              <input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Variable Cost (₹ / unit)</label>
              <input type="number" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <div>Break-Even Target:</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{parseInt(breakEvenUnits).toLocaleString('en-IN')} Units</div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>Required Sales Revenue: <strong style={{ color: 'var(--success)' }}>₹{parseFloat(breakEvenRevenue).toLocaleString('en-IN')}</strong></div>
        </div>
      </div>
    </div>
  );
};

export const RoiCalculator: React.FC = () => {
  const [initialVal, setInitialVal] = useState('10000');
  const [finalVal, setFinalVal] = useState('15000');
  const [roi, setRoi] = useState('0.0');
  const [gain, setGain] = useState('0.00');

  useEffect(() => {
    const init = parseFloat(initialVal);
    const fin = parseFloat(finalVal);

    if (isNaN(init) || isNaN(fin) || init <= 0) return;

    const netGain = fin - init;
    const returnVal = (netGain / init) * 100;

    setGain(netGain.toFixed(2));
    setRoi(returnVal.toFixed(1));
  }, [initialVal, finalVal]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp className="text-gradient" /> Return on Investment (ROI)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Initial Invested Capital (₹)</label>
            <input type="number" value={initialVal} onChange={(e) => setInitialVal(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Final Returned Value (₹)</label>
            <input type="number" value={finalVal} onChange={(e) => setFinalVal(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Net Profit ROI</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '8px' }}>{roi}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>Total Profit Gain: ₹{parseFloat(gain).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
      </div>
    </div>
  );
};

export const StartupRunway: React.FC = () => {
  const [cash, setCash] = useState('500000');
  const [burn, setBurn] = useState('50000');
  const [runway, setRunway] = useState('0');

  useEffect(() => {
    const c = parseFloat(cash);
    const b = parseFloat(burn);

    if (isNaN(c) || isNaN(b) || c <= 0 || b <= 0) return;

    setRunway((c / b).toFixed(1));
  }, [cash, burn]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Hourglass className="text-gradient" /> Startup Runway & Burn Rate
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Total Cash Balance (₹)</label>
            <input type="number" value={cash} onChange={(e) => setCash(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Monthly Cash Burn Rate (₹)</label>
            <input type="number" value={burn} onChange={(e) => setBurn(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Surviving Cash Runway</div>
          <div style={{ fontSize: '2.6rem', fontWeight: 'bold', color: runway && parseFloat(runway) < 6 ? 'var(--danger)' : 'var(--success)', marginTop: '8px' }}>{runway} Months</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            {runway && parseFloat(runway) < 6 ? '⚠️ Low runway! Consider fundraising or cutting costs.' : '✅ Healthy operational cash index.'}
          </div>
        </div>
      </div>
    </div>
  );
};
