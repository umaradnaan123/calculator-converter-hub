import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, SunDim, Globe } from 'lucide-react';

export const WeatherDashboard: React.FC = () => {
  const [city, setCity] = useState('New York');
  const [report, setReport] = useState<any>(null);

  // High fidelity weather database simulator
  const lookupWeather = () => {
    let temp = 22;
    let desc = 'Clear Sunny';
    let aqi = 45;
    let aqiStatus = 'Excellent';
    let aqiColor = 'var(--success)';
    let uv = 'Low (2)';
    let sunset = '20:15';

    const cleanCity = city.toLowerCase().trim();
    if (cleanCity.includes('london')) {
      temp = 16;
      desc = 'Overcast Light Rain';
      aqi = 32;
    } else if (cleanCity.includes('delhi') || cleanCity.includes('india') || cleanCity.includes('mumbai')) {
      temp = 38;
      desc = 'Hot haze';
      aqi = 142;
      aqiStatus = 'Unhealthy (Active alerts)';
      aqiColor = 'var(--danger)';
      uv = 'Very High (9)';
      sunset = '19:12';
    } else if (cleanCity.includes('tokyo')) {
      temp = 24;
      desc = 'Mild Cloudy';
      aqi = 58;
      aqiStatus = 'Moderate';
      aqiColor = 'var(--warning)';
    }

    setReport({
      temp,
      desc,
      aqi,
      aqiStatus,
      aqiColor,
      uv,
      sunset,
      pollen: temp > 30 ? 'High (Grass)' : 'Low (Tree)'
    });
  };

  useEffect(() => {
    lookupWeather();
  }, [city]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sun className="text-gradient" /> Weather & AQI Forecast Dashboard
      </h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city name (e.g. London, Delhi)..." />
        <button className="btn-primary" onClick={lookupWeather}>Search</button>
      </div>

      {report && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
          <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{city} Current Temperature</div>
            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '10px 0' }}>{report.temp}°C</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <CloudRain size={16} /> <span>{report.desc}</span>
            </div>
          </div>
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div>😷 Air Quality Index (AQI): <strong style={{ color: report.aqiColor }}>{report.aqi} - {report.aqiStatus}</strong></div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
            <div>☀️ UV Sun Index: <strong>{report.uv}</strong></div>
            <div>🌾 Pollen Counts: <strong>{report.pollen}</strong></div>
            <div>🌇 Sunset Timing: <strong>{report.sunset}</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CarbonFootprint: React.FC = () => {
  const [milesDrive, setMilesDrive] = useState('12000'); // yearly
  const [electricBill, setElectricBill] = useState('100'); // monthly
  const [flights, setFlights] = useState('10'); // hours yearly
  const [footprint, setFootprint] = useState('0.0');

  useEffect(() => {
    const drive = parseFloat(milesDrive);
    const bill = parseFloat(electricBill);
    const fly = parseFloat(flights);

    if (isNaN(drive) || isNaN(bill) || isNaN(fly)) return;

    // Approximated carbon formulas:
    // Driving: 0.4kg CO2 per mile
    // Electricity: 0.37kg CO2 per $ bill (approx based on grid metrics)
    // Flights: 90kg CO2 per flight hour
    const co2Drive = drive * 0.4;
    const co2Bill = bill * 12 * 0.37;
    const co2Fly = fly * 90;

    // Convert total to metric tons of CO2
    const totalTons = (co2Drive + co2Bill + co2Fly) / 1000;
    setFootprint(totalTons.toFixed(1));
  }, [milesDrive, electricBill, flights]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe className="text-gradient" /> Carbon Footprint Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Annual Driving Distance (Miles)</label>
            <input type="number" value={milesDrive} onChange={(e) => setMilesDrive(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Monthly Power Bill ($)</label>
              <input type="number" value={electricBill} onChange={(e) => setElectricBill(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Yearly Flight Hours</label>
              <input type="number" value={flights} onChange={(e) => setFlights(e.target.value)} />
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Your Carbon Footprint</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)', marginTop: '8px' }}>{footprint} Tons</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Metric Tons CO₂ equivalent per year.</div>
        </div>
      </div>
    </div>
  );
};

export const SolarSavings: React.FC = () => {
  const [cost, setCost] = useState('15000'); // installation cost
  const [billBill, setBillBill] = useState('120'); // monthly savings
  const [roiYears, setRoiYears] = useState('0');

  useEffect(() => {
    const c = parseFloat(cost);
    const b = parseFloat(billBill);

    if (isNaN(c) || isNaN(b) || c <= 0 || b <= 0) return;

    // Years to pay back = Cost / (monthly savings * 12)
    const yrs = c / (b * 12);
    setRoiYears(yrs.toFixed(1));
  }, [cost, billBill]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SunDim className="text-gradient" /> Solar Panel Savings Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Total Installation Net Cost ($)</label>
            <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Estimated Monthly Utility Savings ($)</label>
            <input type="number" value={billBill} onChange={(e) => setBillBill(e.target.value)} />
          </div>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Solar Return Duration</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--success)', marginTop: '8px' }}>{roiYears} Years</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Time required to reach full break-even.</div>
        </div>
      </div>
    </div>
  );
};
