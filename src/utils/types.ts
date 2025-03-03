// Types for the calculators

export type InterestRateType = 'effective' | 'nominal' | 'force' | 'simple' | 'discount' | 'nominal-simple';
export type PerpetuityType = 'basic' | 'growing';
export type PerpetuityPaymentType = 'immediate' | 'due' | 'continuous';
export type PerpetuityPartType = 'payment' | 'presentValue' | 'growthRate' | 'deferredPeriods';
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
  result: number | null;
  error: string | null;
}

export interface CalculationResult {
  result: number;
  amortizationSchedule?: AmortizationEntry[];
}