import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnnuityCalculator from './AnnuityCalculator';

describe('AnnuityCalculator Component', () => {
  it('renders without crashing', () => {
    render(<AnnuityCalculator />);
    expect(screen.getByText(/This calculator helps you solve/)).toBeInTheDocument();
  });

  it('renders input fields for all annuity types', () => {
    render(<AnnuityCalculator />);
    expect(screen.getByLabelText('Solve For')).toBeInTheDocument();
    expect(screen.getByLabelText('Annuity Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Variation Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Payment Amount')).toBeInTheDocument();
    expect(screen.getByLabelText('Present Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Future Value')).toBeInTheDocument();
    expect(screen.getByLabelText('Interest Rate (%)')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of Periods')).toBeInTheDocument();
  });

  it('updates state correctly when input values change', () => {
    render(<AnnuityCalculator />);

    fireEvent.change(screen.getByLabelText('Payment Amount'), { target: { value: '100' } });
    expect((screen.getByLabelText('Payment Amount') as HTMLInputElement).value).toBe('100');

    fireEvent.change(screen.getByLabelText('Present Value'), { target: { value: '1000' } });
    expect((screen.getByLabelText('Present Value') as HTMLInputElement).value).toBe('1000');

    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), { target: { value: '5' } });
    expect((screen.getByLabelText('Interest Rate (%)') as HTMLInputElement).value).toBe('5');

    fireEvent.change(screen.getByLabelText('Number of Periods'), { target: { value: '10' } });
    expect((screen.getByLabelText('Number of Periods') as HTMLInputElement).value).toBe('10');
  });

  it('calculates present value correctly for a level, immediate annuity', () => {
    render(<AnnuityCalculator />);

    // Set input values for a known scenario
    fireEvent.change(screen.getByLabelText('Solve For'), { target: { value: 'presentValue' } });
    fireEvent.change(screen.getByLabelText('Annuity Type'), { target: { value: 'immediate' } });
    fireEvent.change(screen.getByLabelText('Variation Type'), { target: { value: 'level' } });
    fireEvent.change(screen.getByLabelText('Payment Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Number of Periods'), { target: { value: '10' } });

    // Trigger the calculation
    fireEvent.click(screen.getByText('Calculate'));

    // Assert that the calculated present value is correct (rounded to 2 decimal places)
    // For PMT=100, i=5%, n=10, PV should be approximately 772.17
    expect((screen.getByLabelText('Present Value') as HTMLInputElement).value).toBe('772.17');
  });

  it('calculates future value correctly for a level, immediate annuity', () => {
    render(<AnnuityCalculator />);

    // Set input values for a known scenario
    fireEvent.change(screen.getByLabelText('Solve For'), { target: { value: 'futureValue' } });
    fireEvent.change(screen.getByLabelText('Annuity Type'), { target: { value: 'immediate' } });
    fireEvent.change(screen.getByLabelText('Variation Type'), { target: { value: 'level' } });
    fireEvent.change(screen.getByLabelText('Payment Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Number of Periods'), { target: { value: '10' } });

    // Trigger the calculation
    fireEvent.click(screen.getByText('Calculate'));

    // Assert that the calculated future value is correct (rounded to 2 decimal places)
    // For PMT=100, i=5%, n=10, FV should be approximately 1257.79
    expect((screen.getByLabelText('Future Value') as HTMLInputElement).value).toBe('1257.79');
  });

    it('calculates payment amount correctly for a level, immediate annuity', () => {
    render(<AnnuityCalculator />);

    // Set input values for a known scenario
    fireEvent.change(screen.getByLabelText('Solve For'), { target: { value: 'payment' } });
    fireEvent.change(screen.getByLabelText('Annuity Type'), { target: { value: 'immediate' } });
    fireEvent.change(screen.getByLabelText('Variation Type'), { target: { value: 'level' } });
    fireEvent.change(screen.getByLabelText('Present Value'), { target: { value: '772.17' } });
    fireEvent.change(screen.getByLabelText('Interest Rate (%)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Number of Periods'), { target: { value: '10' } });

    // Trigger the calculation
    fireEvent.click(screen.getByText('Calculate'));

    // Assert that the calculated payment is correct (rounded to 2 decimal places)
    expect((screen.getByLabelText('Payment Amount') as HTMLInputElement).value).toBe('100.00');
  });

  it('calculates interest rate correctly for a level, immediate annuity', () => {
    render(<AnnuityCalculator />);

    // Set input values for a known scenario
    fireEvent.change(screen.getByLabelText('Solve For'), { target: { value: 'interestRate' } });
    fireEvent.change(screen.getByLabelText('Annuity Type'), { target: { value: 'immediate' } });
    fireEvent.change(screen.getByLabelText('Variation Type'), { target: { value: 'level' } });
    fireEvent.change(screen.getByLabelText('Payment Amount'), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText('Present Value'), { target: { value: '772.17' } });
    fireEvent.change(screen.getByLabelText('Number of Periods'), { target: { value: '10' } });

    // Trigger the calculation
    fireEvent.click(screen.getByText('Calculate'));

    // Assert that the calculated interest rate is correct (rounded to 4 decimal places)
    expect((screen.getByLabelText('Interest Rate (%)') as HTMLInputElement).value).toBe('5.0000');
  });

  it('calculates number of periods correctly for a level, immediate annuity', () => {
      render(<AnnuityCalculator />);

      // Set input values for a known scenario
      fireEvent.change(screen.getByLabelText('Solve For'), { target: { value: 'periods' } });
      fireEvent.change(screen.getByLabelText('Annuity Type'), { target: { value: 'immediate' } });
      fireEvent.change(screen.getByLabelText('Variation Type'), { target: { value: 'level' } });
      fireEvent.change(screen.getByLabelText('Payment Amount'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Present Value'), { target: { value: '772.17' } });
      fireEvent.change(screen.getByLabelText('Interest Rate (%)'), { target: { value: '5' } });

      // Trigger the calculation
      fireEvent.click(screen.getByText('Calculate'));

      // Assert that the calculated number of periods is correct (rounded to 2 decimal places)
      expect((screen.getByLabelText('Number of Periods') as HTMLInputElement).value).toBe('10.00');
    });
});