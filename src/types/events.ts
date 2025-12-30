// Types for rich events and opportunities system

import { EventCategory, Sector } from './game';

export interface RichEvent {
  id: string;
  type: RichEventType;
  category: EventCategory;
  title: string;
  description: string;
  detailedDescription?: string;
  severity: 'positive' | 'neutral' | 'negative' | 'critical';
  icon: string;
  image?: string;
  
  // Timing
  day: number;
  expiresAt?: number;
  duration?: number;
  
  // Conditions
  requirements?: EventRequirement[];
  sectorRelevance?: Sector[];
  minCompanySize?: number;
  
  // Effects
  immediateEffects?: EventEffects;
  ongoingEffects?: EventEffects;
  
  // Choices
  choices?: EventChoice[];
  
  // Tracking
  acknowledged: boolean;
  choiceMade?: string;
  outcome?: string;
}

export type RichEventType = 
  | 'news'           // Economic/market news
  | 'opportunity'    // Business opportunity
  | 'crisis'         // Company crisis
  | 'regulatory'     // Legal/regulatory
  | 'internal'       // Employee/internal affairs
  | 'competitor'     // Competition related
  | 'market'         // Market changes
  | 'technology'     // Tech developments
  | 'social'         // Social/PR events
  | 'random'         // Random events
  | 'seasonal'       // Seasonal events
  | 'milestone';     // Company milestones

export interface EventRequirement {
  type: 'treasury' | 'employees' | 'revenue' | 'reputation' | 'credibility' | 'marketShare' | 'technology';
  operator: '>' | '<' | '>=' | '<=' | '==';
  value: number;
}

export interface EventEffects {
  treasury?: number;
  revenue?: number; // percentage modifier
  expenses?: number; // percentage modifier
  reputation?: number;
  credibility?: number;
  moralAll?: number;
  productivity?: number;
  marketShare?: number;
  clientSatisfaction?: number;
}

export interface EventChoice {
  id: string;
  label: string;
  description: string;
  icon?: string;
  
  // Requirements to unlock this choice
  requirements?: {
    treasury?: number;
    credibility?: number;
    technology?: string;
    employees?: number;
  };
  
  // Effects of this choice
  effects: EventEffects;
  
  // Risk factor (0-1, determines variance in outcomes)
  riskFactor?: number;
  
  // Possible follow-up event
  followUpEvent?: string;
}

