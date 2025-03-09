import { describe, it, expect } from 'vitest';
import {
  calculateDiscountFactor,
  calculateBondPrice,
  getBondPriceType,
  calculateBookValue,
  generateBondAmortizationSchedule,
  calculateCallableBondPrice
} from './bondCalculations';
import { convertInterestRate } from './annuityCalculations';

describe('Bond Calculations', () => {
  // Known values for our test problem:
  // - Face value (F) = $1000
  // - Coupon rate (r) = 6% annual
  // - Redemption value (C) = $1000 (equal to face value)
  // - Yield rate (i) = 5% annual
  // - Number of periods (n) = 10 years
  const faceValue = 1000;
  const couponRate = 6;
  const redemptionValue = 1000;
  const yieldRate = 5;
  const periods = 10;

  describe('Basic Bond Price Formula', () => {
    it('calculates present value of coupon payments', () => {
      // Calculate present value of level annuity of coupon payments
      // Fr * a_{n|}^i
      const couponPayment = faceValue * (couponRate / 100);
      const i = yieldRate / 100;
      const annuityPV = couponPayment * (1 - Math.pow(1 + i, -periods)) / i;
      expect(annuityPV).toBeGreaterThan(0);
    });

    it('calculates present value of redemption', () => {
      // Calculate present value of redemption
      // C * v^n where v = 1/(1+i)
      const i = yieldRate / 100;
      const redemptionPV = redemptionValue * Math.pow(1 / (1 + i), periods);
      expect(redemptionPV).toBeGreaterThan(0);
      expect(redemptionPV).toBeLessThan(redemptionValue);
    });

    it('calculates total bond price correctly', () => {
      // Total bond price = PV(coupons) + PV(redemption)
      const i = yieldRate / 100;
      const couponPayment = faceValue * (couponRate / 100);
      const annuityPV = couponPayment * (1 - Math.pow(1 + i, -periods)) / i;
      const redemptionPV = redemptionValue * Math.pow(1 / (1 + i), periods);
      const expectedPrice = annuityPV + redemptionPV;

      // Calculate using our function
      const calculatedPrice = calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        yieldRate,
        periods
      );
      expect(calculatedPrice).toBeCloseTo(expectedPrice, 2);
    });
  });

  describe('Premium/Discount Tests', () => {
    it('identifies premium bonds correctly', () => {
      // A bond is at premium when:
      // 1. Price > Redemption value, OR
      // 2. Coupon rate > Yield rate
      const premiumYield = 4; // Less than 6% coupon rate
      const i = premiumYield / 100;
      const couponPayment = faceValue * (couponRate / 100);
      const annuityPV = couponPayment * (1 - Math.pow(1 + i, -periods)) / i;
      const redemptionPV = redemptionValue * Math.pow(1 / (1 + i), periods);
      const premiumPrice = annuityPV + redemptionPV;

      expect(premiumPrice).toBeGreaterThan(redemptionValue);
      expect(getBondPriceType(
        premiumPrice,
        redemptionValue,
        couponPayment,
        premiumYield
      )).toBe('premium');
    });

    it('identifies discount bonds correctly', () => {
      // A bond is at discount when:
      // 1. Price < Redemption value, OR
      // 2. Coupon rate < Yield rate
      const discountYield = 8; // More than 6% coupon rate
      const i = discountYield / 100;
      const couponPayment = faceValue * (couponRate / 100);
      const annuityPV = couponPayment * (1 - Math.pow(1 + i, -periods)) / i;
      const redemptionPV = redemptionValue * Math.pow(1 / (1 + i), periods);
      const discountPrice = annuityPV + redemptionPV;

      expect(discountPrice).toBeLessThan(redemptionValue);
      expect(getBondPriceType(
        discountPrice,
        redemptionValue,
        couponPayment,
        discountYield
      )).toBe('discount');
    });
  });

  describe('Book Value Tests', () => {
    it('calculates initial book value correctly', () => {
      // Initial book value should equal the bond price
      const i = yieldRate / 100;
      const couponPayment = faceValue * (couponRate / 100);
      const annuityPV = couponPayment * (1 - Math.pow(1 + i, -periods)) / i;
      const redemptionPV = redemptionValue * Math.pow(1 / (1 + i), periods);
      const initialPrice = annuityPV + redemptionPV;

      // Initial book value should match bond price
      const initialBookValue = calculateBookValue(
        faceValue,
        couponRate,
        redemptionValue,
        yieldRate,
        periods,
        0
      );
      expect(initialBookValue).toBeCloseTo(initialPrice, 2);
    });

    it('decreases book value for premium bonds', () => {
      // For premium bonds, book value should decrease over time
      const premiumYield = 4;
      
      // Generate amortization schedule for premium bond
      const schedule = generateBondAmortizationSchedule(
        faceValue,
        couponRate,
        redemptionValue,
        premiumYield,
        periods
      );

      // Verify book value decreases over time
      for (let i = 1; i < schedule.length; i++) {
        expect(schedule[i].bookValue).toBeLessThan(schedule[i-1].bookValue);
      }

      // Verify final book value equals redemption value
      expect(schedule[schedule.length - 1].bookValue).toBeCloseTo(redemptionValue, 2);
    });

    it('increases book value for discount bonds', () => {
      // For discount bonds, book value should increase over time
      const discountYield = 8;
      
      // Generate amortization schedule for discount bond
      const schedule = generateBondAmortizationSchedule(
        faceValue,
        couponRate,
        redemptionValue,
        discountYield,
        periods
      );

      // Verify book value increases over time
      for (let i = 1; i < schedule.length; i++) {
        expect(schedule[i].bookValue).toBeGreaterThan(schedule[i-1].bookValue);
      }

      // Verify final book value equals redemption value
      expect(schedule[schedule.length - 1].bookValue).toBeCloseTo(redemptionValue, 2);
    });
  });

  describe('Callable Bond Tests', () => {
    it('uses earliest call date for premium bonds', () => {
      const callDates = [3, 5, 7];
      const callPrices = [1020, 1010, 1000];
      const premiumYield = 4; // Lower than coupon rate, making it a premium bond
      
      const callablePrice = calculateCallableBondPrice(
        faceValue,
        couponRate,
        premiumYield,
        callDates,
        callPrices
      );

      // Calculate regular bond prices to each call date
      const bondPrices = callDates.map(date =>
        calculateBondPrice(
          faceValue,
          couponRate,
          callPrices[callDates.indexOf(date)],
          premiumYield,
          date
        )
      );

      // Premium bonds use earliest call date (minimum price)
      expect(callablePrice).toBe(Math.min(...bondPrices));
    });

    it('uses latest call date for discount bonds', () => {
      const callDates = [3, 5, 7];
      const callPrices = [980, 990, 1000];
      const discountYield = 8; // Higher than coupon rate, making it a discount bond
      
      const callablePrice = calculateCallableBondPrice(
        faceValue,
        couponRate,
        discountYield,
        callDates,
        callPrices
      );

      // Calculate regular bond prices to each call date
      const bondPrices = callDates.map(date =>
        calculateBondPrice(
          faceValue,
          couponRate,
          callPrices[callDates.indexOf(date)],
          discountYield,
          date
        )
      );

      // Discount bonds use latest call date (maximum price)
      expect(callablePrice).toBe(Math.max(...bondPrices));
    });

    it('validates call dates and prices arrays', () => {
      // Should throw error if arrays have different lengths
      expect(() => calculateCallableBondPrice(
        faceValue,
        couponRate,
        yieldRate,
        [3, 5],
        [1000]
      )).toThrow('Call dates array must match call prices array length');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero coupon bonds', () => {
      const zeroCouponRate = 0;
      const price = calculateBondPrice(
        faceValue,
        zeroCouponRate,
        redemptionValue,
        yieldRate,
        periods
      );
      
      // For zero coupon bonds, price should equal PV of redemption only
      const expectedPrice = redemptionValue * Math.pow(1 / (1 + yieldRate/100), periods);
      expect(price).toBeCloseTo(expectedPrice, 2);
    });

    it('handles very short term bonds', () => {
      const shortPeriods = 1;
      const price = calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        yieldRate,
        shortPeriods
      );
      
      // For very short term bonds:
      // 1. Price should be finite and positive
      expect(price).toBeGreaterThan(0);
      expect(Number.isFinite(price)).toBe(true);
      
      // 2. Price should be between one coupon payment and redemption value
      const couponPayment = faceValue * (couponRate / 100);
      expect(price).toBeGreaterThan(couponPayment);
      expect(price).toBeLessThan(redemptionValue + couponPayment);
    });

    it('handles very long term bonds', () => {
      const longPeriods = 30;
      const price = calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        yieldRate,
        longPeriods
      );
      
      // For very long term bonds:
      // 1. Price should be finite and positive
      expect(price).toBeGreaterThan(0);
      expect(Number.isFinite(price)).toBe(true);
      
      // 2. Present value of redemption should be small
      const i = yieldRate / 100;
      const redemptionPV = redemptionValue * Math.pow(1 / (1 + i), longPeriods);
      expect(redemptionPV).toBeLessThan(redemptionValue * 0.25); // Should be < 25% of face value
    });

    it('handles high yield rates', () => {
      const highYield = 15;  // 15% yield rate
      const price = calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        highYield,
        periods
      );

      // For high yield rates:
      // 1. Price should be finite and positive
      expect(price).toBeGreaterThan(0);
      expect(Number.isFinite(price)).toBe(true);
      
      // 2. Bond should be at a discount
      expect(price).toBeLessThan(redemptionValue);
    });

    it('validates input parameters', () => {
      // Negative coupon rate
      expect(() => calculateBondPrice(
        faceValue,
        -1,
        redemptionValue,
        yieldRate,
        periods
      )).toThrow();

      // Negative yield rate
      expect(() => calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        -1,
        periods
      )).toThrow();

      // Zero periods
      expect(() => calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        yieldRate,
        0
      )).toThrow('Number of periods must be positive');

      // Negative periods
      expect(() => calculateBondPrice(
        faceValue,
        couponRate,
        redemptionValue,
        yieldRate,
        -1
      )).toThrow('Number of periods must be positive');
    });
  });
});