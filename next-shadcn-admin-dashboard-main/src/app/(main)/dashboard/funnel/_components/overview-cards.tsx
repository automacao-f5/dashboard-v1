"use client";

import { TrendingUp, TrendingDown, Users, Eye, MousePointer, ShoppingCart, Activity, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewData {
  sessions: number;
  activeUsers: number;
  newUsers: number;
  screenPageViews: number;
  engagementRate: number;
  averageSessionDuration: number;
  bounceRate: number;
  sessionsPerUser: number;
}

interface OverviewCardsProps {
  data?: OverviewData;
  previousData?: OverviewData;
  isLoading?: boolean;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
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

function calculateChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function OverviewCards({ data, previousData, isLoading }: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-48" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const sessionsChange = previousData ? calculateChange(data?.sessions || 0, previousData.sessions) : 0;
  const usersChange = previousData ? calculateChange(data?.activeUsers || 0, previousData.activeUsers) : 0;
  const pageViewsChange = previousData ? calculateChange(data?.screenPageViews || 0, previousData.screenPageViews) : 0;
  const engagementChange = previousData ? calculateChange(data?.engagementRate || 0, previousData.engagementRate) : 0;

  const cards = [
    {
      title: "Sessões",
      value: formatNumber(data?.sessions || 0),
      change: sessionsChange,
      icon: Activity,
      description: "Total de sessões no período",
      footer: `${formatNumber(data?.newUsers || 0)} novos usuários`,
    },
    {
      title: "Usuários Ativos",
      value: formatNumber(data?.activeUsers || 0),
      change: usersChange,
      icon: Users,
      description: "Usuários únicos ativos",
      footer: `${(data?.sessionsPerUser || 0).toFixed(2)} sessões por usuário`,
    },
    {
      title: "Visualizações",
      value: formatNumber(data?.screenPageViews || 0),
      change: pageViewsChange,
      icon: Eye,
      description: "Total de páginas visualizadas",
      footer: `Bounce rate: ${((data?.bounceRate || 0) * 100).toFixed(1)}%`,
    },
    {
      title: "Taxa de Engajamento",
      value: `${((data?.engagementRate || 0) * 100).toFixed(1)}%`,
      change: engagementChange,
      icon: MousePointer,
      description: "Engajamento dos usuários",
      footer: `Tempo médio: ${formatDuration(data?.averageSessionDuration || 0)}`,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Card key={card.title} className="@container/card">
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4" />
                {card.title}
              </CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{card.value}</CardTitle>
              {previousData && (
                <CardAction>
                  <Badge variant="outline" className={isPositive ? "text-green-600" : "text-red-600"}>
                    <TrendIcon className="size-3" />
                    {isPositive ? "+" : ""}
                    {card.change.toFixed(1)}%
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">{card.description}</div>
              <div className="text-muted-foreground">{card.footer}</div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
