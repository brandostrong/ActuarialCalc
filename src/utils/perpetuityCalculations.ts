import { InterestRateType, PerpetuityPaymentType } from './types';
import { convertInterestRate } from './annuityCalculations';

// Helper function to adjust payments for payment frequency
const adjustForPaymentFrequency = (
  payment: number,
  paymentFrequency: number,
  interestRate: number
): number => {
  if (paymentFrequency === 1) return payment;
  const effectivePayment = payment / paymentFrequency;
  const i = interestRate / 100;
  const n = paymentFrequency;
  return effectivePayment * (1 - Math.pow(1 + i, -1/n))/(1 - Math.pow(1 + i, -1)) * n;
};

// Helper function to adjust for payment timing
const getPaymentAdjustment = (
  paymentType: PerpetuityPaymentType,
  rate: number
): number => {
  const i = rate / 100;
  switch (paymentType) {
    case 'immediate':
      return 1;
    case 'due':
      return 1 + i;
    case 'continuous':
      return Math.exp(i / 2);
    default:
      return 1;
  }
};

// Level perpetuity present value
export const calculatePresentValueLevelPerpetuity = (
  payment: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0,
  paymentFrequency: number = 1
): number => {
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // Adjust payment for payment frequency
  const adjustedPayment = adjustForPaymentFrequency(payment, paymentFrequency, rate);
  
  // Calculate base present value: PV = PMT / (i/100)
  let presentValue = adjustedPayment / (rate / 100);
  
  // Apply payment timing adjustment
  presentValue = presentValue * getPaymentAdjustment(paymentType, rate);
  
  // Apply deferral discount if needed
  if (deferredPeriods > 0) {
    presentValue = presentValue / Math.pow(1 + rate/100, deferredPeriods);
  }
  
  return presentValue;
};

