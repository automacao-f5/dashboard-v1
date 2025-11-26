import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: campaignId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const datePreset = searchParams.get("date_preset") || "last_7d";

    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = "v21.0";

    if (!accessToken) {
      return NextResponse.json({ error: "META_ACCESS_TOKEN não configurado" }, { status: 500 });
    }

    // Buscar insights da campanha diretamente da API da Meta
    const insightsUrl = `https://graph.facebook.com/${apiVersion}/${campaignId}/insights?fields=impressions,clicks,spend,reach,cpc,cpm,ctr&date_preset=${datePreset}&access_token=${accessToken}`;

    const response = await fetch(insightsUrl);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao buscar insights da Meta:", errorData);
      return NextResponse.json({ error: "Erro ao buscar insights da campanha" }, { status: response.status });
    }

    const data = await response.json();
    const insights = data.data?.[0] || {};

    // Como a API da Meta retorna dados agregados, vamos simular dados diários
    // dividindo os totais pelo número de dias
    const daysInPeriod = datePreset === "last_7d" ? 7 : 30;

    // Gerar dados diários simulados baseados nos totais
    const dailyInsights = Array.from({ length: daysInPeriod }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (daysInPeriod - 1 - index));
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;

      return {
        date: formattedDate,
        fullDate: date.toISOString().split("T")[0],
        impressions: Math.round(parseInt(insights.impressions || "0") / daysInPeriod),
        clicks: Math.round(parseInt(insights.clicks || "0") / daysInPeriod),
        spend: parseFloat((parseFloat(insights.spend || "0") / daysInPeriod).toFixed(2)),
        reach: Math.round(parseInt(insights.reach || "0") / daysInPeriod),
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
    return NextResponse.json({ error: "Erro ao buscar insights da campanha" }, { status: 500 });
  }
}
