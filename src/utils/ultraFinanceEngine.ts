// Ultra-Realistic Finance Engine with complete French accounting standards

import { Company } from '@/types/game';
import { 
  BalanceSheet, IncomeStatement, CashFlowStatement, FinancialRatios,
  Budget, BudgetLine, Forecast, ForecastScenario, Audit, AuditFinding
} from '@/types/advancedTypes';

// ==================== BALANCE SHEET GENERATION ====================

export function generateBalanceSheet(company: Company, day: number): BalanceSheet {
  // Calculate fixed assets
  const intangibleAssets = company.intellectualProperty.reduce((sum, ip) => sum + ip.value, 0);
  const tangibleAssets = company.properties.reduce((sum, p) => sum + p.currentValue, 0);
  const financialAssets = company.bankAccount.investments.reduce((sum, i) => sum + i.currentValue, 0) +
    company.subsidiaries.reduce((sum, s) => sum + s.treasury, 0);
  
  // Calculate depreciation (simplified: 10% per year)
  const yearsActive = Math.floor(day / 365);
  const depreciation = (intangibleAssets + tangibleAssets) * 0.1 * yearsActive;
  
  // Calculate current assets
  const inventory = company.inventory.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
  const receivables = company.invoices.filter(i => !i.paid).reduce((sum, i) => sum + i.amount, 0);
  const cashAndEquivalents = company.treasury;
  
  // Calculate equity
  const shareCapital = company.capital;
  const retainedEarnings = company.financialHistory.reduce((sum, h) => sum + h.netResult, 0);
  const netIncome = company.monthlyRevenue - company.monthlyExpenses;
  
  // Calculate debts
  const financialDebts = company.bankAccount.loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const supplierPayables = company.suppliers.reduce((sum, s) => 
    s.contracts.reduce((cSum, c) => cSum + c.monthlyVolume * c.unitPrice, 0), 0);
  const taxPayables = company.tvaCollected - company.tvaDeductible + company.urssafDebt + company.isDebt;
  const socialPayables = company.employees.reduce((sum, e) => sum + e.brutSalary * 0.45, 0);
  
  const netFixed = intangibleAssets + tangibleAssets + financialAssets - depreciation;
  const totalCurrent = inventory + receivables + cashAndEquivalents;
  const totalAssets = netFixed + totalCurrent;
  
  const totalEquity = shareCapital + retainedEarnings + netIncome;
  const totalProvisions = 0;
  const totalDebts = financialDebts + supplierPayables + taxPayables + socialPayables;
  
  return {
    date: day,
    assets: {
      fixedAssets: {
        intangible: intangibleAssets,
        tangible: tangibleAssets,
        financial: financialAssets,
        depreciation,
        netFixed,
      },
      currentAssets: {
        inventory,
        receivables,
        otherReceivables: 0,
        prepaidExpenses: 0,
        cashAndEquivalents,
        totalCurrent,
      },
      totalAssets,
    },
    liabilities: {
      equity: {
        shareCapital,
        reserves: 0,
        retainedEarnings,
        netIncome,
        totalEquity,
      },
      provisions: {
        riskProvisions: 0,
        chargesProvisions: 0,
        totalProvisions,
      },
      debts: {
        financialDebts,
        supplierPayables,
        taxPayables,
        socialPayables,
        otherPayables: 0,
        deferredRevenue: 0,
        totalDebts,
      },
      totalLiabilities: totalEquity + totalProvisions + totalDebts,
    },
  };
}

// ==================== INCOME STATEMENT GENERATION ====================

