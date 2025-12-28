// ============================================
// ADVANCED INTERNATIONAL ENGINE - 100+ Features
// ============================================

import { 
  CountryAnalysis, 
  MarketEntry, 
  LocalPartner, 
  RegulatoryApproval, 
  CustomsDuty,
  CurrencyExposure,
  TransferPricing,
  GlobalTaxStructure,
  ExpatriatePackage,
  CrossBorderProject,
  EntryMilestone,
  MarketEntryMode,
} from '@/types/advancedFeatures';

// ==================== COUNTRY ANALYSIS (Features 1-20) ====================
export function analyzeCountry(countryCode: string): CountryAnalysis {
  const countryData: Record<string, Partial<CountryAnalysis>> = {
    USA: { gdp: 25000, gdpGrowth: 2.5, inflation: 3.2, population: 330, marketSize: 95, competitorCount: 50, entryBarrier: 4, politicalRisk: 2, economicRisk: 2, legalRisk: 2, culturalDistance: 3 },
    CHN: { gdp: 18000, gdpGrowth: 5.2, inflation: 2.1, population: 1400, marketSize: 90, competitorCount: 100, entryBarrier: 8, politicalRisk: 5, economicRisk: 4, legalRisk: 6, culturalDistance: 8 },
    DEU: { gdp: 4200, gdpGrowth: 1.5, inflation: 2.8, population: 83, marketSize: 80, competitorCount: 30, entryBarrier: 5, politicalRisk: 1, economicRisk: 2, legalRisk: 2, culturalDistance: 4 },
    JPN: { gdp: 4900, gdpGrowth: 1.2, inflation: 1.5, population: 125, marketSize: 85, competitorCount: 40, entryBarrier: 7, politicalRisk: 1, economicRisk: 2, legalRisk: 3, culturalDistance: 9 },
    GBR: { gdp: 3200, gdpGrowth: 1.8, inflation: 4.5, population: 67, marketSize: 75, competitorCount: 25, entryBarrier: 4, politicalRisk: 2, economicRisk: 3, legalRisk: 2, culturalDistance: 3 },
    IND: { gdp: 3500, gdpGrowth: 6.5, inflation: 5.5, population: 1400, marketSize: 70, competitorCount: 80, entryBarrier: 6, politicalRisk: 4, economicRisk: 4, legalRisk: 5, culturalDistance: 7 },
    BRA: { gdp: 2100, gdpGrowth: 2.8, inflation: 4.2, population: 215, marketSize: 65, competitorCount: 35, entryBarrier: 5, politicalRisk: 4, economicRisk: 5, legalRisk: 4, culturalDistance: 6 },
    FRA: { gdp: 2800, gdpGrowth: 1.6, inflation: 3.0, population: 67, marketSize: 72, competitorCount: 28, entryBarrier: 4, politicalRisk: 2, economicRisk: 2, legalRisk: 2, culturalDistance: 2 },
    CAN: { gdp: 2100, gdpGrowth: 2.2, inflation: 3.5, population: 39, marketSize: 68, competitorCount: 20, entryBarrier: 3, politicalRisk: 1, economicRisk: 2, legalRisk: 1, culturalDistance: 3 },
    AUS: { gdp: 1700, gdpGrowth: 2.0, inflation: 3.8, population: 26, marketSize: 60, competitorCount: 18, entryBarrier: 3, politicalRisk: 1, economicRisk: 2, legalRisk: 1, culturalDistance: 4 },
    KOR: { gdp: 1800, gdpGrowth: 2.6, inflation: 2.5, population: 52, marketSize: 70, competitorCount: 35, entryBarrier: 6, politicalRisk: 2, economicRisk: 2, legalRisk: 3, culturalDistance: 8 },
    MEX: { gdp: 1400, gdpGrowth: 3.2, inflation: 5.0, population: 130, marketSize: 55, competitorCount: 40, entryBarrier: 4, politicalRisk: 4, economicRisk: 4, legalRisk: 4, culturalDistance: 5 },
    ESP: { gdp: 1500, gdpGrowth: 2.4, inflation: 3.2, population: 47, marketSize: 58, competitorCount: 22, entryBarrier: 3, politicalRisk: 2, economicRisk: 3, legalRisk: 2, culturalDistance: 3 },
    ITA: { gdp: 2200, gdpGrowth: 1.2, inflation: 3.5, population: 60, marketSize: 62, competitorCount: 25, entryBarrier: 5, politicalRisk: 3, economicRisk: 3, legalRisk: 3, culturalDistance: 3 },
    NLD: { gdp: 1000, gdpGrowth: 2.0, inflation: 2.8, population: 17, marketSize: 50, competitorCount: 15, entryBarrier: 2, politicalRisk: 1, economicRisk: 1, legalRisk: 1, culturalDistance: 3 },
    CHE: { gdp: 800, gdpGrowth: 1.8, inflation: 1.5, population: 9, marketSize: 45, competitorCount: 12, entryBarrier: 3, politicalRisk: 1, economicRisk: 1, legalRisk: 1, culturalDistance: 3 },
    SGP: { gdp: 400, gdpGrowth: 3.5, inflation: 2.0, population: 6, marketSize: 40, competitorCount: 20, entryBarrier: 2, politicalRisk: 1, economicRisk: 1, legalRisk: 1, culturalDistance: 6 },
    UAE: { gdp: 500, gdpGrowth: 4.0, inflation: 2.5, population: 10, marketSize: 42, competitorCount: 25, entryBarrier: 4, politicalRisk: 2, economicRisk: 2, legalRisk: 3, culturalDistance: 8 },
    RUS: { gdp: 1800, gdpGrowth: -2.0, inflation: 12.0, population: 145, marketSize: 55, competitorCount: 30, entryBarrier: 8, politicalRisk: 9, economicRisk: 8, legalRisk: 7, culturalDistance: 7 },
    SAU: { gdp: 1100, gdpGrowth: 3.5, inflation: 2.2, population: 35, marketSize: 48, competitorCount: 20, entryBarrier: 6, politicalRisk: 4, economicRisk: 3, legalRisk: 5, culturalDistance: 9 },
  };

  const data = countryData[countryCode] || countryData.USA;
  const riskScore = ((data.politicalRisk || 3) + (data.economicRisk || 3) + (data.legalRisk || 3)) / 3;
  
  return {
    id: `country_${countryCode}`,
    country: countryCode,
    gdp: data.gdp || 1000,
    gdpGrowth: data.gdpGrowth || 2,
    inflation: data.inflation || 3,
    population: data.population || 50,
    marketSize: data.marketSize || 50,
    competitorCount: data.competitorCount || 20,
    entryBarrier: data.entryBarrier || 5,
    politicalRisk: data.politicalRisk || 3,
    economicRisk: data.economicRisk || 3,
    legalRisk: data.legalRisk || 3,
    culturalDistance: data.culturalDistance || 5,
    recommendation: riskScore <= 2 ? 'high' : riskScore <= 4 ? 'medium' : riskScore <= 6 ? 'low' : 'avoid',
  };
}

