"use client";

import { TrendingUp, TrendingDown, Users, MousePointerClick, Eye, Target } from "lucide-react";
import { Area, AreaChart, Line, LineChart, Bar, BarChart, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OverviewData {
  totalUsers?: number;
  totalSessions?: number;
  totalPageviews?: number;
  avgSessionDuration?: number;
  bounceRate?: number;
  conversionRate?: number;
  usersTrend?: Array<{ date: string; users: number }>;
  sessionsTrend?: Array<{ date: string; sessions: number }>;
  previousPeriodComparison?: {
    usersChange: number;
    sessionsChange: number;
    pageviewsChange: number;
  };
}

interface AnalyticsOverviewCardsProps {
  data?: OverviewData;
  isLoading?: boolean;
}

const chartConfig = {
  users: { label: "Usuários", color: "hsl(var(--chart-1))" },
  sessions: { label: "Sessões", color: "hsl(var(--chart-2))" },
  pageviews: { label: "Visualizações", color: "hsl(var(--chart-3))" },
};

export function AnalyticsOverviewCards({ data, isLoading }: AnalyticsOverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const usersChange = data?.previousPeriodComparison?.usersChange || 0;
  const sessionsChange = data?.previousPeriodComparison?.sessionsChange || 0;
  const pageviewsChange = data?.previousPeriodComparison?.pageviewsChange || 0;

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    return new Intl.NumberFormat("pt-BR").format(num);
  };

  const formatPercentage = (num: number) => {
    const formatted = Math.abs(num).toFixed(1);
    return num >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const usersTrendData =
    data?.usersTrend?.slice(-7).map((item) => ({
      date: new Date(item.date).getDate().toString(),
      users: item.users,
    })) || [];

  const sessionsTrendData =
    data?.sessionsTrend?.slice(-7).map((item) => ({
      date: new Date(item.date).getDate().toString(),
      sessions: item.sessions,
    })) || [];

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {/* Total Users */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Totais</CardTitle>
          <CardDescription>Últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent className="size-full">
          <ChartContainer className="size-full min-h-24" config={chartConfig}>
            <BarChart accessibilityLayer data={usersTrendData} barSize={8}>
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                background={{ fill: "var(--color-background)", radius: 4, opacity: 0.07 }}
                dataKey="users"
                fill="var(--color-users)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-xl font-semibold tabular-nums">{formatNumber(data?.totalUsers)}</span>
          <span
            className={cn(
              "text-sm font-medium",
              usersChange >= 0 ? "text-green-500" : "text-destructive"
            )}
          >
            {formatPercentage(usersChange)}
          </span>
        </CardFooter>
      </Card>

      {/* Total Sessions */}
      <Card className="overflow-hidden pb-0">
        <CardHeader>
          <CardTitle>Sessões Totais</CardTitle>
          <CardDescription>Últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ChartContainer className="size-full min-h-24" config={chartConfig}>
            <AreaChart
              data={sessionsTrendData}
              margin={{
                left: 0,
                right: 0,
                top: 5,
              }}
            >
              <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} hide />
              <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
              <Area
                dataKey="sessions"
                fill="var(--color-sessions)"
                fillOpacity={0.05}
                stroke="var(--color-sessions)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-4">
          <span className="text-xl font-semibold tabular-nums">{formatNumber(data?.totalSessions)}</span>
          <span
            className={cn(
              "text-sm font-medium",
              sessionsChange >= 0 ? "text-green-500" : "text-destructive"
            )}
          >
            {formatPercentage(sessionsChange)}
          </span>
        </CardFooter>
      </Card>

      {/* Page Views */}
      <Card>
        <CardHeader>
          <div className="w-fit rounded-lg bg-blue-500/10 p-2">
            <Eye className="size-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>Visualizações</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </div>
          <p className="text-2xl font-medium tabular-nums">{formatNumber(data?.totalPageviews)}</p>
          <div
            className={cn(
              "w-fit rounded-md px-2 py-1 text-xs font-medium",
              pageviewsChange >= 0 ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
            )}
          >
            {formatPercentage(pageviewsChange)}
          </div>
        </CardContent>
      </Card>

      {/* Bounce Rate */}
      <Card>
        <CardHeader>
          <div className="bg-orange-500/10 w-fit rounded-lg p-2">
            <TrendingDown className="size-5 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent className="flex size-full flex-col justify-between">
          <div className="space-y-1.5">
            <CardTitle>Taxa de Rejeição</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </div>
          <p className="text-2xl font-medium tabular-nums">
            {data?.bounceRate ? `${data.bounceRate.toFixed(1)}%` : "0%"}
          </p>
          <div className="text-muted-foreground text-xs">Menor é melhor</div>
        </CardContent>
      </Card>

      {/* Session Duration & Conversion Rate */}
      <Card className="col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Métricas de Engajamento</CardTitle>
          <CardDescription>Duração média e taxa de conversão</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MousePointerClick className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Duração Média</span>
            </div>
            <p className="text-2xl font-semibold tabular-nums">
              {data?.avgSessionDuration
                ? `${Math.floor(data.avgSessionDuration / 60)}:${(data.avgSessionDuration % 60).toFixed(0).padStart(2, "0")}`
                : "0:00"}
            </p>
            <span className="text-xs text-muted-foreground">minutos por sessão</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
            </div>
            <p className="text-2xl font-semibold tabular-nums">
              {data?.conversionRate ? `${data.conversionRate.toFixed(2)}%` : "0%"}
            </p>
            <span className="text-xs text-muted-foreground">conversões / sessões</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
