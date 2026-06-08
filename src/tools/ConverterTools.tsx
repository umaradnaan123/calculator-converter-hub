import React, { useState, useEffect } from 'react';
import { RefreshCw, Scale, Ruler, Thermometer, Box, Compass, Clock, HardDrive, Square } from 'lucide-react';

interface UnitCategory {
  id: string;
  name: string;
  icon: any;
  units: { [key: string]: { label: string; ratio: number; base?: boolean; offset?: number } };
}

const CONVERSION_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length & Distance',
    icon: Ruler,
    units: {
      mm: { label: 'Millimeters (mm)', ratio: 0.001 },
      cm: { label: 'Centimeters (cm)', ratio: 0.01 },
      m: { label: 'Meters (m)', ratio: 1, base: true },
      km: { label: 'Kilometers (km)', ratio: 1000 },
      in: { label: 'Inches (in)', ratio: 0.0254 },
      ft: { label: 'Feet (ft)', ratio: 0.3048 },
      yd: { label: 'Yards (yd)', ratio: 0.9144 },
      mi: { label: 'Miles (mi)', ratio: 1609.34 }
    }
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    icon: Scale,
    units: {
      mg: { label: 'Milligrams (mg)', ratio: 0.001 },
      g: { label: 'Grams (g)', ratio: 1, base: true },
      kg: { label: 'Kilograms (kg)', ratio: 1000 },
      oz: { label: 'Ounces (oz)', ratio: 28.3495 },
      lb: { label: 'Pounds (lb)', ratio: 453.592 },
      t: { label: 'Metric Tons (t)', ratio: 1000000 }
    }
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    // Custom formulas applied for Temperature inside calculations
    units: {
      C: { label: 'Celsius (°C)', ratio: 1 },
      F: { label: 'Fahrenheit (°F)', ratio: 1 },
      K: { label: 'Kelvin (K)', ratio: 1 }
    }
  },
  {
    id: 'area',
    name: 'Area',
    icon: Square,
    units: {
      sqm: { label: 'Square Meters (m²)', ratio: 1, base: true },
      sqft: { label: 'Square Feet (ft²)', ratio: 0.092903 },
      sqyd: { label: 'Square Yards (yd²)', ratio: 0.836127 },
      sqkm: { label: 'Square Kilometers (km²)', ratio: 1000000 },
      sqmi: { label: 'Square Miles (mi²)', ratio: 2589988.11 },
      acre: { label: 'Acres (ac)', ratio: 4046.86 },
      hectare: { label: 'Hectares (ha)', ratio: 10000 }
    }
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Box,
    units: {
      ml: { label: 'Milliliters (ml)', ratio: 0.001 },
      l: { label: 'Liters (L)', ratio: 1, base: true },
      m3: { label: 'Cubic Meters (m³)', ratio: 1000 },
      gal: { label: 'Gallons (US Gal)', ratio: 3.78541 },
      cuft: { label: 'Cubic Feet (ft³)', ratio: 28.3168 }
    }
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: Compass,
    units: {
      mps: { label: 'Meters per Second (m/s)', ratio: 1, base: true },
      kph: { label: 'Kilometers per Hour (km/h)', ratio: 0.277778 },
      mph: { label: 'Miles per Hour (mph)', ratio: 0.44704 },
      knots: { label: 'Knots (kt)', ratio: 0.514444 }
    }
  },
  {
    id: 'time',
    name: 'Time',
    icon: Clock,
    units: {
      sec: { label: 'Seconds (s)', ratio: 1, base: true },
      min: { label: 'Minutes (min)', ratio: 60 },
      hr: { label: 'Hours (h)', ratio: 3600 },
      day: { label: 'Days (d)', ratio: 86400 },
      week: { label: 'Weeks (w)', ratio: 604800 },
      month: { label: 'Months (mo - avg)', ratio: 2629746 },
      year: { label: 'Years (yr)', ratio: 31556952 }
    }
  },
  {
    id: 'digital',
    name: 'Digital Storage',
    icon: HardDrive,
    units: {
      bit: { label: 'Bits (b)', ratio: 0.125 },
      B: { label: 'Bytes (B)', ratio: 1, base: true },
      KB: { label: 'Kilobytes (KB)', ratio: 1024 },
      MB: { label: 'Megabytes (MB)', ratio: 1048576 },
      GB: { label: 'Gigabytes (GB)', ratio: 1073741824 },
      TB: { label: 'Terabytes (TB)', ratio: 1099511627776 },
      PB: { label: 'Petabytes (PB)', ratio: 1125899906842624 }
    }
  }
];

