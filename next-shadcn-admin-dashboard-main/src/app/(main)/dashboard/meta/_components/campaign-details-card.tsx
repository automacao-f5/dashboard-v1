import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, TrendingUp, Users, DollarSign } from "lucide-react";

interface CampaignDetailsProps {
  campaign: {
    id: string;
    name: string;
    status: string;
    objective?: string;
    daily_budget?: string;
    start_time?: string;
  };
}

export function CampaignDetailsCard({ campaign }: CampaignDetailsProps) {
  // Dados simulados de insights detalhados
  const detailedInsights = {
    reach: "45.234",
    frequency: "2.3",
    impressions: "104.038",
    clicks: "3.121",
    ctr: "3.00%",
    cpc: "R$ 2,85",
    spend: "R$ 8.895,00",
    conversions: "156",
    costPerConversion: "R$ 57,02",
    roas: "4.2x",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const formatBudget = (budget?: string) => {
    if (!budget) return "-";
    const value = parseInt(budget) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{campaign.name}</CardTitle>
            <CardDescription>ID: {campaign.id}</CardDescription>
          </div>
          <Badge variant={campaign.status === "ACTIVE" ? "default" : "secondary"}>
            {campaign.status === "ACTIVE" ? "Ativa" : "Pausada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-2">
            <Target className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Objetivo</p>
              <p className="text-muted-foreground text-sm">
                {campaign.objective === "OUTCOME_SALES" ? "Vendas" : campaign.objective}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Orçamento Diário</p>
              <p className="text-muted-foreground text-sm">{formatBudget(campaign.daily_budget)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Data de Início</p>
              <p className="text-muted-foreground text-sm">{formatDate(campaign.start_time)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-muted-foreground h-4 w-4" />
            <div>
              <p className="text-sm font-medium">ROAS</p>
              <p className="text-muted-foreground text-sm">{detailedInsights.roas}</p>
            </div>
          </div>
        </div>

        {/* Métricas de Alcance */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Alcance e Engajamento</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Alcance</p>
              <p className="text-2xl font-bold">{detailedInsights.reach}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Frequência</p>
              <p className="text-2xl font-bold">{detailedInsights.frequency}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Impressões</p>
              <p className="text-2xl font-bold">{detailedInsights.impressions}</p>
            </div>
          </div>
        </div>

        {/* Métricas de Cliques */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Cliques e Conversões</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Cliques</p>
              <p className="text-2xl font-bold">{detailedInsights.clicks}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">CTR</p>
              <p className="text-2xl font-bold">{detailedInsights.ctr}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Conversões</p>
              <p className="text-2xl font-bold">{detailedInsights.conversions}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Custo/Conv.</p>
              <p className="text-2xl font-bold">{detailedInsights.costPerConversion}</p>
            </div>
          </div>
        </div>

        {/* Métricas de Custo */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Investimento</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">Gasto Total</p>
              <p className="text-2xl font-bold">{detailedInsights.spend}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-muted-foreground text-sm">CPC Médio</p>
              <p className="text-2xl font-bold">{detailedInsights.cpc}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
