// Advanced HR Engine - Training, Unions, Benefits
import {
  Employee,
  Training,
  TrainingType,
  SocialBenefit,
  BenefitType,
  Union,
  UnionDemand,
  TRAINING_CONFIGS,
  BENEFIT_CONFIGS,
  Company,
} from '@/types/game';

const generateId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== TRAINING ====================

export function createTraining(
  employeeId: string,
  type: TrainingType,
  currentDay: number
): { training: Training; cost: number } {
  const config = TRAINING_CONFIGS[type];

  return {
    training: {
      id: generateId('train'),
      employeeId,
      type,
      name: config.name,
      duration: config.duration,
      cost: config.baseCost,
      skillBoost: config.skillBoost,
      startDate: currentDay,
      completed: false,
    },
    cost: config.baseCost,
  };
}

export function processTraining(
  employee: Employee,
  currentDay: number
): Employee {
  const updatedEmployee = { ...employee };
  
  updatedEmployee.trainings = employee.trainings.map(training => {
    if (training.completed) return training;

    const daysElapsed = currentDay - training.startDate;
    
    if (daysElapsed >= training.duration) {
      // Training completed
      training.completed = true;
      updatedEmployee.skills = Math.min(100, updatedEmployee.skills + training.skillBoost);
      updatedEmployee.moral = Math.min(100, updatedEmployee.moral + 5);
      updatedEmployee.experience += training.duration;
    } else {
      // During training, reduced productivity
      updatedEmployee.productivity = Math.max(50, updatedEmployee.productivity - 20);
    }

    return training;
  });

  return updatedEmployee;
}

export function getTrainingRecommendations(employee: Employee): TrainingType[] {
  const recommendations: TrainingType[] = [];

  if (employee.skills < 50) {
    recommendations.push('technique');
  }
  if (employee.role.includes('Manager') || employee.promotions > 1) {
    recommendations.push('management');
  }
  if (employee.role.includes('Commercial')) {
    recommendations.push('commercial');
  }
  // Security training always recommended
  if (employee.trainings.filter(t => t.type === 'securite').length === 0) {
    recommendations.push('securite');
  }

  return recommendations;
}

// ==================== SOCIAL BENEFITS ====================

export function createSocialBenefit(type: BenefitType, employeeCount: number): SocialBenefit {
  const config = BENEFIT_CONFIGS[type];

  return {
    type,
    name: config.name,
    monthlyCost: config.baseCost * employeeCount,
    moralBonus: config.moralBonus,
    active: false,
    eligibleEmployees: employeeCount,
  };
}

export function calculateBenefitsCost(benefits: SocialBenefit[], employeeCount: number): number {
  return benefits
    .filter(b => b.active)
    .reduce((sum, b) => {
      const config = BENEFIT_CONFIGS[b.type];
      return sum + config.baseCost * employeeCount;
    }, 0);
}

export function applyBenefitsMoralBonus(
  employees: Employee[],
  benefits: SocialBenefit[]
): Employee[] {
  const totalBonus = benefits
    .filter(b => b.active)
    .reduce((sum, b) => sum + b.moralBonus, 0);

  return employees.map(emp => ({
    ...emp,
    moral: Math.min(100, emp.moral + totalBonus / 10), // Apply fraction per day
  }));
}

export function getAvailableBenefits(employeeCount: number): SocialBenefit[] {
  return (Object.keys(BENEFIT_CONFIGS) as BenefitType[]).map(type =>
    createSocialBenefit(type, employeeCount)
  );
}

// ==================== UNIONS ====================

const UNION_NAMES = [
  'CGT Entreprise', 'CFDT Section', 'FO Locale', 
  'CFE-CGC Cadres', 'CFTC', 'SUD Solidaires'
];

export function createUnion(employeeCount: number, currentDay: number): Union {
  const name = UNION_NAMES[Math.floor(Math.random() * UNION_NAMES.length)];
  const memberCount = Math.floor(employeeCount * (0.1 + Math.random() * 0.3));

  return {
    id: generateId('union'),
    name,
    memberCount,
    influence: 20 + Math.floor(Math.random() * 30),
    demands: [],
    lastNegotiation: currentDay,
    relationship: 50,
  };
}

