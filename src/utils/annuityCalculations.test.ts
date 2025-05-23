import { describe, it, expect } from 'vitest';
import {
  // Basic annuity functions
  presentValueAnnuityImmediate,
  presentValueAnnuityDue,
  presentValueDeferredAnnuityImmediate,
  futureValueAnnuityImmediate,
  futureValueAnnuityDue,
  futureValueDeferredAnnuityImmediate,
  presentValueIncreasingAnnuityImmediate,
  presentValueIncreasingAnnuityDue,
  
  // Payment calculation functions
  calculatePaymentFromPV,
  calculatePaymentFromFV,
  calculatePaymentFromPVIncreasing,
  
  // Interest rate calculation functions
  calculateInterestRateFromPV,
  calculateInterestRateFromPVIncreasing,
  
  // Period calculation functions
  calculatePeriodsFromPV,
  calculatePeriodsFromPVIncreasing,
  
  // Conversion functions
  calculateFVFromPV,
  calculatePVFromFV,
  presentValueGeometricAnnuityImmediate,
  presentValueGeometricAnnuityDue,
  calculatePaymentFromPVGeometric,
  convertInterestRate
} from './annuityCalculations';

describe('Deferred Annuity Tests', () => {
  // Known values for our test problem:
  // - Payment = $100 monthly
  // - Interest rate = 6% annual (0.5% monthly)
  // - Payment periods = 12 months
  // - Deferral periods = 6 months
  const knownPayment = 100;
  const knownInterestRate = 0.5; // 0.5% monthly
  const knownPaymentPeriods = 12;
  const knownDeferralPeriods = 6;

  // First, calculate basic immediate annuity PV
  const immediateAnnuityPV = presentValueAnnuityImmediate(
    knownPayment,
    knownInterestRate,
    knownPaymentPeriods
  );
  // Then apply deferral discount
  const discountFactor = Math.pow(1 + knownInterestRate/100, knownDeferralPeriods);
  const knownDeferredPV = immediateAnnuityPV / discountFactor;

  describe('Present Value Calculations', () => {
    it('calculates deferred PV correctly', () => {
      const calculatedPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        knownDeferralPeriods
      );
      expect(calculatedPV).toBeCloseTo(knownDeferredPV, 1);
    });

    it('verifies deferral reduces PV', () => {
      const deferredPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        knownDeferralPeriods
      );
      const immediatePV = presentValueAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods
      );
      expect(deferredPV).toBeLessThan(immediatePV);
    });

    it('handles zero deferral period correctly', () => {
      const zeroDeferralPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        0
      );
      const regularPV = presentValueAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods
      );
      expect(zeroDeferralPV).toBeCloseTo(regularPV, 1);
    });

    it('matches theoretical deferral formula', () => {
      const deferredPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        knownDeferralPeriods
      );
      const expectedPV = immediateAnnuityPV / discountFactor;
      expect(deferredPV).toBeCloseTo(expectedPV, 1);
    });
  });

  describe('Variable Solving', () => {
    it('recovers payment from deferred PV', () => {
      const deferredPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        knownDeferralPeriods
      );
      
      const calculatedPayment = calculatePaymentFromPV(
        deferredPV * discountFactor,
        knownInterestRate,
        knownPaymentPeriods
      );
      expect(calculatedPayment).toBeCloseTo(knownPayment, 1);
    });

    it('recovers interest rate from deferred PV', () => {
      const deferredPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        knownDeferralPeriods
      );
      
      const calculatedRate = calculateInterestRateFromPV(
        deferredPV * discountFactor,
        knownPayment,
        knownPaymentPeriods
      );
      expect(calculatedRate).toBeCloseTo(knownInterestRate, 1);
    });

    it('recovers payment periods from deferred PV', () => {
      const deferredPV = presentValueDeferredAnnuityImmediate(
        knownPayment,
        knownInterestRate,
        knownPaymentPeriods,
        knownDeferralPeriods
      );
      
      const calculatedPeriods = calculatePeriodsFromPV(
        deferredPV * discountFactor,
        knownPayment,
        knownInterestRate
      );
      expect(calculatedPeriods).toBeCloseTo(knownPaymentPeriods, 0);
    });
  });
});

