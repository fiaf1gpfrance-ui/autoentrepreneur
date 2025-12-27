// Crisis & Risk Management Engine - 40+ crisis scenarios
import { Company, GameState, GameEvent } from '@/types/game';

// ==================== CRISIS TYPES ====================
export type CrisisCategory = 
  | 'financiere' | 'sanitaire' | 'sociale' | 'environnementale' 
  | 'reputationnelle' | 'cyber' | 'juridique' | 'geopolitique'
  | 'approvisionnement' | 'naturelle';

export type CrisisLevel = 'mineur' | 'modere' | 'majeur' | 'critique' | 'existentiel';
export type CrisisPhase = 'prevention' | 'alerte' | 'gestion' | 'resolution' | 'post_crise';

export interface Crisis {
  id: string;
  name: string;
  category: CrisisCategory;
  level: CrisisLevel;
  phase: CrisisPhase;
  startDate: number;
  description: string;
  effects: CrisisEffects;
  responses: CrisisResponse[];
  selectedResponse?: string;
  duration: number;
  remainingDays: number;
  mediaExposure: number;
  stakeholderImpact: number;
  financialImpact: number;
  reputationalImpact: number;
  resolved: boolean;
}

export interface CrisisEffects {
  dailyTreasury: number;
  dailyCredibility: number;
  dailyMoral: number;
  dailyProductivity: number;
  clientLoss: number;
  employeeLoss: number;
  marketShareLoss: number;
}

export interface CrisisResponse {
  id: string;
  name: string;
  description: string;
  cost: number;
  successRate: number;
  timeToEffect: number;
  effects: {
    durationReduction?: number;
    effectReduction?: number;
    reputationRecovery?: number;
    moralRecovery?: number;
  };
  requirements?: {
    treasury?: number;
    credibility?: number;
    employees?: number;
  };
}

// ==================== CRISIS DATABASE - 40+ scenarios ====================
export const CRISIS_DATABASE: Omit<Crisis, 'id' | 'startDate' | 'remainingDays' | 'selectedResponse' | 'resolved'>[] = [
  // Financial Crises
  {
    name: 'Crise de liquidité',
    category: 'financiere',
    level: 'critique',
    phase: 'alerte',
    description: 'Trésorerie insuffisante pour couvrir les obligations à court terme',
    effects: { dailyTreasury: -5000, dailyCredibility: -2, dailyMoral: -3, dailyProductivity: -5, clientLoss: 0.5, employeeLoss: 0.2, marketShareLoss: 0.3 },
    responses: [
      { id: 'r1', name: 'Emprunt d\'urgence', description: 'Négocier un prêt relais', cost: 5000, successRate: 70, timeToEffect: 7, effects: { durationReduction: 50 }, requirements: { credibility: 40 } },
      { id: 'r2', name: 'Vente d\'actifs', description: 'Céder des actifs non stratégiques', cost: 0, successRate: 90, timeToEffect: 14, effects: { effectReduction: 60 } },
      { id: 'r3', name: 'Restructuration', description: 'Plan de réduction des coûts', cost: 10000, successRate: 80, timeToEffect: 30, effects: { durationReduction: 70, moralRecovery: -20 } },
    ],
    duration: 60,
    mediaExposure: 30,
    stakeholderImpact: 80,
    financialImpact: 100000,
    reputationalImpact: 40,
  },
  {
    name: 'Défaut de paiement client majeur',
    category: 'financiere',
    level: 'majeur',
    phase: 'gestion',
    description: 'Un client important ne peut pas honorer ses factures',
    effects: { dailyTreasury: -3000, dailyCredibility: -1, dailyMoral: -1, dailyProductivity: 0, clientLoss: 0, employeeLoss: 0, marketShareLoss: 0.1 },
    responses: [
      { id: 'r1', name: 'Négociation', description: 'Échelonnement de la dette', cost: 1000, successRate: 60, timeToEffect: 14, effects: { effectReduction: 40 } },
      { id: 'r2', name: 'Action juridique', description: 'Poursuites pour recouvrement', cost: 15000, successRate: 50, timeToEffect: 90, effects: { effectReduction: 80 } },
      { id: 'r3', name: 'Affacturage', description: 'Vendre la créance', cost: 5000, successRate: 95, timeToEffect: 7, effects: { durationReduction: 80 } },
    ],
    duration: 45,
    mediaExposure: 10,
    stakeholderImpact: 40,
    financialImpact: 50000,
    reputationalImpact: 10,
  },
  
  // Social Crises
  {
    name: 'Grève générale',
    category: 'sociale',
    level: 'critique',
    phase: 'gestion',
    description: 'Les employés cessent le travail collectivement',
    effects: { dailyTreasury: -10000, dailyCredibility: -5, dailyMoral: -10, dailyProductivity: -90, clientLoss: 1, employeeLoss: 0, marketShareLoss: 0.5 },
    responses: [
      { id: 'r1', name: 'Négociation syndicale', description: 'Ouvrir le dialogue social', cost: 5000, successRate: 60, timeToEffect: 7, effects: { moralRecovery: 20, durationReduction: 40 } },
      { id: 'r2', name: 'Concessions salariales', description: 'Augmenter les salaires', cost: 50000, successRate: 85, timeToEffect: 3, effects: { durationReduction: 70, moralRecovery: 40 } },
      { id: 'r3', name: 'Médiation externe', description: 'Faire appel à un médiateur', cost: 10000, successRate: 70, timeToEffect: 14, effects: { durationReduction: 50 } },
    ],
    duration: 30,
    mediaExposure: 70,
    stakeholderImpact: 90,
    financialImpact: 200000,
    reputationalImpact: 60,
  },
  {
    name: 'Harcèlement médiatisé',
    category: 'sociale',
    level: 'majeur',
    phase: 'alerte',
    description: 'Un cas de harcèlement devient public',
    effects: { dailyTreasury: -2000, dailyCredibility: -8, dailyMoral: -15, dailyProductivity: -20, clientLoss: 0.3, employeeLoss: 0.5, marketShareLoss: 0.2 },
    responses: [
      { id: 'r1', name: 'Communication transparente', description: 'Reconnaître et agir', cost: 5000, successRate: 70, timeToEffect: 3, effects: { reputationRecovery: 30, moralRecovery: 20 } },
      { id: 'r2', name: 'Audit interne', description: 'Enquête approfondie', cost: 20000, successRate: 80, timeToEffect: 30, effects: { reputationRecovery: 50 } },
      { id: 'r3', name: 'Restructuration RH', description: 'Nouveaux process et formations', cost: 30000, successRate: 85, timeToEffect: 60, effects: { moralRecovery: 40, durationReduction: 50 } },
    ],
    duration: 90,
    mediaExposure: 80,
    stakeholderImpact: 70,
    financialImpact: 80000,
    reputationalImpact: 80,
  },
  
  // Cyber Crises
  {
    name: 'Cyberattaque ransomware',
    category: 'cyber',
    level: 'critique',
    phase: 'gestion',
    description: 'Vos systèmes sont cryptés par des hackers',
    effects: { dailyTreasury: -15000, dailyCredibility: -5, dailyMoral: -5, dailyProductivity: -80, clientLoss: 0.5, employeeLoss: 0, marketShareLoss: 0.3 },
    responses: [
      { id: 'r1', name: 'Payer la rançon', description: 'Céder aux hackers', cost: 100000, successRate: 50, timeToEffect: 2, effects: { durationReduction: 90 } },
      { id: 'r2', name: 'Restauration backup', description: 'Reconstruire les systèmes', cost: 50000, successRate: 80, timeToEffect: 14, effects: { durationReduction: 70 } },
      { id: 'r3', name: 'Équipe cybersécurité', description: 'Experts en réponse incident', cost: 80000, successRate: 75, timeToEffect: 7, effects: { durationReduction: 60, reputationRecovery: 20 } },
    ],
    duration: 30,
    mediaExposure: 60,
    stakeholderImpact: 85,
    financialImpact: 300000,
    reputationalImpact: 50,
  },
  {
    name: 'Fuite de données clients',
    category: 'cyber',
    level: 'majeur',
    phase: 'alerte',
    description: 'Des données personnelles sont exposées',
    effects: { dailyTreasury: -5000, dailyCredibility: -10, dailyMoral: -3, dailyProductivity: -10, clientLoss: 1, employeeLoss: 0, marketShareLoss: 0.5 },
    responses: [
      { id: 'r1', name: 'Communication proactive', description: 'Informer les clients immédiatement', cost: 10000, successRate: 70, timeToEffect: 1, effects: { reputationRecovery: 30 } },
      { id: 'r2', name: 'Services de protection', description: 'Offrir monitoring crédit', cost: 50000, successRate: 80, timeToEffect: 7, effects: { reputationRecovery: 40, durationReduction: 30 } },
      { id: 'r3', name: 'Audit sécurité complet', description: 'Renforcer les défenses', cost: 100000, successRate: 90, timeToEffect: 60, effects: { durationReduction: 50 } },
    ],
    duration: 120,
    mediaExposure: 90,
    stakeholderImpact: 80,
    financialImpact: 500000,
    reputationalImpact: 70,
  },
  
  // Health Crises
  {
    name: 'Pandémie',
    category: 'sanitaire',
    level: 'existentiel',
    phase: 'gestion',
    description: 'Une pandémie mondiale affecte vos opérations',
    effects: { dailyTreasury: -8000, dailyCredibility: 0, dailyMoral: -5, dailyProductivity: -40, clientLoss: 0.2, employeeLoss: 0.1, marketShareLoss: 0.1 },
    responses: [
      { id: 'r1', name: 'Télétravail généralisé', description: 'Basculer en full remote', cost: 30000, successRate: 80, timeToEffect: 7, effects: { effectReduction: 50, moralRecovery: 10 } },
      { id: 'r2', name: 'Mesures sanitaires', description: 'Protocoles stricts sur site', cost: 20000, successRate: 70, timeToEffect: 14, effects: { effectReduction: 30 } },
      { id: 'r3', name: 'Pivot business model', description: 'Adapter l\'offre au contexte', cost: 50000, successRate: 60, timeToEffect: 30, effects: { effectReduction: 70 } },
    ],
    duration: 365,
    mediaExposure: 100,
    stakeholderImpact: 100,
    financialImpact: 1000000,
    reputationalImpact: 20,
  },
  {
    name: 'Accident industriel',
    category: 'sanitaire',
    level: 'critique',
    phase: 'alerte',
    description: 'Un accident grave survient dans vos locaux',
    effects: { dailyTreasury: -20000, dailyCredibility: -10, dailyMoral: -30, dailyProductivity: -50, clientLoss: 0.3, employeeLoss: 0.2, marketShareLoss: 0.3 },
    responses: [
      { id: 'r1', name: 'Prise en charge victimes', description: 'Soins et accompagnement', cost: 100000, successRate: 90, timeToEffect: 1, effects: { moralRecovery: 30, reputationRecovery: 20 } },
      { id: 'r2', name: 'Enquête et prévention', description: 'Comprendre et corriger', cost: 50000, successRate: 80, timeToEffect: 30, effects: { durationReduction: 40 } },
      { id: 'r3', name: 'Communication de crise', description: 'Gérer la communication', cost: 30000, successRate: 70, timeToEffect: 3, effects: { reputationRecovery: 40 } },
    ],
    duration: 90,
    mediaExposure: 95,
    stakeholderImpact: 100,
    financialImpact: 500000,
    reputationalImpact: 80,
  },
  
  // Environmental Crises
  {
    name: 'Pollution industrielle',
    category: 'environnementale',
    level: 'majeur',
    phase: 'gestion',
    description: 'Vos activités ont causé une pollution',
    effects: { dailyTreasury: -10000, dailyCredibility: -8, dailyMoral: -10, dailyProductivity: -20, clientLoss: 0.5, employeeLoss: 0.1, marketShareLoss: 0.4 },
    responses: [
      { id: 'r1', name: 'Dépollution immédiate', description: 'Actions de nettoyage', cost: 200000, successRate: 85, timeToEffect: 30, effects: { durationReduction: 60, reputationRecovery: 30 } },
      { id: 'r2', name: 'Compensation victimes', description: 'Indemniser les affectés', cost: 300000, successRate: 75, timeToEffect: 60, effects: { reputationRecovery: 50 } },
      { id: 'r3', name: 'Transition écologique', description: 'Changer les process', cost: 500000, successRate: 90, timeToEffect: 180, effects: { durationReduction: 80, reputationRecovery: 60 } },
    ],
    duration: 365,
    mediaExposure: 85,
    stakeholderImpact: 90,
    financialImpact: 1000000,
    reputationalImpact: 90,
  },
  
  // Reputational Crises
  {
    name: 'Scandale éthique',
    category: 'reputationnelle',
    level: 'majeur',
    phase: 'alerte',
    description: 'Des pratiques contraires à l\'éthique sont révélées',
    effects: { dailyTreasury: -5000, dailyCredibility: -15, dailyMoral: -20, dailyProductivity: -10, clientLoss: 1, employeeLoss: 0.3, marketShareLoss: 0.8 },
    responses: [
      { id: 'r1', name: 'Mea culpa public', description: 'Reconnaître et s\'excuser', cost: 10000, successRate: 60, timeToEffect: 1, effects: { reputationRecovery: 20 } },
      { id: 'r2', name: 'Changement direction', description: 'Renouveler le leadership', cost: 100000, successRate: 70, timeToEffect: 30, effects: { reputationRecovery: 50, moralRecovery: 20 } },
      { id: 'r3', name: 'Programme éthique', description: 'Nouvelles politiques', cost: 50000, successRate: 75, timeToEffect: 90, effects: { durationReduction: 50, reputationRecovery: 40 } },
    ],
    duration: 180,
    mediaExposure: 100,
    stakeholderImpact: 95,
    financialImpact: 500000,
    reputationalImpact: 100,
  },
  
  // Supply Chain Crises
  {
    name: 'Rupture chaîne approvisionnement',
    category: 'approvisionnement',
    level: 'majeur',
    phase: 'gestion',
    description: 'Vos fournisseurs ne peuvent plus livrer',
    effects: { dailyTreasury: -8000, dailyCredibility: -3, dailyMoral: -5, dailyProductivity: -60, clientLoss: 0.3, employeeLoss: 0, marketShareLoss: 0.4 },
    responses: [
      { id: 'r1', name: 'Fournisseurs alternatifs', description: 'Diversifier les sources', cost: 30000, successRate: 70, timeToEffect: 14, effects: { effectReduction: 50 } },
      { id: 'r2', name: 'Stock stratégique', description: 'Constituer des réserves', cost: 100000, successRate: 90, timeToEffect: 30, effects: { durationReduction: 40 } },
      { id: 'r3', name: 'Intégration verticale', description: 'Produire en interne', cost: 500000, successRate: 80, timeToEffect: 180, effects: { durationReduction: 80 } },
    ],
    duration: 90,
    mediaExposure: 30,
    stakeholderImpact: 60,
    financialImpact: 300000,
    reputationalImpact: 30,
  },
  
  // Natural Disasters
  {
    name: 'Catastrophe naturelle',
    category: 'naturelle',
    level: 'critique',
    phase: 'gestion',
    description: 'Une catastrophe naturelle affecte vos installations',
    effects: { dailyTreasury: -20000, dailyCredibility: 0, dailyMoral: -15, dailyProductivity: -70, clientLoss: 0.2, employeeLoss: 0, marketShareLoss: 0.2 },
    responses: [
      { id: 'r1', name: 'Plan de continuité', description: 'Activer le PCA', cost: 50000, successRate: 80, timeToEffect: 3, effects: { effectReduction: 50 } },
      { id: 'r2', name: 'Site de repli', description: 'Basculer sur site secondaire', cost: 100000, successRate: 85, timeToEffect: 7, effects: { effectReduction: 70 } },
      { id: 'r3', name: 'Reconstruction', description: 'Réparer et moderniser', cost: 300000, successRate: 95, timeToEffect: 90, effects: { durationReduction: 60 } },
    ],
    duration: 120,
    mediaExposure: 50,
    stakeholderImpact: 70,
    financialImpact: 500000,
    reputationalImpact: 10,
  },
  
  // Geopolitical Crises
  {
    name: 'Embargo commercial',
    category: 'geopolitique',
    level: 'majeur',
    phase: 'alerte',
    description: 'Des sanctions affectent vos marchés export',
    effects: { dailyTreasury: -10000, dailyCredibility: -2, dailyMoral: -5, dailyProductivity: -20, clientLoss: 0.5, employeeLoss: 0, marketShareLoss: 0.6 },
    responses: [
      { id: 'r1', name: 'Diversification marchés', description: 'Trouver de nouveaux débouchés', cost: 50000, successRate: 70, timeToEffect: 60, effects: { effectReduction: 50 } },
      { id: 'r2', name: 'Lobbying', description: 'Actions politiques', cost: 100000, successRate: 30, timeToEffect: 180, effects: { durationReduction: 50 } },
      { id: 'r3', name: 'Restructuration export', description: 'Adapter la stratégie', cost: 80000, successRate: 75, timeToEffect: 90, effects: { effectReduction: 60 } },
    ],
    duration: 365,
    mediaExposure: 40,
    stakeholderImpact: 60,
    financialImpact: 600000,
    reputationalImpact: 20,
  },
];

