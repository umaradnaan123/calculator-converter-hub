import React, { useState, useEffect } from 'react';
import { Home, Percent, ArrowUpRight } from 'lucide-react';

export const RentalYield: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState('5000000');
  const [monthlyRent, setMonthlyRent] = useState('15000');
  const [expenses, setExpenses] = useState('2000'); // monthly overheads, insurance, taxes
  const [grossYield, setGrossYield] = useState('0.0');
  const [netYield, setNetYield] = useState('0.0');

  useEffect(() => {
    const price = parseFloat(purchasePrice);
    const rent = parseFloat(monthlyRent);
    const exp = parseFloat(expenses) || 0;

    if (isNaN(price) || isNaN(rent) || price <= 0 || rent <= 0) return;

    // Gross Yield = (Annual Rent / Purchase Price) * 100
    const gross = ((rent * 12) / price) * 100;
    
    // Net Yield = ((Annual Rent - Annual Expenses) / Purchase Price) * 100
    const net = (((rent - exp) * 12) / price) * 100;

    setGrossYield(gross.toFixed(2));
    setNetYield(net.toFixed(2));
  }, [purchasePrice, monthlyRent, expenses]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Percent className="text-gradient" /> Rental Yield Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Property Purchase Price (₹)</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Monthly Rent (₹)</label>
              <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Monthly Overheads (₹)</label>
              <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <div>Gross Rental Yield: <strong style={{ color: 'var(--accent-primary)' }}>{grossYield}%</strong></div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>Net Rental Yield: <strong style={{ color: 'var(--success)' }}>{netYield}%</strong></div>
        </div>
      </div>
    </div>
  );
};

export const HomeAffordability: React.FC = () => {
  const [annualIncome, setAnnualIncome] = useState('1200000');
  const [downPayment, setDownPayment] = useState('500000');
  const [monthlyDebts, setMonthlyDebts] = useState('15000');
  const [affordablePrice, setAffordablePrice] = useState('0');

  useEffect(() => {
    const inc = parseFloat(annualIncome);
    const down = parseFloat(downPayment) || 0;
    const debt = parseFloat(monthlyDebts) || 0;

    if (isNaN(inc) || inc <= 0) return;

    // Standard bank formula: Max home price = (Annual Income * 3) + Down Payment - (Annual Debts * 2)
    const price = (inc * 3) + down - (debt * 12 * 2);
    setAffordablePrice(Math.max(0, Math.round(price)).toString());
  }, [annualIncome, downPayment, monthlyDebts]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Home className="text-gradient" /> Home Affordability Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Gross Annual Income (₹)</label>
            <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Down Payment (₹)</label>
              <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Monthly Debts (₹)</label>
              <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Maximum Affordable Purchase Price</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>₹{parseInt(affordablePrice).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
};

export const PropertyAppreciation: React.FC = () => {
  const [price, setPrice] = useState('4000000');
  const [rate, setRate] = useState('6.0'); // annual appreciation rate
  const [years, setYears] = useState('10');
  const [appreciatedValue, setAppreciatedValue] = useState('0.00');

  useEffect(() => {
    const p = parseFloat(price);
    const r = parseFloat(rate) / 100;
    const y = parseFloat(years);

    if (isNaN(p) || isNaN(r) || isNaN(y) || p <= 0 || y <= 0) return;

    // Compound Appreciation: A = P * (1 + r)^y
    const total = p * Math.pow(1 + r, y);
    setAppreciatedValue(total.toFixed(2));
  }, [price, rate, years]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowUpRight className="text-gradient" /> Property Appreciation Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Initial Purchase Price (₹)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Years</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Appreciation Rate (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Projected Value in {years} Years</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '8px' }}>₹{Math.round(parseFloat(appreciatedValue)).toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Total gain: ₹{Math.round(parseFloat(appreciatedValue) - parseFloat(price)).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
};
