"use client";

import { ArrowUpDown, MoreHorizontal, ExternalLink } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

interface CampaignData {
  campaign: string;
  source: string;
  medium: string;
  sessions: number;
  users: number;
  conversions: number;
  conversionRate: number;
}

interface CampaignsTableProps {
  data?: {
    campaigns: CampaignData[];
    totals: {
      sessions: number;
      users: number;
      conversions: number;
      conversionRate: string;
    };
  };
  isLoading?: boolean;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

function getSourceBadgeVariant(source: string): "default" | "secondary" | "outline" | "destructive" {
  const lowerSource = source.toLowerCase();
  if (lowerSource.includes("facebook") || lowerSource.includes("instagram")) {
    return "default";
  }
  if (lowerSource.includes("google")) {
    return "secondary";
  }
  return "outline";
}

export function CampaignsTable({ data, isLoading }: CampaignsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const campaigns = data?.campaigns || [];
  const maxSessions = Math.max(...campaigns.map((c) => c.sessions), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campanhas</CardTitle>
        <CardDescription>Performance das campanhas de marketing (UTM)</CardDescription>
      </CardHeader>
      <CardContent>
        {campaigns.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Campanha</TableHead>
                  <TableHead>Fonte / Mídia</TableHead>
                  <TableHead className="text-right">Sessões</TableHead>
                  <TableHead className="text-right">Usuários</TableHead>
                  <TableHead className="text-right">Conversões</TableHead>
                  <TableHead className="text-right">Taxa Conv.</TableHead>
                  <TableHead className="w-[100px]">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.slice(0, 10).map((campaign, index) => (
                  <TableRow key={`${campaign.campaign}-${index}`}>
                    <TableCell className="font-medium">
                      <div className="max-w-[250px] truncate" title={campaign.campaign}>
                        {campaign.campaign === "(not set)" ? (
                          <span className="text-muted-foreground italic">Não definido</span>
                        ) : (
                          campaign.campaign
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSourceBadgeVariant(campaign.source)} className="text-xs">
                          {campaign.source}
                        </Badge>
                        <span className="text-muted-foreground text-xs">/ {campaign.medium}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatNumber(campaign.sessions)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(campaign.users)}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatNumber(campaign.conversions)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          campaign.conversionRate > 5
                            ? "default"
                            : campaign.conversionRate > 2
                              ? "secondary"
                              : "outline"
                        }
                        className="tabular-nums"
                      >
                        {campaign.conversionRate.toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Progress value={(campaign.sessions / maxSessions) * 100} className="h-2" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-32 items-center justify-center">Nenhuma campanha encontrada</div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-muted-foreground flex gap-4 text-sm">
          <span>
            Total Sessões: <strong className="text-foreground">{formatNumber(data?.totals.sessions || 0)}</strong>
          </span>
          <span>
            Total Conversões: <strong className="text-foreground">{formatNumber(data?.totals.conversions || 0)}</strong>
          </span>
          <span>
            Taxa Geral: <strong className="text-foreground">{data?.totals.conversionRate || "0"}%</strong>
          </span>
        </div>
        <Button variant="outline" size="sm">
          <ExternalLink className="mr-2 size-4" />
          Ver Todas
        </Button>
      </CardFooter>
    </Card>
  );
}