export function generateUnionDemand(
  union: Union,
  company: Company
): UnionDemand {
  const demandTypes: UnionDemand['type'][] = ['salaire', 'conditions', 'avantages', 'securite', 'temps_travail'];
  const type = demandTypes[Math.floor(Math.random() * demandTypes.length)];

  const templates: Record<UnionDemand['type'], { descriptions: string[]; costRange: [number, number] }> = {
    salaire: {
      descriptions: [
        'Augmentation générale des salaires de 5%',
        'Prime exceptionnelle de 500€',
        'Revalorisation de la grille salariale',
        'Augmentation du SMIC interne',
      ],
      costRange: [5000, 30000],
    },
    conditions: {
      descriptions: [
        'Amélioration des conditions de travail',
        'Climatisation des locaux',
        'Rénovation des espaces communs',
        'Équipements ergonomiques',
      ],
      costRange: [3000, 20000],
    },
    avantages: {
      descriptions: [
        'Augmentation des tickets restaurant',
        'Meilleure mutuelle d\'entreprise',
        'Prime de transport augmentée',
        'Mise en place du télétravail',
      ],
      costRange: [2000, 15000],
    },
    securite: {
      descriptions: [
        'Renforcement des mesures de sécurité',
        'Formation sécurité obligatoire',
        'Équipements de protection',
        'Audit des conditions de travail',
      ],
      costRange: [1000, 10000],
    },
    temps_travail: {
      descriptions: [
        'Passage aux 35h effectives',
        'Semaine de 4 jours',
        'Flexibilité des horaires',
        'Jours de RTT supplémentaires',
      ],
      costRange: [5000, 25000],
    },
  };

  const template = templates[type];
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  const costImpact = template.costRange[0] + Math.floor(Math.random() * (template.costRange[1] - template.costRange[0]));

  // Priority based on relationship
  const priorities: UnionDemand['priority'][] = ['faible', 'moyenne', 'haute', 'critique'];
  const priorityIndex = Math.min(3, Math.floor((100 - union.relationship) / 25));

  return {
    id: generateId('demand'),
    type,
    description,
    priority: priorities[priorityIndex],
    costImpact,
    moralImpact: 5 + Math.floor(Math.random() * 15),
  };
}

export function processUnionNegotiation(
  union: Union,
  demand: UnionDemand,
  accepted: boolean,
  company: Company
): {
  union: Union;
  employees: Employee[];
  treasuryImpact: number;
  event: string;
} {
  const updatedUnion = { ...union };
  let treasuryImpact = 0;
  let event: string;

  const demandIndex = updatedUnion.demands.findIndex(d => d.id === demand.id);
  if (demandIndex >= 0) {
    updatedUnion.demands[demandIndex].accepted = accepted;
  }

  if (accepted) {
    treasuryImpact = -demand.costImpact;
    updatedUnion.relationship = Math.min(100, updatedUnion.relationship + 10);
    event = `Demande syndicale acceptée: "${demand.description}"`;
  } else {
    updatedUnion.relationship = Math.max(0, updatedUnion.relationship - 15);
    event = `Demande syndicale refusée: "${demand.description}"`;
  }

  // Update employee moral based on decision
  const moralChange = accepted ? demand.moralImpact : -demand.moralImpact / 2;
  const updatedEmployees = company.employees.map(emp => ({
    ...emp,
    moral: Math.max(0, Math.min(100, emp.moral + moralChange)),
  }));

  return {
    union: updatedUnion,
    employees: updatedEmployees,
    treasuryImpact,
    event,
  };
}

export function checkStrikeRisk(union: Union): { risk: number; reason?: string } {
  if (union.relationship < 20) {
    return { risk: 0.5, reason: 'Relations syndicales très dégradées' };
  }
  if (union.relationship < 40) {
    return { risk: 0.2, reason: 'Tensions avec le syndicat' };
  }
  
  const pendingCritical = union.demands.filter(d => 
    d.priority === 'critique' && d.accepted === undefined
  ).length;
  
  if (pendingCritical > 0) {
    return { risk: 0.3, reason: `${pendingCritical} demande(s) critique(s) en attente` };
  }

  return { risk: 0 };
}

export function triggerStrike(
  company: Company,
  union: Union,
  duration: number
): {
  employees: Employee[];
  productivityLoss: number;
  credibilityLoss: number;
  event: string;
} {
  const strikingEmployees = company.employees.filter(e => 
    e.trait === 'syndicaliste' || e.moral < 40 || Math.random() < union.influence / 100
  );

  const productivityLoss = (strikingEmployees.length / company.employees.length) * 100;
  const credibilityLoss = Math.min(20, strikingEmployees.length * 2);

  const updatedEmployees = company.employees.map(emp => ({
    ...emp,
    productivity: strikingEmployees.find(s => s.id === emp.id) 
      ? 0 
      : Math.max(50, emp.productivity - 20), // Non-strikers also affected
  }));

  return {
    employees: updatedEmployees,
    productivityLoss,
    credibilityLoss,
    event: `⚠️ GRÈVE! ${strikingEmployees.length} employés en grève pour ${duration} jour(s). Productivité: -${Math.round(productivityLoss)}%`,
  };
}

