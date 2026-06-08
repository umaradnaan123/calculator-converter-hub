import React, { useState, useEffect } from 'react';
import { Landmark, Percent, Scale, TrendingUp, Info, RefreshCw, Table, ShieldAlert } from 'lucide-react';

const PURITY_FACTORS: { [key: string]: { label: string; ratio: number; standard: string } } = {
  '24K': { label: '24 Karat (99.9% Pure)', ratio: 0.999, standard: 'Fine Gold, coins, bars' },
  '22K': { label: '22 Karat (91.6% Pure)', ratio: 0.916, standard: 'Standard ornaments, jewelry' },
  '18K': { label: '18 Karat (75.0% Pure)', ratio: 0.750, standard: 'Stone-studded jewelry' },
  '14K': { label: '14 Karat (58.3% Pure)', ratio: 0.583, standard: 'Durable, low-cost jewelry' },
  '10K': { label: '10 Karat (41.7% Pure)', ratio: 0.417, standard: 'Minimal purity, highly durable' }
};

interface ScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface BankOffer {
  name: string;
  rate: number;
  processingFee: number;
  maxLtv: number;
}

export const GoldLoanCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'estimator' | 'utility' | 'comparison' | 'market'>('estimator');

  // Live Rates & Simulated Data
  const [liveGoldRate, setLiveGoldRate] = useState(7250); // ₹ per gram 24K
  const [weight, setWeight] = useState('50');
  const [unit, setUnit] = useState<'g' | 'kg' | 'oz' | 'tolas'>('g');
  const [purity, setPurity] = useState('22K');
  const [ltv, setLtv] = useState('75'); // Loan to Value %
  const [interestRate, setInterestRate] = useState('9.5');
  const [tenure, setTenure] = useState('12'); // months
  const [repaymentType, setRepaymentType] = useState<'emi' | 'interest-only' | 'bullet'>('emi');

  // Derived outputs
  const [goldValue, setGoldValue] = useState(0);
  const [maxLoan, setMaxLoan] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  // Prepayment estimator & Foreclosure
  const [prepayMonth, setPrepayMonth] = useState('6');
  const [prepaySavings, setPrepaySavings] = useState(0);
  const [foreclosureFeeRate, setForeclosureFeeRate] = useState('1.0'); // % fee on outstanding
  const [foreclosureTotal, setForeclosureTotal] = useState(0);

  // Weight Converter State
  const [convWeight, setConvWeight] = useState('10');
  const [convFrom, setConvFrom] = useState<'g' | 'kg' | 'oz' | 'tolas'>('g');

  // Purity Checker State
  const [checkKarat, setCheckKarat] = useState('22K');
  const [checkWeight, setCheckWeight] = useState('20');
  const [checkDensity, setCheckDensity] = useState('15.5'); // g/cm³ approx

  // Pledge & Release State
  const [pledgeLoanAmount, setPledgeLoanAmount] = useState('500000'); // ₹5 Lakhs
  const [pledgeRate, setPledgeRate] = useState('11'); // % APY
  const [pledgeMonths, setPledgeMonths] = useState('8');
  const [otherFees, setOtherFees] = useState('1500');

  // Affordability State
  const [monthlyIncome, setMonthlyIncome] = useState('50000');
  const [existingEmis, setExistingEmis] = useState('5000');

  // Live Rate simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveGoldRate(prev => {
        const drift = (Math.random() - 0.5) * 15;
        return Math.round(prev + drift);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Primary calculator effects
  useEffect(() => {
    const w = parseFloat(weight);
    const rate = purity === '24K' ? liveGoldRate : (liveGoldRate * (PURITY_FACTORS[purity]?.ratio / 0.999));
    const ltvVal = parseFloat(ltv) / 100;
    const r = parseFloat(interestRate) / 12 / 100;
    const n = parseInt(tenure);

    if (isNaN(w) || isNaN(rate) || isNaN(ltvVal) || isNaN(r) || isNaN(n) || w <= 0 || rate <= 0 || n <= 0) return;

    // Weight conversion to Grams
    let weightInGrams = w;
    if (unit === 'kg') weightInGrams = w * 1000;
    if (unit === 'oz') weightInGrams = w * 31.1035;
    if (unit === 'tolas') weightInGrams = w * 11.6638;

    const value = weightInGrams * liveGoldRate * (PURITY_FACTORS[purity]?.ratio || 1.0);
    setGoldValue(value);

    const maxBorrow = value * ltvVal;
    setMaxLoan(maxBorrow);

    let monthly = 0;
    let interest = 0;
    let repayment = 0;
    const tempSchedule: ScheduleItem[] = [];
    let balance = maxBorrow;

    if (repaymentType === 'emi') {
      if (r === 0) {
        monthly = maxBorrow / n;
        repayment = maxBorrow;
        interest = 0;
      } else {
        monthly = (maxBorrow * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        repayment = monthly * n;
        interest = repayment - maxBorrow;
      }

      for (let i = 1; i <= n; i++) {
        const interestPaid = balance * r;
        const principalPaid = monthly - interestPaid;
        balance -= principalPaid;
        tempSchedule.push({
          month: i,
          payment: monthly,
          principal: principalPaid,
          interest: interestPaid,
          balance: Math.max(0, balance)
        });
      }
    } else if (repaymentType === 'interest-only') {
      monthly = maxBorrow * r;
      interest = monthly * n;
      repayment = maxBorrow + interest;

      for (let i = 1; i <= n; i++) {
        tempSchedule.push({
          month: i,
          payment: i === n ? monthly + maxBorrow : monthly,
          principal: i === n ? maxBorrow : 0,
          interest: monthly,
          balance: i === n ? 0 : maxBorrow
        });
      }
    } else {
      // Bullet Repayment (Compounds monthly)
      repayment = maxBorrow * Math.pow(1 + r, n);
      interest = repayment - maxBorrow;
      monthly = 0;

      for (let i = 1; i <= n; i++) {
        const curBal = maxBorrow * Math.pow(1 + r, i);
        tempSchedule.push({
          month: i,
          payment: i === n ? curBal : 0,
          principal: i === n ? maxBorrow : 0,
          interest: curBal - maxBorrow,
          balance: i === n ? 0 : curBal
        });
      }
    }

    setMonthlyPayment(monthly);
    setTotalInterest(interest);
    setTotalRepayment(repayment);
    setSchedule(tempSchedule);

    // Prepayment & Foreclosure Savings
    const pm = parseInt(prepayMonth);
    if (!isNaN(pm) && pm > 0 && pm < n && repaymentType === 'emi') {
      let prepayBal = maxBorrow;
      let prepayInterestTotal = 0;
      for (let i = 1; i <= pm; i++) {
        const intAmt = prepayBal * r;
        prepayInterestTotal += intAmt;
        prepayBal -= (monthly - intAmt);
      }
      
      const normalInterest = interest;
      const actualPaidInterest = prepayInterestTotal;
      setPrepaySavings(Math.max(0, normalInterest - actualPaidInterest));

      const fcFeeRate = parseFloat(foreclosureFeeRate) / 100;
      const fee = prepayBal * fcFeeRate;
      setForeclosureTotal(prepayBal + fee);
    } else {
      setPrepaySavings(0);
      setForeclosureTotal(0);
    }

    // Dynamic logger log
    if (w > 0 && (window as any).logCalculation) {
      (window as any).logCalculation(
        'Gold Loan Estimator',
        `Gold Value: ₹${Math.round(value).toLocaleString('en-IN')}, Eligible: ₹${Math.round(maxBorrow).toLocaleString('en-IN')}`
      );
    }
  }, [weight, unit, purity, liveGoldRate, ltv, interestRate, tenure, repaymentType, prepayMonth, foreclosureFeeRate]);

  // Conversions Utility
  const getConversions = () => {
    const val = parseFloat(convWeight);
    if (isNaN(val) || val <= 0) return [];
    let grams = val;
    if (convFrom === 'kg') grams = val * 1000;
    if (convFrom === 'oz') grams = val * 31.1035;
    if (convFrom === 'tolas') grams = val * 11.6638;

    return [
      { unit: 'Grams (g)', value: grams.toFixed(4) },
      { unit: 'Kilograms (kg)', value: (grams / 1000).toFixed(6) },
      { unit: 'Troy Ounces (oz)', value: (grams / 31.1035).toFixed(4) },
      { unit: 'Tolas', value: (grams / 11.6638).toFixed(4) },
      { unit: 'Sovereigns (Pavan)', value: (grams / 8).toFixed(3) }
    ];
  };

  // Karat comparisons
  const getKaratComparisonTable = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return [];
    let grams = w;
    if (unit === 'kg') grams = w * 1000;
    if (unit === 'oz') grams = w * 31.1035;
    if (unit === 'tolas') grams = w * 11.6638;

    return Object.entries(PURITY_FACTORS).map(([k, info]) => {
      const val = grams * liveGoldRate * info.ratio;
      const maxL = val * (parseFloat(ltv) / 100);
      return {
        karat: k,
        label: info.label,
        value: val,
        maxLoan: maxL,
        pricePerGram: liveGoldRate * info.ratio
      };
    });
  };

  // Financial institutions comparison (Indian Context)
  const bankOffers: BankOffer[] = [
    { name: 'State Bank of India (SBI)', rate: 8.70, processingFee: 0.5, maxLtv: 75 },
    { name: 'HDFC Bank', rate: 9.60, processingFee: 1.0, maxLtv: 75 },
    { name: 'Muthoot Finance', rate: 10.50, processingFee: 0.25, maxLtv: 80 },
    { name: 'Manappuram Finance', rate: 11.90, processingFee: 0.0, maxLtv: 85 },
    { name: 'ICICI Bank', rate: 9.25, processingFee: 0.8, maxLtv: 75 }
  ];

  // Affordability validation
  const income = parseFloat(monthlyIncome);
  const curEmis = parseFloat(existingEmis);
  const capacity = Math.max(0, income * 0.5 - curEmis); // standard 50% FOIR limit
  const estimatedEmiReq = monthlyPayment;
  const isAffordable = capacity >= estimatedEmiReq;

  // Release amount calculation
  const pLoan = parseFloat(pledgeLoanAmount);
  const pRate = parseFloat(pledgeRate) / 100;
  const pMonths = parseFloat(pledgeMonths);
  const pFees = parseFloat(otherFees);
  const accumulatedInterest = isNaN(pLoan) || isNaN(pRate) || isNaN(pMonths) ? 0 : pLoan * (pRate / 12) * pMonths;
  const totalReleaseAmount = pLoan + accumulatedInterest + (isNaN(pFees) ? 0 : pFees);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Sub Header & SEO Highlights */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }} className="text-gradient">Comprehensive Gold Loan Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Evaluate borrowing parameters, check live gold purity margins, estimate EMI amortizations, and run comparisons.
        </p>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('estimator')}
          className={`btn ${activeTab === 'estimator' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Landmark size={14} style={{ marginRight: '6px' }} /> Loan Estimator & Schedule
        </button>
        <button
          onClick={() => setActiveTab('utility')}
          className={`btn ${activeTab === 'utility' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Scale size={14} style={{ marginRight: '6px' }} /> Purity & Converter Tools
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`btn ${activeTab === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} style={{ marginRight: '6px' }} /> Banks & Compare
        </button>
        <button
          onClick={() => setActiveTab('market')}
          className={`btn ${activeTab === 'market' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <TrendingUp size={14} style={{ marginRight: '6px' }} /> Market Rates
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'estimator' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
            {/* Input Options */}
            <div className="glass-card">
              <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Landmark className="text-gradient" size={18} /> Gold Loan Estimator
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '14px' }} className="responsive-split">
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Gold Weight</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ flex: 2 }} min="0.1" step="any" />
                    <select value={unit} onChange={(e) => setUnit(e.target.value as any)} style={{ flex: 1.2 }}>
                      <option value="g">Grams (g)</option>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="oz">Troy Oz (oz)</option>
                      <option value="tolas">Tolas</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Gold Purity</label>
                  <select value={purity} onChange={(e) => setPurity(e.target.value)}>
                    {Object.keys(PURITY_FACTORS).map(k => (
                      <option key={k} value={k}>{k} - {PURITY_FACTORS[k].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
                    Live gold rate (₹/g 24K)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>₹</span>
                    <input
                      type="number"
                      value={liveGoldRate}
                      onChange={(e) => setLiveGoldRate(parseFloat(e.target.value) || 0)}
                      style={{ paddingLeft: '24px' }}
                      step="1"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>LTV Ratio (%)</label>
                  <input type="number" max="90" min="10" value={ltv} onChange={(e) => setLtv(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Interest Rate (APY %)</label>
                  <input type="number" step="0.05" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Tenure (Months)</label>
                  <input type="number" min="1" max="60" value={tenure} onChange={(e) => setTenure(e.target.value)} />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Repayment Scheme</label>
                <select value={repaymentType} onChange={(e) => setRepaymentType(e.target.value as any)}>
                  <option value="emi">Regular Monthly EMI (Principal + Interest)</option>
                  <option value="interest-only">Monthly Interest Only (Principal at maturity)</option>
                  <option value="bullet">Bullet Repayment (Full payment at maturity)</option>
                </select>
              </div>
            </div>

            {/* Results Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{ borderColor: 'var(--success)' }}>
                <h3 style={{ marginBottom: '14px', color: 'var(--success)', fontSize: '1.1rem' }}>Estimates Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Estimated Valuation:</span>
                    <strong>₹{Math.round(goldValue).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Eligible Loan ({ltv}%):</span>
                    <strong style={{ color: 'var(--success)', fontSize: '1.15rem' }}>₹{Math.round(maxLoan).toLocaleString('en-IN')}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                  {repaymentType !== 'bullet' ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>Estimated Monthly payment:</span>
                      <strong style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>₹{Math.round(monthlyPayment).toLocaleString('en-IN')}</strong>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      * Bullet scheme: No intermediate monthly payments.
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Accumulated Interest:</span>
                    <strong>₹{Math.round(totalInterest).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Total Repayment Obligation:</span>
                    <strong>₹{Math.round(totalRepayment).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>

              {/* LTV Safety Analysis */}
              <div className="glass-card" style={{ padding: '14px' }}>
                <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                  <Percent size={14} className="text-gradient" /> Loan-to-Value (LTV) Risk Meter
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Applied LTV: {ltv}%</span>
                  <span>Safety Margin: {Math.max(0, 90 - parseFloat(ltv))}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${ltv}%`, backgroundColor: parseFloat(ltv) > 80 ? 'var(--danger)' : parseFloat(ltv) > 70 ? '#f59e0b' : 'var(--success)' }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {parseFloat(ltv) > 80 
                    ? '⚠️ Risk warning: LTV values above 80% are high-risk. Changes in market rates can lead to margin calls or immediate foreclosure.' 
                    : '🛡️ Conservative parameters: LTV ranges below 75% offer lower interest rates and safety against volatility.'}
                </p>
              </div>
            </div>
          </div>

          {/* Forepayment Savings estimator */}
          {repaymentType === 'emi' && (
            <div className="glass-card">
              <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                <TrendingUp size={16} className="text-gradient" /> Prepayment & Foreclosure Calculator
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Foreclose Loan after (Months):</label>
                    <input
                      type="number"
                      min="1"
                      max={parseInt(tenure) - 1 || 1}
                      value={prepayMonth}
                      onChange={(e) => setPrepayMonth(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Foreclosure Charge / Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={foreclosureFeeRate}
                      onChange={(e) => setForeclosureFeeRate(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Estimated Interest Saved:</span>
                    <strong style={{ color: 'var(--success)' }}>₹{Math.round(prepaySavings).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Pledge Release Payment required:</span>
                    <strong>₹{Math.round(foreclosureTotal).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Repayment Amortization Schedule */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Table size={16} className="text-gradient" /> Repayment Amortization Schedule
            </h3>
            <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Month</th>
                    <th style={{ padding: '8px' }}>Installment</th>
                    <th style={{ padding: '8px' }}>Principal Component</th>
                    <th style={{ padding: '8px' }}>Interest Component</th>
                    <th style={{ padding: '8px' }}>Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row => (
                    <tr key={row.month} style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>
                      <td style={{ padding: '8px', textAlign: 'left' }}>Month {row.month}</td>
                      <td style={{ padding: '8px' }}>₹{Math.round(row.payment).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px' }}>₹{Math.round(row.principal).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px' }}>₹{Math.round(row.interest).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px' }}>₹{Math.round(row.balance).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'utility' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
          
          {/* Gold Weight Converter */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <RefreshCw size={16} className="text-gradient" /> Gold Weight Converter
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Enter Weight</label>
                <input type="number" value={convWeight} onChange={(e) => setConvWeight(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Convert From</label>
                <select value={convFrom} onChange={(e) => setConvFrom(e.target.value as any)}>
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="oz">Troy Ounce (oz)</option>
                  <option value="tolas">Tolas</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              {getConversions().map(c => (
                <div key={c.unit} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>{c.unit}:</span>
                  <strong>{c.value}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Purity & Authentic Density Checker */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Scale size={16} className="text-gradient" /> Purity & Density Checker
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Claimed Karat</label>
                <select value={checkKarat} onChange={(e) => setCheckKarat(e.target.value)}>
                  {Object.keys(PURITY_FACTORS).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Measured Weight (g)</label>
                <input type="number" value={checkWeight} onChange={(e) => setCheckWeight(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>
                Water Displacement Volume (cm³ / ml)
              </label>
              <input 
                type="number" 
                step="0.01"
                placeholder="Volume to test density"
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  const w = parseFloat(checkWeight);
                  if (vol > 0 && w > 0) {
                    setCheckDensity((w / vol).toFixed(2));
                  }
                }}
              />
            </div>
            <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Calculated Density:</span>
                <strong>{checkDensity} g/cm³</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Gold content percentage:</span>
                <strong>{(PURITY_FACTORS[checkKarat]?.ratio * 100).toFixed(1)}%</strong>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '6px' }}>
                * Standard densities: 24K: ~19.3 g/cm³, 22K: ~15.6 g/cm³, 18K: ~15.2 g/cm³. If density is significantly lower, it may contain heavy metals.
              </p>
            </div>
          </div>

          {/* Release / Pledge Value Estimator */}
          <div className="glass-card" style={{ gridColumn: 'span 2' }}>
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Info size={16} className="text-gradient" /> Gold Pledge & Release Calculator
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="responsive-split">
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Original Loan Amount (₹)</label>
                  <input type="number" value={pledgeLoanAmount} onChange={(e) => setPledgeLoanAmount(e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Interest Rate (%)</label>
                    <input type="number" value={pledgeRate} onChange={(e) => setPledgeRate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Months Elapsed</label>
                    <input type="number" value={pledgeMonths} onChange={(e) => setPledgeMonths(e.target.value)} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Additional Processing Fees / Penalties (₹)</label>
                  <input type="number" value={otherFees} onChange={(e) => setOtherFees(e.target.value)} />
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Accumulated Interest:</span>
                    <strong>₹{Math.round(accumulatedInterest).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <span>Total Settlement / Release Cost:</span>
                    <strong style={{ color: 'var(--success)' }}>₹{Math.round(totalReleaseAmount).toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Institutional Loan Comparison */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Landmark size={16} className="text-gradient" /> Gold Loan Institutional Comparison Tool
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Institution Name</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Interest Rate (APY)</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Processing Fee</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Max LTV Limit</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Estimated EMI</th>
                  </tr>
                </thead>
                <tbody>
                  {bankOffers.map(offer => {
                    const r = offer.rate / 12 / 100;
                    const n = parseInt(tenure) || 12;
                    const ltvVal = offer.maxLtv / 100;
                    const eligibleVal = goldValue * ltvVal;
                    const estEmi = (eligibleVal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

                    return (
                      <tr key={offer.name} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{offer.name}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: 'var(--accent-primary)' }}>{offer.rate.toFixed(2)}%</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{offer.processingFee}%</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{offer.maxLtv}%</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                          ₹{Math.round(estEmi).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Affordability Matrix */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <ShieldAlert size={16} className="text-gradient" /> Gold Loan Affordability Checker
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Monthly Net Salary (₹)</label>
                    <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Other Monthly EMIs (₹)</label>
                    <input type="number" value={existingEmis} onChange={(e) => setExistingEmis(e.target.value)} />
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Banks generally enforce a Fixed Obligation to Income Ratio (FOIR) limit of 50%. Your maximum allowed monthly EMI capacity is calculated based on this limit.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center', background: isAffordable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${isAffordable ? 'var(--success)' : 'var(--danger)'}` }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isAffordable ? 'var(--success)' : 'var(--danger)' }}>
                    {isAffordable ? '✔️ Affordable' : '⚠️ Over-leveraged'}
                  </div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                    Allowed Capacity: ₹{Math.round(capacity).toLocaleString('en-IN')} / month vs Required EMI: ₹{Math.round(estimatedEmiReq).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment vs Loan Comparison Info */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Gold Investment vs Gold Loan Comparison</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="responsive-split">
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '6px' }}>Gold Loan Benefits</h4>
                <ul style={{ fontSize: '0.75rem', paddingLeft: '14px', lineHeight: '1.4' }}>
                  <li>Retain physical gold ownership upon full repayment.</li>
                  <li>Lower interest rate compared to unsecured personal loans.</li>
                  <li>Minimal documentation and instant disbursal.</li>
                </ul>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '6px' }}>Gold Mutual Funds / SGBs</h4>
                <ul style={{ fontSize: '0.75rem', paddingLeft: '14px', lineHeight: '1.4' }}>
                  <li>Earn interest (e.g. 2.5% on Sovereign Gold Bonds) while values grow.</li>
                  <li>No safety deposit locker fees or maintenance overheads.</li>
                  <li>Highly liquid, but cannot be leveraged instantly as collaterals.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'market' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Price Index Comparison per Karat */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Scale size={16} className="text-gradient" /> Valuation Index per Purity
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Karat Purity</th>
                    <th style={{ padding: '8px' }}>Standard Applications</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Price per Gram</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Total Asset Value</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Pledge Limit ({ltv}% LTV)</th>
                  </tr>
                </thead>
                <tbody>
                  {getKaratComparisonTable().map(row => (
                    <tr key={row.karat} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{row.karat}</td>
                      <td style={{ padding: '8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {PURITY_FACTORS[row.karat]?.standard}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>₹{Math.round(row.pricePerGram).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>₹{Math.round(row.value).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                        ₹{Math.round(row.maxLoan).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Price Trend (Simulated Interactive SVG) */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <TrendingUp size={16} className="text-gradient" /> Gold Rate Historical 7-Day Trend (24K Gold)
            </h3>
            <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              {/* Simulated Chart */}
              <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                <svg viewBox="0 0 500 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="4" />
                  {/* Line Path */}
                  <path
                    d={`M 0,65 L 80,68 L 160,55 L 240,62 L 320,40 L 400,45 L 500,${100 - ((liveGoldRate - 7000) / 10)}`}
                    fill="none"
                    stroke="var(--accent-primary)"
                    strokeWidth="2.5"
                  />
                  {/* Labels */}
                  <text x="5" y="15" fill="var(--text-muted)" fontSize="8">₹7,400</text>
                  <text x="5" y="48" fill="var(--text-muted)" fontSize="8">₹7,200</text>
                  <text x="5" y="78" fill="var(--text-muted)" fontSize="8">₹7,000</text>
                  
                  <text x="0" y="96" fill="var(--text-muted)" fontSize="8">Mon</text>
                  <text x="80" y="96" fill="var(--text-muted)" fontSize="8">Tue</text>
                  <text x="160" y="96" fill="var(--text-muted)" fontSize="8">Wed</text>
                  <text x="240" y="96" fill="var(--text-muted)" fontSize="8">Thu</text>
                  <text x="320" y="96" fill="var(--text-muted)" fontSize="8">Fri</text>
                  <text x="400" y="96" fill="var(--text-muted)" fontSize="8">Sat</text>
                  <text x="475" y="96" fill="var(--text-muted)" fontSize="8">Today</text>
                </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem' }}>
                <span>Simulated live exchange reference feed</span>
                <strong style={{ color: 'var(--success)' }}>Current Live: ₹{liveGoldRate.toLocaleString('en-IN')}/g</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
