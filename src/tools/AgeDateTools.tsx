import React, { useState, useEffect } from 'react';
import { Calendar, Hourglass, Clock } from 'lucide-react';

// Get Zodiac Sign
const getZodiacSign = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const signs = [
    { name: 'Capricorn ♑', start: '12-22', end: '01-19' },
    { name: 'Aquarius ♒', start: '01-20', end: '02-18' },
    { name: 'Pisces ♓', start: '02-19', end: '03-20' },
    { name: 'Aries ♈', start: '03-21', end: '04-19' },
    { name: 'Taurus ♉', start: '04-20', end: '05-20' },
    { name: 'Gemini ♊', start: '05-21', end: '06-20' },
    { name: 'Cancer ♋', start: '06-21', end: '07-22' },
    { name: 'Leo ♌', start: '07-23', end: '08-22' },
    { name: 'Virgo ♍', start: '08-23', end: '09-22' },
    { name: 'Libra ♎', start: '09-23', end: '10-22' },
    { name: 'Scorpio ♏', start: '10-23', end: '11-21' },
    { name: 'Sagittarius ♐', start: '11-22', end: '12-21' }
  ];

  for (let sign of signs) {
    const [sm, sd] = sign.start.split('-').map(Number);
    const [em, ed] = sign.end.split('-').map(Number);
    if (
      (month === sm && day >= sd) ||
      (month === em && day <= ed) ||
      (sm === 12 && month === 12 && day >= sd) ||
      (sm === 12 && month === 1 && day <= ed)
    ) {
      return sign.name;
    }
  }
  return 'Unknown';
};

export const AgeCalculator: React.FC = () => {
  const [birthdate, setBirthdate] = useState('1998-05-15');
  const [birthtime, setBirthtime] = useState('09:00');
  const [results, setResults] = useState<any>(null);

  const calculateAge = () => {
    if (!birthdate) return;
    const birth = new Date(`${birthdate}T${birthtime || '00:00'}`);
    const now = new Date();

    if (birth > now) {
      alert('Birthdate cannot be in the future!');
      return;
    }

    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const totalSeconds = Math.floor(diffTime / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // Dynamic precise calculations
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Next birthday details
    const nextBday = new Date(birth);
    nextBday.setFullYear(now.getFullYear());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const nextBdayDiff = nextBday.getTime() - now.getTime();
    const daysToNextBday = Math.ceil(nextBdayDiff / (1000 * 60 * 60 * 24));
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornDay = daysOfWeek[birth.getDay()];
    const nextBdayDay = daysOfWeek[nextBday.getDay()];

    // Estimated heartbeats and breaths
    const heartbeats = totalMinutes * 72; // avg 72 bpm
    const breaths = totalMinutes * 16; // avg 16 breaths per min

    setResults({
      years,
      months,
      days,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      bornDay,
      zodiacSign: getZodiacSign(birth),
      daysToNextBday,
      nextBdayDay,
      heartbeats,
      breaths
    });
  };

  useEffect(() => {
    calculateAge();
  }, [birthdate, birthtime]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexWrap: 'wrap' }} className="responsive-split">
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar className="text-gradient" /> Enter Birth Details
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date of Birth</label>
            <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Time of Birth (Optional)</label>
            <input type="time" value={birthtime} onChange={(e) => setBirthtime(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={calculateAge} style={{ width: '100%' }}>Calculate Age</button>
        </div>

        {results && (
          <div className="glass-card" style={{ borderColor: 'var(--accent-secondary)' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--accent-secondary)' }}>Exact Age</h3>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{results.years}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Years</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{results.months}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Months</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-md)', flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{results.days}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Days</div>
              </div>
            </div>

            <h4 style={{ marginBottom: '12px' }}>Next Birthday Info</h4>
            <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.95rem' }}>
              🎉 Only <strong>{results.daysToNextBday} days</strong> left! Next birthday falls on a <strong>{results.nextBdayDay}</strong>.
            </div>

            <h4 style={{ marginBottom: '12px' }}>Life Milestones & Facts</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Born on: <strong>{results.bornDay}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Zodiac: <strong>{results.zodiacSign}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Total Days lived: <strong>{results.totalDays.toLocaleString()}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Total Weeks lived: <strong>{results.totalWeeks.toLocaleString()}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Total Hours lived: <strong>{results.totalHours.toLocaleString()}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Total Minutes lived: <strong>{results.totalMinutes.toLocaleString()}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Heartbeats: ~<strong>{results.heartbeats.toLocaleString()}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                Breaths: ~<strong>{results.breaths.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const DateDifference: React.FC = () => {
  const [date1, setDate1] = useState('2026-01-01');
  const [date2, setDate2] = useState('2026-12-31');
  const [diff, setDiff] = useState<any>(null);

  const calculateDiff = () => {
    if (!date1 || !date2) return;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const timeDiff = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Exact structural breakdown
    const early = d1 < d2 ? d1 : d2;
    const late = d1 < d2 ? d2 : d1;
    
    let years = late.getFullYear() - early.getFullYear();
    let months = late.getMonth() - early.getMonth();
    let days = late.getDate() - early.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(late.getFullYear(), late.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setDiff({ years, months, days, totalDays });
  };

  useEffect(() => {
    calculateDiff();
  }, [date1, date2]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Hourglass className="text-gradient" /> Calculate Date Difference
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="responsive-split">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Start Date</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>End Date</label>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} />
        </div>
      </div>
      {diff && (
        <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Difference breakdown:</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '10px' }}>
            {diff.years} Yrs, {diff.months} Mths, {diff.days} Days
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>
            Total Duration: <strong>{diff.totalDays} Days</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export const CountdownTimer: React.FC = () => {
  const [targetDate, setTargetDate] = useState('2027-01-01T00:00');
  const [timeLeft, setTimeLeft] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, expired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="glass-card animate-fade-in">
      <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Clock className="text-gradient" /> Custom Event Countdown
      </h3>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Set Event Target Date & Time</label>
        <input type="datetime-local" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
      </div>

      {timeLeft && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
          {timeLeft.expired ? (
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>🎉 The Event has arrived!</div>
          ) : (
            <>
              <div style={{ background: 'var(--bg-tertiary)', width: '70px', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{timeLeft.days}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Days</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', width: '70px', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{timeLeft.hours}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Hrs</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', width: '70px', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{timeLeft.minutes}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mins</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', width: '70px', padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-secondary)' }}>{timeLeft.seconds}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Secs</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