// ==================== EMPLOYEE LIFECYCLE ====================

export function processEmployeePromotion(
  employee: Employee,
  newRole: string,
  salaryIncrease: number
): Employee {
  return {
    ...employee,
    role: newRole,
    brutSalary: Math.round(employee.brutSalary * (1 + salaryIncrease)),
    promotions: employee.promotions + 1,
    moral: Math.min(100, employee.moral + 20),
    productivity: Math.min(150, employee.productivity + 10),
  };
}

export function processAnnualReview(
  employee: Employee,
  currentDay: number
): { employee: Employee; raiseAmount: number; recommendation: string } {
  // Calculate performance score
  const performanceScore = (
    employee.skills * 0.3 +
    employee.productivity * 0.3 +
    employee.moral * 0.2 +
    (100 - employee.absences) * 0.1 +
    employee.experience * 0.1
  ) / 100;

  let raiseAmount = 0;
  let recommendation: string;

  if (performanceScore >= 0.9) {
    raiseAmount = employee.brutSalary * 0.08; // 8% raise
    recommendation = 'Excellent! Promotion recommandée.';
  } else if (performanceScore >= 0.75) {
    raiseAmount = employee.brutSalary * 0.05; // 5% raise
    recommendation = 'Très bon. Augmentation méritée.';
  } else if (performanceScore >= 0.6) {
    raiseAmount = employee.brutSalary * 0.02; // 2% raise
    recommendation = 'Satisfaisant. Ajustement inflation.';
  } else if (performanceScore >= 0.4) {
    raiseAmount = 0;
    recommendation = 'Insuffisant. Plan d\'amélioration requis.';
  } else {
    raiseAmount = 0;
    recommendation = 'Critique. Avertissement recommandé.';
  }

  return {
    employee: {
      ...employee,
      evaluationScore: Math.round(performanceScore * 100),
      lastRaise: raiseAmount > 0 ? currentDay : employee.lastRaise,
      brutSalary: Math.round(employee.brutSalary + raiseAmount),
    },
    raiseAmount: Math.round(raiseAmount),
    recommendation,
  };
}

// ==================== MONTHLY PROCESSING ====================

export function processMonthlyHR(
  company: Company,
  currentDay: number
): {
  company: Company;
  trainingCosts: number;
  benefitsCosts: number;
  events: string[];
} {
  const events: string[] = [];
  let trainingCosts = 0;
  let benefitsCosts = 0;

  const updatedCompany = { ...company };

  // Process trainings
  updatedCompany.employees = company.employees.map(emp => 
    processTraining(emp, currentDay)
  );

  // Check for completed trainings
  const completedTrainings = updatedCompany.employees.flatMap(emp =>
    emp.trainings.filter(t => 
      t.completed && currentDay - t.startDate <= t.duration + 1
    )
  );
  
  if (completedTrainings.length > 0) {
    events.push(`${completedTrainings.length} formation(s) terminée(s)`);
  }

  // Calculate benefits costs
  benefitsCosts = calculateBenefitsCost(
    company.socialBenefits,
    company.employees.length
  );

  // Apply benefits moral bonus
  updatedCompany.employees = applyBenefitsMoralBonus(
    updatedCompany.employees,
    company.socialBenefits
  );

  // Process unions
  updatedCompany.unions = company.unions.map(union => {
    // Random demand generation
    if (Math.random() < 0.1 && union.demands.filter(d => d.accepted === undefined).length < 3) {
      const newDemand = generateUnionDemand(union, company);
      union.demands.push(newDemand);
      events.push(`Nouvelle revendication syndicale: "${newDemand.description}"`);
    }

    // Check strike risk
    const strikeRisk = checkStrikeRisk(union);
    if (strikeRisk.risk > 0 && Math.random() < strikeRisk.risk * 0.1) {
      const strikeResult = triggerStrike(company, union, 1 + Math.floor(Math.random() * 3));
      updatedCompany.employees = strikeResult.employees;
      updatedCompany.credibility = Math.max(0, updatedCompany.credibility - strikeResult.credibilityLoss);
      events.push(strikeResult.event);
    }

    return union;
  });

  // Update seniority
  updatedCompany.employees = updatedCompany.employees.map(emp => ({
    ...emp,
    seniority: Math.floor((currentDay - emp.hireDate) / 365),
  }));

  return {
    company: updatedCompany,
    trainingCosts,
    benefitsCosts,
    events,
  };
}
