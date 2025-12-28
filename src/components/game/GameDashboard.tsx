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
import { enterMarket, createSubsidiary } from "@/utils/internationalEngine";
import { 
  calculateDailyCoinGain, 
  calculateWeeklyGemGain, 
  canClaimDailyReward, 
  claimDailyReward,
  cleanExpiredBoosts,
} from "@/utils/currencyEngine";
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

type TabId = 'overview' | 'rh' | 'products' | 'taxes' | 'banking' | 'realestate' | 'supply' | 'hradvanced' | 'legal' | 'gameplay' | 'international' | 'achievements' | 'marketing' | 'technology' | 'crises' | 'shop' | 'progression' | 'advancedinternational';

export function GameDashboard({ initialState, onReset }: GameDashboardProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

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

  const canExport = LEGAL_STATUS_MODIFIERS[company.legalStatus].canExport;

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: TrendingUp },
    { id: 'shop', label: 'Boutique', icon: ShoppingCart },
    { id: 'progression', label: 'Progression', icon: Star },
    { id: 'achievements', label: 'Trophées', icon: Trophy },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'technology', label: 'R&D', icon: Cpu },
    { id: 'crises', label: 'Crises', icon: AlertTriangle },
    { id: 'banking', label: 'Banque', icon: Landmark },
    { id: 'realestate', label: 'Immobilier', icon: Building },
    { id: 'supply', label: 'Supply Chain', icon: Truck },
    { id: 'rh', label: 'RH', icon: Users },
    { id: 'hradvanced', label: 'RH Avancé', icon: GraduationCap },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'advancedinternational', label: 'Mondial', icon: Map },
    { id: 'legal', label: 'Juridique', icon: Scale },
    { id: 'taxes', label: 'Fiscalité', icon: FileText },
    { id: 'gameplay', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-display font-bold text-lg">{company.name}</h1>
              <div className={cn("flex items-center gap-1.5 text-sm", weather.color)}>
                <WeatherIcon className="w-4 h-4" />
                <span>{weather.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Currency display */}
              <div className="flex items-center gap-1.5 bg-amber-500/20 px-2.5 py-1 rounded-full">
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-400 text-sm">{company.coins?.toLocaleString() || 0}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-purple-500/20 px-2.5 py-1 rounded-full">
                <Gem className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-purple-400 text-sm">{company.gems || 0}</span>
              </div>
              
              {/* Daily reward button */}
              {canClaimDailyReward(company, gameState.day) && (
                <button 
                  onClick={claimDailyRewardAction}
                  className="flex items-center gap-1.5 bg-success/20 hover:bg-success/30 px-2.5 py-1 rounded-full transition-colors animate-pulse"
                >
                  <Gift className="w-4 h-4 text-success" />
                  <span className="font-bold text-success text-xs">Récompense!</span>
                </button>
              )}
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>J{gameState.day} M{gameState.month} A{gameState.year}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setSpeed(1)} className={cn("p-2 rounded-lg transition-colors", gameState.gameSpeed === 1 ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80")}>
                <Play className="w-4 h-4" />
              </button>
              <button onClick={() => setSpeed(2)} className={cn("p-2 rounded-lg transition-colors", gameState.gameSpeed === 2 ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80")}>
                <FastForward className="w-4 h-4" />
              </button>
              <button onClick={() => setSpeed(3)} className={cn("p-2 rounded-lg transition-colors", gameState.gameSpeed === 3 ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80")}>
                <FastForward className="w-4 h-4" /><FastForward className="w-4 h-4 -ml-2" />
              </button>
              <button onClick={togglePause} className={cn("p-2 rounded-lg transition-colors", gameState.isPaused ? "bg-warning text-warning-foreground" : "bg-secondary hover:bg-secondary/80")}>
                {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button onClick={handleSave} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80"><Save className="w-4 h-4" /></button>
              <button onClick={onReset} className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-destructive"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Stats Row */}
          <div className="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Trésorerie" value={formatCurrency(company.treasury)} icon={Wallet} colorClass={company.treasury >= 0 ? "text-success" : "text-destructive"} subValue={`BFR: ${formatCurrency(bfr)}`} />
            <StatCard label="CA Mensuel" value={formatCurrency(company.monthlyRevenue)} icon={TrendingUp} colorClass="text-success" subValue={`Dépenses: ${formatCurrency(company.monthlyExpenses)}`} />
            <StatCard label="Score CFS" value={`${Math.round(company.credibility)}/100`} icon={Shield} colorClass={getCredibilityColor(company.credibility)} subValue="Crédibilité Fiscale & Sociale" />
            <StatCard label="Moral Équipe" value={formatPercent(avgMoral)} icon={Heart} colorClass={getMoralColor(avgMoral)} subValue={`${company.employees.length} employé(s)`} />
          </div>

          {/* Gauges & Events */}
          <div className="col-span-12 md:col-span-8">
            <div className="game-panel space-y-4">
              <h2 className="font-display font-semibold">Indicateurs Clés</h2>
              <div className="grid grid-cols-2 gap-6">
                <GaugeBar value={company.credibility} label="Crédibilité CFS" colorClass={company.credibility >= 80 ? "bg-success" : company.credibility >= 50 ? "bg-warning" : "bg-destructive"} />
                <GaugeBar value={avgMoral} label="Moral Global" colorClass={avgMoral >= 70 ? "bg-success" : avgMoral >= 40 ? "bg-warning" : "bg-destructive"} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-border">
                <div><p className="data-label">Coût Salarial</p><p className="text-lg font-bold text-destructive">{formatCurrency(totalSalaryCost)}/mois</p></div>
                <div><p className="data-label">TVA Due</p><p className="text-lg font-bold text-warning">{formatCurrency(tvaDue)}</p></div>
                <div><p className="data-label">Marge Secteur</p><p className="text-lg font-bold text-primary">x{SECTOR_MODIFIERS[company.sector].marginMultiplier.toFixed(1)}</p></div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="game-panel space-y-3">
              <h2 className="font-display font-semibold">Événements</h2>
              {gameState.activeEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun événement en cours</p>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {gameState.activeEvents.map(event => (
                    <EventCard key={event.id} event={event} onDismiss={dismissEvent} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="col-span-12">
            <div className="flex gap-1 flex-wrap border-b border-border pb-2 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.employees.slice(0, 3).map(employee => (<EmployeeCard key={employee.id} employee={employee} />))}
                {company.products.slice(0, 3).map(product => (<ProductCard key={product.id} product={product} />))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <AchievementsPanel
                achievements={company.achievements}
                missions={company.missions}
              />
            )}

            {activeTab === 'marketing' && (
              <MarketingPanel
                campaigns={company.marketingCampaigns}
                treasury={company.treasury}
                reputation={company.reputation}
                onLaunchCampaign={handleLaunchCampaign}
                onPauseCampaign={handlePauseCampaign}
              />
            )}

            {activeTab === 'technology' && (
              <TechnologyPanel
                technologies={company.technologies}
                treasury={company.treasury}
                onStartResearch={handleStartResearch}
                onCancelResearch={handleCancelResearch}
              />
            )}

            {activeTab === 'crises' && (
              <CrisesPanel
                activeCrises={company.activeCrises}
                resolvedCrises={company.resolvedCrises}
                treasury={company.treasury}
                onRespondToCrisis={handleRespondToCrisis}
              />
            )}

            {activeTab === 'banking' && (
              <BankingPanel
                bankAccount={company.bankAccount}
                treasury={company.treasury}
                monthlyRevenue={company.monthlyRevenue}
                onRequestLoan={handleRequestLoan}
                onRequestOverdraft={handleRequestOverdraft}
                onCreateInvestment={handleCreateInvestment}
                onLiquidateInvestment={handleLiquidateInvestment}
                onChangeBank={handleChangeBank}
              />
            )}

            {activeTab === 'realestate' && (
              <RealEstatePanel
                properties={company.properties}
                treasury={company.treasury}
                employeeCount={company.employees.length}
                onBuyProperty={handleBuyProperty}
                onRentProperty={handleRentProperty}
                onSellProperty={handleSellProperty}
                onMaintenance={handleMaintenance}
              />
            )}

            {activeTab === 'supply' && (
              <SupplyChainPanel
                suppliers={company.suppliers}
                inventory={company.inventory}
                clients={company.clients}
                invoices={company.invoices}
                treasury={company.treasury}
                onAddSupplier={handleAddSupplier}
                onOrderInventory={() => {}}
                onAddClient={() => {}}
                onCreateContract={() => {}}
                onPayInvoice={() => {}}
              />
            )}

            {activeTab === 'rh' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold">Équipe ({company.employees.length})</h3>
                  <button onClick={hireEmployee} className="btn-game-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />Recruter (2 000€)
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.employees.map(employee => (<EmployeeCard key={employee.id} employee={employee} onFire={fireEmployee} />))}
                </div>
              </div>
            )}

            {activeTab === 'hradvanced' && (
              <HRAdvancedPanel
                employees={company.employees}
                socialBenefits={company.socialBenefits}
                unions={company.unions}
                treasury={company.treasury}
                onStartTraining={handleStartTraining}
                onToggleBenefit={handleToggleBenefit}
                onNegotiateUnion={handleNegotiateUnion}
                onPromoteEmployee={handlePromoteEmployee}
                onGiveRaise={handleGiveRaise}
              />
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold">Catalogue ({company.products.length})</h3>
                  <button onClick={addProduct} className="btn-game-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />Nouveau produit (10 000€)
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {company.products.map(product => (<ProductCard key={product.id} product={product} onUpdatePrice={updateProductPrice} onUpdateMarketing={updateProductMarketing} />))}
                </div>
              </div>
            )}

            {activeTab === 'international' && (
              <InternationalPanel
                foreignMarkets={company.foreignMarkets}
                subsidiaries={company.subsidiaries}
                exchangeRates={gameState.exchangeRates}
                treasury={company.treasury}
                companyReputation={company.reputation}
                canExport={canExport}
                onEnterMarket={handleEnterMarket}
                onCreateSubsidiary={handleCreateSubsidiary}
                onInvestInMarket={handleInvestInMarket}
                onInvestInSubsidiary={handleInvestInSubsidiary}
                onEnableProductExport={handleEnableProductExport}
              />
            )}

            {activeTab === 'legal' && (
              <LegalPanel
                legalCases={company.legalCases}
                lawyers={company.lawyers}
                intellectualProperty={company.intellectualProperty}
                treasury={company.treasury}
                onHireLawyer={handleHireLawyer}
                onAssignLawyer={handleAssignLawyer}
                onRegisterIP={handleRegisterIP}
              />
            )}

            {activeTab === 'taxes' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-semibold">Déclarations Fiscales</h3>
                  <div className="text-sm text-muted-foreground">TVA: {formatCurrency(company.tvaCollected)} collectée | {formatCurrency(company.tvaDeductible)} déductible</div>
                </div>
                {company.taxDeclarations.filter(d => !d.paid).length === 0 ? (
                  <div className="game-panel text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Aucune déclaration en attente</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {company.taxDeclarations.filter(d => !d.paid).map((declaration, i) => (
                      <TaxDeclarationCard key={i} declaration={declaration} currentDay={gameState.day + (gameState.month - 1) * 30} onPay={payTax} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gameplay' && (
              <GameplayPanel
                financialHistory={company.financialHistory}
                achievements={company.achievements}
                competitors={company.competitors}
                marketShare={company.marketShare}
              />
            )}

            {activeTab === 'shop' && (
              <ShopPanel
                coins={company.coins || 0}
                gems={company.gems || 0}
                purchasedItems={company.purchasedItems || []}
                onPurchase={(itemId, cost, currency) => {
                  setGameState(prev => ({
                    ...prev,
                    company: {
                      ...prev.company!,
                      coins: currency === 'coins' ? prev.company!.coins - cost : prev.company!.coins,
                      gems: currency === 'gems' ? prev.company!.gems - cost : prev.company!.gems,
                      purchasedItems: [...(prev.company!.purchasedItems || []), itemId],
                    },
                  }));
                  toast.success(`Article acheté !`);
                }}
              />
            )}

            {activeTab === 'progression' && (
              <ProgressionPanel
                day={gameState.day}
                stats={{
                  totalRevenue: company.monthlyRevenue * gameState.month,
                  totalProfit: company.treasury,
                  employeesHired: company.employees.length,
                  productsLaunched: company.products.length,
                  countriesExpanded: company.foreignMarkets.length,
                  achievementsUnlocked: company.achievements.filter(a => a.unlocked).length,
                  totalPlayTime: gameState.day + (gameState.month - 1) * 30 + (gameState.year - 1) * 365,
                  highestValuation: company.treasury + company.totalAssets,
                  companiesCreated: 1,
                  questsCompleted: 0,
                  prestigeResets: 0,
                }}
              />
            )}

            {activeTab === 'advancedinternational' && (
              <AdvancedInternationalPanel
                treasury={company.treasury}
                onInvest={(amount, country, mode) => {
                  if (company.treasury >= amount) {
                    setGameState(prev => ({
                      ...prev,
                      company: {
                        ...prev.company!,
                        treasury: prev.company!.treasury - amount,
                      },
                    }));
                    toast.success(`Investissement de ${amount}€ en ${country} via ${mode} !`);
                  } else {
                    toast.error("Trésorerie insuffisante");
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
