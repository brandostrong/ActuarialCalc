import {
    calculateMacaulayDuration,
    calculateModifiedDuration,
    calculateMacaulayConvexity,
    calculateModifiedConvexity,
    approximatePriceModified,
    approximatePriceMacaulay,
    calculateDurationPassageOfTime,
    calculatePortfolioDuration
} from './durationConvexityCalculations';
import { CashFlow } from './types';

describe('Duration and Convexity Calculations', () => {
    // Test case for a simple zero-coupon bond
    // MacD should equal time to maturity for zero-coupon bonds
    test('calculates duration for zero-coupon bond', () => {
        const cashFlows: CashFlow[] = [{ time: 5, amount: 1000 }];
        const i = 0.06;
        
        const macD = calculateMacaulayDuration(cashFlows, i);
        expect(macD).toBeCloseTo(5, 2);
        
        const modD = calculateModifiedDuration(cashFlows, i);
        expect(modD).toBeCloseTo(5 / (1 + i), 2);
    });

    // Test case for a 5-year annual coupon bond
    test('calculates duration for coupon bond', () => {
        const cashFlows: CashFlow[] = [
            { time: 1, amount: 60 },
            { time: 2, amount: 60 },
            { time: 3, amount: 60 },
            { time: 4, amount: 60 },
            { time: 5, amount: 1060 } // Final coupon plus face value
        ];
        const i = 0.06;
        
        const macD = calculateMacaulayDuration(cashFlows, i);
        // Duration should be between 0 and 5 years for this bond
        expect(macD).toBeGreaterThan(0);
        expect(macD).toBeLessThan(5);
        
        const modD = calculateModifiedDuration(cashFlows, i);
        expect(modD).toBeCloseTo(macD / (1 + i), 2);
    });

    // Test case for convexity calculations
    test('calculates convexity', () => {
        const cashFlows: CashFlow[] = [
            { time: 1, amount: 60 },
            { time: 2, amount: 1060 }
        ];
        const i = 0.06;
        
        const macC = calculateMacaulayConvexity(cashFlows, i);
        expect(macC).toBeGreaterThan(0);
        
        const modC = calculateModifiedConvexity(cashFlows, i);
        expect(modC).toBeGreaterThan(0);
    });

    // Test case for zero-coupon bond convexity
    // MacC should equal time^2 for zero-coupon bonds
    test('calculates convexity for zero-coupon bond', () => {
        const cashFlows: CashFlow[] = [{ time: 5, amount: 1000 }];
        const i = 0.06;
        
        const macC = calculateMacaulayConvexity(cashFlows, i);
        expect(macC).toBeCloseTo(25, 2); // 5^2 = 25
    });

    // Test case for price approximation using duration
    test('approximates price changes using duration', () => {
        const originalPrice = 1000;
        const originalRate = 0.06;
        const newRate = 0.07;
        const modifiedDuration = 4.5;
        const macaulayDuration = 4.77;
        
        const modifiedApprox = approximatePriceModified(
            originalPrice,
            originalRate,
            newRate,
            modifiedDuration
        );
        expect(modifiedApprox).toBeLessThan(originalPrice);
        
        const macaulayApprox = approximatePriceMacaulay(
            originalPrice,
            originalRate,
            newRate,
            macaulayDuration
        );
        expect(macaulayApprox).toBeLessThan(originalPrice);
    });

    // Test case for duration passage of time
    test('calculates duration passage of time effect', () => {
        const initialDuration = 5;
        const timeDifference = 1;
        
        const newDuration = calculateDurationPassageOfTime(initialDuration, timeDifference);
        expect(newDuration).toBe(4);
    });

    // Test case for portfolio duration
    test('calculates portfolio duration', () => {
        const components = [
            { duration: 5, value: 1000 },
            { duration: 3, value: 2000 }
        ];
        
        const portfolioDuration = calculatePortfolioDuration(components);
        // Weighted average: (5*1000 + 3*2000)/(1000 + 2000) = 3.67
        expect(portfolioDuration).toBeCloseTo(3.67, 2);
    });
});