export function getAllCountryAnalyses(): CountryAnalysis[] {
  const countries = ['USA', 'CHN', 'DEU', 'JPN', 'GBR', 'IND', 'BRA', 'FRA', 'CAN', 'AUS', 'KOR', 'MEX', 'ESP', 'ITA', 'NLD', 'CHE', 'SGP', 'UAE', 'RUS', 'SAU'];
  return countries.map(c => analyzeCountry(c));
}

export function calculateCountryScore(analysis: CountryAnalysis): number {
  const opportunityScore = (analysis.gdpGrowth * 5) + (analysis.marketSize * 0.5) - (analysis.competitorCount * 0.1);
  const riskScore = analysis.politicalRisk + analysis.economicRisk + analysis.legalRisk + analysis.culturalDistance;
  return Math.max(0, Math.min(100, opportunityScore * 2 - riskScore * 2));
}

export function rankCountriesByPotential(analyses: CountryAnalysis[]): CountryAnalysis[] {
  return [...analyses].sort((a, b) => calculateCountryScore(b) - calculateCountryScore(a));
}

// ==================== MARKET ENTRY (Features 21-40) ====================
export function createMarketEntry(countryId: string, mode: MarketEntryMode, investment: number): MarketEntry {
  const timelines: Record<MarketEntryMode, number> = {
    export: 30, license: 60, franchise: 90, joint_venture: 180, acquisition: 365, greenfield: 730,
  };
  
  const risks: Record<MarketEntryMode, string[]> = {
    export: ['Barrières douanières', 'Fluctuations de change', 'Coûts logistiques'],
    license: ['Perte de contrôle qualité', 'Risque de contrefaçon', 'Dépendance au partenaire'],
    franchise: ['Dilution de marque', 'Conformité variable', 'Conflit avec franchisés'],
    joint_venture: ['Conflits de gouvernance', 'Partage de profits', 'Différences culturelles'],
    acquisition: ['Intégration complexe', 'Surévaluation', 'Fuite de talents'],
    greenfield: ['Délai de rentabilité', 'Risque opérationnel', 'Coûts de démarrage élevés'],
  };

  return {
    id: `entry_${Date.now()}`,
    countryId,
    mode,
    investment,
    timeline: timelines[mode],
    risks: risks[mode],
    resources: generateRequiredResources(mode),
    milestones: generateEntryMilestones(mode, timelines[mode]),
    status: 'planning',
  };
}

