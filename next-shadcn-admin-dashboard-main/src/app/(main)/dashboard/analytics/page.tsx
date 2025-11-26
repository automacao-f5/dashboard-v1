import { Suspense } from "react";
import { HeroMetrics } from "./_components/hero-metrics";
import { FunnelChart } from "./_components/funnel-chart";
import { CampaignsTable } from "./_components/campaigns-table";
import {
  getConsolidatedMetrics,
  getFunnelData,
  getCampaignsPerformance,
} from "./_actions/analytics-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Visão consolidada de Meta Ads, Hotmart e Vturb para otimização do funil de vendas
        </p>
      </div>

      {/* Hero Metrics */}
      <Suspense fallback={<HeroMetricsSkeleton />}>
        <HeroMetricsSection />
      </Suspense>

      {/* Funnel Chart */}
      <Suspense fallback={<FunnelChartSkeleton />}>
        <FunnelChartSection />
      </Suspense>

      {/* Campaigns Table */}
      <Suspense fallback={<CampaignsTableSkeleton />}>
        <CampaignsTableSection />
      </Suspense>
    </div>
  );
}

async function HeroMetricsSection() {
  const data = await getConsolidatedMetrics("last_7d");
  return <HeroMetrics data={data} />;
}

async function FunnelChartSection() {
  const data = await getFunnelData("last_7d");
  return <FunnelChart data={data} />;
}

async function CampaignsTableSection() {
  const data = await getCampaignsPerformance("last_7d");
  return <CampaignsTable data={data} />;
}

// Skeletons
function HeroMetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FunnelChartSkeleton() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignsTableSkeleton() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Performance por Campanha</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
