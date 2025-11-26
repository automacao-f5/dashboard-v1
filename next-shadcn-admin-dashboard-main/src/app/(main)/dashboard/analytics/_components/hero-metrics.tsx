"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart, Target } from "lucide-react";

interface MetricsData {
  meta: {
    spend: number;
    impressions: number;
    clicks: number;
    ctr: string;
    activeCampaigns: number;
  };
  hotmart: {
    totalSales: number;
    totalRevenue: number;
    conversionRate: number;
    averageTicket: number;
  };
  calculated: {
    roas: number;
    cpa: number;
    funnelConversionRate: number;
    roi: string;
  };
}

interface HeroMetricsProps {
  data: MetricsData;
}

export function HeroMetrics({ data }: HeroMetricsProps) {
  const metrics = [
    {
      title: "ROAS",
      value: data.calculated.roas.toFixed(2) + "x",
      description: "Retorno sobre investimento em anúncios",
      icon: TrendingUp,
      trend: data.calculated.roas >= 2 ? "up" : "down",
      trendValue: data.calculated.roi + "%",
      color: data.calculated.roas >= 2 ? "text-green-600" : "text-red-600",
      bgColor: data.calculated.roas >= 2 ? "bg-green-50" : "bg-red-50",
    },
    {
      title: "CPA",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(data.calculated.cpa),
      description: "Custo por aquisição",
      icon: Target,
      trend: data.calculated.cpa <= 100 ? "up" : "down",
      trendValue: data.hotmart.totalSales + " vendas",
      color: data.calculated.cpa <= 100 ? "text-green-600" : "text-yellow-600",
      bgColor: data.calculated.cpa <= 100 ? "bg-green-50" : "bg-yellow-50",
    },
    {
      title: "Receita Total",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(data.hotmart.totalRevenue),
      description: "Vendas aprovadas na Hotmart",
      icon: DollarSign,
      trend: "up",
      trendValue: data.hotmart.totalSales + " vendas",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Ticket Médio",
      value: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(data.hotmart.averageTicket),
      description: "Valor médio por venda",
      icon: ShoppingCart,
      trend: "neutral",
      trendValue: data.calculated.funnelConversionRate + "% conversão",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === "up" ? ArrowUp : ArrowDown;

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`rounded-full p-2 ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              <div className="flex items-center gap-1 mt-2">
                {metric.trend !== "neutral" && (
                  <TrendIcon
                    className={`h-3 w-3 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  />
                )}
                <span className="text-xs text-muted-foreground">{metric.trendValue}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
