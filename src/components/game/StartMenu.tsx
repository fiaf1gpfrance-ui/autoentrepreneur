import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  LucideIcon, 
  Search, 
  User, 
  Settings, 
  Power, 
  Moon,
  Pin,
  ChevronRight,
  Sparkles,
  Clock,
  Star,
  TrendingUp,
  ShoppingCart,
  Trophy,
  PieChart,
  Swords,
  Eye,
  Megaphone,
  Cpu,
  AlertTriangle,
  Landmark,
  Wallet,
  Building,
  Truck,
  Package,
  Users,
  GraduationCap,
  Handshake,
  Globe,
  Map,
  Scale,
  FileText,
  BarChart3,
  Zap,
  Home,
  Grid3X3,
  X,
} from "lucide-react";
import { formatCurrency } from "@/utils/gameEngine";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color?: string;
  description?: string;
}

interface AppCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  apps: AppItem[];
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAppClick: (id: string) => void;
  companyName: string;
  treasury: number;
  day: number;
  recentApps: string[];
  pinnedApps: string[];
  onPinApp: (id: string) => void;
  onUnpinApp: (id: string) => void;
  onReset: () => void;
  onSave: () => void;
}

const allApps: AppItem[] = [
  { id: 'overview', label: 'Aperçu', icon: TrendingUp, color: "text-primary", description: "Vue d'ensemble de votre entreprise" },
  { id: 'shop', label: 'Boutique', icon: ShoppingCart, color: "text-amber-400", description: "Acheter des bonus et améliorations" },
  { id: 'progression', label: 'Progression', icon: Star, color: "text-yellow-400", description: "Suivre votre progression" },
  { id: 'achievements', label: 'Trophées', icon: Trophy, color: "text-amber-500", description: "Vos accomplissements" },
  { id: 'investors', label: 'Investisseurs', icon: PieChart, color: "text-green-400", description: "Gérer les investisseurs" },
  { id: 'competition', label: 'Concurrence', icon: Swords, color: "text-red-400", description: "Analyser la concurrence" },
  { id: 'richevents', label: 'Événements', icon: Eye, color: "text-purple-400", description: "Événements en cours" },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, color: "text-pink-400", description: "Campagnes publicitaires" },
  { id: 'technology', label: 'R&D', icon: Cpu, color: "text-cyan-400", description: "Recherche et développement" },
  { id: 'crises', label: 'Crises', icon: AlertTriangle, color: "text-orange-500", description: "Gestion des crises" },
  { id: 'banking', label: 'Banque', icon: Landmark, color: "text-emerald-400", description: "Services bancaires" },
  { id: 'ultrafinance', label: 'Finance+', icon: Wallet, color: "text-teal-400", description: "Finance avancée" },
  { id: 'realestate', label: 'Immobilier', icon: Building, color: "text-blue-400", description: "Gestion immobilière" },
  { id: 'supply', label: 'Supply Chain', icon: Truck, color: "text-indigo-400", description: "Chaîne d'approvisionnement" },
  { id: 'advancedproduction', label: 'Production', icon: Package, color: "text-violet-400", description: "Lignes de production" },
  { id: 'rh', label: 'RH', icon: Users, color: "text-rose-400", description: "Ressources humaines" },
  { id: 'hradvanced', label: 'RH Avancé', icon: GraduationCap, color: "text-fuchsia-400", description: "Formation et avantages" },
  { id: 'products', label: 'Produits', icon: Package, color: "text-lime-400", description: "Catalogue produits" },
  { id: 'advancedcommercial', label: 'Commercial', icon: ShoppingCart, color: "text-sky-400", description: "Gestion commerciale" },
  { id: 'salespipeline', label: 'Pipeline', icon: Handshake, color: "text-cyan-500", description: "Pipeline de ventes" },
  { id: 'international', label: 'International', icon: Globe, color: "text-blue-500", description: "Expansion internationale" },
  { id: 'advancedinternational', label: 'Mondial', icon: Map, color: "text-indigo-500", description: "Marchés mondiaux" },
  { id: 'legal', label: 'Juridique', icon: Scale, color: "text-slate-400", description: "Affaires juridiques" },
  { id: 'taxes', label: 'Fiscalité', icon: FileText, color: "text-gray-400", description: "Déclarations fiscales" },
  { id: 'gameplay', label: 'Stats', icon: BarChart3, color: "text-zinc-400", description: "Statistiques de jeu" },
];

const appCategories: AppCategory[] = [
  {
    id: 'game',
    label: 'Jeu & Progression',
    icon: Sparkles,
    apps: allApps.filter(a => ['overview', 'shop', 'progression', 'achievements', 'richevents'].includes(a.id)),
  },
  {
    id: 'finance',
    label: 'Finance & Banque',
    icon: Landmark,
    apps: allApps.filter(a => ['banking', 'ultrafinance', 'taxes', 'investors'].includes(a.id)),
  },
  {
    id: 'operations',
    label: 'Opérations',
    icon: Package,
    apps: allApps.filter(a => ['supply', 'advancedproduction', 'realestate', 'products'].includes(a.id)),
  },
  {
    id: 'hr',
    label: 'Ressources Humaines',
    icon: Users,
    apps: allApps.filter(a => ['rh', 'hradvanced'].includes(a.id)),
  },
  {
    id: 'commercial',
    label: 'Commercial & Ventes',
    icon: Handshake,
    apps: allApps.filter(a => ['marketing', 'advancedcommercial', 'salespipeline', 'competition'].includes(a.id)),
  },
  {
    id: 'expansion',
    label: 'Expansion',
    icon: Globe,
    apps: allApps.filter(a => ['international', 'advancedinternational'].includes(a.id)),
  },
  {
    id: 'strategy',
    label: 'Stratégie & Innovation',
    icon: Cpu,
    apps: allApps.filter(a => ['technology', 'crises', 'legal', 'gameplay'].includes(a.id)),
  },
];

