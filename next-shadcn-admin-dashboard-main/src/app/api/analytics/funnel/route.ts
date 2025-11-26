import { NextRequest, NextResponse } from "next/server";
import { getGA4APIClient } from "@/lib/ga4-api-client";

// Definição padrão das etapas do funil de infoprodutos
const DEFAULT_FUNNEL_STEPS = [
  "page_view", // Visualização da página
  "vsl_play", // Play no VSL
  "vsl_25_percent", // 25% do VSL assistido
  "vsl_50_percent", // 50% do VSL assistido
  "vsl_75_percent", // 75% do VSL assistido
  "vsl_complete", // VSL completo
  "click_checkout", // Clique no botão de checkout
  "begin_checkout", // Início do checkout
  "purchase", // Compra realizada
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";
    const stepsParam = searchParams.get("steps");

    // Usar passos personalizados ou os padrões
    const funnelSteps = stepsParam ? stepsParam.split(",") : DEFAULT_FUNNEL_STEPS;

    const ga4Client = getGA4APIClient();

    const funnelData = await ga4Client.getFunnelData(funnelSteps, startDate, endDate);

    // Calcular métricas adicionais do funil
    const firstStep = funnelData[0]?.activeUsers || 0;
    const lastStep = funnelData[funnelData.length - 1]?.activeUsers || 0;
    const overallConversionRate = firstStep > 0 ? (lastStep / firstStep) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        steps: funnelData,
        summary: {
          totalEntries: firstStep,
          totalConversions: lastStep,
          overallConversionRate: overallConversionRate.toFixed(2),
          dropOffRate: (100 - overallConversionRate).toFixed(2),
        },
      },
      dateRange: { startDate, endDate },
    });
  } catch (error) {
    console.error("Error fetching GA4 funnel data:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch funnel data",
      },
      { status: 500 },
    );
  }
}
