import { create, all } from 'mathjs';
import { InterestRateType, AnnuityType } from './types';

// Create a math.js instance with all functions
// We're not using math directly but creating it for potential future use
const _math = create(all); // Renamed to _math to indicate it's intentionally unused

// Interest rate conversion functions
export const convertInterestRate = (
  rate: number,
  fromType: InterestRateType,
  toType: InterestRateType,
  compoundingFrequency: number = 1
): number => {
  // Convert rate to decimal
  const r = rate / 100;
  
  // Convert from the given type to effective annual rate
  let effectiveRate: number;
  
  switch (fromType) {
    case 'effective':
      effectiveRate = r;
      break;
    case 'nominal':
      effectiveRate = Math.pow(1 + r / compoundingFrequency, compoundingFrequency) - 1;
      break;
    case 'force':
      effectiveRate = Math.exp(r) - 1;
      break;
    case 'discount':
      effectiveRate = r / (1 - r);
      break;
    default:
      throw new Error(`Unsupported interest rate type: ${fromType}`);
  }
  
  // Convert from effective annual rate to the target type
  switch (toType) {
    case 'effective':
      return effectiveRate;
    case 'nominal':
      return compoundingFrequency * (Math.pow(1 + effectiveRate, 1 / compoundingFrequency) - 1);
    case 'force':
      return Math.log(1 + effectiveRate);
    case 'discount':
      return effectiveRate / (1 + effectiveRate);
    default:
      throw new Error(`Unsupported interest rate type: ${toType}`);
  }
};

// Present value of an annuity immediate (ordinary annuity)
export const presentValueAnnuityImmediate = (
  payment: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  return payment * (1 - Math.pow(1 + i, -periods)) / i;
};

// Present value of an annuity due
export const presentValueAnnuityDue = (
  payment: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  return payment * (1 - Math.pow(1 + i, -periods)) / i * (1 + i);
};

// Present value of a deferred annuity immediate
export const presentValueDeferredAnnuityImmediate = (
  payment: number,
  interestRate: number,
  periods: number,
  deferredPeriods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  
  // Calculate the present value of an immediate annuity
  const immediateAnnuityPV = presentValueAnnuityImmediate(payment, interestRate, periods);
  
  // Apply the deferral by discounting back by the deferred periods
  return immediateAnnuityPV / Math.pow(1 + i, deferredPeriods);
};

// Present value of a deferred annuity due
export const presentValueDeferredAnnuityDue = (
  payment: number,
  interestRate: number,
  periods: number,
  deferredPeriods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  
  // Calculate the present value of an annuity due
  const annuityDuePV = presentValueAnnuityDue(payment, interestRate, periods);
  
  // Apply the deferral by discounting back by the deferred periods
  return annuityDuePV / Math.pow(1 + i, deferredPeriods);
};

// Future value of an annuity immediate
export const futureValueAnnuityImmediate = (
  payment: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  return payment * (Math.pow(1 + i, periods) - 1) / i;
};

// Future value of an annuity due
export const futureValueAnnuityDue = (
  payment: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  return payment * (Math.pow(1 + i, periods) - 1) / i * (1 + i);
};

// Future value of a deferred annuity immediate
export const futureValueDeferredAnnuityImmediate = (
  payment: number,
  interestRate: number,
  periods: number,
  _deferredPeriods: number // Renamed to _deferredPeriods to indicate it's intentionally unused
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  
  // Calculate the future value of an immediate annuity
  const immediateAnnuityFV = futureValueAnnuityImmediate(payment, interestRate, periods);
  
  // The future value is the same as a non-deferred annuity, just with a different time frame
  return immediateAnnuityFV;
};

// Future value of a deferred annuity due
export const futureValueDeferredAnnuityDue = (
  payment: number,
  interestRate: number,
  periods: number,
  _deferredPeriods: number // Renamed to _deferredPeriods to indicate it's intentionally unused
): number => {
  const i = interestRate / 100;
  if (i === 0) return payment * periods;
  
  // Calculate the future value of an annuity due
  const annuityDueFV = futureValueAnnuityDue(payment, interestRate, periods);
  
  // The future value is the same as a non-deferred annuity, just with a different time frame
  return annuityDueFV;
};

// Present value of an increasing annuity immediate (arithmetic)
export const presentValueIncreasingAnnuityImmediate = (
  firstPayment: number,
  increase: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) {
    // When interest rate is 0, use the arithmetic sum formula
    return periods * firstPayment + (periods * (periods - 1) * increase) / 2;
  }
  
  const annuityPV = presentValueAnnuityImmediate(firstPayment, interestRate, periods);
  const increasingTermPV = increase * (
    (1 - Math.pow(1 + i, -periods)) / i - 
    periods * Math.pow(1 + i, -periods)
  ) / i;
  
  return annuityPV + increasingTermPV;
};

