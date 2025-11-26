"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { OverviewCards } from "./_components/overview-cards";
import { SalesFunnel } from "./_components/sales-funnel";
import { TrafficSources } from "./_components/traffic-sources";
import { TrendChart } from "./_components/trend-chart";
import { CampaignsTable } from "./_components/campaigns-table";
import { dateRangePresets } from "./_components/funnel.config";

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

async function fetchCampaignData(startDate: string, endDate: string) {
  const res = await fetch(`/api/analytics/campaigns?startDate=${startDate}&endDate=${endDate}`);
  if (!res.ok) throw new Error("Failed to fetch campaign data");
  return res.json();
}

export default function FunnelPage() {
  const [dateRange, setDateRange] = React.useState({
    startDate: "30daysAgo",
    endDate: "today",
  });

  // Queries
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

  const campaignsQuery = useQuery({
    queryKey: ["campaigns-data", dateRange.startDate, dateRange.endDate],
    queryFn: () => fetchCampaignData(dateRange.startDate, dateRange.endDate),
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
    campaignsQuery.refetch();
  };

  const isLoading = summaryQuery.isLoading || sourcesQuery.isLoading || trendQuery.isLoading;
  const isRefetching = summaryQuery.isRefetching || sourcesQuery.isRefetching || trendQuery.isRefetching;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Header com seletor de período */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas</h1>
          <p className="text-muted-foreground">Análise completa do funil de conversão de infoprodutos</p>
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
      <OverviewCards data={summaryQuery.data?.data} isLoading={summaryQuery.isLoading} />

      {/* Gráfico de Tendência */}
      <TrendChart data={trendQuery.data?.data?.daily} isLoading={trendQuery.isLoading} />

      {/* Funil e Fontes de Tráfego */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <SalesFunnel data={funnelQuery.data?.data} isLoading={funnelQuery.isLoading} />
        <TrafficSources data={sourcesQuery.data?.data} isLoading={sourcesQuery.isLoading} />
      </div>

      {/* Tabela de Campanhas */}
      <CampaignsTable data={campaignsQuery.data?.data} isLoading={campaignsQuery.isLoading} />
    </div>
  );
}
