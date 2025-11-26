"use server";

import { metaAPIClient } from "@/lib/meta-api-client";
import { vturbAPIClient } from "@/lib/vturb-api-client";
import { hotmartAPIClient } from "@/lib/hotmart-api-client";

/**
 * Buscar métricas consolidadas de todas as plataformas
 */
export async function getConsolidatedMetrics(datePreset: string = "last_7d") {
  try {
    // Buscar dados do Meta Ads
    const metaCampaigns = await metaAPIClient.getCampaigns(100);
    const activeCampaigns = metaCampaigns.data.filter((c) => c.status === "ACTIVE");

    let metaSpend = 0;
    let metaImpressions = 0;
    let metaClicks = 0;

    for (const campaign of activeCampaigns) {
      try {
        const insights = await metaAPIClient.getCampaignInsights(campaign.id, datePreset);
        metaSpend += parseFloat(insights.spend || "0");
        metaImpressions += parseInt(insights.impressions || "0");
        metaClicks += parseInt(insights.clicks || "0");
      } catch (error) {
        console.error(`Error fetching Meta insights for ${campaign.id}:`, error);
      }
    }

    // Buscar dados do Hotmart
    let hotmartData = {
      totalSales: 0,
      totalRevenue: 0,
      conversionRate: 0,
      averageTicket: 0,
    };

    try {
      const conversionMetrics = await hotmartAPIClient.getConversionMetrics();
      hotmartData = {
        totalSales: conversionMetrics.approvedSales || 0,
        totalRevenue: parseFloat(conversionMetrics.totalRevenue || "0"),
        conversionRate: parseFloat(conversionMetrics.conversionRate || "0"),
        averageTicket: parseFloat(conversionMetrics.averageTicket || "0"),
      };
    } catch (error) {
      console.error("Error fetching Hotmart data:", error);
    }

    // Calcular ROAS (Return on Ad Spend)
    const roas = metaSpend > 0 ? (hotmartData.totalRevenue / metaSpend).toFixed(2) : "0.00";

    // Calcular CPA (Cost Per Acquisition)
    const cpa = hotmartData.totalSales > 0
      ? (metaSpend / hotmartData.totalSales).toFixed(2)
      : "0.00";

    // Calcular taxa de conversão do funil completo
    const funnelConversionRate = metaClicks > 0
      ? ((hotmartData.totalSales / metaClicks) * 100).toFixed(2)
      : "0.00";

    return {
      meta: {
        spend: metaSpend,
        impressions: metaImpressions,
        clicks: metaClicks,
        ctr: metaImpressions > 0 ? ((metaClicks / metaImpressions) * 100).toFixed(2) : "0",
        activeCampaigns: activeCampaigns.length,
      },
      hotmart: hotmartData,
      calculated: {
        roas: parseFloat(roas),
        cpa: parseFloat(cpa),
        funnelConversionRate: parseFloat(funnelConversionRate),
        roi: ((parseFloat(roas) - 1) * 100).toFixed(2), // ROI em percentual
      },
    };
  } catch (error) {
    console.error("Error fetching consolidated metrics:", error);
    throw error;
  }
}

/**
 * Buscar dados do funil completo
 */
export async function getFunnelData(datePreset: string = "last_7d") {
  try {
    const metrics = await getConsolidatedMetrics(datePreset);

    // Estrutura do funil
    const funnel = [
      {
        stage: "Impressões",
        value: metrics.meta.impressions,
        percentage: 100,
        source: "Meta Ads",
      },
      {
        stage: "Cliques",
        value: metrics.meta.clicks,
        percentage: metrics.meta.impressions > 0
          ? ((metrics.meta.clicks / metrics.meta.impressions) * 100).toFixed(2)
          : 0,
        source: "Meta Ads",
      },
      {
        stage: "Vendas",
        value: metrics.hotmart.totalSales,
        percentage: metrics.meta.clicks > 0
          ? ((metrics.hotmart.totalSales / metrics.meta.clicks) * 100).toFixed(2)
          : 0,
        source: "Hotmart",
      },
    ];

    return funnel;
  } catch (error) {
    console.error("Error fetching funnel data:", error);
    return [];
  }
}

/**
 * Buscar performance de campanhas com métricas calculadas
 */
export async function getCampaignsPerformance(datePreset: string = "last_7d") {
  try {
    const metaCampaigns = await metaAPIClient.getCampaigns(100);
    const hotmartMetrics = await hotmartAPIClient.getConversionMetrics();

    const campaignsWithMetrics = [];

    for (const campaign of metaCampaigns.data) {
      try {
        const insights = await metaAPIClient.getCampaignInsights(campaign.id, datePreset);

        const spend = parseFloat(insights.spend || "0");
        const clicks = parseInt(insights.clicks || "0");
        const impressions = parseInt(insights.impressions || "0");

        // Estimar vendas proporcionalmente ao gasto
        const totalSpend = metaCampaigns.data.reduce((sum, c) => {
          return sum + parseFloat(insights.spend || "0");
        }, 0);

        const estimatedSales = totalSpend > 0
          ? Math.round((spend / totalSpend) * (hotmartMetrics.approvedSales || 0))
          : 0;

        const estimatedRevenue = estimatedSales * parseFloat(hotmartMetrics.averageTicket || "0");
        const roas = spend > 0 ? (estimatedRevenue / spend).toFixed(2) : "0.00";
        const cpa = estimatedSales > 0 ? (spend / estimatedSales).toFixed(2) : "0.00";

        // Determinar ação recomendada
        let recommendation = "Manter";
        let recommendationColor = "yellow";

        if (parseFloat(roas) >= 3) {
          recommendation = "Escalar";
          recommendationColor = "green";
        } else if (parseFloat(roas) < 1.5) {
          recommendation = "Pausar/Otimizar";
          recommendationColor = "red";
        }

        campaignsWithMetrics.push({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          spend,
          clicks,
          impressions,
          ctr: insights.ctr || "0",
          estimatedSales,
          estimatedRevenue,
          roas: parseFloat(roas),
          cpa: parseFloat(cpa),
          recommendation,
          recommendationColor,
        });
      } catch (error) {
        console.error(`Error processing campaign ${campaign.id}:`, error);
      }
    }

    // Ordenar por ROAS decrescente
    campaignsWithMetrics.sort((a, b) => b.roas - a.roas);

    return campaignsWithMetrics;
  } catch (error) {
    console.error("Error fetching campaigns performance:", error);
    return [];
  }
}

/**
 * Buscar métricas de vídeo (Vturb)
 */
export async function getVideoMetrics() {
  try {
    const stats = await vturbAPIClient.getVideoStats();
    return stats;
  } catch (error) {
    console.error("Error fetching Vturb metrics:", error);
    return null;
  }
}

/**
 * Buscar histórico de vendas da Hotmart
 */
export async function getHotmartSalesHistory(startDate?: string, endDate?: string) {
  try {
    const sales = await hotmartAPIClient.getSales(startDate, endDate);
    return sales;
  } catch (error) {
    console.error("Error fetching Hotmart sales:", error);
    return null;
  }
}

/**
 * Buscar produtos da Hotmart
 */
export async function getHotmartProducts() {
  try {
    const products = await hotmartAPIClient.getProducts();
    return products;
  } catch (error) {
    console.error("Error fetching Hotmart products:", error);
    return null;
  }
}

/**
 * Buscar lista de vídeos do Vturb
 */
export async function getVturbVideos() {
  try {
    const videos = await vturbAPIClient.getVideos();
    return videos;
  } catch (error) {
    console.error("Error fetching Vturb videos:", error);
    return null;
  }
}
