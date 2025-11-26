"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Smartphone } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface Insights {
  impressions?: string;
  reach?: string;
}

interface DemographicData {
  age?: string;
  gender?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
}

interface GeographicData {
  country?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
}

interface DeviceData {
  device_platform?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
}

interface PlatformData {
  publisher_platform?: string;
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
}

interface CampaignAudienceTabProps {
  campaign: Campaign;
  insights?: Insights;
  demographics: DemographicData[];
  geographics: GeographicData[];
  devices: DeviceData[];
  platforms: PlatformData[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#ff69b4', '#4169e1'];

export function CampaignAudienceTab({
  campaign,
  insights,
  demographics,
  geographics,
  devices,
  platforms,
}: CampaignAudienceTabProps) {
  
  // Processar dados demográficos por idade
  const ageData = demographics.reduce((acc: any[], item) => {
    if (item.age) {
      const existing = acc.find(a => a.name === item.age);
      const impressions = parseInt(item.impressions || "0");
      
      if (existing) {
        existing.value += impressions;
      } else {
        acc.push({
          name: item.age,
          value: impressions,
        });
      }
    }
    return acc;
  }, []).sort((a, b) => b.value - a.value);

  // Processar dados demográficos por gênero
  const genderData = demographics.reduce((acc: any[], item) => {
    if (item.gender) {
      const existing = acc.find(g => g.name === item.gender);
      const impressions = parseInt(item.impressions || "0");
      
      if (existing) {
        existing.value += impressions;
      } else {
        const genderLabel = item.gender === 'male' ? 'Masculino' : 
                           item.gender === 'female' ? 'Feminino' : 
                           'Não especificado';
        acc.push({
          name: genderLabel,
          value: impressions,
        });
      }
    }
    return acc;
  }, []);

  // Processar dados geográficos
  const locationData = geographics
    .map(item => ({
      country: item.country || 'Desconhecido',
      impressions: parseInt(item.impressions || "0"),
      reach: parseInt(item.reach || "0"),
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10); // Top 10 países

  const totalImpressions = locationData.reduce((sum, item) => sum + item.impressions, 0);

  // Processar dados de dispositivos
  const deviceData = devices.map(item => {
    const platform = item.device_platform || 'unknown';
    const deviceLabel = platform === 'mobile' ? 'Mobile' :
                       platform === 'desktop' ? 'Desktop' :
                       platform === 'tablet' ? 'Tablet' : platform;
    
    return {
      name: deviceLabel,
      value: parseInt(item.impressions || "0"),
    };
  }).filter(item => item.value > 0);

  // Processar dados de plataformas
  const platformData = platforms.map(item => {
    const platform = item.publisher_platform || 'unknown';
    const platformLabel = platform === 'facebook' ? 'Facebook' :
                         platform === 'instagram' ? 'Instagram' :
                         platform === 'audience_network' ? 'Audience Network' :
                         platform === 'messenger' ? 'Messenger' : platform;
    
    return {
      platform: platformLabel,
      impressions: parseInt(item.impressions || "0"),
      percentage: 0, // Será calculado depois
    };
  }).filter(item => item.impressions > 0);

  // Calcular porcentagens
  const totalPlatformImpressions = platformData.reduce((sum, item) => sum + item.impressions, 0);
  platformData.forEach(item => {
    item.percentage = totalPlatformImpressions > 0 
      ? Math.round((item.impressions / totalPlatformImpressions) * 100)
      : 0;
  });

  const hasData = demographics.length > 0 || geographics.length > 0 || devices.length > 0 || platforms.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dados de Público</CardTitle>
          <CardDescription>
            Não há dados demográficos disponíveis para esta campanha no período selecionado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Os dados demográficos podem levar algum tempo para serem processados pela Meta ou podem não estar disponíveis para campanhas recentes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumo de Alcance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Resumo de Alcance
          </CardTitle>
          <CardDescription>
            Quantas pessoas únicas viram seus anúncios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Alcance Total</p>
              <p className="text-3xl font-bold">
                {insights?.reach
                  ? parseInt(insights.reach).toLocaleString("pt-BR")
                  : "0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Impressões</p>
              <p className="text-3xl font-bold">
                {insights?.impressions
                  ? parseInt(insights.impressions).toLocaleString("pt-BR")
                  : "0"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Frequência Média</p>
              <p className="text-3xl font-bold">
                {insights?.impressions && insights?.reach
                  ? (
                      parseInt(insights.impressions) / parseInt(insights.reach)
                    ).toFixed(2)
                  : "0"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Demográficos */}
      {(ageData.length > 0 || genderData.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {ageData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Idade</CardTitle>
                <CardDescription>Faixa etária do público alcançado</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {genderData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
                <CardDescription>Composição de gênero do público</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Localização Geográfica */}
      {locationData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Principais Localizações
            </CardTitle>
            <CardDescription>
              Países com maior alcance da campanha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationData.map((location, index) => {
                const percentage = totalImpressions > 0 
                  ? Math.round((location.impressions / totalImpressions) * 100)
                  : 0;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{location.country}</span>
                      <span className="text-sm text-muted-foreground">
                        {percentage}% ({location.impressions.toLocaleString("pt-BR")} impressões)
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dispositivos e Plataformas */}
      <div className="grid gap-4 md:grid-cols-2">
        {deviceData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Dispositivos
              </CardTitle>
              <CardDescription>Tipo de dispositivo usado</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {platformData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Plataformas</CardTitle>
              <CardDescription>Onde os anúncios foram exibidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformData.map((platform, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{platform.platform}</span>
                      <span className="text-sm font-bold">{platform.percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${platform.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
