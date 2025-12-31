import { useEffect, useState, useCallback } from "react";
import { 
  GameState, 
  Company, 
  TaxDeclaration, 
  SECTOR_MODIFIERS,
  LoanType,
  InvestmentType,
  Property,
  Supplier,
  Training,
  BenefitType,
  IntellectualProperty,
  Lawyer,
  ForeignMarket,
  Subsidiary,
  COUNTRIES,
  LEGAL_STATUS_MODIFIERS,
} from "@/types/game";
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
import { 
  createLoan, 
  createInvestment, 
  liquidateInvestment, 
  applyForOverdraft,
  getAvailableBanks,
} from "@/utils/bankingEngine";
import { createProduct } from "@/utils/productFactory";
import { StatCard } from "./StatCard";
import { GaugeBar } from "./GaugeBar";
import { EventCard } from "./EventCard";
import { EmployeeCard } from "./EmployeeCard";
import { ProductCard } from "./ProductCard";
import { TaxDeclarationCard } from "./TaxDeclarationCard";
import { BankingPanel } from "./BankingPanel";
import { RealEstatePanel } from "./RealEstatePanel";
import { SupplyChainPanel } from "./SupplyChainPanel";
import { HRAdvancedPanel } from "./HRAdvancedPanel";
import { LegalPanel } from "./LegalPanel";
import { GameplayPanel } from "./GameplayPanel";
import { InternationalPanel } from "./InternationalPanel";
import { AchievementsPanel } from "./AchievementsPanel";
import { MarketingPanel } from "./MarketingPanel";
import { TechnologyPanel } from "./TechnologyPanel";
import { CrisesPanel } from "./CrisesPanel";
import { ShopPanel } from "./ShopPanel";
import { ProgressionPanel } from "./ProgressionPanel";
import { AdvancedInternationalPanel } from "./AdvancedInternationalPanel";
import { UltraFinancePanel } from "./UltraFinancePanel";
import { AdvancedProductionPanel } from "./AdvancedProductionPanel";
import { AdvancedCommercialPanel } from "./AdvancedCommercialPanel";
import { SalesPipelinePanel } from "./SalesPipelinePanel";
import { SaveLoadPanel } from "./SaveLoadPanel";
import { Taskbar } from "./Taskbar";
import { AppWindow } from "./AppWindow";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopOverview } from "./DesktopOverview";
import { StartMenu } from "./StartMenu";
import { NotificationCenter, GameNotification } from "./NotificationCenter";
import { DesktopWidget } from "./DesktopWidget";
import { ClockWidget } from "./ClockWidget";
import { EconomicWeatherWidget } from "./EconomicWeatherWidget";
import { FinanceChartWidget } from "./FinanceChartWidget";
import { QuickStatsWidget } from "./QuickStatsWidget";
import { EventCalendarWidget } from "./EventCalendarWidget";
import { TaskListWidget } from "./TaskListWidget";
import { TaxAlertWidget } from "./TaxAlertWidget";
import { EmployeeChartWidget } from "./EmployeeChartWidget";
import { StockMarketWidget } from "./StockMarketWidget";
import { CryptoWidget } from "./CryptoWidget";
import { NewsTickerWidget } from "./NewsTickerWidget";
import { MiniMapWidget } from "./MiniMapWidget";
import { CompanyCultureWidget } from "./CompanyCultureWidget";
import { SettingsPanel } from "./SettingsPanel";
import { AchievementPopup } from "./AchievementPopup";
import { GameSave } from "@/hooks/useGameSave";
import { GameSettings } from "./CompanySetup";
import { InvestorsPanel } from "./InvestorsPanel";
import { CompetitionPanel } from "./CompetitionPanel";
import { RichEventsPanel } from "./RichEventsPanel";
import { TradingPanel } from "./TradingPanel";
import { VehicleFleetPanel } from "./VehicleFleetPanel";
import { enterMarket, createSubsidiary } from "@/utils/internationalEngine";
import { 
  calculateDailyCoinGain, 
  calculateWeeklyGemGain, 
  canClaimDailyReward, 
  claimDailyReward,
  cleanExpiredBoosts,
} from "@/utils/currencyEngine";
import { playSound, initSounds } from "@/utils/soundEngine";
import { 
  Wallet, 
  TrendingUp, 
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
  Plus,
  Save,
  RotateCcw,
  Landmark,
  Building,
  Truck,
  GraduationCap,
  Scale,
  BarChart3,
  Globe,
  Trophy,
  Megaphone,
  Cpu,
  AlertTriangle,
  ShoppingCart,
  Star,
  Map,
  Coins,
  Gem,
  Gift,
  Swords,
  Eye,
  PieChart,
  Handshake,
  Car,
  LineChart,
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

type TabId = 'overview' | 'rh' | 'products' | 'taxes' | 'banking' | 'realestate' | 'supply' | 'hradvanced' | 'legal' | 'gameplay' | 'international' | 'achievements' | 'marketing' | 'technology' | 'crises' | 'shop' | 'progression' | 'advancedinternational' | 'ultrafinance' | 'advancedproduction' | 'advancedcommercial' | 'salespipeline' | 'investors' | 'competition' | 'richevents' | 'trading' | 'vehicles';

interface OpenWindow {
  id: TabId;
  isMinimized: boolean;
  zIndex: number;
}

interface WidgetState {
  id: string;
  isVisible: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
}

export function GameDashboard({ initialState, onReset }: GameDashboardProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([{ id: 'overview', isMinimized: false, zIndex: 1 }]);
  const [activeWindowId, setActiveWindowId] = useState<TabId>('overview');
  const [showSavePanel, setShowSavePanel] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [pinnedApps, setPinnedApps] = useState<string[]>(['overview', 'shop', 'progression', 'achievements', 'banking', 'rh']);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [treasuryHistory, setTreasuryHistory] = useState<number[]>([]);
  const [widgets, setWidgets] = useState<WidgetState[]>([
    { id: 'clock', isVisible: true, isMinimized: false, position: { x: 100, y: 80 } },
    { id: 'weather', isVisible: true, isMinimized: false, position: { x: 100, y: 320 } },
    { id: 'finance', isVisible: true, isMinimized: false, position: { x: 400, y: 80 } },
    { id: 'stats', isVisible: true, isMinimized: false, position: { x: 400, y: 340 } },
    { id: 'calendar', isVisible: true, isMinimized: false, position: { x: 700, y: 80 } },
    { id: 'tasks', isVisible: true, isMinimized: false, position: { x: 700, y: 380 } },
    { id: 'taxes', isVisible: true, isMinimized: false, position: { x: 1000, y: 80 } },
    { id: 'employees', isVisible: true, isMinimized: false, position: { x: 1000, y: 340 } },
    { id: 'stocks', isVisible: true, isMinimized: false, position: { x: 1280, y: 80 } },
    { id: 'crypto', isVisible: true, isMinimized: false, position: { x: 1280, y: 340 } },
    { id: 'news', isVisible: true, isMinimized: false, position: { x: 100, y: 560 } },
    { id: 'worldmap', isVisible: true, isMinimized: false, position: { x: 400, y: 580 } },
    { id: 'culture', isVisible: true, isMinimized: false, position: { x: 700, y: 620 } },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [pendingAchievement, setPendingAchievement] = useState<any>(null);
  const [konamiActive, setKonamiActive] = useState(false);
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    difficulty: 'normal',
    gameMode: 'career',
    founderType: 'visionary',
    location: 'paris',
    startingBonus: 'none',
    objective: 'millionaire',
    legalStructure: 'sas'
  });
  
  // Track max z-index for window focus
  const [maxZIndex, setMaxZIndex] = useState(1);

  // Konami Code: ↑↑↓↓←→←→BA - Protège la crédibilité
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...konamiSequence, e.code].slice(-10);
      setKonamiSequence(newSequence);
      
      if (newSequence.length === 10 && newSequence.every((key, i) => key === KONAMI_CODE[i])) {
        setKonamiActive(true);
        toast.success('🎮 KONAMI CODE ACTIVÉ ! Crédibilité protégée !', { duration: 5000 });
        playSound('achievement');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiSequence]);

  // Initialize sounds on mount
  useEffect(() => {
    initSounds();
    playSound('startup');
  }, []);

  // Multi-window management functions
  const openApp = useCallback((appId: TabId) => {
    playSound('open');
    setOpenWindows(prev => {
      const existing = prev.find(w => w.id === appId);
      if (existing) {
        // Bring to front and restore if minimized
        return prev.map(w => w.id === appId 
          ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 }
          : w
        );
      }
      // Open new window
      return [...prev, { id: appId, isMinimized: false, zIndex: maxZIndex + 1 }];
    });
    setMaxZIndex(prev => prev + 1);
    setActiveWindowId(appId);
    setRecentApps(prev => [appId, ...prev.filter(a => a !== appId)].slice(0, 10));
  }, [maxZIndex]);

  const closeWindow = useCallback((windowId: TabId) => {
    playSound('close');
    setOpenWindows(prev => prev.filter(w => w.id !== windowId));
    // Set active to next window or null
    setOpenWindows(prev => {
      if (prev.length > 0) {
        const nextActive = prev.reduce((a, b) => a.zIndex > b.zIndex ? a : b);
        setActiveWindowId(nextActive.id);
      }
      return prev;
    });
  }, []);

  const minimizeWindow = useCallback((windowId: TabId) => {
    playSound('minimize');
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  }, []);

  const focusWindow = useCallback((windowId: TabId) => {
    setOpenWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, zIndex: maxZIndex + 1, isMinimized: false } : w
    ));
    setMaxZIndex(prev => prev + 1);
    setActiveWindowId(windowId);
  }, [maxZIndex]);

  const company = gameState.company!;
  const weather = weatherConfig[gameState.economicWeather];
  const WeatherIcon = weather.icon;

  // Game loop with currency gains
  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const newState = processDayTick(prev);
        const company = newState.company!;
        
        // Daily coin gain
        const coinGain = calculateDailyCoinGain(company);
        
        // Weekly gem gain
        const gemGain = calculateWeeklyGemGain(company, newState);
        
        // Clean expired boosts
        const activeBoosts = cleanExpiredBoosts(company, newState.day);
        
        return {
          ...newState,
          company: {
            ...company,
            coins: company.coins + coinGain,
            gems: company.gems + gemGain,
            activeBoosts,
          },
        };
      });
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

  // Daily reward claim
  const claimDailyRewardAction = useCallback(() => {
    if (!canClaimDailyReward(company, gameState.day)) {
      toast.info("Récompense déjà réclamée aujourd'hui !");
      return;
    }
    
    const reward = claimDailyReward(company, gameState.day);
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        coins: prev.company!.coins + reward.coins,
        gems: prev.company!.gems + reward.gems,
        lastDailyReward: gameState.day,
        dailyRewardStreak: reward.streak,
      },
    }));
    
    let message = `+${reward.coins} pièces`;
    if (reward.gems > 0) message += `, +${reward.gems} gemmes`;
    if (reward.special) message += ` - ${reward.special}`;
    toast.success(message, { duration: 4000 });
  }, [company, gameState.day]);

  // ==================== EMPLOYEE ACTIONS ====================
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
        treasury: prev.company!.treasury - 2000,
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

  // ==================== PRODUCT ACTIONS ====================
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

  const addProduct = useCallback(() => {
    if (company.treasury < 10000) {
      toast.error("Trésorerie insuffisante pour lancer un nouveau produit");
      return;
    }

    const productNames = ["Innovation X", "Service Pro", "Solution Plus", "Offre Premium", "Pack Business"];
    const newProduct = createProduct(
      productNames[Math.floor(Math.random() * productNames.length)],
      gameState.day
    );

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

  // ==================== TAX ACTIONS ====================
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

  // ==================== BANKING ACTIONS ====================
  const handleRequestLoan = useCallback((type: LoanType, amount: number, duration: number) => {
    const loan = createLoan(company, type, amount, duration, gameState.day, gameState.interestRate);
    if (!loan) {
      toast.error("Demande de prêt refusée. Vérifiez votre éligibilité.");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury + amount,
        bankAccount: {
          ...prev.company!.bankAccount,
          loans: [...prev.company!.bankAccount.loans, loan],
        },
      },
    }));
    toast.success(`Prêt de ${formatCurrency(amount)} accordé !`);
  }, [company, gameState.day, gameState.interestRate]);

  const handleRequestOverdraft = useCallback((limit: number) => {
    const overdraft = applyForOverdraft(company, limit);
    if (!overdraft) {
      toast.error("Demande de découvert refusée. Score de crédit insuffisant.");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        bankAccount: {
          ...prev.company!.bankAccount,
          overdraft,
        },
      },
    }));
    toast.success(`Découvert de ${formatCurrency(overdraft.limit)} autorisé !`);
  }, [company]);

  const handleCreateInvestment = useCallback((type: InvestmentType, amount: number) => {
    if (company.treasury < amount) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const investment = createInvestment(type, amount, gameState.day, gameState.economicWeather);
    if (!investment) {
      toast.error("Impossible de créer ce placement");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - amount,
        bankAccount: {
          ...prev.company!.bankAccount,
          investments: [...prev.company!.bankAccount.investments, investment],
        },
      },
    }));
    toast.success(`Placement de ${formatCurrency(amount)} effectué !`);
  }, [company.treasury, gameState.day, gameState.economicWeather]);

  const handleLiquidateInvestment = useCallback((investmentId: string) => {
    const investment = company.bankAccount.investments.find(i => i.id === investmentId);
    if (!investment) return;

    const { value, penalty } = liquidateInvestment(investment, gameState.day);

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury + value,
        bankAccount: {
          ...prev.company!.bankAccount,
          investments: prev.company!.bankAccount.investments.filter(i => i.id !== investmentId),
        },
      },
    }));
    toast.success(`Placement liquidé: ${formatCurrency(value)}${penalty > 0 ? ` (pénalité: ${formatCurrency(penalty)})` : ''}`);
  }, [company.bankAccount.investments, gameState.day]);

  const handleChangeBank = useCallback((bankName: string) => {
    const banks = getAvailableBanks(company.bankAccount.creditScore);
    const newBank = banks.find(b => b.name === bankName);
    if (!newBank) return;

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        bankAccount: {
          ...prev.company!.bankAccount,
          bankName: newBank.name,
          monthlyFees: newBank.monthlyFees,
        },
      },
    }));
    toast.success(`Banque changée pour ${bankName}`);
  }, [company.bankAccount.creditScore]);

  // ==================== REAL ESTATE ACTIONS ====================
  const handleBuyProperty = useCallback((property: Partial<Property>) => {
    const price = property.purchasePrice || 0;
    if (company.treasury < price) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const newProperty: Property = {
      id: `prop_${Date.now()}`,
      name: property.name || 'Nouveau local',
      type: property.type || 'bureau',
      size: property.size || 100,
      maxEmployees: property.maxEmployees || 10,
      leaseType: 'achat',
      purchasePrice: price,
      currentValue: price,
      moralBonus: property.moralBonus || 0,
      productivityBonus: property.productivityBonus || 0,
      location: property.location || 'Centre-ville',
      prestige: property.prestige || 5,
      condition: 100,
      maintenanceCost: Math.round(price * 0.001),
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - price,
        properties: [...prev.company!.properties, newProperty],
        totalAssets: prev.company!.totalAssets + price,
      },
    }));
    toast.success(`${newProperty.name} acheté pour ${formatCurrency(price)} !`);
  }, [company.treasury]);

  const handleRentProperty = useCallback((property: Partial<Property>) => {
    const newProperty: Property = {
      id: `prop_${Date.now()}`,
      name: property.name || 'Nouveau local',
      type: property.type || 'bureau',
      size: property.size || 100,
      maxEmployees: property.maxEmployees || 10,
      leaseType: 'location',
      monthlyRent: property.monthlyRent || 1000,
      currentValue: 0,
      moralBonus: property.moralBonus || 0,
      productivityBonus: property.productivityBonus || 0,
      location: property.location || 'Centre-ville',
      prestige: property.prestige || 5,
      condition: 100,
      maintenanceCost: Math.round((property.monthlyRent || 1000) * 0.1),
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        properties: [...prev.company!.properties, newProperty],
      },
    }));
    toast.success(`${newProperty.name} loué pour ${formatCurrency(newProperty.monthlyRent!)}/mois !`);
  }, []);

  const handleSellProperty = useCallback((propertyId: string) => {
    const property = company.properties.find(p => p.id === propertyId);
    if (!property) return;

    const saleValue = Math.round(property.currentValue * 0.9);

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury + saleValue,
        properties: prev.company!.properties.filter(p => p.id !== propertyId),
        totalAssets: prev.company!.totalAssets - property.currentValue,
      },
    }));
    toast.success(`${property.name} vendu pour ${formatCurrency(saleValue)} !`);
  }, [company.properties]);

  const handleMaintenance = useCallback((propertyId: string) => {
    const property = company.properties.find(p => p.id === propertyId);
    if (!property || company.treasury < property.maintenanceCost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - property.maintenanceCost,
        properties: prev.company!.properties.map(p =>
          p.id === propertyId ? { ...p, condition: Math.min(100, p.condition + 20) } : p
        ),
      },
    }));
    toast.success("Entretien effectué !");
  }, [company.properties, company.treasury]);

  // ==================== SUPPLY CHAIN ACTIONS ====================
  const handleAddSupplier = useCallback((supplier: Partial<Supplier>) => {
    const newSupplier: Supplier = {
      id: `sup_${Date.now()}`,
      name: supplier.name || 'Nouveau fournisseur',
      category: supplier.category || 'Général',
      relation: 'nouveau',
      reliability: supplier.reliability || 70,
      quality: supplier.quality || 70,
      priceLevel: supplier.priceLevel || 1.0,
      paymentDelay: supplier.paymentDelay || 30,
      minOrderAmount: supplier.minOrderAmount || 1000,
      deliveryTime: supplier.deliveryTime || 7,
      contracts: [],
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        suppliers: [...prev.company!.suppliers, newSupplier],
      },
    }));
    toast.success(`Fournisseur ${newSupplier.name} ajouté !`);
  }, []);

  // ==================== HR ADVANCED ACTIONS ====================
  const handleStartTraining = useCallback((employeeId: string, training: Partial<Training>) => {
    const cost = training.cost || 2000;
    if (company.treasury < cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const newTraining: Training = {
      id: `train_${Date.now()}`,
      employeeId,
      type: training.type || 'technique',
      name: training.name || 'Formation',
      duration: training.duration || 5,
      cost,
      skillBoost: training.skillBoost || 10,
      startDate: gameState.day,
      completed: false,
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - cost,
        employees: prev.company!.employees.map(e =>
          e.id === employeeId ? { ...e, trainings: [...e.trainings, newTraining] } : e
        ),
      },
    }));
    toast.success("Formation démarrée !");
  }, [company.treasury, gameState.day]);

  const handleToggleBenefit = useCallback((benefitType: BenefitType) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        socialBenefits: prev.company!.socialBenefits.map(b =>
          b.type === benefitType ? { ...b, active: !b.active } : b
        ),
      },
    }));
  }, []);

  const handleNegotiateUnion = useCallback((unionId: string, demandId: string, accept: boolean) => {
    setGameState(prev => {
      const union = prev.company!.unions.find(u => u.id === unionId);
      if (!union) return prev;

      const demand = union.demands.find(d => d.id === demandId);
      if (!demand) return prev;

      return {
        ...prev,
        company: {
          ...prev.company!,
          unions: prev.company!.unions.map(u =>
            u.id === unionId
              ? {
                  ...u,
                  relationship: accept ? Math.min(100, u.relationship + 15) : Math.max(0, u.relationship - 20),
                  demands: u.demands.filter(d => d.id !== demandId),
                }
              : u
          ),
          credibility: accept ? prev.company!.credibility : Math.max(0, prev.company!.credibility - 5),
        },
      };
    });
    toast.info(accept ? "Revendication acceptée" : "Revendication refusée");
  }, []);

  const handlePromoteEmployee = useCallback((employeeId: string) => {
    const cost = 3000;
    if (company.treasury < cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - cost,
        employees: prev.company!.employees.map(e =>
          e.id === employeeId
            ? {
                ...e,
                promotions: e.promotions + 1,
                brutSalary: Math.round(e.brutSalary * 1.15),
                moral: Math.min(100, e.moral + 20),
                skills: Math.min(100, e.skills + 5),
              }
            : e
        ),
      },
    }));
    toast.success("Employé promu !");
  }, [company.treasury]);

  const handleGiveRaise = useCallback((employeeId: string, amount: number) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        employees: prev.company!.employees.map(e =>
          e.id === employeeId
            ? {
                ...e,
                brutSalary: e.brutSalary + amount,
                moral: Math.min(100, e.moral + 10),
                lastRaise: gameState.day,
              }
            : e
        ),
      },
    }));
    toast.success(`Augmentation de ${formatCurrency(amount)} accordée !`);
  }, [gameState.day]);

  // ==================== LEGAL ACTIONS ====================
  const handleHireLawyer = useCallback((lawyer: Partial<Lawyer>) => {
    const newLawyer: Lawyer = {
      id: `law_${Date.now()}`,
      name: lawyer.name || 'Avocat',
      specialty: lawyer.specialty || 'commercial',
      hourlyRate: lawyer.hourlyRate || 200,
      successRate: lawyer.successRate || 70,
      reputation: lawyer.reputation || 60,
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        lawyers: [...prev.company!.lawyers, newLawyer],
      },
    }));
    toast.success(`${newLawyer.name} engagé !`);
  }, []);

  const handleAssignLawyer = useCallback((caseId: string, lawyerId: string) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        legalCases: prev.company!.legalCases.map(c =>
          c.id === caseId ? { ...c, lawyerId } : c
        ),
      },
    }));
    toast.success("Avocat assigné à l'affaire !");
  }, []);

  const handleRegisterIP = useCallback((ip: Partial<IntellectualProperty>) => {
    const cost = 2000;
    if (company.treasury < cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const newIP: IntellectualProperty = {
      id: `ip_${Date.now()}`,
      type: ip.type || 'marque',
      name: ip.name || 'Nouvelle propriété',
      registrationDate: gameState.day,
      expirationDate: gameState.day + 3650,
      annualFee: ip.annualFee || 500,
      value: ip.value || 10000,
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - cost,
        intellectualProperty: [...prev.company!.intellectualProperty, newIP],
      },
    }));
    toast.success(`${newIP.name} enregistrée !`);
  }, [company.treasury, gameState.day]);

  // ==================== INTERNATIONAL ACTIONS ====================
  const handleEnterMarket = useCallback((countryId: string, strategy: 'export' | 'partnership' | 'subsidiary', investment: number) => {
    const countryData = COUNTRIES[countryId as keyof typeof COUNTRIES];
    if (!countryData) return;

    const market: ForeignMarket = {
      id: countryId,
      country: countryData.name,
      currency: countryData.currency,
      exchangeRate: countryData.exchangeRate,
      marketSize: countryData.marketSize,
      penetration: 0,
      entryBarrier: countryData.entryBarrier,
      customsDuty: countryData.customsDuty,
      taxRate: countryData.taxRate,
      hasSubsidiary: false,
      revenue: 0,
    };

    const result = enterMarket(market, strategy, investment, company);
    
    if (!result.success) {
      toast.error(result.event);
      setGameState(prev => ({
        ...prev,
        company: {
          ...prev.company!,
          treasury: prev.company!.treasury - result.cost,
        },
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - result.cost,
        foreignMarkets: [...prev.company!.foreignMarkets, result.market],
      },
    }));
    toast.success(result.event);
  }, [company]);

  const handleCreateSubsidiary = useCallback((marketId: string, capital: number) => {
    if (company.treasury < capital + 50000) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const market = company.foreignMarkets.find(m => m.id === marketId);
    if (!market) return;

    const subsidiary = createSubsidiary(market, capital);

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - capital - 50000,
        foreignMarkets: prev.company!.foreignMarkets.map(m =>
          m.id === marketId ? { ...m, hasSubsidiary: true } : m
        ),
        subsidiaries: [...prev.company!.subsidiaries, subsidiary],
      },
    }));
    toast.success(`Filiale créée en ${market.country} !`);
  }, [company.treasury, company.foreignMarkets]);

  const handleInvestInMarket = useCallback((marketId: string, amount: number) => {
    if (company.treasury < amount) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - amount,
        foreignMarkets: prev.company!.foreignMarkets.map(m =>
          m.id === marketId ? { ...m, penetration: Math.min(30, m.penetration + 0.5) } : m
        ),
      },
    }));
    toast.success("Investissement effectué !");
  }, [company.treasury]);

  const handleInvestInSubsidiary = useCallback((subsidiaryId: string, amount: number) => {
    if (company.treasury < amount) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - amount,
        subsidiaries: prev.company!.subsidiaries.map(s =>
          s.id === subsidiaryId ? { ...s, treasury: s.treasury + amount } : s
        ),
      },
    }));
    toast.success("Capital transféré à la filiale !");
  }, [company.treasury]);

  const handleEnableProductExport = useCallback((productId: string) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        products: prev.company!.products.map(p =>
          p.id === productId ? { ...p, exportEnabled: !p.exportEnabled } : p
        ),
      },
    }));
  }, []);

  // ==================== MARKETING ACTIONS ====================
  const handleLaunchCampaign = useCallback((channel: string, budget: number, duration: number) => {
    if (company.treasury < budget) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const channelNames: Record<string, string> = {
      social: "Réseaux Sociaux", seo: "SEO", ads: "Publicité", email: "Email",
      events: "Événement", pr: "Relations Presse", influencer: "Influenceur", tv: "TV"
    };

    const newCampaign = {
      id: `camp_${Date.now()}`,
      name: `Campagne ${channelNames[channel] || channel}`,
      channel,
      budget,
      duration,
      startDate: gameState.day,
      reach: Math.floor((budget / 1000) * 5000 * (company.reputation / 50)),
      conversions: 0,
      roi: 0,
      active: true,
    };

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - budget,
        marketingCampaigns: [...prev.company!.marketingCampaigns, newCampaign],
      },
    }));
    toast.success(`Campagne ${channelNames[channel]} lancée !`);
  }, [company.treasury, company.reputation, gameState.day]);

  const handlePauseCampaign = useCallback((campaignId: string) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        marketingCampaigns: prev.company!.marketingCampaigns.map(c =>
          c.id === campaignId ? { ...c, active: !c.active } : c
        ),
      },
    }));
  }, []);

  // ==================== TECHNOLOGY ACTIONS ====================
  const handleStartResearch = useCallback((techId: string) => {
    const tech = company.technologies.find(t => t.id === techId);
    if (!tech || tech.unlocked || tech.researching) return;
    if (company.treasury < tech.cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const prereqsMet = tech.prerequisites.every(prereqId =>
      company.technologies.find(t => t.id === prereqId)?.unlocked
    );
    if (!prereqsMet) {
      toast.error("Prérequis non remplis");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - tech.cost,
        technologies: prev.company!.technologies.map(t =>
          t.id === techId ? { ...t, researching: true, progress: 0 } : t
        ),
      },
    }));
    toast.success(`R&D lancée: ${tech.name}`);
  }, [company.technologies, company.treasury]);

  const handleCancelResearch = useCallback((techId: string) => {
    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        technologies: prev.company!.technologies.map(t =>
          t.id === techId ? { ...t, researching: false, progress: 0 } : t
        ),
      },
    }));
    toast.info("Recherche annulée");
  }, []);

  // ==================== CRISIS ACTIONS ====================
  const handleRespondToCrisis = useCallback((crisisId: string, responseId: string) => {
    const crisis = company.activeCrises.find(c => c.id === crisisId);
    if (!crisis) return;

    const response = crisis.responses.find(r => r.id === responseId);
    if (!response) return;

    if (company.treasury < response.cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    setGameState(prev => ({
      ...prev,
      company: {
        ...prev.company!,
        treasury: prev.company!.treasury - response.cost,
        reputation: Math.min(100, prev.company!.reputation + (response.effectiveness / 10)),
        activeCrises: prev.company!.activeCrises.filter(c => c.id !== crisisId),
        resolvedCrises: [...prev.company!.resolvedCrises, { ...crisis, active: false }],
      },
    }));
    toast.success(`Crise "${crisis.name}" résolue !`);
  }, [company.activeCrises, company.treasury]);

  const handleSave = useCallback(() => {
    setShowSavePanel(true);
  }, []);

  const handleLoadSave = useCallback((save: GameSave) => {
    setGameState(prev => ({
      ...prev,
      company: save.company_data,
      day: save.game_state.day,
      month: save.game_state.month,
      year: save.game_state.year,
      isPaused: true,
    }));
    if (save.game_settings) {
      setGameSettings(save.game_settings);
    }
    setShowSavePanel(false);
  }, []);

  // Calculations
  const bfr = calculateBFR(company);
  const tvaDue = calculateTVADue(company);
  const totalSalaryCost = calculateTotalSalaryCosts(company.employees);
  const avgMoral = company.employees.length > 0
    ? company.employees.reduce((sum, e) => sum + e.moral, 0) / company.employees.length
    : 0;

  const canExport = LEGAL_STATUS_MODIFIERS[company.legalStatus].canExport;

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: TrendingUp },
    { id: 'shop', label: 'Boutique', icon: ShoppingCart },
    { id: 'progression', label: 'Progression', icon: Star },
    { id: 'achievements', label: 'Trophées', icon: Trophy },
    { id: 'trading', label: 'Trading', icon: LineChart },
    { id: 'vehicles', label: 'Véhicules', icon: Car },
    { id: 'investors', label: 'Investisseurs', icon: PieChart },
    { id: 'competition', label: 'Concurrence', icon: Swords },
    { id: 'richevents', label: 'Événements', icon: Eye },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'technology', label: 'R&D', icon: Cpu },
    { id: 'crises', label: 'Crises', icon: AlertTriangle },
    { id: 'banking', label: 'Banque', icon: Landmark },
    { id: 'ultrafinance', label: 'Finance+', icon: Wallet },
    { id: 'realestate', label: 'Immobilier', icon: Building },
    { id: 'supply', label: 'Supply Chain', icon: Truck },
    { id: 'advancedproduction', label: 'Production', icon: Package },
    { id: 'rh', label: 'RH', icon: Users },
    { id: 'hradvanced', label: 'RH Avancé', icon: GraduationCap },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'advancedcommercial', label: 'Commercial', icon: ShoppingCart },
    { id: 'salespipeline', label: 'Pipeline', icon: Handshake },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'advancedinternational', label: 'Mondial', icon: Map },
    { id: 'legal', label: 'Juridique', icon: Scale },
    { id: 'taxes', label: 'Fiscalité', icon: FileText },
    { id: 'gameplay', label: 'Stats', icon: BarChart3 },
  ];

  // Get icon colors for variety
  const getIconColor = (id: string): string => {
    const colors: Record<string, string> = {
      overview: "text-primary",
      shop: "text-amber-400",
      progression: "text-yellow-400",
      achievements: "text-amber-500",
      investors: "text-green-400",
      competition: "text-red-400",
      richevents: "text-purple-400",
      marketing: "text-pink-400",
      technology: "text-cyan-400",
      crises: "text-orange-500",
      banking: "text-emerald-400",
      ultrafinance: "text-teal-400",
      realestate: "text-blue-400",
      supply: "text-indigo-400",
      advancedproduction: "text-violet-400",
      rh: "text-rose-400",
      hradvanced: "text-fuchsia-400",
      products: "text-lime-400",
      advancedcommercial: "text-sky-400",
      salespipeline: "text-cyan-500",
      international: "text-blue-500",
      advancedinternational: "text-indigo-500",
      legal: "text-slate-400",
      taxes: "text-gray-400",
      gameplay: "text-zinc-400",
      trading: "text-emerald-500",
      vehicles: "text-amber-500",
    };
    return colors[id] || "text-primary";
  };

  // Open apps for taskbar
  const taskbarApps = openWindows.map(w => {
    const tab = tabs.find(t => t.id === w.id);
    return tab ? { ...tab, color: getIconColor(tab.id), isMinimized: w.isMinimized } : null;
  }).filter(Boolean);

  const renderAppContent = (tabId: TabId) => {
    switch (tabId) {
      case 'overview':
        return <DesktopOverview company={company} gameState={gameState} onDismissEvent={dismissEvent} />;

      case 'rh':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Ressources Humaines</h2>
              <button onClick={hireEmployee} className="btn-game-primary text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Recruter
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.employees.map(employee => (
                <EmployeeCard key={employee.id} employee={employee} onFire={fireEmployee} />
              ))}
              {company.employees.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">Aucun employé. Recrutez votre premier talent !</p>
              )}
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Produits & Services</h2>
              <button onClick={addProduct} className="btn-game-primary text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" /> Nouveau Produit
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.products.map(product => (
                <ProductCard key={product.id} product={product} onUpdatePrice={updateProductPrice} onUpdateMarketing={updateProductMarketing} />
              ))}
              {company.products.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">Lancez votre premier produit !</p>
              )}
            </div>
          </div>
        );

      case 'taxes':
        return (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Déclarations Fiscales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.taxDeclarations.map((declaration, i) => (
                <TaxDeclarationCard key={i} declaration={declaration} onPay={payTax} currentDay={gameState.day} />
              ))}
              {company.taxDeclarations.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center py-8">Aucune déclaration en attente</p>
              )}
            </div>
          </div>
        );

      case 'shop':
        return <ShopPanel coins={company.coins || 0} gems={company.gems || 0} purchasedItems={[]} onPurchase={(itemId, cost, currency) => { toast.success('Achat effectué !'); }} />;
      case 'progression':
        return <ProgressionPanel day={gameState.day} stats={{ totalRevenue: company.monthlyRevenue * 12, employeesHired: company.employees.length, productsLaunched: company.products.length }} />;
      case 'achievements':
        return <AchievementsPanel achievements={company.achievements} missions={company.missions} />;
      case 'investors':
        return <InvestorsPanel company={company} gameState={gameState} onFundingRound={(amount, equity, investorIds) => {
          setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury + amount, capital: prev.company!.capital + amount } }));
          toast.success(`Levée de fonds réussie: ${formatCurrency(amount)} pour ${equity}% d'equity !`);
        }} />;
      case 'competition':
        return <CompetitionPanel company={company} day={gameState.day} onEspionage={(actionId, targetId, cost) => {
          setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury - cost } }));
          toast.success(`Action de renseignement lancée !`);
        }} onCompetitiveAction={(action, cost) => {
          setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury - cost, marketShare: Math.min(100, prev.company!.marketShare + 2) } }));
          toast.success(`Action compétitive "${action}" lancée !`);
        }} />;
      case 'richevents':
        return <RichEventsPanel company={company} gameState={gameState} activeEvents={[]} economicNews={[]} onEventChoice={(eventId, choiceId, effects) => {
          if (effects.treasury) {
            setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury + effects.treasury, credibility: effects.credibility ? Math.max(0, Math.min(100, prev.company!.credibility + effects.credibility)) : prev.company!.credibility } }));
          }
        }} onDismissEvent={(eventId) => toast.info(`Événement fermé`)} />;
      case 'marketing':
        return <MarketingPanel campaigns={company.marketingCampaigns} treasury={company.treasury} reputation={company.reputation} onLaunchCampaign={handleLaunchCampaign} onPauseCampaign={handlePauseCampaign} />;
      case 'technology':
        return <TechnologyPanel technologies={company.technologies} treasury={company.treasury} onStartResearch={handleStartResearch} onCancelResearch={handleCancelResearch} />;
      case 'crises':
        return <CrisesPanel activeCrises={company.activeCrises} resolvedCrises={company.resolvedCrises} treasury={company.treasury} onRespondToCrisis={handleRespondToCrisis} />;
      case 'banking':
        return <BankingPanel bankAccount={company.bankAccount} treasury={company.treasury} monthlyRevenue={company.monthlyRevenue} onRequestLoan={handleRequestLoan} onRequestOverdraft={handleRequestOverdraft} onCreateInvestment={handleCreateInvestment} onLiquidateInvestment={handleLiquidateInvestment} onChangeBank={handleChangeBank} />;
      case 'realestate':
        return <RealEstatePanel properties={company.properties} treasury={company.treasury} employeeCount={company.employees.length} onBuyProperty={handleBuyProperty} onRentProperty={handleRentProperty} onSellProperty={handleSellProperty} onMaintenance={handleMaintenance} />;
      case 'supply':
        return <SupplyChainPanel suppliers={company.suppliers} inventory={company.inventory} clients={company.clients} invoices={company.invoices} treasury={company.treasury} onAddSupplier={handleAddSupplier} onOrderInventory={(supplierId, item, qty) => toast.success('Commande passée !')} onAddClient={(client) => toast.success('Client ajouté !')} onCreateContract={(clientId, contract) => toast.success('Contrat créé !')} onPayInvoice={(invoiceId) => toast.success('Facture payée !')} />;
      case 'hradvanced':
        return <HRAdvancedPanel employees={company.employees} socialBenefits={company.socialBenefits} unions={company.unions} treasury={company.treasury} onStartTraining={handleStartTraining} onToggleBenefit={handleToggleBenefit} onNegotiateUnion={handleNegotiateUnion} onPromoteEmployee={handlePromoteEmployee} onGiveRaise={handleGiveRaise} />;
      case 'legal':
        return <LegalPanel lawyers={company.lawyers} legalCases={company.legalCases} intellectualProperty={company.intellectualProperty} treasury={company.treasury} onHireLawyer={handleHireLawyer} onAssignLawyer={handleAssignLawyer} onRegisterIP={handleRegisterIP} />;
      case 'gameplay':
        return <GameplayPanel financialHistory={company.financialHistory || []} achievements={company.achievements} competitors={company.competitors || []} marketShare={company.marketShare} />;
      case 'international':
        return <InternationalPanel foreignMarkets={company.foreignMarkets} subsidiaries={company.subsidiaries} canExport={canExport} treasury={company.treasury} exchangeRates={{ EUR: 1, USD: 1.08, GBP: 0.86, CHF: 0.95, JPY: 160, CNY: 7.8 }} companyReputation={company.reputation} onEnterMarket={handleEnterMarket} onCreateSubsidiary={handleCreateSubsidiary} onInvestInMarket={handleInvestInMarket} onInvestInSubsidiary={handleInvestInSubsidiary} onEnableProductExport={handleEnableProductExport} />;
      case 'advancedinternational':
        return <AdvancedInternationalPanel treasury={company.treasury} onInvest={(amount, country, mode) => {
          if (company.treasury >= amount) {
            setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury - amount } }));
            toast.success(`Investissement de ${amount}€ en ${country} via ${mode} !`);
          } else toast.error("Trésorerie insuffisante");
        }} />;
      case 'ultrafinance':
        return <UltraFinancePanel company={company} day={gameState.day} month={gameState.month} year={gameState.year} />;
      case 'advancedproduction':
        return <AdvancedProductionPanel company={company} onAddProductionLine={(line) => toast.success(`Ligne ${line.name} créée !`)} onScheduleMaintenance={(lineId) => toast.info(`Maintenance planifiée`)} onOptimizeProcess={(type) => toast.success(`Optimisation ${type} lancée !`)} />;
      case 'advancedcommercial':
        return <AdvancedCommercialPanel company={company} onContactClient={(clientId) => toast.success(`Client contacté !`)} onCreateOpportunity={(clientId) => toast.success(`Opportunité créée !`)} onAdvanceOpportunity={(oppId, stage) => toast.success(`Opportunité avancée à ${stage} !`)} />;
      case 'salespipeline':
        return <SalesPipelinePanel pipeline={{ leads: company.salesPipeline?.leads || [], deals: company.salesPipeline?.deals || [], conversionRates: company.salesPipeline?.conversionRates || {}, averageDealValue: company.salesPipeline?.averageDealValue || 0, averageSalesCycle: company.salesPipeline?.averageSalesCycle || 30, winRate: company.salesPipeline?.winRate || 0 }} customerFeedback={company.customerFeedback?.map(f => ({ ...f, type: f.type as 'nps' | 'csat' | 'review' | 'complaint' | 'suggestion' })) || []} treasury={company.treasury} currentDay={gameState.day}
          onGenerateLead={(lead) => {
            const cost = lead.source === 'referral' ? 0 : lead.source === 'website' ? 50 : lead.source === 'cold_call' ? 100 : lead.source === 'social_media' ? 200 : lead.source === 'partnership' ? 500 : lead.source === 'advertising' ? 1000 : 5000;
            setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury - cost, salesPipeline: { ...prev.company!.salesPipeline, leads: [...(prev.company!.salesPipeline?.leads || []), lead] } } }));
          }}
          onGenerateLeadBatch={(leads, cost) => setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury - cost, salesPipeline: { ...prev.company!.salesPipeline, leads: [...(prev.company!.salesPipeline?.leads || []), ...leads] } } }))}
          onQualifyLead={(leadId, qualified, newScore) => setGameState(prev => ({ ...prev, company: { ...prev.company!, salesPipeline: { ...prev.company!.salesPipeline, leads: (prev.company!.salesPipeline?.leads || []).map(l => l.id === leadId ? { ...l, status: qualified ? 'qualified' : 'contacted', score: newScore } : l) } } }))}
          onConvertToDeaL={(leadId, deal) => setGameState(prev => ({ ...prev, company: { ...prev.company!, salesPipeline: { ...prev.company!.salesPipeline, leads: (prev.company!.salesPipeline?.leads || []).map(l => l.id === leadId ? { ...l, status: 'won' } : l), deals: [...(prev.company!.salesPipeline?.deals || []), deal] } } }))}
          onAdvanceDeal={(dealId, success) => {
            const stages: ('prospecting' | 'qualification' | 'needs_analysis' | 'proposal' | 'negotiation' | 'closing' | 'won')[] = ['prospecting', 'qualification', 'needs_analysis', 'proposal', 'negotiation', 'closing', 'won'];
            const probabilities: Record<string, number> = { prospecting: 10, qualification: 20, needs_analysis: 40, proposal: 60, negotiation: 80, closing: 90, won: 100, lost: 0 };
            setGameState(prev => {
              const deals = prev.company!.salesPipeline?.deals || [];
              const deal = deals.find(d => d.id === dealId);
              if (!deal) return prev;
              let newStage = deal.stage;
              let newProbability = deal.probability;
              let treasuryChange = 0;
              if (!success) { newStage = 'lost'; newProbability = 0; }
              else {
                const currentIndex = stages.indexOf(deal.stage as any);
                if (currentIndex < stages.length - 1) { newStage = stages[currentIndex + 1]; newProbability = probabilities[newStage]; if (newStage === 'won') treasuryChange = deal.value; }
              }
              return { ...prev, company: { ...prev.company!, treasury: prev.company!.treasury + treasuryChange, monthlyRevenue: newStage === 'won' ? prev.company!.monthlyRevenue + deal.value / 12 : prev.company!.monthlyRevenue, salesPipeline: { ...prev.company!.salesPipeline, deals: deals.map(d => d.id === dealId ? { ...d, stage: newStage, probability: newProbability } : d), winRate: success && newStage === 'won' ? Math.round(((prev.company!.salesPipeline?.winRate || 0) * deals.length + 100) / (deals.length + 1)) : prev.company!.salesPipeline?.winRate || 0 } } };
            });
          }}
          onAddActivity={(dealId, activityType, description) => setGameState(prev => ({ ...prev, company: { ...prev.company!, salesPipeline: { ...prev.company!.salesPipeline, deals: (prev.company!.salesPipeline?.deals || []).map(d => d.id === dealId ? { ...d, activities: [...d.activities, { id: `activity_${Date.now()}`, type: activityType as 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'negotiation', date: gameState.day, description }] } : d) } } }))}
          onRecordFeedback={(feedback) => setGameState(prev => ({ ...prev, company: { ...prev.company!, customerFeedback: [...(prev.company!.customerFeedback || []), feedback] } }))}
        />;
      case 'trading':
        return <TradingPanel 
          treasury={company.treasury} 
          day={gameState.day} 
          onTreasuryChange={(amount) => setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury + amount } }))} 
        />;
      case 'vehicles':
        return <VehicleFleetPanel 
          treasury={company.treasury} 
          employees={company.employees} 
          day={gameState.day}
          onTreasuryChange={(amount) => setGameState(prev => ({ ...prev, company: { ...prev.company!, treasury: prev.company!.treasury + amount } }))}
          onReputationChange={(amount) => setGameState(prev => ({ ...prev, company: { ...prev.company!, credibility: Math.min(100, Math.max(konamiActive ? 1 : 0, prev.company!.credibility + amount)) } }))}
          onProductivityChange={(amount) => toast.info(`Productivité ${amount >= 0 ? '+' : ''}${amount}%`)}
        />;
      default:
        return <DesktopOverview company={company} gameState={gameState} onDismissEvent={dismissEvent} />;
    }
  };

  // Widget management
  const updateWidgetPosition = useCallback((widgetId: string, position: { x: number; y: number }) => {
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, position } : w));
  }, []);

  const toggleWidgetMinimize = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, isMinimized: !w.isMinimized } : w));
  }, []);

  const closeWidget = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(w => w.id === widgetId ? { ...w, isVisible: false } : w));
  }, []);

  // Track treasury history for chart
  useEffect(() => {
    setTreasuryHistory(prev => [...prev.slice(-29), company.treasury]);
  }, [company.treasury]);

  // Game Over screen - must be after all hooks
  if (gameState.gameOver) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="game-panel max-w-md w-full text-center space-y-6 animate-fade-in">
          <div className="text-6xl">💀</div>
          <h1 className="text-3xl font-display font-bold text-destructive">Game Over</h1>
          <p className="text-muted-foreground">{gameState.gameOverReason}</p>
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Durée</span>
              <span className="font-medium">{gameState.year - 1} an(s), {gameState.month} mois</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Trésorerie finale</span>
              <span className={cn("font-medium", company.treasury >= 0 ? "text-success" : "text-destructive")}>
                {formatCurrency(company.treasury)}
              </span>
            </div>
          </div>
          <button onClick={onReset} className="w-full btn-game-primary">Nouvelle Partie</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Windows-style Wallpaper Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 70%)
          `
        }}
      />
      
      {/* Desktop Area */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* App Icons Sidebar - Windows-style dock */}
        <div className="w-20 glass-effect border-r border-white/10 py-3 overflow-y-auto flex flex-col gap-0.5 items-center scrollbar-thin scrollbar-thumb-white/10">
          {tabs.map(tab => (
            <DesktopIcon
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={openWindows.some(w => w.id === tab.id && !w.isMinimized)}
              onClick={() => openApp(tab.id as TabId)}
              color={getIconColor(tab.id)}
            />
          ))}
        </div>

        {/* Main Window Area - Multi-window support */}
        <div className="flex-1 p-3 overflow-hidden relative">
          {/* Desktop Widgets */}
          {openWindows.length === 0 && (
            <>
              {widgets.filter(w => w.isVisible).map(widget => {
                const widgetContent = {
                  clock: (
                    <ClockWidget
                      gameDay={gameState.day}
                      gameMonth={gameState.month}
                      gameYear={gameState.year}
                      isPaused={gameState.isPaused}
                    />
                  ),
                  weather: (
                    <EconomicWeatherWidget
                      weather={gameState.economicWeather}
                      marketTrend={Math.floor(Math.random() * 40) - 20}
                      interestRate={gameState.interestRate || 3.5}
                      inflation={2.1}
                    />
                  ),
                  finance: (
                    <FinanceChartWidget
                      treasury={company.treasury}
                      revenue={company.monthlyRevenue}
                      history={treasuryHistory}
                    />
                  ),
                  stats: (
                    <QuickStatsWidget
                      employees={company.employees.length}
                      products={company.products.length}
                      credibility={company.credibility}
                      moral={70}
                      properties={company.properties.length}
                      marketShare={company.marketShare}
                    />
                  ),
                  calendar: (
                    <EventCalendarWidget
                      currentDay={gameState.day}
                      currentMonth={gameState.month}
                      events={company.taxDeclarations.map((tax, i) => ({
                        id: `tax_${i}`,
                        title: tax.type,
                        day: gameState.day + (i + 1) * 5,
                        type: 'tax' as const,
                        completed: tax.paid
                      }))}
                    />
                  ),
                  tasks: (
                    <TaskListWidget />
                  ),
                  taxes: (
                    <TaxAlertWidget
                      currentDay={gameState.day}
                      taxAlerts={[]}
                      treasury={company.treasury}
                    />
                  ),
                  employees: (
                    <EmployeeChartWidget
                      stats={{
                        total: company.employees.length,
                        byDepartment: [
                          { name: 'Tech', count: Math.max(1, Math.floor(company.employees.length * 0.4)), color: 'bg-blue-500' },
                          { name: 'Ventes', count: Math.max(1, Math.floor(company.employees.length * 0.25)), color: 'bg-green-500' },
                          { name: 'Admin', count: Math.max(1, Math.floor(company.employees.length * 0.2)), color: 'bg-purple-500' },
                          { name: 'Marketing', count: Math.max(1, Math.floor(company.employees.length * 0.15)), color: 'bg-orange-500' },
                        ],
                        averageMorale: Math.round(company.employees.reduce((sum, e) => sum + (e.moral || 70), 0) / Math.max(1, company.employees.length)),
                        averageSalary: Math.round(company.employees.reduce((sum, e) => sum + e.brutSalary, 0) / Math.max(1, company.employees.length)),
                        recentChanges: { type: 'hired', count: 1 }
                      }}
                    />
                  ),
                  stocks: (
                    <StockMarketWidget
                      treasury={company.treasury}
                      onBuyStock={(symbol, amount) => {
                        playSound('coin');
                        toast.success(`Achat de ${symbol} effectué !`);
                      }}
                      onSellStock={(symbol, amount) => {
                        playSound('coin');
                        toast.info(`Vente de ${symbol} effectuée !`);
                      }}
                    />
                  ),
                  crypto: (
                    <CryptoWidget
                      treasury={company.treasury}
                      onBuyCrypto={(symbol, amount) => {
                        playSound('coin');
                        toast.success(`Investissement en ${symbol} effectué !`);
                      }}
                    />
                  ),
                  news: (
                    <NewsTickerWidget
                      economicWeather={gameState.economicWeather}
                      day={gameState.day}
                    />
                  ),
                  worldmap: (
                    <MiniMapWidget
                      homeCountry="FR"
                      markets={company.foreignMarkets.map(m => ({
                        country: m.country,
                        code: m.id.toUpperCase(),
                        penetration: m.penetration,
                        hasSubsidiary: m.hasSubsidiary
                      }))}
                      subsidiaries={company.subsidiaries.length}
                    />
                  ),
                  culture: (
                    <CompanyCultureWidget
                      employees={company.employees.length}
                      moral={company.employees.length > 0 
                        ? Math.round(company.employees.reduce((sum, e) => sum + e.moral, 0) / company.employees.length)
                        : 70}
                      credibility={company.credibility}
                    />
                  ),
                };

                const widgetSizes: Record<string, { width: number; height: number }> = {
                  clock: { width: 260, height: 200 },
                  weather: { width: 280, height: 240 },
                  finance: { width: 300, height: 240 },
                  stats: { width: 280, height: 200 },
                  calendar: { width: 280, height: 280 },
                  tasks: { width: 260, height: 220 },
                  taxes: { width: 280, height: 260 },
                  employees: { width: 280, height: 240 },
                  stocks: { width: 300, height: 280 },
                  crypto: { width: 280, height: 260 },
                  news: { width: 320, height: 200 },
                  worldmap: { width: 300, height: 240 },
                  culture: { width: 280, height: 220 },
                };

                const widgetTitles: Record<string, string> = {
                  clock: 'Horloge',
                  weather: 'Météo économique',
                  finance: 'Finances',
                  stats: 'Statistiques',
                  calendar: 'Calendrier',
                  tasks: 'Tâches',
                  taxes: 'Alertes fiscales',
                  employees: 'Employés',
                  stocks: 'Bourse',
                  crypto: 'Crypto',
                  news: 'Actualités',
                  worldmap: 'Présence mondiale',
                  culture: 'Culture',
                };

                return (
                  <DesktopWidget
                    key={widget.id}
                    id={widget.id}
                    title={widgetTitles[widget.id] || widget.id}
                    initialPosition={widget.position}
                    initialSize={widgetSizes[widget.id]}
                    onClose={() => closeWidget(widget.id)}
                    onPositionChange={(pos) => updateWidgetPosition(widget.id, pos)}
                    isMinimized={widget.isMinimized}
                    onToggleMinimize={() => toggleWidgetMinimize(widget.id)}
                  >
                    {widgetContent[widget.id as keyof typeof widgetContent]}
                  </DesktopWidget>
                );
              })}
            </>
          )}

          {/* Render open windows */}
          {openWindows.filter(w => !w.isMinimized).map(window => {
            const tabData = tabs.find(t => t.id === window.id);
            if (!tabData) return null;
            
            return (
              <div
                key={window.id}
                className="absolute inset-0 p-3"
                style={{ zIndex: window.zIndex }}
                onClick={() => focusWindow(window.id)}
              >
                <AppWindow
                  id={tabData.id}
                  title={tabData.label}
                  icon={tabData.icon}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  color={getIconColor(tabData.id)}
                >
                  {renderAppContent(window.id)}
                </AppWindow>
              </div>
            );
          })}
        </div>
      </div>

      {/* Taskbar */}
      <Taskbar
        companyName={company.name}
        coins={company.coins || 0}
        gems={company.gems || 0}
        day={gameState.day}
        month={gameState.month}
        year={gameState.year}
        treasury={company.treasury}
        isPaused={gameState.isPaused}
        gameSpeed={gameState.gameSpeed}
        economicWeather={gameState.economicWeather}
        canClaimReward={canClaimDailyReward(company, gameState.day)}
        openApps={taskbarApps as any}
        activeAppId={activeWindowId}
        notificationCount={notifications.filter(n => !n.read).length}
        onAppClick={(id) => openApp(id as TabId)}
        onTogglePause={togglePause}
        onSetSpeed={setSpeed}
        onSave={handleSave}
        onReset={onReset}
        onClaimReward={claimDailyRewardAction}
        onStartMenuClick={() => setShowStartMenu(!showStartMenu)}
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />

      {/* Start Menu */}
      <StartMenu
        isOpen={showStartMenu}
        onClose={() => setShowStartMenu(false)}
        onAppClick={(id) => {
          openApp(id as TabId);
          setShowStartMenu(false);
        }}
        companyName={company.name}
        treasury={company.treasury}
        day={gameState.day}
        recentApps={recentApps}
        pinnedApps={pinnedApps}
        onPinApp={(id) => setPinnedApps(prev => [...prev, id])}
        onUnpinApp={(id) => setPinnedApps(prev => prev.filter(a => a !== id))}
        onReset={onReset}
        onSave={handleSave}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onClearAll={() => setNotifications([])}
      />
      {showSavePanel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <SaveLoadPanel
              company={company}
              gameState={{ day: gameState.day, month: gameState.month, year: gameState.year, isPaused: gameState.isPaused, speed: gameState.gameSpeed }}
              settings={gameSettings}
              onLoad={handleLoadSave}
              onClose={() => setShowSavePanel(false)}
            />
            <button onClick={() => setShowSavePanel(false)} className="mt-4 w-full btn-game-secondary">Fermer</button>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onReset={onReset}
        onSave={handleSave}
      />

      {/* Achievement Popup */}
      <AchievementPopup
        achievement={pendingAchievement}
        onClose={() => setPendingAchievement(null)}
      />
    </div>
  );
}
