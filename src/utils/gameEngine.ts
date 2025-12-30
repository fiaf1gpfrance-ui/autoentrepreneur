import { 
  GameState, 
  Company, 
  Employee, 
  Product, 
  GameEvent,
  TAX_RATES,
  SECTOR_MODIFIERS,
  ProductPhase,
  EconomicWeather,
  TaxDeclaration,
  EmployeeTrait,
  ContractType,
  EventCategory
} from '@/types/game';
import { createInitialBankAccount } from './bankingEngine';

// Calculate super-brut (total employer cost)
export function calculateSuperBrut(brutSalary: number): number {
  return brutSalary * (1 + TAX_RATES.urssaf_patronal);
}

// Calculate net salary
export function calculateNetSalary(brutSalary: number): number {
  return brutSalary * (1 - TAX_RATES.urssaf_salarial);
}

// Calculate total salary costs for company
export function calculateTotalSalaryCosts(employees: Employee[]): number {
  return employees.reduce((total, emp) => total + calculateSuperBrut(emp.brutSalary), 0);
}

// Calculate BFR (Besoin en Fonds de Roulement)
export function calculateBFR(company: Company): number {
  const clientCreances = company.monthlyRevenue * 0.3; // 30 days client payment delay
  const stockValue = company.products.reduce((sum, p) => sum + p.rdCost * 0.1, 0);
  const supplierDebt = company.monthlyExpenses * 0.2; // 20 days supplier delay
  return clientCreances + stockValue - supplierDebt;
}

// Calculate TVA due
export function calculateTVADue(company: Company): number {
  return company.tvaCollected - company.tvaDeductible;
}

// Calculate IS (Impôt sur les Sociétés)
export function calculateIS(annualProfit: number): number {
  if (annualProfit <= 0) return 0;
  if (annualProfit <= 42500) {
    return annualProfit * TAX_RATES.is_pme;
  }
  return 42500 * TAX_RATES.is_pme + (annualProfit - 42500) * TAX_RATES.is_standard;
}

// Calculate product revenue based on phase and marketing
export function calculateProductRevenue(
  product: Product, 
  economicWeather: EconomicWeather,
  sectorModifier: number
): number {
  const phaseMultipliers: Record<ProductPhase, number> = {
    rd: 0,
    lancement: 0.4,
    maturite: 1.0,
    declin: 0.5,
  };

  const weatherMultipliers: Record<EconomicWeather, number> = {
    croissance: 1.3,
    stable: 1.0,
    recession: 0.7,
    crise: 0.4,
  };

  const marketingEffect = Math.min(1 + product.marketingBudget / 10000, 2);
  const qualityEffect = product.quality / 100;

  return (
    product.salesVolume *
    product.currentPrice *
    phaseMultipliers[product.phase] *
    weatherMultipliers[economicWeather] *
    marketingEffect *
    qualityEffect *
    sectorModifier
  );
}