// Present value of an increasing annuity due (arithmetic)
export const presentValueIncreasingAnnuityDue = (
  firstPayment: number,
  increase: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  if (i === 0) {
    // When interest rate is 0, use the arithmetic sum formula
    return periods * firstPayment + (periods * (periods - 1) * increase) / 2;
  }
  
  return (1 + i) * presentValueIncreasingAnnuityImmediate(firstPayment, increase, interestRate, periods);
};

// Present value of a geometrically increasing annuity immediate
export const presentValueGeometricAnnuityImmediate = (
  firstPayment: number,
  growthRate: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  const g = growthRate / 100;
  
  if (i === g) {
    return firstPayment * periods / (1 + i);
  }
  
  if (i === 0) {
    // When interest rate is 0, use the geometric sum formula
    let sum = 0;
    for (let t = 0; t < periods; t++) {
      sum += firstPayment * Math.pow(1 + g, t);
    }
    return sum;
  }
  
  return firstPayment * (1 - Math.pow((1 + g) / (1 + i), periods)) / (i - g);
};

// Present value of a geometrically increasing annuity due
export const presentValueGeometricAnnuityDue = (
  firstPayment: number,
  growthRate: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  
  return (1 + i) * presentValueGeometricAnnuityImmediate(
    firstPayment,
    growthRate,
    interestRate,
    periods
  );
};

// Calculate payment for a given present value
export const calculatePaymentFromPV = (
  presentValue: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate',
  deferredPeriods: number = 0
): number => {
  const i = interestRate / 100;
  
  if (i === 0) {
    return presentValue / periods;
  }
  
  // For deferred annuities, adjust the present value
  let adjustedPV = presentValue;
  if (annuityType === 'deferred' && deferredPeriods > 0) {
    // Adjust the present value by the deferred periods
    adjustedPV = presentValue * Math.pow(1 + i, deferredPeriods);
  }
  
  if (annuityType === 'immediate' || annuityType === 'deferred') {
    return adjustedPV * i / (1 - Math.pow(1 + i, -periods));
  } else {
    return adjustedPV * i / ((1 - Math.pow(1 + i, -periods)) * (1 + i));
  }
};

// Calculate payment for a given future value
export const calculatePaymentFromFV = (
  futureValue: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  const i = interestRate / 100;
  
  if (i === 0) {
    return futureValue / periods;
  }
  
  if (annuityType === 'immediate') {
    return futureValue * i / (Math.pow(1 + i, periods) - 1);
  } else {
    return futureValue * i / ((Math.pow(1 + i, periods) - 1) * (1 + i));
  }
};

// Calculate payment for a given present value of an increasing annuity
export const calculatePaymentFromPVIncreasing = (
  presentValue: number,
  increase: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  const i = interestRate / 100;
  
  if (i === 0) {
    // For zero interest rate, use arithmetic sum formula and solve for first payment
    // PV = n*PMT + (n*(n-1)*I)/2
    // Solve for PMT: PMT = (PV - (n*(n-1)*I)/2) / n
    return (presentValue - (periods * (periods - 1) * increase) / 2) / periods;
  }
  
  // For annuity immediate
  let annuityFactor = (1 - Math.pow(1 + i, -periods)) / i;
  let increasingFactor = (1 - Math.pow(1 + i, -periods)) / i - periods * Math.pow(1 + i, -periods) / i;
  
  // Adjust for annuity due if needed
  if (annuityType === 'due') {
    annuityFactor *= (1 + i);
    increasingFactor *= (1 + i);
  }
  
  // Solve for PMT from: PV = PMT * annuityFactor + I * increasingFactor
  // PMT = (PV - I * increasingFactor) / annuityFactor
  return (presentValue - increase * increasingFactor) / annuityFactor;
};

