// Tooltip explanations for financial mathematics formulas
export const formulaTooltips = {
  // Basic annuity formulas
  presentValueAnnuityImmediate: {
    formula: "a_{n|i} = (1 - v^n)/i where v = 1/(1+i)",
    explanation: "Present value of an ordinary annuity (annuity immediate) where payments occur at the end of each period. This is the value today of a series of equal payments."
  },
  presentValueAnnuityDue: {
    formula: "ä_{n|i} = (1 - v^n)/i × (1 + i) = 1 + a_{n-1|i}",
    explanation: "Present value of an annuity due where payments occur at the beginning of each period. This is equal to the present value of an ordinary annuity multiplied by (1 + i)."
  },
  presentValueDeferredAnnuityImmediate: {
    formula: "_{m|}a_{n|i} = v^m × a_{n|i} where v = 1/(1+i)",
    explanation: "Present value of a deferred annuity immediate where payments start after m periods. This is equal to the present value of an immediate annuity discounted back by the deferral period."
  },
  futureValueAnnuityImmediate: {
    formula: "s_{n|i} = ((1 + i)^n - 1)/i",
    explanation: "Future value of an ordinary annuity (annuity immediate) where payments occur at the end of each period. This is the value at the end of the term of a series of equal payments."
  },
  futureValueAnnuityDue: {
    formula: "s̈_{n|i} = ((1 + i)^n - 1)/i × (1 + i) = (1 + i) × s_{n|i}",
    explanation: "Future value of an annuity due where payments occur at the beginning of each period. This is equal to the future value of an ordinary annuity multiplied by (1 + i)."
  },
  futureValueDeferredAnnuityImmediate: {
    formula: "_{m|}s_{n|i} = s_{n|i}",
    explanation: "Future value of a deferred annuity immediate where payments start after m periods. The future value is the same as a non-deferred annuity, just with a different time frame."
  },
  
  // Increasing annuity formulas
  presentValueIncreasingAnnuityImmediate: {
    formula: "(Ia)_{n|i} = (ä_{n|i} - n·v^n)/i where v = 1/(1+i)",
    explanation: "Present value of an increasing annuity immediate where payments increase by 1 each period. For payments increasing by I, multiply by I. For a first payment of PMT₁, add PMT₁·a_{n|i}."
  },
  presentValueIncreasingAnnuityDue: {
    formula: "(Iä)_{n|i} = (1 + i)·(Ia)_{n|i}",
    explanation: "Present value of an increasing annuity due where payments increase by a constant amount each period and payments occur at the beginning of each period."
  },
  
  // Geometric annuity formulas
  presentValueGeometricAnnuityImmediate: {
    formula: "a_{n|i}^{(g)} = (1 - ((1 + g)/(1 + i))^n) / (i - g)",
    explanation: "Present value of a geometrically increasing annuity immediate where payments increase at a rate g each period. If i = g, then a_{n|i}^{(g)} = n / (1 + i)."
  },
  presentValueGeometricAnnuityDue: {
    formula: "ä_{n|i}^{(g)} = (1 + i)·a_{n|i}^{(g)}",
    explanation: "Present value of a geometrically increasing annuity due where payments increase at a rate g each period and payments occur at the beginning of each period."
  },
  
  // Interest rate conversion formulas
  effectiveRate: {
    formula: "i = (1 + i^{(m)}/m)^m - 1",
    explanation: "Converting a nominal rate i^{(m)} compounded m times per year to an effective annual rate i."
  },
  forceOfInterest: {
    formula: "δ = ln(1 + i)",
    explanation: "Force of interest (δ) is the continuous compounding equivalent of an effective interest rate i. It represents the instantaneous rate of interest."
  },
  discountRate: {
    formula: "d = i / (1 + i) = 1 - v",
    explanation: "Discount rate (d) is related to the effective interest rate (i). It's used to calculate the present value by simple discount rather than by interest accumulation."
  },
  
  // Payment calculation formulas
  paymentFromPV: {
    formula: "PMT = PV / a_{n|i}",
    explanation: "Calculate the periodic payment amount given the present value, interest rate, and number of periods for an ordinary annuity."
  },
  paymentFromPVDue: {
    formula: "PMT = PV / ä_{n|i}",
    explanation: "Calculate the periodic payment amount given the present value, interest rate, and number of periods for an annuity due."
  },
  
  // Accumulated Value
  accumulatedValue: {
    formula: "AV = PV·(1 + i)^n + PMT·s_{n|i}",
    explanation: "The accumulated value is the sum of the future value of the present value (initial investment) and the future value of the annuity (series of payments). It represents the total value at the end of the term."
  },
  
  // Amortization
  amortization: {
    formula: "L_t = PV·(1 + i)^t - PMT·s_{t|i}",
    explanation: "The loan balance L_t after t payments in a loan amortization schedule. Interest in period t is calculated as L_{t-1}·i, and principal repayment is PMT - Interest."
  }
};

// Get tooltip content for a specific formula
export const getTooltipContent = (formulaKey: keyof typeof formulaTooltips) => {
  const tooltip = formulaTooltips[formulaKey];
  if (!tooltip) return null;
  
  return (
    `<div class="formula-tooltip-content">
      <div class="formula-tooltip-formula">${tooltip.formula}</div>
      <div class="formula-tooltip-explanation">${tooltip.explanation}</div>
    </div>`
  );
};