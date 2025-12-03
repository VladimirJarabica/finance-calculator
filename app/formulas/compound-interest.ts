import { mul, add, div, sub } from "exact-math";

console.log("exactMath", { mul });

type CompoundInterestOptions = {
  initialInvestment: number;
  isYearly: boolean;
  recurringInvestment: number;
  percentageReturn: number;
  months: number;
};

type CompoundInterestResultItem = {
  month: number;
  invested: number;
  totalInvestment: number;
  value: number;
};

export const compoundInterest = (
  options: CompoundInterestOptions
): CompoundInterestResultItem[] => {
  const {
    initialInvestment,
    isYearly,
    recurringInvestment,
    percentageReturn,
    months,
  } = options;

  const monthlyInterestCoefficient = sub(
    Math.pow(add(1, div(percentageReturn, 100)), div(1, 12)),
    1
  );

  const result = new Array(months).fill(0).reduce<CompoundInterestResultItem[]>(
    (acc, __, monthIndex) => {
      const isInvesting =
        !isYearly || (monthIndex % 12 === 0 && monthIndex > 0);
      const invested = isInvesting ? recurringInvestment : 0;

      const last = acc[acc.length - 1];
      const totalInvestment = add(last.totalInvestment, invested);
      const interest = mul(last.value, monthlyInterestCoefficient);
      const value = add(add(last.value, interest), invested);

      acc.push({ month: monthIndex + 1, totalInvestment, invested, value });
      return acc;
    },
    [
      {
        month: 0,
        invested: initialInvestment,
        totalInvestment: initialInvestment,
        value: initialInvestment,
      },
    ]
  );

  return result;
};