// Increasing perpetuity present value
export const calculatePresentValueIncreasingPerpetuity = (
  payment: number,
  interestRate: number,
  growthRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0,
  paymentFrequency: number = 1
): number => {
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  if (interestRate <= growthRate) {
    throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // Adjust payment for payment frequency
  const adjustedPayment = adjustForPaymentFrequency(payment, paymentFrequency, rate);
  
  // Calculate base present value: PV = PMT / ((i-g)/100)
  let presentValue = adjustedPayment / ((rate - growthRate) / 100);
  
  // Apply payment timing adjustment
  presentValue = presentValue * getPaymentAdjustment(paymentType, rate);
  
  // Apply deferral discount if needed
  if (deferredPeriods > 0) {
    presentValue = presentValue / Math.pow(1 + rate/100, deferredPeriods);
  }
  
  return presentValue;
};

// Level perpetuity payment
export const calculatePaymentLevelPerpetuity = (
  presentValue: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0,
  paymentFrequency: number = 1
): number => {
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // Calculate initial payment: PMT = PV * (i/100)
  let payment = presentValue * (rate / 100);
  
  // Apply payment timing adjustment
  payment = payment / getPaymentAdjustment(paymentType, rate);
  
  // Adjust for payment frequency
  payment = payment * (1 - Math.pow(1 + rate/100, -1/paymentFrequency))/(1 - Math.pow(1 + rate/100, -1));
  
  // Adjust for deferral if needed
  if (deferredPeriods > 0) {
    payment = payment * Math.pow(1 + rate/100, deferredPeriods);
  }
  
  return payment;
};

// Increasing perpetuity payment
export const calculatePaymentIncreasingPerpetuity = (
  presentValue: number,
  interestRate: number,
  growthRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0,
  paymentFrequency: number = 1
): number => {
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  if (interestRate <= growthRate) {
    throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // Calculate initial payment: PMT = PV * ((i-g)/100)
  let payment = presentValue * ((rate - growthRate) / 100);
  
  // Apply payment timing adjustment
  payment = payment / getPaymentAdjustment(paymentType, rate);
  
  // Adjust for payment frequency
  payment = payment * (1 - Math.pow(1 + rate/100, -1/paymentFrequency))/(1 - Math.pow(1 + rate/100, -1));
  
  // Adjust for deferral if needed
  if (deferredPeriods > 0) {
    payment = payment * Math.pow(1 + rate/100, deferredPeriods);
  }
  
  return payment;
};

// Calculate interest rate for perpetuity
export const calculateInterestRate = (
  presentValue: number,
  payment: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0,
  growthRate: number | null = null,
  paymentFrequency: number = 1
): number => {
  const g = growthRate || 0;
  const tolerance = 0.0000001;
  const maxIterations = 1000;
  
  // Initial guess as percentage
  let guess = payment * 100 / presentValue;
  if (growthRate !== null) {
    guess = Math.max(guess + g, g + 0.01);
  }
  
  let left = g + 0.01;
  let right = Math.max(guess * 2, 100);
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const mid = (left + right) / 2;
    
    // Adjust payment for payment frequency
    const adjustedPayment = adjustForPaymentFrequency(payment, paymentFrequency, mid);
    
    // Calculate PV with current rate guess
    let calculatedPV = adjustedPayment / (mid / 100);
    
    if (growthRate !== null) {
      calculatedPV = adjustedPayment / ((mid - g) / 100);
    }
    
    // Apply payment timing adjustment
    calculatedPV = calculatedPV * getPaymentAdjustment(paymentType, mid);
    
    if (deferredPeriods > 0) {
      calculatedPV = calculatedPV / Math.pow(1 + mid/100, deferredPeriods);
    }
    
    const error = Math.abs(calculatedPV - presentValue);
    if (error < tolerance * presentValue) {
      return mid;
    }
    
    if (calculatedPV > presentValue) {
      left = mid;
    } else {
      right = mid;
    }
    
    if (right - left < tolerance) {
      return (left + right) / 2;
    }
  }
  
  throw new Error('Could not converge on interest rate solution');
};

// Geometric perpetuity present value (immediate)
export const calculatePresentValueGeometricPerpetuityImmediate = (
    payment: number,
    interestRate: number,
    growthRate: number,
    interestRateType: InterestRateType = 'effective',
    compoundingFrequency: number = 1
  ): number => {
    if (interestRate <= 0) {
      throw new Error('Interest rate must be positive for perpetuity calculations');
    }
  
    if (interestRate <= growthRate) {
      throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
    }
  
    // Get the effective rate if needed
    let rate = interestRate;
    if (interestRateType !== 'effective') {
      rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
    }
    
    // Calculate base present value: PV = PMT / ((i-g)/100)
    let presentValue = payment / ((rate - growthRate) / 100);
    
    return presentValue;
};

// Geometric perpetuity present value (due)
export const calculatePresentValueGeometricPerpetuityDue = (
    payment: number,
    interestRate: number,
    growthRate: number,
    interestRateType: InterestRateType = 'effective',
    compoundingFrequency: number = 1
  ): number => {
    if (interestRate <= 0) {
      throw new Error('Interest rate must be positive for perpetuity calculations');
    }
  
    if (interestRate <= growthRate) {
      throw new Error('Interest rate must be greater than growth rate for growing perpetuity calculations');
    }
  
    // Get the effective rate if needed
    let rate = interestRate;
    if (interestRateType !== 'effective') {
      rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
    }
    
    // Calculate base present value: PV = PMT * (1 + i) / ((i-g)/100)
    let presentValue = payment * (1 + rate/100) / ((rate - growthRate) / 100);
    
    return presentValue;
};

// Future value of a level perpetuity at time t
export const calculateFutureValueLevelPerpetuity = (
    _payment: number,
    _interestRate: number,
    _time: number,
    _interestRateType: InterestRateType = 'effective',
    _compoundingFrequency: number = 1,
    _paymentType: PerpetuityPaymentType = 'immediate'
): number => {
  throw new Error('The future value of a perpetuity is infinite.');
}