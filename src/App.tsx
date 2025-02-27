import { useState } from 'react';
import AnnuityCalculator from './components/AnnuityCalculator';
import PerpetuityCalculator from './components/PerpetuityCalculator';

function App() {
  const [activeCalculator, setActiveCalculator] = useState<'annuity' | 'perpetuity'>('annuity');
  
  const handleCalculatorChange = (calculator: 'annuity' | 'perpetuity') => {
    setActiveCalculator(calculator);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">ActuarialCalc</h1>
          <p className="mt-2 text-primary-100">Financial Mathematics Calculators</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium text-lg ${activeCalculator === 'annuity' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleCalculatorChange('annuity')}
            >
              Annuity Calculator
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${activeCalculator === 'perpetuity' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleCalculatorChange('perpetuity')}
            >
              Perpetuity Calculator
            </button>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {activeCalculator === 'annuity' && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Annuity Calculator</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <AnnuityCalculator />
              </div>
            </section>
          )}
          
          {activeCalculator === 'perpetuity' && (
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Perpetuity Calculator</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <PerpetuityCalculator />
              </div>
            </section>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-400">
            ActuarialCalc - Financial Mathematics Calculators
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;