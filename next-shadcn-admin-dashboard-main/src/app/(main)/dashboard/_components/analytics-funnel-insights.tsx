"use client";

import { FunnelChart, Funnel, LabelList, Pie, PieChart, Label } from "recharts";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface FunnelStep {
  stage: string;
  value: number;
  fill: string;
}

interface TrafficSource {
  source: string;
  users: number;
  fill: string;
}

interface FunnelInsightsProps {
  funnelData?: FunnelStep[];
  trafficData?: TrafficSource[];
  isLoading?: boolean;
}

const funnelChartConfig = {
  value: { label: "Usuários" },
};

const defaultFunnelData: FunnelStep[] = [
  { stage: "Visitantes", value: 0, fill: "hsl(var(--chart-1))" },
  { stage: "Engajados", value: 0, fill: "hsl(var(--chart-2))" },
  { stage: "Conversões", value: 0, fill: "hsl(var(--chart-3))" },
];

const trafficChartConfig = {
  organic: { label: "Orgânico", color: "hsl(var(--chart-1))" },
  direct: { label: "Direto", color: "hsl(var(--chart-2))" },
  social: { label: "Social", color: "hsl(var(--chart-3))" },
  referral: { label: "Referência", color: "hsl(var(--chart-4))" },
  paid: { label: "Pago", color: "hsl(var(--chart-5))" },
};

export function AnalyticsFunnelInsights({ funnelData, trafficData, isLoading }: FunnelInsightsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
        <Card className="col-span-1 xl:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const funnel = funnelData || defaultFunnelData;
  const totalTraffic = trafficData?.reduce((acc, curr) => acc + curr.users, 0) || 0;

  // Calcular taxa de conversão do funil
  const conversionRate = funnel[0]?.value > 0 
    ? ((funnel[funnel.length - 1]?.value / funnel[0]?.value) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 xl:grid-cols-5">
      {/* Funnel Chart */}
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do usuário até conversão</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <ChartContainer config={funnelChartConfig} className="size-full min-h-48">
            <FunnelChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Funnel className="stroke-card stroke-2" dataKey="value" data={funnel}>
                <LabelList className="fill-foreground stroke-0 text-xs" dataKey="stage" position="right" offset={10} />
                <LabelList className="fill-foreground stroke-0 text-xs" dataKey="value" position="left" offset={10} />
              </Funnel>
            </FunnelChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-xs">
            Taxa de conversão: {conversionRate}% • Do topo ao fundo do funil
          </p>
        </CardFooter>
      </Card>

      {/* Traffic Sources */}
      <Card className="col-span-1 xl:col-span-3">
        <CardHeader>
          <CardTitle>Fontes de Tráfego</CardTitle>
          <CardDescription>Origem dos visitantes</CardDescription>
        </CardHeader>
        <CardContent className="max-h-48">
          {trafficData && trafficData.length > 0 ? (
            <ChartContainer config={trafficChartConfig} className="size-full">
              <PieChart
                className="m-0"
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={trafficData}
                  dataKey="users"
                  nameKey="source"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={2}
                  cornerRadius={4}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold tabular-nums"
                            >
                              {totalTraffic.toLocaleString("pt-BR")}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground text-sm">
                              Visitantes
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                  content={() => (
                    <ul className="ml-8 flex flex-col gap-3">
                      {trafficData.map((item) => {
                        const percentage = totalTraffic > 0 ? ((item.users / totalTraffic) * 100).toFixed(1) : "0.0";
                        return (
                          <li key={item.source} className="flex w-40 items-center justify-between">
                            <span className="flex items-center gap-2 capitalize">
                              <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                              {trafficChartConfig[item.source as keyof typeof trafficChartConfig]?.label || item.source}
                            </span>
                            <span className="tabular-nums text-xs text-muted-foreground">{percentage}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm" variant="outline" className="basis-1/2">
            Ver Relatório Completo
          </Button>
          <Button size="sm" variant="outline" className="basis-1/2">
            Exportar Dados
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
