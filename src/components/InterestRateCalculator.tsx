import React, { useState, useEffect } from 'react';
import FormulaTooltip from './FormulaTooltip';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { InterestRateCalculatorState, InterestRateType } from '../utils/types';
import {
  convertToEffective,
  convertFromEffective,
  calculateFutureValue,
  calculatePresentValue,
  getStandardCompoundingFrequencies,
  generateEquivalentRates
} from '../utils/interestRateCalculations';

const initialState: InterestRateCalculatorState = {
  sourceRate: null,
  sourceRateType: 'effective',
  sourceCompoundingFrequency: 1,
  sourceCustomFrequency: false,
  sourceCustomFrequencyValue: null,
  targetRateType: 'nominal',
  targetCompoundingFrequency: 12, // Monthly by default
  targetCustomFrequency: false,
  targetCustomFrequencyValue: null,
  showAllEquivalentRates: true,
  initialAmount: 1000,
  timeInYears: 1,
  showTimeValueCalculations: false,
  results: {
    targetRate: null,
    effectiveRate: null,
    nominalRates: [
      { frequency: 1, rate: null },
      { frequency: 2, rate: null },
      { frequency: 4, rate: null },
      { frequency: 12, rate: null },
      { frequency: 52, rate: null },
      { frequency: 365, rate: null }
    ],
    forceOfInterest: null,
    simpleRate: null,
    discountRate: null,
    futureValue: null,
    presentValue: null
  },
  error: null
};

