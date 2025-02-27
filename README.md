# ActuarialCalc

A comprehensive web application featuring financial mathematics calculators designed to help students studying for the Society of Actuaries (SOA) Exam FM.

![ActuarialCalc](https://via.placeholder.com/800x400?text=ActuarialCalc+Screenshot)

## Live Demo

Visit the live application: [ActuarialCalc](https://brandostrong.github.io/ActuarialCalc/)

## Overview

ActuarialCalc provides interactive calculators for various financial mathematics concepts covered in the SOA Exam FM. The application allows users to perform complex actuarial calculations with ease, visualize payment schedules, and understand the underlying formulas.

## Features

### Interest Rate Calculator
- Convert between different interest rate types:
  - Effective annual rate (i)
  - Nominal annual rate with various compounding frequencies (i^(m))
  - Force of interest (continuous compounding) (δ)
  - Discount rate (d)
  - Simple interest
- Display all equivalent rates with proper mathematical notation
- Calculate time value of money (future value and present value)
- Comprehensive formula references with explanations

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

## Recent Updates

### Mathematical Notation Improvements
- Added proper mathematical notation for interest rates throughout the application
- Implemented superscript formatting for rate notation (e.g., i^(12) for monthly compounding)
- Enhanced display of conversion results with clear rate notation
- Updated dropdowns to include rate notation for better clarity
- Improved formula displays with proper mathematical symbols

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
   git clone https://github.com/brandostrong/ActuarialCalc.git
   cd ActuarialCalc
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

## Deploying to GitHub Pages

This project can be easily deployed to GitHub Pages. For detailed instructions, see the [GitHub Pages Deployment Guide](./github-pages-deployment.md).

In summary, you'll need to:

1. Install the `gh-pages` package: `npm install gh-pages --save-dev`
2. Update `vite.config.ts` to set the base path to your repository name
3. Add deployment scripts to `package.json`
4. Run `npm run deploy` to publish to GitHub Pages

Your site will be available at `https://brandostrong.github.io/ActuarialCalc/`

## Project Structure

```
ActuarialCalc/
├── public/                  # Static assets
│   └── calculator-icon.svg  # Site favicon
├── src/                     # Source code
│   ├── components/          # React components
│   │   ├── AmortizationTable.tsx     # Displays payment schedules
│   │   ├── AnnuityCalculator.tsx     # Main annuity calculator component
│   │   ├── FormulaTooltip.tsx        # Tooltip component for formulas
│   │   ├── InterestRateCalculator.tsx # Interest rate conversion calculator
│   │   └── PerpetuityCalculator.tsx  # Perpetuity calculator (coming soon)
│   ├── utils/               # Utility functions and types
│   │   ├── annuityCalculations.ts    # Core annuity calculation functions
│   │   ├── formulaTooltips.ts        # Formula explanations
│   │   ├── interestRateCalculations.ts # Interest rate conversion functions
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

### Interest Rate Calculator

1. Enter your interest rate
2. Select the source rate type (effective, nominal, force of interest, etc.)
3. If applicable, choose the compounding frequency
4. Select the target rate type you want to convert to
5. Click "Calculate" to see the conversion result
6. View all equivalent rates by clicking "Show All Equivalent Rates"
7. Calculate time value of money by clicking "Show Time Value Calculations"

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
- Interest rate conversions and equivalencies
- Annuities (immediate, due, deferred)
- Increasing and geometric payment patterns
- Amortization schedules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgements

- Society of Actuaries (SOA) for the Exam FM curriculum
- The React and TypeScript communities for their excellent documentation
- TailwindCSS for the styling framework
- KaTeX for the mathematical typesetting