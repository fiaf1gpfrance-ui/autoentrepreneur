// Banking System Engine
import {
  BankAccount,
  BankLoan,
  Investment,
  Overdraft,
  LoanType,
  InvestmentType,
  BankRelationship,
  LOAN_CONFIGS,
  INVESTMENT_CONFIGS,
  Company,
  GameState,
} from '@/types/game';

// Generate unique ID
const generateId = (prefix: string) => 
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Create initial bank account
export function createInitialBankAccount(): BankAccount {
  return {
    bankName: 'Banque Nationale',
    relationship: 'nouveau',
    creditScore: 500,
    loans: [],
    overdraft: {
      limit: 0,
      currentUsage: 0,
      interestRate: 0.15,
      monthlyFees: 0,
      approved: false,
    },
    investments: [],
    monthlyFees: 29,
    transactionHistory: [],
  };
}

// Calculate credit score based on company health
export function calculateCreditScore(company: Company, history: number[]): number {
  let score = 500; // Base score

  // Treasury health (0-150 points)
  if (company.treasury > 100000) score += 150;
  else if (company.treasury > 50000) score += 100;
  else if (company.treasury > 20000) score += 50;
  else if (company.treasury > 0) score += 25;
  else score -= 100;

  // Credibility (0-100 points)
  score += company.credibility;

  // Payment history (0-150 points)
  const missedPayments = company.bankAccount.loans.reduce((sum, l) => sum + l.missedPayments, 0);
  score -= missedPayments * 50;

  // Revenue stability (0-100 points)
  if (history.length >= 3) {
    const avgRevenue = history.slice(-3).reduce((a, b) => a + b, 0) / 3;
    if (avgRevenue > 50000) score += 100;
    else if (avgRevenue > 20000) score += 50;
    else if (avgRevenue > 5000) score += 25;
  }

  // Debt ratio (-100 to 0 points)
  const totalDebt = company.bankAccount.loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const debtRatio = totalDebt / Math.max(company.treasury + company.capital, 1);
  if (debtRatio > 2) score -= 100;
  else if (debtRatio > 1) score -= 50;
  else if (debtRatio > 0.5) score -= 25;

  // Seniority bonus
  const seniority = company.employees.reduce((sum, e) => sum + e.seniority, 0) / Math.max(company.employees.length, 1);
  score += Math.min(seniority * 5, 50);

  return Math.max(0, Math.min(1000, Math.round(score)));
}

// Get bank relationship based on credit score and history
export function updateBankRelationship(account: BankAccount): BankRelationship {
  if (account.creditScore >= 800) return 'vip';
  if (account.creditScore >= 650) return 'prefere';
  if (account.creditScore >= 400) return 'client';
  return 'nouveau';
}

// Calculate loan interest rate
export function calculateLoanInterestRate(
  loanType: LoanType,
  creditScore: number,
  relationship: BankRelationship,
  baseRate: number
): number {
  const config = LOAN_CONFIGS[loanType];
  let rate = config.baseRate + baseRate;

  // Credit score adjustment
  if (creditScore >= 800) rate -= 0.015;
  else if (creditScore >= 650) rate -= 0.01;
  else if (creditScore >= 400) rate -= 0.005;
  else if (creditScore < 300) rate += 0.02;

  // Relationship adjustment
  if (relationship === 'vip') rate -= 0.01;
  else if (relationship === 'prefere') rate -= 0.005;

  return Math.max(0.01, Math.round(rate * 1000) / 1000);
}

// Check loan eligibility
export function checkLoanEligibility(
  company: Company,
  loanType: LoanType,
  amount: number
): { eligible: boolean; reason?: string } {
  const config = LOAN_CONFIGS[loanType];
  const account = company.bankAccount;

  if (amount < config.minAmount) {
    return { eligible: false, reason: `Montant minimum: ${config.minAmount}€` };
  }

  if (amount > config.maxAmount) {
    return { eligible: false, reason: `Montant maximum: ${config.maxAmount}€` };
  }

  // Credit score check
  if (account.creditScore < 300) {
    return { eligible: false, reason: 'Score de crédit insuffisant (minimum 300)' };
  }

  // Debt capacity check
  const totalDebt = account.loans.reduce((sum, l) => sum + l.remainingAmount, 0);
  const maxDebt = (company.treasury + company.capital) * 3;
  if (totalDebt + amount > maxDebt) {
    return { eligible: false, reason: 'Capacité d\'endettement dépassée' };
  }

  // Check for guarantee if required
  if (config.requiresGuarantee && company.properties.length === 0 && company.capital < amount * 0.3) {
    return { eligible: false, reason: 'Garantie requise (bien immobilier ou capital suffisant)' };
  }

  return { eligible: true };
}

