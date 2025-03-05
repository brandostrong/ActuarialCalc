import { InterestRateType, PerpetuityPaymentType } from './types';
import { convertInterestRate } from './annuityCalculations';

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

// Basic perpetuity present value
export const calculatePresentValueBasicPerpetuity = (
  payment: number,
  interestRate: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0
): number => {
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // Calculate base present value: PV = PMT / (i/100)
  let presentValue = payment / (rate / 100);
  
  // Apply payment timing adjustment
  presentValue = presentValue * getPaymentAdjustment(paymentType, rate);
  
  // Apply deferral discount if needed
  if (deferredPeriods > 0) {
    presentValue = presentValue / Math.pow(1 + rate/100, deferredPeriods);
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
  
  // Apply payment timing adjustment
  presentValue = presentValue * getPaymentAdjustment(paymentType, rate);
  
  // Apply deferral discount if needed
  if (deferredPeriods > 0) {
    presentValue = presentValue / Math.pow(1 + rate/100, deferredPeriods);
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
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // Calculate base payment: PMT = PV * (i/100)
  let payment = presentValue * (rate / 100);
  
  // Apply payment timing adjustment
  payment = payment / getPaymentAdjustment(paymentType, rate);
  
  // Adjust for deferral if needed
  if (deferredPeriods > 0) {
    payment = payment * Math.pow(1 + rate/100, deferredPeriods);
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
  
  // Calculate base payment: PMT = PV * ((i-g)/100)
  let payment = presentValue * ((rate - growthRate) / 100);
  
  // Apply payment timing adjustment
  payment = payment / getPaymentAdjustment(paymentType, rate);
  
  // Adjust for deferral if needed
  if (deferredPeriods > 0) {
    payment = payment * Math.pow(1 + rate/100, deferredPeriods);
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
  if (interestRate <= 0) {
    throw new Error('Interest rate must be positive for perpetuity calculations');
  }

  // Get the effective rate if needed
  let rate = interestRate;
  if (interestRateType !== 'effective') {
    rate = convertInterestRate(interestRate, interestRateType, 'effective', compoundingFrequency);
  }
  
  // From PV = PMT/(i-g), solve for g
  // PV = PMT * 100/((i-g))
  // (i-g) = PMT * 100/PV
  // g = i - PMT * 100/PV
  let growthRate = rate - (payment * 100) / (presentValue * getPaymentAdjustment(paymentType, rate));
  
  // Adjust for deferred periods if needed
  if (deferredPeriods > 0) {
    growthRate = rate - (payment * Math.pow(1 + rate/100, deferredPeriods) * 100) / (presentValue * getPaymentAdjustment(paymentType, rate));
  }
  
  return growthRate;
};

// Calculate interest rate for perpetuity
export const calculateInterestRate = (
  presentValue: number,
  payment: number,
  interestRateType: InterestRateType = 'effective',
  compoundingFrequency: number = 1,
  paymentType: PerpetuityPaymentType = 'immediate',
  deferredPeriods: number = 0,
  growthRate: number | null = null
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
    
    // Calculate PV with current rate guess
    let calculatedPV = payment / (mid / 100);
    
    if (growthRate !== null) {
      calculatedPV = payment / ((mid - g) / 100);
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