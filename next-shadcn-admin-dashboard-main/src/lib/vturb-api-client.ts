import axios, { AxiosInstance } from "axios";

/**
 * Cliente para integração com a API do Vturb
 * Documentação: https://vturb.com.br/api/docs
 */
class VturbAPIClient {
  private client: AxiosInstance;

  constructor() {
    const apiKey = process.env.VTURB_API_KEY;

    if (!apiKey) {
      throw new Error("VTURB_API_KEY não configurado nas variáveis de ambiente");
    }

    this.client = axios.create({
      baseURL: "https://api.vturb.com.br/v1",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  /**
   * Buscar estatísticas de vídeos
   */
  async getVideoStats(videoId?: string, startDate?: string, endDate?: string) {
    try {
      const params: any = {};

      if (videoId) params.video_id = videoId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.client.get("/videos/stats", { params });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar lista de vídeos
   */
  async getVideos(limit: number = 50, page: number = 1) {
    try {
      const response = await this.client.get("/videos", {
        params: { limit, page },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar detalhes de um vídeo específico
   */
  async getVideoDetails(videoId: string) {
    try {
      const response = await this.client.get(`/videos/${videoId}`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar métricas de engajamento
   */
  async getEngagementMetrics(startDate?: string, endDate?: string) {
    try {
      const params: any = {};

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.client.get("/analytics/engagement", { params });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar métricas de conversão de vídeos
   */
  async getConversionMetrics(startDate?: string, endDate?: string) {
    try {
      const params: any = {};

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.client.get("/analytics/conversions", { params });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar tempo de visualização
   */
  async getWatchTimeStats(videoId?: string, startDate?: string, endDate?: string) {
    try {
      const params: any = {};

      if (videoId) params.video_id = videoId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await this.client.get("/analytics/watch-time", { params });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }
}

// Singleton instance
let vturbAPIClientInstance: VturbAPIClient | null = null;

export function getVturbAPIClient(): VturbAPIClient {
  if (!vturbAPIClientInstance) {
    vturbAPIClientInstance = new VturbAPIClient();
  }
  return vturbAPIClientInstance;
}

export const vturbAPIClient = getVturbAPIClient();
