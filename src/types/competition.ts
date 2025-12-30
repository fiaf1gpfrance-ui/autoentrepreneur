// Types for competition and market dynamics

import { Sector } from './game';

export interface CompetitorAI {
  id: string;
  name: string;
  logo: string;
  sector: Sector;
  size: CompetitorSize;
  marketShare: number;
  reputation: number;
  aggressiveness: number; // 1-100
  innovation: number; // 1-100
  financialHealth: number; // 1-100
  strategy: CompetitorStrategy;
  products: CompetitorProductInfo[];
  employees: number;
  headquarters: string;
  founded: number;
  lastActions: CompetitorAction[];
  relationship: CompetitorRelationship;
}

export type CompetitorSize = 'startup' | 'pme' | 'eti' | 'grande_entreprise' | 'multinationale';

export type CompetitorStrategy = 'low_cost' | 'premium' | 'innovation' | 'diversification' | 'niche' | 'aggressive';

export interface CompetitorProductInfo {
  name: string;
  category: string;
  price: number;
  quality: number;
  marketShare: number;
  launchDate: number;
}

export interface CompetitorAction {
  id: string;
  type: CompetitorActionType;
  description: string;
  date: number;
  impact: CompetitorActionImpact;
}

export type CompetitorActionType = 
  | 'price_war' 
  | 'new_product' 
  | 'marketing_blitz' 
  | 'acquisition' 
  | 'partnership' 
  | 'expansion' 
  | 'layoffs'
  | 'innovation'
  | 'scandal'
  | 'award';

export interface CompetitorActionImpact {
  playerMarketShare?: number;
  playerReputation?: number;
  playerRevenue?: number;
  marketPrices?: number;
}

export type CompetitorRelationship = 'hostile' | 'competitive' | 'neutral' | 'cordial' | 'partnership';

// Espionage system
export interface EspionageAction {
  id: string;
  type: EspionageType;
  name: string;
  description: string;
  cost: number;
  riskLevel: number; // 1-5
  duration: number; // days
  successRate: number; // percentage
  infoGained: string[];
}

export type EspionageType = 
  | 'market_research' 
  | 'competitive_analysis' 
  | 'price_intelligence' 
  | 'talent_scouting' 
  | 'technology_assessment'
  | 'financial_analysis'
  | 'insider_info';

export const ESPIONAGE_ACTIONS: EspionageAction[] = [
  {
    id: 'market_research',
    type: 'market_research',
    name: 'Étude de Marché',
    description: 'Analyse légale du marché et des tendances',
    cost: 5000,
    riskLevel: 1,
    duration: 7,
    successRate: 95,
    infoGained: ['Parts de marché', 'Tendances', 'Prix moyens'],
  },
  {
    id: 'competitive_analysis',
    type: 'competitive_analysis',
    name: 'Analyse Concurrentielle',
    description: 'Étude approfondie d\'un concurrent spécifique',
    cost: 15000,
    riskLevel: 2,
    duration: 14,
    successRate: 85,
    infoGained: ['Stratégie', 'Forces/Faiblesses', 'Produits en dev'],
  },
  {
    id: 'price_intelligence',
    type: 'price_intelligence',
    name: 'Veille Tarifaire',
    description: 'Surveillance des prix concurrents',
    cost: 3000,
    riskLevel: 1,
    duration: 3,
    successRate: 98,
    infoGained: ['Grille tarifaire', 'Promos', 'Évolution des prix'],
  },
  {
    id: 'talent_scouting',
    type: 'talent_scouting',
    name: 'Chasse de Talents',
    description: 'Identifier les meilleurs employés chez les concurrents',
    cost: 10000,
    riskLevel: 3,
    duration: 21,
    successRate: 70,
    infoGained: ['Talents clés', 'Salaires', 'Insatisfactions'],
  },
  {
    id: 'technology_assessment',
    type: 'technology_assessment',
    name: 'Évaluation Technologique',
    description: 'Analyser les technologies utilisées',
    cost: 25000,
    riskLevel: 3,
    duration: 30,
    successRate: 60,
    infoGained: ['Stack technique', 'Brevets', 'R&D en cours'],
  },
  {
    id: 'financial_analysis',
    type: 'financial_analysis',
    name: 'Analyse Financière',
    description: 'Évaluer la santé financière d\'un concurrent',
    cost: 20000,
    riskLevel: 2,
    duration: 14,
    successRate: 75,
    infoGained: ['CA estimé', 'Rentabilité', 'Investissements'],
  },
  {
    id: 'insider_info',
    type: 'insider_info',
    name: 'Information Privilégiée',
    description: '⚠️ Méthode risquée pour obtenir des infos confidentielles',
    cost: 50000,
    riskLevel: 5,
    duration: 45,
    successRate: 40,
    infoGained: ['Plans stratégiques', 'Contrats majeurs', 'Acquisitions prévues'],
  },
];

