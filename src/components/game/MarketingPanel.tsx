import { useState } from "react";
import { formatCurrency } from "@/utils/gameEngine";
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  Target, 
  Play, 
  Pause,
  Globe,
  Mail,
  Tv,
  Calendar,
  BarChart3,
  Plus,
  Eye,
  MousePointerClick
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  channel: string;
  budget: number;
  duration: number;
  startDate: number;
  reach: number;
  conversions: number;
  roi: number;
  active: boolean;
}

interface MarketingPanelProps {
  campaigns: Campaign[];
  treasury: number;
  reputation: number;
  onLaunchCampaign: (channel: string, budget: number, duration: number) => void;
  onPauseCampaign?: (campaignId: string) => void;
  onStopCampaign?: (campaignId: string) => void;
}

const channelConfig: Record<string, { icon: any; color: string; label: string }> = {
  social: { icon: Users, color: "text-blue-500", label: "Réseaux Sociaux" },
  seo: { icon: Globe, color: "text-green-500", label: "SEO" },
  ads: { icon: Target, color: "text-purple-500", label: "Publicité" },
  email: { icon: Mail, color: "text-orange-500", label: "Email Marketing" },
  events: { icon: Calendar, color: "text-cyan-500", label: "Événements" },
  pr: { icon: Megaphone, color: "text-pink-500", label: "Relations Presse" },
  tv: { icon: Tv, color: "text-red-500", label: "TV & Radio" },
  influencer: { icon: Users, color: "text-yellow-500", label: "Influenceurs" },
};

const campaignTemplates = [
  { channel: "social", name: "Campagne Social Media", baseCost: 2000, baseReach: 10000, duration: 7 },
  { channel: "seo", name: "Optimisation SEO", baseCost: 5000, baseReach: 5000, duration: 30 },
  { channel: "ads", name: "Google Ads", baseCost: 3000, baseReach: 15000, duration: 14 },
  { channel: "email", name: "Newsletter", baseCost: 500, baseReach: 2000, duration: 7 },
  { channel: "events", name: "Webinaire", baseCost: 1500, baseReach: 500, duration: 1 },
  { channel: "pr", name: "Communiqué de Presse", baseCost: 3000, baseReach: 8000, duration: 14 },
  { channel: "influencer", name: "Partenariat Influenceur", baseCost: 5000, baseReach: 25000, duration: 7 },
];

export function MarketingPanel({ 
  campaigns, 
  treasury, 
  reputation,
  onLaunchCampaign,
  onPauseCampaign,
  onStopCampaign 
}: MarketingPanelProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [budget, setBudget] = useState(2000);
  const [duration, setDuration] = useState(7);

  const activeCampaigns = campaigns.filter(c => c.active);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgRoi = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length 
    : 0;

  const handleLaunch = () => {
    if (selectedChannel && budget > 0 && treasury >= budget) {
      onLaunchCampaign(selectedChannel, budget, duration);
      setSelectedChannel(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Megaphone className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{activeCampaigns.length}</p>
          <p className="text-xs text-muted-foreground">Campagnes Actives</p>
        </div>
        <div className="game-panel text-center">
          <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{(totalReach / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground">Portée Totale</p>
        </div>
        <div className="game-panel text-center">
          <MousePointerClick className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalConversions}</p>
          <p className="text-xs text-muted-foreground">Conversions</p>
        </div>
        <div className="game-panel text-center">
          <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className={cn("text-2xl font-bold", avgRoi >= 0 ? "text-success" : "text-destructive")}>
            {avgRoi.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">ROI Moyen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Launch New Campaign */}
        <div className="game-panel">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Lancer une Campagne
          </h3>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {Object.entries(channelConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedChannel(key)}
                  className={cn(
                    "p-3 rounded-lg border transition-all text-center",
                    selectedChannel === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mx-auto mb-1", config.color)} />
                  <p className="text-[10px] truncate">{config.label}</p>
                </button>
              );
            })}
          </div>

          {selectedChannel && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Budget</label>
                <input
                  type="range"
                  min={500}
                  max={Math.min(100000, treasury)}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>500€</span>
                  <span className="font-bold text-foreground">{formatCurrency(budget)}</span>
                  <span>{formatCurrency(Math.min(100000, treasury))}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Durée (jours)</label>
                <div className="flex gap-2">
                  {[7, 14, 30, 60, 90].map(d => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={cn(
                        "flex-1 py-2 rounded text-sm",
                        duration === d
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      {d}j
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Portée estimée</span>
                  <span className="font-medium">{((budget / 1000) * 5000).toLocaleString()} personnes</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Coût/jour</span>
                  <span className="font-medium">{formatCurrency(budget / duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversions estimées</span>
                  <span className="font-medium">~{Math.round((budget / 1000) * 5 * (reputation / 50))}</span>
                </div>
              </div>

              <button 
                onClick={handleLaunch}
                disabled={treasury < budget}
                className="w-full btn-game-primary"
              >
                Lancer la Campagne
              </button>
            </div>
          )}
        </div>

        {/* Active Campaigns */}
        <div className="game-panel">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Campagnes Actives
          </h3>
          
          {activeCampaigns.length === 0 ? (
            <div className="text-center py-8">
              <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Aucune campagne active</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activeCampaigns.map(campaign => {
                const config = channelConfig[campaign.channel] || channelConfig.social;
                const Icon = config.icon;
                
                return (
                  <div key={campaign.id} className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", config.color)} />
                        <span className="font-medium text-sm">{campaign.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {onPauseCampaign && (
                          <button 
                            onClick={() => onPauseCampaign(campaign.id)}
                            className="p-1 rounded hover:bg-secondary"
                          >
                            <Pause className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{formatCurrency(campaign.budget)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Portée</p>
                        <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROI</p>
                        <p className={cn("font-medium", campaign.roi >= 0 ? "text-success" : "text-destructive")}>
                          {campaign.roi.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>Progression</span>
                        <span>{campaign.duration}j restants</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.random() * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Campaign History */}
      <div className="game-panel">
        <h3 className="font-display font-semibold mb-4">Historique des Campagnes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">Campagne</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Canal</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Budget</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Portée</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Conversions</th>
                <th className="text-right py-2 text-muted-foreground font-medium">ROI</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 10).map(campaign => {
                const config = channelConfig[campaign.channel] || channelConfig.social;
                return (
                  <tr key={campaign.id} className="border-b border-border/50">
                    <td className="py-2">{campaign.name}</td>
                    <td className="py-2">
                      <span className={cn("text-xs", config.color)}>{config.label}</span>
                    </td>
                    <td className="py-2 text-right font-mono">{formatCurrency(campaign.budget)}</td>
                    <td className="py-2 text-right font-mono">{campaign.reach.toLocaleString()}</td>
                    <td className="py-2 text-right font-mono">{campaign.conversions}</td>
                    <td className={cn("py-2 text-right font-mono", campaign.roi >= 0 ? "text-success" : "text-destructive")}>
                      {campaign.roi.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
