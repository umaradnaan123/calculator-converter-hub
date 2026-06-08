import React, { useState, useEffect } from 'react';
import { Compass, Flame, Dumbbell, Activity } from 'lucide-react';

export const RunningPace: React.FC = () => {
  const [distance, setDistance] = useState('5'); // km
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('25');
  const [seconds, setSeconds] = useState('00');
  const [pace, setPace] = useState('');

  useEffect(() => {
    const d = parseFloat(distance);
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    if (isNaN(d) || d <= 0) return;

    const totalSeconds = (h * 3600) + (m * 60) + s;
    if (totalSeconds <= 0) return;

    const secondsPerKm = totalSeconds / d;
    const paceMin = Math.floor(secondsPerKm / 60);
    const paceSec = Math.round(secondsPerKm % 60);

    setPace(`${paceMin}:${paceSec.toString().padStart(2, '0')} / km`);
  }, [distance, hours, minutes, seconds]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass className="text-gradient" /> Running Pace Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Distance (km)</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Hours</label>
              <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Mins</label>
              <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Secs</label>
              <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Required Average Pace</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>{pace}</div>
        </div>
      </div>
    </div>
  );
};

export const WorkoutCalorie: React.FC = () => {
  const [weight, setWeight] = useState('70'); // kg
  const [duration, setDuration] = useState('45'); // mins
  const [activity, setActivity] = useState('7.0'); // MET value: default Running slow
  const [burned, setBurned] = useState('0');

  useEffect(() => {
    const w = parseFloat(weight);
    const d = parseFloat(duration);
    const met = parseFloat(activity);

    if (isNaN(w) || isNaN(d) || isNaN(met) || w <= 0 || d <= 0) return;

    // Formula: Calorie = Duration * (MET * 3.5 * weight) / 200
    const cal = d * (met * 3.5 * w) / 200;
    setBurned(cal.toFixed(0));
  }, [weight, duration, activity]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flame className="text-gradient" /> Workout Calorie Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Duration (Mins)</label>
              <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Select Exercise Activity</label>
            <select value={activity} onChange={(e) => setActivity(e.target.value)}>
              <option value="7.0">🏃 Running (Slow / Jogging)</option>
              <option value="9.8">🏃 Running (Fast / Sprint)</option>
              <option value="8.0">🚴 Cycling (Moderate Effort)</option>
              <option value="5.8">🏊 Swimming (Laps, light)</option>
              <option value="6.0">🏋️ Weightlifting (Vigorous)</option>
              <option value="3.0">🧘 Yoga / Pilates</option>
            </select>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Calories Burned</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)', marginTop: '8px' }}>{burned} kcal</div>
        </div>
      </div>
    </div>
  );
};

export const OneRepMax: React.FC = () => {
  const [weight, setWeight] = useState('80');
  const [reps, setReps] = useState('5');
  const [orm, setOrm] = useState('0');

  useEffect(() => {
    const w = parseFloat(weight);
    const r = parseFloat(reps);

    if (isNaN(w) || isNaN(r) || w <= 0 || r <= 0) return;

    // Epley Formula: 1RM = w * (1 + r / 30)
    const maxVal = w * (1 + r / 30);
    setOrm(maxVal.toFixed(1));
  }, [weight, reps]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Dumbbell className="text-gradient" /> One Rep Max Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Weight Lifted (kg / lbs)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Repetitions Performed</label>
            <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated 1-Rep Max</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>{orm}</div>
        </div>
      </div>
    </div>
  );
};

export const ProteinIntake: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [goal, setGoal] = useState('1.6'); // metric factor
  const [gramsNeeded, setGramsNeeded] = useState('0');

  useEffect(() => {
    const w = parseFloat(weight);
    const factor = parseFloat(goal);

    if (isNaN(w) || isNaN(factor) || w <= 0) return;

    setGramsNeeded((w * factor).toFixed(0));
  }, [weight, goal]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity className="text-gradient" /> Protein Intake Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Body Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Fitness Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="0.8">🛋️ Sedentary (General Health)</option>
              <option value="1.3">🏃 Endurance / Active</option>
              <option value="1.8">🏋️ Hypertrophy / Muscle Gain</option>
              <option value="2.2">💪 Athletic Training (High intensity)</option>
            </select>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Daily Protein Target</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)', marginTop: '8px' }}>{gramsNeeded} g</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Distribute across 3-5 meals.</div>
        </div>
      </div>
    </div>
  );
};
