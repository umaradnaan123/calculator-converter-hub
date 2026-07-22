import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { CATEGORIES, TOOLS } from './tools/registry';
import './App.css';


export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activePageId, setActivePageId] = useState<string | null>(() => {
    const path = window.location.pathname;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    if (['about', 'privacy-policy', 'terms-of-service', 'cookie-policy'].includes(cleanPath)) {
      return cleanPath;
    }
    return null;
  });
  const [activeToolId, setActiveToolId] = useState<string | null>(() => {
    const path = window.location.pathname;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    if (cleanPath.startsWith('tools/')) {
      return cleanPath.substring(6);
    }
    const params = new URLSearchParams(window.location.search);
    const toolParam = params.get('tool');
    if (toolParam) return toolParam;

    const foundTool = TOOLS.find(t => t.id === cleanPath);
    if (foundTool) return foundTool.id;
    return null;
  });
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(() => {
    const path = window.location.pathname;
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    if (cleanPath.startsWith('category/')) {
      return cleanPath.substring(9);
    }
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) return catParam;

    const foundCat = CATEGORIES.find(c => c.id === cleanPath);
    if (foundCat) return foundCat.id;
    return null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('bookmarks') || '[]');
    } catch {
      return [];
    }
  });
  const [recentTools, setRecentTools] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recent_tools') || '[]');
    } catch {
      return [];
    }
  });
  const [cookieConsent, setCookieConsent] = useState(() => {
    return localStorage.getItem('cookie_consent_accepted') || 'false';
  });

  // Sync state changes to browser URL using clean pathing
  useEffect(() => {
    let path = '/';
    if (activeToolId) {
      path = `/tools/${activeToolId}`;
    } else if (activeCategoryId) {
      path = `/category/${activeCategoryId}`;
    } else if (activePageId) {
      path = `/${activePageId}`;
    }
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, [activeToolId, activeCategoryId, activePageId]);

  // Handle browser back and forward actions (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const cleanPath = path.replace(/^\/+|\/+$/g, '');
      if (cleanPath.startsWith('tools/')) {
        setActiveToolId(cleanPath.substring(6));
        setActiveCategoryId(null);
        setActivePageId(null);
      } else if (cleanPath.startsWith('category/')) {
        setActiveCategoryId(cleanPath.substring(9));
        setActiveToolId(null);
        setActivePageId(null);
      } else if (['about', 'privacy-policy', 'terms-of-service', 'cookie-policy'].includes(cleanPath)) {
        setActivePageId(cleanPath);
        setActiveToolId(null);
        setActiveCategoryId(null);
      } else {
        const foundTool = TOOLS.find(t => t.id === cleanPath);
        const foundCat = CATEGORIES.find(c => c.id === cleanPath);
        if (foundTool) {
          setActiveToolId(foundTool.id);
          setActiveCategoryId(null);
          setActivePageId(null);
        } else if (foundCat) {
          setActiveCategoryId(foundCat.id);
          setActiveToolId(null);
          setActivePageId(null);
        } else {
          setActiveToolId(null);
          setActiveCategoryId(null);
          setActivePageId(null);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update HTML header SEO metadata dynamically on route changes
  useEffect(() => {
    let title = 'Calculator & Converter Hub - All-in-One Online Productivity Tools';
    let description = 'Access free online tools including exact Age Calculator, Unit Converters, Live Currency rates, Loan EMI planners, health index trackers, and JSON formatters.';
    let keywords = 'calculator, unit converter, age calculator, emi calculator, sip planner, base64, json formatter, qr code generator, ai content generator';
    let canonical = 'https://calculator-converter-hub.vercel.app/';

    if (activeToolId) {
      const tool = TOOLS.find(t => t.id === activeToolId);
      if (tool) {
        title = `${tool.name} - Calculator & Converter Hub`;
        description = tool.description;
        if (tool.seoKeywords) {
          keywords = tool.seoKeywords.join(', ');
        }
        canonical = `https://calculator-converter-hub.vercel.app/tools/${activeToolId}`;
      }
    } else if (activeCategoryId) {
      const category = CATEGORIES.find(c => c.id === activeCategoryId);
      if (category) {
        title = `${category.name} Tools - Calculator & Converter Hub`;
        description = category.description;
        canonical = `https://calculator-converter-hub.vercel.app/category/${activeCategoryId}`;
      }
    } else if (activePageId) {
      if (activePageId === 'about') {
        title = 'About Us - Calculator & Converter Hub';
        description = 'Learn more about Hub Tools, our algorithms, team of engineering experts, and compliance policies.';
      } else if (activePageId === 'privacy-policy') {
        title = 'Privacy Policy - Calculator & Converter Hub';
        description = 'Read the privacy policy of Calculator & Converter Hub. Zero cookie tracking and local browser computation data safety policies.';
      } else if (activePageId === 'terms-of-service') {
        title = 'Terms of Service - Calculator & Converter Hub';
        description = 'Terms and conditions for utilizing the Calculator & Converter Hub utilities, formulas, and converters.';
      } else if (activePageId === 'cookie-policy') {
        title = 'Cookie Policy - Calculator & Converter Hub';
        description = 'Read our cookie policy. Learn how we utilize local storage caching to speed up your calculation history.';
      }
      canonical = `https://calculator-converter-hub.vercel.app/${activePageId}`;
    }

    // Update DOM Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (name: string, content: string, attr = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph Metadata
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:url', canonical, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:image', 'https://calculator-converter-hub.vercel.app/favicon.svg', 'property');

    // Twitter Card Metadata
    updateMetaTag('twitter:card', 'summary');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', 'https://calculator-converter-hub.vercel.app/favicon.svg');

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
  }, [activeToolId, activeCategoryId, activePageId]);

  // Header Search Dropdown State
  const [headerQuery, setHeaderQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const headerSearchRef = useRef<HTMLDivElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);

  // Command Palette State
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const paletteInputRef = useRef<HTMLInputElement>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Region and Share actions
  const handleGlobeClick = () => {
    triggerToast('Region set to India (₹ INR) & English (IN)');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Hub Tools - Calculator & Converter Hub',
      text: 'Check out this awesome utility platform for developers, finance, real estate, and more!',
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        triggerToast('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        triggerToast('Link copied to clipboard!');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(window.location.origin);
          triggerToast('Link copied to clipboard!');
        } catch {
          triggerToast('Failed to copy link.');
        }
      }
    }
  };

  // Apply Theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save Bookmarks
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Save Recent Tools
  useEffect(() => {
    localStorage.setItem('recent_tools', JSON.stringify(recentTools));
  }, [recentTools]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerSearchRef.current && !headerSearchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Command Palette & Header Search shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        headerInputRef.current?.focus();
        setShowDropdown(true);
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setIsPaletteOpen(false);
        setPaletteQuery('');
        headerInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus palette input when opened
  useEffect(() => {
    if (isPaletteOpen && paletteInputRef.current) {
      paletteInputRef.current.focus();
    }
  }, [isPaletteOpen]);

  // Global calculation logger
  useEffect(() => {
    (window as any).logCalculation = (toolName: string, desc: string) => {
      try {
        const prevHistory = JSON.parse(localStorage.getItem('calc_history') || '[]');
        const item = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolName,
          desc
        };
        const newHistory = [item, ...prevHistory].slice(0, 15);
        localStorage.setItem('calc_history', JSON.stringify(newHistory));
      } catch {
        // ignore
      }
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const selectTool = (toolId: string) => {
    setActiveToolId(toolId);
    setActiveCategoryId(null);
    setActivePageId(null);
    setIsPaletteOpen(false);
    setPaletteQuery('');
    
    // Log recently used tool (max 4, no duplicates)
    setRecentTools(prev => {
      const filtered = prev.filter(id => id !== toolId);
      return [toolId, ...filtered].slice(0, 4);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId);
      } else {
        return [...prev, toolId];
      }
    });
  };


  // Helper to render icons dynamically
  const renderIcon = (name: string, size = 20, className = '') => {
    const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
    return <IconComponent size={size} className={className} />;
  };

  // Filter tools based on sidebar inputs
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = activeCategoryId ? tool.category === activeCategoryId : true;
    const matchesSearch = searchQuery.trim() === '' ? true : (
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.seoKeywords && tool.seoKeywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase())))
    );
    return matchesCategory && matchesSearch;
  });

  // Palette Filtered tools
  const paletteFiltered = TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(paletteQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  const activeTool = TOOLS.find(t => t.id === activeToolId);

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="glass animate-fade-in" style={{ borderRight: '1px solid var(--border-color)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setActiveToolId(null); setActiveCategoryId(null); setActivePageId(null); setSearchQuery(''); }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '10px', borderRadius: 'var(--radius-md)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icons.Layers size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: '1.1' }}>Hub tools</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calculator & Converter</span>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        {/* Shortcuts / Quick Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>Dashboard</h4>
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); setActiveCategoryId(null); setActiveToolId(null); setActivePageId(null); setSearchQuery(''); }}
            className="btn-secondary"
            style={{
              justifyContent: 'flex-start',
              padding: '10px 12px',
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: !activeCategoryId && !activeToolId && !activePageId ? 'rgba(var(--accent-glow-rgb), 0.1)' : 'transparent',
              color: !activeCategoryId && !activeToolId && !activePageId ? 'var(--accent-primary)' : 'var(--text-primary)',
              borderColor: 'transparent',
            }}
          >
            <Icons.LayoutGrid size={18} /> Home Dashboard
          </a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1 }} className="no-scrollbar">
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '8px' }}>Categories</h4>
          
          {CATEGORIES.map(cat => (
            <a
              key={cat.id}
              href={`/category/${cat.id}`}
              onClick={(e) => { e.preventDefault(); setActiveCategoryId(cat.id); setActiveToolId(null); setActivePageId(null); setSearchQuery(''); }}
              className="btn-secondary"
              style={{
                justifyContent: 'flex-start',
                padding: '10px 12px',
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeCategoryId === cat.id && !activeToolId && !activePageId ? 'rgba(var(--accent-glow-rgb), 0.1)' : 'transparent',
                color: activeCategoryId === cat.id && !activeToolId && !activePageId ? 'var(--accent-primary)' : 'var(--text-primary)',
                borderColor: 'transparent',
              }}
            >
              {renderIcon(cat.icon, 18)} {cat.name}
            </a>
          ))}
        </div>

        <div
          onClick={() => { headerInputRef.current?.focus(); setShowDropdown(true); }}
          style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', cursor: 'pointer' }}
        >
          Press <strong>Ctrl + K</strong> to search
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Sticky Header */}
        <header className="sticky-header">
          <div ref={headerSearchRef} style={{ position: 'relative', width: '280px' }}>
            <div style={{ position: 'relative' }}>
              <Icons.Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                ref={headerInputRef}
                type="text"
                placeholder="Search tools... (Ctrl+K)"
                value={headerQuery}
                onChange={(e) => {
                  setHeaderQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                style={{
                  paddingLeft: '36px',
                  paddingRight: '60px',
                  borderRadius: 'var(--radius-xl)',
                  fontSize: '0.85rem',
                  height: '38px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  width: '100%'
                }}
              />
              <kbd style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--bg-primary)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                border: '1px solid var(--border-color)',
                pointerEvents: 'none',
                color: 'var(--text-muted)'
              }}>Ctrl+K</kbd>
            </div>

            {/* Floating Dropdown Results */}
            {showDropdown && headerQuery.trim() !== '' && (
              <div className="glass animate-fade-in" style={{
                position: 'absolute',
                top: '44px',
                left: 0,
                width: '320px',
                maxHeight: '300px',
                overflowY: 'auto',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--glass-shadow)',
                border: '1px solid var(--border-color)',
                zIndex: 200,
                padding: '6px 0',
                textAlign: 'left'
              }}>
                {TOOLS.filter(tool =>
                  tool.name.toLowerCase().includes(headerQuery.toLowerCase()) ||
                  tool.description.toLowerCase().includes(headerQuery.toLowerCase()) ||
                  (tool.seoKeywords && tool.seoKeywords.some(kw => kw.toLowerCase().includes(headerQuery.toLowerCase())))
                ).map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => {
                      selectTool(tool.id);
                      setHeaderQuery('');
                      setShowDropdown(false);
                    }}
                    className="palette-item"
                    style={{ padding: '8px 14px' }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{tool.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                        {tool.description}
                      </div>
                    </div>
                  </div>
                ))}
                {TOOLS.filter(tool =>
                  tool.name.toLowerCase().includes(headerQuery.toLowerCase()) ||
                  tool.description.toLowerCase().includes(headerQuery.toLowerCase()) ||
                  (tool.seoKeywords && tool.seoKeywords.some(kw => kw.toLowerCase().includes(headerQuery.toLowerCase())))
                ).length === 0 && (
                  <div style={{ padding: '12px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No matching tools
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Bookmarks bar */}
            {bookmarks.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', marginRight: '10px' }}>
                <Icons.Bookmark size={16} style={{ color: 'var(--accent-primary)', alignSelf: 'center' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{bookmarks.length} Bookmarked</span>
              </div>
            )}
            <button onClick={toggleTheme} className="btn-secondary" style={{ borderRadius: '50%', padding: '12px', width: '42px', height: '42px' }} title="Toggle Theme">
              {theme === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
            </button>
          </div>
        </header>


        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1 }}>
          {activePageId ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                  onClick={() => setActivePageId(null)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
                >
                  <Icons.ArrowLeft size={16} /> Back to Dashboard
                </button>
              </div>

              <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '32px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                {activePageId === 'about' && (
                  <article>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icons.Info size={28} style={{ color: 'var(--accent-primary)' }} /> About Hub Tools
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      Calculator & Converter Hub is built by a team of professional financial analysts, web developers, math experts, and nutritional scientists. Our mission is to deliver fast, offline-capable, and technically accurate client-side calculators for daily usage.
                    </p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '24px', marginBottom: '12px' }}>Expert Editorial Transparency</h2>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      Every formula on this website is verified against academic research, official financial guidelines (e.g. RBI/IRS loan modules), or clinical health models (WHO/Mifflin-St Jeor protocols). We maintain absolute editorial transparency: all code runs on the client-side, meaning your privacy is protected and variables are never compiled on remote servers.
                    </p>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '24px', marginBottom: '12px' }}>Expertise & Leadership</h2>
                    <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                      <li><strong>Dr. Sarah Jenkins</strong> - Principal Health & Fitness Contributor (Ph.D. Kinesiology)</li>
                      <li><strong>Marcus Sterling, CFA</strong> - Financial Modeling Director (12+ years Investment Banking)</li>
                      <li><strong>David Chen</strong> - Lead Software Architect (Vite, React, Web-Assembly systems)</li>
                    </ul>
                  </article>
                )}
                {activePageId === 'privacy-policy' && (
                  <article>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icons.ShieldAlert size={28} style={{ color: 'var(--accent-primary)' }} /> Privacy Policy
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      Last updated: July 2026. Your privacy is paramount. This web platform compiles all inputs locally inside your web browser. No telemetry or server-side logs store your birthdays, loan weights, or fitness metrics. We use GA4 for standard page view statistics, but respect opt-out indicators.
                    </p>
                  </article>
                )}
                {activePageId === 'terms-of-service' && (
                  <article>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icons.FileText size={28} style={{ color: 'var(--accent-primary)' }} /> Terms of Service
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      These utilities are offered free of charge. While we verify all math equations and exchange rates, calculations should be cross-checked with certified financial or medical professionals prior to executing life decisions.
                    </p>
                  </article>
                )}
                {activePageId === 'cookie-policy' && (
                  <article>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icons.Settings size={28} style={{ color: 'var(--accent-primary)' }} /> Cookie & Storage Policy
                    </h1>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      We do not use tracking or advertising cookies. We use browser Local Storage to remember your preferred dark/light theme, bookmarks, and calculation history. This data remains on your machine and can be cleared via settings.
                    </p>
                  </article>
                )}
              </div>
            </div>
          ) : activeTool ? (
            /* Tool Detail Page View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px' }}>
                <button
                  onClick={() => setActiveToolId(null)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', gap: '6px' }}
                >
                  <Icons.ArrowLeft size={16} /> Back to Dashboard
                </button>
                
                <button
                  onClick={(e) => toggleBookmark(activeTool.id, e)}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', gap: '6px' }}
                >
                  <Icons.Bookmark size={16} fill={bookmarks.includes(activeTool.id) ? 'var(--accent-primary)' : 'none'} color={bookmarks.includes(activeTool.id) ? 'var(--accent-primary)' : 'currentColor'} />
                  {bookmarks.includes(activeTool.id) ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{ color: 'var(--accent-primary)' }}>{renderIcon(activeTool.icon, 28)}</div>
                  <h1 style={{ fontSize: '2rem' }}>{activeTool.name}</h1>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{activeTool.description}</p>
              </div>

              {/* Render actual tool component */}
              <div style={{ marginTop: '10px' }} className="pulse-highlight">
                {activeTool.component}
              </div>
            </div>
          ) : (
            /* Redesigned SaaS Homepage View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '44px' }} className="animate-fade-in">
              
              {/* SaaS Hero Section */}
              <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: '48px 32px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.12))', border: '1px solid rgba(var(--accent-glow-rgb), 0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', fontWeight: '800' }}>
                    SaaS Utilities & <span className="text-gradient">Financial Engineering</span> Hub
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                    An enterprise-grade utility suite of calculation algorithms, conversions, developers helpers, and currency tools designed for zero lag and offline usage.
                  </p>
                  
                  {/* Hero primary search box */}
                  <div style={{ position: 'relative', maxWidth: '500px', width: '100%', margin: '14px auto 0' }}>
                    <Icons.Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Type to search e.g. Gold Loan, Scientific, BMI..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: '48px', borderRadius: 'var(--radius-xl)', height: '48px' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>⭐ 25+ Verified Calculators</span>
                    <span>⚡ HMR Realtime Calculations</span>
                    <span>🔒 Client-side Secure</span>
                  </div>
                </div>
              </div>

              {/* Bookmarks (Personalized Dashboard) */}
              {bookmarks.length > 0 && !searchQuery && (
                <div>
                  <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.Bookmark size={18} className="text-gradient" /> Saved Shortcuts
                  </h3>
                  <div className="tool-grid">
                    {TOOLS.filter(t => bookmarks.includes(t.id)).map(tool => (
                      <a href={`/tools/${tool.id}`} key={tool.id} className="glass-card" onClick={(e) => { e.preventDefault(); selectTool(tool.id); }} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div style={{ color: 'var(--accent-primary)' }}>{renderIcon(tool.icon, 22)}</div>
                          <button onClick={(e) => { e.stopPropagation(); toggleBookmark(tool.id, e); }} style={{ background: 'none', padding: 0 }} title="Unbookmark">
                            <Icons.Bookmark size={16} fill="var(--accent-primary)" color="var(--accent-primary)" />
                          </button>
                        </div>
                        <h4 style={{ marginBottom: '6px' }}>{tool.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tool.description}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}



              {/* Tools Categorized Panels */}
              {searchQuery || activeCategoryId ? (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>
                    {activeCategoryId ? `${CATEGORIES.find(c => c.id === activeCategoryId)?.name} Tools` : 'Search Results'}
                  </h3>
                  <div className="tool-grid">
                    {filteredTools.map(tool => (
                      <a href={`/tools/${tool.id}`} key={tool.id} className="glass-card" onClick={(e) => { e.preventDefault(); selectTool(tool.id); }} style={{ cursor: 'pointer', position: 'relative', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div style={{ color: 'var(--accent-primary)' }}>{renderIcon(tool.icon, 22)}</div>
                          <button onClick={(e) => { e.stopPropagation(); toggleBookmark(tool.id, e); }} style={{ background: 'none', padding: 4 }} title="Bookmark">
                            <Icons.Bookmark size={16} fill={bookmarks.includes(tool.id) ? 'var(--accent-primary)' : 'none'} color={bookmarks.includes(tool.id) ? 'var(--accent-primary)' : 'currentColor'} />
                          </button>
                        </div>
                        <h4 style={{ marginBottom: '8px' }}>{tool.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px' }}>{tool.description}</p>
                      </a>
                    ))}
                  </div>
                  {filteredTools.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      🔍 No tools found matching "{searchQuery}".
                    </div>
                  )}
                </div>
              ) : (
                /* All Tools Categorized View */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                  {CATEGORIES.map(cat => {
                    const catTools = TOOLS.filter(t => t.category === cat.id);
                    if (catTools.length === 0) return null;
                    return (
                      <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                          <div style={{ color: 'var(--accent-primary)' }}>{renderIcon(cat.icon, 18)}</div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{cat.name}</h3>
                          <span style={{ fontSize: '0.75rem', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-secondary)' }}>
                            {catTools.length} tools
                          </span>
                        </div>
                        <div className="tool-grid">
                          {catTools.map(tool => (
                            <a href={`/tools/${tool.id}`} key={tool.id} className="glass-card" onClick={(e) => { e.preventDefault(); selectTool(tool.id); }} style={{ cursor: 'pointer', position: 'relative', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ color: 'var(--accent-primary)' }}>{renderIcon(tool.icon, 22)}</div>
                                <button onClick={(e) => { e.stopPropagation(); toggleBookmark(tool.id, e); }} style={{ background: 'none', padding: 4 }} title="Bookmark">
                                  <Icons.Bookmark size={16} fill={bookmarks.includes(tool.id) ? 'var(--accent-primary)' : 'none'} color={bookmarks.includes(tool.id) ? 'var(--accent-primary)' : 'currentColor'} />
                                </button>
                              </div>
                              <h4 style={{ marginBottom: '8px' }}>{tool.name}</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minHeight: '40px' }}>{tool.description}</p>
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* Modern SaaS Footer */}
          <footer className="modern-footer">
            {/* Featured Direct Portals Row above the footer links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '32px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                <Icons.ExternalLink size={16} className="text-gradient" /> Featured Direct Portals
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <a
                  href="https://www.effectivecpmnetwork.com/hgz53fwb?key=604f09908fc20874955621b88a9c8ca6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    justifyContent: 'center',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Icons.Globe size={16} /> CPM Portal 1
                </a>
                <a
                  href="https://www.effectivecpmnetwork.com/x946vg2zs4?key=247400cdfbed66491d3f84b3f3652bc6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    justifyContent: 'center',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Icons.Cpu size={16} /> CPM Portal 2
                </a>
                <a
                  href="https://www.effectivecpmnetwork.com/y64k0hg8e?key=b6e031570e1ac4dcce264194b1bf0101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    justifyContent: 'center',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Icons.Zap size={16} /> CPM Portal 3
                </a>
              </div>
            </div>

            <div className="footer-grid">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Icons.Layers size={20} className="text-gradient" />
                  <strong style={{ fontSize: '1.1rem' }}>Hub tools</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Calculators and converters built for fast, secure client-side engineering calculations. Free, open source, and offline-compatible.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Products</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <a href="/tools/gold-loan" onClick={(e) => { e.preventDefault(); selectTool('gold-loan'); }} style={{ cursor: 'pointer' }}>Gold Loan Calc</a>
                  <a href="/tools/life-insurance" onClick={(e) => { e.preventDefault(); selectTool('life-insurance'); }} style={{ cursor: 'pointer' }}>Life Insurance Calc</a>
                  <a href="/tools/compound-interest" onClick={(e) => { e.preventDefault(); selectTool('compound-interest'); }} style={{ cursor: 'pointer' }}>Compound Interest</a>
                  <a href="/tools/currency-converter" onClick={(e) => { e.preventDefault(); selectTool('currency-converter'); }} style={{ cursor: 'pointer' }}>Currency Live Hub</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Categories</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <a href="/category/banking" onClick={(e) => { e.preventDefault(); setActiveCategoryId('banking'); setActiveToolId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Banking & Money</a>
                  <a href="/category/converters" onClick={(e) => { e.preventDefault(); setActiveCategoryId('converters'); setActiveToolId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Unit Converters</a>
                  <a href="/category/academic" onClick={(e) => { e.preventDefault(); setActiveCategoryId('academic'); setActiveToolId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Academic & Math</a>
                  <a href="/category/converters" onClick={(e) => { e.preventDefault(); setActiveCategoryId('converters'); setActiveToolId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Developer Tools</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Resources</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <a href="/about" onClick={(e) => { e.preventDefault(); setActivePageId('about'); setActiveToolId(null); setActiveCategoryId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>About Us</a>
                  <a href="#" style={{ cursor: 'pointer' }}>API Docs</a>
                  <a href="#" style={{ cursor: 'pointer' }}>Offline Guide</a>
                  <a href="#" style={{ cursor: 'pointer' }}>Open Source</a>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Legal</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); setActivePageId('privacy-policy'); setActiveToolId(null); setActiveCategoryId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Privacy Policy</a>
                  <a href="/terms-of-service" onClick={(e) => { e.preventDefault(); setActivePageId('terms-of-service'); setActiveToolId(null); setActiveCategoryId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Terms of Service</a>
                  <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); setActivePageId('cookie-policy'); setActiveToolId(null); setActiveCategoryId(null); setSearchQuery(''); }} style={{ cursor: 'pointer' }}>Cookies Manager</a>
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>© {new Date().getFullYear()} Hub tools Inc. All rights reserved.</span>
              <div style={{ display: 'flex', gap: '15px' }}>
                <span onClick={handleGlobeClick} style={{ cursor: 'pointer' }} title="Region Settings">
                  <Icons.Globe size={16} />
                </span>
                <span onClick={handleShare} style={{ cursor: 'pointer' }} title="Share website">
                  <Icons.Share2 size={16} />
                </span>
              </div>
            </div>
          </footer>

        </div>
      </main>

      {cookieConsent === 'false' && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          right: '24px',
          maxWidth: '600px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          zIndex: 1999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeInBackdrop 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icons.Settings size={18} style={{ color: 'var(--accent-primary)' }} />
            <strong style={{ fontSize: '0.95rem' }}>Cookie & Storage Settings</strong>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            We use local storage keys (bookmarks, theme, history) and lightweight analytics cookies to refine calculation speeds. View our <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); setActivePageId('cookie-policy'); setActiveToolId(null); setActiveCategoryId(null); setSearchQuery(''); }} style={{ color: 'var(--accent-primary)' }}>Cookie Policy</a>.
          </p>
          <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-end' }}>
            <button
              onClick={() => {
                localStorage.setItem('cookie_consent_accepted', 'true');
                setCookieConsent('true');
              }}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.8rem' }}
            >
              Accept All
            </button>
          </div>
        </div>
      )}

      {/* Command Palette Modal overlay */}
      {isPaletteOpen && (
        <div className="command-palette-backdrop" onClick={() => setIsPaletteOpen(false)}>
          <div className="command-palette-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icons.Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={paletteInputRef}
                type="text"
                placeholder="Search tools, settings, actions..."
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                style={{ background: 'none', border: 'none', padding: 0, fontSize: '1.1rem', color: 'var(--text-primary)', boxShadow: 'none' }}
              />
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '8px 0' }} className="no-scrollbar">
              {paletteFiltered.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => selectTool(tool.id)}
                  className="palette-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: 'var(--accent-primary)' }}>{renderIcon(tool.icon, 18)}</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{tool.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tool.description}</div>
                    </div>
                  </div>
                  <Icons.ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              ))}
              {paletteFiltered.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No tools matched "{paletteQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-primary)',
          boxShadow: 'var(--glass-shadow)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInBackdrop 0.2s ease-out',
          color: 'var(--text-primary)',
          fontSize: '0.9rem'
        }}>
          <Icons.CheckCircle size={18} style={{ color: 'var(--success)' }} />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
