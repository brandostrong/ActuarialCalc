import React from 'react';
import { render, screen } from '@testing-library/react';
import DurationVisualization from './DurationVisualization';

describe('DurationVisualization', () => {
    const validProps = {
        cashFlows: [
            { time: 1, amount: 60 },
            { time: 2, amount: 1060 }
        ],
        originalPrice: 1000,
        originalRate: 0.06
    };

    it('renders visualization when valid props are provided', () => {
        render(<DurationVisualization {...validProps} />);
        expect(screen.getByText('Price-Yield Relationship')).toBeInTheDocument();
    });

    it('does not render when invalid props are provided', () => {
        // Test with empty cash flows
        const { container: container1 } = render(
            <DurationVisualization 
                {...validProps}
                cashFlows={[]}
            />
        );
        expect(container1.firstChild).toBeNull();

        // Test with negative price
        const { container: container2 } = render(
            <DurationVisualization 
                {...validProps}
                originalPrice={-100}
            />
        );
        expect(container2.firstChild).toBeNull();

        // Test with invalid rate
        const { container: container3 } = render(
            <DurationVisualization 
                {...validProps}
                originalRate={-1.5}
            />
        );
        expect(container3.firstChild).toBeNull();
    });

    it('renders explanation text', () => {
        render(<DurationVisualization {...validProps} />);
        expect(screen.getByText(/This graph shows the actual price-yield relationship/)).toBeInTheDocument();
        expect(screen.getByText(/The difference between the actual curve/)).toBeInTheDocument();
    });

    it('renders all three lines in the chart', () => {
        render(<DurationVisualization {...validProps} />);
        expect(screen.getByText('Actual Price')).toBeInTheDocument();
        expect(screen.getByText('Modified Duration Approx.')).toBeInTheDocument();
        expect(screen.getByText('Macaulay Duration Approx.')).toBeInTheDocument();
    });
});