describe('Increasing Annuity Tests', () => {
  // Known values for test case:
  // Base payment = $100 monthly
  // Increase = $10 per period
  // Interest rate = 6% annual (0.5% monthly)
  // Number of periods = 12 months
  const basePayment = 100;
  const increase = 10;
  const interestRate = 0.5;
  const periods = 12;

  describe('Present Value Calculations', () => {
    it('calculates increasing immediate annuity PV', () => {
      const calculatedPV = presentValueIncreasingAnnuityImmediate(
        basePayment,
        increase,
        interestRate,
        periods
      );
      expect(calculatedPV).toBeGreaterThan(0);
    });

    it('verifies increasing PV exceeds level PV', () => {
      const increasingPV = presentValueIncreasingAnnuityImmediate(
        basePayment,
        increase,
        interestRate,
        periods
      );
      const levelPV = presentValueAnnuityImmediate(
        basePayment,
        interestRate,
        periods
      );
      expect(increasingPV).toBeGreaterThan(levelPV);
    });

    it('matches level annuity when increase is zero', () => {
      const increasingPV = presentValueIncreasingAnnuityImmediate(
        basePayment,
        0,
        interestRate,
        periods
      );
      const levelPV = presentValueAnnuityImmediate(
        basePayment,
        interestRate,
        periods
      );
      expect(increasingPV).toBeCloseTo(levelPV, 1);
    });

    it('validates due timing relationship', () => {
      const immediatePV = presentValueIncreasingAnnuityImmediate(
        basePayment,
        increase,
        interestRate,
        periods
      );
      const duePV = presentValueIncreasingAnnuityDue(
        basePayment,
        increase,
        interestRate,
        periods
      );
      expect(duePV).toBeCloseTo(immediatePV * (1 + interestRate/100), 1);
    });
  });

  describe('Variable Solving', () => {
    describe('Base Payment Calculations', () => {
      // Helper functions to calculate theoretical values
      /**
       * Calculates PV of increasing annuity using standard formula:
       * PV = P/i * [1 - (1+i)^-n] + h/i^2 * [1 - (1+i)^-n - n*i*(1+i)^-n]
       * where:
       * P = base payment
       * h = payment increase per period
       * i = interest rate (as decimal)
       * n = number of periods
       */
      const calculateIncreasingAnnuityPV = (base: number, inc: number, rate: number, n: number, timing: 'immediate' | 'due' = 'immediate') => {
        const i = rate / 100;
        const factor = timing === 'due' ? (1 + i) : 1;
        
        // First term: Level annuity portion
        const term1 = (base/i) * (1 - Math.pow(1+i, -n));
        
        // Second term: Increase portion
        const term2 = (inc/Math.pow(i,2)) * (1 - Math.pow(1+i, -n) - n*i*Math.pow(1+i, -n));
        
        return (term1 + term2) * factor;
      };

      /**
       * Calculates a single payment amount at time t
       * First payment (t=1) is base amount
       * Each subsequent payment increases by inc
       */
      const calculatePaymentAtTime = (base: number, inc: number, t: number) => {
        return base + ((t-1) * inc);
      };

      it('matches standard increasing annuity formula', () => {
        const smallIncrease = 1;
        const actualPV = presentValueIncreasingAnnuityImmediate(
          basePayment,
          smallIncrease,
          interestRate,
          periods
        );
        const expectedPV = calculateIncreasingAnnuityPV(
          basePayment,
          smallIncrease,
          interestRate,
          periods,
          'immediate'
        );
        expect(actualPV).toBeCloseTo(expectedPV, 1);
      });

      describe('Payment Stream Analysis', () => {
        it('confirms standard formula matches explicit calculation', () => {
          const i = interestRate / 100;
          const n = periods;
          
          // Calculate using standard formula
          const standardPV = calculateIncreasingAnnuityPV(
            basePayment,
            increase,
            interestRate,
            periods
          );

          // Manual calculation summing each discounted payment
          let manualPV = 0;
          for (let t = 1; t <= n; t++) {
            const payment = basePayment + ((t-1) * increase);
            manualPV += payment / Math.pow(1 + i, t);
          }

          expect(standardPV).toBeCloseTo(manualPV, 1);
        });

        it('decomposes into level and increasing parts correctly', () => {
          const i = interestRate / 100;
          const n = periods;
          const h = increase;
          const v = 1 / (1 + i);

          // Calculate annuity factors
          const annuityFactor = (1 - Math.pow(v, n)) / i;
          const increasingFactor = (annuityFactor - n * Math.pow(v, n)) / i;

          // Target PV from standard formula
          const targetPV = calculateIncreasingAnnuityPV(
            basePayment,
            increase,
            interestRate,
            periods
          );

          // Our base payment should satisfy:
          // targetPV = P*annuityFactor + h*increasingFactor
          // Solve for P:
          const calculatedBase = (targetPV - h * increasingFactor) / annuityFactor;
          
          expect(calculatedBase).toBeCloseTo(basePayment, 1);

          // Verify that reconstructing PV gives same result
          const reconstructedPV = calculatedBase * annuityFactor + h * increasingFactor;
          expect(reconstructedPV).toBeCloseTo(targetPV, 1);
        });

        it('verifies detailed calculations', () => {
          // Test parameters
          const basePayment = 100;
          const increase = 10;
          const interestRate = 5;
          const periods = 10;
          const i = interestRate / 100;
          const v = 1 / (1 + i);

          console.log('\nIncreasing Annuity Calculation Steps:');
          console.log('=====================================');
          console.log(`Base Payment: ${basePayment}`);
          console.log(`Increase: ${increase}`);
          console.log(`Interest Rate: ${interestRate}%`);
          console.log(`Periods: ${periods}`);
          console.log(`i: ${i}`);
          console.log(`v: ${v}`);

          // Calculate annuity factors
          const annuityFactor = (1 - Math.pow(v, periods)) / i;
          const increasingFactor = (annuityFactor - periods * Math.pow(v, periods)) / i;

          console.log('\nAnnuity Factors:');
          console.log(`Annuity Factor (a_n|i): ${annuityFactor}`);
          console.log(`Increasing Factor ((Ia)_n|i): ${increasingFactor}`);

          // Calculate PV using our implementation
          const actualPV = presentValueIncreasingAnnuityImmediate(
            basePayment,
            increase,
            interestRate,
            periods
          );

          // Calculate PV using manual formula
          const manualPV = basePayment * annuityFactor + increase * increasingFactor;

          console.log('\nPresent Values:');
          console.log(`Manual PV = ${basePayment} × ${annuityFactor} + ${increase} × ${increasingFactor} = ${manualPV}`);
          console.log(`Function PV = ${actualPV}`);

          // Recover base payment using our implementation
          const recoveredBase = calculatePaymentFromPVIncreasing(
            actualPV,
            increase,
            interestRate,
            periods
          );

          // Manual base payment recovery
          const manualBase = (actualPV - increase * increasingFactor) / annuityFactor;

          console.log('\nBase Payment Recovery:');
          console.log(`Manual base = (${actualPV} - ${increase} × ${increasingFactor}) ÷ ${annuityFactor} = ${manualBase}`);
          console.log(`Function base = ${recoveredBase}`);

          console.log('\nPayment Schedule:');
          for (let t = 1; t <= 3; t++) {
            const payment = recoveredBase + (t-1) * increase;
            console.log(`Period ${t}: ${payment}`);
          }

          // Verify results
          expect(actualPV).toBeCloseTo(manualPV, 1);
          expect(recoveredBase).toBeCloseTo(basePayment, 1);
        });
      });

      it('validates payment timing and discounting', () => {
        const pv = calculateIncreasingAnnuityPV(
          basePayment,
          increase,
          interestRate,
          periods,
          'immediate'
        );
        
        // Manual calculation with correct timing:
        // First payment at t=1, discounted by (1+i)
        // Second payment at t=2, discounted by (1+i)^2, etc.
        let manualPV = 0;
        for (let t = 1; t <= periods; t++) {
          const payment = basePayment + ((t-1) * increase);
          manualPV += payment / Math.pow(1 + interestRate/100, t);
        }
        
        expect(pv).toBeCloseTo(manualPV, 1);
      });
    });

    it('recovers interest rate from PV', () => {
      const pv = presentValueIncreasingAnnuityImmediate(
        basePayment,
        increase,
        interestRate,
        periods
      );
      const calculatedRate = calculateInterestRateFromPVIncreasing(
        pv,
        basePayment,
        increase,
        periods
      );
      expect(calculatedRate).toBeCloseTo(interestRate, 1);
    });

    it('recovers number of periods from PV', () => {
      const pv = presentValueIncreasingAnnuityImmediate(
        basePayment,
        increase,
        interestRate,
        periods
      );
      const calculatedPeriods = calculatePeriodsFromPVIncreasing(
        pv,
        basePayment,
        increase,
        interestRate
      );
      expect(calculatedPeriods).toBeCloseTo(periods, 0);
    });
  });
  
  describe('Deferred Future Value Tests', () => {
    it('verifies deferred annuity future value matches theoretical', () => {
      // Test parameters
      const payment = 100;
      const interestRate = 5; // 5% annual rate
      const periods = 10;
      const deferredPeriods = 5;
      
      // Calculate future value
      const futureValue = futureValueDeferredAnnuityImmediate(
        payment,
        interestRate,
        periods,
        deferredPeriods
      );
      
      // Manual calculation:
      // 1. Calculate FV of immediate annuity for the payment periods
      const immediateAnnuityFV = futureValueAnnuityImmediate(payment, interestRate, periods);
      // 2. This value needs to accumulate interest for the deferred periods
      const expectedFV = immediateAnnuityFV * Math.pow(1 + interestRate/100, deferredPeriods);
      
      expect(futureValue).toBeCloseTo(expectedFV, 2);
    });
    
    it('handles zero interest rate correctly', () => {
      const payment = 100;
      const periods = 10;
      const deferredPeriods = 5;
      
      const futureValue = futureValueDeferredAnnuityImmediate(
        payment,
        0,
        periods,
        deferredPeriods
      );
      
      // With zero interest rate, it's just the sum of payments
      expect(futureValue).toBe(payment * periods);
    });
    
    it('properly accounts for timing of deferred payments', () => {
      // Test with small values for easy manual verification
      const payment = 100;
      const interestRate = 100; // 100% for easy doubling
      const periods = 2;
      const deferredPeriods = 1;
      
      const futureValue = futureValueDeferredAnnuityImmediate(
        payment,
        interestRate,
        periods,
        deferredPeriods
      );
      
      // With 100% interest rate, one deferred period, and two payment periods:
      // 1. First payment of 100 grows for 2 periods: 100 * (1 + 1)^2 = 400
      // 2. Second payment of 100 grows for 1 period: 100 * (1 + 1) = 200
      // Total expected: 600
      expect(futureValue).toBeCloseTo(600, 2);
    });
  });
});