export function generateIncomeStatement(company: Company, periodStart: number, periodEnd: number): IncomeStatement {
  const relevantHistory = company.financialHistory.filter(
    h => h.day >= periodStart && h.day <= periodEnd
  );
  
  const totalRevenue = relevantHistory.reduce((sum, h) => sum + h.revenue, 0);
  const totalExpenses = relevantHistory.reduce((sum, h) => sum + h.expenses, 0);
  
  // Breakdown revenues
  const salesRevenue = totalRevenue * 0.7;
  const productionRevenue = totalRevenue * 0.2;
  const serviceRevenue = totalRevenue * 0.1;
  
  // Breakdown expenses
  const salaries = company.employees.reduce((sum, e) => sum + e.brutSalary, 0) * 
    Math.ceil((periodEnd - periodStart) / 30);
  const socialCharges = salaries * 0.45;
  const purchases = totalExpenses * 0.4;
  const externalServices = totalExpenses * 0.15;
  const depreciation = (generateBalanceSheet(company, periodEnd).assets.fixedAssets.depreciation - 
    generateBalanceSheet(company, periodStart).assets.fixedAssets.depreciation);
  
  const operatingIncome = totalRevenue - totalExpenses;
  
  // Financial result
  const financialRevenue = company.bankAccount.investments.reduce((sum, i) => 
    sum + i.currentValue * (i.interestRate / 12) * Math.ceil((periodEnd - periodStart) / 30), 0);
  const financialExpenses = company.bankAccount.loans.reduce((sum, l) => 
    sum + l.monthlyPayment * l.interestRate * Math.ceil((periodEnd - periodStart) / 30), 0);
  
  const netFinancial = financialRevenue - financialExpenses;
  
  // Calculate corporate tax
  const taxableIncome = operatingIncome + netFinancial;
  const corporateTax = taxableIncome > 0 ? 
    (taxableIncome <= 42500 ? taxableIncome * 0.15 : 42500 * 0.15 + (taxableIncome - 42500) * 0.25) : 0;
  
  // Profit sharing (participation obligatoire si > 50 salariés)
  const profitSharing = company.employees.length >= 50 ? Math.max(0, taxableIncome * 0.05) : 0;
  
  const netIncome = taxableIncome - corporateTax - profitSharing;
  
  return {
    period: { start: periodStart, end: periodEnd },
    operatingRevenue: {
      salesRevenue,
      productionRevenue,
      serviceRevenue,
      subsidies: 0,
      otherRevenue: 0,
      totalOperating: totalRevenue,
    },
    operatingExpenses: {
      purchases,
      inventoryVariation: 0,
      externalServices,
      taxes: company.tvaCollected,
      salaries,
      socialCharges,
      depreciation,
      provisions: 0,
      otherExpenses: totalExpenses - purchases - externalServices - salaries - socialCharges - depreciation,
      totalOperating: totalExpenses,
    },
    operatingIncome,
    financialResult: {
      financialRevenue,
      financialExpenses,
      netFinancial,
    },
    exceptionalResult: {
      exceptionalRevenue: 0,
      exceptionalExpenses: 0,
      netExceptional: 0,
    },
    corporateTax,
    profitSharing,
    netIncome,
  };
}

// ==================== CASH FLOW STATEMENT ====================

export function generateCashFlowStatement(company: Company, periodStart: number, periodEnd: number): CashFlowStatement {
  const incomeStatement = generateIncomeStatement(company, periodStart, periodEnd);
  const startBalance = generateBalanceSheet(company, periodStart);
  const endBalance = generateBalanceSheet(company, periodEnd);
  
  // Operating cash flow
  const workingCapitalChange = 
    (endBalance.assets.currentAssets.inventory - startBalance.assets.currentAssets.inventory) +
    (endBalance.assets.currentAssets.receivables - startBalance.assets.currentAssets.receivables) -
    (endBalance.liabilities.debts.supplierPayables - startBalance.liabilities.debts.supplierPayables);
  
  const totalOperating = incomeStatement.netIncome + 
    incomeStatement.operatingExpenses.depreciation - 
    workingCapitalChange;
  
  // Investing cash flow
  const assetAcquisitions = Math.max(0, 
    endBalance.assets.fixedAssets.netFixed - startBalance.assets.fixedAssets.netFixed + 
    incomeStatement.operatingExpenses.depreciation);
  const financialInvestments = Math.max(0,
    endBalance.assets.fixedAssets.financial - startBalance.assets.fixedAssets.financial);
  
  const totalInvesting = -assetAcquisitions - financialInvestments;
  
  // Financing cash flow
  const loanProceeds = Math.max(0,
    endBalance.liabilities.debts.financialDebts - startBalance.liabilities.debts.financialDebts);
  const loanRepayments = Math.max(0,
    startBalance.liabilities.debts.financialDebts - endBalance.liabilities.debts.financialDebts);
  const dividendsPaid = Math.max(0, incomeStatement.netIncome * 0.3); // Assume 30% dividend payout
  
  const totalFinancing = loanProceeds - loanRepayments - dividendsPaid;
  
  const netCashChange = totalOperating + totalInvesting + totalFinancing;
  
  return {
    period: { start: periodStart, end: periodEnd },
    operatingCashFlow: {
      netIncome: incomeStatement.netIncome,
      depreciation: incomeStatement.operatingExpenses.depreciation,
      provisionChanges: 0,
      workingCapitalChange: -workingCapitalChange,
      totalOperating,
    },
    investingCashFlow: {
      assetAcquisitions: -assetAcquisitions,
      assetDisposals: 0,
      financialInvestments: -financialInvestments,
      totalInvesting,
    },
    financingCashFlow: {
      capitalIncrease: 0,
      dividendsPaid: -dividendsPaid,
      loanProceeds,
      loanRepayments: -loanRepayments,
      totalFinancing,
    },
    netCashChange,
    openingCash: startBalance.assets.currentAssets.cashAndEquivalents,
    closingCash: endBalance.assets.currentAssets.cashAndEquivalents,
  };
}

