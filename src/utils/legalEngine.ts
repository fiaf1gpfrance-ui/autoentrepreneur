// Legal System Engine
import {
  LegalCase,
  LegalCaseType,
  LegalCaseStatus,
  Lawyer,
  IntellectualProperty,
  Company,
} from '@/types/game';

const generateId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== LAWYERS ====================

const LAWYER_NAMES = [
  'Me. Dupont', 'Me. Martin', 'Me. Bernard', 'Me. Leroy',
  'Me. Durand', 'Me. Moreau', 'Me. Simon', 'Me. Laurent'
];

const LAWYER_FIRMS = [
  'Cabinet Juridique Paris', 'Avocats & Associés', 'LexPro',
  'Cabinet d\'affaires Parisien', 'Droit & Conseil'
];

export function generateLawyer(specialty: LegalCaseType): Lawyer {
  const name = LAWYER_NAMES[Math.floor(Math.random() * LAWYER_NAMES.length)];
  const firm = LAWYER_FIRMS[Math.floor(Math.random() * LAWYER_FIRMS.length)];
  
  const baseRates: Record<LegalCaseType, number> = {
    prudhommes: 200,
    commercial: 300,
    fiscal: 400,
    propriete_intellectuelle: 350,
    contrat: 250,
  };

  const successRate = 50 + Math.floor(Math.random() * 40);
  const reputation = 40 + Math.floor(Math.random() * 50);
  
  // Higher reputation = higher rates
  const rateMultiplier = 1 + (reputation - 50) / 100;

  return {
    id: generateId('law'),
    name: `${name} (${firm})`,
    specialty,
    hourlyRate: Math.round(baseRates[specialty] * rateMultiplier),
    successRate,
    reputation,
  };
}

export function getAvailableLawyers(caseType: LegalCaseType): Lawyer[] {
  // Generate 3-5 lawyers for the specialty
  const count = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: count }, () => generateLawyer(caseType));
}

// ==================== LEGAL CASES ====================

const CASE_TEMPLATES: Record<LegalCaseType, { titles: string[]; descriptions: string[] }> = {
  prudhommes: {
    titles: [
      'Contestation de licenciement',
      'Harcèlement moral allégué',
      'Heures supplémentaires impayées',
      'Rupture conventionnelle contestée',
    ],
    descriptions: [
      'Un ancien employé conteste les conditions de son départ.',
      'Un salarié porte plainte pour conditions de travail dégradées.',
      'Réclamation de compensation pour heures non rémunérées.',
    ],
  },
  commercial: {
    titles: [
      'Rupture abusive de contrat',
      'Concurrence déloyale',
      'Litige fournisseur',
      'Non-paiement client',
    ],
    descriptions: [
      'Un partenaire commercial conteste la fin de votre relation.',
      'Un concurrent vous accuse de pratiques déloyales.',
      'Différend sur les termes d\'un contrat commercial.',
    ],
  },
  fiscal: {
    titles: [
      'Redressement fiscal',
      'Contestation TVA',
      'Contrôle URSSAF',
      'Fraude fiscale alléguée',
    ],
    descriptions: [
      'L\'administration fiscale remet en cause vos déclarations.',
      'Désaccord sur le montant de TVA à reverser.',
      'L\'URSSAF conteste vos déclarations de charges.',
    ],
  },
  propriete_intellectuelle: {
    titles: [
      'Contrefaçon de marque',
      'Violation de brevet',
      'Plagiat de design',
      'Usurpation de nom commercial',
    ],
    descriptions: [
      'Un concurrent utilise illégalement votre propriété intellectuelle.',
      'Vous êtes accusé de violer un brevet existant.',
      'Litige sur la propriété d\'une création.',
    ],
  },
  contrat: {
    titles: [
      'Inexécution contractuelle',
      'Vice de consentement',
      'Clause abusive',
      'Résiliation anticipée',
    ],
    descriptions: [
      'Un cocontractant ne respecte pas ses engagements.',
      'Contestation de la validité d\'un contrat signé.',
      'Différend sur l\'interprétation des clauses.',
    ],
  },
};