function generateRequiredResources(mode: MarketEntryMode): string[] {
  const base = ['Équipe projet', 'Budget marketing local', 'Conseiller juridique'];
  const modeSpecific: Record<MarketEntryMode, string[]> = {
    export: ['Agent commercial', 'Transitaire'],
    license: ['Contrat de licence', 'Documentation technique'],
    franchise: ['Manuel opératoire', 'Programme formation'],
    joint_venture: ['Accord JV', 'Conseil fiscal', 'Négociateur'],
    acquisition: ['Due diligence team', 'Banque conseil M&A', 'Intégrateur'],
    greenfield: ['Architecte', 'Recruteur local', 'Permis construction'],
  };
  return [...base, ...modeSpecific[mode]];
}

function generateEntryMilestones(mode: MarketEntryMode, totalDays: number): EntryMilestone[] {
  const milestones: EntryMilestone[] = [
    { id: 'm1', name: 'Étude de marché', date: Math.floor(totalDays * 0.1), completed: false, cost: 5000, dependencies: [] },
    { id: 'm2', name: 'Validation juridique', date: Math.floor(totalDays * 0.2), completed: false, cost: 10000, dependencies: ['m1'] },
    { id: 'm3', name: 'Négociation partenaires', date: Math.floor(totalDays * 0.4), completed: false, cost: 15000, dependencies: ['m2'] },
    { id: 'm4', name: 'Setup opérationnel', date: Math.floor(totalDays * 0.7), completed: false, cost: 25000, dependencies: ['m3'] },
    { id: 'm5', name: 'Lancement commercial', date: totalDays, completed: false, cost: 20000, dependencies: ['m4'] },
  ];
  
  if (mode === 'greenfield') {
    milestones.splice(3, 0, { id: 'm3b', name: 'Construction/Aménagement', date: Math.floor(totalDays * 0.5), completed: false, cost: 100000, dependencies: ['m3'] });
  }
  if (mode === 'acquisition') {
    milestones.splice(2, 0, { id: 'm2b', name: 'Due Diligence', date: Math.floor(totalDays * 0.3), completed: false, cost: 50000, dependencies: ['m2'] });
  }
  
  return milestones;
}

export function advanceMarketEntry(entry: MarketEntry, daysElapsed: number): MarketEntry {
  const updatedMilestones = entry.milestones.map(m => {
    if (m.completed) return m;
    const allDepsComplete = m.dependencies.every(dep => 
      entry.milestones.find(ms => ms.id === dep)?.completed
    );
    if (allDepsComplete && daysElapsed >= m.date) {
      return { ...m, completed: true };
    }
    return m;
  });
  
  const allComplete = updatedMilestones.every(m => m.completed);
  return {
    ...entry,
    milestones: updatedMilestones,
    status: allComplete ? 'operational' : entry.status === 'planning' && updatedMilestones[0].completed ? 'execution' : entry.status,
  };
}

