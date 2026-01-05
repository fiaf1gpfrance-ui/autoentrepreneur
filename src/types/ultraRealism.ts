// Types pour le système ultra-réaliste

export interface ExtendedCityData {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  
  // Données économiques détaillées
  economics: {
    gdpPerCapita: number; // PIB par habitant en USD
    gdpGrowth: number; // Croissance du PIB en %
    unemploymentRate: number; // Taux de chômage en %
    inflationRate: number; // Taux d'inflation en %
    costOfLivingIndex: number; // Indice coût de la vie (100 = moyenne mondiale)
    averageSalary: number; // Salaire moyen mensuel en USD
    minimumWage: number; // Salaire minimum en USD
    corporateTaxRate: number; // Taux d'imposition des sociétés en %
    incomeTaxRate: number; // Taux d'imposition sur le revenu max en %
    vatRate: number; // TVA en %
    corruptionIndex: number; // Indice de corruption (0-100, 100 = très corrompu)
    easeOfBusinessIndex: number; // Facilité de faire des affaires (1-190)
    economicFreedomIndex: number; // Liberté économique (0-100)
  };
  
  // Secteurs dominants
  sectors: {
    technology: number; // Score 0-100
    finance: number;
    manufacturing: number;
    healthcare: number;
    energy: number;
    tourism: number;
    agriculture: number;
    logistics: number;
    retail: number;
    realEstate: number;
  };
  
  // Infrastructures
  infrastructure: {
    internetSpeedMbps: number;
    airportConnectivity: number; // 0-100
    portAccess: boolean;
    railNetwork: number; // 0-100
    roadQuality: number; // 0-100
    powerReliability: number; // 0-100
  };
  
  // Main d'œuvre
  workforce: {
    educationLevel: number; // 0-100
    englishProficiency: number; // 0-100
    techTalentPool: number; // 0-100
    laborLaws: 'flexible' | 'moderate' | 'strict';
    unionStrength: number; // 0-100
  };
  
  // Qualité de vie
  qualityOfLife: {
    safetyIndex: number; // 0-100
    healthcareQuality: number; // 0-100
    pollutionIndex: number; // 0-100
    climateScore: number; // 0-100
  };
  
  // Bonus de gameplay
  bonuses: {
    productionMultiplier: number;
    salesMultiplier: number;
    rdMultiplier: number;
    recruitmentMultiplier: number;
    brandValueMultiplier: number;
  };
}

// Système IPO et Bourse
export interface IPOSystem {
  isPublic: boolean;
  ipoDate?: Date;
  stockSymbol?: string;
  sharePrice: number;
  totalShares: number;
  floatingShares: number; // Actions en circulation
  founderShares: number;
  marketCap: number;
  peRatio: number; // Price-to-Earnings
  dividendYield: number;
  
  // Historique du cours
  priceHistory: {
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  
  // Actionnaires
  shareholders: {
    name: string;
    type: 'founder' | 'institutional' | 'retail' | 'employee';
    shares: number;
    percentage: number;
    votingRights: number;
  }[];
  
  // Actions en cours
  pendingActions: {
    type: 'buyback' | 'split' | 'dividend' | 'offering';
    amount: number;
    status: 'pending' | 'approved' | 'executed';
    executionDate?: Date;
  }[];
  
  // Analystes
  analystRatings: {
    analyst: string;
    rating: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
    targetPrice: number;
    date: Date;
  }[];
}

// Système Dynastie et Héritage
export interface DynastySystem {
  generation: number;
  founder: FamilyMember;
  currentCEO: FamilyMember;
  familyTree: FamilyMember[];
  
  // Réputation familiale
  familyReputation: number; // 0-100
  dynastyAge: number; // En années de jeu
  
  // Succession
  succession: {
    heir?: FamilyMember;
    successionPlan: 'primogeniture' | 'merit' | 'election' | 'none';
    transitionProbability: number;
  };
  
  // Bonus héréditaires
  heritageBonus: {
    businessAcumen: number; // +% profit
    networkStrength: number; // +% négociations
    brandLegacy: number; // +% réputation
    familyFortune: number; // Capital initial héritiers
  };
  
  // Événements familiaux
  familyEvents: {
    type: 'birth' | 'death' | 'marriage' | 'divorce' | 'scandal' | 'achievement';
    member: string;
    date: Date;
    impact: number;
    description: string;
  }[];
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  deathDate?: Date;
  gender: 'male' | 'female';
  
  // Relations
  parentIds: string[];
  spouseId?: string;
  childrenIds: string[];
  
  // Compétences héritées
  skills: {
    leadership: number;
    finance: number;
    marketing: number;
    operations: number;
    innovation: number;
    diplomacy: number;
  };
  
