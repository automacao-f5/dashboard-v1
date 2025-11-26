"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, PauseCircle, AlertCircle } from "lucide-react";

interface CampaignData {
  id: string;
  name: string;
  status: string;
  spend: number;
  clicks: number;
  impressions: number;
  ctr: string;
  estimatedSales: number;
  estimatedRevenue: number;
  roas: number;
  cpa: number;
  recommendation: string;
  recommendationColor: string;
}

interface CampaignsTableProps {
  data: CampaignData[];
}

export function CampaignsTable({ data }: CampaignsTableProps) {
  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.includes("Escalar")) return ArrowUpCircle;
    if (recommendation.includes("Pausar")) return PauseCircle;
    return AlertCircle;
  };

  const getRecommendationVariant = (color: string) => {
    if (color === "green") return "default";
    if (color === "red") return "destructive";
    return "secondary";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
        <CardTitle>Performance por Campanha</CardTitle>
        <CardDescription>
          Análise comparativa de campanhas com recomendações de otimização
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Gasto</TableHead>
                <TableHead className="text-right">Cliques</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Vendas Est.</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">CPA</TableHead>
                <TableHead>Recomendação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    Nenhuma campanha encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data.map((campaign) => {
                  const RecommendationIcon = getRecommendationIcon(campaign.recommendation);

                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {campaign.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
                        >
                          {campaign.status === "ACTIVE" ? "Ativa" : "Pausada"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(campaign.spend)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatNumber(campaign.clicks)}
                      </TableCell>
                      <TableCell className="text-right">{campaign.ctr}%</TableCell>
                      <TableCell className="text-right font-medium">
                        {campaign.estimatedSales}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-semibold ${
                            campaign.roas >= 3
                              ? "text-green-600"
                              : campaign.roas >= 2
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {campaign.roas.toFixed(2)}x
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(campaign.cpa)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getRecommendationVariant(campaign.recommendationColor)}
                          className="flex items-center gap-1 w-fit"
                        >
                          <RecommendationIcon className="h-3 w-3" />
                          {campaign.recommendation}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Legenda */}
        {data.length > 0 && (
          <div className="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span>ROAS ≥ 3.0x: Escalar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <span>ROAS 1.5-3.0x: Manter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span>ROAS &lt; 1.5x: Pausar/Otimizar</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
