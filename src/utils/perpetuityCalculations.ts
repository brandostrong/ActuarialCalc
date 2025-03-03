import { InterestRateType, PerpetuityPaymentType } from './types';
import { convertInterestRate } from './annuityCalculations';

// Helper function to adjust for payment timing
const getPaymentAdjustment = (
  paymentType: PerpetuityPaymentType,
  effectiveRate: number
): number => {
  switch (paymentType) {
    case 'immediate':
      return 1;
    case 'due':
      return 1 + effectiveRate / 100;
    case 'continuous':
      return Math.exp(effectiveRate / 200); // average of beginning and end of period
    default:
      return 1;
  }
};

// Basic perpetuity present value
export const calculatePresentValueBasicPerpetuity = (
  payment: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0
): number => {
  // Convert interest rate to effective rate if needed
  const effectiveRate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  
  // Convert to decimal
  const i = effectiveRate / 100;
  
  if (i <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get payment timing adjustment
  const adjustment = getPaymentAdjustment(paymentType, effectiveRate);
  
  // Calculate base present value
  let presentValue = (payment * adjustment) / i;
  
  // Apply deferral discount if needed
  if (deferredPeriods > 0) {
    presentValue = presentValue / Math.pow(1 + i, deferredPeriods);
  }
  
  return presentValue;
};

// Growing perpetuity present value
export const calculatePresentValueGrowingPerpetuity = (
  payment: number,
  interestRate: number,
  growthRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0
): number => {
  // Convert interest rate to effective rate if needed
  const effectiveRate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  
  // Convert to decimals
  const i = effectiveRate / 100;
  const g = growthRate / 100;
  
  if (i <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }
  
  if (i <= g) {
    throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
  }

  // Get payment timing adjustment
  const adjustment = getPaymentAdjustment(paymentType, effectiveRate);
  
  // Calculate base present value
  let presentValue = (payment * adjustment) / (i - g);
  
  // Apply deferral discount if needed
  if (deferredPeriods > 0) {
    presentValue = presentValue / Math.pow(1 + i, deferredPeriods);
  }
  
  return presentValue;
};

// Basic perpetuity payment
export const calculatePaymentBasicPerpetuity = (
  presentValue: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0
): number => {
  // Convert interest rate to effective rate if needed
  const effectiveRate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  
  // Convert to decimal
  const i = effectiveRate / 100;
  
  if (i <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get payment timing adjustment
  const adjustment = getPaymentAdjustment(paymentType, effectiveRate);
  
  // Calculate base payment
  let payment = (presentValue * i) / adjustment;
  
  // Adjust for deferred periods
  if (deferredPeriods > 0) {
    payment = payment * Math.pow(1 + i, deferredPeriods);
  }
  
  return payment;
};

// Growing perpetuity payment
export const calculatePaymentGrowingPerpetuity = (
  presentValue: number,
  interestRate: number,
  growthRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0
): number => {
  // Convert interest rate to effective rate if needed
  const effectiveRate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  
  // Convert to decimals
  const i = effectiveRate / 100;
  const g = growthRate / 100;
  
  if (i <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }
  
  if (i <= g) {
    throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
  }

  // Get payment timing adjustment
  const adjustment = getPaymentAdjustment(paymentType, effectiveRate);
  
  // Calculate base payment
  let payment = (presentValue * (i - g)) / adjustment;
  
  // Adjust for deferred periods
  if (deferredPeriods > 0) {
    payment = payment * Math.pow(1 + i, deferredPeriods);
  }
  
  return payment;
};

// Calculate growth rate for growing perpetuity
export const calculateGrowthRate = (
  presentValue: number,
  payment: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0
): number => {
  // Convert interest rate to effective rate if needed
  const effectiveRate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  
  // Convert interest rate to decimal
  const i = effectiveRate / 100;
  
  if (i <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get payment timing adjustment
  const adjustment = getPaymentAdjustment(paymentType, effectiveRate);
  
  // Adjust payment for timing and deferral
  let adjustedPayment = payment / adjustment;
  if (deferredPeriods > 0) {
    adjustedPayment = adjustedPayment / Math.pow(1 + i, deferredPeriods);
  }
  
  // From PV = PMT / (i - g), solve for g:
  // PV * (i - g) = PMT
  // PV * i - PV * g = PMT
  // -PV * g = PMT - PV * i
  // g = (PV * i - PMT) / PV
  const g = (presentValue * i - adjustedPayment) / presentValue;
  
  // Convert back to percentage
  return g * 100;
};

// Calculate deferred periods for perpetuity
export const calculateDeferredPeriods = (
  presentValue: number,
  payment: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  growthRate: number | null = null
): number => {
  // Convert interest rate to effective rate if needed
  const effectiveRate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  
  // Convert to decimal
  const i = effectiveRate / 100;
  
  if (i <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get payment timing adjustment
  const adjustment = getPaymentAdjustment(paymentType, effectiveRate);
  
  // Calculate theoretical present value without deferral
  let theoreticalPV;
  if (growthRate === null) {
    // Basic perpetuity
    theoreticalPV = (payment * adjustment) / i;
  } else {
    // Growing perpetuity
    const g = growthRate / 100;
    if (i <= g) {
      throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
    }
    theoreticalPV = (payment * adjustment) / (i - g);
  }
  
  // From PV = theoreticalPV / (1 + i)^m, solve for m:
  // PV * (1 + i)^m = theoreticalPV
  // (1 + i)^m = theoreticalPV / PV
  // m = ln(theoreticalPV / PV) / ln(1 + i)
  return Math.log(theoreticalPV / presentValue) / Math.log(1 + i);
};