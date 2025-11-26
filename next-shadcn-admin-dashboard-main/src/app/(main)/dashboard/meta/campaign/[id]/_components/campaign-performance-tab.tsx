"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface Campaign {
  id: string;
  name: string;
  status: string;
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

interface DailyInsight {
  date: string;
  fullDate: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  cpc: number;
  cpm: number;
  ctr: number;
}

interface CampaignPerformanceTabProps {
  campaign: Campaign;
  insights?: Insights;
}

export function CampaignPerformanceTab({ campaign, insights }: CampaignPerformanceTabProps) {
  const [performanceData, setPerformanceData] = useState<DailyInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDailyInsights() {
      try {
        setLoading(true);
        const response = await fetch(`/api/meta/campaigns/${campaign.id}/insights?date_preset=last_7d`);

        if (!response.ok) {
          throw new Error("Erro ao buscar insights diários");
        }

        const data = await response.json();
        setPerformanceData(data.daily_insights || []);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar insights:", err);
        setError("Não foi possível carregar os dados de performance");
      } finally {
        setLoading(false);
      }
    }

    fetchDailyInsights();
  }, [campaign.id]);

  const metricsComparison = [
    {
      metric: "CTR",
      atual: parseFloat(insights?.ctr || "0"),
      media: 5.2,
    },
    {
      metric: "CPC",
      atual: parseFloat(insights?.cpc || "0"),
      media: 0.15,
    },
    {
      metric: "CPM",
      atual: parseFloat(insights?.cpm || "0"),
      media: 8.5,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gráfico de Tendência de Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tendência de Performance
          </CardTitle>
          <CardDescription>
            Evolução das métricas principais nos últimos 7 dias (dados reais da API Meta)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {performanceData.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">Nenhum dado disponível para o período selecionado</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="impressions"
                  stroke="#8884d8"
                  name="Impressões"
                  strokeWidth={2}
                />
                <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Cliques" strokeWidth={2} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="spend"
                  stroke="#ffc658"
                  name="Gasto (R$)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Comparação com Média */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Comparação com Média do Setor
            </CardTitle>
            <CardDescription>Como sua campanha se compara com a média</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricsComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="atual" fill="#8884d8" name="Sua Campanha" />
                <Bar dataKey="media" fill="#82ca9d" name="Média do Setor" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Métricas de Eficiência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Métricas de Eficiência
            </CardTitle>
            <CardDescription>Indicadores de performance da campanha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Taxa de Cliques (CTR)</span>
                <span className="text-sm font-bold">
                  {insights?.ctr ? `${parseFloat(insights.ctr).toFixed(2)}%` : "0%"}
                </span>
              </div>
              <div className="bg-secondary h-2 w-full rounded-full">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{
                    width: `${Math.min(parseFloat(insights?.ctr || "0") * 10, 100)}%`,
                  }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Meta: 5% | Média do setor: 5.2%</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Custo por Clique</span>
                <span className="text-sm font-bold">{formatCurrency(parseFloat(insights?.cpc || "0"))}</span>
              </div>
              <div className="bg-secondary h-2 w-full rounded-full">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{
                    width: `${Math.min((parseFloat(insights?.cpc || "0") / 0.5) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Meta: R$ 0,20 | Média do setor: R$ 0,15</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Custo por Mil Impressões</span>
                <span className="text-sm font-bold">{formatCurrency(parseFloat(insights?.cpm || "0"))}</span>
              </div>
              <div className="bg-secondary h-2 w-full rounded-full">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${Math.min((parseFloat(insights?.cpm || "0") / 20) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">Meta: R$ 10,00 | Média do setor: R$ 8,50</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
