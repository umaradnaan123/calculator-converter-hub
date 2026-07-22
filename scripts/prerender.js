import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// Define SEO copy for the home page, categories, and popular tools
const CATEGORIES_INFO = {
  'age-date': {
    name: 'Age & Date Calculators',
    desc: 'Calculate exact ages, count date differences, and track event countdowns with precision.',
    formula: 'Age = Current Date - Birth Date (calculated precisely in years, months, days, hours, and seconds).',
    howItWorks: 'Input a birth date or start/end dates. The engine handles leap years and variable month lengths automatically to return precise interval metrics.',
    faqs: [
      { q: 'How does the Age Calculator compute months and days?', a: 'It calculates months and days by subtracting the dates step-by-step and adjusting for negative days using the count of the previous month.' }
    ]
  },
  'converters': {
    name: 'Unit Converters',
    desc: 'Convert length, weight, temperature, area, volume, speed, time, and digital storage units instantly.',
    formula: 'Converts base values utilizing standardized international conversion coefficients.',
    howItWorks: 'Select your source unit and destination unit, enter the value, and the engine updates calculations instantly on keypress.',
    faqs: [
      { q: 'Is the Unit Converter accurate?', a: 'Yes, it uses double-precision floats and certified international conversion factors for metric-to-imperial translations.' }
    ]
  },
  'currency': {
    name: 'Live Currency Exchange Hub',
    desc: 'Convert global currencies using real-time foreign exchange feed rates.',
    formula: 'Target Amount = Base Amount * Live Exchange Rate Coefficient.',
    howItWorks: 'Select base and target currencies. The live conversion rate is calculated based on cache-optimized currency feed data.',
    faqs: [
      { q: 'How often do the currency rates update?', a: 'Exchange rates are updated continuously using public financial rates feeds.' }
    ]
  },
  'finance': {
    name: 'Financial & Wealth Planners',
    desc: 'Plan systematic investments, auto/home loan EMIs, and compounding interest portfolios.',
    formula: 'EMI = [P x R x (1+R)^N]/[(1+R)^N - 1] and Compound Interest = P * (1 + r/n)^(n*t).',
    howItWorks: 'Provide principal loan amount, interest rate, and duration. Amortization and systematic tables are generated instantly.',
    faqs: [
      { q: 'What is a SIP?', a: 'SIP stands for Systematic Investment Plan, which allows regular mutual fund deposits compounding over time.' }
    ]
  },
  'health': {
    name: 'Health & Fitness Trackers',
    desc: 'Monitor Body Mass Index (BMI), Basal Metabolic Rate (BMR), and daily hydration guidelines.',
    formula: 'BMI = weight (kg) / height^2 (m^2) and BMR (Harris-Benedict formula).',
    howItWorks: 'Enter your biometric inputs (height, weight, age, activity level) to evaluate health classifications.',
    faqs: [
      { q: 'What is a healthy BMI range?', a: 'A BMI between 18.5 and 24.9 is considered normal weight according to World Health Organization criteria.' }
    ]
  },
  'academic': {
    name: 'Academic & Mathematics Tools',
    desc: 'Evaluate advanced algebraic equations, semester grade point averages (GPA), and percentage changes.',
    formula: 'GPA = Total Grade Points / Total Credit Hours.',
    howItWorks: 'Input grade metrics, math coefficients, or percentage parameters to get instant mathematical results.',
    faqs: [
      { q: 'Can I calculate both GPA and CGPA?', a: 'Yes, our tracker handles course-by-course grade values and cumulative semester evaluations.' }
    ]
  }
};

