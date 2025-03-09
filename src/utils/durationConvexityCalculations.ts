import { CashFlow } from './types';

/**
 * Calculates the Macaulay Duration of a series of cash flows
 * Formula: MacD = -P'(δ)/P(δ) = Σ(t * v^t * CFt) / Σ(v^t * CFt)
 * @param cashFlows Array of cash flows with time and amount
 * @param i Interest rate per period (as decimal)
 * @returns Macaulay Duration
 */
export const calculateMacaulayDuration = (cashFlows: CashFlow[], i: number): number => {
    const v = 1 / (1 + i); // Discount factor
    
    let numerator = 0; // Σ(t * v^t * CFt)
    let denominator = 0; // Σ(v^t * CFt)
    
    cashFlows.forEach(cf => {
        const discountFactor = Math.pow(v, cf.time);
        numerator += cf.time * discountFactor * cf.amount;
        denominator += discountFactor * cf.amount;
    });
    
    return numerator / denominator;
};

/**
 * Calculates the Modified Duration of a series of cash flows
 * Formula: ModD = -P'(i)/P(i) = MacD * v
 * @param cashFlows Array of cash flows with time and amount
 * @param i Interest rate per period (as decimal)
 * @returns Modified Duration
 */
export const calculateModifiedDuration = (cashFlows: CashFlow[], i: number): number => {
    const macD = calculateMacaulayDuration(cashFlows, i);
    return macD / (1 + i);
};

/**
 * Calculates the Convexity of a series of cash flows
 * Formula: ModC = P''(i)/P(i) = Σ(t * (t+1) * v^(t+2) * CFt) / Σ(v^t * CFt)
 * @param cashFlows Array of cash flows with time and amount
 * @param i Interest rate per period (as decimal)
 * @returns Modified Convexity
 */
export const calculateModifiedConvexity = (cashFlows: CashFlow[], i: number): number => {
    const v = 1 / (1 + i);
    
    let numerator = 0; // Σ(t * (t+1) * v^(t+2) * CFt)
    let denominator = 0; // Σ(v^t * CFt)
    
    cashFlows.forEach(cf => {
        const discountFactor = Math.pow(v, cf.time);
        numerator += cf.time * (cf.time + 1) * Math.pow(v, cf.time + 2) * cf.amount;
        denominator += discountFactor * cf.amount;
    });
    
    return numerator / denominator;
};

/**
 * Calculates the Macaulay Convexity of a series of cash flows
 * Formula: MacC = P''(δ)/P(δ) = Σ(t^2 * v^t * CFt) / Σ(v^t * CFt)
 * @param cashFlows Array of cash flows with time and amount
 * @param i Interest rate per period (as decimal)
 * @returns Macaulay Convexity
 */
export const calculateMacaulayConvexity = (cashFlows: CashFlow[], i: number): number => {
    const v = 1 / (1 + i);
    
    let numerator = 0; // Σ(t^2 * v^t * CFt)
    let denominator = 0; // Σ(v^t * CFt)
    
    cashFlows.forEach(cf => {
        const discountFactor = Math.pow(v, cf.time);
        numerator += Math.pow(cf.time, 2) * discountFactor * cf.amount;
        denominator += discountFactor * cf.amount;
    });
    
    return numerator / denominator;
};

/**
 * Calculates the First-order Modified Duration Approximation
 * Formula: P(i_n) ≈ P(i_o) * [1 - (i_n - i_o)(ModD)]
 * @param originalPrice Original price P(i_o)
 * @param originalRate Original interest rate i_o
 * @param newRate New interest rate i_n
 * @param modifiedDuration Modified Duration at i_o
 * @returns Approximated new price
 */
export const approximatePriceModified = (
    originalPrice: number,
    originalRate: number,
    newRate: number,
    modifiedDuration: number
): number => {
    return originalPrice * (1 - (newRate - originalRate) * modifiedDuration);
};

/**
 * Calculates the First-order Macaulay Duration Approximation
 * Formula: P(i_n) ≈ P(i_o) * ((1 + i_o)/(1 + i_n))^MacD
 * @param originalPrice Original price P(i_o)
 * @param originalRate Original interest rate i_o
 * @param newRate New interest rate i_n
 * @param macaulayDuration Macaulay Duration at i_o
 * @returns Approximated new price
 */
export const approximatePriceMacaulay = (
    originalPrice: number,
    originalRate: number,
    newRate: number,
    macaulayDuration: number
): number => {
    return originalPrice * Math.pow((1 + originalRate) / (1 + newRate), macaulayDuration);
};

/**
 * Calculates the passage of time effect on Duration
 * Formula: MacD_t1 = MacD_t2 - (t2 - t1)
 * @param duration Duration at time t2
 * @param timeDifference Time difference (t2 - t1)
 * @returns Duration at time t1
 */
export const calculateDurationPassageOfTime = (
    duration: number,
    timeDifference: number
): number => {
    return duration - timeDifference;
};

/**
 * Calculates the Duration of a portfolio
 * Formula: MacD_P = (P1/P)MacD1 + ... + (Pm/P)MacDm
 * @param components Array of portfolio components with duration and value
 * @returns Portfolio Duration
 */
export const calculatePortfolioDuration = (
    components: Array<{ duration: number; value: number }>
): number => {
    const totalValue = components.reduce((sum, comp) => sum + comp.value, 0);
    return components.reduce(
        (sum, comp) => sum + (comp.value / totalValue) * comp.duration,
        0
    );
};