// Rich event templates for generation
export const EVENT_TEMPLATES: Omit<RichEvent, 'id' | 'day' | 'acknowledged'>[] = [
  // === OPPORTUNITIES ===
  {
    type: 'opportunity',
    category: 'marche',
    title: 'Appel d\'offres majeur',
    description: 'Un grand compte lance un appel d\'offres dans votre secteur.',
    detailedDescription: 'Une entreprise du CAC40 recherche un nouveau fournisseur. C\'est l\'occasion de décrocher un contrat qui pourrait transformer votre entreprise.',
    severity: 'positive',
    icon: '📋',
    choices: [
      {
        id: 'full_response',
        label: 'Réponse complète',
        description: 'Investir massivement pour une proposition parfaite',
        requirements: { treasury: 50000, employees: 10 },
        effects: { treasury: -50000, revenue: 30, reputation: 15 },
        riskFactor: 0.3,
      },
      {
        id: 'standard_response',
        label: 'Réponse standard',
        description: 'Proposer une offre correcte sans surinvestir',
        requirements: { treasury: 10000 },
        effects: { treasury: -10000, revenue: 15, reputation: 5 },
        riskFactor: 0.5,
      },
      {
        id: 'ignore',
        label: 'Passer son tour',
        description: 'Ce n\'est pas le bon moment',
        effects: { reputation: -5 },
      },
    ],
  },
  {
    type: 'opportunity',
    category: 'marche',
    title: 'Partenariat stratégique',
    description: 'Une entreprise complémentaire propose un partenariat.',
    severity: 'positive',
    icon: '🤝',
    choices: [
      {
        id: 'accept_exclusive',
        label: 'Partenariat exclusif',
        description: 'Engagement fort avec contrepartie',
        effects: { revenue: 20, reputation: 10, marketShare: 5 },
      },
      {
        id: 'accept_flexible',
        label: 'Partenariat flexible',
        description: 'Collaboration sans exclusivité',
        effects: { revenue: 10, reputation: 5 },
      },
      {
        id: 'decline',
        label: 'Décliner poliment',
        description: 'Préserver son indépendance',
        effects: {},
      },
    ],
  },
  
  // === CRISES ===
  {
    type: 'crisis',
    category: 'interne',
    title: 'Conflit social majeur',
    description: 'Vos employés menacent de faire grève suite à des revendications salariales.',
    severity: 'critical',
    icon: '✊',
    immediateEffects: { productivity: -20, moralAll: -15 },
    choices: [
      {
        id: 'negotiate',
        label: 'Négocier',
        description: 'Ouvrir le dialogue et faire des concessions',
        requirements: { treasury: 30000 },
        effects: { treasury: -30000, moralAll: 20, productivity: 10 },
      },
      {
        id: 'stand_firm',
        label: 'Rester ferme',
        description: 'Refuser les demandes et maintenir le cap',
        effects: { moralAll: -25, reputation: -10 },
        riskFactor: 0.6,
      },
      {
        id: 'partial_concession',
        label: 'Concession partielle',
        description: 'Accepter certaines demandes seulement',
        requirements: { treasury: 15000 },
        effects: { treasury: -15000, moralAll: 5 },
      },
    ],
  },
  {
    type: 'crisis',
    category: 'marche',
    title: 'Bad buzz viral',
    description: 'Une vidéo critique sur votre entreprise devient virale sur les réseaux sociaux.',
    severity: 'critical',
    icon: '📱',
    immediateEffects: { reputation: -20, revenue: -10 },
    choices: [
      {
        id: 'crisis_com',
        label: 'Gestion de crise',
        description: 'Engager une agence de communication de crise',
        requirements: { treasury: 25000 },
        effects: { treasury: -25000, reputation: 10, revenue: 5 },
      },
      {
        id: 'apologize',
        label: 'S\'excuser publiquement',
        description: 'Reconnaître les erreurs et s\'excuser',
        effects: { reputation: -5, credibility: 5 },
      },
      {
        id: 'ignore',
        label: 'Ignorer et attendre',
        description: 'Espérer que ça passe',
        effects: { reputation: -10 },
        riskFactor: 0.7,
      },
    ],
  },
  
  // === REGULATORY ===
  {
    type: 'regulatory',
    category: 'administratif',
    title: 'Nouvelle réglementation RGPD',
    description: 'De nouvelles exigences RGPD entrent en vigueur.',
    severity: 'neutral',
    icon: '📜',
    immediateEffects: { expenses: 5 },
    choices: [
      {
        id: 'full_compliance',
        label: 'Mise en conformité complète',
        description: 'Investir pour une conformité parfaite',
        requirements: { treasury: 20000 },
        effects: { treasury: -20000, credibility: 10, reputation: 5 },
      },
      {
        id: 'minimal_compliance',
        label: 'Conformité minimale',
        description: 'Faire le strict minimum',
        requirements: { treasury: 5000 },
        effects: { treasury: -5000, credibility: -5 },
        riskFactor: 0.4,
      },
    ],
  },
  
  // === NEWS ===
  {
    type: 'news',
    category: 'economique',
    title: 'Baisse des taux directeurs',
    description: 'La BCE annonce une baisse des taux d\'intérêt.',
    severity: 'positive',
    icon: '📊',
    immediateEffects: { expenses: -5 },
  },
  {
    type: 'news',
    category: 'economique',
    title: 'Inflation en hausse',
    description: 'L\'inflation atteint un nouveau record.',
    severity: 'negative',
    icon: '📈',
    immediateEffects: { expenses: 10 },
  },
  
  // === INTERNAL ===
  {
    type: 'internal',
    category: 'interne',
    title: 'Innovation employé',
    description: 'Un employé propose une idée brillante pour améliorer un produit.',
    severity: 'positive',
    icon: '💡',
    choices: [
      {
        id: 'implement',
        label: 'Implémenter l\'idée',
        description: 'Investir pour développer cette innovation',
        requirements: { treasury: 15000 },
        effects: { treasury: -15000, productivity: 10, moralAll: 15 },
      },
      {
        id: 'reward_only',
        label: 'Récompenser seulement',
        description: 'Donner une prime sans implémenter',
        requirements: { treasury: 2000 },
        effects: { treasury: -2000, moralAll: 5 },
      },
      {
        id: 'ignore',
        label: 'Ignorer',
        description: 'Passer à autre chose',
        effects: { moralAll: -10 },
      },
    ],
  },
  
  // === SEASONAL ===
  {
    type: 'seasonal',
    category: 'marche',
    title: 'Fêtes de fin d\'année',
    description: 'La période des fêtes approche, les ventes augmentent traditionnellement.',
    severity: 'positive',
    icon: '🎄',
    immediateEffects: { revenue: 20 },
    duration: 30,
  },
  {
    type: 'seasonal',
    category: 'interne',
    title: 'Période estivale',
    description: 'C\'est l\'été, les employés partent en vacances.',
    severity: 'neutral',
    icon: '☀️',
    immediateEffects: { productivity: -15, moralAll: 10 },
    duration: 60,
  },
  
  // === TECHNOLOGY ===
  {
    type: 'technology',
    category: 'marche',
    title: 'Nouvelle technologie disruptive',
    description: 'Une nouvelle technologie menace de bouleverser votre secteur.',
    severity: 'negative',
    icon: '🤖',
    choices: [
      {
        id: 'adopt',
        label: 'Adopter rapidement',
        description: 'Investir massivement pour ne pas être dépassé',
        requirements: { treasury: 100000 },
        effects: { treasury: -100000, productivity: 25, reputation: 15 },
      },
      {
        id: 'wait',
        label: 'Attendre et voir',
        description: 'Observer comment le marché évolue',
        effects: { marketShare: -5 },
      },
    ],
  },
  
  // === MILESTONES ===
  {
    type: 'milestone',
    category: 'marche',
    title: 'Premier million de CA',
    description: 'Félicitations ! Votre entreprise a dépassé le million d\'euros de chiffre d\'affaires !',
    severity: 'positive',
    icon: '🏆',
    requirements: [{ type: 'revenue', operator: '>=', value: 1000000 }],
    immediateEffects: { reputation: 20, credibility: 10, moralAll: 15 },
  },
  {
    type: 'milestone',
    category: 'interne',
    title: '50 employés',
    description: 'Votre entreprise compte maintenant 50 employés !',
    severity: 'positive',
    icon: '👥',
    requirements: [{ type: 'employees', operator: '>=', value: 50 }],
    immediateEffects: { reputation: 15, moralAll: 10 },
  },
];

