import React, { useState, useEffect } from 'react';
import FormulaTooltip from './FormulaTooltip';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import {
  PerpetuityCalculatorState,
  PerpetuityType,
  PerpetuityPartType,
  PerpetuityPaymentType
} from '../utils/types';
import {
  calculatePresentValueBasicPerpetuity,
  calculatePresentValueGrowingPerpetuity,
  calculatePaymentBasicPerpetuity,
  calculatePaymentGrowingPerpetuity,
  calculateGrowthRate,
  calculateInterestRate
} from '../utils/perpetuityCalculations';

const initialState: PerpetuityCalculatorState = {
  perpetuityType: 'basic',
  paymentType: 'immediate',
  solveFor: 'presentValue',
  payment: null,
  presentValue: null,
  interestRate: null,
  interestRateType: 'effective',
  compoundingFrequency: 1,
  growthRate: null,
  deferredPeriods: null,
  result: null,
  error: null
};

const PerpetuityCalculator: React.FC = () => {
  const [state, setState] = useState<PerpetuityCalculatorState>(initialState);

  // Reset result when inputs change
  useEffect(() => {
    setState(prev => ({
      ...prev,
      result: null,
      error: null
    }));
  }, [
    state.perpetuityType,
    state.paymentType,
    state.solveFor,
    state.payment,
    state.presentValue,
    state.interestRate,
    state.interestRateType,
    state.compoundingFrequency,
    state.growthRate,
    state.deferredPeriods
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (name === 'solveFor' || name === 'perpetuityType' || name === 'paymentType' || name === 'interestRateType') {
      setState({
        ...state,
        [name]: value
      });
    } else if (type === 'number') {
      setState({
        ...state,
        [name]: value === '' ? null : parseFloat(value)
      });
    } else {
      setState({
        ...state,
        [name]: value
      });
    }
  };

  const validateInputs = (): boolean => {
    const {
      solveFor,
      perpetuityType,
      payment,
      presentValue,
      interestRate,
      growthRate
    } = state;

    let missingFields: string[] = [];

    switch (solveFor) {
      case 'presentValue':
        if (payment === null) missingFields.push('Payment Amount');
        if (interestRate === null) missingFields.push('Interest Rate');
        if (perpetuityType === 'growing' && growthRate === null) missingFields.push('Growth Rate');
        break;

      case 'payment':
        if (presentValue === null) missingFields.push('Present Value');
        if (interestRate === null) missingFields.push('Interest Rate');
        if (perpetuityType === 'growing' && growthRate === null) missingFields.push('Growth Rate');
        break;
case 'interestRate':
  if (payment === null) missingFields.push('Payment Amount');
  if (presentValue === null) missingFields.push('Present Value');
  if (perpetuityType === 'growing' && growthRate === null) missingFields.push('Growth Rate');
  break;

case 'growthRate':
  if (payment === null) missingFields.push('Payment Amount');
  if (presentValue === null) missingFields.push('Present Value');
  if (interestRate === null) missingFields.push('Interest Rate');
  break;
}

    if (missingFields.length > 0) {
      setState(prev => ({
        ...prev,
        error: `Please provide values for: ${missingFields.join(', ')}`
      }));
      return false;
    }

    return true;
  };

  const calculateResult = () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const {
        solveFor,
        perpetuityType,
        payment,
        presentValue,
        interestRate,
        interestRateType,
        compoundingFrequency,
        growthRate
      } = state;

      let result: number | null = null;

      switch (solveFor) {
        case 'presentValue':
          if (payment !== null && interestRate !== null) {
            if (perpetuityType === 'basic') {
              result = calculatePresentValueBasicPerpetuity(
                payment,
                interestRate,
                interestRateType,
                compoundingFrequency,
                state.paymentType,
                state.deferredPeriods || 0
              );
            } else if (perpetuityType === 'growing' && growthRate !== null) {
              result = calculatePresentValueGrowingPerpetuity(
                payment,
                interestRate,
                growthRate,
                interestRateType,
                compoundingFrequency,
                state.paymentType,
                state.deferredPeriods || 0
              );
            }
          }
          break;

        case 'payment':
          if (presentValue !== null && interestRate !== null) {
            if (perpetuityType === 'basic') {
              result = calculatePaymentBasicPerpetuity(
                presentValue,
                interestRate,
                interestRateType,
                compoundingFrequency,
                state.paymentType,
                state.deferredPeriods || 0
              );
            } else if (perpetuityType === 'growing' && growthRate !== null) {
              result = calculatePaymentGrowingPerpetuity(
                presentValue,
                interestRate,
                growthRate,
                interestRateType,
                compoundingFrequency,
                state.paymentType,
                state.deferredPeriods || 0
              );
            }
          }
          break;

        case 'interestRate':
          if (payment !== null && presentValue !== null) {
            result = calculateInterestRate(
              presentValue,
              payment,
              interestRateType,
              compoundingFrequency,
              state.paymentType,
              state.deferredPeriods || 0,
              perpetuityType === 'growing' ? growthRate : null
            );
          }
          break;

        case 'growthRate':
          if (payment !== null && presentValue !== null && interestRate !== null) {
            result = calculateGrowthRate(
              presentValue,
              payment,
              interestRate,
              interestRateType,
              compoundingFrequency,
              state.paymentType,
              state.deferredPeriods || 0
            );
          }
          break;
      }

      if (result !== null) {
        const updatedState = {
          ...state,
          result,
          error: null
        };

        // Update the corresponding input field
        switch (solveFor) {
          case 'payment':
            updatedState.payment = Number(result.toFixed(2));
            break;
          case 'presentValue':
            updatedState.presentValue = Number(result.toFixed(2));
            break;
          case 'interestRate':
            updatedState.interestRate = Number(result.toFixed(4));
            break;
          case 'growthRate':
            updatedState.growthRate = Number(result.toFixed(4));
            break;
        }

        setState(updatedState);
      } else {
        setState(prev => ({
          ...prev,
          error: 'Could not calculate result with the provided inputs'
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  return (
    <div className="perpetuity-calculator">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This calculator helps you solve for different variables in perpetuity calculations.
          Select what you want to solve for, enter the known values, and click "Calculate".
        </p>
      </div>

      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <div className="mb-4">
            <label className="calculator-label">Solve For</label>
            <select
              name="solveFor"
              value={state.solveFor}
              onChange={handleInputChange}
              className="calculator-input"
            >
              <option value="presentValue">Present Value</option>
              <option value="payment">Payment Amount</option>
              <option value="interestRate">Interest Rate</option>
              {state.perpetuityType === 'growing' && (
                <option value="growthRate">Growth Rate</option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="calculator-label">Perpetuity Type</label>
            <select
              name="perpetuityType"
              value={state.perpetuityType}
              onChange={handleInputChange}
              className="calculator-input"
            >
              <option value="basic">Basic Perpetuity</option>
              <option value="growing">Growing Perpetuity</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="calculator-label">Payment Type</label>
            <select
              name="paymentType"
              value={state.paymentType}
              onChange={handleInputChange}
              className="calculator-input"
            >
              <option value="immediate">End of Period (Immediate)</option>
              <option value="due">Beginning of Period (Due)</option>
              <option value="continuous">Continuous</option>
            </select>
            <div className="mt-1 text-sm text-gray-500">
              When payments are made during each period
            </div>
          </div>

          <div className="mb-4">
            <label className="calculator-label">Deferred Periods</label>
            <input
              type="number"
              name="deferredPeriods"
              value={state.deferredPeriods === null ? '' : state.deferredPeriods}
              onChange={handleInputChange}
              className="calculator-input"
              placeholder="e.g., 5"
              min="0"
              step="1"
            />
            <div className="mt-1 text-sm text-gray-500">
              Number of periods before payments begin (0 for immediate start)
            </div>
          </div>

          <div className="mb-4">
            <label className="calculator-label">
              Payment Amount
              {state.solveFor === 'payment' && (
                <span className="text-primary-600 ml-2">(To be calculated)</span>
              )}
            </label>
            <input
              type="number"
              name="payment"
              value={state.payment === null ? '' : state.payment}
              onChange={handleInputChange}
              className={`calculator-input ${state.solveFor === 'payment' ? 'bg-gray-100' : ''}`}
              placeholder={state.solveFor === 'payment' ? 'Will be calculated' : 'e.g., 1000'}
              disabled={state.solveFor === 'payment'}
            />
          </div>

        </div>

        {/* Right column */}
        <div>
          <div className="mb-4">
            <label className="calculator-label">
              Interest Rate (%)
              {state.solveFor === 'interestRate' && (
                <span className="text-primary-600 ml-2">(To be calculated)</span>
              )}
            </label>
            <input
              type="number"
              name="interestRate"
              value={state.interestRate === null ? '' : state.interestRate}
              onChange={handleInputChange}
              className={`calculator-input ${state.solveFor === 'interestRate' ? 'bg-gray-100' : ''}`}
              placeholder={state.solveFor === 'interestRate' ? 'Will be calculated' : 'e.g., 5'}
              disabled={state.solveFor === 'interestRate'}
              step="0.01"
            />

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <label className="calculator-label">Rate Type</label>
                <select
                  name="interestRateType"
                  value={state.interestRateType}
                  onChange={handleInputChange}
                  className="calculator-input"
                >
                  <option value="effective">Effective (i)</option>
                  <option value="nominal">Nominal (i^(m))</option>
                  <option value="force">Force of Interest (δ)</option>
                  <option value="discount">Discount Rate (d)</option>
                </select>
              </div>

              {state.interestRateType === 'nominal' && (
                <div>
                  <label className="calculator-label">Compounding</label>
                  <select
                    name="compoundingFrequency"
                    value={state.compoundingFrequency}
                    onChange={handleInputChange}
                    className="calculator-input"
                  >
                    <option value="1">Annual (i)</option>
                    <option value="2">Semi-annual (i^(2))</option>
                    <option value="4">Quarterly (i^(4))</option>
                    <option value="12">Monthly (i^(12))</option>
                    <option value="365">Daily (i^(365))</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {state.perpetuityType === 'growing' && (
            <div className="mb-4">
              <label className="calculator-label">
                Growth Rate (%)
                {state.solveFor === 'growthRate' && (
                  <span className="text-primary-600 ml-2">(To be calculated)</span>
                )}
              </label>
              <input
                type="number"
                name="growthRate"
                value={state.growthRate === null ? '' : state.growthRate}
                onChange={handleInputChange}
                className={`calculator-input ${state.solveFor === 'growthRate' ? 'bg-gray-100' : ''}`}
                placeholder={state.solveFor === 'growthRate' ? 'Will be calculated' : 'e.g., 3'}
                step="0.01"
                disabled={state.solveFor === 'growthRate'}
              />
              <div className="mt-1 text-sm text-gray-500">
                Must be less than interest rate
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="calculator-label">
              Present Value
              {state.solveFor === 'presentValue' && (
                <span className="text-primary-600 ml-2">(To be calculated)</span>
              )}
            </label>
            <input
              type="number"
              name="presentValue"
              value={state.presentValue === null ? '' : state.presentValue}
              onChange={handleInputChange}
              className={`calculator-input ${state.solveFor === 'presentValue' ? 'bg-gray-100' : ''}`}
              placeholder={state.solveFor === 'presentValue' ? 'Will be calculated' : 'e.g., 20000'}
              disabled={state.solveFor === 'presentValue'}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button onClick={calculateResult} className="calculator-button">
          Calculate
        </button>
      </div>

      {state.result !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Result</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700">
                <strong>
                  {state.solveFor === 'payment' ? 'Payment Amount' :
                   state.solveFor === 'presentValue' ? 'Present Value' :
                   state.solveFor === 'interestRate' ? 'Interest Rate' :
                   'Growth Rate'}:
               </strong>
             </p>
             <p className="text-2xl font-bold text-primary-700">
               {state.solveFor === 'growthRate' || state.solveFor === 'interestRate'
                 ? `${state.result.toFixed(4)}%`
                 : state.result.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-gray-700">
                <strong>Formula Used:</strong>
              </p>
              <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {/* Basic Perpetuity Formulas */}
                {state.perpetuityType === 'basic' ? (
                  <>
                    {state.solveFor === 'presentValue' && (
                      <>
                        {state.deferredPeriods && state.deferredPeriods > 0 ? (
                          // Deferred perpetuity
                          <InlineMath math={`PV = ${
                            state.paymentType === 'due' ? '\\ddot{a}_{\\overline{\\infty}|}' :
                            state.paymentType === 'continuous' ? '\\overline{a}_{\\overline{\\infty}|}' : 
                            'a_{\\overline{\\infty}|}'
                          } \\cdot v^{${state.deferredPeriods}} = ${
                            state.paymentType === 'due' ? '\\frac{1}{d}' :
                            state.paymentType === 'continuous' ? '\\frac{\\delta}{i \\cdot \\delta}' : 
                            '\\frac{1}{i}'
                          } \\cdot v^{${state.deferredPeriods}}`} />
                        ) : (
                          // Immediate perpetuity
                          <InlineMath math={`PV = ${
                            state.paymentType === 'due' ? '\\ddot{a}_{\\overline{\\infty}|} = \\frac{1}{d} = \\frac{1+i}{i}' :
                            state.paymentType === 'continuous' ? '\\overline{a}_{\\overline{\\infty}|} = \\frac{1}{\\delta}' : 
                            'a_{\\overline{\\infty}|} = \\frac{1}{i}'
                          }`} />
                        )}
                      </>
                    )}
                    {state.solveFor === 'payment' && (
                      <>
                        {state.deferredPeriods && state.deferredPeriods > 0 ? (
                          <InlineMath math={`PMT = \\frac{PV}{${
                            state.paymentType === 'due' ? '\\ddot{a}_{\\overline{\\infty}|}' :
                            state.paymentType === 'continuous' ? '\\overline{a}_{\\overline{\\infty}|}' : 
                            'a_{\\overline{\\infty}|}'
                          } \\cdot v^{${state.deferredPeriods}}} = PV \\cdot ${
                            state.paymentType === 'due' ? 'd' :
                            state.paymentType === 'continuous' ? '\\delta' : 
                            'i'
                          } \\cdot (1+i)^{${state.deferredPeriods}}`} />
                        ) : (
                          <InlineMath math={`PMT = \\frac{PV}{${
                            state.paymentType === 'due' ? '\\ddot{a}_{\\overline{\\infty}|}' :
                            state.paymentType === 'continuous' ? '\\overline{a}_{\\overline{\\infty}|}' : 
                            'a_{\\overline{\\infty}|}'
                          }} = PV \\cdot ${
                            state.paymentType === 'due' ? 'd' :
                            state.paymentType === 'continuous' ? '\\delta' : 
                            'i'
                          }`} />
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Growing Perpetuity Formulas */}
                    {state.solveFor === 'presentValue' && (
                      <>
                        {state.deferredPeriods && state.deferredPeriods > 0 ? (
                          <InlineMath math={`PV = \\frac{PMT}{i-g}${
                            state.paymentType === 'due' ? ' \\cdot (1+i)' :
                            state.paymentType === 'continuous' ? ' \\cdot e^{\\delta/2}' : ''
                          } \\cdot v^{${state.deferredPeriods}}`} />
                        ) : (
                          <InlineMath math={`PV = \\frac{PMT}{i-g}${
                            state.paymentType === 'due' ? ' \\cdot (1+i)' :
                            state.paymentType === 'continuous' ? ' \\cdot e^{\\delta/2}' : ''
                          }`} />
                        )}
                      </>
                    )}
                    {state.solveFor === 'payment' && (
                      <>
                        {state.deferredPeriods && state.deferredPeriods > 0 ? (
                          <InlineMath math={`PMT = \\frac{PV \\cdot (i-g)}{${
                            state.paymentType === 'due' ? '(1+i)' :
                            state.paymentType === 'continuous' ? 'e^{\\delta/2}' : '1'
                          }} \\cdot (1+i)^{${state.deferredPeriods}}`} />
                        ) : (
                          <InlineMath math={`PMT = \\frac{PV \\cdot (i-g)}{${
                            state.paymentType === 'due' ? '(1+i)' :
                            state.paymentType === 'continuous' ? 'e^{\\delta/2}' : '1'
                          }}`} />
                        )}
                      </>
                    )}
                    {state.solveFor === 'interestRate' && (
                      <InlineMath math={`i = \\text{Solution of } PV = \\frac{PMT${
                        state.paymentType === 'due' ? '(1+i)' :
                        state.paymentType === 'continuous' ? 'e^{\\delta/2}' : ''
                      }}{i-g}${
                        state.deferredPeriods && state.deferredPeriods > 0 ?
                        ` \\cdot v^{${state.deferredPeriods}}` : ''}`} />
                    )}
                    {state.solveFor === 'growthRate' && (
                      <InlineMath math={`g = i - \\frac{PMT${
                        state.paymentType === 'due' ? '(1+i)' :
                        state.paymentType === 'continuous' ? 'e^{\\delta/2}' : ''
                      }}{PV${state.deferredPeriods && state.deferredPeriods > 0 ? ` \\cdot (1+i)^{${state.deferredPeriods}}` : ''}}`} />
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Perpetuity Formulas</h3>
        <div>
            <h4 className="font-medium text-gray-700 mb-1">Basic Perpetuity</h4>
            <div className="space-y-2">
              <div>
                <h5 className="text-sm font-medium text-gray-600">End-of-Period (Immediate)</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><InlineMath math="a_{\overline{\infty}|} = \frac{1}{i}" /></li>
                  <li><InlineMath math="{}_{m|}a_{\overline{\infty}|} = \frac{1}{i} \cdot v^m" /></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-600">Beginning-of-Period (Due)</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><InlineMath math="\ddot{a}_{\overline{\infty}|} = \frac{1}{d} = \frac{1+i}{i}" /></li>
                  <li><InlineMath math="{}_{m|}\ddot{a}_{\overline{\infty}|} = \frac{1+i}{i} \cdot v^m" /></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-600">Continuous Payments</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><InlineMath math="\overline{a}_{\overline{\infty}|} = \frac{1}{\delta}" /></li>
                  <li><InlineMath math="{}_{m|}\overline{a}_{\overline{\infty}|} = \frac{1}{\delta} \cdot v^m" /></li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-1">Growing Perpetuity</h4>
            <div className="space-y-2">
              <div>
                <h5 className="text-sm font-medium text-gray-600">End-of-Period (Immediate)</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><InlineMath math="\frac{1}{i-r}" /></li>
                  <li><InlineMath math="\frac{1}{i-r} \cdot v^m" /></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-600">Beginning-of-Period (Due)</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><InlineMath math="\frac{1+i}{i-r}" /></li>
                  <li><InlineMath math="\frac{1+i}{i-r} \cdot v^m" /></li>
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-600">Continuous Payments</h5>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  <li><InlineMath math="\frac{1}{i-r} \cdot e^{\delta/2}" /></li>
                  <li><InlineMath math="\frac{1}{i-r} \cdot e^{\delta/2} \cdot v^m" /></li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 mt-2">where r = growth rate (must be less than i)</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default PerpetuityCalculator;