import type { Tool, Category } from '../types';
import { AgeCalculator, DateDifference, CountdownTimer } from './AgeDateTools';
import { UniversalUnitConverter } from './ConverterTools';
import { CurrencyConverter } from './CurrencyTools';
import { EmiCalculator, SipCalculator, CompoundInterestCalculator } from './FinanceTools';
import { BmiCalculator, BmrCalculator, WaterIntakeCalculator } from './HealthTools';
import { ScientificCalculator, GpaCalculator, PercentageCalculator } from './AcademicTools';

// Travel, Lifestyle, Vehicle, Shopping, Fitness, Personal
import { TimeZoneConverter, WorldClock, PackingChecklist } from './TravelTools';
import { ElectricityCalculator, RentAffordability, PaintCalculator } from './LifestyleTools';
import { FuelMileage, EvChargingCost, VehicleDepreciation } from './VehicleTools';
import { DiscountCalculator, ProfitMarginCalculator, VatGstCalculator } from './ShoppingTools';
import { RunningPace, WorkoutCalorie, OneRepMax, ProteinIntake } from './FitnessTools';
import { PregnancyDueDate, OvulationCalculator, LifeExpectancy } from './PersonalTools';

// Banking, Business, Weather, Real Estate, Nutrition
import { LoanEligibility, SavingsGoal, InflationCalculator } from './BankingTools';
import { GoldLoanCalculator } from './GoldLoanCalculator';
import { LifeInsuranceCalculator } from './LifeInsuranceCalculator';
import { BreakEvenCalculator, RoiCalculator, StartupRunway } from './BusinessTools';
import { WeatherDashboard, CarbonFootprint, SolarSavings } from './WeatherTools';
import { RentalYield, HomeAffordability, PropertyAppreciation } from './RealEstateTools';
import { MacroCalculator, HealthyWeight, MealPlanner } from './NutritionTools';

export const CATEGORIES: Category[] = [
  { id: 'age-date', name: 'Age & Date', description: 'Calculate exact age, countdowns, and date intervals.', icon: 'Calendar' },
  { id: 'converters', name: 'Unit Converters', description: 'Convert metric and imperial measurements instantly.', icon: 'RefreshCw' },
  { id: 'currency', name: 'Currency Hub', description: 'Real-time currency converter with live exchange rates.', icon: 'DollarSign' },
  { id: 'finance', name: 'Financial Planners', description: 'Calculate EMIs, SIPs, compounding, and interest.', icon: 'Landmark' },
  { id: 'health', name: 'Health & Fitness', description: 'Monitor BMI, daily BMR, and water intake stats.', icon: 'Heart' },
  { id: 'academic', name: 'Academic & Math', description: 'Scientific calculator, GPA semester tools, and percentages.', icon: 'Calculator' },
  
  // Travel, Lifestyle, Vehicle, Shopping, Fitness, Personal
  { id: 'travel', name: 'Travel & Global', description: 'TimeZone converter, world clocks, and checklists.', icon: 'Globe' },
  { id: 'lifestyle', name: 'Home & Lifestyle', description: 'Electricity bills, paint volumes, and rent budgets.', icon: 'Home' },
  { id: 'vehicle', name: 'Vehicle & Transport', description: 'Fuel mileage, electric car charging, and depreciation.', icon: 'Gauge' },
  { id: 'shopping', name: 'Shopping Planners', description: 'Calculate product discounts, profit margins, and sales tax.', icon: 'Tag' },
  { id: 'fitness', name: 'Sports & Training', description: 'Running pace estimators, burned calories, and lifting maxes.', icon: 'Flame' },
  { id: 'personal', name: 'Family & Personal', description: 'Pregnancy calendars, ovulation trackers, and longevity.', icon: 'Hourglass' },

  // Banking, Business, Weather, Real Estate, Nutrition
  { id: 'banking', name: 'Banking & Money', description: 'Loan eligibilities, savings goals, and inflation calculators.', icon: 'Landmark' },
  { id: 'business', name: 'Business & Startup', description: 'Compute break-evens, ROI returns, and cash runway months.', icon: 'TrendingUp' },
  { id: 'weather', name: 'Weather & Climate', description: 'Air quality trackers, carbon footprints, and solar panels.', icon: 'Sun' },
  { id: 'realestate', name: 'Real Estate Tools', description: 'Rental yields, stamp duty fees, and property appreciation.', icon: 'Home' },
  { id: 'nutrition', name: 'Food & Nutrition', description: 'Daily calorie macro splits, healthy weight, and meal plans.', icon: 'Activity' }
];

