"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { YEAR_STEPS } from "./constants";

interface InvestmentPeriodSliderProps {
  years: number;
  onYearsChange: (years: number) => void;
}

export function InvestmentPeriodSlider({
  years,
  onYearsChange,
}: InvestmentPeriodSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Investment Period</Label>
        <span className="text-sm font-medium">
          {years} {years === 1 ? "year" : "years"}
        </span>
      </div>
      <Slider
        value={[YEAR_STEPS.indexOf(years)]}
        onValueChange={([index]) => onYearsChange(YEAR_STEPS[index])}
        max={YEAR_STEPS.length - 1}
        step={1}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span>40</span>
      </div>
    </div>
  );
}

