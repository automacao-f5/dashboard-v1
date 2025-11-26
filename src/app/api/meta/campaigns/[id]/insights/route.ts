import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: campaignId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const datePreset = searchParams.get("date_preset") || "last_7d";

    // Buscar insights da campanha usando o MCP server
    const mcpResponse = await fetch("http://localhost:3000/api/mcp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server: "meta-marketing",
        tool: "get_campaign_insights",
        arguments: {
          campaign_id: campaignId,
          date_preset: datePreset,
        },
      }),
    });

    if (!mcpResponse.ok) {
      throw new Error("Erro ao buscar insights da campanha");
    }

    const mcpData = await mcpResponse.json();

    // Como a API da Meta retorna dados agregados, vamos simular dados diários
    // dividindo os totais pelo número de dias
    const insights = mcpData.insights || {};
    const daysInPeriod = datePreset === "last_7d" ? 7 : 30;
    
    // Gerar dados diários simulados baseados nos totais
    const dailyInsights = Array.from({ length: daysInPeriod }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (daysInPeriod - 1 - index));
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      return {
        date: formattedDate,
        fullDate: date.toISOString().split('T')[0],
        impressions: Math.round((parseInt(insights.impressions || "0") / daysInPeriod)),
        clicks: Math.round((parseInt(insights.clicks || "0") / daysInPeriod)),
        spend: parseFloat((parseFloat(insights.spend || "0") / daysInPeriod).toFixed(2)),
        reach: Math.round((parseInt(insights.reach || "0") / daysInPeriod)),
        cpc: parseFloat(insights.cpc || "0"),
        cpm: parseFloat(insights.cpm || "0"),
        ctr: parseFloat(insights.ctr || "0"),
      };
    });

    return NextResponse.json({
      daily_insights: dailyInsights,
      total: dailyInsights.length,
    });
  } catch (error) {
    console.error("Erro ao buscar insights da campanha:", error);
    return NextResponse.json(
      { error: "Erro ao buscar insights da campanha" },
      { status: 500 }
    );
  }
}
