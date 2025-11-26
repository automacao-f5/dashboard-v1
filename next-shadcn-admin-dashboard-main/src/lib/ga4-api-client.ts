import { BetaAnalyticsDataClient } from "@google-analytics/data";

// Tipos para respostas do GA4
export interface GA4PageViewData {
  pagePath: string;
  pageTitle: string;
  screenPageViews: number;
  sessions: number;
  activeUsers: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export interface GA4EventData {
  eventName: string;
  eventCount: number;
  totalUsers: number;
}

export interface GA4TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
  newUsers: number;
  bounceRate: number;
}

export interface GA4DateRangeData {
  date: string;
  sessions: number;
  activeUsers: number;
  screenPageViews: number;
  newUsers: number;
  engagementRate: number;
  averageSessionDuration: number;
}

export interface GA4FunnelStep {
  stepName: string;
  activeUsers: number;
  completionRate?: number;
}

export interface GA4CampaignData {
  campaign: string;
  source: string;
  medium: string;
  sessions: number;
  users: number;
  conversions: number;
  conversionRate: number;
}

class GA4APIClient {
  private client: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor() {
    const propertyId = process.env.GA4_PROPERTY_ID;

    if (!propertyId) {
      throw new Error("GA4_PROPERTY_ID não configurado nas variáveis de ambiente");
    }

    this.propertyId = propertyId;

    // Configuração com credenciais do arquivo JSON ou variáveis de ambiente
    const credentials = this.getCredentials();

    this.client = new BetaAnalyticsDataClient({
      credentials,
    });
  }

  private getCredentials() {
    // Primeiro, tenta usar variáveis de ambiente individuais
    if (process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY) {
      return {
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY.replace(/\\n/g, "\n"),
      };
    }

    // Se não houver variáveis individuais, tenta usar o JSON completo
    if (process.env.GA4_CREDENTIALS_JSON) {
      try {
        return JSON.parse(process.env.GA4_CREDENTIALS_JSON);
      } catch {
        throw new Error("GA4_CREDENTIALS_JSON inválido");
      }
    }

    throw new Error(
      "Credenciais GA4 não configuradas. Configure GA4_CLIENT_EMAIL e GA4_PRIVATE_KEY ou GA4_CREDENTIALS_JSON",
    );
  }