export function generateLegalCase(
  type: LegalCaseType,
  currentDay: number,
  opponent: string
): LegalCase {
  const template = CASE_TEMPLATES[type];
  const title = template.titles[Math.floor(Math.random() * template.titles.length)];
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];

  const baseCosts: Record<LegalCaseType, { min: number; max: number }> = {
    prudhommes: { min: 5000, max: 30000 },
    commercial: { min: 10000, max: 100000 },
    fiscal: { min: 15000, max: 200000 },
    propriete_intellectuelle: { min: 20000, max: 150000 },
    contrat: { min: 8000, max: 50000 },
  };

  const costs = baseCosts[type];
  const estimatedCost = costs.min + Math.floor(Math.random() * (costs.max - costs.min));
  const potentialLoss = estimatedCost * (1.5 + Math.random() * 2);
  const potentialGain = type === 'commercial' || type === 'propriete_intellectuelle' 
    ? estimatedCost * (0.5 + Math.random() * 1.5) 
    : 0;

  return {
    id: generateId('case'),
    type,
    title,
    description,
    status: 'preparation',
    startDate: currentDay,
    estimatedCost,
    actualCost: 0,
    potentialLoss,
    potentialGain,
    winProbability: 40 + Math.floor(Math.random() * 30), // Base 40-70%
    opponent,
  };
}

export function assignLawyer(legalCase: LegalCase, lawyer: Lawyer): LegalCase {
  // Lawyer improves win probability
  const bonusProbability = (lawyer.successRate - 50) / 2 + (lawyer.reputation - 50) / 4;
  
  return {
    ...legalCase,
    lawyerId: lawyer.id,
    winProbability: Math.min(95, legalCase.winProbability + bonusProbability),
  };
}

export function progressCase(
  legalCase: LegalCase,
  lawyer: Lawyer | undefined,
  currentDay: number
): { case: LegalCase; event?: string; cost: number } {
  const daysSinceStart = currentDay - legalCase.startDate;
  let cost = 0;
  let event: string | undefined;

  const updatedCase = { ...legalCase };

  // Status progression based on time
  const statusProgression: Record<LegalCaseStatus, { next: LegalCaseStatus; minDays: number }> = {
    preparation: { next: 'en_cours', minDays: 30 },
    en_cours: { next: 'mediation', minDays: 60 },
    mediation: { next: 'jugement', minDays: 30 },
    jugement: { next: 'cloture', minDays: 45 },
    appel: { next: 'cloture', minDays: 90 },
    cloture: { next: 'cloture', minDays: 0 },
  };

  const progression = statusProgression[updatedCase.status];
  
  if (daysSinceStart >= progression.minDays && Math.random() < 0.1) {
    updatedCase.status = progression.next;
    event = `Affaire "${updatedCase.title}" passe en phase: ${progression.next}`;
  }

  // Monthly costs if lawyer assigned
  if (lawyer && updatedCase.status !== 'cloture') {
    const monthlyHours = 5 + Math.floor(Math.random() * 10);
    cost = monthlyHours * lawyer.hourlyRate;
    updatedCase.actualCost += cost;
  }

  // Random mediation opportunity
  if (updatedCase.status === 'en_cours' && Math.random() < 0.05) {
    event = `Proposition de médiation pour "${updatedCase.title}"`;
  }

  return { case: updatedCase, event, cost };
}

export function resolveCase(
  legalCase: LegalCase
): { won: boolean; financialResult: number; credibilityImpact: number } {
  const roll = Math.random() * 100;
  const won = roll < legalCase.winProbability;

  let financialResult = -legalCase.actualCost;
  let credibilityImpact = 0;

  if (won) {
    financialResult += legalCase.potentialGain;
    credibilityImpact = 5;
  } else {
    financialResult -= legalCase.potentialLoss * 0.5; // Usually settle for less than max
    credibilityImpact = -10;
  }

  return {
    won,
    financialResult: Math.round(financialResult),
    credibilityImpact,
  };
}

// ==================== INTELLECTUAL PROPERTY ====================