export interface MarketIntelligence {
  competitorId: string;
  gatheredInfo: GatheredInfo[];
  lastUpdated: number;
}

export interface GatheredInfo {
  type: string;
  data: any;
  accuracy: number;
  date: number;
  source: EspionageType;
}

// Pre-defined competitor templates
export const COMPETITOR_TEMPLATES: Omit<CompetitorAI, 'id' | 'lastActions' | 'relationship'>[] = [
  {
    name: 'TechVision SA',
    logo: '🔷',
    sector: 'tech',
    size: 'eti',
    marketShare: 25,
    reputation: 75,
    aggressiveness: 70,
    innovation: 85,
    financialHealth: 80,
    strategy: 'innovation',
    products: [
      { name: 'CloudSuite Pro', category: 'SaaS', price: 499, quality: 85, marketShare: 15, launchDate: 1 },
      { name: 'DataAnalyzer', category: 'Analytics', price: 299, quality: 80, marketShare: 10, launchDate: 100 },
    ],
    employees: 250,
    headquarters: 'Paris',
    founded: 2015,
  },
  {
    name: 'Budget Solutions',
    logo: '💰',
    sector: 'services',
    size: 'pme',
    marketShare: 15,
    reputation: 55,
    aggressiveness: 90,
    innovation: 30,
    financialHealth: 60,
    strategy: 'low_cost',
    products: [
      { name: 'BasicPack', category: 'Services', price: 99, quality: 50, marketShare: 15, launchDate: 1 },
    ],
    employees: 45,
    headquarters: 'Lyon',
    founded: 2018,
  },
  {
    name: 'Excellence Group',
    logo: '👑',
    sector: 'services',
    size: 'grande_entreprise',
    marketShare: 35,
    reputation: 90,
    aggressiveness: 40,
    innovation: 60,
    financialHealth: 95,
    strategy: 'premium',
    products: [
      { name: 'Premium Service', category: 'Consulting', price: 2500, quality: 95, marketShare: 20, launchDate: 1 },
      { name: 'Elite Support', category: 'Support', price: 1500, quality: 92, marketShare: 15, launchDate: 50 },
    ],
    employees: 1200,
    headquarters: 'Paris',
    founded: 2005,
  },
  {
    name: 'StartupRapide',
    logo: '⚡',
    sector: 'tech',
    size: 'startup',
    marketShare: 5,
    reputation: 45,
    aggressiveness: 95,
    innovation: 90,
    financialHealth: 40,
    strategy: 'aggressive',
    products: [
      { name: 'DisruptApp', category: 'Mobile', price: 49, quality: 70, marketShare: 5, launchDate: 1 },
    ],
    employees: 12,
    headquarters: 'Bordeaux',
    founded: 2022,
  },
  {
    name: 'Artisan Plus',
    logo: '🔨',
    sector: 'artisanat',
    size: 'pme',
    marketShare: 20,
    reputation: 80,
    aggressiveness: 25,
    innovation: 40,
    financialHealth: 75,
    strategy: 'niche',
    products: [
      { name: 'Fait Main Premium', category: 'Artisanat', price: 350, quality: 90, marketShare: 20, launchDate: 1 },
    ],
    employees: 35,
    headquarters: 'Toulouse',
    founded: 2010,
  },
  {
    name: 'IndustriMax',
    logo: '🏭',
    sector: 'industrie',
    size: 'eti',
    marketShare: 30,
    reputation: 70,
    aggressiveness: 55,
    innovation: 50,
    financialHealth: 85,
    strategy: 'diversification',
    products: [
      { name: 'Composant A', category: 'Industrie', price: 150, quality: 75, marketShare: 15, launchDate: 1 },
      { name: 'Machine Pro', category: 'Équipement', price: 15000, quality: 80, marketShare: 15, launchDate: 1 },
    ],
    employees: 500,
    headquarters: 'Lille',
    founded: 1995,
  },
];

export interface MarketEvent {
  id: string;
  type: MarketEventType;
  title: string;
  description: string;
  effects: {
    marketSize?: number;
    priceLevel?: number;
    demandGrowth?: number;
    entryBarrier?: number;
  };
  duration: number;
  affectedSectors: Sector[];
  date: number;
}

export type MarketEventType = 
  | 'boom' 
  | 'recession' 
  | 'regulation' 
  | 'technology_shift' 
  | 'global_crisis' 
  | 'opportunity'
  | 'disruption';
