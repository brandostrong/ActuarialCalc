// Tooltip explanations for financial mathematics formulas
export const formulaTooltips = {
  // Interest rate formulas
  effectiveRate: {
    formula: "i = \\left(1 + \\frac{i^{(m)}}{m}\\right)^m - 1",
    explanation: "Converting a nominal rate i^{(m)} compounded m times per year to an effective annual rate i. This is the standard formula for finding the equivalent effective annual rate."
  },
  nominalRate: {
    formula: "i^{(m)} = m \\cdot \\left[(1 + i)^{1/m} - 1\\right]",
    explanation: "Converting an effective annual rate i to a nominal rate i^{(m)} compounded m times per year. This gives the equivalent nominal rate that would produce the same accumulated value over one year."
  },
  forceOfInterest: {
    formula: "\\delta = \\ln(1 + i)",
    explanation: "Force of interest (δ) is the continuous compounding equivalent of an effective interest rate i. It represents the instantaneous rate of interest at any point in time."
  },
  discountRate: {
    formula: "d = \\frac{i}{1 + i}",
    explanation: "Discount rate (d) is related to the effective interest rate (i). It represents the amount of discount as a proportion of the accumulated value."
  },
  accumulationFunction: {
    formula: "a(t) = (1 + i)^t",
    explanation: "The accumulation function gives the value at time t of 1 unit invested at time 0, accumulating at effective interest rate i."
  },
  simpleInterest: {
    formula: "a(t) = 1 + i \\cdot t",
    explanation: "Under simple interest, interest is calculated only on the initial principal and not on accumulated interest. The rate i is applied linearly with time."
  },
  allInOneRelationship: {
    formula: "(1 + i)^t = \\left(\\frac{1}{1-d}\\right)^t = e^{\\delta t}",
    explanation: "This formula shows the relationship between the effective interest rate i, the discount rate d, and the force of interest δ. All three expressions give the same accumulation factor over time t."
  },
  // Basic annuity formulas
  presentValueAnnuityImmediate: {
    formula: "a_{\\overline{n}|} = \\frac{1 - v^n}{i} \\text{ where } v = \\frac{1}{1+i}",
    explanation: "Present value of an ordinary annuity (annuity immediate) where payments occur at the end of each period. This is the value today of a series of equal payments."
  },
  presentValueAnnuityDue: {
    formula: "\\ddot{a}_{\\overline{n}|} = \\frac{1 - v^n}{i} \\times (1 + i) = 1 + a_{\\overline{n-1}|}",
    explanation: "Present value of an annuity due where payments occur at the beginning of each period. This is equal to the present value of an ordinary annuity multiplied by (1 + i)."
  },
  presentValueDeferredAnnuityImmediate: {
    formula: "{}_{m|}a_{\\overline{n}|} = v^m \\times a_{\\overline{n}|} \\text{ where } v = \\frac{1}{1+i}",
    explanation: "Present value of a deferred annuity immediate where payments start after m periods. This is equal to the present value of an immediate annuity discounted back by the deferral period."
  },
  futureValueAnnuityImmediate: {
    formula: "s_{\\overline{n}|} = \\frac{(1 + i)^n - 1}{i}",
    explanation: "Future value of an ordinary annuity (annuity immediate) where payments occur at the end of each period. This is the value at the end of the term of a series of equal payments."
  },
  futureValueAnnuityDue: {
    formula: "\\ddot{s}_{\\overline{n}|} = \\frac{(1 + i)^n - 1}{i} \\times (1 + i) = (1 + i) \\times s_{\\overline{n}|}",
    explanation: "Future value of an annuity due where payments occur at the beginning of each period. This is equal to the future value of an ordinary annuity multiplied by (1 + i)."
  },
  futureValueDeferredAnnuityImmediate: {
    formula: "{}_{m|}s_{\\overline{n}|} = s_{\\overline{n}|}",
    explanation: "Future value of a deferred annuity immediate where payments start after m periods. The future value is the same as a non-deferred annuity, just with a different time frame."
  },
  
  // Increasing annuity formulas
  presentValueIncreasingAnnuityImmediate: {
    formula: "(Ia)_{\\overline{n}|} = \\frac{\\ddot{a}_{\\overline{n}|} - n \\cdot v^n}{i} \\text{ where } v = \\frac{1}{1+i}",
    explanation: "Present value of an increasing annuity immediate where payments increase by 1 each period. For payments increasing by I, multiply by I. For a first payment of PMT₁, add PMT₁·a_{\\overline{n}|}."
  },
  presentValueIncreasingAnnuityDue: {
    formula: "(I\\ddot{a})_{\\overline{n}|} = (1 + i) \\cdot (Ia)_{\\overline{n}|}",
    explanation: "Present value of an increasing annuity due where payments increase by a constant amount each period and payments occur at the beginning of each period."
  },
  
  // Geometric annuity formulas
  presentValueGeometricAnnuityImmediate: {
    formula: "a_{\\overline{n}|}^{(g)} = \\frac{1 - \\left(\\frac{1 + g}{1 + i}\\right)^n}{i - g}",
    explanation: "Present value of a geometrically increasing annuity immediate where payments increase at a rate g each period. If i = g, then a_{\\overline{n}|}^{(g)} = \\frac{n}{1 + i}."
  },
  presentValueGeometricAnnuityDue: {
    formula: "\\ddot{a}_{\\overline{n}|}^{(g)} = (1 + i) \\cdot a_{\\overline{n}|}^{(g)}",
    explanation: "Present value of a geometrically increasing annuity due where payments increase at a rate g each period and payments occur at the beginning of each period."
  },
  
  // Additional formulas for interest rate calculator
  nominalToEffective: {
    formula: "i = \\left(1 + \\frac{i^{(m)}}{m}\\right)^m - 1",
    explanation: "Converting a nominal rate i^{(m)} compounded m times per year to an effective annual rate i."
  },
  effectiveToNominal: {
    formula: "i^{(m)} = m \\cdot [(1 + i)^{1/m} - 1]",
    explanation: "Converting an effective annual rate i to a nominal rate i^{(m)} compounded m times per year."
  },
  
  // Payment calculation formulas
  paymentFromPV: {
    formula: "PMT = \\frac{PV}{a_{\\overline{n}|}}",
    explanation: "Calculate the periodic payment amount given the present value, interest rate, and number of periods for an ordinary annuity."
  },
  paymentFromPVDue: {
    formula: "PMT = \\frac{PV}{\\ddot{a}_{\\overline{n}|}}",
    explanation: "Calculate the periodic payment amount given the present value, interest rate, and number of periods for an annuity due."
  },
  
  // Accumulated Value
  accumulatedValue: {
    formula: "AV = PV \\cdot (1 + i)^n + PMT \\cdot s_{\\overline{n}|}",
    explanation: "The accumulated value is the sum of the future value of the present value (initial investment) and the future value of the annuity (series of payments). It represents the total value at the end of the term."
  },
  
  // Amortization
  amortization: {
    formula: "L_t = PV \\cdot (1 + i)^t - PMT \\cdot s_{\\overline{t}|}",
    explanation: "The loan balance L_t after t payments in a loan amortization schedule. Interest in period t is calculated as L_{t-1} \\cdot i, and principal repayment is PMT - Interest."
  }
};

// Get tooltip content for a specific formula
export const getTooltipContent = (formulaKey: keyof typeof formulaTooltips) => {
  const tooltip = formulaTooltips[formulaKey];
  if (!tooltip) return null;
  
  return {
    formula: tooltip.formula,
    explanation: tooltip.explanation
  };
};