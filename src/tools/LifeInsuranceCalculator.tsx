import React, { useState, useEffect } from 'react';
import { Landmark, Shield, Users, TrendingUp, Table, Percent, Activity, Info } from 'lucide-react';

interface PremiumComparisonRow {
  age: number;
  premium: number;
}

export const LifeInsuranceCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'needs' | 'term' | 'goals' | 'comparison'>('needs');

  // Input states (Indian Context Defaults)
  const [age, setAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [income, setIncome] = useState('900000'); // ₹9 Lakhs annual salary
  const [expenses, setExpenses] = useState('30000'); // ₹30,000 monthly
  const [dependents, setDependents] = useState('3');
  const [savings, setSavings] = useState('500000'); // ₹5 Lakhs savings
  const [debts, setDebts] = useState('1500000'); // ₹15 Lakhs home loan
  const [inflation, setInflation] = useState('6'); // 6% Indian average inflation

  // Goals Planning States (Indian Context)
  const [childEdCost, setChildEdCost] = useState('1000000'); // ₹10 Lakhs college cost
  const [childEdYears, setChildEdYears] = useState('12');
  const [marriageCost, setMarriageCost] = useState('500000'); // ₹5 Lakhs marriage budget
  const [marriageYears, setMarriageYears] = useState('15');

  // Term Calculator state (Indian Rupees)
  const [termCoverage, setTermCoverage] = useState('10000000'); // ₹1 Crore standard term plan
  const [termDuration, setTermDuration] = useState('20'); // years
  const [isSmoker, setIsSmoker] = useState(false);
  const [healthClass, setHealthClass] = useState<'preferred_plus' | 'preferred' | 'standard' | 'substandard'>('standard');

  // Existing insurance cover
  const [existingCover, setExistingCover] = useState('1000000'); // ₹10 Lakhs existing

  // Output derived states
  const [hlvValue, setHlvValue] = useState(0);
  const [incomeReplacement, setIncomeReplacement] = useState(0);
  const [familyProtection, setFamilyProtection] = useState(0);
  const [totalNeeds, setTotalNeeds] = useState(0);
  const [premiumEstimation, setPremiumEstimation] = useState(0);
  const [gapAmount, setGapAmount] = useState(0);
  const [securityScore, setSecurityScore] = useState(0);

  // Advanced Goal projections
  const [projChildEd, setProjChildEd] = useState(0);
  const [projMarriage, setProjMarriage] = useState(0);
  const [projRetirementCorpus, setProjRetirementCorpus] = useState(0);

  // Recalculations
  useEffect(() => {
    const a = parseFloat(age);
    const ret = parseFloat(retirementAge);
    const inc = parseFloat(income);
    const exp = parseFloat(expenses) * 12;
    const dep = parseFloat(dependents);
    const sav = parseFloat(savings);
    const dbt = parseFloat(debts);
    const inf = parseFloat(inflation) / 100;

    if (isNaN(a) || isNaN(ret) || isNaN(inc) || isNaN(exp) || isNaN(dep) || isNaN(sav) || isNaN(dbt) || isNaN(inf)) return;

    // Working years
    const workingYears = Math.max(0, ret - a);

    // 1. Human Life Value (HLV)
    const discountRate = 0.085; // Indian G-Sec / Equity yield expectation average
    const netDiscount = discountRate - inf;
    let hlv = 0;
    if (netDiscount <= 0) {
      hlv = inc * workingYears;
    } else {
      hlv = inc * ((1 - Math.pow(1 + netDiscount, -workingYears)) / netDiscount);
    }
    setHlvValue(hlv);

    // 2. Income Replacement Need
    const replaceYears = Math.max(10, dep * 5);
    let replacement = 0;
    if (inf <= 0) {
      replacement = inc * replaceYears;
    } else {
      replacement = inc * ((Math.pow(1 + inf, replaceYears) - 1) / inf);
    }
    setIncomeReplacement(replacement);

    // 3. Goal projections
    const edC = parseFloat(childEdCost);
    const edY = parseFloat(childEdYears);
    const marC = parseFloat(marriageCost);
    const marY = parseFloat(marriageYears);

    const projEd = isNaN(edC) || isNaN(edY) ? 0 : edC * Math.pow(1 + inf, edY);
    const projMar = isNaN(marC) || isNaN(marY) ? 0 : marC * Math.pow(1 + inf, marY);
    
    // Retirement spouse corpus protection
    const projSpouseRetireCost = exp * Math.pow(1 + inf, workingYears);
    const retireCorpus = projSpouseRetireCost * 15;

    setProjChildEd(projEd);
    setProjMarriage(projMar);
    setProjRetirementCorpus(retireCorpus);

    // 4. Family Protection Needs
    const emergencyFund = exp * 0.5; // 6 months of expenses
    const protection = dbt + projEd + projMar + retireCorpus + emergencyFund - sav;
    setFamilyProtection(Math.max(0, protection));

    // 5. Total Recommended Insurance Coverage
    const recNeeds = Math.max(hlv, replacement + dbt + projEd + projMar - sav);
    setTotalNeeds(recNeeds);

    // 6. Insurance Gap Analysis
    const exC = parseFloat(existingCover) || 0;
    const gap = Math.max(0, recNeeds - exC);
    setGapAmount(gap);

    // 7. Family Security Score
    let score = 0;
    if (recNeeds > 0) {
      score = Math.min(100, Math.round((exC / recNeeds) * 100));
    } else {
      score = 100;
    }
    setSecurityScore(score);

    // Dynamic logger log
    if (inc > 0 && (window as any).logCalculation) {
      (window as any).logCalculation(
        'Life Insurance Analyzer',
        `Recommended Cover: ₹${Math.round(recNeeds).toLocaleString('en-IN')}, Gap: ₹${Math.round(gap).toLocaleString('en-IN')}`
      );
    }
  }, [age, retirementAge, income, expenses, dependents, savings, debts, inflation, childEdCost, childEdYears, marriageCost, marriageYears, existingCover]);

  // Premium computation (actuarial estimation in INR)
  useEffect(() => {
    const cov = parseFloat(termCoverage);
    const dur = parseFloat(termDuration);
    const a = parseFloat(age);

    if (isNaN(cov) || isNaN(dur) || isNaN(a)) return;

    // Base annual rate per ₹1,00,000 of coverage for age 20 is approx ₹65 (Indian market standard)
    let baseRate = 65;
    
    const ageDiff = Math.max(0, a - 20);
    baseRate = baseRate * Math.pow(1.045, ageDiff);

    if (dur > 20) baseRate *= 1.25;
    else if (dur > 10) baseRate *= 1.1;

    let multiplier = 1.0;
    if (isSmoker) multiplier *= 1.85;

    if (healthClass === 'preferred_plus') multiplier *= 0.8;
    else if (healthClass === 'preferred') multiplier *= 0.9;
    else if (healthClass === 'substandard') multiplier *= 1.35;

    const annualPremium = (cov / 100000) * baseRate * multiplier;
    setPremiumEstimation(annualPremium);
  }, [termCoverage, termDuration, isSmoker, healthClass, age]);

  const getAgeComparisonData = (): PremiumComparisonRow[] => {
    const cov = parseFloat(termCoverage);
    const dur = parseFloat(termDuration);
    if (isNaN(cov) || isNaN(dur)) return [];

    const ages = [25, 30, 35, 40, 45, 50, 55];
    return ages.map(currAge => {
      let baseRate = 65;
      const ageDiff = Math.max(0, currAge - 20);
      baseRate = baseRate * Math.pow(1.045, ageDiff);

      if (dur > 20) baseRate *= 1.25;
      else if (dur > 10) baseRate *= 1.1;

      let multiplier = 1.0;
      if (isSmoker) multiplier *= 1.85;
      if (healthClass === 'preferred_plus') multiplier *= 0.8;
      if (healthClass === 'preferred') multiplier *= 0.9;
      if (healthClass === 'substandard') multiplier *= 1.35;

      return {
        age: currAge,
        premium: (cov / 100000) * baseRate * multiplier
      };
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title & SEO Description */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }} className="text-gradient">Enhanced Life Insurance & Wealth Protection Hub</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Evaluate HLV parameters, income replacements, term policies, future goal protection plans, and family safety index ratings.
        </p>
      </div>

      {/* Tabs Menu */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('needs')}
          className={`btn ${activeTab === 'needs' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Shield size={14} style={{ marginRight: '6px' }} /> Needs & HLV Analyzer
        </button>
        <button
          onClick={() => setActiveTab('term')}
          className={`btn ${activeTab === 'term' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Landmark size={14} style={{ marginRight: '6px' }} /> Term Premium Estimator
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`btn ${activeTab === 'goals' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <TrendingUp size={14} style={{ marginRight: '6px' }} /> Goal Protection Planner
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`btn ${activeTab === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Table size={14} style={{ marginRight: '6px' }} /> Policy Comparisons
        </button>
      </div>

      {/* Main Grid View */}
      {activeTab === 'needs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
            {/* Input Parameters Panel */}
            <div className="glass-card">
              <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users className="text-gradient" size={18} /> Financial Profile & Dependents
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Current Age</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="18" max="75" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Retirement Age</label>
                  <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} min="40" max="85" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Annual Income (₹)</label>
                  <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Monthly Expenses (₹)</label>
                  <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '14px' }} className="responsive-split">
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Liquid Savings & Investments (₹)</label>
                  <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Outstanding Loans & Debts (₹)</label>
                  <input type="number" value={debts} onChange={(e) => setDebts(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '14px' }} className="responsive-split">
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Number of Dependents</label>
                  <input type="number" value={dependents} onChange={(e) => setDependents(e.target.value)} min="0" max="10" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Inflation Rate (%)</label>
                  <input type="number" value={inflation} onChange={(e) => setInflation(e.target.value)} step="0.5" />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Existing Life Insurance Coverage (₹)</label>
                <input type="number" value={existingCover} onChange={(e) => setExistingCover(e.target.value)} />
              </div>
            </div>

            {/* Coverage Summary sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{ borderColor: 'var(--success)' }}>
                <h3 style={{ marginBottom: '14px', color: 'var(--success)', fontSize: '1.1rem' }}>Coverage Recommendations</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Human Life Value (HLV):</span>
                    <strong>₹{Math.round(hlvValue).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Income Replacement Needed:</span>
                    <strong>₹{Math.round(incomeReplacement).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Family Protection Needs:</span>
                    <strong>₹{Math.round(familyProtection).toLocaleString('en-IN')}</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Ideal Protection Required:</span>
                    <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
                      ₹{Math.round(totalNeeds).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Insurance Gap to Buy:</span>
                    <strong style={{ color: gapAmount > 0 ? 'var(--danger)' : 'var(--success)', fontSize: '1.1rem' }}>
                      ₹{Math.round(gapAmount).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Family Security Index */}
              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                  <Activity size={16} className="text-gradient" /> Family Security Index Score
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Coverage Met: {securityScore}%</span>
                  <span>Target: 100%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${securityScore}%`, backgroundColor: securityScore >= 80 ? 'var(--success)' : securityScore >= 50 ? '#f59e0b' : 'var(--danger)' }} />
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {securityScore === 100 
                    ? '🛡️ Excellent: Your assets and dependents are fully protected against unexpected risks.' 
                    : securityScore >= 50 
                      ? '⚠️ Moderate Protection: Your existing coverage covers basic expenses but leaves child education or debts vulnerable.'
                      : '🚨 High Exposure: Critical gaps exist. Your current coverage is insufficient to replace income or clear debts.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick recommendations details */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>Personalized Coverage Gap Analysis</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }} className="responsive-split">
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={14} className="text-gradient" /> Human Life Value (HLV)
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  HLV represents the financial loss your family would suffer without your income, adjusted for working tenure and standard inflation rates.
                </p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={14} className="text-gradient" /> Income Replacement
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Measures the capital required to supply equivalent monthly budgets to dependents until children complete education.
                </p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={14} className="text-gradient" /> Debt & Goals Coverage
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Provides buffer security to clear all home or vehicle loans immediately, preventing asset repossessions in event of claims.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'term' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
            {/* Term Premium inputs */}
            <div className="glass-card">
              <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Landmark className="text-gradient" size={18} /> Term Premium Estimator
              </h3>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Desired Sum Assured (Coverage Amount)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={termCoverage}
                    onChange={(e) => setTermCoverage(e.target.value)}
                    step="500000"
                  />
                  <select
                    value={termCoverage}
                    onChange={(e) => setTermCoverage(e.target.value)}
                    style={{ flex: 0.5 }}
                  >
                    <option value="5000000">₹50 Lakhs</option>
                    <option value="10000000">₹1 Crore</option>
                    <option value="20000000">₹2 Crores</option>
                    <option value="50000000">₹5 Crores</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Policy Tenure (Years)</label>
                  <select value={termDuration} onChange={(e) => setTermDuration(e.target.value)}>
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                    <option value="20">20 Years</option>
                    <option value="25">25 Years</option>
                    <option value="30">30 Years</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Health Profile Rating</label>
                  <select value={healthClass} onChange={(e) => setHealthClass(e.target.value as any)}>
                    <option value="preferred_plus">Preferred Plus (Super Healthy)</option>
                    <option value="preferred">Preferred (Very Healthy)</option>
                    <option value="standard">Standard (Average)</option>
                    <option value="substandard">Substandard (Existing issues)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input
                    type="checkbox"
                    checked={isSmoker}
                    onChange={(e) => setIsSmoker(e.target.checked)}
                  />
                  <span>User has consumed tobacco/nicotine in last 12 months (Smoker status)</span>
                </label>
              </div>
            </div>

            {/* Premium Results Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{ borderColor: 'var(--accent-primary)', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '12px', fontSize: '1.05rem', color: 'var(--accent-primary)' }}>Estimated Premium Quotes</h3>
                <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--success)' }}>
                  ₹{Math.round(premiumEstimation).toLocaleString('en-IN')}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}> / year</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '8px' }}>
                  ₹{Math.round((premiumEstimation / 12) * 1.05).toLocaleString('en-IN')}
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}> / month</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                  * Estimated rates derived using actuarial age benchmarks and profile parameters. Actual premiums will vary based on underwriting medical checks.
                </p>
              </div>
            </div>
          </div>

          {/* Age based comparison grid */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <Table size={16} className="text-gradient" /> Age-based Premium Cost Trajectory
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Age Bracket</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Annual Cost</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Monthly Payment Equivalent</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Saving by Locking Rate Early</th>
                  </tr>
                </thead>
                <tbody>
                  {getAgeComparisonData().map(row => {
                    const diff = Math.max(0, row.premium - getAgeComparisonData()[0].premium);
                    return (
                      <tr key={row.age} style={{ borderBottom: '1px solid var(--border-color)', background: row.age === parseInt(age) ? 'rgba(var(--accent-primary-rgb), 0.05)' : 'transparent' }}>
                        <td style={{ padding: '8px', fontWeight: row.age === parseInt(age) ? 'bold' : 'normal' }}>
                          Age {row.age} {row.age === parseInt(age) ? '(Current)' : ''}
                        </td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>₹{Math.round(row.premium).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>₹{Math.round((row.premium / 12) * 1.05).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '8px', textAlign: 'right', color: diff > 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {diff > 0 ? `+${Math.round((diff / row.premium) * 100)}% cost penalty` : 'Base Tier (Max Savings)'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'goals' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
          
          {/* Goals Parameter Card */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp className="text-gradient" size={18} /> Goal Protection Target Setup
            </h3>
            
            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--accent-primary)' }}>Child Higher Education</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '18px' }} className="responsive-split">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Current College Cost (₹)</label>
                <input type="number" value={childEdCost} onChange={(e) => setChildEdCost(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Years to College</label>
                <input type="number" value={childEdYears} onChange={(e) => setChildEdYears(e.target.value)} min="1" max="25" />
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--accent-primary)' }}>Family Future Events (Marriage etc)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '15px', marginBottom: '18px' }} className="responsive-split">
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Current Marriage Budget (₹)</label>
                <input type="number" value={marriageCost} onChange={(e) => setMarriageCost(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Years to Event</label>
                <input type="number" value={marriageYears} onChange={(e) => setMarriageYears(e.target.value)} min="1" max="25" />
              </div>
            </div>
          </div>

          {/* Goals Output Calculations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-card" style={{ borderColor: 'var(--success)' }}>
              <h3 style={{ marginBottom: '14px', color: 'var(--success)', fontSize: '1.1rem' }}>Inflation-Adjusted Target Projections</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Future College Requirement:</span>
                  <strong>₹{Math.round(projChildEd).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Future Marriage Obligation:</span>
                  <strong>₹{Math.round(projMarriage).toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>Retirement Spouse Corpus:</span>
                  <strong>₹{Math.round(projRetirementCorpus).toLocaleString('en-IN')}</strong>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <span>Net Goal Protections Sum:</span>
                  <strong style={{ color: 'var(--success)' }}>
                    ₹{Math.round(projChildEd + projMarriage + projRetirementCorpus).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <h4 style={{ marginBottom: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Percent size={14} className="text-gradient" /> Inflation Drag Index
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                At {inflation}% inflation, your goal budgets will compound significantly. For example, a college budget of ₹{parseFloat(childEdCost).toLocaleString('en-IN')} today will require ₹{Math.round(projChildEd).toLocaleString('en-IN')} in {childEdYears} years. Ensure your policy covers the inflation-adjusted future values!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Whole Life vs Term table */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '14px', fontSize: '1.1rem' }}>Product Categories Comparison Matrix</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Policy Class</th>
                    <th style={{ padding: '8px' }}>Premium Burden</th>
                    <th style={{ padding: '8px' }}>Maturity Return</th>
                    <th style={{ padding: '8px' }}>Asset Type</th>
                    <th style={{ padding: '8px' }}>Suitability Profile</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Term Insurance</td>
                    <td style={{ padding: '8px', color: 'var(--success)' }}>Extremely Low</td>
                    <td style={{ padding: '8px' }}>Zero (Unless ROP chosen)</td>
                    <td style={{ padding: '8px' }}>Pure Protection</td>
                    <td style={{ padding: '8px' }}>Income Replacement, Debt protection</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Whole Life</td>
                    <td style={{ padding: '8px', color: 'var(--danger)' }}>Very High</td>
                    <td style={{ padding: '8px' }}>Guaranteed Cash Value + Bonus</td>
                    <td style={{ padding: '8px' }}>Protection + Savings</td>
                    <td style={{ padding: '8px' }}>Estate planning, lifelong wealth transfer</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>ULIP (Unit Linked)</td>
                    <td style={{ padding: '8px', color: '#f59e0b' }}>Moderate to High</td>
                    <td style={{ padding: '8px' }}>Market Linked Equity/Debt Returns</td>
                    <td style={{ padding: '8px' }}>Protection + Investment</td>
                    <td style={{ padding: '8px' }}>Tax-efficient market equity compounding</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Endowment Policy</td>
                    <td style={{ padding: '8px', color: 'var(--danger)' }}>High</td>
                    <td style={{ padding: '8px' }}>Guaranteed maturity amount</td>
                    <td style={{ padding: '8px' }}>Fixed Savings</td>
                    <td style={{ padding: '8px' }}>Risk-averse long term savers</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Actuarial Advice Card */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <h3 style={{ marginBottom: '10px', fontSize: '1.05rem' }}>Actuarial Suggestion Dashboard</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              For standard wealth protection, we strongly suggest choosing a **Pure Term Insurance Policy** corresponding to your total coverage gap (₹{Math.round(gapAmount).toLocaleString('en-IN')}). Combining investment and insurance (like ULIPs or Endowments) often yields lower yields (4-6% p.a.) compared to investing in index funds and purchasing a term plan separately (the "Buy Term and Invest the Difference" philosophy).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