describe('Interest Rate Conversion Tests', () => {
  describe('High Frequency Compounding', () => {
    it('handles daily compounding correctly', () => {
      const nominalRate = 5; // 5% nominal
      const dailyCompounding = 365;
      
      const effectiveRate = convertInterestRate(
        nominalRate,
        'nominal',
        'effective',
        dailyCompounding
      );
      
      // Calculate expected using continuous compounding as approximation
      const expected = (Math.exp(nominalRate / 100) - 1) * 100;
      expect(effectiveRate).toBeCloseTo(expected, 4);
    });

    it('maintains precision with high frequency conversion', () => {
      const nominalRate = 12; // 12% nominal
      const highFrequency = 365 * 24; // Hourly compounding
      
      const effectiveRate = convertInterestRate(
        nominalRate,
        'nominal',
        'effective',
        highFrequency
      );
      
      // Convert back to nominal
      const backToNominal = convertInterestRate(
        effectiveRate,
        'effective',
        'nominal',
        highFrequency
      );
      
      expect(backToNominal).toBeCloseTo(nominalRate, 4);
    });

    it('handles discount rate edge cases', () => {
      expect(() => convertInterestRate(100, 'discount', 'effective'))
        .toThrow('Discount rate must be less than 100%');
      
      const highDiscount = 99.99;
      const effectiveRate = convertInterestRate(highDiscount, 'discount', 'effective');
      expect(effectiveRate).toBeGreaterThan(0);
      expect(Number.isFinite(effectiveRate)).toBe(true);
    });
  });
});

