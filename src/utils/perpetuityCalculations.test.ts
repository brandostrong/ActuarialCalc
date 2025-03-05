import { describe, it, expect } from 'vitest';
import {
  calculatePresentValueBasicPerpetuity,
  calculatePresentValueGrowingPerpetuity,
  calculatePaymentBasicPerpetuity,
  calculatePaymentGrowingPerpetuity,
  calculateInterestRate,
  calculateGrowthRate
} from './perpetuityCalculations';

describe('Basic Perpetuity Tests', () => {
  // Test values from Python verification:
  // PV = 20000
  // PMT = 1000
  // i = 5%
  const knownPV = 20000;
  const knownPayment = 1000;
  const knownInterestRate = 5;

  describe('Present Value Calculations', () => {
    it('calculates present value correctly', () => {
      const calculatedPV = calculatePresentValueBasicPerpetuity(
        knownPayment,
        knownInterestRate
      );
      expect(calculatedPV).toBeCloseTo(knownPV, 2);
    });

    it('matches theoretical formula PV = PMT/i', () => {
      const calculatedPV = calculatePresentValueBasicPerpetuity(
        knownPayment,
        knownInterestRate
      );
      const theoreticalPV = knownPayment / (knownInterestRate / 100);
      expect(calculatedPV).toBeCloseTo(theoreticalPV, 2);
    });

    it('handles due payments correctly', () => {
      const immediatePV = calculatePresentValueBasicPerpetuity(
        knownPayment,
        knownInterestRate
      );
      const duePV = calculatePresentValueBasicPerpetuity(
        knownPayment,
        knownInterestRate,
        'effective',
        1,
        'due'
      );
      // Due perpetuity PV should be (1 + i) times immediate PV
      expect(duePV).toBeCloseTo(immediatePV * (1 + knownInterestRate/100), 2);
    });

    it('calculates deferred perpetuity correctly', () => {
      const deferredPeriods = 2;
      const deferredPV = calculatePresentValueBasicPerpetuity(
        knownPayment,
        knownInterestRate,
        'effective',
        1,
        'immediate',
        deferredPeriods
      );
      // Deferred PV = PV * v^m where v = 1/(1+i)
      const immediateValue = knownPV;
      const expectedPV = immediateValue * Math.pow(1/(1 + knownInterestRate/100), deferredPeriods);
      expect(deferredPV).toBeCloseTo(expectedPV, 2);
    });
  });

  describe('Variable Solving', () => {
    it('recovers payment from PV', () => {
      const calculatedPayment = calculatePaymentBasicPerpetuity(
        knownPV,
        knownInterestRate
      );
      expect(calculatedPayment).toBeCloseTo(knownPayment, 2);
    });

    it('recovers interest rate from PV', () => {
      const calculatedRate = calculateInterestRate(
        knownPV,
        knownPayment
      );
      expect(calculatedRate).toBeCloseTo(knownInterestRate, 4);
    });
  });
});

describe('Growing Perpetuity Tests', () => {
  // Test values from Python verification:
  // PV = 25000
  // PMT = 1000
  // i = 6%
  // g = 2%
  const knownPV = 25000;
  const knownPayment = 1000;
  const knownInterestRate = 6;
  const knownGrowthRate = 2;

  describe('Present Value Calculations', () => {
    it('calculates present value correctly', () => {
      const calculatedPV = calculatePresentValueGrowingPerpetuity(
        knownPayment,
        knownInterestRate,
        knownGrowthRate
      );
      expect(calculatedPV).toBeCloseTo(knownPV, 2);
    });

    it('matches theoretical formula PV = PMT/(i-g)', () => {
      const calculatedPV = calculatePresentValueGrowingPerpetuity(
        knownPayment,
        knownInterestRate,
        knownGrowthRate
      );
      const theoreticalPV = knownPayment / ((knownInterestRate - knownGrowthRate) / 100);
      expect(calculatedPV).toBeCloseTo(theoreticalPV, 2);
    });

    it('handles due payments correctly', () => {
      const immediatePV = calculatePresentValueGrowingPerpetuity(
        knownPayment,
        knownInterestRate,
        knownGrowthRate
      );
      const duePV = calculatePresentValueGrowingPerpetuity(
        knownPayment,
        knownInterestRate,
        knownGrowthRate,
        'effective',
        1,
        'due'
      );
      expect(duePV).toBeCloseTo(immediatePV * (1 + knownInterestRate/100), 2);
    });

    it('calculates deferred growing perpetuity correctly', () => {
      const deferredPeriods = 2;
      const deferredPV = calculatePresentValueGrowingPerpetuity(
        knownPayment,
        knownInterestRate,
        knownGrowthRate,
        'effective',
        1,
        'immediate',
        deferredPeriods
      );
      const immediateValue = knownPV;
      const expectedPV = immediateValue * Math.pow(1/(1 + knownInterestRate/100), deferredPeriods);
      expect(deferredPV).toBeCloseTo(expectedPV, 2);
    });
  });

  describe('Variable Solving', () => {
    it('recovers payment from PV', () => {
      const calculatedPayment = calculatePaymentGrowingPerpetuity(
        knownPV,
        knownInterestRate,
        knownGrowthRate
      );
      expect(calculatedPayment).toBeCloseTo(knownPayment, 2);
    });

    it('recovers interest rate from PV', () => {
      const calculatedRate = calculateInterestRate(
        knownPV,
        knownPayment,
        'effective',
        1,
        'immediate',
        0,
        knownGrowthRate
      );
      expect(calculatedRate).toBeCloseTo(knownInterestRate, 4);
    });

    it('recovers growth rate from PV', () => {
      const calculatedGrowth = calculateGrowthRate(
        knownPV,
        knownPayment,
        knownInterestRate
      );
      expect(calculatedGrowth).toBeCloseTo(knownGrowthRate, 4);
    });
  });

  describe('Edge Cases', () => {
    it('throws error when interest rate equals growth rate', () => {
      expect(() => {
        calculatePresentValueGrowingPerpetuity(1000, 5, 5);
      }).toThrow('Interest rate must be greater than growth rate');
    });

    it('throws error when interest rate is less than growth rate', () => {
      expect(() => {
        calculatePresentValueGrowingPerpetuity(1000, 3, 5);
      }).toThrow('Interest rate must be greater than growth rate');
    });

    it('reduces to basic perpetuity when growth rate is zero', () => {
      const withGrowth = calculatePresentValueGrowingPerpetuity(
        knownPayment,
        knownInterestRate,
        0
      );
      const withoutGrowth = calculatePresentValueBasicPerpetuity(
        knownPayment,
        knownInterestRate
      );
      expect(withGrowth).toBeCloseTo(withoutGrowth, 2);
    });
  });
});
