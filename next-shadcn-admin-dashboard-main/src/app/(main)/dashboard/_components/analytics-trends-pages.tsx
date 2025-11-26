"use client";

import { TrendingUp, ExternalLink, ChevronRight } from "lucide-react";
import { Area, AreaChart, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";

import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TrendDataPoint {
  date: string;
  users: number;
  sessions: number;
  pageviews: number;
}

interface TopPage {
  path: string;
  views: number;
  users: number;
  avgTime: number;
  bounceRate: number;
}

interface TrendsPagesProps {
  trendData?: TrendDataPoint[];
  topPages?: TopPage[];
  isLoading?: boolean;
}

const chartConfig = {
  users: {
    label: "Usuários",
    color: "hsl(var(--chart-1))",
  },
  sessions: {
    label: "Sessões",
    color: "hsl(var(--chart-2))",
  },
  pageviews: {
    label: "Visualizações",
    color: "hsl(var(--chart-3))",
  },
};

export function AnalyticsTrendsPages({ trendData, topPages, isLoading }: TrendsPagesProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs xl:grid-cols-3">
        <Card className="col-span-1 xl:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const formattedTrendData = trendData?.map((item) => ({
    ...item,
    dateFormatted: formatDate(item.date),
  }));

  // Calcular crescimento
  const growth = trendData && trendData.length > 1
    ? (((trendData[trendData.length - 1].users - trendData[0].users) / trendData[0].users) * 100).toFixed(1)
    : "0.0";

  const totalPages = topPages?.reduce((sum, page) => sum + page.views, 0) || 0;

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs xl:grid-cols-3">
      {/* Trend Chart */}
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Tendência de Tráfego</CardTitle>
          <CardDescription>Evolução dos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart
              data={formattedTrendData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
              <XAxis
                dataKey="dateFormatted"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-sessions)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-sessions)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                dataKey="users"
                type="monotone"
                fill="url(#fillUsers)"
                stroke="var(--color-users)"
                strokeWidth={2}
                stackId="1"
              />
              <Area
                dataKey="sessions"
                type="monotone"
                fill="url(#fillSessions)"
                stroke="var(--color-sessions)"
                strokeWidth={2}
                stackId="2"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center gap-2">
          <TrendingUp className={cn("size-4", parseFloat(growth) >= 0 ? "text-green-500" : "text-destructive")} />
          <p className="text-muted-foreground text-xs">
            {parseFloat(growth) >= 0 ? "Crescimento" : "Redução"} de{" "}
            <span className={cn("font-medium", parseFloat(growth) >= 0 ? "text-green-500" : "text-destructive")}>
              {Math.abs(parseFloat(growth))}%
            </span>{" "}
            no período
          </p>
        </CardFooter>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Páginas Mais Visitadas</CardTitle>
          <CardDescription className="font-medium tabular-nums">
            {totalPages.toLocaleString("pt-BR")} visualizações totais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPages && topPages.length > 0 ? (
              topPages.slice(0, 8).map((page, index) => {
                const percentage = totalPages > 0 ? ((page.views / totalPages) * 100).toFixed(1) : "0.0";
                return (
                  <div key={page.path} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-xs font-medium">#{index + 1}</span>
                          <span className="text-sm font-medium truncate" title={page.path}>
                            {page.path === "/" ? "Página Inicial" : page.path}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {page.views.toLocaleString("pt-BR")} views
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {page.users.toLocaleString("pt-BR")} usuários
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold tabular-nums">{percentage}%</span>
                        <span
                          className={cn(
                            "text-xs tabular-nums",
                            page.bounceRate < 50 ? "text-green-500" : "text-orange-500"
                          )}
                        >
                          {page.bounceRate.toFixed(0)}% bounce
                        </span>
                      </div>
                    </div>
                    <Progress value={parseFloat(percentage)} className="h-1.5" />
                  </div>
                );
              })
            ) : (
              <div className="flex h-48 items-center justify-center">
                <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            Ver Todas as Páginas
            <ChevronRight className="ml-2 size-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
