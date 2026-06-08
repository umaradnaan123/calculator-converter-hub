import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRightLeft, TrendingUp, Star, RefreshCw, Search, ShieldAlert, Globe, Info } from 'lucide-react';

interface CurrencyInfo {
  country: string;
  flag: string;
  capital: string;
  centralBank: string;
  name: string;
  symbol: string;
}

const CURRENCY_DETAILS: { [key: string]: CurrencyInfo } = {
  USD: { country: 'United States', flag: '🇺🇸', capital: 'Washington, D.C.', centralBank: 'Federal Reserve System (Fed)', name: 'US Dollar', symbol: '$' },
  EUR: { country: 'European Union', flag: '🇪🇺', capital: 'Frankfurt (ECB HQ)', centralBank: 'European Central Bank (ECB)', name: 'Euro', symbol: '€' },
  INR: { country: 'India', flag: '🇮🇳', capital: 'New Delhi', centralBank: 'Reserve Bank of India (RBI)', name: 'Indian Rupee', symbol: '₹' },
  GBP: { country: 'United Kingdom', flag: '🇬🇧', capital: 'London', centralBank: 'Bank of England (BoE)', name: 'Pound Sterling', symbol: '£' },
  JPY: { country: 'Japan', flag: '🇯🇵', capital: 'Tokyo', centralBank: 'Bank of Japan (BoJ)', name: 'Japanese Yen', symbol: '¥' },
  CNY: { country: 'China', flag: '🇨🇳', capital: 'Beijing', centralBank: 'People\'s Bank of China (PBOC)', name: 'Chinese Yuan', symbol: '¥' },
  AUD: { country: 'Australia', flag: '🇦🇺', capital: 'Canberra', centralBank: 'Reserve Bank of Australia (RBA)', name: 'Australian Dollar', symbol: 'A$' },
  CAD: { country: 'Canada', flag: '🇨🇦', capital: 'Ottawa', centralBank: 'Bank of Canada (BoC)', name: 'Canadian Dollar', symbol: 'C$' },
  SGD: { country: 'Singapore', flag: '🇸🇬', capital: 'Singapore', centralBank: 'Monetary Authority of Singapore (MAS)', name: 'Singapore Dollar', symbol: 'S$' },
  AED: { country: 'United Arab Emirates', flag: '🇦🇪', capital: 'Abu Dhabi', centralBank: 'Central Bank of the UAE', name: 'UAE Dirham', symbol: 'د.إ' },
  SAR: { country: 'Saudi Arabia', flag: '🇸🇦', capital: 'Riyadh', centralBank: 'Saudi Central Bank (SAMA)', name: 'Saudi Riyal', symbol: 'ر.س' },
  ZAR: { country: 'South Africa', flag: '🇿🇦', capital: 'Pretoria', centralBank: 'South African Reserve Bank (SARB)', name: 'South African Rand', symbol: 'R' },
  NZD: { country: 'New Zealand', flag: '🇳🇿', capital: 'Wellington', centralBank: 'Reserve Bank of New Zealand (RBNZ)', name: 'New Zealand Dollar', symbol: 'NZ$' },
  HKD: { country: 'Hong Kong', flag: '🇭🇰', capital: 'Hong Kong', centralBank: 'Hong Kong Monetary Authority (HKMA)', name: 'Hong Kong Dollar', symbol: 'HK$' },
  KRW: { country: 'South Korea', flag: '🇰🇷', capital: 'Seoul', centralBank: 'Bank of Korea', name: 'South Korean Won', symbol: '₩' },
  MYR: { country: 'Malaysia', flag: '🇲🇾', capital: 'Kuala Lumpur', centralBank: 'Central Bank of Malaysia', name: 'Malaysian Ringgit', symbol: 'RM' },
  THB: { country: 'Thailand', flag: '🇹🇭', capital: 'Bangkok', centralBank: 'Bank of Thailand', name: 'Thai Baht', symbol: '฿' },
  IDR: { country: 'Indonesia', flag: '🇮🇩', capital: 'Jakarta', centralBank: 'Bank Indonesia', name: 'Indonesian Rupiah', symbol: 'Rp' },
  PHP: { country: 'Philippines', flag: '🇵🇭', capital: 'Manila', centralBank: 'Bangko Sentral ng Pilipinas', name: 'Philippine Peso', symbol: '₱' },
  PKR: { country: 'Pakistan', flag: '🇵🇰', capital: 'Islamabad', centralBank: 'State Bank of Pakistan', name: 'Pakistani Rupee', symbol: '₨' },
  BDT: { country: 'Bangladesh', flag: '🇧🇩', capital: 'Dhaka', centralBank: 'Bangladesh Bank', name: 'Bangladeshi Taka', symbol: '৳' },
  LKR: { country: 'Sri Lanka', flag: '🇱🇰', capital: 'Colombo', centralBank: 'Central Bank of Sri Lanka', name: 'Sri Lankan Rupee', symbol: '₨' },
  NPR: { country: 'Nepal', flag: '🇳🇵', capital: 'Kathmandu', centralBank: 'Nepal Rastra Bank', name: 'Nepalese Rupee', symbol: '₨' },
  BRL: { country: 'Brazil', flag: '🇧🇷', capital: 'Brasília', centralBank: 'Central Bank of Brazil', name: 'Brazilian Real', symbol: 'R$' },
  MXN: { country: 'Mexico', flag: '🇲🇽', capital: 'Mexico City', centralBank: 'Banco de México', name: 'Mexican Peso', symbol: '$' },
  RUB: { country: 'Russia', flag: '🇷🇺', capital: 'Moscow', centralBank: 'Central Bank of the Russian Federation', name: 'Russian Ruble', symbol: '₽' },
  TRY: { country: 'Turkey', flag: '🇹🇷', capital: 'Ankara', centralBank: 'Central Bank of the Republic of Turkey', name: 'Turkish Lira', symbol: '₺' },
  EGP: { country: 'Egypt', flag: '🇪🇬', capital: 'Cairo', centralBank: 'Central Bank of Egypt', name: 'Egyptian Pound', symbol: 'E£' },
  NGN: { country: 'Nigeria', flag: '🇳🇬', capital: 'Abuja', centralBank: 'Central Bank of Nigeria', name: 'Nigerian Naira', symbol: '₦' },
  ARS: { country: 'Argentina', flag: '🇦🇷', capital: 'Buenos Aires', centralBank: 'Central Bank of Argentina', name: 'Argentine Peso', symbol: '$' },
  COP: { country: 'Colombia', flag: '🇨🇴', capital: 'Bogotá', centralBank: 'Banco de la República', name: 'Colombian Peso', symbol: '$' },
  DKK: { country: 'Denmark', flag: '🇩🇰', capital: 'Copenhagen', centralBank: 'Danmarks Nationalbank', name: 'Danish Krone', symbol: 'kr' },
  ILS: { country: 'Israel', flag: '🇮🇱', capital: 'Jerusalem', centralBank: 'Bank of Israel', name: 'Israeli New Shekel', symbol: '₪' },
  NOK: { country: 'Norway', flag: '🇳🇴', capital: 'Oslo', centralBank: 'Norges Bank', name: 'Norwegian Krone', symbol: 'kr' },
  PLN: { country: 'Poland', flag: '🇵🇱', capital: 'Warsaw', centralBank: 'Narodowy Bank Polski', name: 'Polish Zloty', symbol: 'zł' },
  SEK: { country: 'Sweden', flag: '🇸🇪', capital: 'Stockholm', centralBank: 'Sveriges Riksbank', name: 'Swedish Krona', symbol: 'kr' },
  TWD: { country: 'Taiwan', flag: '🇹🇼', capital: 'Taipei', centralBank: 'Central Bank of the Republic of China (Taiwan)', name: 'New Taiwan Dollar', symbol: 'NT$' },
  VND: { country: 'Vietnam', flag: '🇻🇳', capital: 'Hanoi', centralBank: 'State Bank of Vietnam', name: 'Vietnamese Dong', symbol: '₫' }
};