// Create new loan
export function createLoan(
  company: Company,
  loanType: LoanType,
  amount: number,
  duration: number,
  currentDay: number,
  baseRate: number
): BankLoan | null {
  const eligibility = checkLoanEligibility(company, loanType, amount);
  if (!eligibility.eligible) return null;

  const config = LOAN_CONFIGS[loanType];
  const clampedDuration = Math.max(config.minDuration, Math.min(config.maxDuration, duration));
  
  const interestRate = calculateLoanInterestRate(
    loanType,
    company.bankAccount.creditScore,
    company.bankAccount.relationship,
    baseRate
  );

  const monthlyRate = interestRate / 12;
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, clampedDuration)) / 
    (Math.pow(1 + monthlyRate, clampedDuration) - 1);

  return {
    id: generateId('loan'),
    type: loanType,
    amount,
    remainingAmount: amount,
    interestRate,
    monthlyPayment: Math.round(monthlyPayment),
    startDate: currentDay,
    duration: clampedDuration,
    remainingMonths: clampedDuration,
    penalty: 0,
    missedPayments: 0,
    guarantee: config.requiresGuarantee ? 'capital' : undefined,
  };
}

// Process monthly loan payment
export function processLoanPayment(
  loan: BankLoan,
  treasury: number
): { loan: BankLoan; payment: number; success: boolean } {
  if (loan.remainingAmount <= 0) {
    return { loan, payment: 0, success: true };
  }

  const totalDue = loan.monthlyPayment + loan.penalty;

  if (treasury >= totalDue) {
    // Successful payment
    const interestPayment = loan.remainingAmount * (loan.interestRate / 12);
    const principalPayment = loan.monthlyPayment - interestPayment;
    
    return {
      loan: {
        ...loan,
        remainingAmount: Math.max(0, loan.remainingAmount - principalPayment),
        remainingMonths: loan.remainingMonths - 1,
        penalty: 0,
      },
      payment: totalDue,
      success: true,
    };
  } else {
    // Missed payment
    return {
      loan: {
        ...loan,
        missedPayments: loan.missedPayments + 1,
        penalty: loan.penalty + loan.monthlyPayment * 0.1, // 10% late fee
      },
      payment: 0,
      success: false,
    };
  }
}

// Calculate overdraft fees
export function calculateOverdraftFees(overdraft: Overdraft, daysUsed: number): number {
  if (!overdraft.approved || overdraft.currentUsage <= 0) return 0;
  
  const dailyRate = overdraft.interestRate / 365;
  const interest = overdraft.currentUsage * dailyRate * daysUsed;
  
  return Math.round(interest + overdraft.monthlyFees);
}

// Apply for overdraft
export function applyForOverdraft(
  company: Company,
  requestedLimit: number
): Overdraft | null {
  const creditScore = company.bankAccount.creditScore;
  
  if (creditScore < 350) return null;

  // Max limit based on revenue
  const maxLimit = company.monthlyRevenue * 2;
  const approvedLimit = Math.min(requestedLimit, maxLimit);

  // Interest rate based on credit score
  let rate = 0.18;
  if (creditScore >= 700) rate = 0.12;
  else if (creditScore >= 550) rate = 0.14;
  else if (creditScore >= 400) rate = 0.16;

  return {
    limit: approvedLimit,
    currentUsage: 0,
    interestRate: rate,
    monthlyFees: Math.round(approvedLimit * 0.001), // 0.1% monthly fee
    approved: true,
  };
}

// Create investment
export function createInvestment(
  investmentType: InvestmentType,
  amount: number,
  currentDay: number,
  economicWeather: string
): Investment | null {
  const config = INVESTMENT_CONFIGS[investmentType];

  if (amount < config.minAmount) return null;
  if (amount > config.maxAmount) return null;

  // Adjust rate based on economic conditions
  let adjustedRate = config.baseRate;
  if (economicWeather === 'croissance') adjustedRate += 0.02;
  else if (economicWeather === 'recession') adjustedRate -= 0.01;
  else if (economicWeather === 'crise') adjustedRate -= 0.03;

  // Maturity for locked investments (6 to 24 months)
  const maturityDate = config.locked 
    ? currentDay + Math.floor(Math.random() * 540 + 180) 
    : undefined;

  return {
    id: generateId('inv'),
    type: investmentType,
    amount,
    interestRate: adjustedRate,
    startDate: currentDay,
    maturityDate,
    currentValue: amount,
    locked: config.locked,
  };
}

// Process investment returns
export function processInvestmentReturns(
  investment: Investment,
  currentDay: number,
  economicWeather: string
): Investment {
  const config = INVESTMENT_CONFIGS[investment.type];
  const daysHeld = currentDay - investment.startDate;
  
  // Calculate base return
  let dailyRate = investment.interestRate / 365;
  
  // Apply risk for volatile investments
  if (config.risk > 0) {
    const randomFactor = (Math.random() - 0.5) * config.risk * 2;
    
    // Economic weather affects risky investments more
    let weatherMod = 1;
    if (economicWeather === 'croissance') weatherMod = 1.2;
    else if (economicWeather === 'recession') weatherMod = 0.7;
    else if (economicWeather === 'crise') weatherMod = 0.4;
    
    dailyRate = dailyRate * weatherMod + randomFactor / 365;
  }

  const newValue = investment.amount * Math.pow(1 + dailyRate, daysHeld);

  return {
    ...investment,
    currentValue: Math.round(newValue),
  };
}

