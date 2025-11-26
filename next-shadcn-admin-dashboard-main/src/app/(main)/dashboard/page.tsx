"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { AnalyticsOverviewCards } from "./_components/analytics-overview-cards";
import { AnalyticsFunnelInsights } from "./_components/analytics-funnel-insights";
import { AnalyticsTrendsPages } from "./_components/analytics-trends-pages";

// Funções para buscar dados das APIs
async function fetchAnalyticsSummary(startDate: string, endDate: string) {
  const res = await fetch(`/api/analytics?startDate=${startDate}&endDate=${endDate}`);
  if (!res.ok) throw new Error("Failed to fetch analytics summary");
  return res.json();
}

async function fetchTrafficSources(startDate: string, endDate: string) {
  const res = await fetch(`/api/analytics/sources?startDate=${startDate}&endDate=${endDate}`);
  if (!res.ok) throw new Error("Failed to fetch traffic sources");
  return res.json();
}

async function fetchTrendData(startDate: string, endDate: string) {
  const res = await fetch(`/api/analytics/trend?startDate=${startDate}&endDate=${endDate}`);
  if (!res.ok) throw new Error("Failed to fetch trend data");
  return res.json();
}

async function fetchFunnelData(startDate: string, endDate: string) {
  const res = await fetch(`/api/analytics/funnel?startDate=${startDate}&endDate=${endDate}`);
  if (!res.ok) throw new Error("Failed to fetch funnel data");
  return res.json();
}

async function fetchPageviews(startDate: string, endDate: string) {
  const res = await fetch(`/api/analytics/pageviews?startDate=${startDate}&endDate=${endDate}`);
  if (!res.ok) throw new Error("Failed to fetch pageviews");
  return res.json();
}

// Presets de período
const dateRangePresets = [
  { label: "Últimos 7 dias", value: "7daysAgo", endValue: "today" },
  { label: "Últimos 14 dias", value: "14daysAgo", endValue: "today" },
  { label: "Últimos 30 dias", value: "30daysAgo", endValue: "today" },
  { label: "Últimos 90 dias", value: "90daysAgo", endValue: "today" },
  { label: "Este mês", value: "thisMonth", endValue: "today" },
  { label: "Mês passado", value: "lastMonth", endValue: "lastMonth" },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = React.useState({
    startDate: "30daysAgo",
    endDate: "today",
  });

  // Queries para buscar dados
  const summaryQuery = useQuery({
    queryKey: ["analytics-summary", dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchAnalyticsSummary(dateRange.startDate, dateRange.endDate),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });

  const sourcesQuery = useQuery({
    queryKey: ["traffic-sources", dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchTrafficSources(dateRange.startDate, dateRange.endDate),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const trendQuery = useQuery({
    queryKey: ["trend-data", dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchTrendData(dateRange.startDate, dateRange.endDate),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const funnelQuery = useQuery({
    queryKey: ["funnel-data", dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchFunnelData(dateRange.startDate, dateRange.endDate),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const pageviewsQuery = useQuery({
    queryKey: ["pageviews-data", dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchPageviews(dateRange.startDate, dateRange.endDate),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const handleDateRangeChange = (value: string) => {
    const preset = dateRangePresets.find((p) => p.value === value);
    if (preset) {
      setDateRange({
        startDate: preset.value,
        endDate: preset.endValue,
      });
    }
  };

  const handleRefresh = () => {
    summaryQuery.refetch();
    sourcesQuery.refetch();
    trendQuery.refetch();
    funnelQuery.refetch();
    pageviewsQuery.refetch();
  };

  const isRefetching =
    summaryQuery.isRefetching ||
    sourcesQuery.isRefetching ||
    trendQuery.isRefetching ||
    funnelQuery.isRefetching ||
    pageviewsQuery.isRefetching;

  // Preparar dados para os componentes
  const overviewData = React.useMemo(() => {
    if (!summaryQuery.data?.data || !trendQuery.data?.data) return undefined;

    const summary = summaryQuery.data.data;
    const trend = trendQuery.data.data;

    return {
      totalUsers: summary.totalUsers,
      totalSessions: summary.totalSessions,
      totalPageviews: summary.totalPageviews,
      avgSessionDuration: summary.avgSessionDuration,
      bounceRate: summary.bounceRate,
      conversionRate: summary.conversionRate,
      usersTrend: trend.daily,
      sessionsTrend: trend.daily,
      previousPeriodComparison: summary.previousPeriodComparison,
    };
  }, [summaryQuery.data, trendQuery.data]);

  const funnelData = React.useMemo(() => {
    if (!funnelQuery.data?.data) return undefined;
    return funnelQuery.data.data.steps;
  }, [funnelQuery.data]);

  const trafficData = React.useMemo(() => {
    if (!sourcesQuery.data?.data) return undefined;
    
    const sources = sourcesQuery.data.data;
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];

    return sources.map((source: any, index: number) => ({
      source: source.source.toLowerCase(),
      users: source.users,
      fill: colors[index % colors.length],
    }));
  }, [sourcesQuery.data]);

  const trendData = React.useMemo(() => {
    if (!trendQuery.data?.data) return undefined;
    return trendQuery.data.data.daily;
  }, [trendQuery.data]);

  const topPages = React.useMemo(() => {
    if (!pageviewsQuery.data?.data) return undefined;
    return pageviewsQuery.data.data.pages;
  }, [pageviewsQuery.data]);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Header com seletor de período */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de Analytics</h1>
          <p className="text-muted-foreground">
            Visão geral completa do desempenho com dados reais do Google Analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange.startDate} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-48">
              <CalendarDays className="mr-2 size-4" />
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {dateRangePresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefetching}>
            <RefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Cards de Overview */}
      <AnalyticsOverviewCards data={overviewData} isLoading={summaryQuery.isLoading || trendQuery.isLoading} />

      {/* Funil e Fontes de Tráfego */}
      <AnalyticsFunnelInsights
        funnelData={funnelData}
        trafficData={trafficData}
        isLoading={funnelQuery.isLoading || sourcesQuery.isLoading}
      />

      {/* Tendências e Páginas Principais */}
      <AnalyticsTrendsPages
        trendData={trendData}
        topPages={topPages}
        isLoading={trendQuery.isLoading || pageviewsQuery.isLoading}
      />
    </div>
  );
}