const InterestRateCalculator: React.FC = () => {
  const [state, setState] = useState<InterestRateCalculatorState>(initialState);

  // Reset results when inputs change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      results: {
        ...initialState.results
      },
      error: null
    }));
  }, [
    state.sourceRate,
    state.sourceRateType,
    state.sourceCompoundingFrequency
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setState({
        ...state,
        [name]: value === '' ? null : parseFloat(value)
      });
    } else if (name === 'sourceRateType') {
      // When changing rate type, update the state and handle compounding frequency visibility
      const newRateType = value as InterestRateType;
      const isNominalType = newRateType === 'nominal' || newRateType === 'nominal-simple' || newRateType === 'discount' || newRateType === 'simple';
      setState({
        ...state,
        sourceRateType: newRateType,
        // Reset compounding frequency to 1 if not a nominal type
        sourceCompoundingFrequency: isNominalType ? state.sourceCompoundingFrequency : 1
      });
    } else if (name === 'sourceCompoundingFrequency') {
      const frequencyValue = parseInt(value, 10);
      const isCustom = frequencyValue === -1;
      setState({
        ...state,
        sourceCompoundingFrequency: frequencyValue,
        sourceCustomFrequency: isCustom
      });
    } else if (name === 'targetCompoundingFrequency') {
      const frequencyValue = parseInt(value, 10);
      const isCustom = frequencyValue === -1;
      setState({
        ...state,
        targetCompoundingFrequency: frequencyValue,
        targetCustomFrequency: isCustom
      });
    } else {
      setState({
        ...state,
        [name]: value
      });
    }
  };

  const toggleTimeValueCalculations = () => {
    setState({
      ...state,
      showTimeValueCalculations: !state.showTimeValueCalculations
    });
  };

  const calculateResults = () => {
    try {
      if (state.sourceRate === null) {
        setState({
          ...state,
          error: 'Please enter an interest rate'
        });
        return;
      }

      // Check if custom frequencies are valid
      if (state.sourceCustomFrequency && (state.sourceCustomFrequencyValue === null || state.sourceCustomFrequencyValue <= 0)) {
        setState({
          ...state,
          error: 'Please enter a valid custom source frequency (must be greater than 0)'
        });
        return;
      }

      if (state.targetCustomFrequency && (state.targetCustomFrequencyValue === null || state.targetCustomFrequencyValue <= 0)) {
        setState({
          ...state,
          error: 'Please enter a valid custom target frequency (must be greater than 0)'
        });
        return;
      }

      // Determine actual compounding frequencies to use
      const sourceFrequency = state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null
        ? state.sourceCustomFrequencyValue
        : state.sourceCompoundingFrequency;
      
      const targetFrequency = state.targetCustomFrequency && state.targetCustomFrequencyValue !== null
        ? state.targetCustomFrequencyValue
        : state.targetCompoundingFrequency;

      // First convert source rate to effective rate
      const effectiveRate = convertToEffective(
        state.sourceRate,
        state.sourceRateType,
        sourceFrequency
      );

      // Calculate the specific target rate
      let targetRate = null;
      if (state.targetRateType === 'effective') {
        targetRate = effectiveRate;
      } else {
        targetRate = convertFromEffective(
          effectiveRate,
          state.targetRateType,
          targetFrequency
        );
      }

      // Generate all equivalent rates if needed
      const equivalentRates = generateEquivalentRates(
        state.sourceRate,
        state.sourceRateType,
        sourceFrequency
      );

      // Calculate time value results if needed
      let futureValue = null;
      let presentValue = null;

      if (state.initialAmount !== null && state.timeInYears !== null) {
        futureValue = calculateFutureValue(
          state.initialAmount,
          state.sourceRate,
          state.sourceRateType,
          state.timeInYears,
          sourceFrequency
        );

        presentValue = calculatePresentValue(
          state.initialAmount,
          state.sourceRate,
          state.sourceRateType,
          state.timeInYears,
          sourceFrequency
        );
      }

      // Update state with all results
      setState({
        ...state,
        results: {
          targetRate,
          ...equivalentRates,
          futureValue,
          presentValue
        },
        error: null
      });
    } catch (error) {
      setState({
        ...state,
        error: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const toggleAllEquivalentRates = () => {
    setState({
      ...state,
      showAllEquivalentRates: !state.showAllEquivalentRates
    });
  };

  const getFrequencyName = (frequency: number): string => {
    const frequencies = getStandardCompoundingFrequencies();
    const found = frequencies.find(f => f.value === frequency);
    return found ? found.name : `${frequency} times per year`;
  };

  return (
    <div className="interest-rate-calculator">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This calculator helps you convert between different interest rate types and calculate time value of money.
          Enter your interest rate, select the type, and click "Calculate" to see equivalent rates.
        </p>
        <p className="text-gray-600 mb-4 text-sm italic">
          Uses SOA terminology: e.g., "annual nominal interest rate of 9% convertible quarterly" means a nominal rate of 9% compounded 4 times per year.
        </p>
      </div>
      
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Interest Rate Conversion */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Interest Rate Conversion</h3>
          
          <div className="mb-4">
            <label className="calculator-label">From Interest Rate (%)</label>
            <input
              type="number"
              name="sourceRate"
              value={state.sourceRate === null ? '' : state.sourceRate}
              onChange={handleInputChange}
              className="calculator-input"
              placeholder="e.g., 5"
              step="0.01"
            />
          </div>
          
          <div className="mb-4">
            <label className="calculator-label">From Rate Type</label>
            <select
              name="sourceRateType"
              value={state.sourceRateType}
              onChange={handleInputChange}
              className="calculator-input"
            >
              <option value="effective">Effective Annual</option>
              <option value="nominal">Nominal Annual</option>
              <option value="nominal-simple">Nominal Simple Interest</option>
              <option value="force">Force of Interest (Continuous)</option>
              <option value="simple">Simple Interest</option>
              <option value="discount">Discount Rate</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">
              {state.sourceRateType === 'nominal' ?
                "For nominal rates, you'll need to specify the compounding frequency" :
                state.sourceRateType === 'nominal-simple' ?
                  "Nominal simple interest with specified payment frequency" :
                state.sourceRateType === 'effective' ?
                  "Effective rates account for compounding over the period" :
                state.sourceRateType === 'force' ?
                  "Force of interest is equivalent to continuous compounding" :
                state.sourceRateType === 'simple' ?
                  state.sourceCompoundingFrequency === 1 ?
                    "Simple interest does not involve compounding" :
                    "Nominal simple interest with specified payment frequency" :
                state.sourceRateType === 'discount' ?
                  state.sourceCompoundingFrequency === 1 ?
                    "Effective discount rate is used for present value calculations" :
                    "Nominal discount rate with specified compounding frequency" : ""
              }
            </div>
          </div>
          
          {(state.sourceRateType === 'nominal' || state.sourceRateType === 'nominal-simple' || state.sourceRateType === 'discount' || state.sourceRateType === 'simple') && (
            <>
              <div className="mb-4">
                <label className="calculator-label">
                  From Compounding Frequency
                  <span className="text-xs text-gray-500 ml-1">(select "Custom" for non-standard frequencies)</span>
                </label>
                <select
                  name="sourceCompoundingFrequency"
                  value={state.sourceCompoundingFrequency}
                  onChange={handleInputChange}
                  className="calculator-input"
                >
                  {getStandardCompoundingFrequencies().map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.name} {freq.value > 0 ? `(Convertible ${freq.name.toLowerCase()})` : ''}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  In SOA notation: "convertible {getFrequencyName(state.sourceCompoundingFrequency).toLowerCase()}"
                </div>
                {(state.sourceRateType === 'discount' || state.sourceRateType === 'simple') && (
                  <div className="text-xs text-gray-500 mt-1 font-medium">
                    <strong>Note:</strong> Compounding frequencies other than 1 make effective rates nominal.
                    A frequency of 1 (annual) is treated as an effective discount rate.
                  </div>
                )}
              </div>
              
              {state.sourceCustomFrequency && (
                <div className="mb-4">
                  <label className="calculator-label">
                    Custom Frequency (times per year)
                    <span className="text-xs text-gray-500 ml-1">(e.g., 3 for tri-annual, 6 for bi-monthly)</span>
                  </label>
                  <input
                    type="number"
                    name="sourceCustomFrequencyValue"
                    value={state.sourceCustomFrequencyValue === null ? '' : state.sourceCustomFrequencyValue}
                    onChange={handleInputChange}
                    className="calculator-input"
                    placeholder="Enter any positive number"
                    step="any"
                    min="0.01"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Common exam values: 3 (tri-annual), 6 (bi-monthly), 24 (semi-monthly), 0.5 (bi-annual)
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mb-4">
            <label className="calculator-label">To Rate Type</label>
            <select
              name="targetRateType"
              value={state.targetRateType}
              onChange={handleInputChange}
              className="calculator-input"
            >
              <option value="effective">Effective Annual</option>
              <option value="nominal">Nominal Annual</option>
              <option value="nominal-simple">Nominal Simple Interest</option>
              <option value="force">Force of Interest (Continuous)</option>
              <option value="simple">Simple Interest</option>
              <option value="discount">Discount Rate</option>
            </select>
            <div className="text-xs text-gray-500 mt-1">
              {state.targetRateType === 'nominal' ?
                "For nominal rates, you'll need to specify the compounding frequency" :
                state.targetRateType === 'nominal-simple' ?
                  "Nominal simple interest with specified payment frequency" :
                state.targetRateType === 'effective' ?
                  "Effective rates account for compounding over the period" :
                state.targetRateType === 'force' ?
                  "Force of interest is equivalent to continuous compounding" :
                state.targetRateType === 'simple' ?
                  state.targetCompoundingFrequency === 1 ?
                    "Simple interest does not involve compounding" :
                    "Nominal simple interest with specified payment frequency" :
                state.targetRateType === 'discount' ?
                  state.targetCompoundingFrequency === 1 ?
                    "Effective discount rate is used for present value calculations" :
                    "Nominal discount rate with specified compounding frequency" : ""
              }
            </div>
          </div>
          
          {(state.targetRateType === 'nominal' || state.targetRateType === 'nominal-simple' || state.targetRateType === 'discount' || state.targetRateType === 'simple') && (
            <>
              <div className="mb-4">
                <label className="calculator-label">
                  To Compounding Frequency
                  <span className="text-xs text-gray-500 ml-1">(select "Custom" for non-standard frequencies)</span>
                </label>
                <select
                  name="targetCompoundingFrequency"
                  value={state.targetCompoundingFrequency}
                  onChange={handleInputChange}
                  className="calculator-input"
                >
                  {getStandardCompoundingFrequencies().map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.name} {freq.value > 0 ? `(Convertible ${freq.name.toLowerCase()})` : ''}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  In SOA notation: "convertible {getFrequencyName(state.targetCompoundingFrequency).toLowerCase()}"
                </div>
                {(state.targetRateType === 'discount' || state.targetRateType === 'simple') && (
                  <div className="text-xs text-gray-500 mt-1 font-medium">
                    <strong>Note:</strong> Compounding frequencies other than 1 make effective rates nominal.
                    A frequency of 1 (annual) is treated as an effective discount rate.
                  </div>
                )}
              </div>
              
              {state.targetCustomFrequency && (
                <div className="mb-4">
                  <label className="calculator-label">
                    Custom Frequency (times per year)
                    <span className="text-xs text-gray-500 ml-1">(e.g., 3 for tri-annual, 6 for bi-monthly)</span>
                  </label>
                  <input
                    type="number"
                    name="targetCustomFrequencyValue"
                    value={state.targetCustomFrequencyValue === null ? '' : state.targetCustomFrequencyValue}
                    onChange={handleInputChange}
                    className="calculator-input"
                    placeholder="Enter any positive number"
                    step="any"
                    min="0.01"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Common exam values: 3 (tri-annual), 6 (bi-monthly), 24 (semi-monthly), 0.5 (bi-annual)
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="mt-6">
            <button
              onClick={calculateResults}
              className="calculator-button"
            >
              Calculate
            </button>
          </div>
          
          <div className="mt-4 flex space-x-4">
            <button
              onClick={toggleAllEquivalentRates}
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              {state.showAllEquivalentRates
                ? 'Hide All Equivalent Rates'
                : 'Show All Equivalent Rates'}
            </button>
            
            <button
              onClick={toggleTimeValueCalculations}
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              {state.showTimeValueCalculations
                ? 'Hide Time Value Calculations'
                : 'Show Time Value Calculations'}
            </button>
          </div>
        </div>
        
        {/* Right column - Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Conversion Result</h3>
          
          {state.results.targetRate !== null ? (
            <div className="space-y-4">
              {/* Primary conversion result */}
              <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                <div className="text-sm text-gray-600">
                  {state.sourceRate}% {
                    state.sourceRateType === 'nominal' ?
                      state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null ?
                        `annual nominal convertible ${state.sourceCustomFrequencyValue} times per year (i` :
                        `annual nominal convertible ${getFrequencyName(state.sourceCompoundingFrequency).toLowerCase()} (` :
                    state.sourceRateType === 'nominal-simple' ?
                      state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null ?
                        `annual nominal simple interest payable ${state.sourceCustomFrequencyValue} times per year` :
                        `annual nominal simple interest payable ${getFrequencyName(state.sourceCompoundingFrequency).toLowerCase()}` :
                    state.sourceRateType === 'effective' ? 'effective annual (i)' :
                    state.sourceRateType === 'force' ? 'force of interest (δ)' :
                    state.sourceRateType === 'discount' ?
                      state.sourceCompoundingFrequency === 1 ?
                        'annual discount (d)' :
                        state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null ?
                          `annual nominal discount convertible ${state.sourceCustomFrequencyValue} times per year (d` :
                          `annual nominal discount convertible ${getFrequencyName(state.sourceCompoundingFrequency).toLowerCase()} (d` :
                    state.sourceRateType === 'simple' ?
                      state.sourceCompoundingFrequency === 1 ?
                        'simple interest' :
                        state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null ?
                          `annual nominal simple interest payable ${state.sourceCustomFrequencyValue} times per year` :
                          `annual nominal simple interest payable ${getFrequencyName(state.sourceCompoundingFrequency).toLowerCase()}` :
                    state.sourceRateType
                  }
                  {state.sourceRateType === 'nominal' && (
                    <>
                      <sup>
                        {state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null ?
                          `(${state.sourceCustomFrequencyValue})` :
                          `(${state.sourceCompoundingFrequency})`
                        }
                      </sup>
                      )
                    </>
                  )}
                  {state.sourceRateType === 'discount' && state.sourceCompoundingFrequency !== 1 && (
                    <>
                      <sup>
                        {state.sourceCustomFrequency && state.sourceCustomFrequencyValue !== null ?
                          `(${state.sourceCustomFrequencyValue})` :
                          `(${state.sourceCompoundingFrequency})`
                        }
                      </sup>
                      )
                    </>
                  )}
                  {' equals:'}
                </div>
                <div className="text-2xl font-bold text-primary-700 mt-1">
                  {state.results.targetRate.toFixed(4)}% {
                    state.targetRateType === 'nominal' ?
                      state.targetCustomFrequency && state.targetCustomFrequencyValue !== null ?
                        `annual nominal convertible ${state.targetCustomFrequencyValue} times per year (i` :
                        `annual nominal convertible ${getFrequencyName(state.targetCompoundingFrequency).toLowerCase()} (i` :
                    state.targetRateType === 'nominal-simple' ?
                      state.targetCustomFrequency && state.targetCustomFrequencyValue !== null ?
                        `annual nominal simple interest payable ${state.targetCustomFrequencyValue} times per year` :
                        `annual nominal simple interest payable ${getFrequencyName(state.targetCompoundingFrequency).toLowerCase()}` :
                    state.targetRateType === 'effective' ? 'effective annual (i)' :
                    state.targetRateType === 'force' ? 'force of interest (δ)' :
                    state.targetRateType === 'discount' ?
                      state.targetCompoundingFrequency === 1 ?
                        'annual discount (d)' :
                        state.targetCustomFrequency && state.targetCustomFrequencyValue !== null ?
                          `annual nominal discount convertible ${state.targetCustomFrequencyValue} times per year (d` :
                          `annual nominal discount convertible ${getFrequencyName(state.targetCompoundingFrequency).toLowerCase()} (d` :
                    state.targetRateType === 'simple' ?
                      state.targetCompoundingFrequency === 1 ?
                        'simple interest' :
                        state.targetCustomFrequency && state.targetCustomFrequencyValue !== null ?
                          `annual nominal simple interest payable ${state.targetCustomFrequencyValue} times per year` :
                          `annual nominal simple interest payable ${getFrequencyName(state.targetCompoundingFrequency).toLowerCase()}` :
                    state.targetRateType
                  }
                  {state.targetRateType === 'nominal' && (
                    <>
                      <sup>
                        {state.targetCustomFrequency && state.targetCustomFrequencyValue !== null ?
                          `(${state.targetCustomFrequencyValue})` :
                          `(${state.targetCompoundingFrequency})`
                        }
                      </sup>
                      )
                    </>
                  )}
                  {state.targetRateType === 'discount' && state.targetCompoundingFrequency !== 1 && (
                    <>
                      <sup>
                        {state.targetCustomFrequency && state.targetCustomFrequencyValue !== null ?
                          `(${state.targetCustomFrequencyValue})` :
                          `(${state.targetCompoundingFrequency})`
                        }
                      </sup>
                      )
                    </>
                  )}
                </div>
              </div>
              
              {/* All equivalent rates (optional) */}
              {state.showAllEquivalentRates && (
                <>
                  <div className="text-md font-medium text-gray-700 mt-4">All Equivalent Rates:</div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-600">Effective Annual Rate</div>
                    <div className="text-lg font-bold text-primary-700">
                      {state.results.effectiveRate !== null ? <span dangerouslySetInnerHTML={{ __html: `${state.results.effectiveRate.toFixed(4)}% (i)` }} /> : '-'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      The annual rate that accounts for compounding
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-600">Nominal Annual Rates</div>
                    <div className="text-xs text-gray-500 mt-1 mb-2">
                      Annual rates with different compounding frequencies
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {state.results.nominalRates.map(item => {
                        const freq = getStandardCompoundingFrequencies().find(f => f.value === item.frequency);
                        return (
                          <div key={item.frequency} className="text-sm">
                            <span className="font-medium">Convertible {getFrequencyName(item.frequency).toLowerCase()}:</span>{' '}
                            {item.rate !== null ? (
                              <span>
                                {item.rate.toFixed(4)}% ({freq ? <span dangerouslySetInnerHTML={{ __html: freq.htmlNotation }} /> : <span>i<sup>({item.frequency})</sup></span>})
                              </span>
                            ) : '-'}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-600">Force of Interest</div>
                      <div className="text-lg font-bold text-primary-700">
                        {state.results.forceOfInterest !== null ? <span dangerouslySetInnerHTML={{ __html: `${state.results.forceOfInterest.toFixed(4)}% (δ)` }} /> : '-'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Continuous compounding rate
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-md">
                      <div className="text-sm text-gray-600">Annual Discount Rate</div>
                      <div className="text-lg font-bold text-primary-700">
                        {state.results.discountRate !== null ? <span dangerouslySetInnerHTML={{ __html: `${state.results.discountRate.toFixed(4)}% (d)` }} /> : '-'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Rate of discount per time period
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {state.showTimeValueCalculations && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-800 mb-2">Time Value Calculations</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="mb-4">
                      <label className="calculator-label">Initial Amount</label>
                      <input
                        type="number"
                        name="initialAmount"
                        value={state.initialAmount === null ? '' : state.initialAmount}
                        onChange={handleInputChange}
                        className="calculator-input"
                        placeholder="e.g., 1000"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="calculator-label">Time (years)</label>
                      <input
                        type="number"
                        name="timeInYears"
                        value={state.timeInYears === null ? '' : state.timeInYears}
                        onChange={handleInputChange}
                        className="calculator-input"
                        placeholder="e.g., 5"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  {state.results.futureValue !== null && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 rounded-md">
                        <div className="text-sm text-gray-600">Future Value</div>
                        <div className="text-lg font-bold text-primary-700">
                          ${state.results.futureValue.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-md">
                        <div className="text-sm text-gray-600">Present Value</div>
                        <div className="text-lg font-bold text-primary-700">
                          ${state.results.presentValue !== null ? state.results.presentValue.toFixed(2) : '-'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              Enter an interest rate and click "Calculate" to see equivalent rates.
            </div>
          )}
        </div>
      </div>
      
      {/* Formula reference section */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Interest Rate Formulas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Rate Conversions</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>
                <FormulaTooltip formulaKey="effectiveRate">
                  <InlineMath math="i = \left(1 + \frac{i^{(m)}}{m}\right)^m - 1" />
                </FormulaTooltip>
              </li>
              <li>
                <FormulaTooltip formulaKey="forceOfInterest">
                  <InlineMath math="\delta = \ln(1 + i)" />
                </FormulaTooltip>
              </li>
              <li>
                <FormulaTooltip formulaKey="discountRate">
                  <InlineMath math="d = \frac{i}{1 + i}" />
                </FormulaTooltip>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Time Value Formulas</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>
                <FormulaTooltip formulaKey="accumulationFunction">
                  <InlineMath math="a(t) = (1 + i)^t" />
                </FormulaTooltip>
              </li>
              <li>
                <FormulaTooltip formulaKey="simpleInterest">
                  <InlineMath math="a(t) = 1 + i \cdot t" />
                </FormulaTooltip>
              </li>
              <li>
                <FormulaTooltip formulaKey="allInOneRelationship">
                  <InlineMath math="(1 + i)^t = \left(\frac{1}{1-d}\right)^t = e^{\delta t}" />
                </FormulaTooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestRateCalculator;