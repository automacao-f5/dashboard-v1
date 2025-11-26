"use client";

import { useState, useEffect } from "react";
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { MetaCampaignsTable } from "./meta-campaigns-table";
import { MetaOverviewCards } from "./meta-overview-cards";
import { DateRangePicker } from "./date-range-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface Campaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
  insights?: any;
}

interface MetaDashboardClientProps {
  initialCampaigns: Campaign[];
  initialInsights: any;
}

export function MetaDashboardClient({ initialCampaigns, initialInsights }: MetaDashboardClientProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -6),
    to: new Date(),
  });
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [insights, setInsights] = useState(initialInsights);
  const [isLoading, setIsLoading] = useState(false);

  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE");
  const pausedCampaigns = campaigns.filter((c) => c.status === "PAUSED");

  // Função para converter DateRange para date_preset da API Meta
  const getDatePreset = (range: DateRange | undefined): string => {
    if (!range?.from || !range?.to) return "last_7d";

    const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "today";
    if (diffDays <= 7) return "last_7d";
    if (diffDays <= 14) return "last_14d";
    if (diffDays <= 30) return "last_30d";
    return "last_30d";
  };

  const handleDateChange = async (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
    setIsLoading(true);

    try {
      const datePreset = getDatePreset(newDateRange);

      // Busca campanhas com insights atualizados
      const response = await fetch(`/api/meta/campaigns?date_preset=${datePreset}`);
      const data = await response.json();

      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }

      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meta Marketing</h1>
          <p className="text-muted-foreground">Gerencie suas campanhas e produtos do Facebook e Instagram</p>
        </div>
        <DateRangePicker date={dateRange} onDateChange={handleDateChange} />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-8 w-[120px]" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <MetaOverviewCards insights={insights} />
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todas ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="active">Ativas ({activeCampaigns.length})</TabsTrigger>
          <TabsTrigger value="paused">Pausadas ({pausedCampaigns.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <MetaCampaignsTable campaigns={campaigns} />
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <MetaCampaignsTable campaigns={activeCampaigns} />
          )}
        </TabsContent>
        <TabsContent value="paused" className="mt-4">
          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-[200px]" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <MetaCampaignsTable campaigns={pausedCampaigns} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
