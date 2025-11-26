import { NextRequest, NextResponse } from "next/server";
import { getGA4APIClient } from "@/lib/ga4-api-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const ga4Client = getGA4APIClient();

    const trafficSources = await ga4Client.getTrafficSources(startDate, endDate, limit);

    return NextResponse.json({
      success: true,
      data: trafficSources,
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error("Error fetching GA4 traffic sources:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch traffic sources",
      },
      { status: 500 },
    );
  }
}