const getOrFallbackCurrency = (code: string): CurrencyInfo => {
  if (CURRENCY_DETAILS[code]) return CURRENCY_DETAILS[code];
  return {
    country: `${code} Region`,
    flag: '🌐',
    capital: 'N/A',
    centralBank: `Central Bank of ${code}`,
    name: `${code} Currency`,
    symbol: code
  };
};

const detectLocalCurrency = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India')) return 'INR';
    if (tz.includes('London') || tz.includes('Europe/London')) return 'GBP';
    if (tz.includes('Paris') || tz.includes('Berlin') || tz.includes('Rome') || tz.includes('Madrid')) return 'EUR';
    if (tz.includes('Tokyo')) return 'JPY';
    if (tz.includes('Sydney') || tz.includes('Melbourne')) return 'AUD';
    if (tz.includes('Toronto') || tz.includes('Vancouver')) return 'CAD';
    if (tz.includes('Singapore')) return 'SGD';
    if (tz.includes('Dubai') || tz.includes('Abu_Dhabi')) return 'AED';
    if (tz.includes('Riyadh')) return 'SAR';
    if (tz.includes('Karachi')) return 'PKR';
    if (tz.includes('Dhaka')) return 'BDT';
    if (tz.includes('Colombo')) return 'LKR';
    if (tz.includes('Kathmandu')) return 'NPR';
    if (tz.includes('Sao_Paulo') || tz.includes('Brazil')) return 'BRL';
    if (tz.includes('Mexico')) return 'MXN';
    if (tz.includes('Istanbul')) return 'TRY';
    if (tz.includes('Moscow')) return 'RUB';
    if (tz.includes('Cairo')) return 'EGP';
    if (tz.includes('Lagos') || tz.includes('Johannesburg')) return 'ZAR';
  } catch {
    // ignore
  }
  return 'USD';
};