// Liquidate investment
export function liquidateInvestment(
  investment: Investment,
  currentDay: number
): { value: number; penalty: number } {
  let penalty = 0;

  // Early withdrawal penalty for locked investments
  if (investment.locked && investment.maturityDate && currentDay < investment.maturityDate) {
    const remainingDays = investment.maturityDate - currentDay;
    penalty = investment.currentValue * 0.02 * Math.min(remainingDays / 30, 1);
  }

  return {
    value: Math.round(investment.currentValue - penalty),
    penalty: Math.round(penalty),
  };
}

// Get available banks (for switching)
export function getAvailableBanks(creditScore: number): {
  name: string;
  monthlyFees: number;
  loanRateBonus: number;
  overdraftRateBonus: number;
  minCreditScore: number;
}[] {
  const banks = [
    { name: 'Banque Nationale', monthlyFees: 29, loanRateBonus: 0, overdraftRateBonus: 0, minCreditScore: 0 },
    { name: 'Crédit Mutuel Pro', monthlyFees: 35, loanRateBonus: -0.005, overdraftRateBonus: -0.01, minCreditScore: 400 },
    { name: 'BNP Entreprises', monthlyFees: 45, loanRateBonus: -0.01, overdraftRateBonus: -0.015, minCreditScore: 500 },
    { name: 'Société Générale Elite', monthlyFees: 59, loanRateBonus: -0.015, overdraftRateBonus: -0.02, minCreditScore: 600 },
    { name: 'Banque Rothschild', monthlyFees: 150, loanRateBonus: -0.025, overdraftRateBonus: -0.03, minCreditScore: 800 },
  ];

  return banks.filter(b => b.minCreditScore <= creditScore);
}

// Process all banking for a month
export function processMonthlyBanking(
  company: Company,
  currentDay: number,
  economicWeather: string
): {
  company: Company;
  loanPayments: number;
  investmentReturns: number;
  fees: number;
  events: string[];
} {
  const events: string[] = [];
  let loanPayments = 0;
  let investmentReturns = 0;
  let fees = company.bankAccount.monthlyFees;

  const updatedAccount = { ...company.bankAccount };
  let updatedTreasury = company.treasury;

  // Process loan payments
  updatedAccount.loans = updatedAccount.loans.map(loan => {
    const result = processLoanPayment(loan, updatedTreasury);
    if (result.success) {
      loanPayments += result.payment;
      updatedTreasury -= result.payment;
    } else {
      events.push(`Échéance de prêt impayée: ${loan.monthlyPayment}€`);
    }
    return result.loan;
  });

  // Remove fully repaid loans
  const repaidLoans = updatedAccount.loans.filter(l => l.remainingAmount <= 0);
  if (repaidLoans.length > 0) {
    events.push(`${repaidLoans.length} prêt(s) remboursé(s) intégralement !`);
  }
  updatedAccount.loans = updatedAccount.loans.filter(l => l.remainingAmount > 0);

  // Process overdraft fees
  if (updatedAccount.overdraft.currentUsage > 0) {
    const overdraftFees = calculateOverdraftFees(updatedAccount.overdraft, 30);
    fees += overdraftFees;
    events.push(`Agios découvert: ${overdraftFees}€`);
  }

  // Process investment returns
  updatedAccount.investments = updatedAccount.investments.map(inv => 
    processInvestmentReturns(inv, currentDay, economicWeather)
  );

  investmentReturns = updatedAccount.investments.reduce(
    (sum, inv) => sum + (inv.currentValue - inv.amount), 0
  );

  // Update credit score
  const revenueHistory = company.financialHistory.slice(-6).map(h => h.revenue);
  updatedAccount.creditScore = calculateCreditScore(
    { ...company, bankAccount: updatedAccount },
    revenueHistory
  );

  // Update relationship
  updatedAccount.relationship = updateBankRelationship(updatedAccount);

  // Deduct fees
  updatedTreasury -= fees;

  return {
    company: {
      ...company,
      treasury: updatedTreasury,
      bankAccount: updatedAccount,
    },
    loanPayments,
    investmentReturns,
    fees,
    events,
  };
}

// Format bank score as rating
export function formatCreditRating(score: number): string {
  if (score >= 800) return 'AAA';
  if (score >= 700) return 'AA';
  if (score >= 600) return 'A';
  if (score >= 500) return 'BBB';
  if (score >= 400) return 'BB';
  if (score >= 300) return 'B';
  if (score >= 200) return 'CCC';
  return 'D';
}