describe('High Interest Rate Tests', () => {
  it('handles high interest rates in present value calculations', () => {
    const payment = 1000;
    const interestRate = 50; // 50% annual rate
    const periods = 5;
    
    const pv = presentValueAnnuityImmediate(payment, interestRate, periods);
    // Manual calculation
    const i = interestRate / 100;
    const expectedPV = payment * (1 - Math.pow(1 + i, -periods)) / i;
    
    expect(pv).toBeCloseTo(expectedPV, 2);
  });

  it('handles high interest rates in interest rate solving', () => {
    const payment = 1000;
    const periods = 5;
    const presentValue = 2500;
    
    const calculatedRate = calculateInterestRateFromPV(
      presentValue,
      payment,
      periods
    );
    
    // Verify the calculated rate produces the correct present value
    const calculatedPV = presentValueAnnuityImmediate(
      payment,
      calculatedRate,
      periods
    );
    
    expect(calculatedPV).toBeCloseTo(presentValue, 0);
  });

  it('handles near-maximum interest rates', () => {
    const payment = 1000;
    const interestRate = 99.99; // Very high rate
    const periods = 5;
    
    const pv = presentValueAnnuityImmediate(payment, interestRate, periods);
    // Verify PV is positive and finite
    expect(pv).toBeGreaterThan(0);
    expect(pv).toBeLessThan(payment * periods);
    expect(Number.isFinite(pv)).toBe(true);
    
    // Verify interest rate solving works with high rates
    const calculatedRate = calculateInterestRateFromPV(pv, payment, periods);
    expect(calculatedRate).toBeCloseTo(interestRate, 1);
  });
});

