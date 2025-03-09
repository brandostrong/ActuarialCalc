import React, { useState } from 'react';
import { BondCalculatorState, BondType } from '../utils/types';
import BondVisualization from './BondVisualization';
import {
  calculateBondPrice,
  calculateCallableBondPrice,
  getBondPriceType,
  generateBondAmortizationSchedule
} from '../utils/bondCalculations';

const initialState: BondCalculatorState = {
  bondType: 'regular',
  faceValue: 1000,
  couponRate: 6,
  redemptionValue: 1000,
  yieldRate: 5,
  periods: 10,
  frequency: 1,
  callDates: undefined,
  callPrices: undefined,
  priceType: null,
  result: null,
  amortizationSchedule: null,
  error: null
};

const BondCalculator: React.FC = () => {
  const [state, setState] = useState<BondCalculatorState>(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      [name]: value === '' ? null : Number(value),
      result: null, // Clear result when inputs change
      error: null   // Clear errors when inputs change
    }));
  };

  const handleBondTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bondType = e.target.value as BondType;
    setState(prev => ({
      ...prev,
      bondType,
      callDates: bondType === 'callable' ? [] : undefined,
      callPrices: bondType === 'callable' ? [] : undefined,
      result: null,
      error: null
    }));
  };

  const handleAddCallDate = () => {
    if (!state.callDates || !state.callPrices) return;
    setState(prev => ({
      ...prev,
      callDates: [...(prev.callDates || []), 0],
      callPrices: [...(prev.callPrices || []), prev.redemptionValue || 0]
    }));
  };

  const handleCallDateChange = (index: number, value: number) => {
    if (!state.callDates) return;
    const newCallDates = [...state.callDates];
    newCallDates[index] = value;
    setState(prev => ({
      ...prev,
      callDates: newCallDates,
      result: null,
      error: null
    }));
  };

  const handleCallPriceChange = (index: number, value: number) => {
    if (!state.callPrices) return;
    const newCallPrices = [...state.callPrices];
    newCallPrices[index] = value;
    setState(prev => ({
      ...prev,
      callPrices: newCallPrices,
      result: null,
      error: null
    }));
  };

  const handleCalculate = () => {
    try {
      if (!state.faceValue || !state.couponRate || !state.redemptionValue || !state.yieldRate || !state.periods) {
        throw new Error('Please fill in all required fields');
      }

      let price: number;
      if (state.bondType === 'callable' && state.callDates && state.callPrices) {
        price = calculateCallableBondPrice(
          state.faceValue,
          state.couponRate,
          state.yieldRate,
          state.callDates,
          state.callPrices
        );
      } else {
        price = calculateBondPrice(
          state.faceValue,
          state.couponRate,
          state.redemptionValue,
          state.yieldRate,
          state.periods
        );
      }

      // Generate amortization schedule
      const schedule = generateBondAmortizationSchedule(
        state.faceValue,
        state.couponRate,
        state.redemptionValue,
        state.yieldRate,
        state.periods
      );

      // Determine if bond is at premium, discount, or par
      const priceType = getBondPriceType(
        price,
        state.redemptionValue,
        state.faceValue * (state.couponRate / 100),
        state.yieldRate
      );

      setState(prev => ({
        ...prev,
        result: price,
        priceType,
        amortizationSchedule: schedule,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        result: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
    }
  };

  const handleReset = () => {
    setState(initialState);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Bond Calculator</h2>
      
      {/* Bond Type Selection */}
      <div className="mb-4">
        <label htmlFor="bondType" className="block text-sm font-medium mb-1">Bond Type</label>
        <select
          id="bondType"
          name="bondType"
          value={state.bondType}
          onChange={handleBondTypeChange}
          className="w-full p-2 border rounded"
        >
          <option value="regular">Regular Bond</option>
          <option value="callable">Callable Bond</option>
        </select>
      </div>

      {/* Main Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="faceValue" className="block text-sm font-medium mb-1">Face Value ($)</label>
          <input
            id="faceValue"
            type="number"
            name="faceValue"
            value={state.faceValue || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="couponRate" className="block text-sm font-medium mb-1">Coupon Rate (%)</label>
          <input
            id="couponRate"
            type="number"
            name="couponRate"
            value={state.couponRate || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="redemptionValue" className="block text-sm font-medium mb-1">Redemption Value ($)</label>
          <input
            id="redemptionValue"
            type="number"
            name="redemptionValue"
            value={state.redemptionValue || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="yieldRate" className="block text-sm font-medium mb-1">Yield Rate (%)</label>
          <input
            id="yieldRate"
            type="number"
            name="yieldRate"
            value={state.yieldRate || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="periods" className="block text-sm font-medium mb-1">Number of Periods</label>
          <input
            id="periods"
            type="number"
            name="periods"
            value={state.periods || ''}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Call Dates and Prices for Callable Bonds */}
      {state.bondType === 'callable' && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Call Schedule</h3>
          <button
            onClick={handleAddCallDate}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          >
            Add Call Date
          </button>
          {state.callDates?.map((date, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label htmlFor={`callDate-${index}`} className="block text-sm font-medium mb-1">Call Date (Period)</label>
                <input
                  id={`callDate-${index}`}
                  type="number"
                  value={date}
                  onChange={(e) => handleCallDateChange(index, Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor={`callPrice-${index}`} className="block text-sm font-medium mb-1">Call Price ($)</label>
                <input
                  id={`callPrice-${index}`}
                  type="number"
                  value={state.callPrices?.[index] || 0}
                  onChange={(e) => handleCallPriceChange(index, Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleCalculate}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {/* Results */}
      {state.error && (
        <div className="text-red-500 mb-4">{state.error}</div>
      )}
      
      {state.result !== null && (
        <>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Results</h3>
            <div className="mb-2">
              <span className="font-medium">Bond Price: </span>
              ${state.result.toFixed(2)}
            </div>
            <div className="mb-2">
              <span className="font-medium">Bond Type: </span>
              {state.priceType}
            </div>
          </div>

          {/* Bond Visualization */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Cash Flow Diagram</h3>
            <BondVisualization state={state} />
          </div>
        </>
      )}

      {/* Amortization Schedule */}
      {state.amortizationSchedule && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Amortization Schedule</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amortization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.amortizationSchedule.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${entry.couponPayment.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${entry.interestEarned.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${entry.amortizationAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${entry.bookValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BondCalculator;
