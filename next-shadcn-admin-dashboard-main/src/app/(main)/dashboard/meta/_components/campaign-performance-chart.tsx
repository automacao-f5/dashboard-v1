import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PerformanceMetric {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

export function CampaignPerformanceChart() {
  // Dados simulados de desempenho (em produção viriam da API)
  const metrics: PerformanceMetric[] = [
    {
      label: "Taxa de Conversão",
      value: "3.2%",
      change: 12.5,
      trend: "up",
    },
    {
      label: "ROAS",
      value: "4.8x",
      change: 8.3,
      trend: "up",
    },
    {
      label: "Custo por Resultado",
      value: "R$ 12,50",
      change: -15.2,
      trend: "down",
    },
    {
      label: "Frequência",
      value: "2.1",
      change: 5.7,
      trend: "up",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
            {metric.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {metric.change > 0 ? "+" : ""}
              {metric.change}% vs. período anterior
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
