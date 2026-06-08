import React, { useState, useEffect } from 'react';
import { Activity, Heart, Droplet } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [bmi, setBmi] = useState<any>(null);

  const calculateBmi = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return;

    const bmiVal = w / (h * h);
    let category = '';
    let color = '';
    let advice = '';

    if (bmiVal < 18.5) {
      category = 'Underweight';
      color = 'var(--info)';
      advice = 'Consider a high-protein diet and strength training to build muscle mass safely.';
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      category = 'Normal Weight';
      color = 'var(--success)';
      advice = 'Excellent! Keep maintaining your balanced diet and regular physical activity.';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      category = 'Overweight';
      color = 'var(--warning)';
      advice = 'Incorporate daily cardio sessions and review your calorie intake to lean down.';
    } else {
      category = 'Obese';
      color = 'var(--danger)';
      advice = 'Consult a certified dietitian and physician for a custom lifestyle/activity plan.';
    }

    setBmi({
      val: bmiVal.toFixed(1),
      category,
      color,
      advice
    });
  };

  useEffect(() => {
    calculateBmi();
  }, [weight, height]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity className="text-gradient" /> BMI Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
        </div>

        {bmi && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your BMI Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: bmi.color }}>{bmi.val}</div>
            <div style={{ fontWeight: '600', color: bmi.color, fontSize: '1.1rem' }}>{bmi.category}</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{bmi.advice}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const BmrCalculator: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('male');
  const [bmr, setBmr] = useState<any>(null);

  const calculateBmr = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) return;

    // Harris-Benedict Formula
    let bmrVal = 0;
    if (gender === 'male') {
      bmrVal = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
    } else {
      bmrVal = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    }

    setBmr({
      val: bmrVal.toFixed(0),
      sedentary: (bmrVal * 1.2).toFixed(0),
      moderate: (bmrVal * 1.55).toFixed(0),
      active: (bmrVal * 1.725).toFixed(0)
    });
  };

  useEffect(() => {
    calculateBmr();
  }, [weight, height, age, gender]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Heart className="text-gradient" /> BMR Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Weight (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Height (cm)</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Age (years)</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {bmr && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
            <div style={{ marginBottom: '8px' }}>Base Metabolic Rate (BMR): <strong>{bmr.val} kcal</strong></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
            <div style={{ marginBottom: '4px' }}>🛋️ Sedentary: <strong>{bmr.sedentary} kcal</strong></div>
            <div style={{ marginBottom: '4px' }}>🏃 Moderate: <strong>{bmr.moderate} kcal</strong></div>
            <div style={{ marginBottom: '4px' }}>🚴 Highly Active: <strong>{bmr.active} kcal</strong></div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WaterIntakeCalculator: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [exercise, setExercise] = useState('30'); // in minutes
  const [intake, setIntake] = useState('2.4');

  useEffect(() => {
    const w = parseFloat(weight);
    const ex = parseFloat(exercise);

    if (isNaN(w) || isNaN(ex) || w <= 0) return;

    // Standard water calculation: 35ml per kg + 350ml per 30 mins exercise
    const baseVal = w * 35;
    const activityVal = (ex / 30) * 350;
    const totalLiters = (baseVal + activityVal) / 1000;

    setIntake(totalLiters.toFixed(2));
  }, [weight, exercise]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Droplet className="text-gradient" /> Water Intake Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Daily Exercise (Minutes)</label>
            <input type="number" value={exercise} onChange={(e) => setExercise(e.target.value)} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Recommended Water Intake</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{intake} L</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '5px' }}>Approx. {Math.round(parseFloat(intake) * 4)} glasses (250ml each)</div>
        </div>
      </div>
    </div>
  );
};
