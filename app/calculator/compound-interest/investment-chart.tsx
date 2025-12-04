"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TAB_COLORS } from "./constants";
import type { FormValues } from "./investment-card";

interface InvestmentChartProps {
  chartData: Array<{ year: number; [key: string]: number | string }>;
  investments: FormValues["investments"] | undefined;
}

export function InvestmentChart({
  chartData,
  investments,
}: InvestmentChartProps) {
  if (!chartData.length || !investments || investments.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-8xl">
      <Card>
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
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  color: "var(--foreground)",
                }}
              />
              <Legend />
              {investments.map((investment, index) => {
                const colors = TAB_COLORS[index % TAB_COLORS.length];
                const hexColor = colors.bg.replace("bg-[", "").replace("]", "");
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
  );
}

