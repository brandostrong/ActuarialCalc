import React, { useState, useRef } from 'react';
import { getTooltipContent } from '../utils/formulaTooltips';

interface FormulaTooltipProps {
  formulaKey: keyof typeof import('../utils/formulaTooltips').formulaTooltips;
  children: React.ReactNode;
}

const FormulaTooltip: React.FC<FormulaTooltipProps> = ({ formulaKey, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const handleMouseEnter = () => {
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  
  return (
    <div className="relative inline-block">
      <span 
        className="cursor-help border-b border-dotted border-primary-500"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      
      {showTooltip && (
        <div 
          ref={tooltipRef}
          className="formula-tooltip"
          dangerouslySetInnerHTML={{ __html: getTooltipContent(formulaKey) || '' }}
        />
      )}
    </div>
  );
};

export default FormulaTooltip;