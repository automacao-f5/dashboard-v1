"use client";

import { FunnelChart, Funnel, LabelList } from "recharts";

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

import { salesFunnelChartConfig, funnelStepLabels, funnelStepColors } from "./funnel.config";

interface FunnelStep {
  stepName: string;
  activeUsers: number;
  completionRate?: number;
}

interface FunnelSummary {
  totalEntries: number;
  totalConversions: number;
  overallConversionRate: string;
  dropOffRate: string;
}

interface SalesFunnelProps {
  data?: {
    steps: FunnelStep[];
    summary: FunnelSummary;
  };
  isLoading?: boolean;
}

export function SalesFunnel({ data, isLoading }: SalesFunnelProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="h-80">
          <Skeleton className="size-full" />
        </CardContent>
      </Card>
    );
  }

  // Transformar dados para o formato do FunnelChart
  const chartData = (data?.steps || []).map((step, index) => ({
    stage: funnelStepLabels[step.stepName] || step.stepName,
    value: step.activeUsers,
    fill: funnelStepColors[index % funnelStepColors.length],
  }));

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Funil de Vendas</CardTitle>
        <CardDescription>Conversão geral: {data?.summary.overallConversionRate || "0"}%</CardDescription>
      </CardHeader>
      <CardContent className="size-full min-h-[300px]">
        {chartData.length > 0 ? (
          <ChartContainer config={salesFunnelChartConfig} className="size-full">
            <FunnelChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <Funnel className="stroke-card stroke-2" dataKey="value" data={chartData}>
                <LabelList className="fill-foreground stroke-0 text-xs" dataKey="stage" position="right" offset={10} />
                <LabelList
                  className="fill-foreground stroke-0 text-xs font-semibold tabular-nums"
                  dataKey="value"
                  position="left"
                  offset={10}
                />
              </Funnel>
            </FunnelChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">Nenhum dado disponível</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <div className="w-full space-y-3">
          {(data?.steps || []).slice(0, 5).map((step, index) => {
            const nextStep = data?.steps[index + 1];
            const dropOff = nextStep ? ((step.activeUsers - nextStep.activeUsers) / step.activeUsers) * 100 : 0;

            return (
              <div key={step.stepName} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{funnelStepLabels[step.stepName] || step.stepName}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold tabular-nums">{step.activeUsers.toLocaleString()}</span>
                    {dropOff > 0 && <span className="text-xs text-red-500 tabular-nums">-{dropOff.toFixed(1)}%</span>}
                  </div>
                </div>
                <Progress value={(step.activeUsers / (data?.summary.totalEntries || 1)) * 100} className="h-2" />
              </div>
            );
          })}
        </div>
        <div className="text-muted-foreground flex w-full justify-between border-t pt-4 text-xs">
          <span>Entradas: {data?.summary.totalEntries?.toLocaleString() || 0}</span>
          <span>Conversões: {data?.summary.totalConversions?.toLocaleString() || 0}</span>
          <span>Drop-off: {data?.summary.dropOffRate || "0"}%</span>
        </div>
      </CardFooter>
    </Card>
  );
}
