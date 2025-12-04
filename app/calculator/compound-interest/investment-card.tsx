"use client";

import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type Investment = {
  name: string;
  initialInvestment: string;
  isYearly: boolean;
  recurringInvestment: string;
  percentageReturn: string;
};

export type FormValues = {
  investments: Investment[];
};

type InvestmentCardProps = {
  index: number;
  control: Control<FormValues>;
  register: UseFormRegister<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

export function InvestmentCard({
  index,
  control,
  register,
  setValue,
}: InvestmentCardProps) {
  const investment = useWatch({
    control,
    name: `investments.${index}`,
  });

  const isYearly = investment?.isYearly ?? false;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`investments.${index}.name`}>Name</Label>
        <Input
          id={`investments.${index}.name`}
          type="text"
          placeholder="Investment name"
          {...register(`investments.${index}.name`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`investments.${index}.initialInvestment`}>
          Initial Investment
        </Label>
        <Input
          id={`investments.${index}.initialInvestment`}
          type="number"
          placeholder="0"
          {...register(`investments.${index}.initialInvestment`)}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor={`investments.${index}.isYearly`}>
          {isYearly ? "Yearly" : "Monthly"} Investment
        </Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Monthly</span>
          <Switch
            id={`investments.${index}.isYearly`}
            checked={isYearly}
            onCheckedChange={(checked) => {
              setValue(`investments.${index}.isYearly`, checked);
            }}
          />
          <span className="text-sm text-muted-foreground">Yearly</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`investments.${index}.recurringInvestment`}>
          {isYearly ? "Yearly" : "Monthly"} Investment Amount
        </Label>
        <Input
          id={`investments.${index}.recurringInvestment`}
          type="number"
          placeholder="0"
          {...register(`investments.${index}.recurringInvestment`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`investments.${index}.percentageReturn`}>
          Annual Return (%)
        </Label>
        <Input
          id={`investments.${index}.percentageReturn`}
          type="number"
          placeholder="0"
          step="0.1"
          {...register(`investments.${index}.percentageReturn`)}
        />
      </div>
    </div>
  );
}
