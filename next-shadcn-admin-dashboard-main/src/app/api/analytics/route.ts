import { NextRequest, NextResponse } from "next/server";
import { getGA4APIClient } from "@/lib/ga4-api-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    const ga4Client = getGA4APIClient();

    // Buscar métricas resumidas
    const summaryMetrics = await ga4Client.getSummaryMetrics(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: summaryMetrics,
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error("Error fetching GA4 summary metrics:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch GA4 data",
      },
      { status: 500 },
    );
  }
}