const TOOLS_INFO = {
  'age-calculator': {
    name: 'Age Calculator',
    desc: 'Compute your exact age in years, months, weeks, days, hours, and seconds since your birthdate.',
    formula: 'Age = Current Date - Date of Birth, with adjustments for leap years.',
    howItWorks: 'Select your birth date and time, and our system compares it with the current live system clock.',
    faqs: [
      { q: 'Is my birthdate data secure?', a: 'Absolutely, all calculations are performed locally in your web browser. No date of birth data is ever sent to a server.' }
    ]
  },
  'gold-loan': {
    name: 'Gold Loan Calculator',
    desc: 'Calculate maximum gold loan values (LTV), interest schedules, and monthly EMI payments based on gold purity and weight.',
    formula: 'Loan Amount = Gold Weight (Grams) * Purity Rate * Loan-to-Value (LTV) Ratio.',
    howItWorks: 'Input gold weight in grams, select purity carat (18k to 24k), and input interest rates. It computes instant loan capacities.',
    faqs: [
      { q: 'What is LTV in gold loans?', a: 'LTV stands for Loan-to-Value, which is the percentage of the gold market value that financial institutions can lend (typically up to 75%).' }
    ]
  },
  'life-insurance': {
    name: 'Life Insurance Calculator',
    desc: 'Evaluate your Human Life Value (HLV), family protection requirements, and term insurance coverage needs.',
    formula: 'HLV = (Annual Income - Personal Expenses) * Number of Working Years remaining.',
    howItWorks: 'Provide your annual income, expenses, liabilities, and current savings to compute the gap in family protection.',
    faqs: [
      { q: 'What is the HLV method?', a: 'Human Life Value (HLV) calculates the present value of future earnings that a family would lose in the event of an earner death.' }
    ]
  },
  'emi-calculator': {
    name: 'Loan EMI Calculator',
    desc: 'Calculate monthly home, auto, or personal loan payments with complete interest amortization schedule reports.',
    formula: 'EMI = [P x R x (1+R)^N]/[(1+R)^N - 1]',
    howItWorks: 'Input loan amount, annual interest rate, and duration in years. Amortization tables showing principal and interest breakdowns are generated.',
    faqs: [
      { q: 'Can I use this for mortgages?', a: 'Yes, it works for home loans, car loans, and personal credit lines.' }
    ]
  },
  'sip-calculator': {
    name: 'SIP Calculator',
    desc: 'Calculate compounding future wealth and estimated returns on systematic investment plans in mutual funds.',
    formula: 'FV = P * [((1 + i)^n - 1) / i] * (1 + i)',
    howItWorks: 'Select monthly contribution, estimated annual rate of return, and period. It computes wealth gains instantly.',
    faqs: [
      { q: 'What is compounding interest in SIP?', a: 'Earnings are reinvested to generate their own returns, amplifying wealth exponentially over time.' }
    ]
  },
  'currency-converter': {
    name: 'Live Currency Converter',
    desc: 'Calculate and convert global foreign exchange currencies using real-time forex exchange rates.',
    formula: 'Converted Amount = Amount * Exchange Rate.',
    howItWorks: 'Select origin currency and destination currency to instantly process calculations.',
    faqs: [
      { q: 'Are the exchange rates real-time?', a: 'Yes, rates are synchronized with international market feeds.' }
    ]
  }
};

const CATEGORIES = [
  { id: 'age-date', name: 'Age & Date' },
  { id: 'converters', name: 'Unit Converters' },
  { id: 'currency', name: 'Currency Hub' },
  { id: 'finance', name: 'Financial Planners' },
  { id: 'health', name: 'Health & Fitness' },
  { id: 'academic', name: 'Academic & Math' },
  { id: 'travel', name: 'Travel & Global' },
  { id: 'lifestyle', name: 'Home & Lifestyle' },
  { id: 'vehicle', name: 'Vehicle & Transport' },
  { id: 'shopping', name: 'Shopping Planners' },
  { id: 'fitness', name: 'Sports & Training' },
  { id: 'personal', name: 'Family & Personal' },
  { id: 'banking', name: 'Banking & Money' },
  { id: 'business', name: 'Business & Startup' },
  { id: 'weather', name: 'Weather & Climate' },
  { id: 'realestate', name: 'Real Estate Tools' },
  { id: 'nutrition', name: 'Food & Nutrition' }
];

