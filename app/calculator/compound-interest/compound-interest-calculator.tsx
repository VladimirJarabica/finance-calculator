"use client";

import { useState, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { compoundInterest } from "@/app/formulas/compound-interest";
import { formatNumber } from "@/lib/utils";
import { InvestmentTabs } from "./investment-tabs";
import { InvestmentPeriodSlider } from "./investment-period-slider";
import { InvestmentChart } from "./investment-chart";
import { ResultsTable } from "./results-table";
import { DEFAULT_INVESTMENTS } from "./constants";
import type { FormValues } from "./investment-card";

export function CompoundInterestCalculator() {
  const [years, setYears] = useState(5);
  const [activeTab, setActiveTab] = useState(0);

  const { register, setValue, control } = useForm<FormValues>({
    defaultValues: {
      investments: DEFAULT_INVESTMENTS,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "investments",
  });

  const addInvestment = () => {
    append({
      name: `Investment ${fields.length + 1}`,
      initialInvestment: "0",
      isYearly: false,
      recurringInvestment: "0",
      percentageReturn: "7",
    });
    setActiveTab(fields.length);
  };

  const removeInvestment = (index: number) => {
    if (fields.length <= 1) return; // Keep at least one
    remove(index);
    if (activeTab >= fields.length - 1) {
      setActiveTab(Math.max(0, fields.length - 2));
    }
  };

  const investments = useWatch({ control, name: "investments" });

  // Calculate results for all investments
  const allResults = useMemo(() => {
    if (!investments) return [];
    return investments.map((investment) =>
      compoundInterest({
        initialInvestment: formatNumber(investment.initialInvestment) ?? 0,
        isYearly: investment.isYearly,
        recurringInvestment: formatNumber(investment.recurringInvestment) ?? 0,
        percentageReturn: formatNumber(investment.percentageReturn) ?? 0,
        months: years * 12,
      })
    );
  }, [investments, years]);

  // Calculate result for the active investment
  const activeInvestment = investments?.[activeTab];
  const result = allResults[activeTab] || [];

  // Prepare chart data - show yearly values for all investments
  const chartData = useMemo(() => {
    if (!investments || investments.length === 0) return [];

    const data: Array<{ year: number; [key: string]: number | string }> = [];

    for (let year = 0; year <= years; year++) {
      const month = year * 12;
      const entry: { year: number; [key: string]: number | string } = {
        year,
      };

      allResults.forEach((result, index) => {
        const yearData = result.find((r) => r.month === month);
        if (yearData && investments?.[index]) {
          entry[investments[index].name] = yearData.value;
        }
      });

      data.push(entry);
    }

    return data;
  }, [allResults, investments, years]);

  return (
    <div className="flex flex-col items-center w-full space-y-6">
      <div className="w-full max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Compound Interest Calculator</h1>

        <InvestmentTabs
          fields={fields}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          investments={investments}
          control={control}
          register={register}
          setValue={setValue}
          onAddInvestment={addInvestment}
          onRemoveInvestment={removeInvestment}
        />

        <InvestmentPeriodSlider years={years} onYearsChange={setYears} />
      </div>

      <InvestmentChart chartData={chartData} investments={investments} />

      <div className="w-full max-w-3xl space-y-6">
        <ResultsTable result={result} investmentName={activeInvestment?.name} />
      </div>
    </div>
  );
}
