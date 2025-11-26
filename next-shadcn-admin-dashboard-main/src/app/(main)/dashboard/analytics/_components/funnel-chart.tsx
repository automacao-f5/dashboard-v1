"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, MousePointerClick, ShoppingBag } from "lucide-react";

interface FunnelStage {
  stage: string;
  value: number;
  percentage: number | string;
  source: string;
}

interface FunnelChartProps {
  data: FunnelStage[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const getStageIcon = (stage: string) => {
    if (stage.toLowerCase().includes("impressão") || stage.toLowerCase().includes("impressoes")) {
      return Eye;
    }
    if (stage.toLowerCase().includes("clique")) {
      return MousePointerClick;
    }
    if (stage.toLowerCase().includes("venda")) {
      return ShoppingBag;
    }
    return Eye;
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

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>
          Análise do fluxo de conversão desde impressões até vendas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((stage, index) => {
            const Icon = getStageIcon(stage.stage);
            const widthPercentage = typeof stage.percentage === 'number'
              ? stage.percentage
              : parseFloat(stage.percentage);

            // Calcular taxa de conversão para o próximo estágio
            const nextStage = data[index + 1];
            const conversionRate = nextStage
              ? ((nextStage.value / stage.value) * 100).toFixed(2)
              : null;

            return (
              <div key={stage.stage} className="relative">
                {/* Barra do funil */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-32">
                    <div className="rounded-full p-2 bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium">{stage.stage}</div>
                  </div>

                  <div className="flex-1">
                    <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 flex items-center justify-between px-4 ${
                          index === 0
                            ? "bg-blue-500"
                            : index === 1
                              ? "bg-purple-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${widthPercentage}%` }}
                      >
                        <span className="text-sm font-semibold text-white">
                          {formatNumber(stage.value)}
                        </span>
                        <span className="text-xs font-medium text-white/90">
                          {typeof stage.percentage === 'number'
                            ? stage.percentage.toFixed(2)
                            : stage.percentage}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground w-20 text-right">
                    {stage.source}
                  </div>
                </div>

                {/* Seta e taxa de conversão para o próximo estágio */}
                {conversionRate && (
                  <div className="flex items-center justify-center my-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-6 w-px bg-border" />
                      <span className="font-medium">↓ {conversionRate}% conversão</span>
                      <div className="h-6 w-px bg-border" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumo */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {data[0] ? formatNumber(data[0].value) : "0"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Impressões Totais</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {data[1]
                  ? ((data[1].value / data[0].value) * 100).toFixed(2)
                  : "0"}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-1">CTR Geral</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {data[2] && data[1]
                  ? ((data[2].value / data[1].value) * 100).toFixed(2)
                  : "0"}
                %
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Conversão Clique → Venda
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
