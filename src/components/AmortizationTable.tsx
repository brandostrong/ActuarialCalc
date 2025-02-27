import React, { useState } from 'react';
import { AmortizationEntry } from '../utils/types';

interface AmortizationTableProps {
  schedule: AmortizationEntry[];
}

const AmortizationTable: React.FC<AmortizationTableProps> = ({ schedule }) => {
  const [displayCount, setDisplayCount] = useState(10);
  
  if (!schedule || schedule.length === 0) {
    return null;
  }

  // Calculate totals
  const totalPayments = schedule.reduce((sum, entry) => sum + entry.payment, 0);
  const totalInterest = schedule.reduce((sum, entry) => sum + entry.interestPayment, 0);
  // We'll use totalPrincipal in a future enhancement
  // const totalPrincipal = schedule.reduce((sum, entry) => sum + entry.principalPayment, 0);
  
  // Determine if payments are level, increasing, or geometric
  const isLevelPayment = schedule.every((entry, i, arr) =>
    i === 0 || Math.abs(entry.payment - arr[i-1].payment) < 0.01
  );
  
  const isIncreasingPayment = !isLevelPayment && schedule.every((entry, i, arr) =>
    i === 0 || (i === arr.length - 1) ||
    (Math.abs((entry.payment - arr[i-1].payment) - (arr[i+1].payment - entry.payment)) < 0.01)
  );
  
  const paymentType = isLevelPayment ? 'Level' : isIncreasingPayment ? 'Increasing' : 'Geometric';
  
  // Show only a subset of the schedule with option to show more
  const displayedSchedule = schedule.slice(0, displayCount);
  const hasMore = schedule.length > displayCount;

  const showMore = () => {
    setDisplayCount(Math.min(displayCount + 10, schedule.length));
  };

  const showAll = () => {
    setDisplayCount(schedule.length);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Schedule</h3>
      
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Payment Type</p>
          <p className="font-medium">{paymentType}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Total Payments</p>
          <p className="font-medium">{totalPayments.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm text-gray-500">Total Interest</p>
          <p className="font-medium">{totalInterest.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Interest
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Principal
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remaining Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayedSchedule.map((entry) => (
              <tr key={entry.period}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.period}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.payment.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.interestPayment.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.principalPayment.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.remainingBalance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={showMore}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Show 10 more periods
          </button>
          <button
            onClick={showAll}
            className="text-sm text-primary-600 hover:text-primary-800"
          >
            Show all {schedule.length} periods
          </button>
        </div>
      )}
    </div>
  );
};

export default AmortizationTable;