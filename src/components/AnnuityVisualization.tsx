import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

import type { AmortizationEntry } from '../utils/types';
import {
  futureValueAnnuityImmediate,
  futureValueAnnuityDue
} from '../utils/annuityCalculations';

interface AnnuityVisualizationProps {
  schedule: AmortizationEntry[];
  annuityType: string;
  variationType: string;
}
const AnnuityVisualization: React.FC<AnnuityVisualizationProps> = ({
  schedule,
  annuityType,
  variationType
}) => {
  if (!schedule || schedule.length === 0) return null;

  const chartData = schedule.map(row => ({
    period: row.period,
    payment: Number(row.payment.toFixed(2)),
    futureValue: row.futureValue ? Number(row.futureValue.toFixed(2)) : 0,
    presentValue: row.presentValue ? Number(row.presentValue.toFixed(2)) : 0
  }));

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Stream</h3>
      <p className="text-sm text-gray-600 mb-4">
        Blue line shows payment amounts (PMT), green line shows future value (FV),
        and yellow line shows present value (PV) at each period.
      </p>
      <div className="w-full h-[500px] bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              label={{ value: 'Period', position: 'insideBottom', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{
                value: 'Amount',
                angle: -90,
                position: 'insideLeft',
                offset: -40,
                style: { textAnchor: 'middle', fontSize: 12 }
              }}
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toFixed(2)}`,
                name === "payment" ? "Payment Amount (PMT)" :
                name === "futureValue" ? "Future Value (FV)" :
                name === "presentValue" ? "Present Value (PV)" : name
              ]}
              labelFormatter={(period) => `Period ${period}`}
              contentStyle={{ fontSize: '12px' }}
              wrapperStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="payment"
              stroke="#4f46e5"
              strokeWidth={2}
              name="Payment Amount (PMT)"
              dot={{ stroke: '#4f46e5', strokeWidth: 1, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="futureValue"
              stroke="#16a34a"
              strokeWidth={2}
              name="Future Value (FV)"
              dot={{ stroke: '#16a34a', strokeWidth: 1, r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="presentValue"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Present Value (PV)"
              dot={{ stroke: '#f59e0b', strokeWidth: 1, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          {variationType === 'level' 
            ? 'Level payments over time'
            : variationType === 'increasing'
            ? 'Arithmetically increasing payments'
            : 'Geometrically increasing payments'
          }
          {' '}with {annuityType === 'immediate' 
            ? 'payments at period end'
            : annuityType === 'due'
            ? 'payments at period start'
            : 'deferred payments'
          }
        </p>
      </div>
    </div>
  );
};

export default AnnuityVisualization;