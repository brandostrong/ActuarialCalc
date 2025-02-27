// Types for the annuity calculator

export type InterestRateType = 'effective' | 'nominal' | 'force' | 'discount';
export type AnnuityType = 'immediate' | 'due' | 'deferred';
export type AnnuityVariationType = 'level' | 'increasing' | 'geometric';
export type SolveForType = 'payment' | 'presentValue' | 'futureValue' | 'interestRate' | 'periods';

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

export interface CalculationResult {
  result: number;
  amortizationSchedule?: AmortizationEntry[];
}