  // Traits de personnalité
  traits: ('ambitious' | 'conservative' | 'innovative' | 'ruthless' | 'charitable' | 'reclusive' | 'charismatic' | 'analytical')[];
  
  // Rôle dans l'entreprise
  role?: 'CEO' | 'chairman' | 'director' | 'manager' | 'shareholder' | 'none';
  shareOwnership: number;
  
  // Santé et statut
  health: number; // 0-100
  happiness: number; // 0-100
  education: string;
}

// Système Fusions & Acquisitions
export interface MASystem {
  activeDeals: MADeal[];
  completedDeals: MADeal[];
  failedDeals: MADeal[];
  
  // Capacité M&A
  warChest: number; // Trésorerie disponible pour acquisitions
  creditLine: number; // Ligne de crédit disponible
  maxDealSize: number;
  
  // Réputation M&A
  dealmakerReputation: number; // 0-100
  hostileTakeoverCapability: number; // 0-100
}

export interface MADeal {
  id: string;
  type: 'acquisition' | 'merger' | 'hostile_takeover' | 'spinoff' | 'divestiture';
  status: 'prospecting' | 'due_diligence' | 'negotiation' | 'regulatory' | 'closing' | 'completed' | 'failed';
  
  // Cible
  target: {
    name: string;
    industry: string;
    revenue: number;
    employees: number;
    valuation: number;
    headquarters: string;
  };
  
  // Termes du deal
  terms: {
    offerPrice: number;
    paymentStructure: {
      cash: number;
      stock: number;
      debt: number;
    };
    earnout?: number;
    retentionBonus?: number;
  };
  
  // Due Diligence
  dueDiligence: {
    financialScore: number;
    legalScore: number;
    operationalScore: number;
    culturalFit: number;
    synergiesPotential: number;
    risksIdentified: string[];
  };
  
  // Timeline
  timeline: {
    startDate: Date;
    expectedClose: Date;
    actualClose?: Date;
    milestones: {
      name: string;
      date: Date;
      completed: boolean;
    }[];
  };
  
  // Parties prenantes
  advisors: {
    investmentBank?: string;
    lawFirm?: string;
    accountingFirm?: string;
  };
}

// Système Lobbying et Politique
export interface LobbyingSystem {
  politicalCapital: number; // 0-100
  lobbyingBudget: number;
  
  // Relations politiques
  politicalRelations: PoliticalRelation[];
  
  // Campagnes de lobbying actives
  activeCampaigns: LobbyCampaign[];
  
  // Lois influencées
  influencedLaws: {
    lawName: string;
    impact: 'positive' | 'negative' | 'blocked';
    industryAffected: string;
    taxImpact: number;
    regulationChange: string;
  }[];
  
  // Risques
  corruptionRisk: number; // 0-100
  publicScrutiny: number; // 0-100
  investigationRisk: number; // 0-100
}

export interface PoliticalRelation {
  id: string;
  name: string;
  position: string;
  party: string;
  influence: number; // 0-100
  relationship: number; // -100 à 100
  corruptible: boolean;
  
  // Coût de maintenance
  maintenanceCost: number;
  lastContact: Date;
  
  // Faveurs
  favorsOwed: number;
  favorsGiven: number;
}

export interface LobbyCampaign {
  id: string;
  name: string;
  objective: 'tax_reduction' | 'deregulation' | 'subsidies' | 'trade_barriers' | 'environmental_exemption' | 'labor_laws';
  
  status: 'planning' | 'active' | 'successful' | 'failed';
  
  // Ressources
  budget: number;
  spent: number;
  duration: number; // En mois
  
  // Progrès
  progress: number; // 0-100
  publicSupport: number; // 0-100
  politicalSupport: number; // 0-100
  
  // Impact si succès
  potentialImpact: {
    taxSavings: number;
    regulatoryRelief: number;
    competitiveAdvantage: number;
  };
  
  // Risques
  exposureRisk: number;
  backlashPotential: number;
}

// Événements géopolitiques
export interface GeopoliticalEvent {
  id: string;
  type: 'war' | 'sanctions' | 'trade_war' | 'coup' | 'election' | 'natural_disaster' | 'pandemic' | 'currency_crisis';
  name: string;
  description: string;
  affectedCountries: string[];
  
  startDate: Date;
  endDate?: Date;
  
  // Impacts
  economicImpact: {
    gdpChange: number;
    inflationChange: number;
    currencyChange: number;
    tradeDisruption: number;
  };
  
  // Impacts sur le jeu
  gameplayImpact: {
    supplyChainDisruption: number;
    marketAccessChange: number;
    operatingCostChange: number;
    reputationImpact: number;
  };
}