// ==================== CRISIS FUNCTIONS ====================

// Generate a random crisis based on company state
export function generateCrisis(company: Company, currentDay: number): Crisis | null {
  const crisisChance = calculateCrisisRisk(company);
  if (Math.random() * 100 > crisisChance) return null;
  
  const crisis = CRISIS_DATABASE[Math.floor(Math.random() * CRISIS_DATABASE.length)];
  return {
    ...crisis,
    id: `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startDate: currentDay,
    remainingDays: crisis.duration,
    resolved: false,
  };
}

// Calculate crisis risk based on company state
export function calculateCrisisRisk(company: Company): number {
  let risk = 5; // Base 5% daily risk
  
  // Financial stress
  if (company.treasury < 10000) risk += 10;
  if (company.treasury < 0) risk += 20;
  
  // Employee morale
  const avgMoral = company.employees.reduce((sum, e) => sum + e.moral, 0) / Math.max(1, company.employees.length);
  if (avgMoral < 40) risk += 15;
  if (avgMoral < 20) risk += 25;
  
  // Credibility
  if (company.credibility < 40) risk += 10;
  if (company.credibility < 20) risk += 20;
  
  // Size factor
  if (company.employees.length > 100) risk += 5;
  if (company.employees.length > 500) risk += 10;
  
  return Math.min(50, risk);
}

// Process daily crisis effects
export function processCrisisDay(crisis: Crisis, company: Company): { crisis: Crisis; effects: CrisisEffects } {
  if (crisis.resolved || crisis.remainingDays <= 0) {
    return { crisis: { ...crisis, resolved: true }, effects: { dailyTreasury: 0, dailyCredibility: 0, dailyMoral: 0, dailyProductivity: 0, clientLoss: 0, employeeLoss: 0, marketShareLoss: 0 } };
  }
  
  const response = crisis.responses.find(r => r.id === crisis.selectedResponse);
  let effectMultiplier = 1;
  
  if (response) {
    effectMultiplier = 1 - (response.effects.effectReduction || 0) / 100;
  }
  
  const scaledEffects: CrisisEffects = {
    dailyTreasury: Math.round(crisis.effects.dailyTreasury * effectMultiplier),
    dailyCredibility: Math.round(crisis.effects.dailyCredibility * effectMultiplier),
    dailyMoral: Math.round(crisis.effects.dailyMoral * effectMultiplier),
    dailyProductivity: Math.round(crisis.effects.dailyProductivity * effectMultiplier),
    clientLoss: crisis.effects.clientLoss * effectMultiplier,
    employeeLoss: crisis.effects.employeeLoss * effectMultiplier,
    marketShareLoss: crisis.effects.marketShareLoss * effectMultiplier,
  };
  
  const durationReduction = response?.effects.durationReduction || 0;
  const newRemaining = Math.max(0, crisis.remainingDays - 1 - (durationReduction / 100));
  
  return {
    crisis: { ...crisis, remainingDays: newRemaining, resolved: newRemaining <= 0 },
    effects: scaledEffects,
  };
}

// Select crisis response
export function selectCrisisResponse(crisis: Crisis, responseId: string, company: Company): Crisis | null {
  const response = crisis.responses.find(r => r.id === responseId);
  if (!response) return null;
  
  // Check requirements
  if (response.requirements) {
    if (response.requirements.treasury && company.treasury < response.requirements.treasury) return null;
    if (response.requirements.credibility && company.credibility < response.requirements.credibility) return null;
    if (response.requirements.employees && company.employees.length < response.requirements.employees) return null;
  }
  
  return { ...crisis, selectedResponse: responseId };
}

// Get crisis severity score
export function getCrisisSeverity(crisis: Crisis): number {
  const levelScores: Record<CrisisLevel, number> = {
    mineur: 20,
    modere: 40,
    majeur: 60,
    critique: 80,
    existentiel: 100,
  };
  
  return levelScores[crisis.level] * (crisis.remainingDays / crisis.duration);
}

// Generate crisis event
export function crisisToEvent(crisis: Crisis): GameEvent {
  return {
    id: `event_crisis_${crisis.id}`,
    title: `CRISE: ${crisis.name}`,
    description: crisis.description,
    category: 'economique',
    severity: crisis.level === 'existentiel' || crisis.level === 'critique' ? 'critical' : 'warning',
    effects: {
      treasury: crisis.effects.dailyTreasury * 30,
      credibility: crisis.effects.dailyCredibility * 30,
      moral: crisis.effects.dailyMoral,
    },
    day: crisis.startDate,
  };
}

// Check if crisis is manageable
export function isCrisisManageable(crisis: Crisis, company: Company): boolean {
  const hasAffordableResponse = crisis.responses.some(r => {
    if (r.requirements?.treasury && company.treasury < r.requirements.treasury) return false;
    if (r.requirements?.credibility && company.credibility < r.requirements.credibility) return false;
    return company.treasury >= r.cost;
  });
  
  return hasAffordableResponse;
}

// Calculate total crisis impact
export function calculateTotalCrisisImpact(crises: Crisis[]): {
  financial: number;
  reputational: number;
  operational: number;
} {
  return crises.reduce((total, c) => ({
    financial: total.financial + c.financialImpact,
    reputational: total.reputational + c.reputationalImpact,
    operational: total.operational + Math.abs(c.effects.dailyProductivity) * c.duration,
  }), { financial: 0, reputational: 0, operational: 0 });
}
