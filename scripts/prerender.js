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
    <article style="padding: 24px; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-secondary);">
      <h3 style="margin-bottom: 8px;"><a href="/category/${cat.id}" style="color: var(--accent-primary); text-decoration: none; font-weight: 700;">${cat.name}</a></h3>
      <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">Access exact calculators and offline-compatible converters inside ${cat.name}.</p>
    </article>
  `).join('');

  return `
    <div style="padding: 40px 24px; max-width: 1200px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
      <header style="margin-bottom: 40px; text-align: center;">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 16px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Calculator & Converter Hub</h1>
        <p style="font-size: 1.1rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto;">Your enterprise-grade utility suite of calculation algorithms, unit conversions, developers helpers, and currency tools designed for zero lag and offline usage.</p>
      </header>
      
      <main>
        <section aria-label="Tool Categories">
          <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 8px;">Explore Calculator Categories</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin: 24px 0;">
            ${categoriesHtml}
          </div>
        </section>
      </main>

      <footer style="margin-top: 60px; border-top: 1px solid var(--border-color); padding: 32px 0; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
        <p>© ${new Date().getFullYear()} Hub Tools Inc. All rights reserved.</p>
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
  writeHTMLFile('', 'index.html', 'Calculator & Converter Hub - All-in-One Online Productivity Tools', 'Access free online tools including exact Age Calculator, Unit Converters, Live Currency rates, Loan EMI planners, health index trackers, and JSON formatters.', `${SITE_URL}/`, generateHomepageContent(), homeSchema);

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
    const toolsHtml = toolsInCategory.map(t => `
      <article style="padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 16px; background: var(--bg-secondary);">
        <h4 style="margin-bottom: 6px;"><a href="/tools/${t.id}" style="color: var(--accent-primary); text-decoration: none; font-weight: 700;">${t.name}</a></h4>
        <p style="font-size: 0.85rem; color: var(--text-secondary);">${t.description || `${t.name} calculations.`}</p>
      </article>
    `).join('');

    const mainHtml = `
      <div style="padding: 40px 24px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 24px; color: var(--text-muted);">
          <a href="/" style="color: var(--text-secondary); text-decoration: none;">Home</a> &gt; <span>${info.name}</span>
        </nav>
        
        <main>
          <header style="margin-bottom: 32px;">
            <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 12px;">${info.name}</h1>
            <p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6;">${info.desc}</p>
          </header>

          <section aria-label="Category Tools">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">Available Utilities</h2>
            <div style="margin: 20px 0;">
              ${toolsHtml}
            </div>
          </section>

          ${info.formula ? `
            <section style="margin-top: 32px;" aria-label="Formulas">
              <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px;">Logic & Conversion Formulas</h3>
              <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; background: var(--bg-tertiary); padding: 16px; border-radius: 8px;">${info.formula}</p>
            </section>
          ` : ''}

          <section style="margin-top: 32px;" aria-label="Instructions">
            <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px;">Usage Guide</h3>
            <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">${info.howItWorks}</p>
          </section>

          ${info.faqs.length > 0 ? `
            <section style="margin-top: 32px;" aria-label="Frequently Asked Questions">
              <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 16px;">Frequently Asked Questions</h3>
              ${info.faqs.map(faq => `
                <div style="margin-bottom: 16px;">
                  <strong style="display: block; font-size: 1rem; margin-bottom: 4px;">Q: ${faq.q}</strong>
                  <p style="font-size: 0.95rem; color: var(--text-secondary);">${faq.a}</p>
                </div>
              `).join('')}
            </section>
          ` : ''}
        </main>
      </div>
    `;

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

    // Inject FAQ schema if present
    const schemas = [schemaJson, breadcrumbs];
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

    const mainHtml = `
      <div style="padding: 40px 24px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
        <nav aria-label="Breadcrumb" style="font-size: 0.85rem; margin-bottom: 24px; color: var(--text-muted);">
          <a href="/" style="color: var(--text-secondary); text-decoration: none;">Home</a> &gt; <a href="/category/${tool.category}" style="color: var(--text-secondary); text-decoration: none;">Category</a> &gt; <span>${info.name}</span>
        </nav>
        
        <main>
          <header style="margin-bottom: 32px;">
            <h1 style="font-size: 2.2rem; font-weight: 800; margin-bottom: 12px;">${info.name}</h1>
            <p style="font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6;">${info.desc}</p>
          </header>

          <article>
            <div style="padding: 32px; border: 1px solid var(--border-color); border-radius: 12px; margin: 24px 0; background: var(--bg-secondary); text-align: center;">
              <h2 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 12px;">Interactive ${info.name} Interface</h2>
              <p style="font-size: 0.95rem; color: var(--text-secondary);">The interactive widget hydrates dynamically here. Please enable Javascript in your browser.</p>
            </div>

            <section aria-label="How it works" style="margin-top: 32px;">
              <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px;">How to Calculate & Use this Tool</h3>
              <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6;">${info.howItWorks}</p>
            </section>

            <section aria-label="Mathematical formula" style="margin-top: 32px;">
              <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 12px;">Calculation Formula</h3>
              <code style="display: block; padding: 16px; background: var(--bg-tertiary); border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.95rem; line-height: 1.5; color: var(--accent-primary);">
                ${info.formula}
              </code>
            </section>

            ${info.faqs.length > 0 ? `
              <section aria-label="FAQs" style="margin-top: 32px;">
                <h3 style="font-size: 1.3rem; font-weight: 700; margin-bottom: 16px;">Frequently Asked Questions</h3>
                ${info.faqs.map(faq => `
                  <div style="margin-bottom: 16px;">
                    <strong style="display: block; font-size: 1rem; margin-bottom: 4px;">Q: ${faq.q}</strong>
                    <p style="font-size: 0.95rem; color: var(--text-secondary);">${faq.a}</p>
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </article>
        </main>
      </div>
    `;

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

  // GENERATE XML SITEMAP
  const allUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    ...CATEGORIES.map(c => ({ loc: `${SITE_URL}/category/${c.id}`, priority: '0.8', changefreq: 'weekly' })),
    ...TOOLS.map(t => ({ loc: `${SITE_URL}/tools/${t.id}`, priority: '0.9', changefreq: 'weekly' })),
    ...trustPages.map(p => ({ loc: `${SITE_URL}/${p.id}`, priority: '0.5', changefreq: 'monthly' }))
  ];

  const sitemapXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXmlContent);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXmlContent);
  console.log('Saved dynamic sitemap.xml to dist and public!');

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
