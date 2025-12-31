import { cn } from "@/lib/utils";
import { MapPin, Building, Globe, Plane, Ship } from "lucide-react";

interface MarketPresence {
  country: string;
  code: string;
  penetration: number;
  hasSubsidiary: boolean;
}

interface MiniMapWidgetProps {
  homeCountry?: string;
  markets: MarketPresence[];
  subsidiaries: number;
}

const countryPositions: Record<string, { x: number; y: number }> = {
  'FR': { x: 45, y: 35 },
  'DE': { x: 52, y: 32 },
  'UK': { x: 42, y: 28 },
  'US': { x: 20, y: 35 },
  'CN': { x: 78, y: 38 },
  'JP': { x: 85, y: 35 },
  'BR': { x: 30, y: 60 },
  'IN': { x: 70, y: 45 },
  'AU': { x: 82, y: 70 },
  'CA': { x: 18, y: 25 },
  'ES': { x: 42, y: 42 },
  'IT': { x: 50, y: 40 },
  'NL': { x: 48, y: 30 },
  'CH': { x: 48, y: 36 },
};

export function MiniMapWidget({ homeCountry = 'FR', markets, subsidiaries }: MiniMapWidgetProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">Présence mondiale</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{markets.length} marchés</span>
      </div>

      {/* Mini World Map */}
      <div className="relative h-32 bg-gradient-to-br from-blue-950/50 to-cyan-950/50 rounded-lg border border-white/10 overflow-hidden">
        {/* Simplified continents */}
        <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full opacity-30">
          {/* North America */}
          <path d="M5,15 Q15,10 25,15 L30,25 Q25,35 20,40 L10,35 Q5,25 5,15" fill="currentColor" className="text-white/20" />
          {/* South America */}
          <path d="M20,45 Q30,42 32,50 L28,70 Q22,75 18,65 L20,45" fill="currentColor" className="text-white/20" />
          {/* Europe */}
          <path d="M40,20 Q50,18 55,25 L52,35 Q45,40 40,35 L40,20" fill="currentColor" className="text-white/20" />
          {/* Africa */}
          <path d="M42,42 Q52,40 55,48 L50,65 Q45,70 42,60 L42,42" fill="currentColor" className="text-white/20" />
          {/* Asia */}
          <path d="M58,18 Q75,15 90,25 L88,45 Q75,50 60,40 L58,18" fill="currentColor" className="text-white/20" />
          {/* Australia */}
          <path d="M75,60 Q85,58 88,65 L85,72 Q78,74 75,68 L75,60" fill="currentColor" className="text-white/20" />
        </svg>

        {/* Home base */}
        {countryPositions[homeCountry] && (
          <div 
            className="absolute z-10"
            style={{ 
              left: `${countryPositions[homeCountry].x}%`, 
              top: `${countryPositions[homeCountry].y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <Building className="w-4 h-4 text-primary drop-shadow-glow" />
              <div className="absolute -inset-2 bg-primary/30 rounded-full animate-ping" />
            </div>
          </div>
        )}

        {/* Market presences */}
        {markets.map(market => {
          const pos = countryPositions[market.code];
          if (!pos || market.code === homeCountry) return null;
          
          return (
            <div
              key={market.code}
              className="absolute z-5 group"
              style={{ 
                left: `${pos.x}%`, 
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {market.hasSubsidiary ? (
                <Building className="w-3 h-3 text-success" />
              ) : (
                <MapPin className="w-3 h-3 text-warning" />
              )}
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-background/90 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {market.country}: {market.penetration}%
              </div>
            </div>
          );
        })}

        {/* Connection lines */}
        {markets.length > 0 && (
          <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full pointer-events-none">
            {markets.map(market => {
              const pos = countryPositions[market.code];
              const homePos = countryPositions[homeCountry];
              if (!pos || !homePos || market.code === homeCountry) return null;
              
              return (
                <line
                  key={market.code}
                  x1={homePos.x}
                  y1={homePos.y}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  strokeDasharray="2,2"
                  className="text-primary/40"
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-around text-[10px]">
        <div className="flex items-center gap-1">
          <Building className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">Siège</span>
        </div>
        <div className="flex items-center gap-1">
          <Building className="w-3 h-3 text-success" />
          <span className="text-muted-foreground">Filiale</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-warning" />
          <span className="text-muted-foreground">Export</span>
        </div>
      </div>
    </div>
  );
}
