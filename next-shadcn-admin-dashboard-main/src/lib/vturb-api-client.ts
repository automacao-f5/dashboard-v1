import axios, { AxiosInstance } from "axios";

/**
 * Cliente para integração com a API do Vturb Analytics
 * Documentação: https://vturb.gitbook.io/analytics-api/pt
 */
class VturbAPIClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    const apiKey = process.env.VTURB_API_KEY;

    if (!apiKey) {
      console.warn("⚠️ VTURB_API_KEY não configurado nas variáveis de ambiente");
    }

    this.apiKey = apiKey || "";

    // Base URL da API Analytics do Vturb
    this.client = axios.create({
      baseURL: "https://api.vturb.com.br/analytics/v2",
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  /**
   * Verificar se a API key está configurada
   */
  private hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * Buscar lista de vídeos da conta
   */
  async getVideos(params?: { limit?: number; page?: number; start_date?: string; end_date?: string }) {
    if (!this.hasApiKey()) {
      throw new Error("Vturb API key não configurada");
    }

    try {
      const response = await this.client.get("/videos", { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(`Vturb API Error (getVideos):`, errorMessage);
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar estatísticas gerais de todos os vídeos
   */
  async getOverallStats(params?: { start_date?: string; end_date?: string }) {
    if (!this.hasApiKey()) {
      throw new Error("Vturb API key não configurada");
    }

    try {
      const response = await this.client.get("/stats", { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(`Vturb API Error (getOverallStats):`, errorMessage);
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar estatísticas de um vídeo específico
   */
  async getVideoStats(
    videoId: string,
    params?: {
      start_date?: string;
      end_date?: string;
    },
  ) {
    if (!this.hasApiKey()) {
      throw new Error("Vturb API key não configurada");
    }

    try {
      const response = await this.client.get(`/videos/${videoId}/stats`, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(`Vturb API Error (getVideoStats):`, errorMessage);
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar dados de retenção (curva de retenção)
   */
  async getRetentionData(
    videoId?: string,
    params?: {
      start_date?: string;
      end_date?: string;
    },
  ) {
    if (!this.hasApiKey()) {
      throw new Error("Vturb API key não configurada");
    }

    try {
      const endpoint = videoId ? `/videos/${videoId}/retention` : "/retention";
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(`Vturb API Error (getRetentionData):`, errorMessage);
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar métricas de engajamento
   */
  async getEngagementMetrics(params?: { start_date?: string; end_date?: string; video_id?: string }) {
    if (!this.hasApiKey()) {
      throw new Error("Vturb API key não configurada");
    }

    try {
      const response = await this.client.get("/engagement", { params });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(`Vturb API Error (getEngagementMetrics):`, errorMessage);
        throw new Error(`Vturb API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar métricas consolidadas para dashboard
   * Retorna dados agregados prontos para visualização
   *
   * NOTA: Os endpoints exatos da API do Vturb precisam ser confirmados na documentação oficial.
   * Atualmente retornando dados de exemplo até obter os endpoints corretos.
   */
  async getDashboardMetrics(params?: { start_date?: string; end_date?: string }) {
    if (!this.hasApiKey()) {
      console.warn("⚠️ Vturb API key não configurada. Retornando dados de exemplo.");
      return this.getMockData();
    }

    console.info("📝 Vturb: Endpoints precisam ser configurados conforme documentação oficial.");
    console.info("📚 Consulte: https://vturb.gitbook.io/analytics-api/pt");

    // Por enquanto, retorna dados de exemplo
    // TODO: Atualizar com endpoints corretos após consultar documentação
    return this.getMockData();

    /* EXEMPLO DE IMPLEMENTAÇÃO QUANDO TIVER OS ENDPOINTS CORRETOS:
    try {
      const stats = await this.getOverallStats(params);
      return {
        totalViews: stats.total_views || 0,
        totalPlays: stats.total_plays || 0,
        avgWatchTime: stats.avg_watch_time || 0,
        avgRetention: stats.avg_retention || 0,
        totalVideos: stats.total_videos || 0,
        engagementRate: stats.engagement_rate || 0,
      };
    } catch (error) {
      console.warn("⚠️ Erro ao buscar dados do Vturb:", error);
      return this.getMockData();
    }
    */
  }

  /**
   * Dados de exemplo para quando a API não estiver configurada
   */
  private getMockData() {
    return {
      totalViews: 15420,
      totalPlays: 8234,
      avgWatchTime: 245, // segundos (4:05)
      avgRetention: 68.5, // porcentagem
      totalVideos: 12,
      engagementRate: 53.4, // porcentagem
    };
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