// ==================== FINANCIAL RATIOS ====================

export function calculateFinancialRatios(company: Company, day: number): FinancialRatios {
  const balance = generateBalanceSheet(company, day);
  const income = generateIncomeStatement(company, Math.max(1, day - 365), day);
  
  const totalAssets = balance.assets.totalAssets;
  const totalEquity = balance.liabilities.equity.totalEquity;
  const totalDebts = balance.liabilities.debts.totalDebts;
  const currentAssets = balance.assets.currentAssets.totalCurrent;
  const currentLiabilities = balance.liabilities.debts.supplierPayables + 
    balance.liabilities.debts.taxPayables + balance.liabilities.debts.socialPayables;
  const inventory = balance.assets.currentAssets.inventory;
  const cash = balance.assets.currentAssets.cashAndEquivalents;
  const receivables = balance.assets.currentAssets.receivables;
  const revenue = income.operatingRevenue.totalOperating;
  const netIncome = income.netIncome;
  const operatingIncome = income.operatingIncome;
  const financialExpenses = income.financialResult.financialExpenses;
  
  // Profitability ratios
  const grossMargin = revenue > 0 ? (revenue - income.operatingExpenses.purchases) / revenue * 100 : 0;
  const operatingMargin = revenue > 0 ? operatingIncome / revenue * 100 : 0;
  const netMargin = revenue > 0 ? netIncome / revenue * 100 : 0;
  const roa = totalAssets > 0 ? netIncome / totalAssets * 100 : 0;
  const roe = totalEquity > 0 ? netIncome / totalEquity * 100 : 0;
  const roce = (totalAssets - currentLiabilities) > 0 ? 
    operatingIncome / (totalAssets - currentLiabilities) * 100 : 0;
  
  // Liquidity ratios
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : 999;
  const quickRatio = currentLiabilities > 0 ? (currentAssets - inventory) / currentLiabilities : 999;
  const cashRatio = currentLiabilities > 0 ? cash / currentLiabilities : 999;
  
  // Solvency ratios
  const debtToEquity = totalEquity > 0 ? totalDebts / totalEquity : 999;
  const equityRatio = totalAssets > 0 ? totalEquity / totalAssets * 100 : 0;
  const interestCoverage = financialExpenses > 0 ? operatingIncome / financialExpenses : 999;
  const annualDebtService = company.bankAccount.loans.reduce((sum, l) => sum + l.monthlyPayment * 12, 0);
  const debtServiceCoverage = annualDebtService > 0 ? 
    (operatingIncome + income.operatingExpenses.depreciation) / annualDebtService : 999;
  
  // Activity ratios
  const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0;
  const cogs = income.operatingExpenses.purchases;
  const inventoryTurnover = inventory > 0 ? cogs / inventory : 0;
  const receivablesTurnover = receivables > 0 ? revenue / receivables : 0;
  const payablesTurnover = balance.liabilities.debts.supplierPayables > 0 ? 
    cogs / balance.liabilities.debts.supplierPayables : 0;
  
  const dso = receivablesTurnover > 0 ? 365 / receivablesTurnover : 0;
  const dio = inventoryTurnover > 0 ? 365 / inventoryTurnover : 0;
  const dpo = payablesTurnover > 0 ? 365 / payablesTurnover : 0;
  const cashConversionCycle = dso + dio - dpo;
  
  // Valuation
  const ebitda = operatingIncome + income.operatingExpenses.depreciation;
  const enterpriseValue = totalEquity + totalDebts - cash;
  const evToEbitda = ebitda > 0 ? enterpriseValue / ebitda : 999;
  
  return {
    profitability: {
      grossMargin,
      operatingMargin,
      netMargin,
      roa,
      roe,
      roce,
    },
    liquidity: {
      currentRatio,
      quickRatio,
      cashRatio,
    },
    solvency: {
      debtToEquity,
      equityRatio,
      interestCoverage,
      debtServiceCoverage,
    },
    activity: {
      assetTurnover,
      inventoryTurnover,
      receivablesTurnover,
      payablesTurnover,
      dso,
      dio,
      dpo,
      cashConversionCycle,
    },
    valuation: {
      bookValue: totalEquity,
      enterpriseValue,
      ebitda,
      evToEbitda,
    },
  };
}

