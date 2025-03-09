import React from 'react';
import BondCalculator from '../components/BondCalculator';

const BondCalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-5xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-4xl mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">Bond Calculator</h1>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Overview</h2>
                  <p className="mb-4">
                    This calculator helps you value bonds and understand their characteristics. You can:
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>Calculate the present value of regular and callable bonds</li>
                    <li>Determine if a bond is trading at a premium, discount, or par</li>
                    <li>Generate amortization schedules</li>
                    <li>Visualize bond cash flows</li>
                  </ul>
                  <p>
                    The calculator supports both regular bonds and callable bonds with multiple call dates.
                  </p>
                </div>

                <BondCalculator />

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Formulas Used</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Regular Bond Price</h3>
                    <p className="mb-4 font-mono">P = C × a<sub>n|i</sub> + R × v<sup>n</sup></p>
                    <p>Where:</p>
                    <ul className="list-disc pl-5">
                      <li>P = Bond price</li>
                      <li>C = Coupon payment</li>
                      <li>R = Redemption value</li>
                      <li>i = Yield rate per period</li>
                      <li>n = Number of periods</li>
                      <li>v = 1/(1+i) = Discount factor</li>
                      <li>a_{n|}^i = Annuity immediate factor</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Notes</h2>
                  <ul className="list-disc pl-5">
                    <li>All rates should be entered as percentages (e.g., 5 for 5%)</li>
                    <li>For callable bonds, call dates must be in ascending order</li>
                    <li>The amortization schedule shows how the book value changes over time</li>
                    <li>Premium bonds have coupon rates higher than yield rates</li>
                    <li>Discount bonds have coupon rates lower than yield rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondCalculatorPage;