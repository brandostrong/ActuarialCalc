// Types for the calculators

export type InterestRateType = 'effective' | 'nominal' | 'force' | 'simple' | 'discount' | 'nominal-simple' | 'coupon';
export type PerpetuityType = 'level' | 'increasing';
export type PerpetuityPaymentType = 'immediate' | 'due' | 'continuous';
export type PerpetuityPartType = 'payment' | 'presentValue' | 'interestRate' | 'growthRate' | 'deferredPeriods' | 'futureValue';
export type AnnuityType = 'immediate' | 'due' | 'deferred';
export type AnnuityVariationType = 'level' | 'increasing' | 'geometric';
export type SolveForType = 'payment' | 'presentValue' | 'futureValue' | 'interestRate' | 'periods' | 'increase';

// Interest Rate Calculator Types

export interface InterestRateCalculatorState {
  sourceRate: number | null;
  sourceRateType: InterestRateType;
  sourceCompoundingFrequency: number; // For nominal rates
  sourceCustomFrequency: boolean;
  sourceCustomFrequencyValue: number | null;
  targetRateType: InterestRateType;
  targetCompoundingFrequency: number; // For nominal rates
  targetCustomFrequency: boolean;
  targetCustomFrequencyValue: number | null;
  showAllEquivalentRates: boolean;
  initialAmount: number | null;
  timeInYears: number | null;
  showTimeValueCalculations: boolean;
  results: {
    targetRate: number | null;
    effectiveRate: number | null;
    nominalRates: { frequency: number; rate: number | null }[];
    forceOfInterest: number | null;
    simpleRate: number | null;
    discountRate: number | null;
    futureValue: number | null;
    presentValue: number | null;
  };
  error: string | null;
}

export interface AnnuityCalculatorState {
  solveFor: SolveForType;
  annuityType: AnnuityType;
  variationType: AnnuityVariationType;
  payment: number | null;
  presentValue: number | null;
  futureValue: number | null;
  accumulatedValue: number | null;
  interestRate: number | null;
  interestRateType: InterestRateType;
  compoundingFrequency: number;
  periods: number | null;
  deferredPeriods: number | null; // For deferred annuities
  increase: number | null; // For increasing annuities
  growthRate: number | null; // For geometric annuities
  paymentFrequency: number;
  result: number | null;
  amortizationSchedule: AmortizationEntry[] | null;
  error: string | null;
}

export interface AmortizationEntry {
  period: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
  accumulatedValue?: number;
  futureValue?: number;
  presentValue?: number;
}

export interface PerpetuityCalculatorState {
  perpetuityType: PerpetuityType;
  paymentType: PerpetuityPaymentType;
  solveFor: PerpetuityPartType;
  payment: number | null;
  presentValue: number | null;
  interestRate: number | null;
  interestRateType: InterestRateType;
  compoundingFrequency: number;
  growthRate: number | null;
  deferredPeriods: number | null;
  paymentFrequency: number;
  result: number | null;
  error: string | null;
}

export type BondType = 'regular' | 'callable';
export type BondPriceType = 'premium' | 'discount' | 'par';
export type BondSolveForType = 'price' | 'yield' | 'couponRate';

export interface BondCalculatorState {
  bondType: BondType;
  faceValue: number | null;
  couponRate: number | null;
  redemptionValue: number | null;
  yieldRate: number | null;
  periods: number | null;
  frequency: number;
  callDates?: number[];
  callPrices?: number[];
  priceType: BondPriceType | null;
  result: number | null;
  amortizationSchedule: BondAmortizationEntry[] | null;
  error: string | null;
}

export interface BondAmortizationEntry {
  period: number;
  couponPayment: number;
  interestEarned: number;
  amortizationAmount: number;
  bookValue: number;
}

export interface CalculationResult {
  result: number;
  amortizationSchedule?: AmortizationEntry[] | BondAmortizationEntry[];
}

export interface CashFlow {
  time: number;
  amount: number;
}

export interface PortfolioComponent {
  duration: number;
  value: number;
}

export interface DurationConvexityResult {
  macaulayDuration: number;
  modifiedDuration: number;
  macaulayConvexity: number;
  modifiedConvexity: number;
}

export interface DurationDurations {
  macaulayDuration: number | null;
  modifiedDuration: number | null;
  macaulayConvexity: number | null;
  modifiedConvexity: number | null;
}

export type DurationSolveFor = 'price' | 'yield';

export interface DurationCalculatorState {
  solveFor: DurationSolveFor;
  cashFlows: CashFlow[];
  interestRate: number | null;
  price: number | null;
  portfolioComponents?: PortfolioComponent[];
  timeDifference?: number;
  result: number | null;
  error: string | null;
  durations: DurationDurations;
}