const TOOLS = [
  { id: 'age-calculator', name: 'Age Calculator', category: 'age-date' },
  { id: 'date-difference', name: 'Date Difference Calculator', category: 'age-date' },
  { id: 'countdown-timer', name: 'Event Countdown', category: 'age-date' },
  { id: 'unit-converter', name: 'Universal Unit Converter', category: 'converters' },
  { id: 'currency-converter', name: 'Currency Converter', category: 'currency' },
  { id: 'emi-calculator', name: 'Loan EMI Calculator', category: 'finance' },
  { id: 'sip-calculator', name: 'SIP Calculator', category: 'finance' },
  { id: 'compound-interest', name: 'Compound Interest Calculator', category: 'finance' },
  { id: 'bmi-calculator', name: 'BMI Calculator', category: 'health' },
  { id: 'bmr-calculator', name: 'BMR Calorie Calculator', category: 'health' },
  { id: 'water-intake', name: 'Water Intake Calculator', category: 'health' },
  { id: 'scientific-calculator', name: 'Scientific Calculator', category: 'academic' },
  { id: 'gpa-calculator', name: 'GPA & CGPA Calculator', category: 'academic' },
  { id: 'percentage-calculator', name: 'Percentage Calculator', category: 'academic' },
  { id: 'timezone-converter', name: 'Time Zone Converter', category: 'travel' },
  { id: 'world-clock', name: 'World Clock', category: 'travel' },
  { id: 'packing-checklist', name: 'Packing Checklist', category: 'travel' },
  { id: 'electricity-bill', name: 'Electricity Cost Calculator', category: 'lifestyle' },
  { id: 'rent-affordability', name: 'Rent Affordability', category: 'lifestyle' },
  { id: 'paint-calculator', name: 'Wall Paint Calculator', category: 'lifestyle' },
  { id: 'fuel-mileage', name: 'Fuel Mileage Calculator', category: 'vehicle' },
  { id: 'ev-charging', name: 'EV Charging Cost', category: 'vehicle' },
  { id: 'vehicle-depreciation', name: 'Car Depreciation Calculator', category: 'vehicle' },
  { id: 'discount-calculator', name: 'Discount Calculator', category: 'shopping' },
  { id: 'profit-margin', name: 'Profit Margin Calculator', category: 'shopping' },
  { id: 'vat-gst', name: 'VAT / GST Calculator', category: 'shopping' },
  { id: 'running-pace', name: 'Running Pace Calculator', category: 'fitness' },
  { id: 'workout-calorie', name: 'Workout Calorie Burn', category: 'fitness' },
  { id: 'one-rep-max', name: 'One Rep Max (1RM)', category: 'fitness' },
  { id: 'protein-intake', name: 'Protein Intake Calculator', category: 'fitness' },
  { id: 'pregnancy-due-date', name: 'Pregnancy Due Date', category: 'personal' },
  { id: 'ovulation-calculator', name: 'Ovulation Calendar', category: 'personal' },
  { id: 'life-expectancy', name: 'Longevity Estimator', category: 'personal' },
  { id: 'loan-eligibility', name: 'Loan Eligibility Calculator', category: 'banking' },
  { id: 'savings-goal', name: 'Savings Goal Planner', category: 'banking' },
  { id: 'inflation-purchasing', name: 'Inflation Calculator', category: 'banking' },
  { id: 'gold-loan', name: 'Gold Loan Calculator', category: 'banking' },
  { id: 'life-insurance', name: 'Life Insurance Calculator', category: 'banking' },
  { id: 'break-even', name: 'Break-Even Calculator', category: 'business' },
  { id: 'roi-gains', name: 'ROI Return Calculator', category: 'business' },
  { id: 'startup-runway', name: 'Startup Runway Planner', category: 'business' },
  { id: 'weather-aqi', name: 'Weather & AQI Dashboard', category: 'weather' },
  { id: 'carbon-footprint', name: 'Carbon Footprint Calculator', category: 'weather' },
  { id: 'solar-savings', name: 'Solar Panel Savings', category: 'weather' },
  { id: 'rental-yield', name: 'Rental Yield Calculator', category: 'realestate' },
  { id: 'home-affordability', name: 'Home Affordability Calculator', category: 'realestate' },
  { id: 'property-appreciation', name: 'Property Appreciation Calculator', category: 'realestate' },
  { id: 'macro-nutrient', name: 'Macro Nutrient Calculator', category: 'nutrition' },
  { id: 'healthy-weight', name: 'Healthy Weight Calculator', category: 'nutrition' },
  { id: 'meal-planner', name: 'Meal Planner Recommendations', category: 'nutrition' }
];