export function calculateEntryProgress(entry: MarketEntry): number {
  const completed = entry.milestones.filter(m => m.completed).length;
  return (completed / entry.milestones.length) * 100;
}

export function estimateEntryROI(entry: MarketEntry, marketSize: number): { years: number; roi: number } {
  const investmentMultiplier: Record<MarketEntryMode, number> = {
    export: 0.05, license: 0.08, franchise: 0.12, joint_venture: 0.15, acquisition: 0.20, greenfield: 0.25,
  };
  const annualRevenue = marketSize * investmentMultiplier[entry.mode] * 1000000;
  const breakEven = entry.investment / (annualRevenue * 0.15);
  return { years: Math.ceil(breakEven), roi: (annualRevenue * 5 - entry.investment) / entry.investment * 100 };
}

// ==================== LOCAL PARTNERS (Features 41-55) ====================
export function findLocalPartners(country: string, type: LocalPartner['type']): LocalPartner[] {
  const names = ['Global Trade Co.', 'National Distribution', 'Premier Partners', 'Excellence Corp', 'Unity Holdings'];
  return names.map((name, i) => ({
    id: `partner_${Date.now()}_${i}`,
    name: `${name} ${country}`,
    country,
    type,
    equity: type === 'jv_partner' ? 30 + Math.random() * 20 : undefined,
    revenue: 500000 + Math.random() * 2000000,
    performance: 60 + Math.random() * 30,
    relationshipScore: 50 + Math.random() * 40,
    contractExpiration: Date.now() + (365 + Math.random() * 730) * 24 * 60 * 60 * 1000,
  }));
}

export function evaluatePartner(partner: LocalPartner): { score: number; recommendation: string } {
  const score = (partner.performance * 0.4) + (partner.relationshipScore * 0.3) + (partner.revenue / 100000 * 0.3);
  const recommendation = score >= 80 ? 'Excellent partenaire stratégique' : 
    score >= 60 ? 'Partenaire fiable' : 
    score >= 40 ? 'Performance à améliorer' : 'Envisager un changement';
  return { score: Math.min(100, score), recommendation };
}

export function negotiatePartnerTerms(partner: LocalPartner, proposedEquity?: number): { success: boolean; counterOffer?: number } {
  if (!proposedEquity || partner.type !== 'jv_partner') return { success: true };
  const partnerMin = partner.equity || 30;
  if (proposedEquity >= partnerMin - 5) return { success: true };
  return { success: false, counterOffer: partnerMin };
}

// ==================== REGULATORY (Features 56-70) ====================
export function getRequiredApprovals(country: string, businessType: string): RegulatoryApproval[] {
  const approvals: Partial<RegulatoryApproval>[] = [
    { type: 'business_license', cost: 5000 },
    { type: 'tax_id', cost: 500 },
  ];
  
  if (['USA', 'DEU', 'JPN', 'GBR'].includes(country)) {
    approvals.push({ type: 'product_cert', cost: 15000 });
  }
  if (['CHN', 'IND', 'BRA', 'RUS'].includes(country)) {
    approvals.push({ type: 'import_permit', cost: 8000 }, { type: 'environmental', cost: 12000 });
  }
  if (['pharma', 'food', 'finance'].includes(businessType)) {
    approvals.push({ type: 'industry_specific', cost: 25000 });
  }
  
  return approvals.map((a, i) => ({
    id: `approval_${Date.now()}_${i}`,
    country,
    type: a.type!,
    applicationDate: Date.now(),
    status: 'pending',
    cost: a.cost!,
    conditions: [],
  }));
}

export function processApproval(approval: RegulatoryApproval, daysWaited: number): RegulatoryApproval {
  const processingTimes: Record<RegulatoryApproval['type'], number> = {
    business_license: 30, product_cert: 90, import_permit: 45, tax_id: 14, environmental: 120, industry_specific: 180,
  };
  const required = processingTimes[approval.type];
  if (daysWaited >= required) {
    const approved = Math.random() > 0.15;
    return { ...approval, status: approved ? 'approved' : 'conditional', validUntil: approved ? Date.now() + 365 * 24 * 60 * 60 * 1000 : undefined };
  }
  return approval;
}

