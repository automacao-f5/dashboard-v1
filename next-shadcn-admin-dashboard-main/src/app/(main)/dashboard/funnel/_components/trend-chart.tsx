"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { trendChartConfig } from "./funnel.config";

interface TrendData {
  date: string;
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  newUsers: number;
  engagementRate: number;
  averageSessionDuration: number;
}

interface TrendChartProps {
  data?: TrendData[];
  isLoading?: boolean;
}

type MetricKey = "sessions" | "activeUsers" | "screenPageViews";

export function TrendChart({ data, isLoading }: TrendChartProps) {
  const [activeMetric, setActiveMetric] = React.useState<MetricKey>("sessions");
  const [showAllMetrics, setShowAllMetrics] = React.useState(true);

  if (isLoading) {
    return (
      <Card className="@container/chart col-span-full">
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

  // Formatar datas para exibição
  const chartData = (data || []).map((item) => ({
    ...item,
    dateFormatted: format(parseISO(item.date), "dd/MM", { locale: ptBR }),
    dateFull: format(parseISO(item.date), "dd 'de' MMMM", { locale: ptBR }),
  }));

  // Calcular totais
  const totals = {
    sessions: chartData.reduce((acc, d) => acc + d.sessions, 0),
    activeUsers: chartData.reduce((acc, d) => acc + d.activeUsers, 0),
    screenPageViews: chartData.reduce((acc, d) => acc + d.screenPageViews, 0),
  };

  return (
    <Card className="@container/chart col-span-full">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Tendência de Tráfego</CardTitle>
          <CardDescription>
            {chartData.length > 0 && (
              <>
                {chartData[0]?.dateFull} - {chartData[chartData.length - 1]?.dateFull}
              </>
            )}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={showAllMetrics ? "all" : activeMetric}
            onValueChange={(value) => {
              if (value === "all") {
                setShowAllMetrics(true);
              } else if (value) {
                setShowAllMetrics(false);
                setActiveMetric(value as MetricKey);
              }
            }}
            className="hidden @[500px]/chart:flex"
          >
            <ToggleGroupItem value="all" className="text-xs">
              Todas
            </ToggleGroupItem>
            <ToggleGroupItem value="sessions" className="text-xs">
              Sessões
            </ToggleGroupItem>
            <ToggleGroupItem value="activeUsers" className="text-xs">
              Usuários
            </ToggleGroupItem>
            <ToggleGroupItem value="screenPageViews" className="text-xs">
              Visualizações
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={showAllMetrics ? "all" : activeMetric}
            onValueChange={(value) => {
              if (value === "all") {
                setShowAllMetrics(true);
              } else {
                setShowAllMetrics(false);
                setActiveMetric(value as MetricKey);
              }
            }}
          >
            <SelectTrigger className="w-36 @[500px]/chart:hidden">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="sessions">Sessões</SelectItem>
              <SelectItem value="activeUsers">Usuários</SelectItem>
              <SelectItem value="screenPageViews">Visualizações</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {chartData.length > 0 ? (
          <ChartContainer config={trendChartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillActiveUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-activeUsers)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-activeUsers)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillScreenPageViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-screenPageViews)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-screenPageViews)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="dateFormatted" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      return payload?.[0]?.payload?.dateFull || value;
                    }}
                    indicator="dot"
                  />
                }
              />
              {(showAllMetrics || activeMetric === "screenPageViews") && (
                <Area
                  dataKey="screenPageViews"
                  type="monotone"
                  fill="url(#fillScreenPageViews)"
                  stroke="var(--color-screenPageViews)"
                  strokeWidth={2}
                  stackId="a"
                />
              )}
              {(showAllMetrics || activeMetric === "activeUsers") && (
                <Area
                  dataKey="activeUsers"
                  type="monotone"
                  fill="url(#fillActiveUsers)"
                  stroke="var(--color-activeUsers)"
                  strokeWidth={2}
                  stackId="a"
                />
              )}
              {(showAllMetrics || activeMetric === "sessions") && (
                <Area
                  dataKey="sessions"
                  type="monotone"
                  fill="url(#fillSessions)"
                  stroke="var(--color-sessions)"
                  strokeWidth={2}
                  stackId="a"
                />
              )}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="text-muted-foreground flex h-[300px] items-center justify-center">Nenhum dado disponível</div>
        )}
      </CardContent>
    </Card>
  );
}
