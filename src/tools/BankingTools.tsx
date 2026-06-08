import React, { useState, useEffect } from 'react';
import { Landmark, Award, TrendingUp } from 'lucide-react';

export const LoanEligibility: React.FC = () => {
  const [income, setIncome] = useState('50000'); // ₹50,000 monthly
  const [existingEmi, setExistingEmi] = useState('5000'); // ₹5,000 existing EMI
  const [interestRate, setInterestRate] = useState('8.5');
  const [tenure, setTenure] = useState('20');
  const [maxLoan, setMaxLoan] = useState('0');
  const [eligibleEmi, setEligibleEmi] = useState('0');

  useEffect(() => {
    const inc = parseFloat(income);
    const exEmi = parseFloat(existingEmi) || 0;
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseFloat(tenure) * 12;

    if (isNaN(inc) || isNaN(r) || isNaN(n) || inc <= 0 || r <= 0 || n <= 0) return;

    const totalAllowedEmi = inc * 0.5;
    const netAllowedEmi = Math.max(0, totalAllowedEmi - exEmi);

    const maxAmt = netAllowedEmi / ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    setEligibleEmi(netAllowedEmi.toFixed(2));
    setMaxLoan(Math.max(0, Math.round(maxAmt)).toString());
  }, [income, existingEmi, interestRate, tenure]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Landmark className="text-gradient" /> Loan Eligibility Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Gross Monthly Income (₹)</label>
            <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Existing Monthly EMIs (₹)</label>
            <input type="number" value={existingEmi} onChange={(e) => setExistingEmi(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Rate (%)</label>
              <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Tenure (Yrs)</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Eligible Maximum Loan</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '4px' }}>₹{parseInt(maxLoan).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Max Eligible Monthly EMI Limit: <strong>₹{parseFloat(eligibleEmi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SavingsGoal: React.FC = () => {
  const [target, setTarget] = useState('500000'); // ₹5 Lakhs
  const [years, setYears] = useState('5');
  const [interest, setInterest] = useState('6.5'); // typical Indian bank FD/savings yield
  const [monthlyNeeded, setMonthlyNeeded] = useState('0.00');

  useEffect(() => {
    const t = parseFloat(target);
    const y = parseFloat(years);
    const r = parseFloat(interest) / 100 / 12;
    const n = y * 12;

    if (isNaN(t) || isNaN(y) || isNaN(r) || t <= 0 || y <= 0) return;

    let pmt = 0;
    if (r === 0) {
      pmt = t / n;
    } else {
      pmt = t * (r / (Math.pow(1 + r, n) - 1));
    }

    setMonthlyNeeded(pmt.toFixed(2));
  }, [target, years, interest]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Award className="text-gradient" /> Savings Goal Planner
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Target Goal Amount (₹)</label>
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Time (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Expected APY (%)</label>
              <input type="number" step="0.1" value={interest} onChange={(e) => setInterest(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Required Monthly Savings</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>₹{parseFloat(monthlyNeeded).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Total principal invested: ₹{(parseFloat(monthlyNeeded) * parseFloat(years) * 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InflationCalculator: React.FC = () => {
  const [amount, setAmount] = useState('100000'); // ₹1 Lakh
  const [rate, setRate] = useState('6.0'); // Avg Indian inflation rate
  const [years, setYears] = useState('10');
  const [futureValue, setFutureValue] = useState('0.00');

  useEffect(() => {
    const amt = parseFloat(amount);
    const r = parseFloat(rate) / 100;
    const y = parseFloat(years);

    if (isNaN(amt) || isNaN(r) || isNaN(y) || amt <= 0 || y <= 0) return;

    const futureVal = amt * Math.pow(1 + r, y);
    setFutureValue(futureVal.toFixed(2));
  }, [amount, rate, years]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp className="text-gradient" /> Inflation Purchasing Power Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Initial Value (₹)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Avg. Inflation (%)</label>
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Years</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Future Equivalent Cost</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--danger)', marginTop: '8px' }}>₹{parseFloat(futureValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Due to compounding inflation, you will need ₹{parseFloat(futureValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })} in {years} years to buy what ₹{parseFloat(amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })} buys today.
          </p>
        </div>
      </div>
    </div>
  );
};
