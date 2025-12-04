"use client";

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
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CompoundInterestResultItem } from "@/app/formulas/compound-interest";

interface ResultsTableProps {
  result: CompoundInterestResultItem[];
  investmentName?: string;
}

export function ResultsTable({ result, investmentName }: ResultsTableProps) {
  if (result.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Results ({investmentName})</CardTitle>
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
  );
}
