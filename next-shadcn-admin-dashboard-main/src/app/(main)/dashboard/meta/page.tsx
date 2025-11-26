import { getMetaCampaigns, getAggregatedInsights, getCampaignInsights } from "./_actions/meta-actions";
import { MetaDashboardClient } from "./_components/meta-dashboard-client";

export default async function MetaPage() {
  // Busca dados do servidor
  const [campaignsData, insightsData] = await Promise.all([
    getMetaCampaigns(50),
    getAggregatedInsights(),
  ]);

  // Busca insights para cada campanha ativa
  const campaignsWithInsights = await Promise.all(
    campaignsData.campaigns.map(async (campaign) => {
      if (campaign.status === "ACTIVE") {
        try {
          const insights = await getCampaignInsights(campaign.id, "last_7d");
          return {
            ...campaign,
            insights: insights?.insights,
          };
        } catch (error) {
          console.error(`Error fetching insights for campaign ${campaign.id}:`, error);
          return campaign;
        }
      }
      return campaign;
    })
  );

  return (
    <MetaDashboardClient
      initialCampaigns={campaignsWithInsights}
      initialInsights={insightsData}
    />
  );
}