  /**
   * Buscar pageviews e métricas de páginas
   */
  async getPageViews(
    startDate: string = "30daysAgo",
    endDate: string = "today",
    limit: number = 20,
  ): Promise<GA4PageViewData[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
        limit,
        orderBys: [
          {
            metric: { metricName: "screenPageViews" },
            desc: true,
          },
        ],
      });

      return (response.rows || []).map((row) => ({
        pagePath: row.dimensionValues?.[0]?.value || "",
        pageTitle: row.dimensionValues?.[1]?.value || "",
        screenPageViews: parseInt(row.metricValues?.[0]?.value || "0", 10),
        sessions: parseInt(row.metricValues?.[1]?.value || "0", 10),
        activeUsers: parseInt(row.metricValues?.[2]?.value || "0", 10),
        averageSessionDuration: parseFloat(row.metricValues?.[3]?.value || "0"),
        bounceRate: parseFloat(row.metricValues?.[4]?.value || "0"),
      }));
    } catch (error) {
      console.error("Error fetching page views:", error);
      throw error;
    }
  }

  /**
   * Buscar eventos específicos
   */
  async getEvents(
    startDate: string = "30daysAgo",
    endDate: string = "today",
    eventNames?: string[],
  ): Promise<GA4EventData[]> {
    try {
      const request: any = {
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
        orderBys: [
          {
            metric: { metricName: "eventCount" },
            desc: true,
          },
        ],
      };

      // Filtrar por eventos específicos se fornecidos
      if (eventNames && eventNames.length > 0) {
        request.dimensionFilter = {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: eventNames,
            },
          },
        };
      }

      const [response] = await this.client.runReport(request);

      return (response.rows || []).map((row) => ({
        eventName: row.dimensionValues?.[0]?.value || "",
        eventCount: parseInt(row.metricValues?.[0]?.value || "0", 10),
        totalUsers: parseInt(row.metricValues?.[1]?.value || "0", 10),
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  /**
   * Buscar fontes de tráfego
   */
  async getTrafficSources(
    startDate: string = "30daysAgo",
    endDate: string = "today",
    limit: number = 10,
  ): Promise<GA4TrafficSource[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "newUsers" }, { name: "bounceRate" }],
        limit,
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
      });

      return (response.rows || []).map((row) => ({
        source: row.dimensionValues?.[0]?.value || "",
        medium: row.dimensionValues?.[1]?.value || "",
        sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
        users: parseInt(row.metricValues?.[1]?.value || "0", 10),
        newUsers: parseInt(row.metricValues?.[2]?.value || "0", 10),
        bounceRate: parseFloat(row.metricValues?.[3]?.value || "0"),
      }));
    } catch (error) {
      console.error("Error fetching traffic sources:", error);
      throw error;
    }
  }

  /**
   * Buscar dados por período (para gráficos de tendência)
   */
  async getDataByDateRange(startDate: string = "30daysAgo", endDate: string = "today"): Promise<GA4DateRangeData[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "newUsers" },
          { name: "engagementRate" },
          { name: "averageSessionDuration" },
        ],
        orderBys: [
          {
            dimension: { dimensionName: "date" },
            desc: false,
          },
        ],
      });

      return (response.rows || []).map((row) => {
        const dateStr = row.dimensionValues?.[0]?.value || "";
        // Formatar data de YYYYMMDD para YYYY-MM-DD
        const formattedDate =
          dateStr.length === 8 ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}` : dateStr;

        return {
          date: formattedDate,
          sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
          activeUsers: parseInt(row.metricValues?.[1]?.value || "0", 10),
          screenPageViews: parseInt(row.metricValues?.[2]?.value || "0", 10),
          newUsers: parseInt(row.metricValues?.[3]?.value || "0", 10),
          engagementRate: parseFloat(row.metricValues?.[4]?.value || "0"),
          averageSessionDuration: parseFloat(row.metricValues?.[5]?.value || "0"),
        };
      });
    } catch (error) {
      console.error("Error fetching date range data:", error);
      throw error;
    }
  }

  /**
   * Buscar métricas resumidas (KPIs)
   */
  async getSummaryMetrics(startDate: string = "30daysAgo", endDate: string = "today") {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "screenPageViews" },
          { name: "engagementRate" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "sessionsPerUser" },
          { name: "screenPageViewsPerSession" },
        ],
      });

      const row = response.rows?.[0];
      return {
        sessions: parseInt(row?.metricValues?.[0]?.value || "0", 10),
        activeUsers: parseInt(row?.metricValues?.[1]?.value || "0", 10),
        newUsers: parseInt(row?.metricValues?.[2]?.value || "0", 10),
        screenPageViews: parseInt(row?.metricValues?.[3]?.value || "0", 10),
        engagementRate: parseFloat(row?.metricValues?.[4]?.value || "0"),
        averageSessionDuration: parseFloat(row?.metricValues?.[5]?.value || "0"),
        bounceRate: parseFloat(row?.metricValues?.[6]?.value || "0"),
        sessionsPerUser: parseFloat(row?.metricValues?.[7]?.value || "0"),
        screenPageViewsPerSession: parseFloat(row?.metricValues?.[8]?.value || "0"),
      };
    } catch (error) {
      console.error("Error fetching summary metrics:", error);
      throw error;
    }
  }

  /**
   * Buscar dados de campanha (UTM)
   */
  async getCampaignData(
    startDate: string = "30daysAgo",
    endDate: string = "today",
    limit: number = 20,
  ): Promise<GA4CampaignData[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "sessionCampaignName" }, { name: "sessionSource" }, { name: "sessionMedium" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "conversions" }],
        limit,
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
      });

      return (response.rows || []).map((row) => {
        const sessions = parseInt(row.metricValues?.[0]?.value || "0", 10);
        const conversions = parseInt(row.metricValues?.[2]?.value || "0", 10);
        return {
          campaign: row.dimensionValues?.[0]?.value || "(not set)",
          source: row.dimensionValues?.[1]?.value || "",
          medium: row.dimensionValues?.[2]?.value || "",
          sessions,
          users: parseInt(row.metricValues?.[1]?.value || "0", 10),
          conversions,
          conversionRate: sessions > 0 ? (conversions / sessions) * 100 : 0,
        };
      });
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      throw error;
    }
  }

  /**
   * Buscar dados por página específica (para análise de VSL)
   */
  async getPageSpecificData(pagePath: string, startDate: string = "30daysAgo", endDate: string = "today") {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "pagePath" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "activeUsers" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
          { name: "engagementRate" },
        ],
        dimensionFilter: {
          filter: {
            fieldName: "pagePath",
            stringFilter: {
              matchType: "CONTAINS",
              value: pagePath,
            },
          },
        },
      });

      const row = response.rows?.[0];
      return {
        pagePath: row?.dimensionValues?.[0]?.value || pagePath,
        screenPageViews: parseInt(row?.metricValues?.[0]?.value || "0", 10),
        activeUsers: parseInt(row?.metricValues?.[1]?.value || "0", 10),
        averageSessionDuration: parseFloat(row?.metricValues?.[2]?.value || "0"),
        bounceRate: parseFloat(row?.metricValues?.[3]?.value || "0"),
        engagementRate: parseFloat(row?.metricValues?.[4]?.value || "0"),
      };
    } catch (error) {
      console.error("Error fetching page specific data:", error);
      throw error;
    }
  }

  /**
   * Buscar dados de funil personalizado baseado em eventos
   */
  async getFunnelData(
    funnelSteps: string[],
    startDate: string = "30daysAgo",
    endDate: string = "today",
  ): Promise<GA4FunnelStep[]> {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "activeUsers" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: {
              values: funnelSteps,
            },
          },
        },
      });

      // Mapear resultados mantendo a ordem do funil
      const resultsMap = new Map<string, number>();
      (response.rows || []).forEach((row) => {
        const eventName = row.dimensionValues?.[0]?.value || "";
        const users = parseInt(row.metricValues?.[0]?.value || "0", 10);
        resultsMap.set(eventName, users);
      });

      // Retornar na ordem do funil com taxa de conclusão
      let previousUsers = 0;
      return funnelSteps.map((step, index) => {
        const users = resultsMap.get(step) || 0;
        const completionRate = index === 0 ? 100 : previousUsers > 0 ? (users / previousUsers) * 100 : 0;
        previousUsers = users;
        return {
          stepName: step,
          activeUsers: users,
          completionRate,
        };
      });
    } catch (error) {
      console.error("Error fetching funnel data:", error);
      throw error;
    }
  }

  /**
   * Buscar dados de dispositivo
   */
  async getDeviceData(startDate: string = "30daysAgo", endDate: string = "today") {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
      });

      return (response.rows || []).map((row) => ({
        device: row.dimensionValues?.[0]?.value || "",
        sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
        users: parseInt(row.metricValues?.[1]?.value || "0", 10),
        pageViews: parseInt(row.metricValues?.[2]?.value || "0", 10),
        avgSessionDuration: parseFloat(row.metricValues?.[3]?.value || "0"),
        bounceRate: parseFloat(row.metricValues?.[4]?.value || "0"),
      }));
    } catch (error) {
      console.error("Error fetching device data:", error);
      throw error;
    }
  }

  /**
   * Buscar dados geográficos
   */
  async getGeographicData(startDate: string = "30daysAgo", endDate: string = "today", limit: number = 10) {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "country" }, { name: "region" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "conversions" }],
        limit,
        orderBys: [
          {
            metric: { metricName: "sessions" },
            desc: true,
          },
        ],
      });

      return (response.rows || []).map((row) => ({
        country: row.dimensionValues?.[0]?.value || "",
        region: row.dimensionValues?.[1]?.value || "",
        sessions: parseInt(row.metricValues?.[0]?.value || "0", 10),
        users: parseInt(row.metricValues?.[1]?.value || "0", 10),
        conversions: parseInt(row.metricValues?.[2]?.value || "0", 10),
      }));
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      throw error;
    }
  }

  /**
   * Comparar dois períodos
   */
  async comparePeriods(
    currentStartDate: string,
    currentEndDate: string,
    previousStartDate: string,
    previousEndDate: string,
  ) {
    try {
      const [response] = await this.client.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [
          { startDate: currentStartDate, endDate: currentEndDate },
          { startDate: previousStartDate, endDate: previousEndDate },
        ],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
          { name: "conversions" },
          { name: "engagementRate" },
        ],
      });

      const currentRow = response.rows?.[0];
      const previousRow = response.rows?.[1];

      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };

      const currentSessions = parseInt(currentRow?.metricValues?.[0]?.value || "0", 10);
      const previousSessions = parseInt(previousRow?.metricValues?.[0]?.value || "0", 10);

      const currentUsers = parseInt(currentRow?.metricValues?.[1]?.value || "0", 10);
      const previousUsers = parseInt(previousRow?.metricValues?.[1]?.value || "0", 10);

      const currentPageViews = parseInt(currentRow?.metricValues?.[2]?.value || "0", 10);
      const previousPageViews = parseInt(previousRow?.metricValues?.[2]?.value || "0", 10);

      const currentConversions = parseInt(currentRow?.metricValues?.[3]?.value || "0", 10);
      const previousConversions = parseInt(previousRow?.metricValues?.[3]?.value || "0", 10);

      const currentEngagement = parseFloat(currentRow?.metricValues?.[4]?.value || "0");
      const previousEngagement = parseFloat(previousRow?.metricValues?.[4]?.value || "0");

      return {
        current: {
          sessions: currentSessions,
          users: currentUsers,
          pageViews: currentPageViews,
          conversions: currentConversions,
          engagementRate: currentEngagement,
        },
        previous: {
          sessions: previousSessions,
          users: previousUsers,
          pageViews: previousPageViews,
          conversions: previousConversions,
          engagementRate: previousEngagement,
        },
        changes: {
          sessions: calculateChange(currentSessions, previousSessions),
          users: calculateChange(currentUsers, previousUsers),
          pageViews: calculateChange(currentPageViews, previousPageViews),
          conversions: calculateChange(currentConversions, previousConversions),
          engagementRate: calculateChange(currentEngagement, previousEngagement),
        },
      };
    } catch (error) {
      console.error("Error comparing periods:", error);
      throw error;
    }
  }
}

// Singleton instance
let ga4APIClientInstance: GA4APIClient | null = null;

export function getGA4APIClient(): GA4APIClient {
  if (!ga4APIClientInstance) {
    ga4APIClientInstance = new GA4APIClient();
  }
  return ga4APIClientInstance;
}

// Export para uso direto (será inicializado quando chamado)
export { GA4APIClient };
