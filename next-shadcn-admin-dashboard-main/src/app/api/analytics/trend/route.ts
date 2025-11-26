import { NextRequest, NextResponse } from "next/server";
import { getGA4APIClient } from "@/lib/ga4-api-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    const ga4Client = getGA4APIClient();

    const trendData = await ga4Client.getDataByDateRange(startDate, endDate);

    // Calcular métricas de tendência
    const totalSessions = trendData.reduce((acc, d) => acc + d.sessions, 0);
    const totalUsers = trendData.reduce((acc, d) => acc + d.activeUsers, 0);
    const totalPageViews = trendData.reduce((acc, d) => acc + d.screenPageViews, 0);
    const avgEngagementRate =
      trendData.length > 0 ? trendData.reduce((acc, d) => acc + d.engagementRate, 0) / trendData.length : 0;

    return NextResponse.json({
      success: true,
      data: {
        daily: trendData,
        summary: {
          totalSessions,
          totalUsers,
          totalPageViews,
          avgEngagementRate: (avgEngagementRate * 100).toFixed(2),
          days: trendData.length,
        },
      },
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error("Error fetching GA4 trend data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch trend data",
      },
      { status: 500 },
    );
  }
}
