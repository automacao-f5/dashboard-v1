import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  getMetaCampaigns,
  getCampaignInsights,
  getCampaignDemographics,
  getCampaignGeographics,
  getCampaignDeviceBreakdown,
  getCampaignPlatformBreakdown,
} from "../../_actions/meta-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignDetailsOverview } from "./_components/campaign-details-overview";
import { CampaignPerformanceTab } from "./_components/campaign-performance-tab";
import { CampaignAudienceTab } from "./_components/campaign-audience-tab";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CampaignDetailsPage({ params }: PageProps) {
  // Await params antes de usar (Next.js 15+)
  const { id } = await params;

  // Busca todas as campanhas
  const campaignsData = await getMetaCampaigns(100);

  // Encontra a campanha específica
  const campaign = campaignsData.campaigns.find((c) => c.id === id);

  if (!campaign) {
    notFound();
  }

  // Busca insights da campanha
  const insightsData = await getCampaignInsights(id, "last_30d");
  const insights = insightsData?.insights;

  // Busca dados demográficos e geográficos
  const [demographics, geographics, devices, platforms] = await Promise.all([
    getCampaignDemographics(id, "last_30d"),
    getCampaignGeographics(id, "last_30d"),
    getCampaignDeviceBreakdown(id, "last_30d"),
    getCampaignPlatformBreakdown(id, "last_30d"),
  ]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ACTIVE: "default",
      PAUSED: "secondary",
      DELETED: "destructive",
      ARCHIVED: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status === "ACTIVE" ? "Ativa" : status === "PAUSED" ? "Pausada" : status}
      </Badge>
    );
  };

  const getObjectiveLabel = (objective?: string) => {
    const labels: Record<string, string> = {
      OUTCOME_SALES: "Vendas",
      OUTCOME_TRAFFIC: "Tráfego",
      OUTCOME_AWARENESS: "Reconhecimento",
      OUTCOME_ENGAGEMENT: "Engajamento",
      OUTCOME_LEADS: "Leads",
    };

    return objective ? labels[objective] || objective : "-";
  };

  const formatBudget = (budget?: string) => {
    if (!budget) return "-";
    const value = parseInt(budget) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/meta">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Campanhas
          </Button>
        </Link>

        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-muted-foreground">ID da Campanha: {campaign.id}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Objetivo</CardTitle>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getObjectiveLabel(campaign.objective)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orçamento Diário</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBudget(campaign.daily_budget)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Total</CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights?.spend
                ? new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(parseFloat(insights.spend))
                : "R$ 0,00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data de Início</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatDate(campaign.start_time)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with detailed information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Público</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <CampaignDetailsOverview campaign={campaign} insights={insights} />
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <CampaignPerformanceTab campaign={campaign} insights={insights} />
        </TabsContent>

        <TabsContent value="audience" className="mt-4">
          <CampaignAudienceTab
            campaign={campaign}
            insights={insights}
            demographics={demographics}
            geographics={geographics}
            devices={devices}
            platforms={platforms}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
