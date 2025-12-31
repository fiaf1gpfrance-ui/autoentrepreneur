// Company Factory - Helper to create companies with all required fields
import { Company, LegalStatus, Sector } from '@/types/game';
import { createInitialBankAccount } from './bankingEngine';
import { initializeAchievements } from './achievementEngine';
import { createProduct } from './productFactory';

export function createCompany(
  name: string,
  legalStatus: LegalStatus,
  sector: Sector,
  capital: number,
  day: number
): Company {
  return {
    name,
    legalStatus,
    sector,
    capital,
    treasury: capital,
    credibility: 70,
    employees: [],
    products: [createProduct('Produit Initial', day)],
    taxDeclarations: [],
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    tvaCollected: 0,
    tvaDeductible: 0,
    urssafDebt: 0,
    isDebt: 0,
    financialHistory: [],
    bankAccount: createInitialBankAccount(),
    properties: [],
    suppliers: [],
    inventory: [],
    clients: [],
    invoices: [],
    legalCases: [],
    lawyers: [],
    intellectualProperty: [],
    socialBenefits: [],
    unions: [],
    foreignMarkets: [],
    subsidiaries: [],
    achievements: initializeAchievements(),
    missions: [],
    competitors: [],
    foundedDate: day,
    ceo: 'Vous',
    marketShare: 5,
    reputation: 50,
    innovationScore: 50,
    totalAssets: capital,
    totalLiabilities: 0,
    // New fields
    marketingCampaigns: [],
    technologies: initializeTechnologies(),
    activeCrises: [],
    resolvedCrises: [],
    // Currency system
    coins: 100,
    gems: 10,
    lastDailyReward: 0,
    dailyRewardStreak: 0,
    purchasedItems: [],
    activeBoosts: [],
    // Sales Pipeline
    salesPipeline: {
      leads: [],
      deals: [],
      conversionRates: {
        prospecting: 0,
        qualification: 0,
        needs_analysis: 0,
        proposal: 0,
        negotiation: 0,
        closing: 0,
        won: 0,
        lost: 0,
      },
      averageDealValue: 0,
      averageSalesCycle: 30,
      winRate: 0,
    },
    customerFeedback: [],
  };
}

// Initialize technologies with default state
function initializeTechnologies() {
  return [
    { id: 'auto_basic', name: 'Automatisation Basique', category: 'automation', description: 'Scripts pour tâches répétitives', cost: 5000, researchTime: 2, productivity: 5, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'auto_workflow', name: 'Workflows Automatisés', category: 'automation', description: 'Automatisation des processus', cost: 15000, researchTime: 4, productivity: 10, unlocked: false, researching: false, progress: 0, prerequisites: ['auto_basic'] },
    { id: 'ai_analytics', name: 'Analytics IA', category: 'ai', description: 'Analyse prédictive', cost: 20000, researchTime: 4, productivity: 8, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'ai_ml', name: 'Machine Learning', category: 'ai', description: 'Algorithmes d\'apprentissage', cost: 75000, researchTime: 8, productivity: 20, unlocked: false, researching: false, progress: 0, prerequisites: ['ai_analytics'] },
    { id: 'sec_firewall', name: 'Firewall Avancé', category: 'security', description: 'Protection réseau renforcée', cost: 10000, researchTime: 2, productivity: 0, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'sec_encryption', name: 'Chiffrement', category: 'security', description: 'Chiffrement des données', cost: 20000, researchTime: 3, productivity: 0, unlocked: false, researching: false, progress: 0, prerequisites: ['sec_firewall'] },
    { id: 'cloud_basic', name: 'Cloud Basique', category: 'cloud', description: 'Migration cloud initiale', cost: 15000, researchTime: 3, productivity: 8, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'cloud_hybrid', name: 'Cloud Hybride', category: 'cloud', description: 'Infrastructure hybride', cost: 50000, researchTime: 6, productivity: 15, unlocked: false, researching: false, progress: 0, prerequisites: ['cloud_basic'] },
    { id: 'data_warehouse', name: 'Data Warehouse', category: 'data', description: 'Entrepôt de données', cost: 40000, researchTime: 5, productivity: 12, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'data_bi', name: 'BI Avancé', category: 'data', description: 'Business Intelligence', cost: 30000, researchTime: 4, productivity: 10, unlocked: false, researching: false, progress: 0, prerequisites: ['data_warehouse'] },
    { id: 'mobile_app', name: 'Application Mobile', category: 'mobile', description: 'App mobile native', cost: 50000, researchTime: 6, productivity: 15, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'mobile_pwa', name: 'PWA', category: 'mobile', description: 'Progressive Web App', cost: 25000, researchTime: 4, productivity: 10, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'iot_sensors', name: 'Capteurs IoT', category: 'iot', description: 'Réseau de capteurs', cost: 30000, researchTime: 4, productivity: 10, unlocked: false, researching: false, progress: 0, prerequisites: [] },
    { id: 'bc_basic', name: 'Blockchain Basique', category: 'blockchain', description: 'Intégration blockchain', cost: 40000, researchTime: 5, productivity: 5, unlocked: false, researching: false, progress: 0, prerequisites: [] },
  ];
}
