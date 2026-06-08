import React, { useState, useEffect } from 'react';
import { Calculator, Award, Hash } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('');

  const handleBtnClick = (val: string) => {
    setDisplay((prev) => prev + val);
  };

  const handleClear = () => {
    setDisplay('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      // Safely replace mathematical constants and evaluate
      let expr = display
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/√\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');

      // Simple verification check to only allow math evaluation symbols
      if (!/^[0-9+\-*/(). MathPIEsinctanlg√**]+$/.test(expr)) {
        throw new Error('Invalid Character');
      }

      // Safe evaluation using Function constructor
      const val = new Function(`return ${expr}`)();
      if (val !== undefined && !isNaN(val)) {
        setDisplay(Number(val.toFixed(8)).toString());
      } else {
        setDisplay('Error');
      }
    } catch (err) {
      setDisplay('Error');
    }
  };

  const triggerTrig = (func: string) => {
    setDisplay((prev) => prev + func + '(');
  };

  return (
    <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calculator className="text-gradient" /> Scientific Calculator
      </h3>
      <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', textAlign: 'right', fontSize: '1.8rem', minHeight: '60px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {display || '0'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => triggerTrig('sin')}>sin</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => triggerTrig('cos')}>cos</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => triggerTrig('tan')}>tan</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => triggerTrig('log')}>log</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => triggerTrig('ln')}>ln</button>

        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('π')}>π</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('e')}>e</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => triggerTrig('√')}>√</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('^')}>xʸ</button>
        <button className="btn-secondary" style={{ padding: '10px 0', backgroundColor: 'var(--danger)', color: '#fff' }} onClick={handleClear}>C</button>

        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('(')}>(</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick(')')}>)</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBackspace()}>⌫</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('/')}>÷</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('*')}>×</button>

        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('7')}>7</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('8')}>8</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('9')}>9</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('-')}>-</button>
        <button className="btn-secondary" style={{ padding: '10px 0' }} onClick={() => handleBtnClick('+')}>+</button>

        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('4')}>4</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('5')}>5</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('6')}>6</button>
        <button className="btn-primary" style={{ gridRow: 'span 2', gridColumn: 'span 2', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-tertiary))' }} onClick={handleCalculate}>=</button>

        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('1')}>1</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('2')}>2</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('3')}>3</button>

        <button className="btn-secondary" style={{ padding: '10px 0', gridColumn: 'span 2', fontWeight: 'bold' }} onClick={() => handleBtnClick('0')}>0</button>
        <button className="btn-secondary" style={{ padding: '10px 0', fontWeight: 'bold' }} onClick={() => handleBtnClick('.')}>.</button>
      </div>
    </div>
  );
};

export const GpaCalculator: React.FC = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Subject 1', credit: '3', grade: 'A' },
    { id: 2, name: 'Subject 2', credit: '4', grade: 'B' },
    { id: 3, name: 'Subject 3', credit: '3', grade: 'A' }
  ]);
  const [gpa, setGpa] = useState<string>('0.00');

  const gradePoints: { [key: string]: number } = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const calculateGpa = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach((c) => {
      const cr = parseFloat(c.credit);
      const gp = gradePoints[c.grade];
      if (!isNaN(cr)) {
        totalCredits += cr;
        totalGradePoints += cr * gp;
      }
    });

    if (totalCredits === 0) {
      setGpa('0.00');
    } else {
      setGpa((totalGradePoints / totalCredits).toFixed(2));
    }
  };

  useEffect(() => {
    calculateGpa();
  }, [courses]);

  const addCourseRow = () => {
    setCourses([...courses, { id: Date.now(), name: `Subject ${courses.length + 1}`, credit: '3', grade: 'A' }]);
  };

  const removeCourseRow = (id: number) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: number, field: string, value: string) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Award className="text-gradient" /> GPA / CGPA Calculator
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }} className="responsive-split">
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {courses.map((course) => (
              <div key={course.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                  placeholder="Course Name"
                  style={{ flex: 2 }}
                />
                <input
                  type="number"
                  value={course.credit}
                  onChange={(e) => updateCourse(course.id, 'credit', e.target.value)}
                  placeholder="Credits"
                  style={{ flex: 1 }}
                />
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  style={{ flex: 1 }}
                >
                  {Object.keys(gradePoints).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <button
                  onClick={() => removeCourseRow(course.id)}
                  style={{ padding: '8px 12px', background: 'var(--danger)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button className="btn-secondary" onClick={addCourseRow} style={{ width: '100%' }}>+ Add Course</button>
        </div>

        <div style={{ background: 'var(--bg-tertiary)', padding: '24px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Your GPA</div>
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{gpa}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
            Calculated on a 4.0 grading scale.
          </div>
        </div>
      </div>
    </div>
  );
};

export const PercentageCalculator: React.FC = () => {
  const [val1, setVal1] = useState('20');
  const [val2, setVal2] = useState('150');
  const [res1, setRes1] = useState('');

  const [val3, setVal3] = useState('50');
  const [val4, setVal4] = useState('250');
  const [res2, setRes2] = useState('');

  useEffect(() => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);
    if (!isNaN(v1) && !isNaN(v2) && v2 !== 0) {
      setRes1(((v1 / 100) * v2).toString());
    } else {
      setRes1('');
    }
  }, [val1, val2]);

  useEffect(() => {
    const v3 = parseFloat(val3);
    const v4 = parseFloat(val4);
    if (!isNaN(v3) && !isNaN(v4) && v4 !== 0) {
      setRes2(((v3 / v4) * 100).toFixed(2) + '%');
    } else {
      setRes2('');
    }
  }, [val3, val4]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Hash className="text-gradient" /> Percentage Calculator
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h4 style={{ marginBottom: '10px', fontSize: '0.95rem' }}>What is X% of Y?</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} style={{ width: '80px' }} />
            <span>% of</span>
            <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} style={{ width: '100px' }} />
            <span>is</span>
            <input type="text" readOnly value={res1} style={{ width: '120px', background: 'var(--bg-tertiary)', fontWeight: 'bold' }} />
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        <div>
          <h4 style={{ marginBottom: '10px', fontSize: '0.95rem' }}>X is what percent of Y?</h4>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="number" value={val3} onChange={(e) => setVal3(e.target.value)} style={{ width: '100px' }} />
            <span>is what % of</span>
            <input type="number" value={val4} onChange={(e) => setVal4(e.target.value)} style={{ width: '100px' }} />
            <span>is</span>
            <input type="text" readOnly value={res2} style={{ width: '120px', background: 'var(--bg-tertiary)', fontWeight: 'bold' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
