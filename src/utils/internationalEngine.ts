// International Expansion Engine
import {
  ForeignMarket,
  Subsidiary,
  Currency,
  COUNTRIES,
  Company,
  Sector,
} from '@/types/game';

const generateId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== EXCHANGE RATES ====================

export function generateExchangeRates(): Record<Currency, number> {
  // Base rates with small random variations
  return {
    EUR: 1,
    USD: 1.08 + (Math.random() - 0.5) * 0.1,
    GBP: 0.86 + (Math.random() - 0.5) * 0.05,
    CHF: 0.94 + (Math.random() - 0.5) * 0.05,
    JPY: 160 + (Math.random() - 0.5) * 10,
    CNY: 7.8 + (Math.random() - 0.5) * 0.5,
  };
}

export function updateExchangeRates(
  current: Record<Currency, number>,
  economicWeather: string
): Record<Currency, number> {
  const volatility = economicWeather === 'crise' ? 0.03 : 
                     economicWeather === 'recession' ? 0.02 : 0.01;

  const updated: Record<Currency, number> = { ...current };
  
  for (const currency of Object.keys(updated) as Currency[]) {
    if (currency === 'EUR') continue;
    
    const change = (Math.random() - 0.5) * volatility * 2;
    updated[currency] = Math.max(0.01, updated[currency] * (1 + change));
  }

  return updated;
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<Currency, number>
): number {
  if (from === to) return amount;
  
  // Convert to EUR first, then to target
  const inEur = amount / rates[from];
  return Math.round(inEur * rates[to] * 100) / 100;
}

// ==================== FOREIGN MARKETS ====================

export function getAvailableMarkets(
  company: Company,
  sector: Sector
): ForeignMarket[] {
  return Object.entries(COUNTRIES).map(([id, country]) => {
    // Calculate market potential based on sector
    let marketPotential = country.marketSize;
    if (sector === 'tech') marketPotential *= 1.3;
    else if (sector === 'industrie') marketPotential *= 1.1;
    else if (sector === 'artisanat') marketPotential *= 0.7;

    // Adjust entry barrier based on company size
    let adjustedBarrier = country.entryBarrier;
    if (company.employees.length > 50) adjustedBarrier -= 10;
    if (company.reputation > 70) adjustedBarrier -= 10;

    return {
      id,
      country: country.name,
      currency: country.currency,
      exchangeRate: country.exchangeRate,
      marketSize: Math.round(marketPotential),
      penetration: 0,
      entryBarrier: Math.max(10, adjustedBarrier),
      customsDuty: country.customsDuty,
      taxRate: country.taxRate,
      hasSubsidiary: false,
      revenue: 0,
    };
  });
}

export function enterMarket(
  market: ForeignMarket,
  strategy: 'export' | 'partnership' | 'subsidiary',
  investment: number,
  company: Company
): { success: boolean; market: ForeignMarket; cost: number; event: string } {
  const baseCost = {
    export: 10000,
    partnership: 30000,
    subsidiary: 100000,
  }[strategy];

  const totalCost = baseCost + investment;

  // Success chance based on investment and company factors
  const investmentFactor = Math.min(investment / 50000, 1) * 30;
  const reputationFactor = company.reputation / 5;
  const credibilityFactor = company.credibility / 5;
  
  const successChance = 30 + investmentFactor + reputationFactor + credibilityFactor - market.entryBarrier / 2;
  
  const success = Math.random() * 100 < successChance;

  if (success) {
    const initialPenetration = strategy === 'export' ? 1 : strategy === 'partnership' ? 3 : 5;
    
    return {
      success: true,
      market: {
        ...market,
        penetration: initialPenetration,
        hasSubsidiary: strategy === 'subsidiary',
        localPartner: strategy === 'partnership' ? `Partner ${market.country}` : undefined,
      },
      cost: totalCost,
      event: `✅ Entrée réussie sur le marché ${market.country} (stratégie: ${strategy})`,
    };
  }

  return {
    success: false,
    market,
    cost: totalCost * 0.3, // Partial cost for failed attempt
    event: `❌ Échec de l'entrée sur le marché ${market.country}. Barrières trop élevées.`,
  };
}

export function calculateMarketRevenue(
  market: ForeignMarket,
  products: { quality: number; price: number; exportEnabled: boolean }[],
  exchangeRates: Record<Currency, number>
): number {
  const exportProducts = products.filter(p => p.exportEnabled);
  if (exportProducts.length === 0) return 0;

  // Base revenue from market size and penetration
  const baseRevenue = market.marketSize * market.penetration * 10;

  // Quality and price modifiers
  const avgQuality = exportProducts.reduce((sum, p) => sum + p.quality, 0) / exportProducts.length;
  const qualityMod = avgQuality / 100;

  // Customs duty reduction
  const afterDuty = baseRevenue * (1 - market.customsDuty);

  // Convert to EUR
  const inEur = convertCurrency(afterDuty, market.currency, 'EUR', exchangeRates);

  return Math.round(inEur * qualityMod);
}

