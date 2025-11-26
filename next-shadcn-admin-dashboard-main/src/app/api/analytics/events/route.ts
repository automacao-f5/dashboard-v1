import { NextRequest, NextResponse } from "next/server";
import { getGA4APIClient } from "@/lib/ga4-api-client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const eventNamesParam = searchParams.get("events");

    const eventNames = eventNamesParam ? eventNamesParam.split(",") : undefined;

    const ga4Client = getGA4APIClient();

    const events = await ga4Client.getEvents(startDate, endDate, eventNames);

    return NextResponse.json({
      success: true,
      data: events,
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error("Error fetching GA4 events:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch events",
      },
      { status: 500 },
    );
  }
}
