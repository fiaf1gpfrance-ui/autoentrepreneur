// Product Factory - Helper to create products with all required fields
import { Product } from '@/types/game';

export function createProduct(
  name: string,
  day: number,
  overrides?: Partial<Product>
): Product {
  return {
    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    phase: 'rd',
    rdCost: 10000,
    rdProgress: 0,
    basePrice: 150,
    currentPrice: 150,
    quality: 40 + Math.floor(Math.random() * 30),
    marketingBudget: 0,
    salesVolume: 50 + Math.floor(Math.random() * 100),
    phaseStartDay: day,
    patents: [],
    costOfGoods: 50,
    margin: 0.4,
    targetMarket: 'B2B',
    certifications: [],
    exportEnabled: false,
    competitorPriceIndex: 1.0,
    ...overrides,
  };
}