const IP_COSTS: Record<IntellectualProperty['type'], { registration: number; annual: number; duration: number }> = {
  brevet: { registration: 5000, annual: 1500, duration: 20 * 365 },
  marque: { registration: 500, annual: 200, duration: 10 * 365 },
  droit_auteur: { registration: 100, annual: 0, duration: 70 * 365 },
  dessin_modele: { registration: 300, annual: 100, duration: 25 * 365 },
};

export function registerIntellectualProperty(
  type: IntellectualProperty['type'],
  name: string,
  currentDay: number,
  estimatedValue: number
): { ip: IntellectualProperty; cost: number } {
  const config = IP_COSTS[type];

  return {
    ip: {
      id: generateId('ip'),
      type,
      name,
      registrationDate: currentDay,
      expirationDate: currentDay + config.duration,
      annualFee: config.annual,
      value: estimatedValue,
    },
    cost: config.registration,
  };
}

export function processIPAnnualFees(
  intellectualProperty: IntellectualProperty[],
  currentDay: number
): { updated: IntellectualProperty[]; totalFees: number; expired: string[] } {
  let totalFees = 0;
  const expired: string[] = [];

  const updated = intellectualProperty.filter(ip => {
    // Check expiration
    if (currentDay > ip.expirationDate) {
      expired.push(ip.name);
      return false;
    }

    // Annual fees (simplified - once per year)
    if ((currentDay - ip.registrationDate) % 365 === 0) {
      totalFees += ip.annualFee;
    }

    return true;
  });

  return { updated, totalFees, expired };
}

// ==================== MONTHLY PROCESSING ====================

export function processMonthlyLegal(
  company: Company,
  currentDay: number
): {
  company: Company;
  legalCosts: number;
  ipCosts: number;
  events: string[];
} {
  const events: string[] = [];
  let legalCosts = 0;
  let ipCosts = 0;

  const updatedCompany = { ...company };

  // Process legal cases
  updatedCompany.legalCases = company.legalCases.map(legalCase => {
    if (legalCase.status === 'cloture') return legalCase;

    const lawyer = company.lawyers.find(l => l.id === legalCase.lawyerId);
    const result = progressCase(legalCase, lawyer, currentDay);
    
    legalCosts += result.cost;
    if (result.event) events.push(result.event);

    // Check if case should be resolved
    if (result.case.status === 'jugement' && Math.random() < 0.2) {
      const resolution = resolveCase(result.case);
      result.case.status = 'cloture';
      
      if (resolution.won) {
        events.push(`✅ Victoire: "${result.case.title}" - Gain: ${resolution.financialResult}€`);
      } else {
        events.push(`❌ Défaite: "${result.case.title}" - Perte: ${Math.abs(resolution.financialResult)}€`);
      }
      
      updatedCompany.treasury += resolution.financialResult;
      updatedCompany.credibility = Math.max(0, Math.min(100, 
        updatedCompany.credibility + resolution.credibilityImpact
      ));
    }

    return result.case;
  });

  // Process IP
  const ipResult = processIPAnnualFees(company.intellectualProperty, currentDay);
  updatedCompany.intellectualProperty = ipResult.updated;
  ipCosts = ipResult.totalFees;
  
  if (ipResult.expired.length > 0) {
    events.push(`Propriétés intellectuelles expirées: ${ipResult.expired.join(', ')}`);
  }

  return {
    company: updatedCompany,
    legalCosts,
    ipCosts,
    events,
  };
}

// Generate random legal events
export function generateLegalEvent(
  company: Company,
  currentDay: number
): LegalCase | null {
  // 2% chance per day
  if (Math.random() > 0.02) return null;

  const types: LegalCaseType[] = ['prudhommes', 'commercial', 'fiscal', 'contrat'];
  const type = types[Math.floor(Math.random() * types.length)];

  const opponents = [
    'Ancien employé', 'Concurrent', 'Administration fiscale',
    'Fournisseur mécontent', 'Client insatisfait', 'Syndicat'
  ];
  const opponent = opponents[Math.floor(Math.random() * opponents.length)];

  // More likely if credibility is low
  const probabilityModifier = (100 - company.credibility) / 200;
  
  if (Math.random() < 0.5 + probabilityModifier) {
    return generateLegalCase(type, currentDay, opponent);
  }

  return null;
}
