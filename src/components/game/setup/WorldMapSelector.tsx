import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, MapPin, Building2, TrendingUp, Globe, Zap, 
  Factory, Ship, Landmark, X, Filter, Star, Loader2,
  DollarSign, Users, Briefcase, Wifi, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ExtendedCityData } from "@/types/ultraRealism";
import { extendedWorldCities } from "@/data/extendedWorldCities";
import { searchCitiesHybrid, getCityByCoordinates } from "@/utils/citySearchEngine";

interface WorldMapSelectorProps {
  selectedCity: ExtendedCityData | null;
  onSelectCity: (city: ExtendedCityData) => void;
}

const CONTINENT_COLORS: Record<string, string> = {
  "Europe": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Amérique du Nord": "bg-green-500/20 text-green-400 border-green-500/30",
  "Amérique du Sud": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Asie": "bg-red-500/20 text-red-400 border-red-500/30",
  "Océanie": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Afrique": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Autre": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const CONTINENT_MARKER_COLORS: Record<string, string> = {
  "Europe": "#3b82f6",
  "Amérique du Nord": "#22c55e",
  "Amérique du Sud": "#f59e0b",
  "Asie": "#ef4444",
  "Océanie": "#06b6d4",
  "Afrique": "#f97316",
  "Autre": "#6b7280",
};

const COUNTRY_FLAGS: Record<string, string> = {
  'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
  'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹',
  'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿',
  'PT': '🇵🇹', 'IE': '🇮🇪', 'GR': '🇬🇷', 'RO': '🇷🇴', 'HU': '🇭🇺', 'JP': '🇯🇵',
  'CN': '🇨🇳', 'KR': '🇰🇷', 'IN': '🇮🇳', 'SG': '🇸🇬', 'HK': '🇭🇰', 'TW': '🇹🇼',
  'TH': '🇹🇭', 'MY': '🇲🇾', 'ID': '🇮🇩', 'VN': '🇻🇳', 'PH': '🇵🇭', 'AE': '🇦🇪',
  'SA': '🇸🇦', 'IL': '🇮🇱', 'AU': '🇦🇺', 'NZ': '🇳🇿', 'BR': '🇧🇷', 'AR': '🇦🇷',
  'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'ZA': '🇿🇦', 'EG': '🇪🇬', 'NG': '🇳🇬',
  'KE': '🇰🇪', 'MA': '🇲🇦', 'RU': '🇷🇺', 'UA': '🇺🇦', 'TR': '🇹🇷'
};

const CONTINENTS = ['Europe', 'Amérique du Nord', 'Amérique du Sud', 'Asie', 'Océanie', 'Afrique'];

export function WorldMapSelector({ selectedCity, onSelectCity }: WorldMapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ExtendedCityData[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<ExtendedCityData | null>(null);
  
  // Leaflet state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search with API
  const handleSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchCitiesHybrid(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, handleSearch]);

  // Get display cities (search results or all cities)
  const displayCities = useMemo(() => {
    if (searchQuery.length >= 2) {
      return searchResults;
    }

    let cities = [...extendedWorldCities];
    
    if (activeContinent) {
      cities = cities.filter(c => c.continent === activeContinent);
    }

    return cities.sort((a, b) => b.economics.gdpPerCapita - a.economics.gdpPerCapita);
  }, [searchQuery, searchResults, activeContinent]);

  // Group cities by continent
  const citiesByContinent = useMemo(() => {
    const grouped: Record<string, ExtendedCityData[]> = {};
    const citiesToGroup = searchQuery.length >= 2 ? searchResults : extendedWorldCities;
    
    CONTINENTS.forEach(continent => {
      const continentCities = citiesToGroup.filter(c => c.continent === continent);
      if (continentCities.length > 0) {
        grouped[continent] = continentCities.sort((a, b) => b.economics.gdpPerCapita - a.economics.gdpPerCapita);
      }
    });
    return grouped;
  }, [searchQuery, searchResults]);

  // Top cities for quick select
  const topCities = useMemo(() => {
    return [...extendedWorldCities]
      .sort((a, b) => b.economics.gdpPerCapita - a.economics.gdpPerCapita)
      .slice(0, 12);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current, {
      center: [30, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.current);

    // Handle map clicks for reverse geocoding
    map.current.on('click', async (e: L.LeafletMouseEvent) => {
      const city = await getCityByCoordinates(e.latlng.lat, e.latlng.lng);
      if (city) {
        onSelectCity(city);
      }
    });

    setMapReady(true);

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapReady(false);
    };
  }, [onSelectCity]);

  // Update markers when display cities or selection changes
  useEffect(() => {
    if (!map.current || !mapReady) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    displayCities.forEach(city => {
      const isSelected = selectedCity?.id === city.id;
      const color = CONTINENT_MARKER_COLORS[city.continent] || '#ffffff';
      
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: isSelected ? 12 : 6,
        fillColor: isSelected ? 'hsl(142, 76%, 36%)' : color,
        color: '#ffffff',
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        fillOpacity: isSelected ? 1 : 0.8,
      });

      marker.bindTooltip(`
        <div style="text-align: center; padding: 4px 8px;">
          <div style="font-size: 16px; margin-bottom: 2px;">${COUNTRY_FLAGS[city.countryCode] || '🏙️'}</div>
          <strong>${city.name}</strong><br/>
          <span style="opacity: 0.8; font-size: 11px;">${city.country}</span><br/>
          <span style="color: #22c55e; font-weight: bold;">PIB: $${(city.economics.gdpPerCapita / 1000).toFixed(0)}k</span>
        </div>
      `, {
        direction: 'top',
        offset: [0, -8],
        className: 'city-tooltip-leaflet'
      });

      marker.on('click', () => {
        onSelectCity(city);
      });

      marker.on('mouseover', () => {
        if (!isSelected) {
          marker.setRadius(10);
          marker.setStyle({ fillOpacity: 1 });
        }
        setHoveredCity(city);
      });

      marker.on('mouseout', () => {
        if (!isSelected) {
          marker.setRadius(6);
          marker.setStyle({ fillOpacity: 0.8 });
        }
        setHoveredCity(null);
      });

      marker.addTo(map.current!);
      markersRef.current.push(marker);
    });
  }, [displayCities, selectedCity, mapReady, onSelectCity]);

  // Fly to selected city
  useEffect(() => {
    if (!map.current || !selectedCity || !mapReady) return;
    
    map.current.flyTo([selectedCity.lat, selectedCity.lng], 6, {
      duration: 1.5,
    });
  }, [selectedCity, mapReady]);

  const clearFilters = () => {
    setActiveContinent(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const hasActiveFilters = activeContinent;

  return (
    <div className="space-y-4">
      {/* Custom CSS for Leaflet tooltips */}
      <style>{`
        .city-tooltip-leaflet {
          background: rgba(0, 0, 0, 0.95) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          border-radius: 8px !important;
          color: white !important;
          font-size: 12px !important;
          padding: 0 !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        }
        .city-tooltip-leaflet::before {
          border-top-color: rgba(0, 0, 0, 0.95) !important;
        }
        .leaflet-container {
          background: #1a1a2e !important;
          font-family: inherit;
        }
        .leaflet-control-zoom a {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          border-color: rgba(255, 255, 255, 0.2) !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(0, 0, 0, 0.95) !important;
        }
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.6) !important;
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      `}</style>

      {/* Search Bar with API */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher n'importe quelle ville dans le monde..."
            className="pl-10 pr-10 bg-card/50 border-border/50"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary animate-spin" />
          )}
          {!isSearching && searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "px-3 py-2 rounded-lg border transition-all flex items-center gap-2",
            showFilters || hasActiveFilters
              ? "bg-primary/20 border-primary text-primary"
              : "bg-card/50 border-border/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {searchQuery.length >= 2 && searchResults.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-2 rounded-xl bg-card/80 border border-border/50 max-h-[200px] overflow-y-auto">
              <p className="text-xs text-muted-foreground mb-2 px-2">
                {searchResults.length} ville(s) trouvée(s) • Cliquez pour sélectionner
              </p>
              <div className="space-y-1">
                {searchResults.map(city => (
                  <button
                    key={city.id}
                    onClick={() => {
                      onSelectCity(city);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="w-full p-2 rounded-lg text-left hover:bg-muted/50 transition-colors flex items-center gap-3"
                  >
                    <span className="text-lg">{COUNTRY_FLAGS[city.countryCode] || '🏙️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{city.name}</p>
                      <p className="text-xs text-muted-foreground">{city.country} • {city.continent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">${(city.economics.gdpPerCapita / 1000).toFixed(0)}k</p>
                      <p className="text-[10px] text-muted-foreground">PIB/hab</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-card/30 border border-border/50 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Continent</p>
                <div className="flex flex-wrap gap-2">
                  {CONTINENTS.map(continent => (
                    <button
                      key={continent}
                      onClick={() => setActiveContinent(activeContinent === continent ? null : continent)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        activeContinent === continent
                          ? CONTINENT_COLORS[continent]
                          : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50"
                      )}
                    >
                      {continent}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive World Map */}
      <div 
        ref={mapContainer}
        className="relative w-full h-[280px] rounded-xl border border-border/50 overflow-hidden"
      >
        {/* Tooltip for hovered city */}
        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-[1000] pointer-events-none top-4 left-4"
            >
              <div className="bg-popover/95 backdrop-blur border border-border rounded-lg px-3 py-2 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{COUNTRY_FLAGS[hoveredCity.countryCode] || '🏙️'}</span>
                  <div>
                    <p className="font-semibold text-sm">{hoveredCity.name}</p>
                    <p className="text-xs text-muted-foreground">{hoveredCity.country}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-primary">${(hoveredCity.economics.gdpPerCapita / 1000).toFixed(0)}k</p>
                    <p className="text-[10px] text-muted-foreground">PIB/hab</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click instruction */}
        <div className="absolute bottom-2 left-2 z-[1000] text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
          💡 Cliquez n'importe où pour trouver une ville
        </div>

        {/* Result count */}
        <div className="absolute bottom-2 right-2 z-[1000] text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
          {displayCities.length} ville{displayCities.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Selected City Details - Extended */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary overflow-hidden"
          >
            {/* Header */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{COUNTRY_FLAGS[selectedCity.countryCode] || '🏙️'}</span>
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      {selectedCity.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedCity.country} • {selectedCity.continent}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1 rounded hover:bg-muted/50 transition-colors"
                >
                  {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Key Stats */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-background/50">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    <DollarSign className="w-3 h-3" />
                    <p className="text-sm font-bold">${(selectedCity.economics.gdpPerCapita / 1000).toFixed(0)}k</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">PIB/hab</p>
                </div>
                <div className="p-2 rounded-lg bg-background/50">
                  <div className="flex items-center justify-center gap-1 text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    <p className="text-sm font-bold">{selectedCity.economics.gdpGrowth.toFixed(1)}%</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Croissance</p>
                </div>
                <div className="p-2 rounded-lg bg-background/50">
                  <div className="flex items-center justify-center gap-1 text-blue-400">
                    <Users className="w-3 h-3" />
                    <p className="text-sm font-bold">{(selectedCity.population / 1000000).toFixed(1)}M</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Population</p>
                </div>
                <div className="p-2 rounded-lg bg-background/50">
                  <div className="flex items-center justify-center gap-1 text-amber-400">
                    <Briefcase className="w-3 h-3" />
                    <p className="text-sm font-bold">{selectedCity.economics.unemploymentRate.toFixed(1)}%</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Chômage</p>
                </div>
              </div>
            </div>

            {/* Extended Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {/* Economics */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Économie
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Salaire moyen</p>
                          <p className="font-bold">${selectedCity.economics.averageSalary.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Coût de vie</p>
                          <p className="font-bold">{selectedCity.economics.costOfLivingIndex}%</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Inflation</p>
                          <p className="font-bold">{selectedCity.economics.inflationRate.toFixed(1)}%</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Impôt société</p>
                          <p className="font-bold">{selectedCity.economics.corporateTaxRate.toFixed(0)}%</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">TVA</p>
                          <p className="font-bold">{selectedCity.economics.vatRate.toFixed(1)}%</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Facilité business</p>
                          <p className="font-bold">#{selectedCity.economics.easeOfBusinessIndex}</p>
                        </div>
                      </div>
                    </div>

                    {/* Sectors */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> Secteurs dominants
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(selectedCity.sectors)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([sector, score]) => (
                            <Badge key={sector} variant="secondary" className="text-[10px]">
                              {sector}: {score}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Infrastructure */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        <Wifi className="w-3 h-3" /> Infrastructure
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Internet</p>
                          <p className="font-bold">{selectedCity.infrastructure.internetSpeedMbps} Mbps</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Aéroport</p>
                          <p className="font-bold">{selectedCity.infrastructure.airportConnectivity}/100</p>
                        </div>
                        <div className="p-2 rounded bg-background/30">
                          <p className="text-muted-foreground">Port</p>
                          <p className="font-bold">{selectedCity.infrastructure.portAccess ? '✓ Oui' : '✗ Non'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bonuses */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Bonus de jeu
                      </p>
                      <div className="grid grid-cols-5 gap-1 text-xs text-center">
                        <div className="p-1.5 rounded bg-background/30">
                          <p className={cn("font-bold", selectedCity.bonuses.productionMultiplier >= 1 ? "text-green-400" : "text-red-400")}>
                            x{selectedCity.bonuses.productionMultiplier.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">Prod.</p>
                        </div>
                        <div className="p-1.5 rounded bg-background/30">
                          <p className={cn("font-bold", selectedCity.bonuses.salesMultiplier >= 1 ? "text-green-400" : "text-red-400")}>
                            x{selectedCity.bonuses.salesMultiplier.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">Ventes</p>
                        </div>
                        <div className="p-1.5 rounded bg-background/30">
                          <p className={cn("font-bold", selectedCity.bonuses.rdMultiplier >= 1 ? "text-green-400" : "text-red-400")}>
                            x{selectedCity.bonuses.rdMultiplier.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">R&D</p>
                        </div>
                        <div className="p-1.5 rounded bg-background/30">
                          <p className={cn("font-bold", selectedCity.bonuses.recruitmentMultiplier >= 1 ? "text-green-400" : "text-red-400")}>
                            x{selectedCity.bonuses.recruitmentMultiplier.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">RH</p>
                        </div>
                        <div className="p-1.5 rounded bg-background/30">
                          <p className={cn("font-bold", selectedCity.bonuses.brandValueMultiplier >= 1 ? "text-green-400" : "text-red-400")}>
                            x{selectedCity.bonuses.brandValueMultiplier.toFixed(2)}
                          </p>
                          <p className="text-[9px] text-muted-foreground">Marque</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Cities Quick Select */}
      {!selectedCity && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">🌟 Top villes économiques mondiales</p>
          <div className="flex flex-wrap gap-2">
            {topCities.slice(0, 8).map(city => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/50 transition-all flex items-center gap-1.5"
              >
                <span>{COUNTRY_FLAGS[city.countryCode] || '🏙️'}</span>
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* City List by Continent */}
      <ScrollArea className="h-[200px] rounded-xl border border-border/50 bg-card/20">
        <div className="p-3 space-y-4">
          {Object.entries(citiesByContinent).map(([continent, cities]) => (
            <div key={continent}>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs font-semibold text-muted-foreground">{continent}</p>
                <span className="text-xs text-muted-foreground/50">({cities.length})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {cities.slice(0, 9).map(city => (
                  <button
                    key={city.id}
                    onClick={() => onSelectCity(city)}
                    className={cn(
                      "p-2 rounded-lg text-left text-xs transition-all border",
                      selectedCity?.id === city.id
                        ? "bg-primary/20 border-primary"
                        : "bg-muted/20 border-transparent hover:bg-muted/40 hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{COUNTRY_FLAGS[city.countryCode] || '🏙️'}</span>
                      <span className="font-medium truncate">{city.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      PIB: ${(city.economics.gdpPerCapita / 1000).toFixed(0)}k
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