// Calculate payment for a given present value of a geometric annuity
export const calculatePaymentFromPVGeometric = (
  presentValue: number,
  growthRate: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  const i = interestRate / 100;
  const g = growthRate / 100;
  
  if (i === 0) {
    // For zero interest rate, use geometric sum formula and solve for first payment
    // PV = PMT * (1 - (1+g)^n) / (-g)
    // Solve for PMT: PMT = PV * (-g) / (1 - (1+g)^n)
    return presentValue * (-g) / (1 - Math.pow(1 + g, periods));
  }
  
  if (i === g) {
    // Special case when i = g
    // PV = PMT * n / (1 + i)
    // Solve for PMT: PMT = PV * (1 + i) / n
    const factor = annuityType === 'immediate' ? 1 : (1 + i);
    return presentValue * (1 + i) / (periods * factor);
  }
  
  // For annuity immediate
  let factor = (1 - Math.pow((1 + g) / (1 + i), periods)) / (i - g);
  
  // Adjust for annuity due if needed
  if (annuityType === 'due') {
    factor *= (1 + i);
  }
  
  // Solve for PMT from: PV = PMT * factor
  // PMT = PV / factor
  return presentValue / factor;
};

// Calculate interest rate for a given present value and payment
export const calculateInterestRateFromPV = (
  presentValue: number,
  payment: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // This requires numerical methods to solve
  // We'll use a simple iterative approach
  
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  // Initial guess (between 0% and 20%)
  let low = 0;
  let high = 20;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = (low + high) / 2;
    
    let calculatedPV;
    if (annuityType === 'immediate') {
      calculatedPV = presentValueAnnuityImmediate(payment, mid, periods);
    } else {
      calculatedPV = presentValueAnnuityDue(payment, mid, periods);
    }
    
    if (Math.abs(calculatedPV - presentValue) < tolerance) {
      return mid;
    }
    
    // If calculated PV is greater than target PV, we need a higher interest rate
    // If calculated PV is less than target PV, we need a lower interest rate
    if (calculatedPV > presentValue) {
      low = mid;  // Need higher interest rate
    } else {
      high = mid;  // Need lower interest rate
    }
  }
  
  // Return the best approximation after max iterations
  return (low + high) / 2;
};

// Calculate interest rate for a given future value and payment
export const calculateInterestRateFromFV = (
  futureValue: number,
  payment: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // This requires numerical methods to solve
  // We'll use a simple iterative approach
  
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  // Initial guess (between 0% and 20%)
  let low = 0;
  let high = 20;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = (low + high) / 2;
    
    let calculatedFV;
    if (annuityType === 'immediate') {
      calculatedFV = futureValueAnnuityImmediate(payment, mid, periods);
    } else {
      calculatedFV = futureValueAnnuityDue(payment, mid, periods);
    }
    
    if (Math.abs(calculatedFV - futureValue) < tolerance) {
      return mid;
    }
    
    if (calculatedFV < futureValue) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  // Return the best approximation after max iterations
  return (low + high) / 2;
};

// Calculate interest rate for a given present value and payment for an increasing annuity
export const calculateInterestRateFromPVIncreasing = (
  presentValue: number,
  payment: number,
  increase: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // This requires numerical methods to solve
  // We'll use a simple iterative approach
  
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  // Initial guess (between 0% and 20%)
  let low = 0;
  let high = 20;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = (low + high) / 2;
    
    let calculatedPV;
    if (annuityType === 'immediate') {
      calculatedPV = presentValueIncreasingAnnuityImmediate(payment, increase, mid, periods);
    } else {
      calculatedPV = presentValueIncreasingAnnuityDue(payment, increase, mid, periods);
    }
    
    if (Math.abs(calculatedPV - presentValue) < tolerance) {
      return mid;
    }
    
    if (calculatedPV > presentValue) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  // Return the best approximation after max iterations
  return (low + high) / 2;
};

// Calculate interest rate for a given present value and payment for a geometric annuity
export const calculateInterestRateFromPVGeometric = (
  presentValue: number,
  payment: number,
  growthRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // This requires numerical methods to solve
  // We'll use a simple iterative approach
  
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  // Initial guess (between 0% and 20%)
  let low = 0;
  let high = 20;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = (low + high) / 2;
    
    let calculatedPV;
    if (annuityType === 'immediate') {
      calculatedPV = presentValueGeometricAnnuityImmediate(payment, growthRate, mid, periods);
    } else {
      calculatedPV = presentValueGeometricAnnuityDue(payment, growthRate, mid, periods);
    }
    
    if (Math.abs(calculatedPV - presentValue) < tolerance) {
      return mid;
    }
    
    if (calculatedPV > presentValue) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  // Return the best approximation after max iterations
  return (low + high) / 2;
};

// Calculate number of periods for a given present value and payment
export const calculatePeriodsFromPV = (
  presentValue: number,
  payment: number,
  interestRate: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  const i = interestRate / 100;
  
  if (i === 0) {
    return presentValue / payment;
  }
  
  let factor;
  if (annuityType === 'immediate') {
    factor = 1;
  } else {
    factor = 1 + i;
  }
  
  return -Math.log(1 - (presentValue * i) / (payment * factor)) / Math.log(1 + i);
};

