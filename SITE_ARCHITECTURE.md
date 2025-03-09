# Actuarial Calculator - Site Architecture

## Purpose & Goals
- Professional-grade calculator for SOA exam preparation
- CRITICAL: All implementations MUST follow fm-formula-sheet.md exactly
- Uses standard actuarial notation (e.g., annuity "a" subscript n)
- Clear visualizations and step-by-step solutions
- Comprehensive formula references and tooltips
- SOA exam-compliant interest rate conversions and terminology

## Currently Implemented Features

### Bond Calculator
- Types: Regular bonds, callable bonds
- Premium/discount calculations
- Bond amortization schedules
- Coupon payment handling
- Book value calculations
- Cash flow visualization
- Callable bond pricing
- Interactive timeline visualization
- Formula tooltips and explanations
- Error handling for invalid inputs

### Interest Rate Calculator
- Convert between all rate types:
  - Effective annual (i)
  - Nominal annual (i^(m))
  - Force of interest (δ)
  - Simple interest
  - Discount rate (d)
- Custom compounding frequencies
- Time value calculations
- Display equivalent rates
- SOA notation compliance
- Formula tooltips and explanations

### Annuity Calculator
- Types: Immediate, Due, Deferred
- Variations: Level, Increasing (Arithmetic), Geometric
- Payment frequencies: Annual, Semi-annual, Quarterly, Monthly
- Solve for:
  - Payment amount
  - Present value
  - Future value
  - Interest rate
  - Number of periods
- Features:
  - Amortization schedules
  - Payment visualizations
  - Time value calculations
  - Formula references

### Perpetuity Calculator
- Types: Level, Increasing
- Payment Types: Immediate, Due, Continuous
- Payment Frequencies:
  - Annual, Semi-annual, Quarterly, Monthly
  - Frequency adjustments for all calculations
- Solve for:
  - Present value
  - Payment amount
  - Interest rate
  - Growth rate
  - Future value (with infinite value handling)
- Enhanced Features:
  - Interactive timeline visualization
  - Payment pattern display
  - Deferred period visualization
  - Payment frequency adjustments
  - Formula tooltips with KaTeX
- Error Handling:
  - Proper future value messaging
  - Growth rate validation
  - Interest rate constraints

## File Structure

### Core Components
```
src/
├── components/
│   ├── AnnuityCalculator.tsx       # Annuity calculations UI
│   ├── PerpetuityCalculator.tsx    # Perpetuity calculations UI
│   ├── InterestRateCalculator.tsx  # Interest rate conversions
│   ├── AmortizationTable.tsx       # Payment schedule display
│   ├── AnnuityVisualization.tsx    # Timeline visualization
│   ├── FormulaTooltip.tsx         # Formula explanations
│   ├── PerpetuityVisualization.tsx # Perpetuity diagrams
│   ├── BondCalculator.tsx         # Bond calculations UI
│   ├── BondVisualization.tsx      # Bond cash flow diagrams
```

### Business Logic
```
src/utils/
├── types.ts                    # TypeScript definitions
├── annuityCalculations.ts      # Annuity math functions
├── perpetuityCalculations.ts   # Perpetuity math functions
├── bondCalculations.ts         # Bond valuation functions
├── interestRateCalculations.ts # Rate conversion logic
└── formulaTooltips.ts         # Formula explanations
```

### Testing
```
src/tests/
├── components/                 # Component tests
└── utils/                     # Utility function tests
```

## UI Components Layout
- Clear input sections
- Tabbed calculator selection
- Interactive formula display (must match fm-formula-sheet.md notation exactly)
- Visual timelines and diagrams
- Results with detailed breakdown
- Amortization/payment schedules
- Formula reference sections that reflect fm-formula-sheet.md conventions

## Implementation Details

### Current Math Functions
Implementation Note: All mathematical functions should reference fm-formula-sheet.md as the canonical source. While implementations may deviate from the exact mathematical notation for practical coding reasons (e.g., algorithmic efficiency, code maintainability), any such deviations must be well documented and mathematically justified.

Functions implemented (with reference to fm-formula-sheet.md):
- Interest rate conversions (all types)
- Present/Future value calculations
- Annuity payment calculations
- Perpetuity valuations
- Amortization schedules
- Time value calculations
- Geometric progressions

### Error Handling
- Input validation
- Mathematical constraints
- Edge cases (e.g., infinite values)
- Clear error messages

### Visualization
- Payment timelines
- Accumulation diagrams
- Interactive tooltips
- Formula display (KaTeX)

### Testing Coverage
- Unit tests for calculations
- Component integration tests
- UI interaction tests
- Edge case validation

## Technical Stack
- React with TypeScript
- TailwindCSS for styling
- KaTeX for mathematical notation
- Jest for testing
- Modern ES6+ JavaScript

## Current Limitations
- No mobile-specific optimizations
- No data persistence
- Limited to financial mathematics (no probability)
- Single currency support
- Missing key FM topics (see Coming Soon section):
  * Bond pricing and amortization
  * Duration and convexity analysis
  * Portfolio immunization
  * Variable force of interest calculations

## Best Practices
- Frontend display must strictly match fm-formula-sheet.md notation and formats
- Implementation can deviate from formula sheet when justified, but must be well-documented
- Use actuarial notation standards
- Clear error messages
- Comprehensive testing
- Modular component design
- Type safety
- Performance optimization
- Keep README.md and SITE_ARCHITECTURE.md updated with all relevant changes

## Coming Soon
### Duration & Convexity Calculator
- Macaulay and Modified duration
- First-order approximations
- Convexity calculations
- Portfolio duration analysis
- Passage of time effects

### Immunization Calculator
- Redington immunization
- Full immunization
- Asset allocation calculations
- Immunization verification
- Portfolio rebalancing suggestions

### Advanced Interest Calculator
- Variable force of interest
- Simple interest comparisons
- Real vs nominal rates
- Inflation adjustments