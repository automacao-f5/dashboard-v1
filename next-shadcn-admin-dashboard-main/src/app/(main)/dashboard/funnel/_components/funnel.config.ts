import { ChartConfig } from "@/components/ui/chart";

// Configuração do funil de vendas para infoprodutos
export const salesFunnelChartConfig = {
  value: {
    label: "Usuários",
    color: "var(--chart-1)",
  },
  stage: {
    label: "Etapa",
  },
} as ChartConfig;

// Configuração do gráfico de fontes de tráfego
export const trafficSourcesChartConfig = {
  sessions: {
    label: "Sessões",
  },
  facebook: {
    label: "Facebook",
    color: "var(--chart-1)",
  },
  instagram: {
    label: "Instagram",
    color: "var(--chart-2)",
  },
  google: {
    label: "Google",
    color: "var(--chart-3)",
  },
  direct: {
    label: "Direto",
    color: "var(--chart-4)",
  },
  other: {
    label: "Outros",
    color: "var(--chart-5)",
  },
} as ChartConfig;

// Configuração do gráfico de tendência
export const trendChartConfig = {
  sessions: {
    label: "Sessões",
    color: "var(--chart-1)",
  },
  activeUsers: {
    label: "Usuários Ativos",
    color: "var(--chart-2)",
  },
  screenPageViews: {
    label: "Visualizações",
    color: "var(--chart-3)",
  },
} as ChartConfig;

// Configuração do gráfico de campanhas
export const campaignsChartConfig = {
  sessions: {
    label: "Sessões",
    color: "var(--chart-1)",
  },
  conversions: {
    label: "Conversões",
    color: "var(--chart-2)",
  },
} as ChartConfig;

// Configuração do gráfico de dispositivos
export const devicesChartConfig = {
  sessions: {
    label: "Sessões",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-3)",
  },
} as ChartConfig;

// Labels amigáveis para etapas do funil
export const funnelStepLabels: Record<string, string> = {
  page_view: "Visualização da Página",
  vsl_play: "Play no VSL",
  vsl_25_percent: "25% VSL",
  vsl_50_percent: "50% VSL",
  vsl_75_percent: "75% VSL",
  vsl_complete: "VSL Completo",
  click_checkout: "Clique no Checkout",
  begin_checkout: "Início Checkout",
  purchase: "Compra",
};

// Cores para cada etapa do funil
export const funnelStepColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

// Presets de período
export const dateRangePresets = [
  { label: "Últimos 7 dias", value: "7daysAgo", endValue: "today" },
  { label: "Últimos 14 dias", value: "14daysAgo", endValue: "today" },
  { label: "Últimos 30 dias", value: "30daysAgo", endValue: "today" },
  { label: "Últimos 90 dias", value: "90daysAgo", endValue: "today" },
  { label: "Este mês", value: "startOfMonth", endValue: "today" },
  { label: "Mês passado", value: "startOfLastMonth", endValue: "endOfLastMonth" },
];
