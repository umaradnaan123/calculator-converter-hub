import React, { useState, useEffect } from 'react';
import { Landmark, Percent, Award } from 'lucide-react';

export const EmiCalculator: React.FC = () => {
  const [loanAmt, setLoanAmt] = useState('1000000'); // Default to ₹10 Lakhs
  const [interestRate, setInterestRate] = useState('8.5'); // Typical Indian home/personal loan rate
  const [tenure, setTenure] = useState('15'); // 15 years
  const [tenureType, setTenureType] = useState('years');
  const [results, setResults] = useState<any>(null);

  const calculateEmi = () => {
    const P = parseFloat(loanAmt);
    const R = parseFloat(interestRate) / 12 / 100;
    let N = parseFloat(tenure);

    if (isNaN(P) || isNaN(R) || isNaN(N) || P <= 0 || R <= 0 || N <= 0) return;

    if (tenureType === 'years') {
      N = N * 12;
    }

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    // Build breakdown schedule
    const schedule = [];
    let remainingPrincipal = P;
    for (let i = 1; i <= Math.min(N, 120); i++) {
      const interestPaid = remainingPrincipal * R;
      const principalPaid = emi - interestPaid;
      remainingPrincipal -= principalPaid;
      schedule.push({
        month: i,
        principal: principalPaid.toFixed(2),
        interest: interestPaid.toFixed(2),
        balance: Math.max(0, remainingPrincipal).toFixed(2)
      });
    }

    setResults({
      emi: emi.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      schedule
    });
  };

  useEffect(() => {
    calculateEmi();
  }, [loanAmt, interestRate, tenure, tenureType]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Landmark className="text-gradient" /> Loan EMI Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Loan Amount (₹)</label>
            <input type="number" value={loanAmt} onChange={(e) => setLoanAmt(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Annual Interest Rate (%)</label>
            <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Loan Tenure</label>
              <input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Tenure Type</label>
              <select value={tenureType} onChange={(e) => setTenureType(e.target.value)}>
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Monthly EMI Payment</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>₹{parseFloat(results.emi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Principal Amount</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{parseFloat(loanAmt).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Interest</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>₹{parseFloat(results.totalInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {results && results.schedule && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Amortization Schedule (First 12 Months)</h4>
          <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Month</th>
                  <th style={{ padding: '8px' }}>Principal Paid</th>
                  <th style={{ padding: '8px' }}>Interest Paid</th>
                  <th style={{ padding: '8px' }}>Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {results.schedule.slice(0, 12).map((row: any) => (
                  <tr key={row.month} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px' }}>{row.month}</td>
                    <td style={{ padding: '8px' }}>₹{parseFloat(row.principal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '8px' }}>₹{parseFloat(row.interest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '8px' }}>₹{parseFloat(row.balance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const SipCalculator: React.FC = () => {
  const [monthlyInvest, setMonthlyInvest] = useState('5000'); // ₹5,000 standard Indian SIP
  const [expectedRate, setExpectedRate] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');
  const [results, setResults] = useState<any>(null);

  const calculateSip = () => {
    const P = parseFloat(monthlyInvest);
    const i = parseFloat(expectedRate) / 12 / 100;
    const n = parseFloat(timePeriod) * 12;

    if (isNaN(P) || isNaN(i) || isNaN(n) || P <= 0 || i <= 0 || n <= 0) return;

    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const wealthGain = futureValue - totalInvested;

    setResults({
      futureValue: futureValue.toFixed(0),
      totalInvested: totalInvested.toFixed(0),
      wealthGain: wealthGain.toFixed(0)
    });
  };

  useEffect(() => {
    calculateSip();
  }, [monthlyInvest, expectedRate, timePeriod]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Award className="text-gradient" /> SIP Investment Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Monthly Investment (₹)</label>
            <input type="number" value={monthlyInvest} onChange={(e) => setMonthlyInvest(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Expected Annual Return (%)</label>
            <input type="number" value={expectedRate} onChange={(e) => setExpectedRate(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Time Period (Years)</label>
            <input type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} />
          </div>
        </div>

        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Estimated Wealth</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{parseFloat(results.futureValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Invested Amount</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>₹{parseFloat(results.totalInvested).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Est. Returns</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>₹{parseFloat(results.wealthGain).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('100000'); // ₹1 Lakh
  const [rate, setRate] = useState('7.0');
  const [time, setTime] = useState('5');
  const [frequency, setFrequency] = useState('12');
  const [results, setResults] = useState<any>(null);

  const calculateCI = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(frequency);

    if (isNaN(P) || isNaN(r) || isNaN(t) || isNaN(n) || P <= 0 || r <= 0 || t <= 0) return;

    const amount = P * Math.pow(1 + r / n, n * t);
    const interest = amount - P;

    setResults({
      amount: amount.toFixed(2),
      interest: interest.toFixed(2)
    });
  };

  useEffect(() => {
    calculateCI();
  }, [principal, rate, time, frequency]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Percent className="text-gradient" /> Compound Interest Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Principal Amount (₹)</label>
            <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Rate of Interest (%)</label>
            <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Time (Years)</label>
              <input type="number" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Compounding Frequency</label>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option value="1">Annually</option>
                <option value="2">Semi-Annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
              </select>
            </div>
          </div>
        </div>

        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Future Value</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>₹{parseFloat(results.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interest Earned</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--success)' }}>₹{parseFloat(results.interest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
