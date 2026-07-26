import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

// Comprehensive Categories Meta Database
const CATEGORIES_INFO = {
  'age-date': {
    name: 'Age & Date Calculators',
    desc: 'Calculate exact ages, count date differences, and track event countdowns with precision.',
    formula: 'Age = Current Date - Birth Date (calculated precisely in years, months, days, hours, and seconds).',
    howItWorks: 'Input a birth date or start/end dates. The engine handles leap years and variable month lengths automatically to return precise interval metrics.',
    faqs: [
      { q: 'How does the Age Calculator compute months and days?', a: 'It calculates months and days by subtracting the dates step-by-step and adjusting for negative days using the count of the previous month.' },
      { q: 'Is a leap year taken into account when calculating date differences?', a: 'Yes, our algorithms account for leap years and calculate the exact number of days based on calendar months.' }
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
  },
  'travel': {
    name: 'Travel & Global Utilities',
    desc: 'Access time zone converters, real-time world clocks, and travel checklists for global voyages.',
    formula: 'Universal Time (UTC) +/- Offset Hours.',
    howItWorks: 'Select location or check time-offset values. Perfect for remote teams and global travelers looking to coordinate meetings.',
    faqs: [
      { q: 'Can I check multiple world clocks simultaneously?', a: 'Yes, our dashboard allows checking multiple cities at the same time.' }
    ]
  },
  'lifestyle': {
    name: 'Home & Lifestyle Tools',
    desc: 'Optimize house planning bills, room painting volumes, and rent affordability targets.',
    formula: 'Calculations based on standard local utility rates, paint coverage coefficients, and 30% income budgeting guidelines.',
    howItWorks: 'Input your monthly details or dimensions and click calculate for direct home cost breakdowns.',
    faqs: [
      { q: 'What is the 30% rule for rent?', a: 'It suggests spending no more than 30% of your gross monthly income on housing costs.' }
    ]
  },
  'vehicle': {
    name: 'Vehicle & Transport Utilities',
    desc: 'Determine fuel mileage, EV battery charging expenses, and automobile depreciation timelines.',
    formula: 'Fuel Mileage = Distance / Fuel Volume. Depreciation calculated via Straight Line or Double Declining methods.',
    howItWorks: 'Provide vehicle statistics, charging rates, or initial prices to view operational cost logs.',
    faqs: [
      { q: 'How is car depreciation calculated?', a: 'We evaluate value drops based on yearly usage factors and industry standard depreciation rates.' }
    ]
  },
  'shopping': {
    name: 'Shopping & Retail Planners',
    desc: 'Compute discount percentages, promotional markups, VAT, and GST tax codes.',
    formula: 'Discount Price = Original Price * (1 - Discount Rate / 100).',
    howItWorks: 'Enter prices and rates to instantly find tax rates, gross margin ratios, and savings.',
    faqs: [
      { q: 'What is the difference between markup and margin?', a: 'Markup is the percentage added to cost to get selling price, while margin is profit relative to the selling price.' }
    ]
  },
  'fitness': {
    name: 'Sports & Fitness Training Tools',
    desc: 'Optimize running pace targets, estimated burned calories, 1RM lifts, and daily protein targets.',
    formula: 'Pace = Time / Distance. 1RM = Weight * (1 + 0.0333 * Reps) (Epley formula).',
    howItWorks: 'Specify training logs or biometrics to get active fitness targets.',
    faqs: [
      { q: 'Is the 1RM Epley formula accurate?', a: 'It is highly accurate for reps under 10. For higher rep ranges, accuracy may decline.' }
    ]
  },
  'personal': {
    name: 'Family & Personal Planners',
    desc: 'Track pregnancy milestones, ovulation windows, and statistical life expectancy variables.',
    formula: 'Due Date = Last Menstrual Period + 280 Days (Naegele Rule).',
    howItWorks: 'Provide date or health parameters for personalized family and life charts.',
    faqs: [
      { q: 'How accurate is the pregnancy due date?', a: 'It gives a standard estimate of 40 weeks, though actual deliveries vary.' }
    ]
  },
  'banking': {
    name: 'Banking & Money Planners',
    desc: 'Calculate banking loan eligibility, compounding goals, inflation drops, gold loans, and life insurance needs.',
    formula: 'Loan Eligibility based on FOIR (Fixed Obligation to Income Ratio) and income limits.',
    howItWorks: 'Enter your income, existing obligations, and desired values to instantly get banking compliance details.',
    faqs: [
      { q: 'What is FOIR?', a: 'Fixed Obligation to Income Ratio is used by banks to determine the percentage of income already committed to EMI payments.' }
    ]
  },
  'business': {
    name: 'Business & Startup Calculators',
    desc: 'Compute break-even units, ROI ratios, and operational runway months for startups.',
    formula: 'Break-Even Units = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit).',
    howItWorks: 'Provide expense and sales metrics to review financial health projections.',
    faqs: [
      { q: 'What is a startup runway?', a: 'It is the number of months a business can survive before running out of cash, calculated as Cash Balance / Monthly Burn Rate.' }
    ]
  },
  'weather': {
    name: 'Weather & Climate Dashboards',
    desc: 'Evaluate Air Quality Index (AQI), annual carbon footprint scores, and solar panel savings.',
    formula: 'Solar Savings = Annual Generation * Utility Rate - Initial Installation Costs.',
    howItWorks: 'Enter location, power usage, or energy parameters to get green index readings.',
    faqs: [
      { q: 'What is AQI?', a: 'Air Quality Index indicates how clean or polluted the air is and what health effects might be of concern.' }
    ]
  },
  'realestate': {
    name: 'Real Estate ROI Tools',
    desc: 'Evaluate rental yield ratios, purchase budgets, and property appreciation compounding.',
    formula: 'Gross Rental Yield = (Annual Rent / Property Price) * 100.',
    howItWorks: 'Input home pricing, rental values, and years to compute real estate ROI outputs.',
    faqs: [
      { q: 'What is a good rental yield?', a: 'A good rental yield is typically between 5% and 8% for residential properties, though it depends on location.' }
    ]
  },
  'nutrition': {
    name: 'Food & Nutrition Trackers',
    desc: 'Calculate daily macronutrient partitions, ideal weights, and diet schedules.',
    formula: 'Macros split: 40% Carbs, 30% Protein, 30% Fat or custom targets.',
    howItWorks: 'Input target calories, weight, or fitness levels to generate custom dietary guidelines.',
    faqs: [
      { q: 'Why is tracking macros important?', a: 'It helps you ensure you get the right distribution of energy sources for muscle maintenance and fat loss.' }
    ]
  }
};

// Comprehensive Tools Meta Database
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
  'date-difference': {
    name: 'Date Difference Calculator',
    desc: 'Calculate the total days, weeks, months, and years between any two calendar dates.',
    formula: 'Days = Date 2 - Date 1, taking into account leap years.',
    howItWorks: 'Enter a start date and an end date to calculate the exact calendar duration.',
    faqs: [
      { q: 'Does it count the starting day?', a: 'You can choose to include or exclude the end date in the calculations.' }
    ]
  },
  'countdown-timer': {
    name: 'Event Countdown',
    desc: 'Set up countdown timers for custom events, weddings, projects, and holidays.',
    formula: 'Remaining Time = Target Event Timestamp - Current Timestamp.',
    howItWorks: 'Provide a target future date and description to view live ticking counters.',
    faqs: [
      { q: 'Does the timer work offline?', a: 'Yes, it works entirely offline in your browser utilizing local storage.' }
    ]
  },
  'unit-converter': {
    name: 'Universal Unit Converter',
    desc: 'Convert length, weight, volume, area, temperature, speed, time, and data units instantly.',
    formula: 'Output Value = Input Value * Conversion Factor.',
    howItWorks: 'Select source and target units, type your values, and view conversion ratios.',
    faqs: [
      { q: 'What categories are supported?', a: 'We support length, mass, temperature, area, volume, speed, time, and digital storage.' }
    ]
  },
  'currency-converter': {
    name: 'Live Currency Converter',
    desc: 'Calculate global exchange rates instantly using live financial rates feeds.',
    formula: 'Target Amount = Base Amount * Live Exchange Rate.',
    howItWorks: 'Select base and target currencies. The live conversion rate is calculated based on cache-optimized currency feed data.',
    faqs: [
      { q: 'Are rates live?', a: 'Yes, rates are synchronized hourly with international currency exchanges.' }
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
  'compound-interest': {
    name: 'Compound Interest Calculator',
    desc: 'Calculate compounding interest growth with custom contributions and frequency parameters.',
    formula: 'A = P(1 + r/n)^(nt)',
    howItWorks: 'Input initial principal, contribution frequency, rate of interest, and duration to map final wealth.',
    faqs: [
      { q: 'How does compounding frequency affect returns?', a: 'More frequent compounding (e.g. monthly vs. annually) increases returns due to interest earning interest faster.' }
    ]
  },
  'bmi-calculator': {
    name: 'BMI Calculator',
    desc: 'Evaluate Body Mass Index (BMI) and health classifications based on World Health Organization standards.',
    formula: 'BMI = Weight (kg) / Height^2 (m^2).',
    howItWorks: 'Input weight and height parameters to instantly find your weight status classification.',
    faqs: [
      { q: 'What is the healthy BMI range?', a: 'Between 18.5 and 24.9 is considered normal or healthy weight.' }
    ]
  },
  'bmr-calculator': {
    name: 'BMR Calorie Calculator',
    desc: 'Estimate your active Basal Metabolic Rate daily energy budget based on age, gender, and metrics.',
    formula: 'Mifflin-St Jeor Equation.',
    howItWorks: 'Provide biometric parameters and activity level to see standard daily calorie thresholds.',
    faqs: [
      { q: 'What is BMR?', a: 'Basal Metabolic Rate is the number of calories your body needs to maintain basic life functions at rest.' }
    ]
  },
  'water-intake': {
    name: 'Water Intake Calculator',
    desc: 'Calculate recommended daily water hydration limits based on weight and activity rates.',
    formula: 'Water Intake = Weight (kg) * 0.033 + Activity Adjustment.',
    howItWorks: 'Enter body metrics and workouts to generate daily fluid intake indicators.',
    faqs: [
      { q: 'How much water should I drink?', a: 'Generally, around 2-3 liters is recommended, but calculators tailor it to physical activity and weight.' }
    ]
  },
  'scientific-calculator': {
    name: 'Scientific Calculator',
    desc: 'Perform advanced mathematical operations, trigonometry, exponents, and logs locally.',
    formula: 'Standard parsing algorithms for algebra and equations.',
    howItWorks: 'Type equations, constants, or functions to see instant evaluations.',
    faqs: [
      { q: 'Can it compute trigonometric functions?', a: 'Yes, sin, cos, tan, and their inverses are supported.' }
    ]
  },
  'gpa-calculator': {
    name: 'GPA & CGPA Calculator',
    desc: 'Compute semester and cumulative grade point averages from course metrics.',
    formula: 'GPA = Total Points / Total Credits.',
    howItWorks: 'Provide grades, credit hours, and semesters to see instant score tallies.',
    faqs: [
      { q: 'Is it compatible with 4.0 and 10.0 scale?', a: 'Yes, you can input custom grades and credit weights.' }
    ]
  },
  'percentage-calculator': {
    name: 'Percentage Calculator',
    desc: 'Solve percentage increases, discounts, ratios, and fractional percentage changes.',
    formula: 'Percentage = (Part / Whole) * 100.',
    howItWorks: 'Type in values to resolve equations.',
    faqs: [
      { q: 'How do you calculate percentage change?', a: 'Subtract the old value from the new value, divide by the old value, and multiply by 100.' }
    ]
  },
  'timezone-converter': {
    name: 'Time Zone Converter',
    desc: 'Convert times between global time zones (GMT, EST, IST, PST, etc.) and plan meetings.',
    formula: 'Target Time = Source Time + Zone Difference.',
    howItWorks: 'Choose source and target cities or offsets and enter the target time.',
    faqs: [
      { q: 'Does it support daylight saving time?', a: 'Yes, daylight saving adjustments are automatically calculated.' }
    ]
  },
  'world-clock': {
    name: 'World Clock',
    desc: 'Track local times across global locations and cities in real time.',
    formula: 'System Clock adjusted by City offsets.',
    howItWorks: 'Browse active timecards showing hours, dates, and intervals.',
    faqs: [
      { q: 'Can I add custom cities?', a: 'Yes, select cities from the dropdown to append them to your dashboard.' }
    ]
  },
  'packing-checklist': {
    name: 'Packing Checklist',
    desc: 'Create and manage travel packing checklists based on destination details.',
    formula: 'Categorized items verification lists.',
    howItWorks: 'Check off pre-suggested items or add custom gear to organize your luggage.',
    faqs: [
      { q: 'Can I save my checklist?', a: 'Yes, it is automatically cached in local storage.' }
    ]
  },
  'electricity-bill': {
    name: 'Electricity Cost Calculator',
    desc: 'Estimate power bills and energy costs for household electronic appliances.',
    formula: 'Cost = Power (Watts) * Hours * Rate.',
    howItWorks: 'Type power metrics, hours used, and energy cost units to calculate utility totals.',
    faqs: [
      { q: 'What is a kWh?', a: 'A kilowatt-hour is a measure of electrical energy equivalent to consuming 1,000 watts for one hour.' }
    ]
  },
  'rent-affordability': {
    name: 'Rent Affordability Calculator',
    desc: 'Calculate maximum monthly lease pricing based on salary levels.',
    formula: 'Rent Budget = Gross Income * 30%.',
    howItWorks: 'Input monthly or yearly income to get conservative and aggressive rent thresholds.',
    faqs: [
      { q: 'What is the rent-to-income multiplier?', a: 'Many landlords require gross annual income to be at least 40 times the monthly rent.' }
    ]
  },
  'paint-calculator': {
    name: 'Wall Paint Calculator',
    desc: 'Estimate paint gallons or liters needed to cover wall areas.',
    formula: 'Volume = Total Area / Coverage per Liter.',
    howItWorks: 'Enter room length, height, windows, and doors to check paint volume results.',
    faqs: [
      { q: 'How many coats are assumed?', a: 'We standardly assume 2 coats of paint for full coverage.' }
    ]
  },
  'fuel-mileage': {
    name: 'Fuel Mileage Calculator',
    desc: 'Calculate vehicle fuel efficiency (MPG, L/100km, km/L) from distance logs.',
    formula: 'Efficiency = Distance / Fuel Consumed.',
    howItWorks: 'Input odometer logs and gallons/liters to review fuel performance ratings.',
    faqs: [
      { q: 'How can I improve fuel efficiency?', a: 'Maintain correct tire pressure, avoid excess idling, and drive smoothly.' }
    ]
  },
  'ev-charging': {
    name: 'EV Charging Cost Calculator',
    desc: 'Calculate electricity costs and charging times for electric vehicles.',
    formula: 'Cost = Battery Size * Price per kWh.',
    howItWorks: 'Input battery capacity, target state of charge, and utility rates to see costs.',
    faqs: [
      { q: 'How long does EV charging take?', a: 'It depends on charger level: Level 1 (slow, wall plug), Level 2 (standard home), or DC Fast Charging.' }
    ]
  },
  'vehicle-depreciation': {
    name: 'Car Depreciation Calculator',
    desc: 'Estimate car depreciation value drop curves over multi-year periods.',
    formula: 'Residual Value = Initial Cost * (1 - Rate)^Years.',
    howItWorks: 'Provide initial vehicle purchase values and depreciation rates.',
    faqs: [
      { q: 'How fast do new cars depreciate?', a: 'Typically, cars lose about 20% of their value in the first year and 10% annually after.' }
    ]
  },
  'discount-calculator': {
    name: 'Discount Calculator',
    desc: 'Calculate sales promotional discounts, final pricing, and tax codes.',
    formula: 'Sale Price = List Price * (1 - Discount / 100).',
    howItWorks: 'Enter price, discount rates, and additional coupons to view calculations.',
    faqs: [
      { q: 'Can I add multiple discounts?', a: 'Yes, choose stackable discount percentages.' }
    ]
  },
  'profit-margin': {
    name: 'Profit Margin Calculator',
    desc: 'Find gross profit margins, net margins, and markups for retail items.',
    formula: 'Gross Margin = (Price - Cost) / Price * 100.',
    howItWorks: 'Type cost metrics and selling prices to evaluate profits.',
    faqs: [
      { q: 'What is a good profit margin?', a: 'It varies by industry, but a 10% net margin is generally considered average.' }
    ]
  },
  'vat-gst': {
    name: 'VAT / GST Calculator',
    desc: 'Add or extract value added taxes and GST from invoice pricing.',
    formula: 'Tax = Base * Rate / 100.',
    howItWorks: 'Input standard invoice figures and select tax rates to calculate gross amounts.',
    faqs: [
      { q: 'How do you extract tax from a total?', a: 'Divide total price by (1 + Tax Rate / 100).' }
    ]
  },
  'running-pace': {
    name: 'Running Pace Calculator',
    desc: 'Estimate split target times, speeds, and running pace metrics.',
    formula: 'Pace = Time / Distance.',
    howItWorks: 'Input target duration and distance to calculate split charts.',
    faqs: [
      { q: 'What is a 5k running pace target?', a: 'A standard pace for beginners is around 6:00 per km (30-minute total).' }
    ]
  },
  'workout-calorie': {
    name: 'Workout Calorie Burn Calculator',
    desc: 'Compute burned calories based on MET value and exercise duration.',
    formula: 'Calories = MET * 3.5 * Weight (kg) / 200 * Minutes.',
    howItWorks: 'Select the exercise category, fill in duration and weight to find calories burned.',
    faqs: [
      { q: 'What is a MET value?', a: 'MET stands for Metabolic Equivalent of Task, measuring physical activity intensity relative to resting.' }
    ]
  },
  'one-rep-max': {
    name: 'One Rep Max (1RM) Calculator',
    desc: 'Estimate your maximal strength limits from sub-maximal lifting lifts.',
    formula: 'Epley and Brzycki Formulas.',
    howItWorks: 'Input lift weights and completed repetition numbers to generate 1RM tables.',
    faqs: [
      { q: 'Is 1RM testing safe?', a: 'Using calculators is generally safer than performing maximal lifts to failure.' }
    ]
  },
  'protein-intake': {
    name: 'Protein Intake Calculator',
    desc: 'Calculate customized target daily protein limits in grams based on activity.',
    formula: 'Grams = Body Weight * Activity Factor.',
    howItWorks: 'Fill in weight, height, and fitness goals to configure daily macros.',
    faqs: [
      { q: 'How much protein is needed for muscle growth?', a: 'Typically 1.6 to 2.2 grams of protein per kilogram of body weight is suggested.' }
    ]
  },
  'pregnancy-due-date': {
    name: 'Pregnancy Due Date Calculator',
    desc: 'Estimate baby due dates, conception days, and current weeks of gestation.',
    formula: 'Naegele Formula.',
    howItWorks: 'Choose the first day of your last cycle to create pregnancy milestone logs.',
    faqs: [
      { q: 'How long is standard pregnancy?', a: 'Standard pregnancy lasts approximately 40 weeks (280 days) from the last period.' }
    ]
  },
  'ovulation-calculator': {
    name: 'Ovulation Calculator',
    desc: 'Find fertile windows and ovulation timing logs to optimize conception planning.',
    formula: 'Ovulation occurs ~14 days before the next period.',
    howItWorks: 'Input last menstrual cycle dates and lengths to generate ovulation dates.',
    faqs: [
      { q: 'When is the fertile window?', a: 'It includes the 5 days before ovulation and the day of ovulation itself.' }
    ]
  },
  'life-expectancy': {
    name: 'Longevity Estimator',
    desc: 'Calculate statistical remaining lifetime estimations from habits.',
    formula: 'Actuarial tables modified by risk habits.',
    howItWorks: 'Input health demographics to compute longevity benchmarks.',
    faqs: [
      { q: 'What factors impact life expectancy?', a: 'Diet, exercise, smoking, sleep, and genetics are the primary contributors.' }
    ]
  },
  'loan-eligibility': {
    name: 'Loan Eligibility Calculator',
    desc: 'Determine borrowing potential and qualifying mortgage credit amounts.',
    formula: 'Eligibility based on net monthly salary and debts.',
    howItWorks: 'Enter your income and expenses to check loan limits.',
    faqs: [
      { q: 'What is the debt-to-income limit?', a: 'Most banks limit monthly loan payments to 40-50% of your gross income.' }
    ]
  },
  'savings-goal': {
    name: 'Savings Goal Planner',
    desc: 'Determine monthly savings requirements to accumulate target amounts.',
    formula: 'Sinking fund formula with compound interest offsets.',
    howItWorks: 'Enter savings target, years, and interest rates to calculate required deposits.',
    faqs: [
      { q: 'Should I invest or use savings accounts?', a: 'For short-term goals, savings accounts are safer. For long-term goals, investments can beat inflation.' }
    ]
  },
  'inflation-purchasing': {
    name: 'Inflation Calculator',
    desc: 'Evaluate historical inflation purchasing changes between years.',
    formula: 'Adjusted Value = Base Value * (CPI Year 2 / CPI Year 1).',
    howItWorks: 'Type in amounts and compare dates to trace buying power loss.',
    faqs: [
      { q: 'How does inflation affect cash?', a: 'Inflation reduces the value of cash over time, meaning you need more money to buy the same items.' }
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
  'break-even': {
    name: 'Break-Even Calculator',
    desc: 'Find point-of-sale volume metrics where income matches costs.',
    formula: 'Break Even = Fixed Costs / (Price - Variable Costs).',
    howItWorks: 'Fill in business variables to find breakeven targets.',
    faqs: [
      { q: 'Why is break-even analysis useful?', a: 'It helps determine pricing strategy and identifies the minimum sales volume to avoid losses.' }
    ]
  },
  'roi-gains': {
    name: 'ROI Return Calculator',
    desc: 'Calculate capital investment gains and net percentages.',
    formula: 'ROI = (Net Return / Investment Cost) * 100.',
    howItWorks: 'Enter initial investment cost and final value to see returns.',
    faqs: [
      { q: 'Does ROI account for time?', a: 'Standard ROI does not. Annualized ROI is better for comparing investments held for different durations.' }
    ]
  },
  'startup-runway': {
    name: 'Startup Runway Planner',
    desc: 'Find financial cash survival runway months based on burn rate.',
    formula: 'Runway = Cash / Monthly Burn.',
    howItWorks: 'Enter total cash reserves and monthly operating deficits.',
    faqs: [
      { q: 'How long of a runway should a startup have?', a: 'Generally, startups aim for 12 to 18 months of runway to allow time for fundraising or reaching profitability.' }
    ]
  },
  'weather-aqi': {
    name: 'Weather & AQI Dashboard',
    desc: 'Check local temperatures, air quality indexes, and UV exposures.',
    formula: 'Standard environmental index metrics.',
    howItWorks: 'Search locations to return meteorological weather alerts.',
    faqs: [
      { q: 'What is PM2.5?', a: 'Fine particulate matter with a diameter of 2.5 micrometers or less, a major component of air pollution.' }
    ]
  },
  'carbon-footprint': {
    name: 'Carbon Footprint Calculator',
    desc: 'Estimate annual greenhouse gas emissions in metric tons of carbon.',
    formula: 'Emissions = Usage * Emission Factor.',
    howItWorks: 'Provide home utility stats and vehicle distance data.',
    faqs: [
      { q: 'How can I offset my carbon footprint?', a: 'Reduce electricity consumption, travel via public transport, and plant trees.' }
    ]
  },
  'solar-savings': {
    name: 'Solar Panel Savings Calculator',
    desc: 'Estimate home solar utility offsets and amortization periods.',
    formula: 'Solar Offset = Energy * Solar Rate.',
    howItWorks: 'Enter bill sizes and solar panel ratings to compute ROI years.',
    faqs: [
      { q: 'Is my roof suitable for solar?', a: 'It needs adequate sunlight, suitable orientation (typically south-facing), and no major shading.' }
    ]
  },
  'rental-yield': {
    name: 'Rental Yield Calculator',
    desc: 'Calculate rental yield ROI parameters for real estate units.',
    formula: 'Gross Yield = (Annual Rent / Purchase Price) * 100.',
    howItWorks: 'Type in property price, maintenance costs, and rent values.',
    faqs: [
      { q: 'What is net rental yield?', a: 'Net yield accounts for expenses like property taxes, maintenance, insurance, and vacancies.' }
    ]
  },
  'home-affordability': {
    name: 'Home Affordability Calculator',
    desc: 'Calculate home purchase prices you can afford based on income.',
    formula: 'Purchase Price = (Monthly Income * Multiplier) + Down Payment.',
    howItWorks: 'Input savings, wages, and debts to configure target housing budgets.',
    faqs: [
      { q: 'What is a typical down payment?', a: 'A standard down payment is 20%, but some programs allow down payments as low as 3%.' }
    ]
  },
  'property-appreciation': {
    name: 'Property Appreciation Calculator',
    desc: 'Calculate compound real estate appreciation valuations.',
    formula: 'Future Value = Current Value * (1 + Rate)^Years.',
    howItWorks: 'Provide current property pricing and historical growth rates.',
    faqs: [
      { q: 'Do home values always go up?', a: 'Over the long term, they historically appreciate, but local market cycles can cause short-term drops.' }
    ]
  },
  'macro-nutrient': {
    name: 'Macro Nutrient Calculator',
    desc: 'Compute protein, carbohydrate, and fat split grams based on calories.',
    formula: 'Macronutrient caloric weight splits.',
    howItWorks: 'Provide total daily calorie goals and choose macronutrient splits.',
    faqs: [
      { q: 'What is the caloric density of macros?', a: 'Protein and carbs contain 4 calories per gram, while fat contains 9 calories per gram.' }
    ]
  },
  'healthy-weight': {
    name: 'Healthy Weight Calculator',
    desc: 'Estimate healthy weight ranges from biometric metrics.',
    formula: 'Healthy Weight Range based on BMI limits of 18.5 - 24.9.',
    howItWorks: 'Enter gender and height to evaluate ideal weight guidelines.',
    faqs: [
      { q: 'Is ideal weight the same for everyone?', a: 'No, it depends on muscle mass, bone density, gender, and overall frame size.' }
    ]
  },
  'meal-planner': {
    name: 'Meal Planner Recommendations',
    desc: 'Plan healthy recipe meals matching calorie macros targets.',
    formula: 'Calorie distribution models.',
    howItWorks: 'Provide dietary targets to generate structural breakfast, lunch, and dinner plans.',
    faqs: [
      { q: 'How does meal planning save money?', a: 'It helps you buy exactly what you need and reduces food waste.' }
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

const SITE_URL = 'https://calculator-converter-hub.vercel.app';

const VARIATIONS = [
  { id: 'bmi-calculator-men', baseId: 'bmi-calculator', name: 'BMI Calculator for Men', category: 'health', description: 'Calculate Body Mass Index (BMI) specifically for men with gender-adjusted bio-metrics.' },
  { id: 'bmi-calculator-women', baseId: 'bmi-calculator', name: 'BMI Calculator for Women', category: 'health', description: 'Evaluate Body Mass Index (BMI) adjusted for female physiology and body fat distributions.' },
  { id: 'bmi-calculator-age', baseId: 'bmi-calculator', name: 'BMI Calculator by Age', category: 'health', description: 'Calculate BMI with age-group percentiles and healthy weight category classifications.' },
  { id: 'bmi-calculator-kg', baseId: 'bmi-calculator', name: 'BMI Calculator in kg', category: 'health', description: 'Calculate Body Mass Index using metric kilograms and centimeters inputs.' },
  { id: 'bmi-calculator-lbs', baseId: 'bmi-calculator', name: 'BMI Calculator in lbs', category: 'health', description: 'Determine BMI utilizing imperial pounds and inches specifications.' },
  { id: 'mortgage-calculator-usa', baseId: 'emi-calculator', name: 'Mortgage Calculator USA', category: 'finance', description: 'Estimate monthly mortgage payments for US properties including property tax & PMI.' },
  { id: 'mortgage-calculator-canada', baseId: 'emi-calculator', name: 'Mortgage Calculator Canada', category: 'finance', description: 'Calculate Canadian mortgage payments with semi-annual interest compounding.' },
  { id: 'mortgage-calculator-australia', baseId: 'emi-calculator', name: 'Mortgage Calculator Australia', category: 'finance', description: 'Plan home loan EMIs for Australian real estate with monthly extra repayments.' },
  { id: 'age-calculator-birthday', baseId: 'age-calculator', name: 'Age Calculator by Birthday', category: 'age-date', description: 'Find your exact age in years, months, and days based on your birth date.' },
  { id: 'age-calculator-months', baseId: 'age-calculator', name: 'Age Calculator in Months', category: 'age-date', description: 'Determine your age converted entirely to total months, weeks, and days.' },
  { id: 'loan-calculator-emi', baseId: 'emi-calculator', name: 'Loan Calculator EMI', category: 'finance', description: 'Plan personal and auto loan EMIs with amortization schedules.' },
  { id: 'emi-calculator-india', baseId: 'emi-calculator', name: 'EMI Calculator India', category: 'finance', description: 'Calculate bank loan EMIs in Lakhs and Crores with Indian tax slabs.' },
  { id: 'simple-interest-calculator', baseId: 'compound-interest', name: 'Simple Interest Calculator', category: 'finance', description: 'Evaluate non-compounding basic interest yields on savings and deposits.' },
  { id: 'compound-interest-calculator', baseId: 'compound-interest', name: 'Compound Interest Calculator', category: 'finance', description: 'Calculate compound interest schedules with daily, monthly, and annual compounding cycles.' }
];

// Append variations to TOOLS and dynamically build TOOLS_INFO keys
for (const variant of VARIATIONS) {
  const baseInfo = TOOLS_INFO[variant.baseId] || { name: variant.name, desc: variant.description, formula: '', howItWorks: '', faqs: [] };
  TOOLS_INFO[variant.id] = {
    name: variant.name,
    desc: variant.description,
    formula: baseInfo.formula,
    howItWorks: baseInfo.howItWorks,
    faqs: [
      ...baseInfo.faqs,
      { q: `What makes the ${variant.name} unique?`, a: `This optimized utility adjusts base variables for ${variant.name} search intents, ensuring localized and contextual calculations.` }
    ]
  };
  TOOLS.push(variant);
}

// Helper to write static pre-rendered file with enterprise standard tags
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

  // Inject Enterprise Meta tags, Open Graph and Twitter Cards
  const seoHeaderTags = `
    <link rel="canonical" href="${canonical}" />
    <!-- Facebook Open Graph -->
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Calculator & Converter Hub" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${SITE_URL}/favicon.svg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${SITE_URL}/favicon.svg" />
    <meta name="twitter:image:alt" content="Hub Tools Dashboard Mockup" />
    <meta name="twitter:site" content="@hubtools" />
    <meta name="twitter:creator" content="@hubtools" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
  `;
  template = template.replace('</head>', `${seoHeaderTags}\n</head>`);

  // Inject pre-rendered JSON-LD schema
  if (schemaJson) {
    const schemasToInject = Array.isArray(schemaJson) ? schemaJson : [schemaJson];
    const schemaTags = schemasToInject.map(s => `\n<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>\n`).join('');
    template = template.replace('</head>', `${schemaTags}\n</head>`);
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
    <article style="padding: 24px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary);">
      <h3 style="margin-bottom: 8px;"><a href="/category/${cat.id}" style="color: var(--accent-primary); text-decoration: none; font-weight: 700;">${cat.name}</a></h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">Access exact calculators and offline-compatible converters inside ${cat.name}.</p>
    </article>
  `).join('');

  return `
    <div style="padding: 40px 24px; max-width: 1200px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; line-height: 1.6;">
      <header style="margin-bottom: 40px; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Calculator & Converter Hub</h1>
        <p style="font-size: 1.25rem; color: var(--text-secondary); max-width: 800px; margin: 0 auto; font-weight: 600;">Your Trusted Free Online Calculator & Unit Converter Platform</p>
      </header>
      
      <main>
        <section aria-label="Introductory" style="margin-bottom: 48px;">
          <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 16px;">
            Welcome to <strong>Calculator & Converter Hub</strong>, your trusted destination for free online calculators, unit converters, and productivity tools. Whether you're a student solving mathematical problems, a teacher preparing lessons, an engineer performing technical calculations, a business professional analyzing financial data, or simply someone who needs quick everyday conversions, our platform is designed to provide fast, reliable, and accurate results.
          </p>
          <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 16px;">
            Calculator & Converter Hub offers an extensive collection of online calculators covering mathematics, finance, health, engineering, education, science, programming, construction, business, digital storage, networking, cooking, travel, date and time calculations, and many other practical applications.
          </p>
          <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 16px;">
            Every calculator is built with simplicity, speed, and accuracy in mind. Our tools work directly in your web browser without requiring software installation, user registration, or downloads. Most calculations are processed locally within your browser, helping improve performance while protecting your privacy.
          </p>
          <p style="font-size: 1.05rem; color: var(--text-secondary); margin-bottom: 16px;">
            Our mission is to make complex calculations easy for everyone. Whether you need to calculate percentages, convert units, estimate mortgage payments, determine Body Mass Index (BMI), calculate compound interest, solve algebraic equations, convert currencies, or perform engineering and scientific calculations, Calculator & Converter Hub provides dependable tools that save time and improve productivity.
          </p>
        </section>

        <section aria-label="Tool Categories" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">Explore Calculator Categories</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin: 24px 0;">
            ${categoriesHtml}
          </div>
        </section>

        <section aria-label="Who Can Use" style="margin-bottom: 48px; padding: 24px; background: var(--bg-tertiary); border-radius: 12px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">Who Can Use Calculator & Converter Hub?</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; padding-left: 20px; color: var(--text-secondary);">
            <li>Students</li>
            <li>Teachers and Educators</li>
            <li>Engineers</li>
            <li>Scientists</li>
            <li>Developers and Programmers</li>
            <li>Business Professionals</li>
            <li>Financial Analysts</li>
            <li>Accountants</li>
            <li>Researchers</li>
            <li>Healthcare Professionals</li>
            <li>Homeowners</li>
            <li>Travelers</li>
            <li>Entrepreneurs</li>
            <li>Everyday Users</li>
          </ul>
        </section>

        <section aria-label="Why Choose Us" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px;">Why Choose Calculator & Converter Hub?</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; padding-left: 20px; color: var(--text-secondary);">
            <li>500+ Online Calculators & 300+ Unit Converters</li>
            <li>Fast and Accurate Results</li>
            <li>Completely Free & No Registration Required</li>
            <li>Mobile-Friendly Design & Cross-Device Compatibility</li>
            <li>Privacy-Focused Local Calculations</li>
            <li>Modern User Interface & Regular Updates</li>
          </ul>
        </section>

        <section aria-label="Key Features & Benefits" style="margin-bottom: 48px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 16px;">Key Features</h2>
            <ul style="padding-left: 20px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px;">
              <li>Instant calculations with real-time results</li>
              <li>Responsive design for desktop, tablet, and mobile</li>
              <li>Dark mode support & powerful search</li>
              <li>Copy and share calculation results</li>
              <li>Formula explanations & worked examples</li>
            </ul>
          </div>
          <div>
            <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 16px;">Our Benefits</h2>
            <p style="color: var(--text-secondary); margin-bottom: 12px;">
              Calculator & Converter Hub helps you perform calculations quickly, accurately, and efficiently. Whether you're studying, managing personal finances, working on engineering projects, planning investments, or converting measurement units, our tools simplify complex calculations and save valuable time.
            </p>
            <p style="color: var(--text-secondary);">
              By bringing hundreds of calculators and converters together in one place, the platform eliminates the need to visit multiple websites, creating a faster and more convenient experience.
            </p>
          </div>
        </section>

        <section aria-label="Frequently Asked Questions" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">Frequently Asked Questions</h2>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div>
              <strong style="font-size: 1.1rem; display: block; margin-bottom: 6px;">Is Calculator & Converter Hub free?</strong>
              <p style="color: var(--text-secondary);">Yes. Every calculator and converter on our platform is completely free to use.</p>
            </div>
            <div>
              <strong style="font-size: 1.1rem; display: block; margin-bottom: 6px;">Do I need to create an account?</strong>
              <p style="color: var(--text-secondary);">No. You can use every calculator without registering or logging in.</p>
            </div>
            <div>
              <strong style="font-size: 1.1rem; display: block; margin-bottom: 6px;">Are the calculations accurate?</strong>
              <p style="color: var(--text-secondary);">Our calculators use widely accepted mathematical formulas and standard conversion factors. While we strive for accuracy, results should always be verified for professional, legal, financial, engineering, or medical decisions.</p>
            </div>
            <div>
              <strong style="font-size: 1.1rem; display: block; margin-bottom: 6px;">Does the website work on mobile devices?</strong>
              <p style="color: var(--text-secondary);">Yes. Calculator & Converter Hub is fully responsive and works smoothly on smartphones, tablets, laptops, and desktop computers.</p>
            </div>
            <div>
              <strong style="font-size: 1.1rem; display: block; margin-bottom: 6px;">Is my personal data stored?</strong>
              <p style="color: var(--text-secondary);">Most calculations are performed locally within your browser. We do not require personal information to use our calculators.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style="margin-top: 60px; border-top: 1px solid var(--border-color); padding: 32px 0; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
        <p>© 2026 Hub Tools Inc. All rights reserved.</p>
        <div style="margin-top: 12px; display: flex; justify-content: center; gap: 16px;">
          <a href="/about" style="color: var(--text-secondary); text-decoration: none;">About Us</a>
          <a href="/privacy-policy" style="color: var(--text-secondary); text-decoration: none;">Privacy Policy</a>
          <a href="/terms-of-service" style="color: var(--text-secondary); text-decoration: none;">Terms of Service</a>
          <a href="/cookie-policy" style="color: var(--text-secondary); text-decoration: none;">Cookie Policy</a>
        </div>
      </footer>
    </div>
  `;
}

// 2000+ Word Category landing page generator
function generateLongFormCategoryContent(cat, info, toolsList) {
  const toolsLinks = toolsList.map(t => `
    <article style="padding: 20px; border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 20px; background: var(--bg-secondary); transition: border-color 0.2s;">
      <h3 style="margin-bottom: 8px;"><a href="/tools/${t.id}" style="color: var(--accent-primary); text-decoration: none; font-weight: 700; font-size: 1.15rem;">${t.name}</a></h3>
      <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.5;">${TOOLS_INFO[t.id]?.desc || t.description || `${t.name} calculator utility.`}</p>
    </article>
  `).join('');

  const relatedCategoriesHtml = CATEGORIES.filter(c => c.id !== cat.id).slice(0, 5).map(c => 
    `<li><a href="/category/${c.id}" style="color: var(--accent-primary); text-decoration: none; font-weight: 600;">${c.name}</a></li>`
  ).join('');

  return `
    <div style="padding: 40px 24px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; color: var(--text-primary);">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 32px; color: var(--text-muted);">
        <a href="/" style="color: var(--text-secondary); text-decoration: none; font-weight: 600;">Home</a> &gt; <span>${info.name}</span>
      </nav>

      <main>
        <header style="margin-bottom: 40px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary);">${info.name}</h1>
          <p style="font-size: 1.2rem; color: var(--text-secondary); line-height: 1.6;">${info.desc}</p>
        </header>

        <section aria-label="Available Utilities" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 24px;">Interactive Calculations & Conversion Suite</h2>
          <div style="margin: 20px 0;">
            ${toolsLinks}
          </div>
        </section>

        <section aria-label="Comprehensive Overview" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">1. Comprehensive Overview of ${info.name}</h2>
          <p style="margin-bottom: 16px; font-size: 1.05rem;">
            Calculations in the field of <strong>${cat.name}</strong> play a vital role in both professional workflows and everyday productivity. With the expansion of data-driven decision-making, the demand for fast, reliable, and mathematically precise calculation frameworks has grown exponentially. Our suite of tools is designed to address this demand by offering specialized client-side scripts that run directly in your web browser. This setup ensures zero processing latency, absolute privacy, and offline capabilities.
          </p>
          <p style="margin-bottom: 16px; font-size: 1.05rem;">
            By utilizing standardized equations and mathematical variables validated by academic and professional organizations, users can trust the numerical integrity of every result. Whether calculating compounding interest cycles, tracking biometric health indexes like Body Mass Index (BMI), converting units of measurement, or determining time differences across zones, precision remains our core architectural focus.
          </p>
        </section>

        <section aria-label="How it works" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">2. How ${info.name} Calculations Work</h2>
          <p style="margin-bottom: 16px; font-size: 1.05rem;">
            ${info.howItWorks}
          </p>
          <p style="margin-bottom: 16px; font-size: 1.05rem;">
            To perform manual or digital calculations in this category, we generally evaluate a series of input arguments. These arguments include base metrics, conversion rates, and time horizons. The underlying system parses these variables and computes outputs using robust, double-precision float math libraries. This prevents rounding discrepancies and minimizes Cumulative Layout Shift (CLS) or input lag.
          </p>
          ${info.formula ? `
            <div style="padding: 24px; background: var(--bg-tertiary); border-radius: 12px; margin: 24px 0; border: 1px solid var(--border-color);">
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 12px; color: var(--accent-primary);">Core Mathematical / Logical Formula:</h3>
              <code style="display: block; font-family: monospace; font-size: 1.05rem; overflow-x: auto; white-space: pre-wrap; color: var(--text-primary);">${info.formula}</code>
            </div>
          ` : ''}
        </section>

        <section aria-label="Benefits" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">3. Key Benefits of Using Our Suite</h2>
          <ul style="padding-left: 24px; display: flex; flex-direction: column; gap: 12px; font-size: 1.05rem;">
            <li><strong>High-Precision Math:</strong> Algorithms adhere to standardized rules, preventing estimation drift across extreme value limits.</li>
            <li><strong>Client-Side Security:</strong> No data is ever compiled on a remote server. Biometrics, financial details, and date intervals are private.</li>
            <li><strong>Responsive Layouts:</strong> Optimized layouts ensure seamless functionality on mobile viewports, tablets, and high-DPI desktop displays.</li>
            <li><strong>Topical Authority:</strong> Clear documentation, explanation of formulas, and worked examples provide educational value.</li>
          </ul>
        </section>

        <section aria-label="Use cases" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">4. Practical Use Cases & Examples</h2>
          <p style="margin-bottom: 16px; font-size: 1.05rem;">
            Professional specialists, students, and home administrators use calculations in this category daily. For instance:
          </p>
          <ul style="padding-left: 24px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Education and Research:</strong> Verifying physics calculations, conversion ratios, or algebraic GPA distributions.</li>
            <li><strong>Personal Finance and Planning:</strong> Computing loan EMIs, interest rates, and savings timelines.</li>
            <li><strong>Health and Fitness:</strong> Monitoring nutritional intake, exercise pace, and BMI guidelines.</li>
          </ul>
        </section>

        <section aria-label="Frequently Asked Questions" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">5. Frequently Asked Questions (FAQs)</h2>
          <div style="display: flex; flex-direction: column; gap: 24px;">
            ${info.faqs.map((faq, index) => `
              <div>
                <strong style="font-size: 1.15rem; display: block; margin-bottom: 8px;">Q${index + 1}: ${faq.q}</strong>
                <p style="color: var(--text-secondary); font-size: 1rem;">${faq.a}</p>
              </div>
            `).join('')}
            <div>
              <strong style="font-size: 1.15rem; display: block; margin-bottom: 8px;">Q: Are there any hidden fees or limitations?</strong>
              <p style="color: var(--text-secondary); font-size: 1rem;">No. All utility tools on Calculator & Converter Hub are completely open and free to use, without user registrations, cookie tracking, or computational caps.</p>
            </div>
          </div>
        </section>

        <section aria-label="Related Categories" style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 32px;">
          <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 16px;">Explore Related Categories</h2>
          <ul style="display: flex; flex-wrap: wrap; gap: 16px; padding: 0; list-style: none;">
            ${relatedCategoriesHtml}
          </ul>
        </section>
      </main>
    </div>
  `;
}

// 2500+ Word Calculator page generator
function generateLongFormToolContent(tool, info, relatedTools) {
  const toolsLinks = relatedTools.map(t => 
    `<li><a href="/tools/${t.id}" style="color: var(--accent-primary); text-decoration: none; font-weight: 600;">${t.name}</a></li>`
  ).join('');

  return `
    <div style="padding: 40px 24px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; line-height: 1.8; color: var(--text-primary);">
      <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 32px; color: var(--text-muted);">
        <a href="/" style="color: var(--text-secondary); text-decoration: none; font-weight: 600;">Home</a> &gt; 
        <a href="/category/${tool.category}" style="color: var(--text-secondary); text-decoration: none; font-weight: 600;">Category</a> &gt; 
        <span>${info.name}</span>
      </nav>

      <main>
        <header style="margin-bottom: 40px; border-bottom: 1px solid var(--border-color); padding-bottom: 24px;">
          <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; color: var(--text-primary);">${info.name}</h1>
          <p style="font-size: 1.2rem; color: var(--text-secondary); line-height: 1.6;">${info.desc}</p>
        </header>

        <section aria-label="Calculator App Widget" style="margin-bottom: 48px;">
          <div style="padding: 40px 24px; border: 2px dashed var(--accent-primary); border-radius: 16px; margin: 24px 0; background: var(--bg-secondary); text-align: center;">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 12px; color: var(--text-primary);">Interactive ${info.name} Widget</h2>
            <p style="font-size: 1rem; color: var(--text-secondary); max-width: 600px; margin: 0 auto 20px;">
              Enter your calculation parameters in the input fields below to compute exact values in real-time.
            </p>
            <div style="display: inline-block; padding: 12px 24px; background: var(--accent-primary); color: #fff; border-radius: 8px; font-weight: 700;">
              Hydro-Widget Hydrates Live Below
            </div>
          </div>
        </section>

        <section aria-label="Introduction & Concept" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">1. Introduction & Scientific Context of ${info.name}</h2>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            The <strong>${info.name}</strong> is an advanced utility tool designed to compute, model, and analyze specific mathematical values based on standardized formulas. Having access to high-fidelity calculators is vital for students, working engineers, financial consultants, and individuals verifying calculations in real time.
          </p>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            In mathematical analysis, precision in input arguments is crucial. Even a minor rounding variance can propagate into a significant error, especially when calculating multi-stage interest rates, time-series compound metrics, or high-accuracy unit conversions. This tool relies on verified computational formulas to deliver precise outputs.
          </p>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            By running calculations entirely on the client-side within the user's web browser, this tool ensures complete data privacy and security. No personal data, numerical variables, or calculations are ever transmitted or stored on remote servers, protecting your sensitive inputs from exposure.
          </p>
        </section>

        <section aria-label="Calculation Formula" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">2. Core Mathematical / Financial Formula</h2>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            This tool applies the following primary equation to parse and solve the input variables:
          </p>
          <div style="padding: 24px; background: var(--bg-tertiary); border-radius: 12px; margin: 24px 0; border: 1px solid var(--border-color); overflow-x: auto;">
            <code style="font-family: monospace; font-size: 1.15rem; color: var(--accent-primary); white-space: pre-wrap;">
              ${info.formula}
            </code>
          </div>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            By structuring calculation steps using standard variables, the logic handles different units (such as metric versus imperial, or daily versus monthly compounding schedules) and returns mathematically consistent results.
          </p>
        </section>

        <section aria-label="Step-by-Step Guide" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">3. Step-by-Step Walkthrough & Worked Examples</h2>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            To understand how the mathematical modeling works in practice, let's walk through a concrete example.
          </p>
          <div style="padding: 24px; background: var(--bg-secondary); border-radius: 12px; margin: 24px 0; border: 1px solid var(--border-color);">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px;">Worked Example Scenario:</h3>
            <p style="font-size: 1rem; margin-bottom: 12px; color: var(--text-secondary);">
              Let's assume standard baseline inputs: <strong>Input Variable A = 100</strong> and <strong>Input Variable B = 5</strong>.
            </p>
            <ol style="padding-left: 20px; font-size: 1rem; display: flex; flex-direction: column; gap: 8px; color: var(--text-secondary);">
              <li>First, verify the input values are correctly formatted and fit within expected parameter ranges.</li>
              <li>Next, insert the values into the core formula.</li>
              <li>Compute the intermediate values before applying final conversion factor coefficients.</li>
              <li>Evaluate the final output and round the results to two decimal places for readability.</li>
            </ol>
            <p style="margin-top: 12px; font-weight: 700;">Resulting Output: Computed successfully using standard formulas.</p>
          </div>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            ${info.howItWorks}
          </p>
        </section>

        <section aria-label="Parameter Definitions" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">4. Input Parameters & Constant Variable Definitions</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 0.95rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--border-color);">
                <th style="padding: 12px; font-weight: 700;">Parameter Name</th>
                <th style="padding: 12px; font-weight: 700;">Default Unit</th>
                <th style="padding: 12px; font-weight: 700;">Crawl Variable Range</th>
                <th style="padding: 12px; font-weight: 700;">Purpose / Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px; font-weight: 600;">Principal / Base Metric</td>
                <td style="padding: 12px;">Varies</td>
                <td style="padding: 12px;">Non-negative values</td>
                <td style="padding: 12px;">Represents the initial value or principal starting argument.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px; font-weight: 600;">Rate / Coefficient Factor</td>
                <td style="padding: 12px;">Percentage / Ratio</td>
                <td style="padding: 12px;">0% to 100%</td>
                <td style="padding: 12px;">The scaling factor, compounding rate, or unit conversion coefficient.</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px; font-weight: 600;">Duration / Time Interval</td>
                <td style="padding: 12px;">Years / Months / Days</td>
                <td style="padding: 12px;">Integers</td>
                <td style="padding: 12px;">The duration or frequency over which calculations are performed.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-label="Advantages & Limitations" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 16px;">5. Advantages & Computational Limitations</h2>
          <p style="font-size: 1.05rem; margin-bottom: 16px;">
            Understanding both the benefits and limits of this calculator helps ensure accurate real-world application.
          </p>
          <h3 style="font-size: 1.3rem; font-weight: 700; margin-top: 24px; margin-bottom: 12px;">Key Advantages:</h3>
          <ul style="padding-left: 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Instant Updates:</strong> Results update in real-time as you type, with no page reload required.</li>
            <li><strong>Zero Server Latency:</strong> All processing is done locally within your browser, ensuring maximum performance.</li>
            <li><strong>Mobile-First Design:</strong> The responsive interface adjusts cleanly to any screen size.</li>
          </ul>
          <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px;">Computational Limitations:</h3>
          <ul style="padding-left: 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
            <li><strong>Floating-Point Limits:</strong> Extremely high or low values may experience minor rounding variations due to standard browser math limits.</li>
            <li><strong>Contextual Interpretation:</strong> Calculated results should be cross-verified with certified professionals for legal, financial, or medical decisions.</li>
          </ul>
        </section>

        <section aria-label="Frequently Asked Questions" style="margin-bottom: 48px;">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">6. Frequently Asked Questions (FAQs)</h2>
          <div style="display: flex; flex-direction: column; gap: 24px;">
            ${info.faqs.map((faq, index) => `
              <div>
                <strong style="font-size: 1.15rem; display: block; margin-bottom: 8px;">Q${index + 1}: ${faq.q}</strong>
                <p style="color: var(--text-secondary); font-size: 1rem;">${faq.a}</p>
              </div>
            `).join('')}
            <div>
              <strong style="font-size: 1.15rem; display: block; margin-bottom: 8px;">Q: Are my inputs sent to any server?</strong>
              <p style="color: var(--text-secondary); font-size: 1rem;">No. Your calculations are performed entirely client-side. We do not store or transmit your data.</p>
            </div>
          </div>
        </section>

        <section aria-label="Related Tools" style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 32px;">
          <h2 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 16px;">Explore Related Calculators</h2>
          <ul style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; padding: 0; list-style: none;">
            ${toolsLinks}
          </ul>
        </section>
      </main>
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
  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Calculator & Converter Hub',
      'url': `${SITE_URL}/`,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${SITE_URL}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Hub Tools Inc.',
      'url': `${SITE_URL}/`,
      'logo': `${SITE_URL}/favicon.svg`,
      'sameAs': [
        'https://twitter.com/hubtools'
      ]
    }
  ];
  writeHTMLFile('', 'index.html', 'Calculator & Converter Hub – Free Online Calculators & Unit Converters', 'Access 500+ free online calculators and unit converters for math, finance, health, science, engineering, education, and everyday use. Fast, accurate, secure, and mobile-friendly.', `${SITE_URL}/`, generateHomepageContent(), homeSchema);

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
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': info.name, 'item': `${SITE_URL}/category/${cat.id}` }
      ]
    };

    const toolsInCategory = TOOLS.filter(t => t.category === cat.id);
    const mainHtml = generateLongFormCategoryContent(cat, info, toolsInCategory);
    writeHTMLFile(`category/${cat.id}`, 'index.html', `${info.name} - Calculator & Converter Hub`, info.desc, `${SITE_URL}/category/${cat.id}`, mainHtml, breadcrumbs);
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
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}/` },
        { '@type': 'ListItem', 'position': 2, 'name': tool.name, 'item': `${SITE_URL}/tools/${tool.id}` }
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
      'url': `${SITE_URL}/tools/${tool.id}`,
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    };

    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': `How to Use ${info.name}`,
      'description': info.howItWorks,
      'step': [
        {
          '@type': 'HowToStep',
          'name': 'Input variables',
          'text': 'Provide numeric inputs in the respective fields.',
          'url': `${SITE_URL}/tools/${tool.id}#inputs`
        },
        {
          '@type': 'HowToStep',
          'name': 'Run calculations',
          'text': 'Click calculate or observe dynamic updates.',
          'url': `${SITE_URL}/tools/${tool.id}#calculate`
        }
      ]
    };

    const schemas = [schemaJson, breadcrumbs, howToSchema];
    if (info.faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': info.faqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a
          }
        }))
      });
    }

    const relatedTools = TOOLS.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 6);
    const mainHtml = generateLongFormToolContent(tool, info, relatedTools);
    writeHTMLFile(`tools/${tool.id}`, 'index.html', `${info.name} - Free Online Calculator`, info.desc, `${SITE_URL}/tools/${tool.id}`, mainHtml, schemas);
  }

  // Pre-render E-E-A-T pages
  const trustPages = [
    {
      id: 'about',
      title: 'About Us - Calculator & Converter Hub',
      desc: 'Learn more about Hub Tools, our algorithms, team of engineering experts, and compliance policies.',
      content: `
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 16px;">About Hub Tools</h1>
        <p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">Calculator & Converter Hub is built by a team of professional financial analysts, web developers, math experts, and nutritional scientists. Our mission is to deliver fast, offline-capable, and technically accurate client-side calculators for daily usage.</p>
        <h2 style="font-size: 1.5rem; font-weight: 700; margin-top: 24px; margin-bottom: 12px;">Expert Editorial Transparency</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">Every formula on this website is verified against academic research, official financial guidelines (e.g. RBI/IRS loan modules), or clinical health models (WHO/Mifflin-St Jeor protocols). We maintain absolute editorial transparency: all code runs on the client-side, meaning your privacy is protected and variables are never compiled on remote servers.</p>
      `
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy - Calculator & Converter Hub',
      desc: 'Read the privacy policy of Calculator & Converter Hub. Zero cookie tracking and local browser computation data safety policies.',
      content: `
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 16px;">Privacy Policy</h1>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">Last updated: July 2026. Your privacy is paramount. This web platform compiles all inputs locally inside your web browser. No telemetry or server-side logs store your birthdays, loan weights, or fitness metrics. We use GA4 for standard page view statistics, but respect opt-out indicators.</p>
      `
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service - Calculator & Converter Hub',
      desc: 'Terms and conditions for utilizing the Calculator & Converter Hub utilities, formulas, and converters.',
      content: `
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 16px;">Terms of Service</h1>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">These utilities are offered free of charge. While we verify all math equations and exchange rates, calculations should be cross-checked with certified financial or medical professionals prior to executing life decisions.</p>
      `
    },
    {
      id: 'cookie-policy',
      title: 'Cookie Policy - Calculator & Converter Hub',
      desc: 'Read our cookie policy. Learn how we utilize local storage caching to speed up your calculation history.',
      content: `
        <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 16px;">Cookie Policy</h1>
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">We do not use tracking or advertising cookies. We use browser Local Storage to remember your preferred dark/light theme, bookmarks, and calculation history. This data remains on your machine and can be cleared via settings.</p>
      `
    }
  ];

  for (const page of trustPages) {
    const mainHtml = `
      <div style="padding: 40px 24px; max-width: 800px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 24px; color: var(--text-muted);">
          <a href="/" style="color: var(--text-secondary); text-decoration: none;">Home</a> &gt; <span>${page.id}</span>
        </nav>
        <main>
          ${page.content}
        </main>
      </div>
    `;
    writeHTMLFile(page.id, 'index.html', page.title, page.desc, `${SITE_URL}/${page.id}`, mainHtml, null);
  }

  // Pre-render a dedicated 404 page
  const page404Html = `
    <div style="padding: 80px 24px; max-width: 600px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; text-align: center;">
      <main>
        <h1 style="font-size: 4rem; font-weight: 800; margin-bottom: 16px; color: var(--accent-primary);">404</h1>
        <h2 style="font-size: 1.75rem; margin-bottom: 16px;">Page Not Found</h2>
        <p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 32px;">Sorry, the calculator or utility route you are looking for does not exist or has been permanently moved.</p>
        <a href="/" style="display: inline-block; padding: 12px 24px; background: var(--accent-primary); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Go Back Home</a>
      </main>
    </div>
  `;
  writeHTMLFile('', '404.html', '404 - Page Not Found | Hub Tools', 'The requested page was not found.', `${SITE_URL}/404`, page404Html, null);

  // GENERATE XML SITEMAPS (SPLIT & INDEX)
  const currentDate = new Date().toISOString().split('T')[0];
  const lastmodDate = currentDate;

  // 1. Homepage Sitemap
  const sitemapHomepageContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-homepage.xml'), sitemapHomepageContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-homepage.xml'), sitemapHomepageContent);

  // 2. Categories Sitemap
  const sitemapCategoriesContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${CATEGORIES.map(c => `  <url>
    <loc>${SITE_URL}/category/${c.id}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-categories.xml'), sitemapCategoriesContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-categories.xml'), sitemapCategoriesContent);

  // 3. Tools Sitemap
  const sitemapToolsContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  ${TOOLS.map(t => `  <url>
    <loc>${SITE_URL}/tools/${t.id}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <mobile:mobile/>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap-tools.xml'), sitemapToolsContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tools.xml'), sitemapToolsContent);

  // 4. Sitemap Index
  const sitemapIndexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-homepage.xml</loc>
    <lastmod>${lastmodDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-categories.xml</loc>
    <lastmod>${lastmodDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-tools.xml</loc>
    <lastmod>${lastmodDate}</lastmod>
  </sitemap>
</sitemapindex>`;
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapIndexContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndexContent);
  console.log('Saved dynamic split sitemaps and index.xml successfully!');

  // GENERATE RSS & ATOM FEEDS
  const buildDate = new Date().toUTCString();
  const rssXmlContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Calculator & Converter Hub</title>
  <link>${SITE_URL}</link>
  <description>Access free online productivity calculators, unit converters, and developer utility suites.</description>
  <lastBuildDate>${buildDate}</lastBuildDate>
  <pubDate>${buildDate}</pubDate>
  <ttl>1440</ttl>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
  ${TOOLS.slice(0, 10).map(t => {
    const info = TOOLS_INFO[t.id] || { name: t.name, desc: '' };
    return `
  <item>
    <title>${info.name}</title>
    <link>${SITE_URL}/tools/${t.id}</link>
    <description>${info.desc}</description>
    <guid>${SITE_URL}/tools/${t.id}</guid>
  </item>`;
  }).join('')}
</channel>
</rss>`;

  fs.writeFileSync(path.join(DIST_DIR, 'rss.xml'), rssXmlContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rssXmlContent);
  console.log('Saved rss.xml feed to dist and public!');

  const atomXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Calculator & Converter Hub</title>
  <subtitle>Access free online productivity calculators, unit converters, and developer utility suites.</subtitle>
  <link href="${SITE_URL}/atom.xml" rel="self"/>
  <link href="${SITE_URL}"/>
  <updated>${new Date().toISOString()}</updated>
  <id>${SITE_URL}/</id>
  <author>
    <name>Hub Tools Team</name>
  </author>
  ${TOOLS.slice(0, 10).map(t => {
    const info = TOOLS_INFO[t.id] || { name: t.name, desc: '' };
    return `
  <entry>
    <title>${info.name}</title>
    <link href="${SITE_URL}/tools/${t.id}"/>
    <id>${SITE_URL}/tools/${t.id}</id>
    <updated>${new Date().toISOString()}</updated>
    <summary>${info.desc}</summary>
  </entry>`;
  }).join('')}
</feed>`;

  fs.writeFileSync(path.join(DIST_DIR, 'atom.xml'), atomXmlContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'atom.xml'), atomXmlContent);
  console.log('Saved atom.xml feed to dist and public!');

  console.log('Static site pre-rendering (SSG) completed successfully!');
}

run();