export const TOOLS: Tool[] = [
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, weeks, days, and seconds.',
    category: 'age-date',
    icon: 'Calendar',
    component: <AgeCalculator />,
    seoKeywords: ['age calculator', 'calculate birth age', 'birthday countdown', 'zodiac']
  },
  {
    id: 'date-difference',
    name: 'Date Difference Calculator',
    description: 'Calculate the total days, months, and years between two dates.',
    category: 'age-date',
    icon: 'Hourglass',
    component: <DateDifference />,
    seoKeywords: ['date difference', 'days between dates', 'duration calculator']
  },
  {
    id: 'countdown-timer',
    name: 'Event Countdown',
    description: 'Track time remaining to custom future events.',
    category: 'age-date',
    icon: 'Clock',
    component: <CountdownTimer />,
    seoKeywords: ['countdown timer', 'days left', 'event countdown']
  },
  {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    description: 'Convert Length, Weight, Temp, Area, Volume, Speed, Time, and Storage.',
    category: 'converters',
    icon: 'RefreshCw',
    component: <UniversalUnitConverter />,
    seoKeywords: ['unit converter', 'convert length', 'convert weight', 'celsius to fahrenheit', 'convert volume']
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert global exchange rates instantly using live public feed.',
    category: 'currency',
    icon: 'DollarSign',
    component: <CurrencyConverter />,
    seoKeywords: ['currency converter', 'usd to inr', 'exchange rates', 'forex converter']
  },
  {
    id: 'emi-calculator',
    name: 'Loan EMI Calculator',
    description: 'Calculate monthly home, auto, or personal loan payments with schedules.',
    category: 'finance',
    icon: 'Landmark',
    component: <EmiCalculator />,
    seoKeywords: ['emi calculator', 'loan calculator', 'amortization schedule', 'mortgage']
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    description: 'Calculate estimated returns on systematic investment plans.',
    category: 'finance',
    icon: 'Award',
    component: <SipCalculator />,
    seoKeywords: ['sip calculator', 'mutual fund returns', 'wealth calculator']
  },
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    description: 'Calculate compounding interest growth with frequency metrics.',
    category: 'finance',
    icon: 'Percent',
    component: <CompoundInterestCalculator />,
    seoKeywords: ['compound interest', 'compound growth', 'interest calculator']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Evaluate Body Mass Index along with tailored clinical advice.',
    category: 'health',
    icon: 'Activity',
    component: <BmiCalculator />,
    seoKeywords: ['bmi calculator', 'body mass index', 'body fat scale']
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calorie Calculator',
    description: 'Estimate your active Basal Metabolic Rate daily energy budget.',
    category: 'health',
    icon: 'Heart',
    component: <BmrCalculator />,
    seoKeywords: ['bmr calculator', 'basal metabolic rate', 'daily calories']
  },
  {
    id: 'water-intake',
    name: 'Water Intake Calculator',
    description: 'Get recommended daily hydration requirements in liters.',
    category: 'health',
    icon: 'Droplet',
    component: <WaterIntakeCalculator />,
    seoKeywords: ['water intake', 'hydration calculator', 'daily water goal']
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    description: 'Perform advanced mathematical operations and functions.',
    category: 'academic',
    icon: 'Calculator',
    component: <ScientificCalculator />,
    seoKeywords: ['scientific calculator', 'online calculator', 'math solver']
  },
  {
    id: 'gpa-calculator',
    name: 'GPA & CGPA Calculator',
    description: 'Determine semester and cumulative grade point averages.',
    category: 'academic',
    icon: 'Award',
    component: <GpaCalculator />,
    seoKeywords: ['gpa calculator', 'cgpa', 'semester grades']
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Solve general percentage proportions and percentage change.',
    category: 'academic',
    icon: 'Hash',
    component: <PercentageCalculator />,
    seoKeywords: ['percentage calculator', 'calculate percent', 'fraction to percentage']
  },

  // Travel Tools
  {
    id: 'timezone-converter',
    name: 'Time Zone Converter',
    description: 'Compare multiple time zones and schedule global meetings.',
    category: 'travel',
    icon: 'Globe',
    component: <TimeZoneConverter />,
    seoKeywords: ['timezone converter', 'convert timezones', 'gmt to est', 'time planner']
  },
  {
    id: 'world-clock',
    name: 'World Clock',
    description: 'Check local real-time running hours across main global cities.',
    category: 'travel',
    icon: 'Clock',
    component: <WorldClock />,
    seoKeywords: ['world clock', 'time in london', 'time in new york']
  },
  {
    id: 'packing-checklist',
    name: 'Packing Checklist',
    description: 'Organize trip items, gear, and travel documents dynamically.',
    category: 'travel',
    icon: 'CheckSquare',
    component: <PackingChecklist />,
    seoKeywords: ['packing checklist', 'travel packing list', 'packing planner']
  },

  // Lifestyle Tools
  {
    id: 'electricity-bill',
    name: 'Electricity Cost Calculator',
    description: 'Estimate utility power bills based on appliance usage.',
    category: 'lifestyle',
    icon: 'Lightbulb',
    component: <ElectricityCalculator />,
    seoKeywords: ['electricity bill', 'power usage cost', 'kwh calculator']
  },
  {
    id: 'rent-affordability',
    name: 'Rent Affordability',
    description: 'Compute maximal recommended home rent limits based on income.',
    category: 'lifestyle',
    icon: 'Home',
    component: <RentAffordability />,
    seoKeywords: ['rent affordability', 'rent budget calculator', 'can i afford this rent']
  },
  {
    id: 'paint-calculator',
    name: 'Wall Paint Calculator',
    description: 'Determine total paint liters required to coat walls.',
    category: 'lifestyle',
    icon: 'PenTool',
    component: <PaintCalculator />,
    seoKeywords: ['paint calculator', 'wall paint volume', 'room area decorator']
  },

  // Vehicle Tools
  {
    id: 'fuel-mileage',
    name: 'Fuel Mileage Calculator',
    description: 'Evaluate MPG or Km/L vehicle efficiency from trip logs.',
    category: 'vehicle',
    icon: 'Gauge',
    component: <FuelMileage />,
    seoKeywords: ['fuel mileage', 'mpg calculator', 'kms per liter']
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Cost',
    description: 'Estimate electricity fees to recharge electric vehicles.',
    category: 'vehicle',
    icon: 'Zap',
    component: <EvChargingCost />,
    seoKeywords: ['ev charging cost', 'charge time tesla', 'electricity vehicle charge']
  },
  {
    id: 'vehicle-depreciation',
    name: 'Car Depreciation Calculator',
    description: 'Evaluate future residual book value of vehicles.',
    category: 'vehicle',
    icon: 'Compass',
    component: <VehicleDepreciation />,
    seoKeywords: ['car depreciation', 'vehicle resale value', 'depreciation rate']
  },

  // Shopping Tools
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    description: 'Compute final promotional sales prices and total savings.',
    category: 'shopping',
    icon: 'Tag',
    component: <DiscountCalculator />,
    seoKeywords: ['discount calculator', 'sale price', 'coupon savings']
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    description: 'Calculate gross margins and markups for sales inventories.',
    category: 'shopping',
    icon: 'TrendingUp',
    component: <ProfitMarginCalculator />,
    seoKeywords: ['profit margin', 'markup calculator', 'retail price markup']
  },
  {
    id: 'vat-gst',
    name: 'VAT / GST Calculator',
    description: 'Add or extract tax amounts from total invoice payments.',
    category: 'shopping',
    icon: 'Percent',
    component: <VatGstCalculator />,
    seoKeywords: ['vat calculator', 'gst calculator', 'tax addition tax extraction']
  },

  // Fitness Tools
  {
    id: 'running-pace',
    name: 'Running Pace Calculator',
    description: 'Calculate target running speeds per kilometer or mile.',
    category: 'fitness',
    icon: 'Compass',
    component: <RunningPace />,
    seoKeywords: ['running pace', 'km per minute', 'marathon pace time']
  },
  {
    id: 'workout-calorie',
    name: 'Workout Calorie Burn',
    description: 'Estimate metabolic calories burned during exercise routines.',
    category: 'fitness',
    icon: 'Flame',
    component: <WorkoutCalorie />,
    seoKeywords: ['workout calorie calculator', 'calories burned exercise', 'met burn']
  },
  {
    id: 'one-rep-max',
    name: 'One Rep Max (1RM)',
    description: 'Estimate maximal weight lifting capabilities.',
    category: 'fitness',
    icon: 'Dumbbell',
    component: <OneRepMax />,
    seoKeywords: ['one rep max', '1rm calculator', 'bench press max']
  },
  {
    id: 'protein-intake',
    name: 'Protein Intake Calculator',
    description: 'Get daily protein suggestions based on fitness objectives.',
    category: 'fitness',
    icon: 'Activity',
    component: <ProteinIntake />,
    seoKeywords: ['protein intake', 'daily protein grams', 'macro targets']
  },

  // Personal Tools
  {
    id: 'pregnancy-due-date',
    name: 'Pregnancy Due Date',
    description: 'Estimate childbirth delivery dates and pregnancy progress.',
    category: 'personal',
    icon: 'Calendar',
    component: <PregnancyDueDate />,
    seoKeywords: ['pregnancy due date', 'baby due countdown', 'gestational weeks']
  },
  {
    id: 'ovulation-calculator',
    name: 'Ovulation Calendar',
    description: 'Find fertility windows and menstrual cycle tracking predictions.',
    category: 'personal',
    icon: 'Heart',
    component: <OvulationCalculator />,
    seoKeywords: ['ovulation calculator', 'fertility window calendar', 'fertile days']
  },
  {
    id: 'life-expectancy',
    name: 'Longevity Estimator',
    description: 'Estimate statistical lifespan values based on lifestyle habits.',
    category: 'personal',
    icon: 'Hourglass',
    component: <LifeExpectancy />,
    seoKeywords: ['life expectancy', 'longevity calculator', 'lifespan estimator']
  },

  // Banking Tools
  {
    id: 'loan-eligibility',
    name: 'Loan Eligibility Calculator',
    description: 'Estimate your maximum borrowing limit based on income & EMIs.',
    category: 'banking',
    icon: 'Landmark',
    component: <LoanEligibility />,
    seoKeywords: ['loan eligibility', 'home loan capacity', 'max bank borrowing']
  },
  {
    id: 'savings-goal',
    name: 'Savings Goal Planner',
    description: 'Determine monthly savings needed to reach target capital goals.',
    category: 'banking',
    icon: 'Award',
    component: <SavingsGoal />,
    seoKeywords: ['savings goal', 'sinking fund planner', 'monthly savings savings goal']
  },
  {
    id: 'inflation-purchasing',
    name: 'Inflation Calculator',
    description: 'Calculate purchasing power shifts and equivalent future values.',
    category: 'banking',
    icon: 'TrendingUp',
    component: <InflationCalculator />,
    seoKeywords: ['inflation calculator', 'purchasing power', 'historical buying power']
  },
  {
    id: 'gold-loan',
    name: 'Gold Loan Calculator',
    description: 'Calculate gold loan eligibility, LTV, and monthly repayments based on purity.',
    category: 'banking',
    icon: 'Scale',
    component: <GoldLoanCalculator />,
    seoKeywords: ['gold loan calculator', 'gold emi', '22k gold loan', 'gold per gram', 'ltv calculator']
  },
  {
    id: 'life-insurance',
    name: 'Life Insurance Calculator',
    description: 'Determine ideal life insurance coverage, human life value (HLV), and term policy premiums.',
    category: 'banking',
    icon: 'Shield',
    component: <LifeInsuranceCalculator />,
    seoKeywords: ['life insurance calculator', 'term insurance calculator', 'hlv calculator', 'how much life insurance do i need', 'family protection calculator']
  },

  // Business Tools
  {
    id: 'break-even',
    name: 'Break-Even Calculator',
    description: 'Find target sale volumes required to start generating profits.',
    category: 'business',
    icon: 'Landmark',
    component: <BreakEvenCalculator />,
    seoKeywords: ['break-even calculator', 'overhead break even', 'startup margins']
  },
  {
    id: 'roi-gains',
    name: 'ROI Return Calculator',
    description: 'Compute return percentage and gains on initial investments.',
    category: 'business',
    icon: 'TrendingUp',
    component: <RoiCalculator />,
    seoKeywords: ['roi calculator', 'return on investment percentage', 'net capital gains']
  },
  {
    id: 'startup-runway',
    name: 'Startup Runway Planner',
    description: 'Estimate operational runway months based on burn rate.',
    category: 'business',
    icon: 'Hourglass',
    component: <StartupRunway />,
    seoKeywords: ['startup runway', 'burn rate', 'cash balance runway']
  },

  // Weather Tools
  {
    id: 'weather-aqi',
    name: 'Weather & AQI Dashboard',
    description: 'Check temperatures, air quality indexes, and sun timings.',
    category: 'weather',
    icon: 'Sun',
    component: <WeatherDashboard />,
    seoKeywords: ['weather forecast', 'aqi status air quality index', 'uv levels pollen count']
  },
  {
    id: 'carbon-footprint',
    name: 'Carbon Footprint Calculator',
    description: 'Determine annual metric tons of CO2 created from travel & power.',
    category: 'weather',
    icon: 'Globe',
    component: <CarbonFootprint />,
    seoKeywords: ['carbon footprint', 'co2 calculator', 'greenhouse gas index']
  },
  {
    id: 'solar-savings',
    name: 'Solar Panel Savings',
    description: 'Compute utility offsets, ROI, and solar payback periods.',
    category: 'weather',
    icon: 'SunDim',
    component: <SolarSavings />,
    seoKeywords: ['solar panel savings', 'solar payback years', 'clean energy ROI']
  },

  // Real Estate Tools
  {
    id: 'rental-yield',
    name: 'Rental Yield Calculator',
    description: 'Evaluate gross and net annual rent ROI yield percentages.',
    category: 'realestate',
    icon: 'Percent',
    component: <RentalYield />,
    seoKeywords: ['rental yield', 'property ROI', 'real estate yields']
  },
  {
    id: 'home-affordability',
    name: 'Home Affordability Calculator',
    description: 'Estimate recommended purchase price budgets based on income.',
    category: 'realestate',
    icon: 'Home',
    component: <HomeAffordability />,
    seoKeywords: ['home affordability', 'home purchase budget', 'house price eligibility']
  },
  {
    id: 'property-appreciation',
    name: 'Property Appreciation Calculator',
    description: 'Estimate property valuation appreciation compound growth.',
    category: 'realestate',
    icon: 'ArrowUpRight',
    component: <PropertyAppreciation />,
    seoKeywords: ['property appreciation', 'house appreciation rate', 'compound property growth']
  },

  // Nutrition Tools
  {
    id: 'macro-nutrient',
    name: 'Macro Nutrient Calculator',
    description: 'Compute grams of protein, carbs, and fat based on calories.',
    category: 'nutrition',
    icon: 'Activity',
    component: <MacroCalculator />,
    seoKeywords: ['macro calculator', 'protein carbs fat grams', 'macronutrient target']
  },
  {
    id: 'healthy-weight',
    name: 'Healthy Weight Calculator',
    description: 'Estimate your healthy target weight range based on height.',
    category: 'nutrition',
    icon: 'Heart',
    component: <HealthyWeight />,
    seoKeywords: ['healthy weight range', 'ideal body weight', 'normal weight BMI']
  },
  {
    id: 'meal-planner',
    name: 'Meal Planner Recommendations',
    description: 'Get custom recipe meal suggestions based on diet goals.',
    category: 'nutrition',
    icon: 'Compass',
    component: <MealPlanner />,
    seoKeywords: ['meal planner', 'daily meal plans', 'diet recommendations breakfast dinner']
  }
];