// Generate random employee
export function generateEmployee(sector: string, day: number): Employee {
  const firstNames = ['Marie', 'Thomas', 'Sophie', 'Lucas', 'Emma', 'Hugo', 'Léa', 'Nathan', 'Chloé', 'Louis'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
  const roles = ['Développeur', 'Commercial', 'Comptable', 'Manager', 'Technicien', 'Designer', 'RH', 'Marketing'];
  const traits: EmployeeTrait[] = ['syndicaliste', 'workaholic', 'creatif', 'rigoureux', 'leader', 'discret', 'negociateur', 'perfectionniste'];
  const contracts: ContractType[] = ['cdi', 'cdd', 'alternance'];
  const educations: Employee['education'][] = ['bac', 'bac+2', 'bac+3', 'bac+5', 'doctorat'];

  const baseSalary = SECTOR_MODIFIERS[sector as keyof typeof SECTOR_MODIFIERS]?.salaryMultiplier || 1;
  const roleMultiplier = Math.random() * 0.5 + 0.8;

  return {
    id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    role: roles[Math.floor(Math.random() * roles.length)],
    skills: Math.floor(Math.random() * 50 + 30),
    moral: Math.floor(Math.random() * 30 + 60),
    contractType: contracts[Math.floor(Math.random() * contracts.length)],
    trait: traits[Math.floor(Math.random() * traits.length)],
    brutSalary: Math.round(2500 * baseSalary * roleMultiplier),
    hireDate: day,
    productivity: 100,
    seniority: 0,
    experience: Math.floor(Math.random() * 5),
    education: educations[Math.floor(Math.random() * educations.length)],
    trainings: [],
    promotions: 0,
    absences: 0,
    warnings: 0,
    bonus: 0,
    benefits: [],
  };
}

// Event database
const EVENTS_DATABASE: Omit<GameEvent, 'id' | 'day'>[] = [
  // Administratif
  {
    title: "Contrôle URSSAF inopiné",
    description: "L'URSSAF annonce un contrôle de vos déclarations des 3 derniers mois.",
    category: 'administratif',
    severity: 'critical',
    effects: { credibility: -15, treasury: -5000 },
  },
  {
    title: "Erreur de déclaration TVA",
    description: "Une erreur a été détectée dans votre dernière déclaration TVA.",
    category: 'administratif',
    severity: 'warning',
    effects: { treasury: -2000, credibility: -5 },
  },
  {
    title: "Rappel échéance fiscale",
    description: "La date limite de déclaration approche. N'oubliez pas de déclarer !",
    category: 'administratif',
    severity: 'info',
    effects: {},
  },
  {
    title: "Subvention accordée",
    description: "Votre demande de subvention innovation a été acceptée !",
    category: 'administratif',
    severity: 'info',
    effects: { treasury: 15000, credibility: 5 },
  },
  // Marché
  {
    title: "Nouveau concurrent agressif",
    description: "Un concurrent entre sur le marché avec des prix 30% inférieurs.",
    category: 'marche',
    severity: 'warning',
    effects: { treasury: -3000 },
  },
  {
    title: "Bad buzz réseaux sociaux",
    description: "Une publication virale critique votre entreprise.",
    category: 'marche',
    severity: 'critical',
    effects: { credibility: -20, treasury: -5000 },
  },
  {
    title: "Contrat majeur signé",
    description: "Un grand compte signe un contrat annuel avec vous !",
    category: 'marche',
    severity: 'info',
    effects: { treasury: 25000, credibility: 10 },
  },
  {
    title: "Article presse positive",
    description: "Un média économique fait un article élogieux sur votre entreprise.",
    category: 'marche',
    severity: 'info',
    effects: { credibility: 8 },
  },
  // Interne
  {
    title: "Burn-out employé clé",
    description: "Un de vos meilleurs éléments est en arrêt maladie prolongé.",
    category: 'interne',
    severity: 'critical',
    effects: { moral: -15, productivity: -20 },
  },
  {
    title: "Vol de matériel",
    description: "Du matériel informatique a disparu des locaux.",
    category: 'interne',
    severity: 'warning',
    effects: { treasury: -3000, moral: -5 },
  },
  {
    title: "Panne machine à café",
    description: "La machine à café est en panne. Le moral des troupes en prend un coup.",
    category: 'interne',
    severity: 'info',
    effects: { moral: -8 },
  },
  {
    title: "Team building réussi",
    description: "Le séminaire d'équipe a renforcé la cohésion.",
    category: 'interne',
    severity: 'info',
    effects: { moral: 15, productivity: 5 },
  },
  {
    title: "Grève spontanée",
    description: "Vos employés entament une grève suite à des revendications salariales.",
    category: 'interne',
    severity: 'critical',
    effects: { productivity: -80, moral: -20, credibility: -10 },
  },
  // Économique
  {
    title: "Hausse des taux d'intérêt",
    description: "La BCE remonte ses taux. Vos emprunts coûtent plus cher.",
    category: 'economique',
    severity: 'warning',
    effects: { treasury: -2000 },
  },
  {
    title: "Inflation galopante",
    description: "L'inflation atteint 8%. Vos coûts augmentent.",
    category: 'economique',
    severity: 'warning',
    effects: { treasury: -4000 },
  },
  {
    title: "Aide gouvernementale",
    description: "Le gouvernement annonce une aide aux entreprises de votre secteur.",
    category: 'economique',
    severity: 'info',
    effects: { treasury: 10000 },
  },
];

// Generate random event
export function generateRandomEvent(day: number, economicWeather: EconomicWeather): GameEvent | null {
  // 15% chance of event per day, higher in crisis
  const eventChance = economicWeather === 'crise' ? 0.25 : economicWeather === 'recession' ? 0.20 : 0.15;
  
  if (Math.random() > eventChance) return null;

  const event = EVENTS_DATABASE[Math.floor(Math.random() * EVENTS_DATABASE.length)];
  
  return {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    day,
  };
}

// Update economic weather
export function updateEconomicWeather(current: EconomicWeather): EconomicWeather {
  const transitions: Record<EconomicWeather, EconomicWeather[]> = {
    croissance: ['croissance', 'croissance', 'stable'],
    stable: ['croissance', 'stable', 'stable', 'recession'],
    recession: ['stable', 'recession', 'recession', 'crise'],
    crise: ['recession', 'crise', 'crise'],
  };

  const options = transitions[current];
  return options[Math.floor(Math.random() * options.length)];
}

// Process daily game tick
export function processDayTick(state: GameState): GameState {
  if (!state.company || state.isPaused || state.gameOver) return state;

  const newState = { ...state };
  const company = { ...newState.company! };
  
  // Update day/month/year
  newState.day++;
  if (newState.day > 30) {
    newState.day = 1;
    newState.month++;
    
    // Monthly processing
    company.financialHistory.push({
      day: state.day + (state.month - 1) * 30 + (state.year - 1) * 360,
      treasury: company.treasury,
      revenue: company.monthlyRevenue,
      expenses: company.monthlyExpenses,
      netResult: company.monthlyRevenue - company.monthlyExpenses,
    });

    // Check for negative treasury
    if (company.treasury < 0) {
      newState.consecutiveNegativeMonths++;
      if (newState.consecutiveNegativeMonths >= 3) {
        newState.gameOver = true;
        newState.gameOverReason = "Faillite : Trésorerie négative pendant 3 mois consécutifs.";
      }
    } else {
      newState.consecutiveNegativeMonths = 0;
    }

    // Generate tax declarations
    if (newState.month % 3 === 0) {
      // Quarterly TVA
      const tvaDue = calculateTVADue(company);
      if (tvaDue > 0) {
        company.taxDeclarations.push({
          type: 'tva',
          amount: tvaDue,
          dueDate: newState.day + 15,
          paid: false,
        });
      }
      company.tvaCollected = 0;
      company.tvaDeductible = 0;
    }

    if (newState.month > 12) {
      newState.month = 1;
      newState.year++;
      
      // Yearly IS calculation
      const annualProfit = company.financialHistory
        .slice(-12)
        .reduce((sum, h) => sum + h.netResult, 0);
      const isDue = calculateIS(annualProfit);
      if (isDue > 0) {
        company.taxDeclarations.push({
          type: 'is',
          amount: isDue,
          dueDate: newState.day + 90,
          paid: false,
        });
      }
    }

    // Update economic weather monthly
    newState.economicWeather = updateEconomicWeather(newState.economicWeather);
  }

  // Calculate daily revenue
  const sectorMod = SECTOR_MODIFIERS[company.sector];
  let dailyRevenue = 0;
  
  company.products = company.products.map(product => {
    if (product.phase === 'rd') {
      // R&D progress
      const rdSpeed = company.employees.reduce((sum, e) => {
        if (e.role === 'Développeur' || e.role === 'Technicien') {
          return sum + (e.skills / 100) * (e.productivity / 100);
        }
        return sum;
      }, 0.1);
      
      product.rdProgress = Math.min(100, product.rdProgress + rdSpeed * 2);
      
      if (product.rdProgress >= 100) {
        product.phase = 'lancement';
        product.phaseStartDay = newState.day;
      }
    } else {
      const revenue = calculateProductRevenue(product, newState.economicWeather, sectorMod.marginMultiplier);
      dailyRevenue += revenue / 30; // Daily portion

      // Phase transitions
      const daysInPhase = newState.day - product.phaseStartDay + (newState.month - 1) * 30;
      if (product.phase === 'lancement' && daysInPhase > 90) {
        product.phase = 'maturite';
        product.phaseStartDay = newState.day;
      } else if (product.phase === 'maturite' && daysInPhase > 360) {
        product.phase = 'declin';
        product.phaseStartDay = newState.day;
      }
    }
    return product;
  });

  // Add TVA on revenue
  company.tvaCollected += dailyRevenue * TAX_RATES.tva_standard;

  // Calculate daily expenses
  const dailySalaryCost = calculateTotalSalaryCosts(company.employees) / 30;
  const dailyOperatingCost = 500 + company.employees.length * 50; // Base + per employee
  const dailyMarketingCost = company.products.reduce((sum, p) => sum + p.marketingBudget / 30, 0);
  
  const dailyExpenses = dailySalaryCost + dailyOperatingCost + dailyMarketingCost;
  
  // Deduct TVA on expenses
  company.tvaDeductible += dailyExpenses * TAX_RATES.tva_standard * 0.8; // Not all expenses have TVA

  // Update treasury
  company.treasury += dailyRevenue - dailyExpenses;
  company.monthlyRevenue = (company.monthlyRevenue || 0) + dailyRevenue;
  company.monthlyExpenses = (company.monthlyExpenses || 0) + dailyExpenses;

  // Update employee moral and productivity
  company.employees = company.employees.map(emp => {
    let moralChange = 0;
    
    // Trait effects
    if (emp.trait === 'workaholic') {
      emp.productivity = Math.min(150, emp.productivity + 0.1);
    } else if (emp.trait === 'syndicaliste' && emp.moral < 50) {
      moralChange -= 2;
    }

    // General moral decay/recovery
    if (emp.moral < 50) {
      emp.productivity = Math.max(50, emp.productivity - 0.5);
    } else if (emp.moral > 80) {
      emp.productivity = Math.min(120, emp.productivity + 0.1);
    }

    emp.moral = Math.max(0, Math.min(100, emp.moral + moralChange));
    
    return emp;
  });

  // Check unpaid tax declarations - SIMPLIFIED SYSTEM
  // If taxes unpaid for more than 360 days (1 year), URSSAF takes 50% of treasury
  const currentGameDay = newState.day + (newState.month - 1) * 30 + (newState.year - 1) * 360;
  
  company.taxDeclarations = company.taxDeclarations.map(decl => {
    if (!decl.paid) {
      const daysSinceDue = currentGameDay - decl.dueDate;
      
      // Small penalty after due date (5% per month)
      if (daysSinceDue > 0 && daysSinceDue <= 360) {
        decl.penalty = Math.round(decl.amount * 0.05 * Math.ceil(daysSinceDue / 30));
      }
      
      // MASSIVE PENALTY: After 1 year of non-payment, URSSAF seizure!
      if (daysSinceDue > 360) {
        const seizure = company.treasury * 0.5;
        company.treasury -= seizure;
        company.credibility = Math.max(0, company.credibility - 30);
        // Mark as paid (forcefully) with the seizure
        decl.paid = true;
        decl.penalty = seizure;
        
        // Generate event for this
        newState.activeEvents = [...newState.activeEvents, {
          id: `urssaf_seizure_${Date.now()}`,
          title: "🚨 SAISIE URSSAF",
          description: `L'URSSAF a saisi 50% de votre trésorerie (${formatCurrency(seizure)}) pour non-paiement de ${decl.type.toUpperCase()} depuis plus d'un an.`,
          category: 'administratif' as const,
          severity: 'critical' as const,
          effects: { treasury: -seizure, credibility: -30 },
          day: newState.day,
        }];
      }
    }
    return decl;
  });

  // Check credibility game over - simplified
  if (company.credibility <= 0) {
    newState.gameOver = true;
    newState.gameOverReason = "Faillite : Votre crédibilité est tombée à zéro suite aux contrôles fiscaux.";
  }

  // Generate random event
  const newEvent = generateRandomEvent(newState.day, newState.economicWeather);
  if (newEvent) {
    newState.activeEvents = [...newState.activeEvents, newEvent];
    
    // Apply immediate effects
    if (newEvent.effects.treasury) company.treasury += newEvent.effects.treasury;
    if (newEvent.effects.credibility) company.credibility = Math.max(0, Math.min(100, company.credibility + newEvent.effects.credibility));
    if (newEvent.effects.moral) {
      company.employees = company.employees.map(e => ({
        ...e,
        moral: Math.max(0, Math.min(100, e.moral + (newEvent.effects.moral || 0))),
      }));
    }
  }

  // Reset monthly counters on new month
  if (newState.day === 1) {
    company.monthlyRevenue = 0;
    company.monthlyExpenses = 0;
  }

  newState.company = company;
  return newState;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

// Get credibility color class
export function getCredibilityColor(credibility: number): string {
  if (credibility >= 80) return 'text-success';
  if (credibility >= 50) return 'text-warning';
  return 'text-destructive';
}

// Get moral color class  
export function getMoralColor(moral: number): string {
  if (moral >= 70) return 'text-success';
  if (moral >= 40) return 'text-warning';
  return 'text-destructive';
}

// Save game to localStorage
export function saveGame(state: GameState): void {
  localStorage.setItem('simu_entrepreneur_save', JSON.stringify(state));
}

// Load game from localStorage
export function loadGame(): GameState | null {
  const saved = localStorage.getItem('simu_entrepreneur_save');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Migrate old saves: ensure company has all required fields
      if (parsed.company) {
        parsed.company = migrateCompany(parsed.company);
      }
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

// Migrate old company data to ensure all fields exist
function migrateCompany(company: Partial<Company>): Company {
  return {
    ...company,
    technologies: company.technologies ?? [],
    marketingCampaigns: company.marketingCampaigns ?? [],
    activeCrises: company.activeCrises ?? [],
    resolvedCrises: company.resolvedCrises ?? [],
    coins: company.coins ?? 100,
    gems: company.gems ?? 10,
    lastDailyReward: company.lastDailyReward ?? 0,
    dailyRewardStreak: company.dailyRewardStreak ?? 0,
    purchasedItems: company.purchasedItems ?? [],
    activeBoosts: company.activeBoosts ?? [],
    bankAccount: company.bankAccount ?? createInitialBankAccount(),
    properties: company.properties ?? [],
    suppliers: company.suppliers ?? [],
    inventory: company.inventory ?? [],
    clients: company.clients ?? [],
    invoices: company.invoices ?? [],
    legalCases: company.legalCases ?? [],
    lawyers: company.lawyers ?? [],
    intellectualProperty: company.intellectualProperty ?? [],
    socialBenefits: company.socialBenefits ?? [],
    unions: company.unions ?? [],
    foreignMarkets: company.foreignMarkets ?? [],
    subsidiaries: company.subsidiaries ?? [],
    achievements: company.achievements ?? [],
    missions: company.missions ?? [],
    competitors: company.competitors ?? [],
    marketShare: company.marketShare ?? 5,
    reputation: company.reputation ?? 50,
    innovationScore: company.innovationScore ?? 50,
    totalAssets: company.totalAssets ?? company.capital ?? 0,
    totalLiabilities: company.totalLiabilities ?? 0,
  } as Company;
}

// Create initial game state
export function createInitialState(): GameState {
  return {
    company: null,
    day: 1,
    month: 1,
    year: 1,
    isPaused: true,
    gameSpeed: 1,
    economicWeather: 'stable',
    events: [],
    activeEvents: [],
    gameOver: false,
    consecutiveNegativeMonths: 0,
    inflationRate: 0.02,
    interestRate: 0.04,
    exchangeRates: { EUR: 1, USD: 1.08, GBP: 0.86, CHF: 0.94, JPY: 160, CNY: 7.8 },
    marketTrends: { tech: 1.1, artisanat: 1.0, services: 1.0, industrie: 0.95 },
    globalEconomy: 100,
    tutorialCompleted: false,
    difficulty: 'normal',
    statistics: {
      totalRevenue: 0,
      totalExpenses: 0,
      totalTaxesPaid: 0,
      totalSalariesPaid: 0,
      employeesHired: 0,
      employeesFired: 0,
      productsLaunched: 0,
      contractsSigned: 0,
      lawsuitsWon: 0,
      lawsuitsLost: 0,
      loansRepaid: 0,
      investmentsReturned: 0,
      countriesExpanded: 0,
      achievementsUnlocked: 0,
    },
  };
}
