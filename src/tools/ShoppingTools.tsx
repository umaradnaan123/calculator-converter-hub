import React, { useState, useEffect } from 'react';
import { Tag, TrendingUp, Percent } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState('1000');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [taxPercent, setTaxPercent] = useState('18');
  const [finalPrice, setFinalPrice] = useState('0.00');
  const [savings, setSavings] = useState('0.00');

  useEffect(() => {
    const orig = parseFloat(originalPrice);
    const disc = parseFloat(discountPercent);
    const tax = parseFloat(taxPercent);

    if (isNaN(orig) || orig <= 0) return;

    const savedVal = orig * (disc / 100);
    const discountedPrice = orig - savedVal;
    const finalVal = discountedPrice + (discountedPrice * (tax / 100));

    setSavings(savedVal.toFixed(2));
    setFinalPrice(finalVal.toFixed(2));
  }, [originalPrice, discountPercent, taxPercent]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Tag className="text-gradient" /> Discount Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Original Price (₹)</label>
            <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Discount (%)</label>
              <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Sales Tax / GST (%)</label>
              <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', textAlign: 'center' }}>
          <div>Final Checkout Price:</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{parseFloat(finalPrice).toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You saved: <strong>₹{parseFloat(savings).toLocaleString('en-IN')}</strong></div>
        </div>
      </div>
    </div>
  );
};

export const ProfitMarginCalculator: React.FC = () => {
  const [cost, setCost] = useState('500');
  const [revenue, setRevenue] = useState('800');
  const [profit, setProfit] = useState('0.00');
  const [margin, setMargin] = useState('0.00');
  const [markup, setMarkup] = useState('0.00');

  useEffect(() => {
    const c = parseFloat(cost);
    const r = parseFloat(revenue);

    if (isNaN(c) || isNaN(r) || c <= 0 || r <= 0) return;

    const profVal = r - c;
    const marginVal = (profVal / r) * 100;
    const markupVal = (profVal / c) * 100;

    setProfit(profVal.toFixed(2));
    setMargin(marginVal.toFixed(1) + '%');
    setMarkup(markupVal.toFixed(1) + '%');
  }, [cost, revenue]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp className="text-gradient" /> Profit Margin Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Cost of Item (₹)</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Selling Price / Revenue (₹)</label>
            <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <div>Gross Profit: <strong>₹{parseFloat(profit).toLocaleString('en-IN')}</strong></div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>Profit Margin: <strong style={{ color: 'var(--success)' }}>{margin}</strong></div>
          <div>Markup Percentage: <strong>{markup}</strong></div>
        </div>
      </div>
    </div>
  );
};

export const VatGstCalculator: React.FC = () => {
  const [amount, setAmount] = useState('10000');
  const [taxRate, setTaxRate] = useState('18');
  const [mode, setMode] = useState('add'); // add | remove
  const [taxVal, setTaxVal] = useState('0.00');
  const [finalVal, setFinalVal] = useState('0.00');

  useEffect(() => {
    const amt = parseFloat(amount);
    const rate = parseFloat(taxRate);

    if (isNaN(amt) || isNaN(rate) || amt <= 0 || rate <= 0) return;

    if (mode === 'add') {
      const tax = amt * (rate / 100);
      setTaxVal(tax.toFixed(2));
      setFinalVal((amt + tax).toFixed(2));
    } else {
      // Amount is inclusive of tax, extract base amount: Base = Total / (1 + rate/100)
      const base = amt / (1 + (rate / 100));
      const tax = amt - base;
      setTaxVal(tax.toFixed(2));
      setFinalVal(base.toFixed(2));
    }
  }, [amount, taxRate, mode]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Percent className="text-gradient" /> VAT / GST Tax Calculator
      </h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className={mode === 'add' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('add')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Add Tax</button>
        <button className={mode === 'remove' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('remove')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Remove Tax (Extract)</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Base Invoice Value (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Tax / GST Rate (%)</label>
            <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {mode === 'add' ? 'Total with Tax' : 'Calculated Base Amount'}
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>₹{parseFloat(finalVal).toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Associated Tax Amount: <strong>₹{parseFloat(taxVal).toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
