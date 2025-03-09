import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BondVisualization from './BondVisualization';
import { BondCalculatorState } from '../utils/types';

describe('BondVisualization', () => {
  const defaultState: BondCalculatorState = {
    bondType: 'regular',
    faceValue: 1000,
    couponRate: 6,
    redemptionValue: 1000,
    yieldRate: 5,
    periods: 10,
    frequency: 1,
    priceType: null,
    result: null,
    amortizationSchedule: null,
    error: null
  };

  describe('Regular Bond Visualization', () => {
    it('renders timeline with correct elements', () => {
      render(<BondVisualization state={defaultState} />);
      
      // Should show initial investment
      expect(screen.getByText('-$1000')).toBeInTheDocument();
      
      // Should show coupon payments ($60 = 6% of $1000)
      const couponPayments = screen.getAllByText('+$60');
      expect(couponPayments).toHaveLength(10); // One for each period
      
      // Should show redemption value
      expect(screen.getByText('+$1000')).toBeInTheDocument();
      
      // Should show time periods
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('displays legend items', () => {
      render(<BondVisualization state={defaultState} />);
      
      expect(screen.getByText('Initial Investment')).toBeInTheDocument();
      expect(screen.getByText('Payments & Redemption')).toBeInTheDocument();
      expect(screen.queryByText('Call Options')).not.toBeInTheDocument(); // Not shown for regular bonds
    });
  });

  describe('Callable Bond Visualization', () => {
    const callableState: BondCalculatorState = {
      ...defaultState,
      bondType: 'callable',
      callDates: [3, 5, 7],
      callPrices: [1020, 1010, 1000]
    };

    it('renders call options', () => {
      render(<BondVisualization state={callableState} />);
      
      // Should show call prices
      expect(screen.getByText('Call: $1020')).toBeInTheDocument();
      expect(screen.getByText('Call: $1010')).toBeInTheDocument();
      expect(screen.getByText('Call: $1000')).toBeInTheDocument();
      
      // Should show call options in legend
      expect(screen.getByText('Call Options')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles null values gracefully', () => {
      const incompleteState: BondCalculatorState = {
        ...defaultState,
        faceValue: null,
        couponRate: null,
        periods: null
      };

      // Should render without errors
      expect(() => render(<BondVisualization state={incompleteState} />))
        .not.toThrow();
    });

    it('handles zero coupon bonds', () => {
      const zeroCouponState: BondCalculatorState = {
        ...defaultState,
        couponRate: 0
      };

      render(<BondVisualization state={zeroCouponState} />);
      
      // Should only show initial investment and redemption value
      expect(screen.getByText('-$1000')).toBeInTheDocument();
      expect(screen.getByText('+$1000')).toBeInTheDocument();
      expect(screen.queryByText('+$0')).not.toBeInTheDocument(); // No coupon payments
    });
  });

  describe('Responsive Behavior', () => {
    it('maintains readability with many periods', () => {
      const longTermState: BondCalculatorState = {
        ...defaultState,
        periods: 30
      };

      render(<BondVisualization state={longTermState} />);
      
      // Should still show start and end points
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('30')).toBeInTheDocument();
    });
  });
});