"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compoundInterest } from "@/app/formulas/compound-interest";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { InvestmentCard, type FormValues } from "./investment-card";

const YEAR_STEPS = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40];

const DEFAULT_INVESTMENTS = [
  {
    name: "Stocks",
    initialInvestment: "1000",
    isYearly: false,
    recurringInvestment: "100",
    percentageReturn: "10",
  },
  {
    name: "Bonds",
    initialInvestment: "500",
    isYearly: false,
    recurringInvestment: "50",
    percentageReturn: "5",
  },
  {
    name: "Gold",
    initialInvestment: "200",
    isYearly: false,
    recurringInvestment: "25",
    percentageReturn: "3",
  },
];

const TAB_COLORS = [
  { bg: "bg-[#5B8FF9]", border: "border-t-[#5B8FF9]", text: "text-white" }, // Blue
  { bg: "bg-[#5AD8A6]", border: "border-t-[#5AD8A6]", text: "text-gray-800" }, // Teal
  { bg: "bg-[#9270CA]", border: "border-t-[#9270CA]", text: "text-white" }, // Purple
  { bg: "bg-[#E8684A]", border: "border-t-[#E8684A]", text: "text-white" }, // Orange
  { bg: "bg-[#F6BD16]", border: "border-t-[#F6BD16]", text: "text-gray-800" }, // Yellow
];

export function CompoundInterestCalculator() {
  const [years, setYears] = useState(5);
  const [activeTab, setActiveTab] = useState(0);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  // Update tab refs array when fields change
  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, fields.length);
  }, [fields.length]);

  // Scroll active tab into view
  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement && tabsScrollRef.current) {
      activeTabElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab]);

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

        {/* Card file tabs */}
        <div className="relative">
          {/* Tabs */}
          <div
            ref={tabsScrollRef}
            className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <div className="flex items-end h-10 min-w-max pr-4">
              {fields.map((field, index) => {
                const isActive = activeTab === index;
                const colors = TAB_COLORS[index % TAB_COLORS.length];
                return (
                  <button
                    key={field.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    onClick={() => setActiveTab(index)}
                    className={cn(
                      "relative px-4 text-sm font-medium rounded-t-lg transition-all cursor-pointer shrink-0",
                      colors.bg,
                      colors.text,
                      isActive ? "py-2.5" : "py-1.5 hover:py-2"
                    )}
                    style={{
                      marginLeft: index > 0 ? "-4px" : 0,
                      zIndex: isActive ? 10 : fields.length - index,
                    }}
                  >
                    {investments?.[index]?.name || `Investment ${index + 1}`}
                  </button>
                );
              })}
              {/* Add button */}
              <button
                onClick={addInvestment}
                className="ml-2 px-3 cursor-pointer py-1.5 hover:pb-2 text-sm font-medium rounded-t-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all shrink-0"
              >
                +
              </button>
            </div>
          </div>

          {/* Active card content */}
          <Card
            className={cn(
              "rounded-tl-none border-t-4",
              TAB_COLORS[activeTab % TAB_COLORS.length].border
            )}
          >
            <CardContent className="pt-6">
              <InvestmentCard
                key={fields[activeTab]?.id}
                index={activeTab}
                control={control}
                register={register}
                setValue={setValue}
              />
              {fields.length > 1 && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeInvestment(activeTab)}
                  >
                    Remove Investment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Investment Period</Label>
            <span className="text-sm font-medium">
              {years} {years === 1 ? "year" : "years"}
            </span>
          </div>
          <Slider
            value={[YEAR_STEPS.indexOf(years)]}
            onValueChange={([index]) => setYears(YEAR_STEPS[index])}
            max={YEAR_STEPS.length - 1}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>40</span>
          </div>
        </div>

        {result.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Results ({activeInvestment?.name})</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View All Months
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Monthly Breakdown</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-auto flex-1">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Month</TableHead>
                          <TableHead className="text-right">Invested</TableHead>
                          <TableHead className="text-right">
                            Total Invested
                          </TableHead>
                          <TableHead className="text-right">Value</TableHead>
                          <TableHead className="text-right">Gain</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="font-medium">
                              {row.month}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(row.invested)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(row.totalInvestment)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(row.value)}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatCurrency(row.value - row.totalInvestment)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Year</TableHead>
                    <TableHead className="text-right">Invested</TableHead>
                    <TableHead className="text-right">Total Invested</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead className="text-right">Gain</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result
                    .filter((row) => row.month % 12 === 0)
                    .map((row) => (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">
                          {row.month / 12}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(row.invested)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(row.totalInvestment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(row.value)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(row.value - row.totalInvestment)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chart showing all investments */}
      {chartData.length > 0 && investments && investments.length > 0 && (
        <div className="w-full max-w-8xl">
          <Card>
            <CardHeader>
              <CardTitle>Investment Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: "Year",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Value ($)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tickFormatter={(value) => {
                      if (value >= 1000000)
                        return `$${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000)
                        return `$${(value / 1000).toFixed(0)}K`;
                      return `$${value.toFixed(0)}`;
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Legend />
                  {investments.map((investment, index) => {
                    const colors = TAB_COLORS[index % TAB_COLORS.length];
                    const hexColor = colors.bg
                      .replace("bg-[", "")
                      .replace("]", "");
                    return (
                      <Line
                        key={investment.name}
                        type="monotone"
                        dataKey={investment.name}
                        stroke={hexColor}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
