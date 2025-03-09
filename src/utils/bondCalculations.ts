import { BondType, BondPriceType } from './types';
import { presentValueAnnuityImmediate } from './annuityCalculations';

/**
 * Calculate the present value discount factor
 * v = 1/(1+i)
 */
export const calculateDiscountFactor = (i: number): number => {
  return 1 / (1 + i / 100);
};

/**
 * Calculate the basic price of a bond
 * P = Fr * a_{n|}^i + C * v^n
 * Where:
 * F = Face value
 * r = Coupon rate per period
 * C = Redemption value
 * i = Yield rate per period
 * n = Number of periods
 * 
 * @throws Error if periods is less than or equal to 0
 */
export const calculateBondPrice = (
  faceValue: number,
  couponRate: number,
  redemptionValue: number,
  yieldRate: number,
  periods: number
): number => {
  if (periods <= 0) {
    throw new Error('Number of periods must be positive');
  }
  if (faceValue < 0) {
    throw new Error('Face value must be non-negative');
  }
  if (yieldRate < 0) {
    throw new Error('Yield rate must be non-negative');
  }

  // Calculate coupon payment
  const couponPayment = faceValue * (couponRate / 100);

  // Present value of coupon payments (using annuity-immediate formula)
  const pvCoupons = presentValueAnnuityImmediate(
    couponPayment,
    yieldRate,
    periods
  );

  // Present value of redemption
  const v = calculateDiscountFactor(yieldRate);
  const pvRedemption = redemptionValue * Math.pow(v, periods);

  return pvCoupons + pvRedemption;
};

/**
 * Determine if a bond is trading at premium, discount, or par
 * Premium: P > C or Fr > Ci
 * Discount: P < C or Fr < Ci
 * Par: P = C or Fr = Ci
 */
export const getBondPriceType = (
  price: number,
  redemptionValue: number,
  couponPayment: number,
  yieldRate: number
): BondPriceType => {
  const theoreticalCoupon = redemptionValue * (yieldRate / 100);

  if (price > redemptionValue || couponPayment > theoreticalCoupon) {
    return 'premium';
  } else if (price < redemptionValue || couponPayment < theoreticalCoupon) {
    return 'discount';
  } else {
    return 'par';
  }
};

/**
 * Calculate book value at time t
 * B_t = Fr * a_{n-t|}^i + C * v^{n-t}
 * 
 * @throws Error if currentPeriod is greater than or equal to totalPeriods
 */
export const calculateBookValue = (
  faceValue: number,
  couponRate: number,
  redemptionValue: number,
  yieldRate: number,
  totalPeriods: number,
  currentPeriod: number
): number => {
  if (currentPeriod >= totalPeriods) {
    throw new Error('Current period must be less than total periods');
  }

  // Calculate remaining periods
  const remainingPeriods = totalPeriods - currentPeriod;

  // Use basic bond price formula with remaining periods
  return calculateBondPrice(
    faceValue,
    couponRate,
    redemptionValue,
    yieldRate,
    remainingPeriods
  );
};

/**
 * Generate amortization schedule for a bond
 * Records interest earned, amortization amount, and book value for each period
 */
export const generateBondAmortizationSchedule = (
  faceValue: number,
  couponRate: number,
  redemptionValue: number,
  yieldRate: number,
  periods: number
): Array<{
  period: number;
  couponPayment: number;
  interestEarned: number;
  amortizationAmount: number;
  bookValue: number;
}> => {
  const schedule: Array<{
    period: number;
    couponPayment: number;
    interestEarned: number;
    amortizationAmount: number;
    bookValue: number;
  }> = [];

  // Calculate initial values
  const i = yieldRate / 100;  // Yield rate as decimal
  const fr = faceValue * (couponRate / 100);  // Coupon payment
  const initialBookValue = calculateBondPrice(faceValue, couponRate, redemptionValue, yieldRate, periods);
  
  // Calculate total premium and amortization per period
  const totalPremium = initialBookValue - redemptionValue;
  const amortizationPerPeriod = totalPremium / periods;
  
  // Track book value through periods
  let currentBookValue = initialBookValue;

  // Generate amortization schedule
  for (let t = 1; t <= periods; t++) {
    // Calculate exact interest earned on current book value
    const interest = currentBookValue * i;
    
    // Use even amortization except for final period
    const amortization = t === periods
      ? currentBookValue - redemptionValue
      : amortizationPerPeriod;
    
    // Calculate next book value
    const nextBookValue = currentBookValue - amortization;

    // Add to schedule with consistent rounding
    schedule.push({
      period: t,
      couponPayment: Number(fr.toFixed(2)),
      interestEarned: Number(interest.toFixed(2)),
      amortizationAmount: Number(amortization.toFixed(2)),
      bookValue: Number(nextBookValue.toFixed(2))
    });

    // Update book value for next period
    currentBookValue = nextBookValue;
  }

  return schedule;
};

/**
 * Calculate the price of a callable bond
 * For premium bonds, use earliest call date
 * For discount bonds, use latest call date
 * 
 * @throws Error if callDates and callPrices arrays have different lengths
 */
export const calculateCallableBondPrice = (
  faceValue: number,
  couponRate: number,
  yieldRate: number,
  callDates: number[],
  callPrices: number[]
): number => {
  if (callDates.length !== callPrices.length) {
    throw new Error('Call dates array must match call prices array length');
  }

  // Validate call dates are in chronological order
  for (let i = 1; i < callDates.length; i++) {
    if (callDates[i] <= callDates[i-1]) {
      throw new Error('Call dates must be in chronological order');
    }
  }
  
  // Calculate regular bond price to each call date
  const prices = callDates.map((date, index) => 
    calculateBondPrice(
      faceValue,
      couponRate,
      callPrices[index],
      yieldRate,
      date
    )
  );
  
  // For premium bond (coupon rate > yield rate): use minimum price (earliest call)
  // For discount bond (coupon rate < yield rate): use maximum price (latest call)
  const couponPayment = faceValue * (couponRate / 100);
  const theoreticalCoupon = faceValue * (yieldRate / 100);
  
  return (couponPayment > theoreticalCoupon)
    ? Math.min(...prices)  // Premium bond
    : Math.max(...prices); // Discount bond
};