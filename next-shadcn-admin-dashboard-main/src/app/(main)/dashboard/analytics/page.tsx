import { Suspense } from "react";
import { HeroMetrics } from "./_components/hero-metrics";
import { FunnelChart } from "./_components/funnel-chart";
import { CampaignsTable } from "./_components/campaigns-table";
import { VturbMetrics } from "./_components/vturb-metrics";
import {
  getConsolidatedMetrics,
  getFunnelData,
  getCampaignsPerformance,
  getVturbMetrics,
} from "./_actions/analytics-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="content">Conteúdo (Vturb)</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Hero Metrics */}
          <Suspense fallback={<HeroMetricsSkeleton />}>
            <HeroMetricsSection />
          </Suspense>

          {/* Funnel Chart */}
          <Suspense fallback={<FunnelChartSkeleton />}>
            <FunnelChartSection />
          </Suspense>
        </TabsContent>

        {/* Tab: Campanhas */}
        <TabsContent value="campaigns" className="space-y-6">
          <Suspense fallback={<CampaignsTableSkeleton />}>
            <CampaignsTableSection />
          </Suspense>
        </TabsContent>

        {/* Tab: Conteúdo (Vturb) */}
        <TabsContent value="content" className="space-y-6">
          <Suspense fallback={<VturbMetricsSkeleton />}>
            <VturbMetricsSection />
          </Suspense>
        </TabsContent>
      </Tabs>
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

async function VturbMetricsSection() {
  const data = await getVturbMetrics();
  return <VturbMetrics data={data} />;
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
            <Skeleton className="mb-2 h-8 w-24" />
            <Skeleton className="mb-2 h-3 w-full" />
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

function VturbMetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-8 w-20" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
