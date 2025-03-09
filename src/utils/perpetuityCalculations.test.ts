import {
  calculatePresentValueLevelPerpetuity,
  calculatePresentValueIncreasingPerpetuity,
  calculatePaymentLevelPerpetuity,
  calculatePaymentIncreasingPerpetuity,
  calculateInterestRate,
  calculatePresentValueGeometricPerpetuityImmediate,
  calculatePresentValueGeometricPerpetuityDue,
  calculateFutureValueLevelPerpetuity
} from './perpetuityCalculations';

describe('Level Perpetuity Present Value Calculations', () => {
  test('calculates level perpetuity PV with immediate payments', () => {
    expect(calculatePresentValueLevelPerpetuity(100, 5)).toBeCloseTo(2000);
    expect(calculatePresentValueLevelPerpetuity(100, 5, 'effective', 1, 'immediate', 0, 12))
      .toBeCloseTo(1942.69, 2); // Monthly payments
  });

  test('calculates level perpetuity PV with payments due', () => {
    expect(calculatePresentValueLevelPerpetuity(100, 5, 'effective', 1, 'due')).toBeCloseTo(2100);
  });

  test('calculates level perpetuity PV with continuous payments', () => {
    expect(calculatePresentValueLevelPerpetuity(100, 5, 'effective', 1, 'continuous')).toBeCloseTo(2050.63, 2);
  });

  test('calculates level perpetuity PV with deferred payments', () => {
    expect(calculatePresentValueLevelPerpetuity(100, 5, 'effective', 1, 'immediate', 2)).toBeCloseTo(1814.06);
  });

  test('handles nominal interest rate conversion', () => {
    expect(calculatePresentValueLevelPerpetuity(100, 4, 'nominal', 4)).toBeCloseTo(2462.81, 0);
  });

  test('throws error for non-positive interest rate', () => {
    expect(() => calculatePresentValueLevelPerpetuity(100, 0)).toThrow();
    expect(() => calculatePresentValueLevelPerpetuity(100, -5)).toThrow();
  });
});

describe('Increasing Perpetuity Present Value Calculations', () => {
  test('calculates increasing perpetuity PV with immediate payments', () => {
    expect(calculatePresentValueIncreasingPerpetuity(100, 5, 2)).toBeCloseTo(3333.33);
    expect(calculatePresentValueIncreasingPerpetuity(100, 5, 2, 'effective', 1, 'immediate', 0, 4))
      .toBeCloseTo(3245.91, 2); // Quarterly payments
  });

  test('calculates increasing perpetuity PV with payments due', () => {
    expect(calculatePresentValueIncreasingPerpetuity(100, 5, 2, 'effective', 1, 'due')).toBeCloseTo(3500);
  });

  test('calculates increasing perpetuity PV with deferred payments', () => {
    expect(calculatePresentValueIncreasingPerpetuity(100, 5, 2, 'effective', 1, 'immediate', 2)).toBeCloseTo(3023.43, 2);
  });

  test('throws error when growth rate equals interest rate', () => {
    expect(() => calculatePresentValueIncreasingPerpetuity(100, 5, 5)).toThrow();
  });

  test('throws error when growth rate exceeds interest rate', () => {
    expect(() => calculatePresentValueIncreasingPerpetuity(100, 5, 6)).toThrow();
  });
});

describe('Level Perpetuity Payment Calculations', () => {
  test('calculates level perpetuity payment with immediate payments', () => {
    expect(calculatePaymentLevelPerpetuity(2000, 5)).toBeCloseTo(100);
    expect(calculatePaymentLevelPerpetuity(2000, 5, 'effective', 1, 'immediate', 0, 2))
      .toBeCloseTo(51.25, 2); // Semi-annual payments
  });

  test('calculates level perpetuity payment with payments due', () => {
    expect(calculatePaymentLevelPerpetuity(2100, 5, 'effective', 1, 'due')).toBeCloseTo(100);
  });

  test('calculates level perpetuity payment with deferred payments', () => {
    expect(calculatePaymentLevelPerpetuity(1814.06, 5, 'effective', 1, 'immediate', 2)).toBeCloseTo(100);
  });

  test('throws error for non-positive interest rate', () => {
    expect(() => calculatePaymentLevelPerpetuity(2000, 0)).toThrow();
    expect(() => calculatePaymentLevelPerpetuity(2000, -5)).toThrow();
  });
});

describe('Increasing Perpetuity Payment Calculations', () => {
  test('calculates increasing perpetuity payment with immediate payments', () => {
    expect(calculatePaymentIncreasingPerpetuity(3333.33, 5, 2)).toBeCloseTo(100);
  });

  test('calculates increasing perpetuity payment with payments due', () => {
    expect(calculatePaymentIncreasingPerpetuity(3500, 5, 2, 'effective', 1, 'due')).toBeCloseTo(100);
  });

  test('calculates increasing perpetuity payment with deferred payments', () => {
    expect(calculatePaymentIncreasingPerpetuity(3023.59, 5, 2, 'effective', 1, 'immediate', 2)).toBeCloseTo(100, 3);
  });

  test('throws error when growth rate equals interest rate', () => {
    expect(() => calculatePaymentIncreasingPerpetuity(3333.33, 5, 5)).toThrow();
  });

  test('throws error when growth rate exceeds interest rate', () => {
    expect(() => calculatePaymentIncreasingPerpetuity(3333.33, 5, 6)).toThrow();
  });
});

describe('Interest Rate Calculations', () => {
  test('calculates interest rate for level perpetuity', () => {
    expect(calculateInterestRate(2000, 100)).toBeCloseTo(5);
    expect(calculateInterestRate(1942.69, 8.33, 'effective', 1, 'immediate', 0, 12)).toBeCloseTo(5, 2); // Monthly payments
  });

  test('calculates interest rate for increasing perpetuity', () => {
    expect(calculateInterestRate(3333.33, 100, 'effective', 1, 'immediate', 0, 2)).toBeCloseTo(5);
  });

  test('calculates interest rate with payments due', () => {
    expect(calculateInterestRate(2100, 100, 'effective', 1, 'due')).toBeCloseTo(5);
  });

  test('calculates interest rate with deferred payments', () => {
    expect(calculateInterestRate(1814.06, 100, 'effective', 1, 'immediate', 2)).toBeCloseTo(5);
  });

  test('throws error when cannot converge', () => {
    expect(() => calculateInterestRate(0, 100)).toThrow();
  });
});

describe('Geometric Perpetuity Present Value Calculations', () => {
  test('calculates geometric perpetuity PV with immediate payments', () => {
    expect(calculatePresentValueGeometricPerpetuityImmediate(100, 5, 2)).toBeCloseTo(3333.33, 2);
  });

  test('calculates geometric perpetuity PV with due payments', () => {
    expect(calculatePresentValueGeometricPerpetuityDue(100, 5, 2)).toBeCloseTo(3500, 2);
  });

  test('throws error when growth rate equals interest rate', () => {
    expect(() => calculatePresentValueGeometricPerpetuityImmediate(100, 5, 5)).toThrow();
  });

  test('throws error when growth rate exceeds interest rate', () => {
    expect(() => calculatePresentValueGeometricPerpetuityImmediate(100, 5, 6)).toThrow();
  });
});

describe('Future Value of Level Perpetuity', () => {
  test('throws error for future value calculation', () => {
    expect(() => calculateFutureValueLevelPerpetuity(100, 5, 10)).toThrow('The future value of a perpetuity is infinite.');
  });
});
