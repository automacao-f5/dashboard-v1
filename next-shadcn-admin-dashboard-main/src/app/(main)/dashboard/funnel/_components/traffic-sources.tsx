"use client";

import { XAxis, Label, Pie, PieChart } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import { trafficSourcesChartConfig } from "./funnel.config";

interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  newUsers: number;
  bounceRate: number;
}

interface TrafficSourcesProps {
  data?: TrafficSource[];
  isLoading?: boolean;
}

// Mapear sources para cores e labels amigáveis
const sourceConfig: Record<string, { label: string; color: string }> = {
  facebook: { label: "Facebook", color: "var(--chart-1)" },
  instagram: { label: "Instagram", color: "var(--chart-2)" },
  google: { label: "Google", color: "var(--chart-3)" },
  "(direct)": { label: "Direto", color: "var(--chart-4)" },
  youtube: { label: "YouTube", color: "var(--chart-5)" },
  tiktok: { label: "TikTok", color: "var(--chart-1)" },
  other: { label: "Outros", color: "var(--chart-2)" },
};

function getSourceConfig(source: string) {
  const lowerSource = source.toLowerCase();
  for (const [key, config] of Object.entries(sourceConfig)) {
    if (lowerSource.includes(key)) {
      return config;
    }
  }
  return { label: source, color: "var(--chart-5)" };
}

export function TrafficSources({ data, isLoading }: TrafficSourcesProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="h-64">
          <Skeleton className="size-full" />
        </CardContent>
      </Card>
    );
  }

  // Agrupar dados por source e transformar para o formato do PieChart
  const groupedData = (data || []).reduce(
    (acc, item) => {
      const config = getSourceConfig(item.source);
      const existing = acc.find((d) => d.label === config.label);
      if (existing) {
        existing.sessions += item.sessions;
        existing.users += item.users;
      } else {
        acc.push({
          source: item.source,
          label: config.label,
          sessions: item.sessions,
          users: item.users,
          fill: config.color,
        });
      }
      return acc;
    },
    [] as { source: string; label: string; sessions: number; users: number; fill: string }[],
  );

  const totalSessions = groupedData.reduce((acc, curr) => acc + curr.sessions, 0);

  // Ordenar por sessões e pegar os top 5
  const chartData = groupedData.sort((a, b) => b.sessions - a.sessions).slice(0, 5);

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle>Fontes de Tráfego</CardTitle>
        <CardDescription>Origem dos visitantes</CardDescription>
      </CardHeader>
      <CardContent className="max-h-64">
        {chartData.length > 0 ? (
          <ChartContainer config={trafficSourcesChartConfig} className="size-full">
            <PieChart
              className="m-0"
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, props) => (
                      <div className="flex items-center gap-2">
                        <span>{props.payload.label}</span>
                        <span className="font-semibold tabular-nums">{Number(value).toLocaleString()}</span>
                        <span className="text-muted-foreground">
                          ({((Number(value) / totalSessions) * 100).toFixed(1)}%)
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="sessions"
                nameKey="label"
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
                            {totalSessions.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 24} className="fill-muted-foreground">
                            Sessões
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
                    {chartData.map((item) => (
                      <li key={item.label} className="flex w-40 items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="size-2.5 rounded-full" style={{ background: item.fill }} />
                          {item.label}
                        </span>
                        <span className="font-medium tabular-nums">{item.sessions.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex size-full items-center justify-center">Nenhum dado disponível</div>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" variant="outline" className="basis-1/2">
          Ver Relatório Completo
        </Button>
        <Button size="sm" variant="outline" className="basis-1/2">
          Exportar CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
