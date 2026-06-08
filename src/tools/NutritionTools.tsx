import React, { useState, useEffect } from 'react';
import { Flame, Compass, Heart } from 'lucide-react';

export const MacroCalculator: React.FC = () => {
  const [calories, setCalories] = useState('2000');
  const [ratio, setRatio] = useState('balanced'); // balanced | low-carb | high-protein
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    const cal = parseFloat(calories);
    if (isNaN(cal) || cal <= 0) return;

    let pPct = 0.3, cPct = 0.4, fPct = 0.3; // balanced default

    if (ratio === 'low-carb') {
      pPct = 0.4;
      cPct = 0.2;
      fPct = 0.4;
    } else if (ratio === 'high-protein') {
      pPct = 0.45;
      cPct = 0.35;
      fPct = 0.2;
    }

    // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
    const protein = (cal * pPct) / 4;
    const carbs = (cal * cPct) / 4;
    const fat = (cal * fPct) / 9;

    setMacros({
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat)
    });
  }, [calories, ratio]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flame className="text-gradient" /> Macro Nutrient Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Daily Target Calories (kcal)</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Macronutrient Ratio Split</label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value)}>
              <option value="balanced">Balanced (30% Pro / 40% Carb / 30% Fat)</option>
              <option value="low-carb">Low Carb / Keto (40% Pro / 20% Carb / 40% Fat)</option>
              <option value="high-protein">High Protein (45% Pro / 35% Carb / 20% Fat)</option>
            </select>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🥩 Protein:</span> <strong>{macros.protein} g</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🍞 Carbs:</span> <strong>{macros.carbs} g</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>🥑 Fat:</span> <strong>{macros.fat} g</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HealthyWeight: React.FC = () => {
  const [height, setHeight] = useState('175'); // cm
  const [gender, setGender] = useState('male');
  const [minWeight, setMinWeight] = useState(0);
  const [maxWeight, setMaxWeight] = useState(0);

  useEffect(() => {
    const h = parseFloat(height) / 100;
    if (isNaN(h) || h <= 0) return;

    // Healthy weights calculated using ideal BMI range [18.5 to 24.9]
    setMinWeight(Math.round(18.5 * (h * h)));
    setMaxWeight(Math.round(24.9 * (h * h)));
  }, [height]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Heart className="text-gradient" /> Ideal Healthy Weight Range
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recommended Healthy Weight</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '8px' }}>{minWeight} - {maxWeight} kg</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Based on clinical normal BMI metrics (18.5 - 24.9).</div>
        </div>
      </div>
    </div>
  );
};

export const MealPlanner: React.FC = () => {
  const [diet, setDiet] = useState('maintenance'); // maintenance | weight-loss | muscle-gain
  const [menu, setMenu] = useState<any>(null);

  const plans: { [key: string]: any } = {
    'maintenance': {
      breakfast: 'Oatmeal with sliced banana, honey, and chopped almonds.',
      lunch: 'Grilled chicken breast wrap with mixed greens and hummus.',
      dinner: 'Baked salmon fillet with quinoa and steamed broccoli.'
    },
    'weight-loss': {
      breakfast: 'Scrambled egg whites with spinach, tomatoes, and whole wheat toast.',
      lunch: 'Tuna salad lettuce wraps with olive oil vinaigrette dressing.',
      dinner: 'Grilled turkey breast with roasted zucchini and bell peppers.'
    },
    'muscle-gain': {
      breakfast: 'Greek yogurt bowl with granola, protein powder scoop, and berries.',
      lunch: 'Lean beef burger patty with sweet potato wedges and avocado.',
      dinner: 'Stir-fried shrimp with brown rice, snap peas, and sesame seeds.'
    }
  };

  useEffect(() => {
    setMenu(plans[diet]);
  }, [diet]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass className="text-gradient" /> Personalized Meal Planner
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Select Diet Objective</label>
          <select value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="maintenance">Balanced Maintenance</option>
            <option value="weight-loss">Calorie Deficit (Weight Loss)</option>
            <option value="muscle-gain">High Protein (Muscle Gain)</option>
          </select>
        </div>
        
        {menu && (
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
            <div>🥞 <strong>Breakfast:</strong> {menu.breakfast}</div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <div>🥗 <strong>Lunch:</strong> {menu.lunch}</div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <div>🍲 <strong>Dinner:</strong> {menu.dinner}</div>
          </div>
        )}
      </div>
    </div>
  );
};