describe('Geometric Annuity Tests', () => {
  // Test parameters
  const basePayment = 100;
  const growthRate = 3; // 3% growth per period
  const interestRate = 5;
  const periods = 10;

  describe('Present Value Calculations', () => {
    it('calculates geometric immediate annuity PV', () => {
      const pv = presentValueGeometricAnnuityImmediate(
        basePayment,
        growthRate,
        interestRate,
        periods
      );

      // PV should be positive
      expect(pv).toBeGreaterThan(0);

      // Manual calculation to verify
      const i = interestRate / 100;
      const g = growthRate / 100;
      
      // Use standard formula: PV = P * (1 - ((1+g)/(1+i))^n) / (i-g)
      const manualPV = basePayment * (1 - Math.pow((1 + g)/(1 + i), periods)) / (i - g);
      
      expect(pv).toBeCloseTo(manualPV, 1);
    });

    it('handles special case when growth equals interest rate', () => {
      const specialPV = presentValueGeometricAnnuityImmediate(
        basePayment,
        interestRate, // growth = interest rate
        interestRate,
        periods
      );

      // When g = i, formula becomes: PV = P * n / (1 + i)
      const i = interestRate / 100;
      const manualPV = basePayment * periods / (1 + i);

      expect(specialPV).toBeCloseTo(manualPV, 1);
    });

    it('validates due timing relationship', () => {
      const immediatePV = presentValueGeometricAnnuityImmediate(
        basePayment,
        growthRate,
        interestRate,
        periods
      );

      const duePV = presentValueGeometricAnnuityDue(
        basePayment,
        growthRate,
        interestRate,
        periods
      );

      // Due PV should be (1+i) times the immediate PV
      expect(duePV).toBeCloseTo(immediatePV * (1 + interestRate/100), 1);
    });

    it('matches level annuity when growth rate is zero', () => {
      const geometricPV = presentValueGeometricAnnuityImmediate(
        basePayment,
        0,
        interestRate,
        periods
      );

      const levelPV = presentValueAnnuityImmediate(
        basePayment,
        interestRate,
        periods
      );

      expect(geometricPV).toBeCloseTo(levelPV, 1);
    });
  
    describe('Extreme Growth Rate Tests', () => {
      it('handles growth rate approaching interest rate', () => {
        const pv = presentValueGeometricAnnuityImmediate(
          basePayment,
          4.999, // Very close to interest rate
          5,
          periods
        );
        
        // When growth rate is very close to interest rate,
        // PV should approach n * PMT / (1 + i)
        const i = 5 / 100;
        const expectedPV = basePayment * periods / (1 + i);
        
        expect(pv).toBeCloseTo(expectedPV, 1);
      });
  
      it('handles high growth rate with high interest rate', () => {
        const pv = presentValueGeometricAnnuityImmediate(
          basePayment,
          20, // High growth rate
          25, // Higher interest rate
          periods
        );
        
        const i = 25 / 100;
        const g = 20 / 100;
        const expectedPV = basePayment * (1 - Math.pow((1 + g)/(1 + i), periods)) / (i - g);
        
        expect(pv).toBeCloseTo(expectedPV, 1);
        expect(pv).toBeGreaterThan(0);
        expect(Number.isFinite(pv)).toBe(true);
      });
  
      it('verifies payment pattern with high growth rate', () => {
        const highGrowthRate = 30;
        const payments: number[] = [];
        
        // Generate first few payments
        for (let t = 1; t <= 3; t++) {
          payments.push(basePayment * Math.pow(1 + highGrowthRate/100, t-1));
        }
        
        // Verify geometric progression
        for (let i = 1; i < payments.length; i++) {
          const ratio = payments[i] / payments[i-1];
          expect(ratio).toBeCloseTo(1 + highGrowthRate/100, 4);
        }
      });
    });
  });

  describe('Payment Recovery', () => {
    it('recovers base payment from PV', () => {
      const pv = presentValueGeometricAnnuityImmediate(
        basePayment,
        growthRate,
        interestRate,
        periods
      );

      const recoveredPayment = calculatePaymentFromPVGeometric(
        pv,
        growthRate,
        interestRate,
        periods
      );

      expect(recoveredPayment).toBeCloseTo(basePayment, 1);
    });

    it('verifies payment growth pattern', () => {
      console.log('\nGeometric Annuity Payment Pattern:');
      console.log('===============================');
      
      for (let t = 1; t <= 3; t++) {
        const payment = basePayment * Math.pow(1 + growthRate/100, t-1);
        console.log(`Period ${t}: ${payment.toFixed(2)}`);
      }

      // Verify first few payments follow geometric growth
      const payment1 = basePayment;
      const payment2 = basePayment * (1 + growthRate/100);
      const payment3 = basePayment * Math.pow(1 + growthRate/100, 2);

      expect(payment2/payment1).toBeCloseTo(1 + growthRate/100, 4);
      expect(payment3/payment2).toBeCloseTo(1 + growthRate/100, 4);
    });
  });
});
