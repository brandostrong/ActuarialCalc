# Actuarial Calculator Testing Framework

This document outlines the testing framework for the Actuarial Calculator application, focusing on the annuity calculator's solving functionality.

## Test Structure

The tests are organized into several files, each focusing on different aspects of the calculator:

### 1. Unit Tests for Calculation Functions

**File:** `src/utils/annuityCalculations.test.ts`

These tests focus on the pure calculation functions in isolation, ensuring that each mathematical function works correctly. The tests are organized by function categories:

- Basic annuity calculations (present value, future value)
- Payment calculations
- Interest rate calculations
- Period calculations
- Special annuity types (deferred, increasing, geometric)
- Interest rate conversion functions

### 2. Integration Tests for Solving Functionality

**File:** `src/components/AnnuityCalculatorSolving.test.tsx`

These tests focus on how the calculation functions are integrated into the AnnuityCalculator component and how the component handles different calculation scenarios. The tests are organized by annuity type and calculation type:

- Level annuity calculations
- Increasing annuity calculations
- Geometric annuity calculations
- Edge cases and error handling
- Interest rate conversion
- Amortization schedule generation

### 3. Utility Function Tests

**File:** `src/utils/calculationUtils.test.ts`

These tests focus on the utility functions that support the calculator's solving functionality:

- Interest rate conversion functions
- Amortization schedule generation functions
- Integration tests for calculation workflows

### 4. Validation Tests

**File:** `src/components/AnnuityCalculatorValidation.test.tsx`

These tests focus on the validation logic in the calculator:

- Input validation
- Input field behavior
- Calculation error handling
- Special case validation
- UI feedback
- State management

### 5. Component Tests

**File:** `src/components/AnnuityCalculator.test.tsx`

These tests focus on the general component functionality:

- Rendering
- Input field presence
- State updates
- Basic calculations

## Running Tests

To run all tests:

```bash
npm test
```

To run a specific test file:

```bash
npm test -- src/utils/annuityCalculations.test.ts
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Test Implementation Guidelines

When implementing the tests, follow these guidelines:

1. **Test Isolation**: Each test should be independent and not rely on the state from other tests.
2. **Descriptive Names**: Use descriptive test names that clearly indicate what is being tested.
3. **Arrange-Act-Assert**: Structure tests with clear arrangement, action, and assertion phases.
4. **Edge Cases**: Include tests for edge cases such as zero interest rate, single period, etc.
5. **Error Cases**: Test error handling and validation logic.
6. **Precision**: For financial calculations, be aware of floating-point precision issues and use appropriate tolerance in assertions.

## Example Test Implementation

Here's an example of how to implement a test for the `presentValueAnnuityImmediate` function:

```typescript
import { presentValueAnnuityImmediate } from './annuityCalculations';

describe('presentValueAnnuityImmediate', () => {
  it('calculates present value correctly for standard case', () => {
    // Arrange
    const payment = 100;
    const interestRate = 5;
    const periods = 10;
    
    // Act
    const result = presentValueAnnuityImmediate(payment, interestRate, periods);
    
    // Assert
    expect(result).toBeCloseTo(772.17, 2);
  });
});
```

## Extending the Tests

When adding new functionality to the calculator, follow these steps to extend the tests:

1. Identify which test file is most appropriate for the new functionality.
2. Add new test cases following the existing structure.
3. Ensure that edge cases and error handling are covered.
4. Run the tests to verify that the new functionality works correctly.
5. Update this README if necessary to reflect changes to the testing framework.

## Mocking

For tests that involve complex UI interactions or external dependencies, consider using mocks:

```typescript
// Mock the calculation function
vi.mock('./annuityCalculations', () => ({
  presentValueAnnuityImmediate: vi.fn().mockReturnValue(772.17)
}));
```

## Test Coverage

Aim for high test coverage, especially for the calculation functions. The coverage report will help identify areas that need more testing.