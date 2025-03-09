import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CashFlow } from '../utils/types';
import {
    calculateMacaulayDuration,
    calculateModifiedDuration,
    approximatePriceModified,
    approximatePriceMacaulay
} from '../utils/durationConvexityCalculations';

interface DurationVisualizationProps {
    cashFlows: CashFlow[];
    originalPrice: number;
    originalRate: number;
}

const DurationVisualization: React.FC<DurationVisualizationProps> = ({
    cashFlows,
    originalPrice,
    originalRate
}) => {
    if (!cashFlows.length || originalPrice <= 0 || originalRate < -1) {
        return null;
    }

    // Calculate durations
    const macD = calculateMacaulayDuration(cashFlows, originalRate);
    const modD = calculateModifiedDuration(cashFlows, originalRate);

    // Generate data points for visualization
    const generateDataPoints = () => {
        const points = [];
        const rateRange = 0.02; // +/- 2% from original rate
        const steps = 40;
        
        for (let i = 0; i <= steps; i++) {
            const newRate = originalRate - rateRange + (2 * rateRange * i) / steps;
            
            // Calculate actual price with cash flows
            const actualPrice = cashFlows.reduce(
                (sum, cf) => sum + cf.amount / Math.pow(1 + newRate, cf.time),
                0
            );
            
            // Calculate approximated prices using both methods
            const approxPriceMod = approximatePriceModified(
                originalPrice,
                originalRate,
                newRate,
                modD
            );
            
            const approxPriceMac = approximatePriceMacaulay(
                originalPrice,
                originalRate,
                newRate,
                macD
            );
            
            points.push({
                rate: newRate * 100, // Convert to percentage
                actualPrice,
                modifiedApprox: approxPriceMod,
                macaulayApprox: approxPriceMac
            });
        }
        
        return points;
    };

    const data = generateDataPoints();

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Price-Yield Relationship</h3>
            <div className="bg-white p-4 rounded-lg shadow">
                <LineChart width={600} height={400} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="rate"
                        label={{ value: 'Interest Rate (%)', position: 'bottom' }}
                    />
                    <YAxis
                        label={{ value: 'Price', angle: -90, position: 'left' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="actualPrice"
                        stroke="#2563eb"
                        name="Actual Price"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="modifiedApprox"
                        stroke="#16a34a"
                        name="Modified Duration Approx."
                        dot={false}
                        strokeDasharray="5 5"
                    />
                    <Line
                        type="monotone"
                        dataKey="macaulayApprox"
                        stroke="#dc2626"
                        name="Macaulay Duration Approx."
                        dot={false}
                        strokeDasharray="3 3"
                    />
                </LineChart>
                <div className="mt-4 text-sm text-gray-600">
                    <p>
                        This graph shows the actual price-yield relationship (solid line) compared
                        to the linear approximations using Modified Duration (green dashed) and
                        Macaulay Duration (red dashed).
                    </p>
                    <p className="mt-2">
                        The difference between the actual curve and the approximations
                        demonstrates the convexity effect, which becomes more pronounced
                        with larger interest rate changes.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DurationVisualization;