// ==================== BUDGETING ====================

export function createBudget(
  company: Company,
  name: string,
  year: number,
  type: Budget['type']
): Budget {
  const lastYearRevenue = company.financialHistory
    .slice(-365)
    .reduce((sum, h) => sum + h.revenue, 0);
  const lastYearExpenses = company.financialHistory
    .slice(-365)
    .reduce((sum, h) => sum + h.expenses, 0);
  
  // Project 10% growth
  const projectedRevenue = lastYearRevenue * 1.1;
  const projectedExpenses = lastYearExpenses * 1.05;
  
  const lines: BudgetLine[] = [
    // Revenue lines
    { id: 'rev_sales', category: 'Revenue', subcategory: 'Sales', description: 'Product sales', 
      type: 'revenue', plannedAmount: projectedRevenue * 0.7, actualAmount: 0, variance: 0, notes: '' },
    { id: 'rev_services', category: 'Revenue', subcategory: 'Services', description: 'Service revenue', 
      type: 'revenue', plannedAmount: projectedRevenue * 0.25, actualAmount: 0, variance: 0, notes: '' },
    { id: 'rev_other', category: 'Revenue', subcategory: 'Other', description: 'Other income', 
      type: 'revenue', plannedAmount: projectedRevenue * 0.05, actualAmount: 0, variance: 0, notes: '' },
    // Expense lines
    { id: 'exp_salaries', category: 'Expenses', subcategory: 'Personnel', description: 'Salaries & wages', 
      type: 'expense', plannedAmount: projectedExpenses * 0.4, actualAmount: 0, variance: 0, notes: '' },
    { id: 'exp_social', category: 'Expenses', subcategory: 'Personnel', description: 'Social charges', 
      type: 'expense', plannedAmount: projectedExpenses * 0.18, actualAmount: 0, variance: 0, notes: '' },
    { id: 'exp_rent', category: 'Expenses', subcategory: 'Facilities', description: 'Rent & utilities', 
      type: 'expense', plannedAmount: projectedExpenses * 0.1, actualAmount: 0, variance: 0, notes: '' },
    { id: 'exp_supplies', category: 'Expenses', subcategory: 'Operations', description: 'Supplies & materials', 
      type: 'expense', plannedAmount: projectedExpenses * 0.15, actualAmount: 0, variance: 0, notes: '' },
    { id: 'exp_marketing', category: 'Expenses', subcategory: 'Marketing', description: 'Marketing & ads', 
      type: 'expense', plannedAmount: projectedExpenses * 0.08, actualAmount: 0, variance: 0, notes: '' },
    { id: 'exp_other', category: 'Expenses', subcategory: 'Other', description: 'Other expenses', 
      type: 'expense', plannedAmount: projectedExpenses * 0.09, actualAmount: 0, variance: 0, notes: '' },
  ];
  
  return {
    id: `budget_${year}_${type}`,
    name,
    year,
    type,
    status: 'draft',
    lines,
    totalRevenue: projectedRevenue,
    totalExpenses: projectedExpenses,
    netBudget: projectedRevenue - projectedExpenses,
    actualRevenue: 0,
    actualExpenses: 0,
    variance: 0,
    variancePercent: 0,
  };
}

