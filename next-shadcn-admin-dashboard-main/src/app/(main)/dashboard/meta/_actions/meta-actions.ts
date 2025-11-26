"use server";

import { metaAPIClient } from "@/lib/meta-api-client";

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  start_time?: string;
  stop_time?: string;
}

interface MetaCampaignInsights {
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
}

interface CampaignsResponse {
  ad_account_id: string;
  total_campaigns: number;
  campaigns: MetaCampaign[];
}

interface CampaignInsightsResponse {
  campaign_id: string;
  date_preset: string;
  insights: MetaCampaignInsights;
}

export async function getMetaCampaigns(limit: number = 25, status?: string) {
  try {
    const data = await metaAPIClient.getCampaigns(limit, status);

    return {
      ad_account_id: process.env.META_AD_ACCOUNT_ID || "",
      total_campaigns: data.data.length,
      campaigns: data.data,
    } as CampaignsResponse;
  } catch (error) {
    console.error("Error fetching Meta campaigns:", error);
    throw error;
  }
}

export async function getCampaignInsights(campaignId: string, datePreset: string = "last_30d") {
  try {
    const insights = await metaAPIClient.getCampaignInsights(campaignId, datePreset);

    return {
      campaign_id: campaignId,
      date_preset: datePreset,
      insights: insights,
    } as CampaignInsightsResponse;
  } catch (error) {
    console.error("Error fetching campaign insights:", error);
    return null;
  }
}

export async function getAggregatedInsights() {
  try {
    // Busca campanhas ativas em tempo real
    const campaignsData = await getMetaCampaigns(100);
    const activeCampaigns = campaignsData.campaigns.filter((c) => c.status === "ACTIVE");

    let totalSpend = 0;
    let totalImpressions = 0;
    let totalClicks = 0;

    // Busca insights de cada campanha ativa em tempo real
    for (const campaign of activeCampaigns) {
      try {
        const insights = await getCampaignInsights(campaign.id, "last_7d");
        if (insights?.insights) {
          totalSpend += parseFloat(insights.insights.spend || "0");
          totalImpressions += parseInt(insights.insights.impressions || "0");
          totalClicks += parseInt(insights.insights.clicks || "0");
        }
      } catch (error) {
        console.error(`Error fetching insights for campaign ${campaign.id}:`, error);
        // Continua com as outras campanhas
      }
    }

    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return {
      totalSpend: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(totalSpend),
      totalImpressions: formatNumber(totalImpressions),
      totalClicks: formatNumber(totalClicks),
      avgCTR: `${avgCTR.toFixed(2)}%`,
    };
  } catch (error) {
    console.error("Error fetching aggregated insights:", error);
    // Retorna dados zerados em caso de erro
    return {
      totalSpend: "R$ 0,00",
      totalImpressions: "0",
      totalClicks: "0",
      avgCTR: "0%",
    };
  }
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export async function getCampaignDemographics(campaignId: string, datePreset: string = "last_30d") {
  try {
    const data = await metaAPIClient.getCampaignDemographics(campaignId, datePreset);
    return data;
  } catch (error) {
    console.error("Error fetching campaign demographics:", error);
    return [];
  }
}

export async function getCampaignGeographics(campaignId: string, datePreset: string = "last_30d") {
  try {
    const data = await metaAPIClient.getCampaignGeographics(campaignId, datePreset);
    return data;
  } catch (error) {
    console.error("Error fetching campaign geographics:", error);
    return [];
  }
}

export async function getCampaignDeviceBreakdown(campaignId: string, datePreset: string = "last_30d") {
  try {
    const data = await metaAPIClient.getCampaignDeviceBreakdown(campaignId, datePreset);
    return data;
  } catch (error) {
    console.error("Error fetching campaign device breakdown:", error);
    return [];
  }
}

export async function getCampaignPlatformBreakdown(campaignId: string, datePreset: string = "last_30d") {
  try {
    const data = await metaAPIClient.getCampaignPlatformBreakdown(campaignId, datePreset);
    return data;
  } catch (error) {
    console.error("Error fetching campaign platform breakdown:", error);
    return [];
  }
}