// Helper to write static pre-rendered file
function writeHTMLFile(routeDir, fileName, title, desc, canonical, mainHtmlContent, schemaJson) {
  const targetDir = path.join(DIST_DIR, routeDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Replace default title and meta tags
  template = template.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
  
  const metaDescriptionRegex = /<meta name="description" content=".*?" \/>/;
  if (metaDescriptionRegex.test(template)) {
    template = template.replace(metaDescriptionRegex, `<meta name="description" content="${desc}" />`);
  } else {
    template = template.replace('</head>', `<meta name="description" content="${desc}" />\n</head>`);
  }

  // Inject OG & Twitter & Canonical
  const seoHeaderTags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://calculator-converter-hub.vercel.app/favicon.svg" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="https://calculator-converter-hub.vercel.app/favicon.svg" />
  `;
  template = template.replace('</head>', `${seoHeaderTags}\n</head>`);

  // Inject pre-rendered JSON-LD schema
  if (schemaJson) {
    const schemaTag = `\n<script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n</script>\n`;
    template = template.replace('</head>', `${schemaTag}\n</head>`);
  }

  // Pre-render content inside <div id="root">
  const rootDivRegex = /<div id="root">.*?<\/div>/s;
  const rootReplacement = `<div id="root">${mainHtmlContent}</div>`;
  template = template.replace(rootDivRegex, rootReplacement);

  const finalPath = path.join(targetDir, fileName);
  fs.writeFileSync(finalPath, template, 'utf8');
  console.log(`Saved pre-rendered: ${routeDir}/${fileName}`);
}

function generateHomepageContent() {
  const categoriesHtml = CATEGORIES.map(cat => `
    <div style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px;">
      <h3><a href="/category/${cat.id}">${cat.name}</a></h3>
      <p>Explore tools for ${cat.name}.</p>
    </div>
  `).join('');

  return `
    <div style="padding: 32px; max-width: 1000px; margin: 0 auto; font-family: sans-serif;">
      <h1>Calculator & Converter Hub</h1>
      <p>Your enterprise-grade utility suite of calculation algorithms, conversions, developers helpers, and currency tools designed for zero lag and offline usage.</p>
      
      <h2>Browse Categories</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin: 24px 0;">
        ${categoriesHtml}
      </div>

      <footer style="margin-top: 48px; border-top: 1px solid var(--border-color); padding-top: 24px;">
        <p>© ${new Date().getFullYear()} Hub tools Inc. All rights reserved.</p>
      </footer>
    </div>
  `;
}

function run() {
  console.log('Starting static site pre-rendering (SSG)...');

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('Error: index.html template not found in dist. Run build first.');
    process.exit(1);
  }

  // Pre-render Homepage
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Calculator & Converter Hub',
    'url': 'https://calculator-converter-hub.vercel.app/',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://calculator-converter-hub.vercel.app/?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
  writeHTMLFile('', 'index.html', 'Calculator & Converter Hub - All-in-One Online Productivity Tools', 'Access free online tools including exact Age Calculator, Unit Converters, Live Currency rates, Loan EMI planners, health index trackers, and JSON formatters.', 'https://calculator-converter-hub.vercel.app/', generateHomepageContent(), homeSchema);

  // Pre-render Categories
  for (const cat of CATEGORIES) {
    const info = CATEGORIES_INFO[cat.id] || {
      name: `${cat.name} Tools`,
      desc: `Access various useful tools related to ${cat.name}.`,
      formula: '',
      howItWorks: `Browse and use tools in the ${cat.name} category.`,
      faqs: []
    };

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://calculator-converter-hub.vercel.app/' },
        { '@type': 'ListItem', 'position': 2, 'name': info.name, 'item': `https://calculator-converter-hub.vercel.app/category/${cat.id}` }
      ]
    };

    const toolsInCategory = TOOLS.filter(t => t.category === cat.id);
    const toolsHtml = toolsInCategory.map(t => `
      <div style="padding: 12px; border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 12px;">
        <h4><a href="/tools/${t.id}">${t.name}</a></h4>
        <p>${t.name} calculations.</p>
      </div>
    `).join('');

    const mainHtml = `
      <div style="padding: 32px; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
        <nav style="font-size: 0.85rem; margin-bottom: 24px; color: var(--text-muted);">
          <a href="/">Home</a> > <span>${info.name}</span>
        </nav>
        <h1>${info.name}</h1>
        <p>${info.desc}</p>
        
        <h2>Available Utilities</h2>
        <div style="margin: 20px 0;">
          ${toolsHtml}
        </div>

        ${info.formula ? `<h3>Conversion Logic & Formulas</h3><p>${info.formula}</p>` : ''}
        <h3>Usage Guide</h3>
        <p>${info.howItWorks}</p>
      </div>
    `;

    writeHTMLFile(`category/${cat.id}`, 'index.html', `${info.name} - Calculator & Converter Hub`, info.desc, `https://calculator-converter-hub.vercel.app/category/${cat.id}`, mainHtml, breadcrumbs);
  }

  // Pre-render Tools
  for (const tool of TOOLS) {
    const info = TOOLS_INFO[tool.id] || {
      name: tool.name,
      desc: `Calculate and solve complex ${tool.name} calculations instantly.`,
      formula: 'Standard mathematical equations applied locally.',
      howItWorks: `Provide your input data and values into the ${tool.name} fields to calculate solutions.`,
      faqs: []
    };

    const breadcrumbs = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://calculator-converter-hub.vercel.app/' },
        { '@type': 'ListItem', 'position': 2, 'name': tool.name, 'item': `https://calculator-converter-hub.vercel.app/tools/${tool.id}` }
      ]
    };

    const schemaJson = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': info.name,
      'description': info.desc,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'All',
      'browserRequirements': 'Requires JavaScript. Requires HTML5.',
      'url': `https://calculator-converter-hub.vercel.app/tools/${tool.id}`
    };

    const mainHtml = `
      <div style="padding: 32px; max-width: 800px; margin: 0 auto; font-family: sans-serif;">
        <nav style="font-size: 0.85rem; margin-bottom: 24px; color: var(--text-muted);">
          <a href="/">Home</a> > <a href="/category/${tool.category}">Category</a> > <span>${info.name}</span>
        </nav>
        <h1>${info.name}</h1>
        <p>${info.desc}</p>

        <div style="padding: 24px; border: 1px solid var(--border-color); border-radius: 8px; margin: 24px 0; background: var(--bg-secondary);">
          <p><strong>Interactive Calculator Interface</strong></p>
          <p style="font-size: 0.9rem; color: var(--text-muted);">This is a preview representation. The interactive model hydrates dynamically upon load.</p>
        </div>

        <h2>How to Calculate / How it Works</h2>
        <p>${info.howItWorks}</p>

        <h3>Formula</h3>
        <code style="display: block; padding: 12px; background: var(--bg-tertiary); border-radius: 4px; overflow-x: auto;">
          ${info.formula}
        </code>

        ${info.faqs.length > 0 ? `
          <h3>Frequently Asked Questions</h3>
          ${info.faqs.map(faq => `
            <div style="margin-bottom: 16px;">
              <strong>Q: ${faq.q}</strong>
              <p>${faq.a}</p>
            </div>
          `).join('')}
        ` : ''}

        <hr style="margin: 32px 0; border: none; border-top: 1px solid var(--border-color);" />
        <h4>Related Utilities</h4>
        <div style="display: flex; gap: 12px;">
          <a href="/">All Tools Dashboard</a>
        </div>
      </div>
    `;

    writeHTMLFile(`tools/${tool.id}`, 'index.html', `${info.name} - Calculator & Converter Hub`, info.desc, `https://calculator-converter-hub.vercel.app/tools/${tool.id}`, mainHtml, schemaJson);
  }

  console.log('Static site pre-rendering (SSG) completed successfully!');
}

run();
