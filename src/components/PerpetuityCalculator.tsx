import React from 'react';

const PerpetuityCalculator: React.FC = () => {
  return (
    <div className="perpetuity-calculator">
      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          This calculator will help you solve for different variables in perpetuity calculations.
        </p>
      </div>
      
      <div className="p-8 bg-gray-50 border border-gray-200 rounded-md text-center">
        <h3 className="text-xl font-medium text-gray-800 mb-4">Coming Soon</h3>
        <p className="text-gray-600">
          The perpetuity calculator is currently under development and will be available soon.
        </p>
        <p className="text-gray-600 mt-2">
          Check back later for tools to calculate present values, payments, and more for perpetuities.
        </p>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Perpetuity Formulas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Basic Perpetuity</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Present Value: PV = PMT / i</li>
              <li>Payment: PMT = PV × i</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-1">Growing Perpetuity</h4>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Present Value: PV = PMT / (i - g)</li>
              <li>Payment: PMT = PV × (i - g)</li>
              <li>Where g = growth rate (g &lt; i)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerpetuityCalculator;