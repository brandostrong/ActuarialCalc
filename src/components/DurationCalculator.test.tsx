import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DurationCalculator from './DurationCalculator';

describe('DurationCalculator', () => {
    it('renders without crashing', () => {
        render(<DurationCalculator />);
        expect(screen.getByText('Duration & Convexity Calculator')).toBeInTheDocument();
    });

    it('allows adding cash flows', () => {
        render(<DurationCalculator />);
        
        // Click the "Add Cash Flow" button
        const addButton = screen.getByText('Add Cash Flow');
        fireEvent.click(addButton);
        
        // Check if time and amount inputs are rendered
        const timeInput = screen.getByTestId('time-input-0');
        const amountInput = screen.getByTestId('amount-input-0');
        
        expect(timeInput).toBeInTheDocument();
        expect(amountInput).toBeInTheDocument();
    });

    it('calculates duration for a zero-coupon bond', async () => {
        render(<DurationCalculator />);
        
        // Add a cash flow
        const addButton = screen.getByText('Add Cash Flow');
        fireEvent.click(addButton);
        
        // Enter cash flow details (5-year zero-coupon bond)
        const timeInput = screen.getByTestId('time-input-0');
        const amountInput = screen.getByTestId('amount-input-0');
        const interestRateInput = screen.getByTestId('primary-input');
        
        await userEvent.type(timeInput, '5');
        await userEvent.type(amountInput, '1000');
        await userEvent.type(interestRateInput, '6');
        
        // Calculate results
        const calculateButton = screen.getByText('Calculate');
        fireEvent.click(calculateButton);
        
        // For a zero-coupon bond, Macaulay Duration should equal time to maturity
        const macDResult = screen.getByTestId('macaulay-duration-result');
        expect(macDResult).toBeInTheDocument();
        expect(macDResult.textContent).toBe('5.0000');
    });

    it('calculates duration for a coupon bond', async () => {
        render(<DurationCalculator />);
        
        // Add cash flows for a 5-year 6% coupon bond
        for (let i = 0; i < 5; i++) {
            fireEvent.click(screen.getByText('Add Cash Flow'));
        }
        
        // Enter cash flows
        const timeInputs = screen.getAllByTestId(/time-input-\d+/);
        const amountInputs = screen.getAllByTestId(/amount-input-\d+/);
        const interestRateInput = screen.getByTestId('primary-input');
        
        for (let i = 0; i < 5; i++) {
            await userEvent.type(timeInputs[i], String(i + 1));
            await userEvent.type(amountInputs[i], i === 4 ? '1060' : '60');
        }
        await userEvent.type(interestRateInput, '0.06');
        
        // Calculate results
        fireEvent.click(screen.getByText('Calculate'));
        
        // Duration should be between 0 and 5 years
        const macDResult = screen.getByTestId('macaulay-duration-result');
        const duration = parseFloat(macDResult.textContent || '0');
        expect(duration).toBeGreaterThan(0);
        expect(duration).toBeLessThan(5);
    });

    it('calculates portfolio duration', async () => {
        render(<DurationCalculator />);
        
        // Add a cash flow and add interest rate
        const addButton = screen.getByText('Add Cash Flow');
        fireEvent.click(addButton);
        
        // Enter cash flow details
        const timeInput = screen.getByTestId('time-input-0');
        const amountInput = screen.getByTestId('amount-input-0');
        const interestInput = screen.getByTestId('primary-input');
        
        await userEvent.type(timeInput, '5');
        await userEvent.type(amountInput, '1000');
        await userEvent.type(interestInput, '0.06');
        
        // Add portfolio components
        const addPortfolioButton = screen.getByText('Add Portfolio Component');
        fireEvent.click(addPortfolioButton);
        fireEvent.click(addPortfolioButton);
        
        // Enter portfolio component details
        const durationInput0 = screen.getByTestId('duration-input-0');
        const valueInput0 = screen.getByTestId('value-input-0');
        const durationInput1 = screen.getByTestId('duration-input-1');
        const valueInput1 = screen.getByTestId('value-input-1');
        
        await userEvent.type(durationInput0, '5');
        await userEvent.type(valueInput0, '1000');
        await userEvent.type(durationInput1, '3');
        await userEvent.type(valueInput1, '2000');
        
        // Calculate results
        fireEvent.click(screen.getByText('Calculate'));
        
        // Wait for duration to be calculated
        await screen.findByTestId('macaulay-duration-result');
        const durationResult = screen.getByTestId('macaulay-duration-result');
        expect(durationResult).toBeInTheDocument();
        expect(parseFloat(durationResult.textContent || '0')).toBeCloseTo(3.67, 2);
    });

    it('calculates yield and price', async () => {
        render(<DurationCalculator />);
        
        // Add a cash flow
        fireEvent.click(screen.getByText('Add Cash Flow'));
        
        // Switch to yield calculation mode
        fireEvent.click(screen.getByTestId('yield-button'));
        
        // Enter cash flow and price
        const timeInput = screen.getByTestId('time-input-0');
        const amountInput = screen.getByTestId('amount-input-0');
        const priceInput = screen.getByTestId('primary-input'); // When solving for yield, primary input is price
        
        await userEvent.type(timeInput, '5');
        await userEvent.type(amountInput, '1000');
        await userEvent.type(priceInput, '1000');
        
        // Calculate results
        fireEvent.click(screen.getByText('Calculate'));
        
        // Results should be displayed
        const durationResult = screen.getByTestId('macaulay-duration-result');
        expect(durationResult).toBeInTheDocument();
        
        // Switch back to price calculation
        fireEvent.click(screen.getByTestId('price-button'));
        const interestRateInput = screen.getByTestId('primary-input'); // Now primary input is interest rate
        await userEvent.type(interestRateInput, '0.06');
        
        // Calculate price
        fireEvent.click(screen.getByText('Calculate'));
        expect(durationResult).toBeInTheDocument();
    });

    it('displays error for invalid inputs', () => {
        render(<DurationCalculator />);
        
        // Try to calculate without any cash flows
        fireEvent.click(screen.getByText('Calculate'));
        
        // Error message should be shown
        const errorMessage = screen.getByText('Please enter at least one cash flow');
        expect(errorMessage).toBeInTheDocument();
    });
});