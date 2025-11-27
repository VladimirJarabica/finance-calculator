"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FormValues = {
  initialInvestment: string;
  isYearly: boolean;
  recurringInvestment: string;
  percentageReturn: string;
};

export function CompoundInterestCalculator() {
  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      initialInvestment: "",
      isYearly: false,
      recurringInvestment: "",
      percentageReturn: "",
    },
  });

  const isYearly = watch("isYearly");

  return (
    <Card className="w-full max-w-md">
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
  );
}
