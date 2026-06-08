import React, { useState, useEffect } from 'react';
import { Compass, Zap, Gauge } from 'lucide-react';

export const FuelMileage: React.FC = () => {
  const [distance, setDistance] = useState('500'); // in km
  const [fuel, setFuel] = useState('40'); // in liters
  const [kml, setKml] = useState('0.0');
  const [mpg, setMpg] = useState('0.0');

  useEffect(() => {
    const d = parseFloat(distance);
    const f = parseFloat(fuel);

    if (isNaN(d) || isNaN(f) || d <= 0 || f <= 0) return;

    const kmPerL = d / f;
    // 1 km/L = 2.35215 MPG
    const milesPerG = kmPerL * 2.35215;

    setKml(kmPerL.toFixed(1));
    setMpg(milesPerG.toFixed(1));
  }, [distance, fuel]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Gauge className="text-gradient" /> Fuel Mileage Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Trip Distance (km)</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Fuel Consumed (Liters)</label>
            <input type="number" value={fuel} onChange={(e) => setFuel(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', textAlign: 'center' }}>
          <div>Fuel Efficiency:</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{kml} km/L</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{mpg} MPG (US)</div>
        </div>
      </div>
    </div>
  );
};

export const EvChargingCost: React.FC = () => {
  const [capacity, setCapacity] = useState('75'); // kWh battery capacity (Tesla Model 3 standard)
  const [startPct, setStartPct] = useState('20');
  const [targetPct, setTargetPct] = useState('80');
  const [rate, setRate] = useState('8.0'); // ₹ per kWh
  const [cost, setCost] = useState('0.00');

  useEffect(() => {
    const cap = parseFloat(capacity);
    const start = parseFloat(startPct);
    const target = parseFloat(targetPct);
    const r = parseFloat(rate);

    if (isNaN(cap) || isNaN(start) || isNaN(target) || isNaN(r) || start >= target) return;

    const diffPct = (target - start) / 100;
    const energyAdded = cap * diffPct;
    const totalCost = energyAdded * r;

    setCost(totalCost.toFixed(2));
  }, [capacity, startPct, targetPct, rate]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap className="text-gradient" /> EV Charging Cost Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Battery Capacity (kWh)</label>
              <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Charging Cost (₹/kWh)</label>
              <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Start Charge (%)</label>
              <input type="number" value={startPct} onChange={(e) => setStartPct(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Target Charge (%)</label>
              <input type="number" value={targetPct} onChange={(e) => setTargetPct(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estimated Charging Expense</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '8px' }}>₹{parseFloat(cost).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  );
};

export const VehicleDepreciation: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState('1200000');
  const [age, setAge] = useState('5');
  const [depRate, setDepRate] = useState('15'); // 15% depreciation per year
  const [residualValue, setResidualValue] = useState('0.00');

  useEffect(() => {
    const price = parseFloat(purchasePrice);
    const yrs = parseFloat(age);
    const r = parseFloat(depRate) / 100;

    if (isNaN(price) || isNaN(yrs) || isNaN(r) || price <= 0 || yrs <= 0 || r <= 0) return;

    // Declining balance depreciation: Value = Price * (1 - r)^yrs
    const val = price * Math.pow(1 - r, yrs);
    setResidualValue(val.toFixed(2));
  }, [purchasePrice, age, depRate]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Compass className="text-gradient" /> Vehicle Depreciation Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Purchase Price (₹)</label>
            <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Age (Years)</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Annual Depr. Rate (%)</label>
              <input type="number" value={depRate} onChange={(e) => setDepRate(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Resale Book Value</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginTop: '8px' }}>₹{Math.round(parseFloat(residualValue)).toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Total Lost Value: ₹{Math.round(parseFloat(purchasePrice) - parseFloat(residualValue)).toLocaleString('en-IN')}</div>
        </div>
      </div>
    </div>
  );
};
