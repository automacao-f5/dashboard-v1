import { NextRequest, NextResponse } from "next/server";
import { getMetaCampaigns, getCampaignInsights, getAggregatedInsights } from "@/app/(main)/dashboard/meta/_actions/meta-actions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const datePreset = searchParams.get("date_preset") || "last_7d";
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") || undefined;

    // Busca campanhas
    const campaignsData = await getMetaCampaigns(limit, status);

    // Busca insights para cada campanha ativa com o período selecionado
    const campaignsWithInsights = await Promise.all(
      campaignsData.campaigns.map(async (campaign) => {
        if (campaign.status === "ACTIVE") {
          try {
            const insights = await getCampaignInsights(campaign.id, datePreset);
            return {
              ...campaign,
              insights: insights?.insights,
            };
          } catch (error) {
            console.error(`Error fetching insights for campaign ${campaign.id}:`, error);
            return campaign;
          }
        }
        return campaign;
      })
    );

    // Busca insights agregados
    const aggregatedInsights = await getAggregatedInsights();

    return NextResponse.json({
      campaigns: campaignsWithInsights,
      insights: aggregatedInsights,
      date_preset: datePreset,
    });
  } catch (error) {
    console.error("Error in campaigns API:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}
