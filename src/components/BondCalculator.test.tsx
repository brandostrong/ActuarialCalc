import { describe, it, expect } from 'vitest';
import {
  calculateBondPrice,
  calculateCallableBondPrice,
  getBondPriceType,
  generateBondAmortizationSchedule
} from '../utils/bondCalculations';

describe('Bond Calculation Functions', () => {
  describe('Regular Bond Calculations', () => {
    it('calculates regular bond price correctly', () => {
      const price = calculateBondPrice(1000, 6, 1000, 5, 10);
      expect(price).toBeCloseTo(1077.22, 2);
    });

    it('identifies premium bond correctly', () => {
      const priceType = getBondPriceType(1077.22, 1000, 60, 5);
      expect(priceType).toBe('premium');
    });

    it('identifies discount bond correctly', () => {
      const priceType = getBondPriceType(950, 1000, 40, 5);
      expect(priceType).toBe('discount');
    });
  });

  describe('Callable Bond Calculations', () => {
    it('calculates callable bond price correctly with single call date', () => {
      const callDates = [5];
      const callPrices = [1020];
      const price = calculateCallableBondPrice(1000, 6, 5, callDates, callPrices);
      expect(price).toBeLessThan(1077.22); // Should be less than non-callable bond price
    });

    it('handles multiple call dates correctly', () => {
      const callDates = [3, 5, 7];
      const callPrices = [1030, 1020, 1010];
      const price = calculateCallableBondPrice(1000, 6, 5, callDates, callPrices);
      expect(price).toBeDefined();
    });

    it('validates call dates and prices arrays have same length', () => {
      const callDates = [3, 5];
      const callPrices = [1020];
      expect(() => calculateCallableBondPrice(1000, 6, 5, callDates, callPrices)).toThrow();
    });
    
    it('validates call dates are in chronological order', () => {
      const callDates = [5, 3];  // Out of order
      const callPrices = [1020, 1030];
      expect(() => calculateCallableBondPrice(1000, 6, 5, callDates, callPrices)).toThrow();
    });
  });

  describe('Amortization Schedule', () => {
    const schedule = generateBondAmortizationSchedule(1000, 6, 1000, 5, 10);

    it('generates correct number of periods', () => {
      expect(schedule.length).toBe(10);
    });

    it('calculates correct coupon payment', () => {
      expect(schedule[0].couponPayment).toBeCloseTo(60, 2);
    });

    it('maintains correct book value progression', () => {
      expect(schedule[0].bookValue).toBeGreaterThan(schedule[schedule.length - 1].bookValue);
      expect(schedule[schedule.length - 1].bookValue).toBeCloseTo(1000, 2);
    });

    it('verifies total amortization equals premium/discount', () => {
      const totalAmortization = schedule.reduce((sum, entry) => sum + entry.amortizationAmount, 0);
      const premium = schedule[0].bookValue - 1000; // Initial book value minus face value
      expect(totalAmortization).toBeCloseTo(premium, 2);
    });

    it('validates interest payment calculation', () => {
      const firstInterest = schedule[0].interestEarned;
      const expectedInterest = schedule[0].bookValue * 0.05; // 5% of initial book value
      expect(firstInterest).toBeCloseTo(expectedInterest, 2);
    });

    it('verifies consecutive book values', () => {
      for (let i = 1; i < schedule.length; i++) {
        const expectedBookValue = schedule[i-1].bookValue - schedule[i-1].amortizationAmount;
        expect(schedule[i].bookValue).toBeCloseTo(expectedBookValue, 2);
      }
    });
  });

  describe('Edge Cases and Validations', () => {
    it('handles zero coupon bonds', () => {
      const price = calculateBondPrice(1000, 0, 1000, 5, 10);
      expect(price).toBeLessThan(1000); // Zero coupon bonds should trade at discount
    });

    it('rejects negative interest rates', () => {
      expect(() => calculateBondPrice(1000, 6, 1000, -5, 10)).toThrow();
    });

    it('rejects negative face values', () => {
      expect(() => calculateBondPrice(-1000, 6, 1000, 5, 10)).toThrow();
    });

    it('handles very high interest rates', () => {
      const price = calculateBondPrice(1000, 6, 1000, 50, 10);
      expect(price).toBeLessThan(1000); // High yield rate should result in discount
    });

    it('handles very short term bonds', () => {
      const price = calculateBondPrice(1000, 6, 1000, 5, 1);
      expect(price).toBeCloseTo(1009.52, 2); // One period bond price
    });
  });
});