export function growMarketPenetration(
  market: ForeignMarket,
  marketingInvestment: number,
  productQuality: number
): ForeignMarket {
  // Growth rate based on investment and quality
  const investmentEffect = Math.log10(marketingInvestment + 1) / 10;
  const qualityEffect = productQuality / 200;
  
  const growth = investmentEffect + qualityEffect;
  const maxPenetration = market.hasSubsidiary ? 30 : market.localPartner ? 15 : 8;

  return {
    ...market,
    penetration: Math.min(maxPenetration, market.penetration + growth),
  };
}

// ==================== SUBSIDIARIES ====================

export function createSubsidiary(
  market: ForeignMarket,
  initialCapital: number,
  managerName?: string
): Subsidiary {
  return {
    id: generateId('sub'),
    name: `Filiale ${market.country}`,
    country: market.country,
    employees: 0,
    treasury: initialCapital,
    revenue: 0,
    expenses: 0,
    managerId: undefined,
  };
}

export function processSubsidiaryMonth(
  subsidiary: Subsidiary,
  parentInvestment: number,
  economicWeather: string
): { subsidiary: Subsidiary; dividends: number; events: string[] } {
  const events: string[] = [];
  const updated = { ...subsidiary };

  // Operating costs
  const operatingCosts = 5000 + subsidiary.employees * 3000;
  updated.expenses = operatingCosts;

  // Revenue based on local economy
  const weatherMultiplier = {
    croissance: 1.3,
    stable: 1.0,
    recession: 0.7,
    crise: 0.4,
  }[economicWeather] || 1;

  const potentialRevenue = subsidiary.employees * 8000 * weatherMultiplier;
  updated.revenue = Math.round(potentialRevenue + parentInvestment * 0.5);

  // Net result
  const netResult = updated.revenue - updated.expenses;
  updated.treasury += netResult;

  // Dividends if profitable
  let dividends = 0;
  if (netResult > 0 && updated.treasury > 50000) {
    dividends = Math.round(netResult * 0.3); // 30% dividend
    updated.treasury -= dividends;
    events.push(`Dividendes reçus de ${subsidiary.name}: ${dividends}€`);
  }

  // Growth
  if (netResult > 10000 && Math.random() < 0.2) {
    updated.employees += 1;
    events.push(`Nouvelle embauche chez ${subsidiary.name}`);
  }

  // Problems
  if (updated.treasury < 0) {
    events.push(`⚠️ ${subsidiary.name} en difficulté financière!`);
  }

  return { subsidiary: updated, dividends, events };
}

// ==================== MONTHLY PROCESSING ====================

export function processMonthlyInternational(
  company: Company,
  currentDay: number,
  economicWeather: string
): {
  company: Company;
  internationalRevenue: number;
  internationalCosts: number;
  events: string[];
} {
  const events: string[] = [];
  let internationalRevenue = 0;
  let internationalCosts = 0;

  const updatedCompany = { ...company };

  // Update exchange rates
  const gameState = { exchangeRates: updatedCompany.foreignMarkets.length > 0 ? 
    generateExchangeRates() : {} as Record<Currency, number> };

  // Process each foreign market
  updatedCompany.foreignMarkets = company.foreignMarkets.map(market => {
    if (market.penetration === 0) return market;

    // Calculate revenue
    const exportProducts = company.products.filter(p => p.exportEnabled);
    const revenue = calculateMarketRevenue(
      market,
      exportProducts.map(p => ({ quality: p.quality, price: p.currentPrice, exportEnabled: true })),
      gameState.exchangeRates
    );
    
    internationalRevenue += revenue;

    // Marketing costs for maintaining presence
    const marketingCost = Math.round(revenue * 0.1);
    internationalCosts += marketingCost;

    return {
      ...market,
      revenue,
    };
  });

  // Process subsidiaries
  updatedCompany.subsidiaries = company.subsidiaries.map(subsidiary => {
    const result = processSubsidiaryMonth(subsidiary, 0, economicWeather);
    internationalRevenue += result.dividends;
    events.push(...result.events);
    return result.subsidiary;
  });

  // Random international events
  if (company.foreignMarkets.some(m => m.penetration > 0)) {
    if (Math.random() < 0.05) {
      const randomMarket = company.foreignMarkets.filter(m => m.penetration > 0)[0];
      if (randomMarket) {
        events.push(`Changement réglementaire en ${randomMarket.country} - Adaptations requises`);
      }
    }
  }

  return {
    company: updatedCompany,
    internationalRevenue,
    internationalCosts,
    events,
  };
}

// ==================== HELPERS ====================

export function formatCurrencyWithSymbol(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    EUR: '€',
    USD: '$',
    GBP: '£',
    CHF: 'CHF',
    JPY: '¥',
    CNY: '¥',
  };

  return `${amount.toLocaleString('fr-FR')} ${symbols[currency]}`;
}

export function calculateTotalInternationalAssets(company: Company): number {
  const marketValue = company.foreignMarkets.reduce(
    (sum, m) => sum + m.penetration * m.marketSize * 100,
    0
  );
  
  const subsidiaryValue = company.subsidiaries.reduce(
    (sum, s) => sum + s.treasury + s.employees * 20000,
    0
  );

  return marketValue + subsidiaryValue;
}