// Calculate number of periods for a given future value and payment
export const calculatePeriodsFromFV = (
  futureValue: number,
  payment: number,
  interestRate: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  const i = interestRate / 100;
  
  if (i === 0) {
    return futureValue / payment;
  }
  
  let factor;
  if (annuityType === 'immediate') {
    factor = 1;
  } else {
    factor = 1 + i;
  }
  
  return Math.log(1 + (futureValue * i) / (payment * factor)) / Math.log(1 + i);
};

// Calculate number of periods for a given present value and payment for an increasing annuity
export const calculatePeriodsFromPVIncreasing = (
  presentValue: number,
  payment: number,
  increase: number,
  interestRate: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // This requires numerical methods to solve
  // We'll use a simple iterative approach
  
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  // Initial guess (between 1 and 100 periods)
  let low = 1;
  let high = 100;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = Math.floor((low + high) / 2); // Use integer periods
    
    let calculatedPV;
    if (annuityType === 'immediate') {
      calculatedPV = presentValueIncreasingAnnuityImmediate(payment, increase, interestRate, mid);
    } else {
      calculatedPV = presentValueIncreasingAnnuityDue(payment, increase, interestRate, mid);
    }
    
    if (Math.abs(calculatedPV - presentValue) < tolerance) {
      return mid;
    }
    
    if (calculatedPV < presentValue) {
      low = mid;
    } else {
      high = mid;
    }
    
    // If we've narrowed down to consecutive integers
    if (high - low <= 1) {
      // Return the closer one
      const lowPV = annuityType === 'immediate'
        ? presentValueIncreasingAnnuityImmediate(payment, increase, interestRate, low)
        : presentValueIncreasingAnnuityDue(payment, increase, interestRate, low);
      
      const highPV = annuityType === 'immediate'
        ? presentValueIncreasingAnnuityImmediate(payment, increase, interestRate, high)
        : presentValueIncreasingAnnuityDue(payment, increase, interestRate, high);
      
      return Math.abs(lowPV - presentValue) < Math.abs(highPV - presentValue) ? low : high;
    }
  }
  
  // Return the best approximation after max iterations
  return Math.floor((low + high) / 2);
};

// Calculate number of periods for a given present value and payment for a geometric annuity
export const calculatePeriodsFromPVGeometric = (
  presentValue: number,
  payment: number,
  growthRate: number,
  interestRate: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // This requires numerical methods to solve
  // We'll use a simple iterative approach
  
  const tolerance = 1e-10;
  const maxIterations = 100;
  
  // Initial guess (between 1 and 100 periods)
  let low = 1;
  let high = 100;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const mid = Math.floor((low + high) / 2); // Use integer periods
    
    let calculatedPV;
    if (annuityType === 'immediate') {
      calculatedPV = presentValueGeometricAnnuityImmediate(payment, growthRate, interestRate, mid);
    } else {
      calculatedPV = presentValueGeometricAnnuityDue(payment, growthRate, interestRate, mid);
    }
    
    if (Math.abs(calculatedPV - presentValue) < tolerance) {
      return mid;
    }
    
    if (calculatedPV < presentValue) {
      low = mid;
    } else {
      high = mid;
    }
    
    // If we've narrowed down to consecutive integers
    if (high - low <= 1) {
      // Return the closer one
      const lowPV = annuityType === 'immediate'
        ? presentValueGeometricAnnuityImmediate(payment, growthRate, interestRate, low)
        : presentValueGeometricAnnuityDue(payment, growthRate, interestRate, low);
      
      const highPV = annuityType === 'immediate'
        ? presentValueGeometricAnnuityImmediate(payment, growthRate, interestRate, high)
        : presentValueGeometricAnnuityDue(payment, growthRate, interestRate, high);
      
      return Math.abs(lowPV - presentValue) < Math.abs(highPV - presentValue) ? low : high;
    }
  }
  
  // Return the best approximation after max iterations
  return Math.floor((low + high) / 2);
};

// Calculate future value from present value
export const calculateFVFromPV = (
  presentValue: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  return presentValue * Math.pow(1 + i, periods);
};

// Calculate present value from future value
export const calculatePVFromFV = (
  futureValue: number,
  interestRate: number,
  periods: number
): number => {
  const i = interestRate / 100;
  return futureValue / Math.pow(1 + i, periods);
};

