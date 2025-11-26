"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Eye, Clock, TrendingUp, Video, BarChart3 } from "lucide-react";

interface VturbMetricsData {
  totalViews: number;
  totalPlays: number;
  avgWatchTime: number;
  avgRetention: number;
  totalVideos: number;
  engagementRate: number;
}

interface VturbMetricsProps {
  data: VturbMetricsData;
}

export function VturbMetrics({ data }: VturbMetricsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const metrics = [
    {
      title: "Visualizações Totais",
      value: formatNumber(data.totalViews),
      description: "Total de plays iniciados",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      rawValue: data.totalViews,
    },
    {
      title: "Plays Completos",
      value: formatNumber(data.totalPlays),
      description: "Vídeos assistidos",
      icon: Play,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      rawValue: data.totalPlays,
    },
    {
      title: "Tempo Médio",
      value: formatTime(data.avgWatchTime),
      description: "Tempo de visualização",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50",
      rawValue: data.avgWatchTime,
    },
    {
      title: "Retenção Média",
      value: data.avgRetention.toFixed(1) + "%",
      description: "Taxa de retenção",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      rawValue: data.avgRetention,
    },
    {
      title: "Total de Vídeos",
      value: data.totalVideos.toString(),
      description: "Vídeos ativos",
      icon: Video,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      rawValue: data.totalVideos,
    },
    {
      title: "Engajamento",
      value: data.engagementRate.toFixed(1) + "%",
      description: "Taxa de engajamento",
      icon: BarChart3,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      rawValue: data.engagementRate,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

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
                <p className="text-muted-foreground mt-1 text-xs">{metric.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Card de Análise */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Performance de Conteúdo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Taxa de Conversão de View para Play */}
            <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
              <div>
                <div className="text-sm font-medium text-blue-900">Taxa de Conversão (View → Play)</div>
                <div className="mt-1 text-xs text-blue-700">Porcentagem de visualizações que se tornaram plays</div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {data.totalViews > 0 ? ((data.totalPlays / data.totalViews) * 100).toFixed(1) : "0"}%
              </div>
            </div>

            {/* Retenção vs Meta */}
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-4">
              <div>
                <div className="text-sm font-medium text-orange-900">Status de Retenção</div>
                <div className="mt-1 text-xs text-orange-700">
                  {data.avgRetention >= 50
                    ? "✅ Excelente! Acima de 50%"
                    : data.avgRetention >= 30
                      ? "⚠️ Bom. Pode melhorar"
                      : "❌ Baixo. Necessita otimização"}
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{data.avgRetention.toFixed(1)}%</div>
            </div>

            {/* Engajamento */}
            <div className="flex items-center justify-between rounded-lg bg-purple-50 p-4">
              <div>
                <div className="text-sm font-medium text-purple-900">Nível de Engajamento</div>
                <div className="mt-1 text-xs text-purple-700">
                  {data.engagementRate >= 60
                    ? "🔥 Muito Alto"
                    : data.engagementRate >= 40
                      ? "✅ Alto"
                      : data.engagementRate >= 20
                        ? "⚠️ Médio"
                        : "❌ Baixo"}
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">{data.engagementRate.toFixed(1)}%</div>
            </div>
          </div>

          {/* Recomendações */}
          <div className="mt-6 rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            <div className="mb-2 text-sm font-semibold">💡 Recomendações:</div>
            <ul className="text-muted-foreground space-y-1 text-xs">
              {data.avgRetention < 50 && <li>• Otimize os primeiros 30 segundos do vídeo para aumentar retenção</li>}
              {data.engagementRate < 40 && <li>• Adicione mais CTAs e elementos interativos no vídeo</li>}
              {data.totalPlays / data.totalViews < 0.5 && (
                <li>• Melhore a thumbnail e o título para aumentar taxa de play</li>
              )}
              {data.avgWatchTime < 180 && <li>• Revise a duração do vídeo - pode estar muito longo</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
