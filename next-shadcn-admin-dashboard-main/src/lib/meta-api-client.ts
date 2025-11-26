import axios, { AxiosInstance } from "axios";

class MetaAPIClient {
  private client: AxiosInstance;
  private adAccountId: string;

  constructor() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = process.env.META_API_VERSION || "v21.0";
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (!accessToken) {
      throw new Error("META_ACCESS_TOKEN não configurado nas variáveis de ambiente");
    }

    if (!adAccountId) {
      throw new Error("META_AD_ACCOUNT_ID não configurado nas variáveis de ambiente");
    }

    this.adAccountId = adAccountId;

    this.client = axios.create({
      baseURL: `https://graph.facebook.com/${apiVersion}`,
      params: {
        access_token: accessToken,
      },
      timeout: 30000, // 30 segundos
    });
  }

  /**
   * Buscar campanhas da conta de anúncios
   */
  async getCampaigns(limit: number = 25, status?: string) {
    try {
      const params: any = {
        fields: "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time",
        limit,
      };

      if (status) {
        params.filtering = JSON.stringify([
          { field: "status", operator: "IN", value: [status] },
        ]);
      }

      const response = await this.client.get(`/${this.adAccountId}/campaigns`, {
        params,
      });

      return {
        data: response.data.data || [],
        paging: response.data.paging,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        throw new Error(`Meta API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar insights de uma campanha específica
   */
  async getCampaignInsights(campaignId: string, datePreset: string = "last_7d") {
    try {
      const response = await this.client.get(`/${campaignId}/insights`, {
        params: {
          fields: "impressions,clicks,spend,reach,cpc,cpm,ctr",
          date_preset: datePreset,
        },
      });

      return response.data.data?.[0] || {};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error(`Error fetching insights for campaign ${campaignId}:`, errorMessage);
        return {};
      }
      throw error;
    }
  }

  /**
   * Buscar insights com breakdown diário para gráficos de tendência
   */
  async getCampaignInsightsBreakdown(
    campaignId: string,
    datePreset: string = "last_7d"
  ) {
    try {
      const response = await this.client.get(`/${campaignId}/insights`, {
        params: {
          fields:
            "impressions,clicks,spend,reach,cpc,cpm,ctr,date_start,date_stop",
          date_preset: datePreset,
          time_increment: 1, // Breakdown diário
        },
      });

      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error(
          `Error fetching breakdown for campaign ${campaignId}:`,
          errorMessage
        );
        return [];
      }
      throw error;
    }
  }

  /**
   * Buscar produtos do catálogo (se disponível)
   */
  async getProducts(catalogId: string, limit: number = 25) {
    try {
      const response = await this.client.get(`/${catalogId}/products`, {
        params: {
          fields: "id,name,description,price,availability,image_url,url",
          limit,
        },
      });

      return {
        data: response.data.data || [],
        paging: response.data.paging,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        throw new Error(`Meta API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar informações da conta de anúncios
   */
  async getAdAccountInfo() {
    try {
      const response = await this.client.get(`/${this.adAccountId}`, {
        params: {
          fields: "id,name,currency,account_status,amount_spent,balance",
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        throw new Error(`Meta API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar insights demográficos de uma campanha (idade e gênero)
   */
  async getCampaignDemographics(
    campaignId: string,
    datePreset: string = "last_30d"
  ) {
    try {
      // Buscar breakdown por idade e gênero
      const response = await this.client.get(`/${campaignId}/insights`, {
        params: {
          fields: "impressions,clicks,spend,reach",
          date_preset: datePreset,
          breakdowns: "age,gender",
        },
      });

      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error(
          `Error fetching demographics for campaign ${campaignId}:`,
          errorMessage
        );
        return [];
      }
      throw error;
    }
  }

  /**
   * Buscar insights geográficos de uma campanha
   */
  async getCampaignGeographics(
    campaignId: string,
    datePreset: string = "last_30d"
  ) {
    try {
      // Buscar breakdown por país e região
      const response = await this.client.get(`/${campaignId}/insights`, {
        params: {
          fields: "impressions,clicks,spend,reach",
          date_preset: datePreset,
          breakdowns: "country",
        },
      });

      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error(
          `Error fetching geographics for campaign ${campaignId}:`,
          errorMessage
        );
        return [];
      }
      throw error;
    }
  }

  /**
   * Buscar insights por dispositivo
   */
  async getCampaignDeviceBreakdown(
    campaignId: string,
    datePreset: string = "last_30d"
  ) {
    try {
      const response = await this.client.get(`/${campaignId}/insights`, {
        params: {
          fields: "impressions,clicks,spend,reach",
          date_preset: datePreset,
          breakdowns: "device_platform",
        },
      });

      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error(
          `Error fetching device breakdown for campaign ${campaignId}:`,
          errorMessage
        );
        return [];
      }
      throw error;
    }
  }

  /**
   * Buscar insights por plataforma (Facebook, Instagram, etc.)
   */
  async getCampaignPlatformBreakdown(
    campaignId: string,
    datePreset: string = "last_30d"
  ) {
    try {
      const response = await this.client.get(`/${campaignId}/insights`, {
        params: {
          fields: "impressions,clicks,spend,reach",
          date_preset: datePreset,
          breakdowns: "publisher_platform",
        },
      });

      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message || error.message;
        console.error(
          `Error fetching platform breakdown for campaign ${campaignId}:`,
          errorMessage
        );
        return [];
      }
      throw error;
    }
  }
}

// Singleton instance
let metaAPIClientInstance: MetaAPIClient | null = null;

export function getMetaAPIClient(): MetaAPIClient {
  if (!metaAPIClientInstance) {
    metaAPIClientInstance = new MetaAPIClient();
  }
  return metaAPIClientInstance;
}

export const metaAPIClient = getMetaAPIClient();