// Calculate accumulated value from present value and payment
export const calculateAccumulatedValue = (
  presentValue: number,
  payment: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): number => {
  // const i = interestRate / 100; // Unused variable
  
  // Future value of the present value
  const pvFutureValue = calculateFVFromPV(presentValue, interestRate, periods);
  
  // Future value of the annuity
  let annuityFutureValue;
  if (annuityType === 'immediate') {
    annuityFutureValue = futureValueAnnuityImmediate(payment, interestRate, periods);
  } else {
    annuityFutureValue = futureValueAnnuityDue(payment, interestRate, periods);
  }
  
  // Total accumulated value
  return pvFutureValue + annuityFutureValue;
};

// Generate amortization schedule for level annuities
export const generateAmortizationSchedule = (
  loanAmount: number,
  interestRate: number,
  periods: number,
  paymentFrequency: number = 1,
  annuityType: AnnuityType = 'immediate',
  deferredPeriods: number = 0
): Array<{
  period: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}> => {
  const i = interestRate / 100 / paymentFrequency;
  const n = periods * paymentFrequency;
  const deferredN = deferredPeriods * paymentFrequency;
  
  // Calculate payment
  const payment = calculatePaymentFromPV(loanAmount, interestRate / paymentFrequency, n, annuityType, deferredPeriods);
  
  const schedule = [];
  let remainingBalance = loanAmount;
  
  // For deferred annuities, add the deferred periods with no payments
  if (annuityType === 'deferred' && deferredPeriods > 0) {
    for (let period = 1; period <= deferredN; period++) {
      const interestPayment = remainingBalance * i;
      remainingBalance += interestPayment; // Interest accrues during deferral
      
      schedule.push({
        period,
        payment: 0,
        interestPayment,
        principalPayment: 0,
        remainingBalance
      });
    }
  }
  
  // Start period depends on whether we've already added deferred periods
  const startPeriod = (annuityType === 'deferred' && deferredPeriods > 0) ? deferredN + 1 : 1;
  
  // Add regular payment periods
  for (let period = startPeriod; period <= (startPeriod + n - 1); period++) {
    const interestPayment = remainingBalance * i;
    const principalPayment = payment - interestPayment;
    remainingBalance -= principalPayment;
    
    schedule.push({
      period,
      payment,
      interestPayment,
      principalPayment,
      remainingBalance: Math.max(0, remainingBalance) // Avoid negative balance due to rounding
    });
  }
  
  return schedule;
};

// Generate payment schedule for increasing annuities
export const generateIncreasingAnnuitySchedule = (
  presentValue: number,
  firstPayment: number,
  increase: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): Array<{
  period: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}> => {
  const i = interestRate / 100;
  const schedule = [];
  let remainingBalance = presentValue;
  
  // For annuity due, we need to adjust the timing of payments
  const startPeriod = annuityType === 'immediate' ? 1 : 0;
  
  for (let period = startPeriod; period < periods + startPeriod; period++) {
    // Calculate payment for this period
    const payment = firstPayment + (period - startPeriod) * increase;
    
    // Calculate interest for this period
    const interestPayment = remainingBalance * i;
    
    // Calculate principal payment
    const principalPayment = payment - interestPayment;
    
    // Update remaining balance
    remainingBalance -= principalPayment;
    
    schedule.push({
      period,
      payment,
      interestPayment,
      principalPayment,
      remainingBalance: Math.max(0, remainingBalance) // Avoid negative balance due to rounding
    });
  }
  
  return schedule;
};

// Generate payment schedule for geometric annuities
export const generateGeometricAnnuitySchedule = (
  presentValue: number,
  firstPayment: number,
  growthRate: number,
  interestRate: number,
  periods: number,
  annuityType: AnnuityType = 'immediate'
): Array<{
  period: number;
  payment: number;
  interestPayment: number;
  principalPayment: number;
  remainingBalance: number;
}> => {
  const i = interestRate / 100;
  const g = growthRate / 100;
  const schedule = [];
  let remainingBalance = presentValue;
  
  // For annuity due, we need to adjust the timing of payments
  const startPeriod = annuityType === 'immediate' ? 1 : 0;
  
  for (let period = startPeriod; period < periods + startPeriod; period++) {
    // Calculate payment for this period
    const payment = firstPayment * Math.pow(1 + g, period - startPeriod);
    
    // Calculate interest for this period
    const interestPayment = remainingBalance * i;
    
    // Calculate principal payment
    const principalPayment = payment - interestPayment;
    
    // Update remaining balance
    remainingBalance -= principalPayment;
    
    schedule.push({
      period,
      payment,
      interestPayment,
      principalPayment,
      remainingBalance: Math.max(0, remainingBalance) // Avoid negative balance due to rounding
    });
  }
  
  return schedule;
};