export function updateBudgetActuals(budget: Budget, company: Company, currentDay: number): Budget {
  const yearStart = (Math.floor(currentDay / 365) * 365) + 1;
  const relevantHistory = company.financialHistory.filter(
    h => h.day >= yearStart && h.day <= currentDay
  );
  
  const actualRevenue = relevantHistory.reduce((sum, h) => sum + h.revenue, 0);
  const actualExpenses = relevantHistory.reduce((sum, h) => sum + h.expenses, 0);
  
  // Update lines (simplified distribution)
  const updatedLines = budget.lines.map(line => {
    let actualAmount = 0;
    if (line.type === 'revenue') {
      actualAmount = actualRevenue * (line.plannedAmount / budget.totalRevenue);
    } else {
      actualAmount = actualExpenses * (line.plannedAmount / budget.totalExpenses);
    }
    return {
      ...line,
      actualAmount,
      variance: actualAmount - line.plannedAmount,
    };
  });
  
  const variance = (actualRevenue - actualExpenses) - budget.netBudget;
  const variancePercent = budget.netBudget !== 0 ? (variance / Math.abs(budget.netBudget)) * 100 : 0;
  
  return {
    ...budget,
    lines: updatedLines,
    actualRevenue,
    actualExpenses,
    variance,
    variancePercent,
  };
}

// ==================== FORECASTING ====================

export function createForecast(company: Company, horizon: number): Forecast {
  const baseRevenue = company.monthlyRevenue;
  const baseExpenses = company.monthlyExpenses;
  
  const scenarios: ForecastScenario[] = [
    createScenario('Optimiste', 0.3, baseRevenue, baseExpenses, horizon, 1.15, 1.05),
    createScenario('Base', 0.5, baseRevenue, baseExpenses, horizon, 1.08, 1.06),
    createScenario('Pessimiste', 0.2, baseRevenue, baseExpenses, horizon, 0.95, 1.08),
  ];
  
  return {
    id: `forecast_${Date.now()}`,
    name: `Prévision ${horizon} mois`,
    createdAt: Date.now(),
    horizon,
    scenarios,
    assumptions: [
      { id: 'growth', name: 'Croissance du marché', category: 'Market', baseValue: 0.05, growthRate: 0, volatility: 0.02 },
      { id: 'inflation', name: 'Inflation', category: 'Economy', baseValue: 0.02, growthRate: 0, volatility: 0.01 },
      { id: 'competition', name: 'Pression concurrentielle', category: 'Market', baseValue: 0.1, growthRate: 0.02, volatility: 0.05 },
    ],
  };
}

function createScenario(
  name: string, 
  probability: number, 
  baseRevenue: number, 
  baseExpenses: number, 
  horizon: number,
  revenueGrowth: number,
  expenseGrowth: number
): ForecastScenario {
  const projectedRevenue: number[] = [];
  const projectedExpenses: number[] = [];
  const projectedCashFlow: number[] = [];
  const projectedProfit: number[] = [];
  
  for (let i = 0; i < horizon; i++) {
    const monthRevenue = baseRevenue * Math.pow(revenueGrowth, i / 12);
    const monthExpenses = baseExpenses * Math.pow(expenseGrowth, i / 12);
    projectedRevenue.push(monthRevenue);
    projectedExpenses.push(monthExpenses);
    projectedProfit.push(monthRevenue - monthExpenses);
    projectedCashFlow.push((monthRevenue - monthExpenses) * 0.8); // Simplified
  }
  
  return {
    id: `scenario_${name.toLowerCase()}`,
    name,
    probability,
    projectedRevenue,
    projectedExpenses,
    projectedCashFlow,
    projectedProfit,
  };
}

// ==================== AUDITING ====================

