import React, { useState, useRef } from 'react';
import { getTooltipContent } from '../utils/formulaTooltips';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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

  const tooltipContent = getTooltipContent(formulaKey);
  
  return (
    <div className="relative inline-block">
      <span 
        className="cursor-help border-b border-dotted border-primary-500"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      
      {showTooltip && tooltipContent && (
        <div 
          ref={tooltipRef}
          className="formula-tooltip"
        >
          <div className="formula-tooltip-formula">
            <BlockMath math={tooltipContent.formula} />
          </div>
          <div className="formula-tooltip-explanation">
            {tooltipContent.explanation}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaTooltip;