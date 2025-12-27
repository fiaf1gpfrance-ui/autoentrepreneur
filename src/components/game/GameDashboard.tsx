import { useEffect, useState, useCallback } from "react";
import { GameState, Company, TaxDeclaration, SECTOR_MODIFIERS } from "@/types/game";
import { 
  processDayTick, 
  formatCurrency, 
  formatPercent,
  calculateBFR,
  calculateTVADue,
  calculateTotalSalaryCosts,
  generateEmployee,
  saveGame,
  getCredibilityColor,
  getMoralColor,
} from "@/utils/gameEngine";
import { StatCard } from "./StatCard";
import { GaugeBar } from "./GaugeBar";
import { EventCard } from "./EventCard";
import { EmployeeCard } from "./EmployeeCard";
import { ProductCard } from "./ProductCard";
import { TaxDeclarationCard } from "./TaxDeclarationCard";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Package, 
  FileText,
  Play,
  Pause,
  FastForward,
  Calendar,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  Shield,
  Heart,
  RefreshCw,
  Plus,
  Save,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GameDashboardProps {
  initialState: GameState;
  onReset: () => void;
}

const weatherConfig = {
  croissance: { icon: Sun, label: "Croissance", color: "text-success" },
  stable: { icon: Cloud, label: "Stable", color: "text-muted-foreground" },
  recession: { icon: CloudRain, label: "Récession", color: "text-warning" },
  crise: { icon: CloudLightning, label: "Crise", color: "text-destructive" },
};

export function GameDashboard({ initialState, onReset }: GameDashboardProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [activeTab, setActiveTab] = useState<'overview' | 'rh' | 'products' | 'taxes'>('overview');

  const company = gameState.company!;
  const weather = weatherConfig[gameState.economicWeather];
  const WeatherIcon = weather.icon;

  // Game loop
  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) return;

    const interval = setInterval(() => {
      setGameState(prev => processDayTick(prev));
    }, 2000 / gameState.gameSpeed);

    return () => clearInterval(interval);
  }, [gameState.isPaused, gameState.gameSpeed, gameState.gameOver]);

  // Auto-save every minute
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(gameState);
    }, 60000);
    return () => clearInterval(interval);
  }, [gameState]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setGameState(prev => ({ ...prev, gameSpeed: speed }));
  }, []);

  const dismissEvent = useCallback((eventId: string) => {
    setGameState(prev => ({
      ...prev,
      activeEvents: prev.activeEvents.filter(e => e.id !== eventId),
    }));
  }, []);

  const hireEmployee = useCallback(() => {
    if (company.treasury < 5000) {
      toast.error("Trésorerie insuffisante pour recruter");
      return;
    }
    const newEmployee = generateEmployee(company.sector, gameState.day);
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        employees: [...prev.company!.employees, newEmployee],
        treasury: prev.company!.treasury - 2000, // Hiring cost
      },
    }));
    toast.success(`${newEmployee.name} a été recruté(e) !`);
  }, [company.treasury, company.sector, gameState.day]);

  const fireEmployee = useCallback((employeeId: string) => {
    const employee = company.employees.find(e => e.id === employeeId);
    if (!employee) return;

    const severancePay = employee.brutSalary * 2;
    if (company.treasury < severancePay) {
      toast.error("Trésorerie insuffisante pour les indemnités");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        employees: prev.company!.employees.filter(e => e.id !== employeeId),
        treasury: prev.company!.treasury - severancePay,
        credibility: Math.max(0, prev.company!.credibility - 3),
      },
    }));
    toast.info(`${employee.name} a été licencié(e). Indemnités: ${formatCurrency(severancePay)}`);
  }, [company.employees, company.treasury]);

  const updateProductPrice = useCallback((productId: string, newPrice: number) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        products: prev.company!.products.map(p =>
          p.id === productId ? { ...p, currentPrice: newPrice } : p
        ),
      },
    }));
  }, []);

  const updateProductMarketing = useCallback((productId: string, budget: number) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        products: prev.company!.products.map(p =>
          p.id === productId ? { ...p, marketingBudget: budget } : p
        ),
      },
    }));
  }, []);

  const payTax = useCallback((declaration: TaxDeclaration) => {
    const totalAmount = declaration.amount + (declaration.penalty || 0);
    if (company.treasury < totalAmount) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - totalAmount,
        taxDeclarations: prev.company!.taxDeclarations.map(d =>
          d === declaration ? { ...d, paid: true } : d
        ),
        credibility: Math.min(100, prev.company!.credibility + 2),
      },
    }));
    toast.success("Déclaration payée !");
  }, [company.treasury]);

  const addProduct = useCallback(() => {
    if (company.treasury < 10000) {
      toast.error("Trésorerie insuffisante pour lancer un nouveau produit");
      return;
    }

    const productNames = ["Innovation X", "Service Pro", "Solution Plus", "Offre Premium", "Pack Business"];
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: productNames[Math.floor(Math.random() * productNames.length)],
      phase: 'rd' as const,
      rdCost: 10000,
      rdProgress: 0,
      basePrice: 150,
      currentPrice: 150,
      quality: 40 + Math.floor(Math.random() * 30),
      marketingBudget: 0,
      salesVolume: 50 + Math.floor(Math.random() * 100),
      phaseStartDay: gameState.day,
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        products: [...prev.company!.products, newProduct],
        treasury: prev.company!.treasury - 10000,
      },
    }));
    toast.success(`Nouveau produit "${newProduct.name}" en développement !`);
  }, [company.treasury, gameState.day]);

  const handleSave = useCallback(() => {
    saveGame(gameState);
    toast.success("Partie sauvegardée !");
  }, [gameState]);

  // Calculations
  const bfr = calculateBFR(company);
  const tvaDue = calculateTVADue(company);
  const totalSalaryCost = calculateTotalSalaryCosts(company.employees);
  const avgMoral = company.employees.length > 0
    ? company.employees.reduce((sum, e) => sum + e.moral, 0) / company.employees.length
    : 0;

  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="game-panel max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="text-6xl">💀</div>
          <h1 className="text-3xl font-display font-bold text-destructive">
            Game Over
          </h1>
          <p className="text-muted-foreground">
            {gameState.gameOverReason}
          </p>
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Durée</span>
              <span className="font-medium">
                {gameState.year - 1} an(s), {gameState.month} mois
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trésorerie finale</span>
              <span className={cn(
                "font-medium",
                company.treasury >= 0 ? "text-success" : "text-destructive"
              )}>
                {formatCurrency(company.treasury)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Employés</span>
              <span className="font-medium">{company.employees.length}</span>
            </div>
          </div>
          <button onClick={onReset} className="w-full btn-game-primary">
            Nouvelle Partie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display font-bold text-lg">
                {company.name}
              </h1>
              <div className={cn("flex items-center gap-1.5 text-sm", weather.color)}>
                <WeatherIcon className="w-4 h-4" />
                <span>{weather.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground mr-4">
                <Calendar className="w-4 h-4" />
                <span>
                  Jour {gameState.day} - Mois {gameState.month} - An {gameState.year}
                </span>
              </div>

              <button
                onClick={() => setSpeed(1)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  gameState.gameSpeed === 1 ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSpeed(2)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  gameState.gameSpeed === 2 ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <FastForward className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSpeed(3)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  gameState.gameSpeed === 3 ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                )}
              >
                <FastForward className="w-4 h-4" />
                <FastForward className="w-4 h-4 -ml-2" />
              </button>
              <button
                onClick={togglePause}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  gameState.isPaused ? "bg-warning text-warning-foreground" : "bg-secondary hover:bg-secondary/80"
                )}
              >
                {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button onClick={handleSave} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80">
                <Save className="w-4 h-4" />
              </button>
              <button onClick={onReset} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-destructive">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Stats Row */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Trésorerie"
              value={formatCurrency(company.treasury)}
              icon={Wallet}
              colorClass={company.treasury >= 0 ? "text-success" : "text-destructive"}
              subValue={`BFR: ${formatCurrency(bfr)}`}
            />
            <StatCard
              label="CA Mensuel"
              value={formatCurrency(company.monthlyRevenue)}
              icon={TrendingUp}
              colorClass="text-success"
              subValue={`Dépenses: ${formatCurrency(company.monthlyExpenses)}`}
            />
            <StatCard
              label="Score CFS"
              value={`${Math.round(company.credibility)}/100`}
              icon={Shield}
              colorClass={getCredibilityColor(company.credibility)}
              subValue="Crédibilité Fiscale & Sociale"
            />
            <StatCard
              label="Moral Équipe"
              value={formatPercent(avgMoral)}
              icon={Heart}
              colorClass={getMoralColor(avgMoral)}
              subValue={`${company.employees.length} employé(s)`}
            />
          </div>

          {/* Gauges */}
          <div className="col-span-12 md:col-span-8">
            <div className="game-panel space-y-4">
              <h2 className="font-display font-semibold">Indicateurs Clés</h2>
              <div className="grid grid-cols-2 gap-6">
                <GaugeBar
                  value={company.credibility}
                  label="Crédibilité CFS"
                  colorClass={company.credibility >= 80 ? "bg-success" : company.credibility >= 50 ? "bg-warning" : "bg-destructive"}
                />
                <GaugeBar
                  value={avgMoral}
                  label="Moral Global"
                  colorClass={avgMoral >= 70 ? "bg-success" : avgMoral >= 40 ? "bg-warning" : "bg-destructive"}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border">
                <div>
                  <p className="data-label">Coût Salarial Total</p>
                  <p className="text-lg font-bold text-destructive">{formatCurrency(totalSalaryCost)}/mois</p>
                </div>
                <div>
                  <p className="data-label">TVA à Reverser</p>
                  <p className="text-lg font-bold text-warning">{formatCurrency(tvaDue)}</p>
                </div>
                <div>
                  <p className="data-label">Marge Sectorielle</p>
                  <p className="text-lg font-bold text-primary">
                    x{SECTOR_MODIFIERS[company.sector].marginMultiplier.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Events */}
          <div className="col-span-12 md:col-span-4">
            <div className="game-panel space-y-3">
              <h2 className="font-display font-semibold">Événements</h2>
              {gameState.activeEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun événement en cours
                </p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {gameState.activeEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onDismiss={dismissEvent}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="col-span-12">
            <div className="flex gap-2 border-b border-border pb-2 mb-4">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
                { id: 'rh', label: 'Ressources Humaines', icon: Users },
                { id: 'products', label: 'Produits', icon: Package },
                { id: 'taxes', label: 'Fiscalité', icon: FileText },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.employees.slice(0, 3).map(employee => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
                {company.products.slice(0, 3).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {activeTab === 'rh' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold">
                    Équipe ({company.employees.length} employé{company.employees.length > 1 ? 's' : ''})
                  </h3>
                  <button onClick={hireEmployee} className="btn-game-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Recruter (2 000€)
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.employees.map(employee => (
                    <EmployeeCard 
                      key={employee.id} 
                      employee={employee} 
                      onFire={fireEmployee}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold">
                    Catalogue ({company.products.length} produit{company.products.length > 1 ? 's' : ''})
                  </h3>
                  <button onClick={addProduct} className="btn-game-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Nouveau produit (10 000€)
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.products.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      onUpdatePrice={updateProductPrice}
                      onUpdateMarketing={updateProductMarketing}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'taxes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold">
                    Déclarations Fiscales
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    TVA collectée: {formatCurrency(company.tvaCollected)} | 
                    TVA déductible: {formatCurrency(company.tvaDeductible)}
                  </div>
                </div>
                {company.taxDeclarations.filter(d => !d.paid).length === 0 ? (
                  <div className="game-panel text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Aucune déclaration en attente
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Les déclarations TVA sont générées tous les 3 mois
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {company.taxDeclarations.filter(d => !d.paid).map((declaration, i) => (
                      <TaxDeclarationCard
                        key={i}
                        declaration={declaration}
                        currentDay={gameState.day + (gameState.month - 1) * 30}
                        onPay={payTax}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
