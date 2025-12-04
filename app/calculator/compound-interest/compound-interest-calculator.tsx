"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

const YEAR_STEPS = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40];

type FormValues = {
  initialInvestment: string;
  isYearly: boolean;
  recurringInvestment: string;
  percentageReturn: string;
};

export function CompoundInterestCalculator() {
  const [years, setYears] = useState(5);

  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      initialInvestment: "1000",
      isYearly: false,
      recurringInvestment: "",
      percentageReturn: "10",
    },
  });

  const isYearly = watch("isYearly");

  const result = compoundInterest({
    initialInvestment: formatNumber(watch("initialInvestment")) ?? 0,
    isYearly,
    recurringInvestment: formatNumber(watch("recurringInvestment")) ?? 0,
    percentageReturn: formatNumber(watch("percentageReturn")) ?? 0,
    months: years * 12,
  });

  return (
    <div className="w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compound Interest Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="initialInvestment">Initial Investment</Label>
              <Input
                id="initialInvestment"
                type="number"
                placeholder="0"
                {...register("initialInvestment")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isYearly">
                {isYearly ? "Yearly" : "Monthly"} Investment
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Monthly</span>
                <Switch
                  id="isYearly"
                  checked={isYearly}
                  onCheckedChange={(checked) => setValue("isYearly", checked)}
                />
                <span className="text-sm text-muted-foreground">Yearly</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recurringInvestment">
                {isYearly ? "Yearly" : "Monthly"} Investment Amount
              </Label>
              <Input
                id="recurringInvestment"
                type="number"
                placeholder="0"
                {...register("recurringInvestment")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentageReturn">Annual Return (%)</Label>
              <Input
                id="percentageReturn"
                type="number"
                placeholder="0"
                step="0.1"
                {...register("percentageReturn")}
              />
            </div>
          </form>
        </CardContent>
      </Card>

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
            <CardTitle>Results</CardTitle>
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
