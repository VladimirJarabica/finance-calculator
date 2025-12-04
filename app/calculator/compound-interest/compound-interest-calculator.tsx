"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

export function CompoundInterestCalculator() {
  const [years, setYears] = useState(5);

  const { register, watch, setValue, control } = useForm<FormValues>({
    defaultValues: {
      investments: DEFAULT_INVESTMENTS,
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "investments",
  });

  // Calculate result only for the first investment
  const firstInvestment = watch("investments.0");
  const result = firstInvestment
    ? compoundInterest({
        initialInvestment: formatNumber(firstInvestment.initialInvestment) ?? 0,
        isYearly: firstInvestment.isYearly,
        recurringInvestment:
          formatNumber(firstInvestment.recurringInvestment) ?? 0,
        percentageReturn: formatNumber(firstInvestment.percentageReturn) ?? 0,
        months: years * 12,
      })
    : [];

  return (
    <div className="w-full max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Compound Interest Calculator</h1>

      <div className="grid gap-4">
        {fields.map((field, index) => (
          <InvestmentCard
            key={field.id}
            index={index}
            control={control}
            register={register}
            setValue={setValue}
          />
        ))}
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
            <CardTitle>Results ({firstInvestment?.name})</CardTitle>
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
  );
}
