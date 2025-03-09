import React, { useState, useEffect } from 'react';
import { CashFlow, DurationCalculatorState, PortfolioComponent } from '../utils/types';
import {
    calculateMacaulayDuration,
    calculateModifiedDuration,
    calculateMacaulayConvexity,
    calculateModifiedConvexity,
    approximatePriceModified,
    approximatePriceMacaulay,
    calculateDurationPassageOfTime,
    calculatePortfolioDuration
} from '../utils/durationConvexityCalculations';
import FormulaTooltip from './FormulaTooltip';
import DurationVisualization from './DurationVisualization';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const DurationCalculator: React.FC = () => {
    const [state, setState] = useState<DurationCalculatorState>({
      solveFor: 'price' as 'price' | 'yield',
      cashFlows: [],
      interestRate: null,
      price: null,
      portfolioComponents: [],
      timeDifference: undefined,
      result: null,
      error: null,
      durations: {
        macaulayDuration: null,
        modifiedDuration: null,
        macaulayConvexity: null,
        modifiedConvexity: null
      }
    });

    const validateInputs = (): boolean => {
        if (state.cashFlows.length === 0) {
            setState(prev => ({ ...prev, error: "Please enter at least one cash flow" }));
            return false;
        }

        if (state.solveFor === 'price') {
            if (state.interestRate === null || state.interestRate < -1) {
                setState(prev => ({ ...prev, error: "Please enter a valid interest rate" }));
                return false;
            }
        } else if (state.solveFor === 'yield') {
            if (state.price === null || state.price <= 0) {
                setState(prev => ({ ...prev, error: "Please enter a valid price" }));
                return false;
            }
        }

        // Additional validation for both cases
        const invalidCashFlow = state.cashFlows.some(cf => cf.time < 0 || cf.amount <= 0);
        if (invalidCashFlow) {
            setState(prev => ({ ...prev, error: "Cash flows must have positive amounts and non-negative times" }));
            return false;
        }

        return true;
    };

    const calculateResults = () => {
        if (!validateInputs()) return;

        try {
          // Calculate durations and convexity
          const macaulayDuration = calculateMacaulayDuration(state.cashFlows, state.interestRate!);
          const modifiedDuration = calculateModifiedDuration(state.cashFlows, state.interestRate!);
          const macaulayConvexity = calculateMacaulayConvexity(state.cashFlows, state.interestRate!);
          const modifiedConvexity = calculateModifiedConvexity(state.cashFlows, state.interestRate!);
    
          // Calculate the result based on what we're solving for
          let result: number | null = null;
          if (state.solveFor === 'price' && state.interestRate !== null) {
            // Calculate present value of cash flows
            result = state.cashFlows.reduce((sum, cf) => {
              return sum + cf.amount / Math.pow(1 + state.interestRate!, cf.time);
            }, 0);
          } else if (state.solveFor === 'yield' && state.price !== null) {
            // Use Newton-Raphson method to find yield
            // Start with initial guess of current interest rate or 5%
            let yield_guess = state.interestRate || 0.05;
            const maxIterations = 100;
            const tolerance = 0.0000001;
            
            for (let i = 0; i < maxIterations; i++) {
              let price = 0;
              let derivative = 0;
              
              state.cashFlows.forEach(cf => {
                const discountFactor = Math.pow(1 + yield_guess, -cf.time);
                price += cf.amount * discountFactor;
                derivative -= cf.time * cf.amount * discountFactor / (1 + yield_guess);
              });
              
              const diff = price - state.price;
              if (Math.abs(diff) < tolerance) {
                result = yield_guess;
                break;
              }
              
              yield_guess = yield_guess - diff / derivative;
            }
          }
    
          setState(prev => ({
            ...prev,
            result,
            durations: {
              macaulayDuration,
              modifiedDuration,
              macaulayConvexity,
              modifiedConvexity
            },
            error: null
          }));
    
          // Calculate portfolio duration if components are provided
          if (state.portfolioComponents && state.portfolioComponents.length > 0) {
            const portDuration = calculatePortfolioDuration(state.portfolioComponents);
            // Update portfolio components with the new duration
            setState(prev => ({
              ...prev,
              portfolioComponents: [...(prev.portfolioComponents || [])],
              durations: {
                ...prev.durations,
                macaulayDuration: portDuration
              }
            }));
          }
        } catch (error) {
            setState(prev => ({ ...prev, error: "Error calculating results" }));
        }
    };

    const handleAddCashFlow = () => {
        setState(prev => ({
            ...prev,
            cashFlows: [...prev.cashFlows, { time: 0, amount: 0 }]
        }));
    };

    const handleCashFlowChange = (index: number, field: keyof CashFlow, value: number) => {
        const newCashFlows = [...state.cashFlows];
        newCashFlows[index] = { ...newCashFlows[index], [field]: value };
        setState(prev => ({ ...prev, cashFlows: newCashFlows }));
    };

    const handleAddPortfolioComponent = () => {
        setState(prev => ({
            ...prev,
            portfolioComponents: [...(prev.portfolioComponents || []), { duration: 0, value: 0 }]
        }));
    };

    const handlePortfolioComponentChange = (
        index: number,
        field: keyof PortfolioComponent,
        value: number
    ) => {
        const newComponents = [...(state.portfolioComponents || [])];
        newComponents[index] = { ...newComponents[index], [field]: value };
        setState(prev => ({ ...prev, portfolioComponents: newComponents }));
    };

    const sortCashFlowsByTime = () => {
        setState(prev => ({
            ...prev,
            cashFlows: [...prev.cashFlows].sort((a, b) => a.time - b.time)
        }));
    };

    const importFromBond = () => {
        // Example: Import from a 5-year 6% coupon bond
        const newCashFlows: CashFlow[] = [];
        const faceValue = 1000;
        const couponRate = 0.06;
        const couponPayment = faceValue * couponRate;

        for (let i = 1; i <= 5; i++) {
            newCashFlows.push({
                time: i,
                amount: i === 5 ? couponPayment + faceValue : couponPayment
            });
        }

        setState(prev => ({ ...prev, cashFlows: newCashFlows }));
    };

    const exportResults = () => {
        if (!state.result || !state.durations.macaulayDuration) return;

        const results = {
            cashFlows: state.cashFlows,
            solveFor: state.solveFor,
            result: state.result,
            durations: state.durations
        };

        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'duration-results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {/* Initial section remains the same */}
            <h2 className="text-2xl font-bold mb-4">Duration & Convexity Calculator</h2>
            
            {/* Cash Flow Inputs */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Cash Flows</h3>
                <div className="space-y-2">
                    {state.cashFlows.map((cf, index) => (
                        <div key={index} className="flex space-x-2">
                            <input
                                type="number"
                                value={cf.time}
                                onChange={e => handleCashFlowChange(index, 'time', +e.target.value)}
                                placeholder="Time"
                                className="w-24 px-2 py-1 border rounded"
                                data-testid={`time-input-${index}`}
                            />
                            <input
                                type="number"
                                value={cf.amount}
                                onChange={e => handleCashFlowChange(index, 'amount', +e.target.value)}
                                placeholder="Amount"
                                className="w-32 px-2 py-1 border rounded"
                                data-testid={`amount-input-${index}`}
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddCashFlow}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Cash Flow
                    </button>
                </div>
            </div>

            {/* Solve For Selection */}
            <div className="mb-6">
                <label className="block mb-1 font-semibold">Solve For</label>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setState(prev => ({ ...prev, solveFor: 'price' }))}
                        className={`px-4 py-2 rounded ${
                            state.solveFor === 'price'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        data-testid="price-button"
                    >
                        Price
                    </button>
                    <button
                        onClick={() => setState(prev => ({ ...prev, solveFor: 'yield' }))}
                        className={`px-4 py-2 rounded ${
                            state.solveFor === 'yield'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        data-testid="yield-button"
                    >
                        Yield Rate
                    </button>
                </div>
            </div>

            {/* Rate and Price Inputs */}
            <div className="mb-6 space-y-2">
                <div>
                    <label className="block mb-1">
                        {state.solveFor === 'yield' ? 'Price' : 'Interest Rate (%)'}
                    </label>
                    <input
                        type="number"
                        value={state.solveFor === 'yield' ? (state.price ?? '') : (state.interestRate ?? '')}
                        onChange={e => setState(prev => ({
                            ...prev,
                            [state.solveFor === 'yield' ? 'price' : 'interestRate']: +e.target.value
                        }))}
                        placeholder={state.solveFor === 'yield' ? "Enter price" : "Enter interest rate"}
                        className="w-48 px-2 py-1 border rounded"
                        step="0.0001"
                        data-testid="primary-input"
                    />
                </div>
                {state.solveFor === 'price' && (
                    <div>
                        <label className="block mb-1">Interest Rate (%)</label>
                        <input
                            type="number"
                            value={state.interestRate ?? ''}
                            onChange={e => setState(prev => ({ ...prev, interestRate: +e.target.value }))}
                            placeholder="Enter interest rate"
                            className="w-48 px-2 py-1 border rounded"
                            step="0.0001"
                            data-testid="secondary-input"
                        />
                    </div>
                )}
                {state.solveFor === 'yield' && (
                    <div>
                        <label className="block mb-1">Price</label>
                        <input
                            type="number"
                            value={state.price ?? ''}
                            onChange={e => setState(prev => ({ ...prev, price: +e.target.value }))}
                            placeholder="Enter price"
                            className="w-48 px-2 py-1 border rounded"
                            step="0.01"
                            data-testid="price-input"
                        />
                    </div>
                )}
    
                {/* Formula Reference Section */}
                <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Duration & Convexity Formulas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Duration Formulas</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li>
                                    <FormulaTooltip formulaKey="macaulayDuration">
                                        Macaulay Duration: <InlineMath math="MacD = \frac{\sum_{t=0}^n t \cdot v^t \cdot CF_t}{\sum_{t=0}^n v^t \cdot CF_t}" />
                                    </FormulaTooltip>
                                </li>
                                <li>
                                    <FormulaTooltip formulaKey="modifiedDuration">
                                        Modified Duration: <InlineMath math="ModD = \frac{MacD}{1 + i}" />
                                    </FormulaTooltip>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Convexity Formulas</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                <li>
                                    <FormulaTooltip formulaKey="macaulayConvexity">
                                        Macaulay Convexity: <InlineMath math="MacC = \frac{\sum_{t=0}^n t^2 \cdot v^t \cdot CF_t}{\sum_{t=0}^n v^t \cdot CF_t}" />
                                    </FormulaTooltip>
                                </li>
                                <li>
                                    <FormulaTooltip formulaKey="modifiedConvexity">
                                        Modified Convexity: <InlineMath math="ModC = v^2(MacC + MacD)" />
                                    </FormulaTooltip>
                                </li>
                            </ul>
                        </div>
                    </div>
    
                    <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-1">Price Approximations</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>
                                First-order: <InlineMath math="\Delta P \approx -ModD \cdot P_0 \cdot \Delta i" />
                            </li>
                            <li>
                                Second-order: <InlineMath math="\Delta P \approx -ModD \cdot P_0 \cdot \Delta i + \frac{1}{2} \cdot ModC \cdot P_0 \cdot (\Delta i)^2" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Portfolio Components */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Portfolio Components</h3>
                <div className="space-y-2">
                    {state.portfolioComponents?.map((comp, index) => (
                        <div key={index} className="flex space-x-2">
                            <input
                                type="number"
                                value={comp.duration}
                                onChange={e => handlePortfolioComponentChange(index, 'duration', +e.target.value)}
                                placeholder="Duration"
                                className="w-24 px-2 py-1 border rounded"
                                data-testid={`duration-input-${index}`}
                            />
                            <input
                                type="number"
                                value={comp.value}
                                onChange={e => handlePortfolioComponentChange(index, 'value', +e.target.value)}
                                placeholder="Value"
                                className="w-32 px-2 py-1 border rounded"
                                data-testid={`value-input-${index}`}
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddPortfolioComponent}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Portfolio Component
                    </button>
                </div>
            </div>

            {/* Calculate Button */}
            <button
                onClick={calculateResults}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mb-6"
            >
                Calculate
            </button>

            {/* Results Display */}
            {state.error && (
                <div className="text-red-500 mb-4">{state.error}</div>
            )}

            {(state.result !== null || state.durations.macaulayDuration !== null) && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Results</h3>
                    
                    {state.result !== null && (
                        <div className="mb-4">
                            <p className="text-gray-700">
                                <strong>
                                    {state.solveFor === 'price' ? 'Price: ' : 'Yield: '}
                                </strong>
                                <span className="text-2xl font-bold text-primary-700">
                                    {state.solveFor === 'yield'
                                        ? `${(state.result * 100).toFixed(4)}%`
                                        : state.result.toFixed(4)}
                                </span>
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FormulaTooltip formulaKey="macaulayDuration">
                                <div className="text-sm font-medium">Macaulay Duration</div>
                                <div
                                    className="text-lg text-primary-600"
                                    data-testid="macaulay-duration-result"
                                >
                                    {state.durations.macaulayDuration?.toFixed(4)}
                                </div>
                            </FormulaTooltip>
                        </div>
                        <div>
                            <FormulaTooltip formulaKey="modifiedDuration">
                                <div className="text-sm font-medium">Modified Duration</div>
                                <div className="text-lg text-primary-600">
                                    {state.durations.modifiedDuration?.toFixed(4)}
                                </div>
                            </FormulaTooltip>
                        </div>
                        <div>
                            <FormulaTooltip formulaKey="macaulayConvexity">
                                <div className="text-sm font-medium">Macaulay Convexity</div>
                                <div className="text-lg text-primary-600">
                                    {state.durations.macaulayConvexity?.toFixed(4)}
                                </div>
                            </FormulaTooltip>
                        </div>
                        <div>
                            <FormulaTooltip formulaKey="modifiedConvexity">
                                <div className="text-sm font-medium">Modified Convexity</div>
                                <div className="text-lg text-primary-600">
                                    {state.durations.modifiedConvexity?.toFixed(4)}
                                </div>
                            </FormulaTooltip>
                        </div>
                    </div>
                </div>
            )}

            {/* Visualization Section */}
            {state.cashFlows.length > 0 && state.price !== null && state.interestRate !== null && (
                <DurationVisualization
                    cashFlows={state.cashFlows}
                    originalPrice={state.price}
                    originalRate={state.interestRate}
                />
            )}
        </div>
    );
};

export default DurationCalculator;