export const CurrencyConverter: React.FC = () => {
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [currencyList, setCurrencyList] = useState<string[]>([]);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState(() => detectLocalCurrency());
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isCached, setIsCached] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('starred_currencies');
      return saved ? JSON.parse(saved) : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];
    } catch {
      return ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];
    }
  });

  useEffect(() => {
    localStorage.setItem('starred_currencies', JSON.stringify(favorites));
  }, [favorites]);

  const fetchRates = async (force = false) => {
    setLoading(true);
    try {
      const cachedData = localStorage.getItem('currency_rates_cache');
      const cachedTime = localStorage.getItem('currency_rates_cache_time');
      const cacheExpiry = 60 * 60 * 1000; // 1 hour

      if (!force && cachedData && cachedTime && (Date.now() - Number(cachedTime) < cacheExpiry)) {
        const parsed = JSON.parse(cachedData);
        setRates(parsed);
        setCurrencyList(Object.keys(parsed).sort());
        setLastUpdated(new Date(Number(cachedTime)).toLocaleTimeString());
        setIsCached(true);
        setLoading(false);
        return;
      }

      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      
      setRates(data.rates);
      setCurrencyList(Object.keys(data.rates).sort());
      localStorage.setItem('currency_rates_cache', JSON.stringify(data.rates));
      localStorage.setItem('currency_rates_cache_time', Date.now().toString());
      setLastUpdated(new Date().toLocaleTimeString());
      setIsCached(false);
    } catch {
      const cachedData = localStorage.getItem('currency_rates_cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setRates(parsed);
        setCurrencyList(Object.keys(parsed).sort());
        setIsCached(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Compute conversion and log to history
  useEffect(() => {
    if (!rates || Object.keys(rates).length === 0) return;
    const amtVal = parseFloat(amount);
    if (isNaN(amtVal)) {
      setResult('');
      return;
    }

    const fromRate = rates[fromCurr] || 1;
    const toRate = rates[toCurr] || 1;
    const usdVal = amtVal / fromRate;
    const converted = usdVal * toRate;

    const formattedResult = converted < 0.1 ? converted.toFixed(6) : converted.toFixed(2);
    setResult(formattedResult);

    // Dynamic logger log
    if (amtVal > 0 && (window as any).logCalculation) {
      const fromDetails = getOrFallbackCurrency(fromCurr);
      const toDetails = getOrFallbackCurrency(toCurr);
      (window as any).logCalculation(
        'Currency Converter',
        `${amount} ${fromDetails.flag} ${fromCurr} ➔ ${formattedResult} ${toDetails.flag} ${toCurr}`
      );
    }
  }, [amount, fromCurr, toCurr, rates]);

  const swapCurrencies = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const toggleFavorite = (code: string) => {
    setFavorites(prev => {
      if (prev.includes(code)) return prev.filter(c => c !== code);
      return [...prev, code];
    });
  };

  // 🇺🇸 United States — US Dollar (USD) — $
  const getCurrencyDisplayString = (code: string) => {
    const info = getOrFallbackCurrency(code);
    return `${info.flag} ${info.country} — ${info.name} (${code}) — ${info.symbol}`;
  };

  const filteredFromList = currencyList.filter(code => 
    code.toLowerCase().includes(searchFrom.toLowerCase()) || 
    getCurrencyDisplayString(code).toLowerCase().includes(searchFrom.toLowerCase())
  );
  if (fromCurr && !filteredFromList.includes(fromCurr)) {
    filteredFromList.unshift(fromCurr);
  }

  const filteredToList = currencyList.filter(code => 
    code.toLowerCase().includes(searchTo.toLowerCase()) || 
    getCurrencyDisplayString(code).toLowerCase().includes(searchTo.toLowerCase())
  );
  if (toCurr && !filteredToList.includes(toCurr)) {
    filteredToList.unshift(toCurr);
  }

  const currentRate = rates[fromCurr] ? ((rates[toCurr] || 1) / rates[fromCurr]) : 1;
  const trendMultipliers = [0.985, 0.992, 0.988, 1.005, 0.997, 1.012, 1.00];
  const trendData = trendMultipliers.map(m => currentRate * m);
  const maxTrend = Math.max(...trendData);
  const minTrend = Math.min(...trendData);
  const range = maxTrend - minTrend || 1;
  const fromInfo = getOrFallbackCurrency(fromCurr);
  const toInfo = getOrFallbackCurrency(toCurr);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Live Market Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '12px 20px', borderRadius: 'var(--radius-md)', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <Globe size={16} className="text-gradient" />
          <span>Auto-Detected Currency: <strong>{toInfo.flag} {toInfo.country} ({toCurr})</strong></span>
          {isCached && <span style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '10px' }}><ShieldAlert size={14} /> Offline Cache</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span>Rates updated: <strong>{lastUpdated || 'Loading...'}</strong></span>
          <button onClick={() => fetchRates(true)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '4px' }} disabled={loading}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }} className="responsive-split">
        {/* Converter Panel */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign className="text-gradient" /> Multi-Currency Converter
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              style={{ fontSize: '1.1rem', fontWeight: '600' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '20px' }} className="responsive-split">
            {/* From Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From Currency</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search country / code..."
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    style={{ paddingLeft: '30px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.8rem' }}
                  />
                </div>
                <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)}>
                  {filteredFromList.map(code => (
                    <option key={code} value={code}>
                      {getCurrencyDisplayString(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <button
              onClick={swapCurrencies}
              className="btn-secondary"
              style={{ marginTop: '22px', padding: '12px', borderRadius: '50%', width: '42px', height: '42px' }}
              title="Swap Currencies"
            >
              <ArrowRightLeft size={16} />
            </button>

            {/* To Selector */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To Currency</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search country / code..."
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    style={{ paddingLeft: '30px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.8rem' }}
                  />
                </div>
                <select value={toCurr} onChange={(e) => setToCurr(e.target.value)}>
                  {filteredToList.map(code => (
                    <option key={code} value={code}>
                      {getCurrencyDisplayString(code)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Fetching live rates...</div>
          ) : (
            <div style={{ background: 'var(--bg-tertiary)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center', position: 'relative' }}>
              <button
                onClick={() => toggleFavorite(toCurr)}
                style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', padding: 0 }}
                title="Favorite this currency"
              >
                <Star size={20} fill={favorites.includes(toCurr) ? 'var(--accent-primary)' : 'none'} color={favorites.includes(toCurr) ? 'var(--accent-primary)' : 'currentColor'} />
              </button>
              
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {amount} {fromInfo.name} ({fromCurr}) =
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                {toInfo.symbol}{result} {toCurr}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                1 {fromCurr} = {rates[fromCurr] ? ((rates[toCurr] || 1) / rates[fromCurr]).toFixed(6) : '1.00'} {toCurr}
              </div>
            </div>
          )}
        </div>

        {/* Favorites Section */}
        <div className="glass-card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} className="text-gradient" /> Starred Comparisons
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Rates relative to <strong>1 {fromCurr}</strong>:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {favorites.filter(code => code !== fromCurr).map(favCode => {
              const baseRate = rates[fromCurr] || 1;
              const favRate = rates[favCode] || 1;
              const convertedValue = (1 / baseRate) * favRate;
              const favInfo = getOrFallbackCurrency(favCode);
              
              return (
                <div key={favCode} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{favInfo.flag}</span>
                    <div>
                      <strong style={{ fontSize: '0.85rem' }}>{favCode}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                        {favInfo.name}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent-secondary)', fontSize: '0.85rem' }}>
                    {favInfo.symbol}{convertedValue < 0.1 ? convertedValue.toFixed(4) : convertedValue.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Information Panel */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
          <Info size={16} className="text-gradient" /> Additional Currency Information & Central Bank Index
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="responsive-split">
          
          {/* Source Currency Info */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{fromInfo.flag}</span> Source Currency: {fromInfo.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Country Name:</span>
                <strong>{fromInfo.country}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Capital City:</span>
                <strong>{fromInfo.capital}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Central Bank:</span>
                <strong>{fromInfo.centralBank}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Currency Code:</span>
                <strong>{fromCurr}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Currency Symbol:</span>
                <strong>{fromInfo.symbol}</strong>
              </div>
            </div>
          </div>

          {/* Target Currency Info */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{toInfo.flag}</span> Target Currency: {toInfo.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Country Name:</span>
                <strong>{toInfo.country}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Capital City:</span>
                <strong>{toInfo.capital}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Central Bank:</span>
                <strong>{toInfo.centralBank}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Currency Code:</span>
                <strong>{toCurr}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Currency Symbol:</span>
                <strong>{toInfo.symbol}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Exchange Rate Analytics */}
        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '16px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '10px' }}>
          <span>Current Exchange Rate: <strong>1 {fromCurr} = {rates[fromCurr] ? ((rates[toCurr] || 1) / rates[fromCurr]).toFixed(6) : '1.00'} {toCurr}</strong></span>
          <span>Last Updated: <strong>{lastUpdated || 'N/A'}</strong></span>
        </div>
      </div>

      {/* Historical Trend Mock Section */}
      <div className="glass-card">
        <h3 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} className="text-gradient" /> 7-Day Trend: {fromCurr} / {toCurr}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Visual performance indices for 1 {fromCurr} relative to {toCurr}.
        </p>

        {/* Trend chart representation */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', background: 'var(--bg-tertiary)', padding: '20px 24px', borderRadius: 'var(--radius-md)', gap: '10px' }}>
          {trendData.map((rateVal, index) => {
            // Calculate height percent (min 15%, max 85%)
            const heightPercent = maxTrend === minTrend ? 50 : ((rateVal - minTrend) / range) * 70 + 15;
            const h = `${heightPercent}%`;
            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
                {/* Value display above bar */}
                <div style={{
                  position: 'absolute',
                  bottom: `calc(${h} + 6px)`,
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 6px',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: 'var(--text-primary)',
                  boxShadow: 'var(--glass-shadow)',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap'
                }}>
                  {toInfo.symbol}{rateVal.toFixed(4)}
                </div>
                
                <div style={{ height: h, width: '16px', background: 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))', borderRadius: '4px', transition: 'height var(--transition-normal)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>Day {index + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