export function StartMenu({
  isOpen,
  onClose,
  onAppClick,
  companyName,
  treasury,
  day,
  recentApps,
  pinnedApps,
  onPinApp,
  onUnpinApp,
  onReset,
  onSave,
}: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'pinned' | 'all' | 'recent'>('pinned');

  const filteredApps = useMemo(() => {
    if (!searchQuery) return allApps;
    const query = searchQuery.toLowerCase();
    return allApps.filter(
      app => 
        app.label.toLowerCase().includes(query) || 
        app.description?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const pinnedAppsList = useMemo(() => {
    return allApps.filter(app => pinnedApps.includes(app.id));
  }, [pinnedApps]);

  const recentAppsList = useMemo(() => {
    return recentApps
      .slice(0, 6)
      .map(id => allApps.find(app => app.id === id))
      .filter(Boolean) as AppItem[];
  }, [recentApps]);

  const handleAppClick = (id: string) => {
    onAppClick(id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div 
        className="fixed bottom-14 left-2 z-50 w-[600px] max-w-[calc(100vw-1rem)] animate-window-open"
        onClick={e => e.stopPropagation()}
      >
        <div className="glass-effect rounded-xl border border-white/20 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher des applications..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                autoFocus
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
          </div>

          {/* Main Content */}
          <div className="flex h-[480px]">
            {/* Left Panel - Apps */}
            <div className="flex-1 flex flex-col">
              {/* Section Tabs */}
              <div className="flex border-b border-white/10 px-4">
                <button
                  onClick={() => setActiveSection('pinned')}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-all relative",
                    activeSection === 'pinned' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Pin className="w-3.5 h-3.5 inline-block mr-1.5" />
                  Épinglés
                  {activeSection === 'pinned' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveSection('all')}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-all relative",
                    activeSection === 'all' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Grid3X3 className="w-3.5 h-3.5 inline-block mr-1.5" />
                  Toutes
                  {activeSection === 'all' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
                <button
                  onClick={() => setActiveSection('recent')}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium transition-all relative",
                    activeSection === 'recent' ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Clock className="w-3.5 h-3.5 inline-block mr-1.5" />
                  Récents
                  {activeSection === 'recent' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              </div>

              {/* Apps Content */}
              <ScrollArea className="flex-1 p-4">
                {searchQuery ? (
                  // Search Results
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground mb-3">
                      {filteredApps.length} résultat{filteredApps.length > 1 ? 's' : ''}
                    </p>
                    {filteredApps.map(app => (
                      <AppButton 
                        key={app.id} 
                        app={app} 
                        onClick={() => handleAppClick(app.id)}
                        isPinned={pinnedApps.includes(app.id)}
                        onPin={() => pinnedApps.includes(app.id) ? onUnpinApp(app.id) : onPinApp(app.id)}
                        showDescription
                      />
                    ))}
                    {filteredApps.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Aucune application trouvée
                      </p>
                    )}
                  </div>
                ) : activeSection === 'pinned' ? (
                  // Pinned Apps
                  <div>
                    {pinnedAppsList.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {pinnedAppsList.map(app => (
                          <AppTile 
                            key={app.id} 
                            app={app} 
                            onClick={() => handleAppClick(app.id)}
                            onUnpin={() => onUnpinApp(app.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Pin className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm">
                          Aucune application épinglée
                        </p>
                        <p className="text-muted-foreground/60 text-xs mt-1">
                          Cliquez droit sur une app pour l'épingler
                        </p>
                      </div>
                    )}
                  </div>
                ) : activeSection === 'recent' ? (
                  // Recent Apps
                  <div>
                    {recentAppsList.length > 0 ? (
                      <div className="space-y-1">
                        {recentAppsList.map(app => (
                          <AppButton 
                            key={app.id} 
                            app={app} 
                            onClick={() => handleAppClick(app.id)}
                            isPinned={pinnedApps.includes(app.id)}
                            onPin={() => pinnedApps.includes(app.id) ? onUnpinApp(app.id) : onPinApp(app.id)}
                            showDescription
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm">
                          Aucune application récente
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // All Apps by Category
                  <div className="space-y-2">
                    {appCategories.map(category => (
                      <div key={category.id}>
                        <button
                          onClick={() => setExpandedCategory(
                            expandedCategory === category.id ? null : category.id
                          )}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <category.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="flex-1 text-left font-medium text-sm">
                            {category.label}
                          </span>
                          <span className="text-xs text-muted-foreground mr-2">
                            {category.apps.length}
                          </span>
                          <ChevronRight className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            expandedCategory === category.id && "rotate-90"
                          )} />
                        </button>
                        
                        {expandedCategory === category.id && (
                          <div className="ml-4 pl-4 border-l border-white/10 mt-1 mb-2 space-y-0.5 animate-fade-in">
                            {category.apps.map(app => (
                              <AppButton 
                                key={app.id} 
                                app={app} 
                                onClick={() => handleAppClick(app.id)}
                                isPinned={pinnedApps.includes(app.id)}
                                onPin={() => pinnedApps.includes(app.id) ? onUnpinApp(app.id) : onPinApp(app.id)}
                                compact
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Right Panel - Quick Info */}
            <div className="w-48 border-l border-white/10 p-4 flex flex-col">
              {/* User Profile */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{companyName}</p>
                  <p className="text-xs text-muted-foreground">Jour {day}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 flex-1">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-muted-foreground mb-1">Trésorerie</p>
                  <p className={cn(
                    "font-bold text-sm",
                    treasury >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {formatCurrency(treasury)}
                  </p>
                </div>
                
                {/* Quick Actions */}
                <div className="space-y-1">
                  <button
                    onClick={() => handleAppClick('overview')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    <Home className="w-4 h-4 text-primary" />
                    Accueil
                  </button>
                  <button
                    onClick={() => handleAppClick('shop')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 text-amber-400" />
                    Boutique
                  </button>
                  <button
                    onClick={() => handleAppClick('achievements')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                  >
                    <Trophy className="w-4 h-4 text-amber-500" />
                    Trophées
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 space-y-1">
                <button 
                  onClick={() => { onSave(); onClose(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Sauvegarder
                </button>
                <button 
                  onClick={() => { onReset(); onClose(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-destructive/20 transition-colors text-sm text-destructive"
                >
                  <Power className="w-4 h-4" />
                  Quitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// App Tile Component (for pinned apps grid)
function AppTile({ 
  app, 
  onClick, 
  onUnpin 
}: { 
  app: AppItem; 
  onClick: () => void;
  onUnpin: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
        className="w-full aspect-square flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group-hover:scale-105"
      >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", app.color?.replace('text-', 'bg-').replace('400', '500/20').replace('500', '500/20'))}>
          <app.icon className={cn("w-6 h-6", app.color)} />
        </div>
        <span className="text-xs font-medium text-center line-clamp-1">{app.label}</span>
      </button>
      
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 bg-background/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl p-1 min-w-[120px] animate-scale-in">
            <button
              onClick={() => { onUnpin(); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 rounded transition-colors"
            >
              <Pin className="w-3 h-3" />
              Désépingler
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// App Button Component (for lists)
function AppButton({ 
  app, 
  onClick, 
  isPinned,
  onPin,
  showDescription,
  compact,
}: { 
  app: AppItem; 
  onClick: () => void;
  isPinned?: boolean;
  onPin?: () => void;
  showDescription?: boolean;
  compact?: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        onContextMenu={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
        className={cn(
          "w-full flex items-center gap-3 rounded-lg hover:bg-white/10 transition-all text-left",
          compact ? "px-2 py-1.5" : "px-3 py-2"
        )}
      >
        <div className={cn(
          "rounded-lg flex items-center justify-center flex-shrink-0",
          compact ? "w-6 h-6" : "w-8 h-8",
          app.color?.replace('text-', 'bg-').replace('400', '500/20').replace('500', '500/20')
        )}>
          <app.icon className={cn(app.color, compact ? "w-3.5 h-3.5" : "w-4 h-4")} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium truncate", compact ? "text-xs" : "text-sm")}>{app.label}</p>
          {showDescription && app.description && (
            <p className="text-xs text-muted-foreground truncate">{app.description}</p>
          )}
        </div>
        {isPinned && (
          <Pin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      
      {showMenu && onPin && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 bg-background/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl p-1 min-w-[140px] animate-scale-in">
            <button
              onClick={() => { onPin(); setShowMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/10 rounded transition-colors"
            >
              <Pin className="w-3 h-3" />
              {isPinned ? "Désépingler" : "Épingler au démarrage"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
