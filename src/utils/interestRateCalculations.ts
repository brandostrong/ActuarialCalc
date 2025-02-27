import { InterestRateType } from './types';

/**
 * Convert from any interest rate type to effective annual rate
 */
export const convertToEffective = (
  rate: number,
  fromType: InterestRateType,
  compoundingFrequency: number = 1
): number => {
  // Convert rate to decimal
  const r = rate / 100;
  
  // Convert to effective annual rate
  switch (fromType) {
    case 'effective':
      return rate; // Already effective, return as is
    case 'nominal':
      return (Math.pow(1 + r / compoundingFrequency, compoundingFrequency) - 1) * 100;
    case 'force':
      return (Math.exp(r) - 1) * 100;
    case 'simple':
      if (compoundingFrequency === 1) {
        // Simple interest doesn't directly convert to effective
        // This is an approximation for a 1-year period
        return rate;
      } else {
        // For nominal simple interest with payment frequency
        return (r * compoundingFrequency / compoundingFrequency) * 100;
      }
    case 'discount':
      if (compoundingFrequency === 1) {
        // If frequency is 1, treat as effective discount rate
        return (r / (1 - r)) * 100;
      } else {
        // Otherwise, treat as nominal discount rate with compounding frequency
        const d = r / compoundingFrequency;
        return (Math.pow(1 / (1 - d), compoundingFrequency) - 1) * 100;
      }
    default:
      throw new Error(`Unsupported interest rate type: ${fromType}`);
  }
};

/**
 * Convert from effective annual rate to any other interest rate type
 */
export const convertFromEffective = (
  effectiveRate: number,
  toType: InterestRateType,
  compoundingFrequency: number = 1
): number => {
  // Convert rate to decimal
  const i = effectiveRate / 100;
  
  // Convert from effective annual rate to target type
  switch (toType) {
    case 'effective':
      return effectiveRate; // Already effective, return as is
    case 'nominal':
      return compoundingFrequency * (Math.pow(1 + i, 1 / compoundingFrequency) - 1) * 100;
    case 'force':
      return Math.log(1 + i) * 100;
    case 'simple':
      if (compoundingFrequency === 1) {
        // Simple interest doesn't directly convert from effective
        // This is an approximation for a 1-year period
        return effectiveRate;
      } else {
        // For nominal simple interest with payment frequency
        return effectiveRate;
      }
    case 'discount':
      if (compoundingFrequency === 1) {
        // If frequency is 1, treat as effective discount rate
        return (i / (1 + i)) * 100;
      } else {
        // Otherwise, treat as nominal discount rate with compounding frequency
        const d = i / (1 + i); // Annual discount rate
        return (1 - Math.pow(1 - d, 1 / compoundingFrequency)) * compoundingFrequency * 100;
      }
    default:
      throw new Error(`Unsupported interest rate type: ${toType}`);
  }
};

/**
 * Calculate future value using the appropriate interest formula
 */
export const calculateFutureValue = (
  presentValue: number,
  rate: number,
  rateType: InterestRateType,
  timeInYears: number,
  compoundingFrequency: number = 1
): number => {
  // First convert to effective rate
  const effectiveRate = convertToEffective(rate, rateType, compoundingFrequency);
  const i = effectiveRate / 100;
  
  // Calculate future value
  return presentValue * Math.pow(1 + i, timeInYears);
};

/**
 * Calculate present value using the appropriate interest formula
 */
export const calculatePresentValue = (
  futureValue: number,
  rate: number,
  rateType: InterestRateType,
  timeInYears: number,
  compoundingFrequency: number = 1
): number => {
  // First convert to effective rate
  const effectiveRate = convertToEffective(rate, rateType, compoundingFrequency);
  const i = effectiveRate / 100;
  
  // Calculate present value
  return futureValue / Math.pow(1 + i, timeInYears);
};

/**
 * Generate standard compounding frequencies for display
 */
export const getStandardCompoundingFrequencies = (): { name: string; value: number; notation: string; htmlNotation: string; isCustom?: boolean }[] => {
  return [
    { name: "Annual", value: 1, notation: "i", htmlNotation: "i" },
    { name: "Semi-annual", value: 2, notation: "i^(2)", htmlNotation: "i<sup>(2)</sup>" },
    { name: "Quarterly", value: 4, notation: "i^(4)", htmlNotation: "i<sup>(4)</sup>" },
    { name: "Monthly", value: 12, notation: "i^(12)", htmlNotation: "i<sup>(12)</sup>" },
    { name: "Weekly", value: 52, notation: "i^(52)", htmlNotation: "i<sup>(52)</sup>" },
    { name: "Daily", value: 365, notation: "i^(365)", htmlNotation: "i<sup>(365)</sup>" },
    { name: "Custom", value: -1, notation: "i^(m)", htmlNotation: "i<sup>(m)</sup>", isCustom: true }
  ];
};

/**
 * Generate all equivalent rates for a given interest rate
 */
export const generateEquivalentRates = (
  sourceRate: number,
  sourceRateType: InterestRateType,
  sourceCompoundingFrequency: number = 1
): {
  effectiveRate: number;
  nominalRates: { frequency: number; rate: number }[];
  forceOfInterest: number;
  simpleRate: number;
  discountRate: number;
} => {
  // First convert to effective rate
  const effectiveRate = convertToEffective(sourceRate, sourceRateType, sourceCompoundingFrequency);
  
  // Get standard compounding frequencies
  const frequencies = getStandardCompoundingFrequencies();
  
  // Generate nominal rates for each frequency
  const nominalRates = frequencies.map(freq => ({
    frequency: freq.value,
    rate: convertFromEffective(effectiveRate, 'nominal', freq.value)
  }));
  
  // Generate other rates
  const forceOfInterest = convertFromEffective(effectiveRate, 'force');
  const simpleRate = convertFromEffective(effectiveRate, 'simple');
  const discountRate = convertFromEffective(effectiveRate, 'discount');
  
  return {
    effectiveRate,
    nominalRates,
    forceOfInterest,
    simpleRate,
    discountRate
  };
};