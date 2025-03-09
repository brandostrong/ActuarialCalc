import React from 'react';
import { PerpetuityType, PerpetuityPaymentType } from '../utils/types';

interface PerpetuityVisualizationProps {
  perpetuityType: PerpetuityType;
  paymentType: PerpetuityPaymentType;
  payment: number | null;
  deferredPeriods: number | null;
  growthRate?: number | null;
}

const PerpetuityVisualization: React.FC<PerpetuityVisualizationProps> = ({
  perpetuityType,
  paymentType,
  payment,
  deferredPeriods,
  growthRate
}) => {
  // Calculate positions for payment indicators
  const visiblePeriods = 8; // Show first 8 periods + infinity
  const timelinePoints = Array.from({ length: visiblePeriods }, (_, i) => {
    const period = deferredPeriods ? i + deferredPeriods : i;
    let paymentAmount = payment;
    
    // Calculate payment amount for increasing perpetuity
    if (perpetuityType === 'increasing' && growthRate && payment) {
      paymentAmount = payment + (growthRate / 100) * payment * period;
    }

    return {
      period,
      amount: paymentAmount,
      x: (i + 1) * 100 // 100px spacing between points
    };
  });

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] h-[200px] relative">
        {/* Timeline base line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300" />
        
        {/* Time period markers */}
        {timelinePoints.map(({ period, x }, index) => (
          <React.Fragment key={period}>
            {/* Period marker */}
            <div
              className="absolute bottom-[45%] text-xs text-gray-600"
              style={{ left: `${x}px`, transform: 'translateX(-50%)' }}
            >
              {period}
            </div>
            
            {/* Payment marker */}
            <div
              className={`absolute w-4 h-4 rounded-full bg-primary-600 
                ${paymentType === 'due' ? 'bottom-[60%]' : 'top-[60%]'}
                ${index === 0 && deferredPeriods ? 'opacity-50' : ''}
              `}
              style={{ left: `${x}px`, transform: 'translate(-50%, -50%)' }}
            />
          </React.Fragment>
        ))}

        {/* Infinity symbol */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500">
          ∞
        </div>

        {/* Payment type indicator */}
        <div className="absolute left-4 top-4 text-sm text-gray-600">
          {paymentType === 'immediate' ? 'End-of-Period Payments' :
           paymentType === 'due' ? 'Beginning-of-Period Payments' :
           'Continuous Payments'}
        </div>

        {/* Deferred period indicator */}
        {deferredPeriods && deferredPeriods > 0 && (
          <div className="absolute left-4 bottom-4 text-sm text-gray-600">
            Deferred {deferredPeriods} period{deferredPeriods !== 1 ? 's' : ''}
          </div>
        )}

        {/* Growth rate indicator */}
        {perpetuityType === 'increasing' && growthRate && (
          <div className="absolute right-4 bottom-4 text-sm text-gray-600">
            Growth Rate: {growthRate}%
          </div>
        )}

        {/* Payment amounts */}
        {timelinePoints.slice(0, 3).map(({ amount, x }, index) => (
          <div
            key={`amount-${index}`}
            className="absolute text-xs text-primary-700"
            style={{
              left: `${x}px`,
              [paymentType === 'due' ? 'bottom' : 'top']: '70%',
              transform: 'translateX(-50%)'
            }}
          >
            {amount ? `$${amount.toFixed(2)}` : '-'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerpetuityVisualization;