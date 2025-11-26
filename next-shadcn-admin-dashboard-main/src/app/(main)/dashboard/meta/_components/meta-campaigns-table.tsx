import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
  insights?: {
    impressions?: string;
    clicks?: string;
    spend?: string;
    ctr?: string;
    cpc?: string;
    cpm?: string;
    reach?: string;
  };
}

interface MetaCampaignsTableProps {
  campaigns: Campaign[];
}

export function MetaCampaignsTable({ campaigns }: MetaCampaignsTableProps) {

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
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas Ativas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome da Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Objetivo</TableHead>
                <TableHead>Orçamento</TableHead>
                <TableHead>Impressões</TableHead>
                <TableHead>Alcance</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Cliques</TableHead>
                <TableHead>Gasto</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead>CPC</TableHead>
                <TableHead>CPM</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                // Usa os insights que vêm com a campanha ou valores padrão
                const insights = campaign.insights || {
                  impressions: "—",
                  clicks: "—",
                  spend: "0",
                  ctr: "—",
                  cpc: "0",
                  cpm: "0",
                  reach: "—",
                };

                // Formata CTR se vier como número decimal
                const formattedCtr = insights.ctr && insights.ctr !== "—"
                  ? parseFloat(insights.ctr) > 1
                    ? `${parseFloat(insights.ctr).toFixed(2)}%`
                    : `${(parseFloat(insights.ctr) * 100).toFixed(2)}%`
                  : insights.ctr;

                // Calcula frequência (Impressões / Alcance)
                const frequency =
                  insights.impressions !== "—" && insights.reach !== "—"
                    ? (
                        parseInt(insights.impressions || "0") /
                        parseInt(insights.reach || "1")
                      ).toFixed(2)
                    : "—";

                return (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {campaign.name}
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>{getObjectiveLabel(campaign.objective)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {formatBudget(campaign.daily_budget)}
                        </span>
                        <span className="text-xs text-muted-foreground">diário</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {insights.impressions === "—"
                          ? "—"
                          : parseInt(insights.impressions || "0").toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {insights.reach === "—"
                          ? "—"
                          : parseInt(insights.reach || "0").toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{frequency}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {insights.clicks === "—"
                          ? "—"
                          : parseInt(insights.clicks || "0").toLocaleString("pt-BR")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseFloat(insights.spend || "0"))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {formattedCtr === "—" ? "—" : formattedCtr}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseFloat(insights.cpc || "0"))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(parseFloat(insights.cpm || "0"))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/meta/campaign/${campaign.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