export function calculateComplianceCost(approvals: RegulatoryApproval[]): number {
  return approvals.reduce((sum, a) => sum + a.cost, 0);
}

// ==================== CUSTOMS & DUTIES (Features 71-80) ====================
export function calculateCustomsDuty(product: string, origin: string, destination: string): CustomsDuty {
  const baseDuty = Math.random() * 15;
  const vat = destination === 'CHN' ? 13 : destination === 'DEU' ? 19 : destination === 'USA' ? 0 : destination === 'JPN' ? 10 : 20;
  const hasTradeAgreement = (origin === 'FRA' && ['DEU', 'ESP', 'ITA', 'NLD'].includes(destination)) ||
    (origin === 'USA' && ['CAN', 'MEX'].includes(destination));
  
  return {
    id: `duty_${Date.now()}`,
    productCategory: product,
    originCountry: origin,
    destinationCountry: destination,
    dutyRate: hasTradeAgreement ? 0 : baseDuty,
    vatRate: vat,
    tradeAgreement: hasTradeAgreement ? (destination === 'CAN' ? 'USMCA' : 'EU Single Market') : undefined,
  };
}

export function estimateLandedCost(productValue: number, duty: CustomsDuty): number {
  const customs = productValue * (duty.dutyRate / 100);
  const vat = (productValue + customs) * (duty.vatRate / 100);
  const excise = duty.exciseDuty ? productValue * (duty.exciseDuty / 100) : 0;
  const antidump = duty.antidumpingDuty ? productValue * (duty.antidumpingDuty / 100) : 0;
  return productValue + customs + vat + excise + antidump;
}

// ==================== CURRENCY EXPOSURE (Features 81-90) ====================
export function calculateCurrencyExposure(currency: string, assets: number, liabilities: number, revenue: number, expenses: number): CurrencyExposure {
  const netExposure = (assets - liabilities) + (revenue - expenses);
  const hedgedAmount = Math.min(Math.abs(netExposure) * 0.7, 1000000);
  return {
    currency,
    assets,
    liabilities,
    revenue,
    expenses,
    netExposure,
    hedgedAmount,
    hedgingCost: hedgedAmount * 0.02,
  };
}

export function recommendHedgingStrategy(exposures: CurrencyExposure[]): { currency: string; action: string; amount: number }[] {
  return exposures
    .filter(e => Math.abs(e.netExposure) > 50000)
    .map(e => ({
      currency: e.currency,
      action: e.netExposure > 0 ? 'Vendre à terme' : 'Acheter à terme',
      amount: Math.abs(e.netExposure) * 0.8,
    }));
}

// ==================== TRANSFER PRICING (Features 91-95) ====================
export function createTransferPricingPolicy(fromEntity: string, toEntity: string, transactionType: TransferPricing['transactionType']): TransferPricing {
  const methods: TransferPricing['method'][] = ['comparable_uncontrolled', 'resale_price', 'cost_plus', 'profit_split', 'tnmm'];
  const selectedMethod = methods[Math.floor(Math.random() * methods.length)];
  
  return {
    id: `tp_${Date.now()}`,
    transactionType,
    fromEntity,
    toEntity,
    method: selectedMethod,
    amount: 100000 + Math.random() * 900000,
    armLengthPrice: 100000 + Math.random() * 900000,
    documentation: true,
    auditRisk: Math.random() * 30,
  };
}

export function assessTransferPricingRisk(policies: TransferPricing[]): { totalRisk: number; recommendations: string[] } {
  const totalRisk = policies.reduce((sum, p) => sum + p.auditRisk, 0) / policies.length;
  const recommendations: string[] = [];
  if (totalRisk > 20) recommendations.push('Renforcer la documentation');
  if (policies.some(p => !p.documentation)) recommendations.push('Compléter les études de prix');
  if (policies.some(p => Math.abs(p.amount - p.armLengthPrice) > 50000)) recommendations.push('Ajuster les prix inter-compagnies');
  return { totalRisk, recommendations };
}

