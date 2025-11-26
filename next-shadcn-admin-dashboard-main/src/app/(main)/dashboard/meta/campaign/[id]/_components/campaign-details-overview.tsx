import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MousePointerClick, TrendingUp, Users } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface Insights {
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
}

interface CampaignDetailsOverviewProps {
  campaign: Campaign;
  insights?: Insights;
}

export function CampaignDetailsOverview({ campaign, insights }: CampaignDetailsOverviewProps) {
  const formatNumber = (num?: string) => {
    if (!num) return "0";
    return parseInt(num).toLocaleString("pt-BR");
  };

  const formatCurrency = (value?: string) => {
    if (!value) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(value));
  };

  const formatPercentage = (value?: string) => {
    if (!value) return "0%";
    const num = parseFloat(value);
    return num > 1 ? `${num.toFixed(2)}%` : `${(num * 100).toFixed(2)}%`;
  };

  const frequency = insights?.impressions && insights?.reach
    ? (parseInt(insights.impressions) / parseInt(insights.reach)).toFixed(2)
    : "0";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Métricas de Alcance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Métricas de Alcance
          </CardTitle>
          <CardDescription>
            Quantas pessoas viram seus anúncios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Impressões</span>
            <span className="text-2xl font-bold">{formatNumber(insights?.impressions)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Alcance</span>
            <span className="text-2xl font-bold">{formatNumber(insights?.reach)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Frequência</span>
            <span className="text-2xl font-bold">{frequency}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">CPM</span>
              <span className="text-lg font-semibold">{formatCurrency(insights?.cpm)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Engajamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="h-5 w-5" />
            Métricas de Engajamento
          </CardTitle>
          <CardDescription>
            Como as pessoas interagem com seus anúncios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cliques</span>
            <span className="text-2xl font-bold">{formatNumber(insights?.clicks)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CTR</span>
            <span className="text-2xl font-bold">{formatPercentage(insights?.ctr)}</span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">CPC</span>
              <span className="text-lg font-semibold">{formatCurrency(insights?.cpc)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo de Gastos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Resumo de Gastos
          </CardTitle>
          <CardDescription>
            Investimento e eficiência da campanha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Gasto Total</span>
            <span className="text-2xl font-bold">{formatCurrency(insights?.spend)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Custo por Clique</span>
            <span className="text-lg font-semibold">{formatCurrency(insights?.cpc)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Custo por Mil Impressões</span>
            <span className="text-lg font-semibold">{formatCurrency(insights?.cpm)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Informações da Campanha */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Informações da Campanha
          </CardTitle>
          <CardDescription>
            Detalhes e configurações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-lg font-semibold">
              {campaign.status === "ACTIVE" ? "Ativa" : "Pausada"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Orçamento Diário</span>
            <span className="text-lg font-semibold">
              {campaign.daily_budget
                ? formatCurrency((parseInt(campaign.daily_budget) / 100).toString())
                : "Não definido"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Data de Início</span>
            <span className="text-sm">
              {campaign.start_time
                ? new Date(campaign.start_time).toLocaleDateString("pt-BR")
                : "Não definida"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
