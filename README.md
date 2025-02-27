# ActuarialCalc

A comprehensive web application featuring financial mathematics calculators designed to help students studying for the Society of Actuaries (SOA) Exam FM.

![ActuarialCalc](https://via.placeholder.com/800x400?text=ActuarialCalc+Screenshot)

## Overview

ActuarialCalc provides interactive calculators for various financial mathematics concepts covered in the SOA Exam FM. The application allows users to perform complex actuarial calculations with ease, visualize payment schedules, and understand the underlying formulas.

## Features

### Annuity Calculator
- Calculate present value, future value, payment amount, interest rate, or number of periods
- Support for different annuity types:
  - Immediate (ordinary) annuities
  - Annuities due (payments at beginning)
  - Deferred annuities
- Support for different payment variations:
  - Level (constant) payments
  - Increasing (arithmetic) payments
  - Geometric growth payments
- Interactive amortization/payment schedules
- Formula tooltips with explanations
- Interest rate conversions (effective, nominal, force of interest, discount rate)
- Adjustable payment frequency

### Coming Soon
- Perpetuity Calculator
- Additional financial mathematics tools

## Technologies Used

- **Frontend**: React, TypeScript
- **Styling**: TailwindCSS
- **Math Rendering**: KaTeX, react-katex
- **Math Calculations**: mathjs
- **Build Tool**: Vite

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/actuarial-study-site.git
   cd actuarial-study-site
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory and can be deployed to any static hosting service.

## Project Structure

```
actuarial-study-site/
├── public/                  # Static assets
│   └── calculator-icon.svg  # Site favicon
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── AmortizationTable.tsx     # Displays payment schedules
│   │   ├── AnnuityCalculator.tsx     # Main annuity calculator component
│   │   ├── FormulaTooltip.tsx        # Tooltip component for formulas
│   │   └── PerpetuityCalculator.tsx  # Perpetuity calculator (coming soon)
│   ├── utils/               # Utility functions and types
│   │   ├── annuityCalculations.ts    # Core calculation functions
│   │   ├── formulaTooltips.ts        # Formula explanations
│   │   └── types.ts                  # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # TailwindCSS configuration
```

## Usage

### Annuity Calculator

1. Select what you want to solve for (payment, present value, future value, interest rate, or periods)
2. Choose the annuity type (immediate, due, or deferred)
3. Select the variation type (level, increasing, or geometric)
4. Enter the known values
5. Click "Calculate" to get the result
6. View the amortization/payment schedule by clicking "Show Amortization Table"

### Formula References

The application includes a comprehensive set of formula references with explanations for:
- Present and future value formulas
- Interest rate conversions
- Increasing and geometric annuities
- Amortization calculations

## Mathematical Concepts

The application implements various financial mathematics concepts including:

- Time value of money
- Annuities (immediate, due, deferred)
- Increasing and geometric payment patterns
- Interest rate conversions
- Amortization schedules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Acknowledgements

- Society of Actuaries (SOA) for the Exam FM curriculum
- The React and TypeScript communities for their excellent documentation
- TailwindCSS for the styling framework
- KaTeX for the mathematical typesetting