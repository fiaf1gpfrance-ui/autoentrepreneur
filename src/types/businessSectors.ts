// ===== TYPES DES 26 SECTEURS D'ACTIVITÉ =====

// Catégories principales
export type SectorCategory = 'industrie' | 'tech' | 'services' | 'commerce';

// Les 26 secteurs d'activité
export type BusinessSector = 
  // Industrie lourde (6 secteurs)
  | 'automobile'
  | 'aeronautique'
  | 'siderurgie'
  | 'chimie'
  | 'energie'
  | 'construction'
  // Tech & Digital (7 secteurs)
  | 'software'
  | 'intelligence_artificielle'
  | 'cloud_computing'
  | 'cybersecurite'
  | 'fintech'
  | 'gaming'
  | 'biotech'
  // Services (7 secteurs)
  | 'conseil'
  | 'banque'
  | 'assurance'
  | 'immobilier'
  | 'juridique'
  | 'sante'
  | 'transport'
  // Commerce & Retail (6 secteurs)
  | 'grande_distribution'
  | 'ecommerce'
  | 'luxe'
  | 'restauration'
  | 'mode'
  | 'medias';

// Profil d'employé spécifique au secteur
export interface SectorJobProfile {
  id: string;
  title: string;
  category: 'production' | 'commercial' | 'technique' | 'management' | 'support';
  baseSalary: number;
  seniorityMultiplier: number; // 1.0 à 2.5
  skillsRequired: string[];
  rarenessIndex: number; // 1-100, plus c'est élevé plus c'est rare
  productivityImpact: number;
}

// Chaîne de production spécifique au secteur
export interface SectorProductionChain {
  id: string;
  name: string;
  stages: ProductionStage[];
  totalDurationDays: number;
  resourcesRequired: ResourceRequirement[];
  qualityCertifications: string[];
}

export interface ProductionStage {
  id: string;
  name: string;
  durationDays: number;
  cost: number;
  workersNeeded: number;
  skillsNeeded: string[];
  qualityCheckRequired: boolean;
}

export interface ResourceRequirement {
  resourceId: string;
  resourceName: string;
  quantity: number;
  unitCost: number;
  volatility: number; // 0-1, fluctuation des prix
  leadTimeDays: number;
  supplierRegions: string[];
}

// Arbre technologique spécifique au secteur
export interface SectorTechTree {
  id: string;
  name: string;
  branches: TechBranch[];
  maxLevel: number;
}

export interface TechBranch {
  id: string;
  name: string;
  description: string;
  nodes: TechNode[];
}

export interface TechNode {
  id: string;
  name: string;
  description: string;
  level: number;
  cost: number;
  researchTimeMonths: number;
  prerequisites: string[];
  effects: TechEffect[];
  isPatentable: boolean;
  patentValue?: number;
  patentDurationYears?: number;
}

export interface TechEffect {
  type: 'production' | 'quality' | 'cost' | 'speed' | 'innovation' | 'reputation' | 'revenue';
  value: number;
  isPercentage: boolean;
  description: string;
}

// Finances spécifiques au secteur
export interface SectorFinancials {
  typicalMargins: {
    gross: { min: number; max: number; average: number };
    operating: { min: number; max: number; average: number };
    net: { min: number; max: number; average: number };
  };
  costStructure: {
    rawMaterials: number; // % du CA
    labor: number;
    rd: number;
    marketing: number;
    overhead: number;
    depreciation: number;
  };
  capitalIntensity: 'low' | 'medium' | 'high' | 'very_high';
  breakEvenTimeline: string;
  typicalValuationMultiples: {
    revenueMultiple: { min: number; max: number };
    ebitdaMultiple: { min: number; max: number };
  };
  fundingSources: FundingSource[];
  economicCycleSensitivity: 'defensive' | 'neutral' | 'cyclical' | 'highly_cyclical';
}

export interface FundingSource {
  type: 'bank_loan' | 'venture_capital' | 'private_equity' | 'bonds' | 'ipo' | 'government_grants' | 'crowdfunding';
  availability: number; // 0-100
  typicalAmount: { min: number; max: number };
  interestRate?: number;
  equityDilution?: number;
  requirements: string[];
}

// Réglementations spécifiques au secteur
export interface SectorRegulations {
  licenses: License[];
  environmentalNorms: EnvironmentalNorm[];
  qualityStandards: QualityStandard[];
  entryBarriers: EntryBarrier[];
  laborRegulations: LaborRegulation[];
}

export interface License {
  id: string;
  name: string;
  description: string;
  cost: number;
  renewalCost: number;
  renewalPeriodMonths: number;
  processingTimeMonths: number;
  requirements: string[];
  penalty: number; // Amende si absent
  isMandatory: boolean;
}

export interface EnvironmentalNorm {
  id: string;
  name: string;
  description: string;
  complianceCost: number;
  annualCost: number;
  carbonTaxRate?: number;
  emissionLimits?: Record<string, number>;
  penalty: number;
  reputationImpact: number;
}

export interface QualityStandard {
  id: string;
  name: string;
  description: string;
  certificationBody: string;
  implementationCost: number;
  auditCost: number;
  auditFrequencyMonths: number;
  requirements: string[];
  marketAccessRequired: boolean; // Obligatoire pour vendre sur certains marchés
}

export interface EntryBarrier {
  type: 'capital' | 'technology' | 'regulatory' | 'expertise' | 'network';
  level: 'low' | 'medium' | 'high' | 'extreme';
  description: string;
  minimumRequirement: number | string;
}

export interface LaborRegulation {
  id: string;
  name: string;
  description: string;
  workerProtectionLevel: 'low' | 'moderate' | 'high';
  unionPresence: number; // 0-100
  strikeRisk: number; // 0-100
  minimumWageMultiplier: number;
  mandatoryBenefits: string[];
}

// Événements spécifiques au secteur
export interface SectorEvent {
  id: string;
  name: string;
  description: string;
  type: 'crisis' | 'opportunity' | 'regulatory' | 'technological' | 'market' | 'scandal';
  probability: number; // 0-1 probabilité annuelle
  severity: 'minor' | 'moderate' | 'major' | 'catastrophic';
  effects: EventEffect[];
  duration: {
    min: number; // en jours
    max: number;
  };
  responses: EventResponse[];
}

export interface EventEffect {
  target: 'revenue' | 'costs' | 'reputation' | 'stock_price' | 'employee_morale' | 'production' | 'demand';
  modifier: number; // % de changement
  duration: number; // en jours
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  cost: number;
  successProbability: number;
  effects: EventEffect[];
  requirements: string[];
}

// Configuration complète d'un secteur
export interface SectorConfig {
  id: BusinessSector;
  category: SectorCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  
  // Mécaniques de gameplay
  jobProfiles: SectorJobProfile[];
  productionChains: SectorProductionChain[];
  techTree: SectorTechTree;
  financials: SectorFinancials;
  regulations: SectorRegulations;
  events: SectorEvent[];
  
  // Modificateurs de base
  baseModifiers: {
    startingCapitalRequired: number;
    revenueGrowthPotential: number; // % annuel max
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    innovationSpeed: number; // 1-10
    globalMarketAccess: number; // 0-100
    seasonality: number; // 0-1, 0 = pas saisonnier
  };
  
  // Synergies avec d'autres secteurs
  synergies: {
    sectorId: BusinessSector;
    type: 'complementary' | 'vertical_integration' | 'diversification';
    bonusMultiplier: number;
  }[];
  
  // Concurrents types
  competitorProfiles: {
    type: 'startup' | 'sme' | 'corporation' | 'multinational';
    marketShare: number;
    aggressiveness: number;
  }[];
}