// ==================== GLOBAL TAX STRUCTURE (Features 96-100) ====================
export function optimizeGlobalTaxStructure(countries: string[]): GlobalTaxStructure {
  const taxRates: Record<string, number> = {
    USA: 21, CHN: 25, DEU: 30, JPN: 23, GBR: 19, IRL: 12.5, NLD: 25, CHE: 15, SGP: 17, LUX: 17,
  };
  
  const bestHolding = Object.entries(taxRates).sort((a, b) => a[1] - b[1])[0][0];
  const ipCountry = 'IRL';
  
  const avgRate = countries.reduce((sum, c) => sum + (taxRates[c] || 25), 0) / countries.length;
  const optimizedRate = avgRate * 0.75;
  
  return {
    id: `tax_struct_${Date.now()}`,
    holdingCountry: bestHolding,
    ipCountry,
    operatingCountries: countries,
    effectiveTaxRate: optimizedRate,
    taxSavings: (avgRate - optimizedRate) * 10000,
    repatriationCost: 5,
    complianceRisk: 25,
  };
}

// ==================== EXPATRIATES (Features 101-105) ====================
export function createExpatriatePackage(employeeId: string, hostCountry: string, baseSalary: number): ExpatriatePackage {
  const colaFactors: Record<string, number> = {
    USA: 1.2, CHN: 0.9, JPN: 1.4, CHE: 1.6, SGP: 1.3, UAE: 1.1,
  };
  const cola = colaFactors[hostCountry] || 1.0;
  
  return {
    id: `expat_${Date.now()}`,
    employeeId,
    hostCountry,
    baseSalary,
    costOfLivingAdjustment: baseSalary * (cola - 1),
    housingAllowance: baseSalary * 0.3,
    educationAllowance: 15000,
    homeLeave: 5000,
    hardshipPremium: hostCountry === 'CHN' || hostCountry === 'RUS' ? baseSalary * 0.15 : 0,
    taxEqualization: true,
    totalCost: baseSalary * cola * 1.6,
  };
}

export function calculateExpatriateROI(pkg: ExpatriatePackage, projectValue: number): number {
  return ((projectValue - pkg.totalCost) / pkg.totalCost) * 100;
}

// ==================== CROSS-BORDER PROJECTS (Features 106-110) ====================
export function createCrossBorderProject(name: string, countries: string[], budget: number): CrossBorderProject {
  return {
    id: `cbp_${Date.now()}`,
    name,
    countries,
    budget,
    teams: countries.map(c => ({ country: c, members: 2 + Math.floor(Math.random() * 5) })),
    startDate: Date.now(),
    endDate: Date.now() + 180 * 24 * 60 * 60 * 1000,
    status: 'planning',
    challenges: ['Décalage horaire', 'Barrières linguistiques', 'Différences culturelles'],
  };
}

export function assessProjectComplexity(project: CrossBorderProject): { score: number; challenges: string[] } {
  const score = project.countries.length * 15 + project.teams.reduce((s, t) => s + t.members, 0) * 2;
  const challenges = [...project.challenges];
  if (project.countries.length > 3) challenges.push('Coordination multi-sites complexe');
  if (project.budget > 500000) challenges.push('Risque budgétaire élevé');
  return { score: Math.min(100, score), challenges };
}

// ==================== UTILITIES ====================
export function initializeInternationalState() {
  return {
    countryAnalyses: getAllCountryAnalyses(),
    marketEntries: [],
    localPartners: [],
    regulatoryApprovals: [],
    customsDuties: [],
    currencyExposures: [
      calculateCurrencyExposure('EUR', 500000, 200000, 100000, 80000),
      calculateCurrencyExposure('USD', 200000, 100000, 50000, 40000),
    ],
    transferPricing: [],
    globalTaxStructure: optimizeGlobalTaxStructure(['FRA', 'DEU', 'USA']),
    expatriates: [],
    crossBorderProjects: [],
  };
}