export const UniversalUnitConverter: React.FC = () => {
  const [selectedCatId, setSelectedCatId] = useState('length');
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [outputValue, setOutputValue] = useState('100');

  const activeCategory = CONVERSION_CATEGORIES.find(c => c.id === selectedCatId) || CONVERSION_CATEGORIES[0];

  useEffect(() => {
    // Reset units when category changes
    const keys = Object.keys(activeCategory.units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [selectedCatId]);

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit, toUnit, selectedCatId]);

  const convert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setOutputValue('');
      return;
    }

    if (selectedCatId === 'temperature') {
      // Custom temperature formulas
      if (fromUnit === toUnit) {
        setOutputValue(val.toString());
        return;
      }
      let tempInC = val;
      if (fromUnit === 'F') tempInC = (val - 32) * (5 / 9);
      if (fromUnit === 'K') tempInC = val - 273.15;

      let result = tempInC;
      if (toUnit === 'F') result = tempInC * (9 / 5) + 32;
      if (toUnit === 'K') result = tempInC + 273.15;

      setOutputValue(result.toFixed(4).replace(/\.?0+$/, ''));
      return;
    }

    // Standard ratio conversion
    const fromRatio = activeCategory.units[fromUnit]?.ratio || 1;
    const toRatio = activeCategory.units[toUnit]?.ratio || 1;
    const result = (val * fromRatio) / toRatio;
    
    setOutputValue(result.toFixed(6).replace(/\.?0+$/, ''));
  };

  const getFullReferenceTable = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return [];

    return Object.entries(activeCategory.units).map(([key, unit]) => {
      let result = 0;
      if (selectedCatId === 'temperature') {
        let tempInC = val;
        if (fromUnit === 'F') tempInC = (val - 32) * (5 / 9);
        if (fromUnit === 'K') tempInC = val - 273.15;

        result = tempInC;
        if (key === 'F') result = tempInC * (9 / 5) + 32;
        if (key === 'K') result = tempInC + 273.15;
      } else {
        const fromRatio = activeCategory.units[fromUnit]?.ratio || 1;
        const targetRatio = unit.ratio;
        result = (val * fromRatio) / targetRatio;
      }
      return {
        unitLabel: unit.label,
        value: result.toFixed(6).replace(/\.?0+$/, '')
      };
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Category selector */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }} className="no-scrollbar">
        {CONVERSION_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                padding: '8px 16px',
                fontSize: '0.9rem',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-color)',
              }}
            >
              <Icon size={16} /> {cat.name}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }} className="responsive-split">
        {/* Main Panel */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw className="text-gradient" /> {activeCategory.name} Converter
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="responsive-split">
            {/* From unit */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From Unit</label>
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                {Object.entries(activeCategory.units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.label}</option>
                ))}
              </select>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ marginTop: '12px' }}
                placeholder="Enter value"
              />
            </div>

            {/* To unit */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To Unit</label>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                {Object.entries(activeCategory.units).map(([key, unit]) => (
                  <option key={key} value={key}>{unit.label}</option>
                ))}
              </select>
              <input
                type="text"
                readOnly
                value={outputValue}
                style={{ marginTop: '12px', fontWeight: 'bold', backgroundColor: 'var(--bg-tertiary)', cursor: 'default' }}
                placeholder="Result"
              />
            </div>
          </div>
        </div>

        {/* Quick Reference Panel */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '16px' }}>All Conversions</h3>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Unit</th>
                  <th style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-secondary)' }}>Converted Value</th>
                </tr>
              </thead>
              <tbody>
                {getFullReferenceTable().map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '8px 0' }}>{row.unitLabel}</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
