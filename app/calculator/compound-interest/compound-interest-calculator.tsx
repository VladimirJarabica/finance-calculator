"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type FormValues = {
  initialInvestment: string;
  isYearly: boolean;
  recurringInvestment: string;
  percentageReturn: string;
};

export function CompoundInterestCalculator() {
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
    months: 13,
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

      {result.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Month</TableHead>
                  <TableHead className="text-right">Invested</TableHead>
                  <TableHead className="text-right">Total Invested</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Gain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
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
