import axios, { AxiosInstance } from "axios";

/**
 * Cliente para integração com a API da Hotmart
 * Documentação: https://developers.hotmart.com/docs/pt-BR/
 */
class HotmartAPIClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiration: number = 0;

  constructor() {
    const clientId = process.env.HOTMART_CLIENT_ID;
    const clientSecret = process.env.HOTMART_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("HOTMART_CLIENT_ID ou HOTMART_CLIENT_SECRET não configurados");
    }

    this.client = axios.create({
      baseURL: "https://developers.hotmart.com",
      timeout: 30000,
    });
  }

  /**
   * Autenticar e obter access token
   */
  private async authenticate() {
    try {
      const clientId = process.env.HOTMART_CLIENT_ID;
      const clientSecret = process.env.HOTMART_CLIENT_SECRET;
      const basicAuth = process.env.HOTMART_BASIC_AUTH;

      const response = await axios.post(
        "https://api-sec-vlc.hotmart.com/security/oauth/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId!,
          client_secret: clientSecret!,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiration = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error_description || error.message;
        throw new Error(`Hotmart Auth Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Obter access token válido (renova se expirado)
   */
  private async getValidToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.tokenExpiration) {
      await this.authenticate();
    }
    return this.accessToken!;
  }

  /**
   * Buscar vendas (histórico de transações)
   */
  async getSales(startDate?: string, endDate?: string, productId?: string) {
    try {
      const token = await this.getValidToken();

      const params: any = {
        max_results: 500,
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (productId) params.product_id = productId;

      const response = await axios.get(
        "https://developers.hotmart.com/payments/api/v1/sales/history",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Hotmart API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar resumo de vendas (dashboard summary)
   */
  async getSalesSummary(startDate?: string, endDate?: string) {
    try {
      const token = await this.getValidToken();

      const params: any = {};

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get(
        "https://developers.hotmart.com/payments/api/v1/sales/summary",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Hotmart API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar assinaturas (subscriptions)
   */
  async getSubscriptions(status?: string, productId?: string) {
    try {
      const token = await this.getValidToken();

      const params: any = {
        max_results: 500,
      };

      if (status) params.status = status;
      if (productId) params.product_id = productId;

      const response = await axios.get(
        "https://developers.hotmart.com/payments/api/v1/subscriptions",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Hotmart API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar produtos
   */
  async getProducts() {
    try {
      const token = await this.getValidToken();

      const response = await axios.get(
        "https://developers.hotmart.com/payments/api/v1/products",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Hotmart API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar comissões
   */
  async getCommissions(startDate?: string, endDate?: string) {
    try {
      const token = await this.getValidToken();

      const params: any = {};

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await axios.get(
        "https://developers.hotmart.com/payments/api/v1/sales/commissions",
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params,
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Hotmart API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Buscar métricas de conversão
   */
  async getConversionMetrics(startDate?: string, endDate?: string, productId?: string) {
    try {
      // Buscar vendas e calcular métricas
      const sales = await this.getSales(startDate, endDate, productId);

      const totalSales = sales.items?.length || 0;
      const totalRevenue = sales.items?.reduce((sum: number, sale: any) => {
        return sum + (sale.purchase?.price?.value || 0);
      }, 0) || 0;

      const approvedSales = sales.items?.filter((sale: any) =>
        sale.purchase?.status === "APPROVED"
      ).length || 0;

      const conversionRate = totalSales > 0 ? (approvedSales / totalSales) * 100 : 0;
      const averageTicket = approvedSales > 0 ? totalRevenue / approvedSales : 0;

      return {
        totalSales,
        approvedSales,
        totalRevenue,
        conversionRate: conversionRate.toFixed(2),
        averageTicket: averageTicket.toFixed(2),
        refundedSales: sales.items?.filter((sale: any) =>
          sale.purchase?.status === "REFUNDED"
        ).length || 0,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Hotmart API Error: ${errorMessage}`);
      }
      throw error;
    }
  }
}

// Singleton instance
let hotmartAPIClientInstance: HotmartAPIClient | null = null;

export function getHotmartAPIClient(): HotmartAPIClient {
  if (!hotmartAPIClientInstance) {
    hotmartAPIClientInstance = new HotmartAPIClient();
  }
  return hotmartAPIClientInstance;
}

export const hotmartAPIClient = getHotmartAPIClient();
