import React from 'react';
import { BondCalculatorState } from '../utils/types';

interface Props {
  state: BondCalculatorState;
}

const BondVisualization: React.FC<Props> = ({ state }) => {
  const { bondType, faceValue, couponRate, redemptionValue, periods, callDates, callPrices } = state;
  
  // Calculate dimensions
  const width = 600;
  const height = 200;
  const padding = 40;
  const timelineY = height - padding;
  const timelineLength = width - 2 * padding;
  
  // Calculate payments
  const couponPayment = faceValue && couponRate ? (faceValue * (couponRate / 100)) : 0;
  
  return (
    <div className="my-4">
      <svg width={width} height={height} className="bg-white">
        {/* Draw timeline */}
        <line
          x1={padding}
          y1={timelineY}
          x2={width - padding}
          y2={timelineY}
          stroke="black"
          strokeWidth={2}
        />
        
        {/* Draw initial investment */}
        <line
          x1={padding}
          y1={timelineY}
          x2={padding}
          y2={timelineY - 60}
          stroke="red"
          strokeWidth={2}
        />
        <text
          x={padding}
          y={timelineY - 70}
          textAnchor="middle"
          fill="red"
          fontSize="12"
        >
          -${faceValue}
        </text>

        {/* Draw coupon payments */}
        {couponPayment > 0 && Array.from({ length: periods || 0 }).map((_, i) => {
          const x = padding + ((i + 1) * timelineLength) / (periods || 1);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={timelineY}
                x2={x}
                y2={timelineY - 40}
                stroke="green"
                strokeWidth={2}
              />
              <text
                x={x}
                y={timelineY - 50}
                textAnchor="middle"
                fill="green"
                fontSize="12"
              >
                +${couponPayment}
              </text>
            </g>
          );
        })}

        {/* Draw redemption value */}
        {periods && (
          <g>
            <line
              x1={width - padding}
              y1={timelineY}
              x2={width - padding}
              y2={timelineY - 60}
              stroke="green"
              strokeWidth={2}
            />
            <text
              x={width - padding}
              y={timelineY - 70}
              textAnchor="middle"
              fill="green"
              fontSize="12"
            >
              +${redemptionValue}
            </text>
          </g>
        )}

        {/* Draw call dates and prices for callable bonds */}
        {bondType === 'callable' && callDates && callPrices && (
          <>
            {callDates.map((date, i) => {
              const x = padding + (date * timelineLength) / (periods || 1);
              return (
                <g key={`call-${i}`}>
                  <line
                    x1={x}
                    y1={timelineY - 20}
                    x2={x}
                    y2={timelineY + 20}
                    stroke="blue"
                    strokeWidth={1}
                    strokeDasharray="4"
                  />
                  <text
                    x={x}
                    y={timelineY + 35}
                    textAnchor="middle"
                    fill="blue"
                    fontSize="12"
                  >
                    Call: ${callPrices[i]}
                  </text>
                </g>
              );
            })}
          </>
        )}

        {/* Time period labels */}
        <text x={padding} y={timelineY + 20} textAnchor="middle">0</text>
        <text x={width - padding} y={timelineY + 20} textAnchor="middle">
          {periods}
        </text>
      </svg>
      
      {/* Legend */}
      <div className="mt-4 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span>Initial Investment</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2"></div>
            <span>Payments & Redemption</span>
          </div>
          {bondType === 'callable' && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span>Call Options</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BondVisualization;