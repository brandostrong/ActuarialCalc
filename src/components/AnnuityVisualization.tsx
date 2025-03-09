import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import type { AmortizationEntry } from '../utils/types';

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

  // Add visual indicators for payment timing
  const getPaymentPosition = (period: number) => {
    // For immediate annuities, payments occur at end of period
    // For due annuities, payments occur at start of period
    return annuityType === 'immediate' ? period : period - 1;
  };

  // Find the first non-deferred period (first period with a payment)
  const firstPaymentPeriod = schedule.findIndex(entry => entry.payment > 0);
  
  // Simply use the values directly from the schedule without recalculating them
  const chartData = schedule.map((row) => {
    // Determine if this period is during deferral
    const isDeferred = variationType === 'deferred' || 
                      (annuityType === 'deferred' && row.period <= firstPaymentPeriod);
    
    return {
      period: row.period,
      paymentPosition: getPaymentPosition(row.period),
      // Set payment to null for deferred periods to hide dots
      payment: isDeferred && row.period <= firstPaymentPeriod ? null : Number(row.payment.toFixed(2)),
      // Use the provided future value from the amortization schedule
      futureValue: Number(row.futureValue?.toFixed(2) || 0),
      // Show the present value throughout all periods
      presentValue: Number(row.presentValue?.toFixed(2) || 0),
      // Also include accumulated value for reference
      accumulatedValue: Number(row.accumulatedValue?.toFixed(2) || 0)
    };
  });

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">Payment Stream</h3>
      <p className="text-sm text-gray-600 mb-4">
        Blue line shows payment amounts (PMT), green line shows future value (FV),
        and yellow line shows present value (PV) at each period.
        {annuityType === 'deferred' && ` Deferral period ends at period ${firstPaymentPeriod + 1}.`}
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
              formatter={(value: ValueType, name: NameType, props: any) => {
                if (value === null || value === undefined) return ['-', name];
                const period = props?.payload?.period;
                const isDeferred = (variationType === 'deferred' || annuityType === 'deferred') && period <= firstPaymentPeriod;
                
                let label = name === "payment" ? "Payment Amount (PMT)" :
                           name === "futureValue" ? "Future Value (FV)" :
                           name === "presentValue" ? "Present Value (PV)" :
                           name === "accumulatedValue" ? "Accumulated Value (AV)" : name;
                
                if (isDeferred) {
                  if (name === "presentValue") {
                    label += " (Accumulating during deferral)";
                  } else if (name === "futureValue") {
                    label += " (Projected value at end of term)";
                  } else if (name === "payment") {
                    label += " (No payments during deferral)";
                  }
                }
                
                // Handle value formatting safely
                const formattedValue = typeof value === 'number'
                  ? `$${value.toFixed(2)}`
                  : value?.toString() || '-';
                return [formattedValue, label];
              }}
              labelFormatter={(period) => `Period ${period}${
                (variationType === 'deferred' || annuityType === 'deferred') && period <= firstPaymentPeriod
                  ? ' (Deferral Period)'
                  : ''
              }`}
              contentStyle={{ fontSize: '12px' }}
              wrapperStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Legend verticalAlign="top" height={36} />
            
            {/* Background for deferred periods */}
            {(variationType === 'deferred' || annuityType === 'deferred') && firstPaymentPeriod > 0 && (
              <>
                <rect
                  x="0%"
                  y="0%"
                  width={`${(firstPaymentPeriod / (schedule.length-1)) * 100}%`}
                  height="100%"
                  fill="#f3f4f6"
                  fillOpacity={0.5}
                />
                <text
                  x={`${((firstPaymentPeriod / (schedule.length-1)) * 100) / 2}%`}
                  y="50%"
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize={14}
                >
                  Deferral Period
                </text>
              </>
            )}
            
            {/* Payment timing indicator */}
            <text
              x={10}
              y={20}
              fill="#4b5563"
              fontSize={12}
            >
              {annuityType === 'deferred'
                ? `Payments start at period ${firstPaymentPeriod + 1} (at ${annuityType === 'due' ? 'start' : 'end'} of period)`
                : `Payments at ${annuityType === 'immediate' ? 'end' : 'start'} of period`}
            </text>
            
            {/* Payment line */}
            <Line
              type="monotone"
              dataKey="payment"
              stroke="#4f46e5"
              strokeWidth={2}
              name={`Payment Amount (PMT) - at ${annuityType === 'immediate' ? 'end' : 'start'} of period`}
              dot={{
                r: 4,
                strokeWidth: 1,
                stroke: '#4f46e5',
                fill: 'white'
              }}
              activeDot={{
                r: 6,
                strokeWidth: 1,
                stroke: '#4f46e5',
                fill: 'white'
              }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="futureValue"
              stroke="#16a34a"
              strokeWidth={2}
              name="Future Value (FV)"
              dot={{ stroke: '#16a34a', strokeWidth: 1, r: 3 }}
              strokeDasharray={(variationType === 'deferred' || annuityType === 'deferred') ? "5 5" : "0"}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="presentValue"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Present Value (PV)"
              dot={{ stroke: '#f59e0b', strokeWidth: 1, r: 3 }}
              connectNulls={true}
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