export function scheduleAudit(
  company: Company,
  type: Audit['type'],
  auditor: string,
  startDate: number
): Audit {
  const scope = getAuditScope(type);
  
  return {
    id: `audit_${type}_${startDate}`,
    type,
    status: 'scheduled',
    auditor,
    startDate,
    scope,
    findings: [],
    recommendations: [],
    overallRating: 'good',
    cost: getAuditCost(type, company),
  };
}

function getAuditScope(type: Audit['type']): string[] {
  switch (type) {
    case 'internal':
      return ['Processus internes', 'Conformité procédures', 'Efficacité opérationnelle'];
    case 'external':
      return ['Comptes annuels', 'Annexes', 'Rapport de gestion', 'Conventions réglementées'];
    case 'fiscal':
      return ['TVA', 'IS', 'URSSAF', 'Taxe foncière', 'CFE', 'CVAE'];
    case 'social':
      return ['Contrats de travail', 'Bulletins de paie', 'URSSAF', 'Convention collective', 'DUERP'];
    case 'quality':
      return ['Processus qualité', 'Non-conformités', 'Actions correctives', 'Documentation'];
    default:
      return [];
  }
}

function getAuditCost(type: Audit['type'], company: Company): number {
  const baseCosts: Record<Audit['type'], number> = {
    internal: 2000,
    external: 5000,
    fiscal: 3000,
    social: 2500,
    quality: 3500,
  };
  
  const base = baseCosts[type];
  const sizeFactor = 1 + (company.employees.length / 100);
  const revenueFactor = 1 + (company.monthlyRevenue / 1000000);
  
  return Math.round(base * sizeFactor * revenueFactor);
}

export function conductAudit(audit: Audit, company: Company): Audit {
  const findings: AuditFinding[] = [];
  const recommendations: string[] = [];
  
  // Generate realistic findings based on audit type and company state
  const ratios = calculateFinancialRatios(company, company.foundedDate + 365);
  
  // Check for issues
  if (ratios.liquidity.currentRatio < 1) {
    findings.push({
      id: 'finding_liquidity',
      severity: 'major',
      category: 'Trésorerie',
      description: 'Ratio de liquidité inférieur à 1, risque de défaut de paiement',
      impact: 'Risque de cessation de paiement à court terme',
      recommendation: 'Renégocier les délais fournisseurs, accélérer les encaissements',
      resolved: false,
    });
  }
  
  if (ratios.solvency.debtToEquity > 2) {
    findings.push({
      id: 'finding_debt',
      severity: 'major',
      category: 'Endettement',
      description: 'Ratio d\'endettement élevé (>2)',
      impact: 'Difficultés potentielles de refinancement',
      recommendation: 'Réduire l\'endettement, augmenter les fonds propres',
      resolved: false,
    });
  }
  
  if (company.urssafDebt > 0) {
    findings.push({
      id: 'finding_urssaf',
      severity: 'critical',
      category: 'Conformité sociale',
      description: `Dette URSSAF de ${company.urssafDebt}€`,
      impact: 'Risque de pénalités et majorations',
      recommendation: 'Régulariser immédiatement la dette sociale',
      resolved: false,
    });
  }
  
  // Add recommendations
  if (findings.length > 0) {
    recommendations.push('Mettre en place un tableau de bord financier mensuel');
    recommendations.push('Réaliser une revue trimestrielle des indicateurs clés');
  }
  
  recommendations.push('Documenter les procédures internes');
  recommendations.push('Former les équipes aux bonnes pratiques');
  
  // Determine overall rating
  let overallRating: Audit['overallRating'] = 'excellent';
  const criticalCount = findings.filter(f => f.severity === 'critical').length;
  const majorCount = findings.filter(f => f.severity === 'major').length;
  
  if (criticalCount > 0) overallRating = 'critical';
  else if (majorCount >= 2) overallRating = 'needs_improvement';
  else if (majorCount === 1) overallRating = 'satisfactory';
  else if (findings.length > 0) overallRating = 'good';
  
  return {
    ...audit,
    status: 'completed',
    endDate: audit.startDate + 7,
    findings,
    recommendations,
    overallRating,
  };
}

// ==================== VALUATION ====================

