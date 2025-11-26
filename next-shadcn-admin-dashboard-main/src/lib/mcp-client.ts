/**
 * Cliente para comunicação com a Meta Marketing API
 *
 * Este cliente faz chamadas HTTP diretas à API do Meta para buscar dados em tempo real.
 * As credenciais são obtidas das variáveis de ambiente.
 */

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID;
const META_API_VERSION = "v21.0";
const META_API_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

// Validação das credenciais
if (!META_ACCESS_TOKEN) {
  console.error("[MCP Client] META_ACCESS_TOKEN não configurado!");
}
if (!META_AD_ACCOUNT_ID) {
  console.error("[MCP Client] META_AD_ACCOUNT_ID não configurado!");
}

/**
 * Faz chamadas diretas à API do Meta para buscar dados em tempo real
 */
export async function callMCPTool(serverName: string, toolName: string, args: Record<string, any>): Promise<any> {
  try {
    console.log(`[MCP Client] Calling ${serverName}/${toolName}`, args);

    if (serverName === "meta-marketing" && toolName === "get_campaigns") {
      // Busca campanhas em tempo real da API do Meta
      const limit = args?.limit || 50;
      const status = args?.status;

      const url = `${META_API_BASE_URL}/${META_AD_ACCOUNT_ID}/campaigns`;
      const params = new URLSearchParams({
        access_token: META_ACCESS_TOKEN || "",
        fields: "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time",
        limit: limit.toString(),
      });

      if (status) {
        params.append("filtering", JSON.stringify([{ field: "status", operator: "IN", value: [status] }]));
      }

      console.log("[MCP Client] Fetching campaigns from Meta API...");
      const response = await fetch(`${url}?${params.toString()}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[MCP Client] Meta API error:", response.status, errorText);
        throw new Error(`Meta API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[MCP Client] Received campaigns:", data.data?.length || 0);

      return {
        ad_account_id: META_AD_ACCOUNT_ID,
        total_campaigns: data.data?.length || 0,
        campaigns: data.data || [],
      };
    }

    if (serverName === "meta-marketing" && toolName === "get_campaign_insights") {
      // Busca insights em tempo real da API do Meta
      const campaignId = args.campaign_id;
      const datePreset = args.date_preset || "last_7d";

      const url = `${META_API_BASE_URL}/${campaignId}/insights`;
      const params = new URLSearchParams({
        access_token: META_ACCESS_TOKEN || "",
        fields: "impressions,clicks,spend,reach,cpc,cpm,ctr",
        date_preset: datePreset,
      });

      console.log(`[MCP Client] Fetching insights for campaign ${campaignId}...`);
      const response = await fetch(`${url}?${params.toString()}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[MCP Client] Meta API error:", response.status, errorText);
        throw new Error(`Meta API error: ${response.statusText}`);
      }

      const data = await response.json();
      const insights = data.data?.[0] || {};
      console.log(`[MCP Client] Received insights for campaign ${campaignId}`);

      return {
        campaign_id: campaignId,
        date_preset: datePreset,
        insights,
      };
    }

    throw new Error(`Unknown MCP tool: ${serverName}/${toolName}`);
  } catch (error) {
    console.error("Error calling MCP tool:", error);
    throw error;
  }
}