// Economic news that affects the game world
export interface EconomicNews {
  id: string;
  headline: string;
  source: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  affectedSectors: Sector[];
  marketImpact: number; // -100 to +100
  date: number;
  duration: number;
}

export const ECONOMIC_NEWS_TEMPLATES: Omit<EconomicNews, 'id' | 'date'>[] = [
  { headline: 'La croissance française dépasse les attentes', source: 'Les Échos', content: 'L\'INSEE annonce une croissance de 2.1% au dernier trimestre.', sentiment: 'bullish', affectedSectors: ['tech', 'services', 'industrie', 'artisanat'], marketImpact: 15, duration: 30 },
  { headline: 'Tensions géopolitiques : les marchés inquiets', source: 'Le Monde', content: 'Les tensions internationales pèsent sur la confiance des investisseurs.', sentiment: 'bearish', affectedSectors: ['tech', 'industrie'], marketImpact: -20, duration: 45 },
  { headline: 'Le secteur tech français en plein boom', source: 'La Tribune', content: 'Les startups françaises attirent des investissements records.', sentiment: 'bullish', affectedSectors: ['tech'], marketImpact: 25, duration: 60 },
  { headline: 'Inflation : la BCE maintient ses taux', source: 'Challenges', content: 'La BCE décide de ne pas modifier ses taux directeurs malgré l\'inflation.', sentiment: 'neutral', affectedSectors: ['tech', 'services', 'industrie', 'artisanat'], marketImpact: 0, duration: 30 },
  { headline: 'Pénurie de composants : l\'industrie sous pression', source: 'L\'Usine Nouvelle', content: 'La pénurie mondiale de semi-conducteurs impacte la production.', sentiment: 'bearish', affectedSectors: ['tech', 'industrie'], marketImpact: -15, duration: 90 },
  { headline: 'Le Made in France séduit de plus en plus', source: 'Le Figaro', content: 'Les consommateurs privilégient les produits français.', sentiment: 'bullish', affectedSectors: ['artisanat', 'industrie'], marketImpact: 10, duration: 60 },
];
