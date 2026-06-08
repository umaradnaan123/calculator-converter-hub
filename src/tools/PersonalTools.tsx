import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Hourglass } from 'lucide-react';

export const PregnancyDueDate: React.FC = () => {
  const [lmp, setLmp] = useState('2026-01-01');
  const [cycle, setCycle] = useState('28');
  const [dueDate, setDueDate] = useState('');
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (!lmp) return;
    const lmpDate = new Date(lmp);
    const cycleDays = parseInt(cycle) || 28;

    // Naegele's rule adjusted: Due Date = LMP + 280 days + (cycle - 28)
    const offset = 280 + (cycleDays - 28);
    const due = new Date(lmpDate.getTime() + (offset * 24 * 60 * 60 * 1000));
    setDueDate(due.toDateString());

    const now = new Date();
    const diff = due.getTime() - now.getTime();
    setDaysRemaining(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, [lmp, cycle]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar className="text-gradient" /> Pregnancy Due Date Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>First Day of Last Period (LMP)</label>
            <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Average Cycle Length (Days)</label>
            <input type="number" value={cycle} onChange={(e) => setCycle(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated Delivery Date</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '8px 0' }}>{dueDate}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Countdown: <strong>{daysRemaining} Days</strong></div>
        </div>
      </div>
    </div>
  );
};

export const OvulationCalculator: React.FC = () => {
  const [lmp, setLmp] = useState('2026-06-01');
  const [cycle, setCycle] = useState('28');
  const [ovulationDate, setOvulationDate] = useState('');
  const [fertilityStart, setFertilityStart] = useState('');
  const [fertilityEnd, setFertilityEnd] = useState('');

  useEffect(() => {
    if (!lmp) return;
    const lmpDate = new Date(lmp);
    const cycleDays = parseInt(cycle) || 28;

    // Ovulation occurs approx 14 days before next period: LMP + cycle - 14
    const ovOffset = cycleDays - 14;
    const ov = new Date(lmpDate.getTime() + (ovOffset * 24 * 60 * 60 * 1000));
    setOvulationDate(ov.toDateString());

    // Fertile window starts 5 days before ovulation and ends 1 day after
    const fStart = new Date(ov.getTime() - (5 * 24 * 60 * 60 * 1000));
    const fEnd = new Date(ov.getTime() + (1 * 24 * 60 * 60 * 1000));
    
    setFertilityStart(fStart.toDateString());
    setFertilityEnd(fEnd.toDateString());
  }, [lmp, cycle]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Heart className="text-gradient" /> Fertility & Ovulation Calendar
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>First Day of Last Period</label>
            <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Average Cycle Length (Days)</label>
            <input type="number" value={cycle} onChange={(e) => setCycle(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <div>Estimated Ovulation Day: <strong style={{ color: 'var(--accent-primary)' }}>{ovulationDate}</strong></div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
          <div>High Fertility Window: <br /><strong style={{ color: 'var(--success)' }}>{fertilityStart}</strong> to <strong style={{ color: 'var(--success)' }}>{fertilityEnd}</strong></div>
        </div>
      </div>
    </div>
  );
};

export const LifeExpectancy: React.FC = () => {
  const [gender, setGender] = useState('female');
  const [smoker, setSmoker] = useState('no');
  const [exercise, setExercise] = useState('yes');
  const [span, setSpan] = useState(80);

  useEffect(() => {
    // Basic baseline
    let base = gender === 'female' ? 82 : 77;
    
    if (smoker === 'yes') base -= 10;
    if (exercise === 'yes') base += 5;
    
    setSpan(base);
  }, [gender, smoker, exercise]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Hourglass className="text-gradient" /> Longevity Estimator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Biological Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Active Smoker?</label>
            <select value={smoker} onChange={(e) => setSmoker(e.target.value)}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.8rem' }}>Regular Exercise (150m+ / week)?</label>
            <select value={exercise} onChange={(e) => setExercise(e.target.value)}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Projected Life Expectancy</div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>{span} Years</div>
        </div>
      </div>
    </div>
  );
};
