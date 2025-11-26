import { NextRequest, NextResponse } from "next/server";
import { getGA4APIClient } from "@/lib/ga4-api-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const ga4Client = getGA4APIClient();

    const campaignData = await ga4Client.getCampaignData(startDate, endDate, limit);

    // Calcular totais
    const totals = campaignData.reduce(
      (acc, campaign) => ({
        sessions: acc.sessions + campaign.sessions,
        users: acc.users + campaign.users,
        conversions: acc.conversions + campaign.conversions,
      }),
      { sessions: 0, users: 0, conversions: 0 },
    );

    const overallConversionRate = totals.sessions > 0 ? (totals.conversions / totals.sessions) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        campaigns: campaignData,
        totals: {
          ...totals,
          conversionRate: overallConversionRate.toFixed(2),
        },
      },
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error("Error fetching GA4 campaign data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch campaign data",
      },
      { status: 500 },
    );
  }
}
