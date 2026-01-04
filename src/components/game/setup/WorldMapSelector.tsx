import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, MapPin, Building2, TrendingUp, Globe, Zap, 
  Factory, Ship, Landmark, X, Filter, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  WorldCity, 
  WORLD_CITIES, 
  CONTINENTS, 
  COUNTRY_FLAGS,
  getTopCitiesByEconomicIndex 
} from "@/data/worldCities";
import Fuse from "fuse.js";

interface WorldMapSelectorProps {
  selectedCity: WorldCity | null;
  onSelectCity: (city: WorldCity) => void;
}

const CONTINENT_COLORS: Record<string, string> = {
  "Europe": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "North America": "bg-green-500/20 text-green-400 border-green-500/30",
  "South America": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Asia": "bg-red-500/20 text-red-400 border-red-500/30",
  "Oceania": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Africa": "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const CONTINENT_MARKER_COLORS: Record<string, string> = {
  "Europe": "#3b82f6",
  "North America": "#22c55e",
  "South America": "#f59e0b",
  "Asia": "#ef4444",
  "Oceania": "#06b6d4",
  "Africa": "#f97316",
};

export function WorldMapSelector({ selectedCity, onSelectCity }: WorldMapSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContinent, setActiveContinent] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    techHub: false,
    financialCenter: false,
    industrialHub: false,
    portCity: false,
    capital: false,
  });
  const [hoveredCity, setHoveredCity] = useState<WorldCity | null>(null);
  
  // Leaflet state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(WORLD_CITIES, {
    keys: ['name', 'country', 'countryCode'],
    threshold: 0.3,
    includeScore: true,
  }), []);

  // Filter cities based on search and filters
  const filteredCities = useMemo(() => {
    let cities = WORLD_CITIES;

    if (searchQuery.trim()) {
      const results = fuse.search(searchQuery);
      cities = results.map(r => r.item);
    }

    if (activeContinent) {
      cities = cities.filter(c => c.continent === activeContinent);
    }

    const activeFilters = Object.entries(filters).filter(([_, active]) => active);
    if (activeFilters.length > 0) {
      cities = cities.filter(city => 
        activeFilters.every(([key]) => city[key as keyof WorldCity])
      );
    }

    return cities;
  }, [searchQuery, activeContinent, filters, fuse]);

  // Group cities by continent
  const citiesByContinent = useMemo(() => {
    const grouped: Record<string, WorldCity[]> = {};
    CONTINENTS.forEach(continent => {
      const continentCities = filteredCities.filter(c => c.continent === continent);
      if (continentCities.length > 0) {
        grouped[continent] = continentCities.sort((a, b) => b.economicIndex - a.economicIndex);
      }
    });
    return grouped;
  }, [filteredCities]);

  const topCities = useMemo(() => getTopCitiesByEconomicIndex(12), []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Create map with dark theme
    map.current = L.map(mapContainer.current, {
      center: [30, 10],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
      zoomControl: true,
    });

    // Add dark tile layer from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.current);

    setMapReady(true);

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapReady(false);
    };
  }, []);

  // Update markers when filtered cities or selection changes
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered cities
    filteredCities.forEach(city => {
      const isSelected = selectedCity?.id === city.id;
      const color = CONTINENT_MARKER_COLORS[city.continent] || '#ffffff';
      
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: isSelected ? 12 : 6,
        fillColor: isSelected ? 'hsl(142, 76%, 36%)' : color,
        color: '#ffffff',
        weight: isSelected ? 3 : 1.5,
        opacity: 1,
        fillOpacity: isSelected ? 1 : 0.8,
        className: 'city-marker-circle'
      });

      // Tooltip
      marker.bindTooltip(`
        <div style="text-align: center; padding: 4px 8px;">
          <div style="font-size: 16px; margin-bottom: 2px;">${COUNTRY_FLAGS[city.countryCode] || '🏙️'}</div>
          <strong>${city.name}</strong><br/>
          <span style="opacity: 0.8; font-size: 11px;">${city.country}</span><br/>
          <span style="color: #22c55e; font-weight: bold;">Éco: ${city.economicIndex}</span>
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
  }, [filteredCities, selectedCity, mapReady, onSelectCity]);

  // Fly to selected city
  useEffect(() => {
    if (!map.current || !selectedCity || !mapReady) return;
    
    map.current.flyTo([selectedCity.lat, selectedCity.lng], 6, {
      duration: 1.5,
    });
  }, [selectedCity, mapReady]);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const clearFilters = () => {
    setFilters({
      techHub: false,
      financialCenter: false,
      industrialHub: false,
      portCity: false,
      capital: false,
    });
    setActiveContinent(null);
    setSearchQuery("");
  };

  const hasActiveFilters = Object.values(filters).some(Boolean) || activeContinent;

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

      {/* Search and Filters Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une ville, pays..."
            className="pl-10 bg-card/50 border-border/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
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
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      </div>

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
              {/* Continent filter */}
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

              {/* Feature filters */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Caractéristiques</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'techHub' as const, label: 'Hub Tech', icon: Zap },
                    { key: 'financialCenter' as const, label: 'Centre Financier', icon: TrendingUp },
                    { key: 'industrialHub' as const, label: 'Hub Industriel', icon: Factory },
                    { key: 'portCity' as const, label: 'Port Maritime', icon: Ship },
                    { key: 'capital' as const, label: 'Capitale', icon: Landmark },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => toggleFilter(key)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
                        filters[key]
                          ? "bg-primary/20 text-primary border-primary/50"
                          : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/50"
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
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
                  <span className="text-lg">{COUNTRY_FLAGS[hoveredCity.countryCode]}</span>
                  <div>
                    <p className="font-semibold text-sm">{hoveredCity.name}</p>
                    <p className="text-xs text-muted-foreground">{hoveredCity.country}</p>
                  </div>
                  <div className="text-right ml-2">
                    <p className="text-sm font-bold text-primary">{hoveredCity.economicIndex}</p>
                    <p className="text-[10px] text-muted-foreground">Éco.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result count */}
        <div className="absolute bottom-2 right-2 z-[1000] text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
          {filteredCities.length} ville{filteredCities.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Selected City Details */}
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 border-2 border-primary"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{COUNTRY_FLAGS[selectedCity.countryCode]}</span>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    {selectedCity.name}
                    {selectedCity.capital && (
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">{selectedCity.country} • {selectedCity.continent}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{selectedCity.economicIndex}</div>
                <p className="text-xs text-muted-foreground">Indice éco.</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedCity.techHub && (
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-400">
                  <Zap className="w-3 h-3 mr-1" /> Hub Tech
                </Badge>
              )}
              {selectedCity.financialCenter && (
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" /> Centre Financier
                </Badge>
              )}
              {selectedCity.industrialHub && (
                <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-400">
                  <Factory className="w-3 h-3 mr-1" /> Hub Industriel
                </Badge>
              )}
              {selectedCity.portCity && (
                <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                  <Ship className="w-3 h-3 mr-1" /> Port Maritime
                </Badge>
              )}
              {selectedCity.capital && (
                <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
                  <Landmark className="w-3 h-3 mr-1" /> Capitale
                </Badge>
              )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-background/50">
                <p className="text-lg font-bold">{selectedCity.population.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Population</p>
              </div>
              <div className="p-2 rounded-lg bg-background/50">
                <p className="text-lg font-bold">{Math.round(selectedCity.costOfLiving * 100)}%</p>
                <p className="text-[10px] text-muted-foreground">Coût de vie</p>
              </div>
              <div className="p-2 rounded-lg bg-background/50">
                <p className="text-lg font-bold">{selectedCity.economicIndex}</p>
                <p className="text-[10px] text-muted-foreground">Indice éco.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Cities Quick Select */}
      {!selectedCity && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Top villes économiques</p>
          <div className="flex flex-wrap gap-2">
            {topCities.slice(0, 8).map(city => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/50 transition-all flex items-center gap-1.5"
              >
                <span>{COUNTRY_FLAGS[city.countryCode]}</span>
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
                      <span>{COUNTRY_FLAGS[city.countryCode]}</span>
                      <span className="font-medium truncate">{city.name}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Éco: {city.economicIndex}
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