export function calculateCompanyValuation(company: Company, day: number): {
  dcf: number;
  multiples: number;
  assetBased: number;
  average: number;
} {
  const ratios = calculateFinancialRatios(company, day);
  const income = generateIncomeStatement(company, Math.max(1, day - 365), day);
  const balance = generateBalanceSheet(company, day);
  
  // DCF (simplified)
  const fcf = income.netIncome + income.operatingExpenses.depreciation;
  const growthRate = 0.05;
  const discountRate = 0.10;
  const terminalValue = (fcf * (1 + growthRate)) / (discountRate - growthRate);
  const dcf = fcf * 5 + terminalValue / Math.pow(1 + discountRate, 5);
  
  // Multiples
  const ebitdaMultiple = 6;
  const multiples = ratios.valuation.ebitda * ebitdaMultiple;
  
  // Asset-based
  const assetBased = balance.liabilities.equity.totalEquity;
  
  return {
    dcf,
    multiples,
    assetBased,
    average: (dcf + multiples + assetBased) / 3,
  };
}

// ==================== TAX OPTIMIZATION ====================

export interface TaxOptimizationSuggestion {
  id: string;
  name: string;
  description: string;
  potentialSaving: number;
  implementationCost: number;
  risk: 'low' | 'medium' | 'high';
  category: 'deduction' | 'credit' | 'deferral' | 'structure';
}

export function analyzeTaxOptimization(company: Company): TaxOptimizationSuggestion[] {
  const suggestions: TaxOptimizationSuggestion[] = [];
  
  // CIR (Crédit Impôt Recherche)
  if (company.products.some(p => p.phase === 'rd')) {
    const rdSpending = company.products
      .filter(p => p.phase === 'rd')
      .reduce((sum, p) => sum + p.rdCost, 0);
    suggestions.push({
      id: 'cir',
      name: 'Crédit Impôt Recherche (CIR)',
      description: 'Crédit d\'impôt de 30% sur les dépenses R&D éligibles',
      potentialSaving: rdSpending * 0.30,
      implementationCost: 2000,
      risk: 'low',
      category: 'credit',
    });
  }
  
  // JEI (Jeune Entreprise Innovante)
  if (company.foundedDate < 365 * 8 && company.innovationScore > 70) {
    suggestions.push({
      id: 'jei',
      name: 'Statut JEI',
      description: 'Exonération charges sociales + IS pour les jeunes entreprises innovantes',
      potentialSaving: company.employees.reduce((sum, e) => sum + e.brutSalary * 0.45, 0) * 0.5,
      implementationCost: 1500,
      risk: 'medium',
      category: 'structure',
    });
  }
  
  // Provisions
  if (company.clients.some(c => c.creditRating < 50)) {
    const riskyReceivables = company.invoices
      .filter(i => !i.paid)
      .reduce((sum, i) => sum + i.amount * 0.3, 0);
    suggestions.push({
      id: 'provision_clients',
      name: 'Provision pour créances douteuses',
      description: 'Déduire les provisions pour clients à risque',
      potentialSaving: riskyReceivables * 0.25,
      implementationCost: 500,
      risk: 'low',
      category: 'deduction',
    });
  }
  
  // Amortissements accélérés
  if (company.properties.length > 0) {
    const eligibleAssets = company.properties.filter(p => p.leaseType === 'achat');
    if (eligibleAssets.length > 0) {
      suggestions.push({
        id: 'amortissement_derogatoire',
        name: 'Amortissement dégressif',
        description: 'Utiliser l\'amortissement dégressif sur les actifs éligibles',
        potentialSaving: eligibleAssets.reduce((sum, a) => sum + a.currentValue * 0.05, 0),
        implementationCost: 0,
        risk: 'low',
        category: 'deferral',
      });
    }
  }
  
  // Intégration fiscale
  if (company.subsidiaries.length >= 1) {
    suggestions.push({
      id: 'integration_fiscale',
      name: 'Intégration fiscale',
      description: 'Consolider les résultats du groupe pour optimiser l\'IS',
      potentialSaving: company.subsidiaries.reduce((sum, s) => 
        sum + Math.max(0, -s.revenue + s.expenses) * 0.25, 0),
      implementationCost: 5000,
      risk: 'low',
      category: 'structure',
    });
  }
  
  return suggestions;
}
