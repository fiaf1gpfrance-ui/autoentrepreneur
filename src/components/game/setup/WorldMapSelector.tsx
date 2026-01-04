import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { 
  Search, MapPin, Building2, TrendingUp, Globe, Zap, 
  Factory, Ship, Landmark, X, Filter, Star, Key, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Mapbox token from localStorage or empty
const getStoredToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('mapbox_token') || '';
  }
  return '';
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
  
  // Mapbox state
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState(getStoredToken());
  const [showTokenInput, setShowTokenInput] = useState(!getStoredToken());
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

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [10, 30],
        zoom: 1.5,
        projection: 'globe',
        attributionControl: false,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(20, 20, 30)',
          'high-color': 'rgb(40, 40, 60)',
          'horizon-blend': 0.1,
          'star-intensity': 0.15,
        });
        setMapReady(true);
      });

      // Save token to localStorage
      localStorage.setItem('mapbox_token', mapboxToken);

    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
      setMapReady(false);
    };
  }, [mapboxToken]);

  // Update markers when filtered cities or selection changes
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for filtered cities
    filteredCities.forEach(city => {
      const isSelected = selectedCity?.id === city.id;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'city-marker';
      el.style.cssText = `
        width: ${isSelected ? '24px' : '14px'};
        height: ${isSelected ? '24px' : '14px'};
        background: ${isSelected ? 'hsl(var(--primary))' : 'rgba(255, 255, 255, 0.7)'};
        border: 2px solid ${isSelected ? 'white' : 'rgba(255, 255, 255, 0.3)'};
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: ${isSelected ? '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.5)' : '0 2px 8px rgba(0,0,0,0.3)'};
      `;
      
      el.addEventListener('mouseenter', () => {
        if (!isSelected) {
          el.style.transform = 'scale(1.5)';
          el.style.background = 'hsl(var(--primary))';
        }
        setHoveredCity(city);
      });
      
      el.addEventListener('mouseleave', () => {
        if (!isSelected) {
          el.style.transform = 'scale(1)';
          el.style.background = 'rgba(255, 255, 255, 0.7)';
        }
        setHoveredCity(null);
      });
      
      el.addEventListener('click', () => {
        onSelectCity(city);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([city.lng, city.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [filteredCities, selectedCity, mapReady, onSelectCity]);

  // Fly to selected city
  useEffect(() => {
    if (!map.current || !selectedCity || !mapReady) return;
    
    map.current.flyTo({
      center: [selectedCity.lng, selectedCity.lat],
      zoom: 5,
      duration: 1500,
      essential: true,
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

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      setShowTokenInput(false);
      // Force re-render to initialize map
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4">
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

      {/* Mapbox Token Input */}
      {showTokenInput && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
        >
          <div className="flex items-start gap-3">
            <Key className="w-5 h-5 text-amber-500 mt-0.5" />
            <div className="flex-1 space-y-3">
              <div>
                <h4 className="font-semibold text-amber-200">Token Mapbox requis</h4>
                <p className="text-xs text-amber-300/80 mt-1">
                  Pour afficher la carte mondiale interactive, entrez votre token Mapbox public.
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="pk.eyJ1IjoieW91..."
                  className="bg-card/50 border-amber-500/30 text-sm"
                />
                <Button 
                  onClick={handleTokenSubmit}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-black"
                >
                  Activer
                </Button>
              </div>
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Obtenir un token gratuit sur Mapbox
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interactive World Map */}
      <div 
        ref={mapContainer}
        className="relative w-full h-[280px] rounded-xl border border-border/50 overflow-hidden bg-slate-900"
      >
        {!mapboxToken && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
            <div className="text-center">
              <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">Entrez votre token Mapbox pour afficher la carte</p>
            </div>
          </div>
        )}

        {/* Tooltip for hovered city */}
        <AnimatePresence>
          {hoveredCity && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-30 pointer-events-none top-4 left-4"
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
        <div className="absolute bottom-2 right-2 text-xs text-white/50 bg-black/50 px-2 py-1 rounded">
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
                  <Zap className="w-3 h-3 mr-1" /> Tech Hub
                </Badge>
              )}
              {selectedCity.financialCenter && (
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" /> Finance
                </Badge>
              )}
              {selectedCity.industrialHub && (
                <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-400">
                  <Factory className="w-3 h-3 mr-1" /> Industrie
                </Badge>
              )}
              {selectedCity.portCity && (
                <Badge variant="secondary" className="text-xs bg-cyan-500/20 text-cyan-400">
                  <Ship className="w-3 h-3 mr-1" /> Port
                </Badge>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-card/50">
                <p className="text-muted-foreground">Coût de la vie</p>
                <p className="font-semibold">
                  {selectedCity.costOfLiving < 0.8 ? '💚 Très bas' :
                   selectedCity.costOfLiving < 1.0 ? '🟢 Bas' :
                   selectedCity.costOfLiving < 1.2 ? '🟡 Moyen' :
                   selectedCity.costOfLiving < 1.5 ? '🟠 Élevé' : '🔴 Très élevé'}
                  {' '}(×{selectedCity.costOfLiving.toFixed(2)})
                </p>
              </div>
              <div className="p-2 rounded-lg bg-card/50">
                <p className="text-muted-foreground">Population</p>
                <p className="font-semibold">{(selectedCity.population / 1000000).toFixed(1)}M hab.</p>
              </div>
            </div>

            {Object.keys(selectedCity.bonus).length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-1.5">Bonus de localisation</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(selectedCity.bonus).map(([key, value]) => (
                    <span 
                      key={key}
                      className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        value! > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {value! > 0 ? '+' : ''}{value}% {
                        key === 'revenue' ? 'Revenus' :
                        key === 'costs' ? 'Coûts' :
                        key === 'tech' ? 'Tech' :
                        key === 'international' ? 'International' :
                        key === 'industry' ? 'Industrie' :
                        key === 'finance' ? 'Finance' :
                        key === 'logistics' ? 'Logistique' :
                        key === 'reputation' ? 'Réputation' : key
                      }
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Select - Top Cities */}
      {!selectedCity && !searchQuery && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Star className="w-3 h-3" /> Métropoles mondiales
          </p>
          <div className="flex flex-wrap gap-1.5">
            {topCities.slice(0, 8).map(city => (
              <button
                key={city.id}
                onClick={() => onSelectCity(city)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-card/50 border border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all text-xs"
              >
                <span>{COUNTRY_FLAGS[city.countryCode]}</span>
                <span className="font-medium">{city.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cities List by Continent */}
      <ScrollArea className="h-[180px]">
        <div className="space-y-4 pr-4">
          {Object.entries(citiesByContinent).map(([continent, cities]) => (
            <div key={continent}>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">{continent}</h4>
                <span className="text-xs text-muted-foreground">({cities.length})</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {cities.slice(0, 8).map(city => (
                  <button
                    key={city.id}
                    onClick={() => onSelectCity(city)}
                    className={cn(
                      "flex items-center gap-2 p-2 rounded-lg border text-left transition-all",
                      selectedCity?.id === city.id
                        ? "bg-primary/20 border-primary"
                        : "bg-card/30 border-border/50 hover:bg-card/60 hover:border-border"
                    )}
                  >
                    <span className="text-lg">{COUNTRY_FLAGS[city.countryCode]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{city.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{city.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-primary">{city.economicIndex}</p>
                    </div>
                  </button>
                ))}
              </div>
              {cities.length > 8 && (
                <p className="text-xs text-muted-foreground mt-1 ml-6">
                  +{cities.length - 8} autres villes
                </p>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
