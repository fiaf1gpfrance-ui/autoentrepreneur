// Company Factory - Helper to create companies with all required fields
import { Company, LegalStatus, Sector } from '@/types/game';
import { createInitialBankAccount } from './bankingEngine';
import { initializeAchievements } from './competitionEngine';
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
  };
}
