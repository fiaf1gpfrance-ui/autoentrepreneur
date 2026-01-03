// Système d'assurances complet avec 12 types et gestion des risques

export type InsuranceCategory = 'professional' | 'hr' | 'specialized';
export type InsuranceStatus = 'active' | 'pending' | 'expired' | 'cancelled' | 'refused';
export type ClaimStatus = 'pending' | 'investigating' | 'approved' | 'rejected' | 'paid';

export interface Insurance {
  id: string;
  type: InsuranceType;
  category: InsuranceCategory;
  name: string;
  description: string;
  provider: InsuranceProvider;
  status: InsuranceStatus;
  
  // Couverture
  coverageLevel: 'basic' | 'standard' | 'premium' | 'unlimited';
  coverageAmount: number; // Montant max de couverture
  deductible: number; // Franchise
  
  // Coûts
  monthlyPremium: number;
  yearlyPremium: number;
  
  // Bonus/Malus
  bonusMalus: number; // -50 à +100 (- = réduction, + = majoration)
  claimsHistory: number; // Nombre de sinistres
  
  // Dates
  startDate: number;
  endDate: number;
  lastPayment: number;
  
  // Sinistres couverts
  coveredRisks: Risk[];
  exclusions: string[];
}

export type InsuranceType = 
  // Professionnelles (4)
  | 'civil_liability' // RC Pro
  | 'property' // Locaux et biens
  | 'business_interruption' // Perte d'exploitation
  | 'cyber' // Cyber-assurance
  // RH/Dirigeants (4)
  | 'key_person' // Homme-clé
  | 'directors_officers' // D&O
  | 'workplace_accident' // Accidents du travail
  | 'legal_protection' // Protection juridique
  // Spécialisées (4)
  | 'credit' // Crédit-client
  | 'transport' // Transport
  | 'product_recall' // Rappel produits
  | 'political_risk'; // Risques politiques

export interface InsuranceProvider {
  id: string;
  name: string;
  tier: 'budget' | 'standard' | 'premium';
  reliability: number; // 0-100
  claimProcessSpeed: number; // Jours moyens
  customerService: number; // 0-100
  priceMultiplier: number; // Multiplicateur de prix
  specialties: InsuranceType[];
  refusalThreshold: number; // Seuil de réputation pour refus
}

export interface Risk {
  id: string;
  type: RiskType;
  name: string;
  description: string;
  probability: number; // 0-100 par an
  baseDamage: number;
  maxDamage: number;
  affectedAreas: string[];
  requiredInsurance: InsuranceType[];
  mitigationFactors: MitigationFactor[];
}

export type RiskType = 
  | 'fire'
  | 'flood'
  | 'theft'
  | 'natural_disaster'
  | 'cyber_attack'
  | 'data_breach'
  | 'equipment_failure'
  | 'supply_chain'
  | 'employee_injury'
  | 'lawsuit'
  | 'product_defect'
  | 'client_default'
  | 'transport_damage'
  | 'key_person_loss'
  | 'political_event'
  | 'reputation_crisis';

export interface MitigationFactor {
  type: string;
  reduction: number; // Réduction de probabilité en %
  description: string;
}

export interface Claim {
  id: string;
  insuranceId: string;
  insuranceType: InsuranceType;
  status: ClaimStatus;
  
  // Détails du sinistre
  eventType: RiskType;
  eventDate: number;
  reportDate: number;
  description: string;
  
  // Montants
  claimedAmount: number;
  approvedAmount?: number;
  paidAmount?: number;
  deductibleApplied: number;
  
  // Processus
  investigationStartDate?: number;
  resolutionDate?: number;
  documents: string[];
  notes: string[];
  
  // Impact
  reputationImpact: number;
  businessImpact: number;
}

export interface Incident {
  id: string;
  type: RiskType;
  title: string;
  description: string;
  date: number;
  severity: number; // 1-10
  
  // Dommages
  directDamage: number;
  indirectDamage: number;
  
  // Assurance
  isCovered: boolean;
  applicableInsurance?: InsuranceType;
  claimId?: string;
  
  // Statut
  isResolved: boolean;
  resolutionCost: number;
  daysSinceIncident: number;
}

export interface InsuranceBroker {
  id: string;
  name: string;
  fee: number; // Pourcentage des primes
  effectiveness: number; // Réduction des primes en %
  specialties: InsuranceCategory[];
  connections: string[]; // IDs des providers avec bonus
  reputation: number;
  isContracted: boolean;
}

// État global des assurances
export interface InsuranceState {
  policies: Insurance[];
  claims: Claim[];
  incidents: Incident[];
  providers: InsuranceProvider[];
  broker?: InsuranceBroker;
  
  // Stats
  totalPremiums: number; // Total mensuel
  totalCoverage: number;
  claimsThisYear: number;
  averageBonusMalus: number;
  
  // Réputation assurance
  insuranceScore: number; // Score de risque calculé
  lastAssessment: number;
}

// Templates des assurances
export const INSURANCE_DEFINITIONS: Omit<Insurance, 'id' | 'provider' | 'status' | 'startDate' | 'endDate' | 'lastPayment' | 'claimsHistory' | 'bonusMalus'>[] = [
  // Professionnelles
  {
    type: 'civil_liability',
    category: 'professional',
    name: "Responsabilité Civile Professionnelle",
    description: "Couvre les dommages causés aux tiers dans le cadre de l'activité",
    coverageLevel: 'standard',
    coverageAmount: 500000,
    deductible: 1000,
    monthlyPremium: 200,
    yearlyPremium: 2200,
    coveredRisks: [],
    exclusions: ["Faute intentionnelle", "Activités non déclarées"]
  },
  {
    type: 'property',
    category: 'professional',
    name: "Assurance Locaux et Biens",
    description: "Protège les locaux et équipements contre incendie, vol, dégâts des eaux",
    coverageLevel: 'standard',
    coverageAmount: 1000000,
    deductible: 2500,
    monthlyPremium: 350,
    yearlyPremium: 3800,
    coveredRisks: [],
    exclusions: ["Usure normale", "Guerre"]
  },
  {
    type: 'business_interruption',
    category: 'professional',
    name: "Perte d'Exploitation",
    description: "Compense la perte de revenus en cas d'arrêt d'activité forcé",
    coverageLevel: 'standard',
    coverageAmount: 300000,
    deductible: 5000,
    monthlyPremium: 400,
    yearlyPremium: 4400,
    coveredRisks: [],
    exclusions: ["Grèves internes", "Difficultés économiques"]
  },
  {
    type: 'cyber',
    category: 'professional',
    name: "Cyber-Assurance",
    description: "Protection contre piratage, ransomware, fuites de données",
    coverageLevel: 'standard',
    coverageAmount: 250000,
    deductible: 3000,
    monthlyPremium: 500,
    yearlyPremium: 5500,
    coveredRisks: [],
    exclusions: ["Négligence caractérisée", "Systèmes non à jour"]
  },
  
  // RH/Dirigeants
  {
    type: 'key_person',
    category: 'hr',
    name: "Assurance Homme-Clé",
    description: "Protège contre la perte d'un dirigeant ou talent critique",
    coverageLevel: 'standard',
    coverageAmount: 500000,
    deductible: 0,
    monthlyPremium: 300,
    yearlyPremium: 3300,
    coveredRisks: [],
    exclusions: ["Démission volontaire", "Activités dangereuses non déclarées"]
  },
  {
    type: 'directors_officers',
    category: 'hr',
    name: "Responsabilité des Dirigeants (D&O)",
    description: "Protège le patrimoine personnel des dirigeants en cas de mise en cause",
    coverageLevel: 'standard',
    coverageAmount: 1000000,
    deductible: 5000,
    monthlyPremium: 450,
    yearlyPremium: 5000,
    coveredRisks: [],
    exclusions: ["Fraude intentionnelle", "Enrichissement personnel illicite"]
  },
  {
    type: 'workplace_accident',
    category: 'hr',
    name: "Accidents du Travail",
    description: "Couverture complémentaire des accidents et maladies professionnelles",
    coverageLevel: 'standard',
    coverageAmount: 200000,
    deductible: 500,
    monthlyPremium: 150,
    yearlyPremium: 1650,
    coveredRisks: [],
    exclusions: ["Alcoolémie", "Non-respect des consignes de sécurité"]
  },
  {
    type: 'legal_protection',
    category: 'hr',
    name: "Protection Juridique",
    description: "Frais d'avocats et procédures en cas de litige",
    coverageLevel: 'standard',
    coverageAmount: 100000,
    deductible: 1000,
    monthlyPremium: 180,
    yearlyPremium: 2000,
    coveredRisks: [],
    exclusions: ["Procédures pénales", "Litiges avec l'assureur"]
  },
  
  // Spécialisées
  {
    type: 'credit',
    category: 'specialized',
    name: "Assurance Crédit-Client",
    description: "Protection contre les impayés clients",
    coverageLevel: 'standard',
    coverageAmount: 200000,
    deductible: 2000,
    monthlyPremium: 250,
    yearlyPremium: 2750,
    coveredRisks: [],
    exclusions: ["Clients non vérifiés", "Dépassement de crédit autorisé"]
  },
  {
    type: 'transport',
    category: 'specialized',
    name: "Assurance Transport",
    description: "Couvre les pertes et dommages pendant le transport des marchandises",
    coverageLevel: 'standard',
    coverageAmount: 150000,
    deductible: 1500,
    monthlyPremium: 200,
    yearlyPremium: 2200,
    coveredRisks: [],
    exclusions: ["Emballage inadapté", "Retards"]
  },
  {
    type: 'product_recall',
    category: 'specialized',
    name: "Assurance Rappel de Produits",
    description: "Coûts de rappel, communication, indemnisation clients",
    coverageLevel: 'standard',
    coverageAmount: 500000,
    deductible: 10000,
    monthlyPremium: 350,
    yearlyPremium: 3850,
    coveredRisks: [],
    exclusions: ["Défaut connu avant lancement", "Non-respect des normes"]
  },
  {
    type: 'political_risk',
    category: 'specialized',
    name: "Risques Politiques",
    description: "Expropriation, guerre, embargo pour l'international",
    coverageLevel: 'standard',
    coverageAmount: 1000000,
    deductible: 25000,
    monthlyPremium: 600,
    yearlyPremium: 6600,
    coveredRisks: [],
    exclusions: ["Pays sous sanctions", "Investissements non déclarés"]
  }
];

export const INSURANCE_PROVIDER_TEMPLATES: Omit<InsuranceProvider, 'id'>[] = [
  {
    name: "AssurEco",
    tier: "budget",
    reliability: 65,
    claimProcessSpeed: 45,
    customerService: 55,
    priceMultiplier: 0.8,
    specialties: ['civil_liability', 'property', 'workplace_accident'],
    refusalThreshold: 30
  },
  {
    name: "ProAssur",
    tier: "standard",
    reliability: 80,
    claimProcessSpeed: 30,
    customerService: 75,
    priceMultiplier: 1.0,
    specialties: ['civil_liability', 'property', 'business_interruption', 'legal_protection'],
    refusalThreshold: 20
  },
  {
    name: "EliteProtect",
    tier: "premium",
    reliability: 95,
    claimProcessSpeed: 14,
    customerService: 92,
    priceMultiplier: 1.4,
    specialties: ['directors_officers', 'key_person', 'cyber', 'product_recall'],
    refusalThreshold: 10
  },
  {
    name: "GlobalRisk",
    tier: "premium",
    reliability: 90,
    claimProcessSpeed: 21,
    customerService: 85,
    priceMultiplier: 1.3,
    specialties: ['political_risk', 'transport', 'credit'],
    refusalThreshold: 15
  }
];

export const RISK_TEMPLATES: Omit<Risk, 'id'>[] = [
  {
    type: 'fire',
    name: "Incendie",
    description: "Risque d'incendie dans les locaux",
    probability: 2,
    baseDamage: 50000,
    maxDamage: 500000,
    affectedAreas: ['locaux', 'équipements', 'stocks'],
    requiredInsurance: ['property', 'business_interruption'],
    mitigationFactors: [
      { type: 'sprinklers', reduction: 40, description: "Système sprinklers" },
      { type: 'fire_training', reduction: 20, description: "Formation incendie" }
    ]
  },
  {
    type: 'cyber_attack',
    name: "Cyberattaque",
    description: "Piratage, ransomware ou vol de données",
    probability: 15,
    baseDamage: 25000,
    maxDamage: 300000,
    affectedAreas: ['données', 'systèmes', 'réputation'],
    requiredInsurance: ['cyber'],
    mitigationFactors: [
      { type: 'security_audit', reduction: 30, description: "Audit sécurité annuel" },
      { type: 'backup', reduction: 25, description: "Sauvegardes régulières" }
    ]
  },
  {
    type: 'employee_injury',
    name: "Accident du travail",
    description: "Blessure d'un employé sur le lieu de travail",
    probability: 8,
    baseDamage: 5000,
    maxDamage: 100000,
    affectedAreas: ['employés', 'productivité'],
    requiredInsurance: ['workplace_accident', 'legal_protection'],
    mitigationFactors: [
      { type: 'safety_equipment', reduction: 35, description: "Équipements de sécurité" },
      { type: 'safety_training', reduction: 25, description: "Formation sécurité" }
    ]
  },
  {
    type: 'client_default',
    name: "Impayé client",
    description: "Client qui ne paie pas ses factures",
    probability: 20,
    baseDamage: 10000,
    maxDamage: 100000,
    affectedAreas: ['trésorerie'],
    requiredInsurance: ['credit'],
    mitigationFactors: [
      { type: 'credit_check', reduction: 40, description: "Vérification crédit client" },
      { type: 'payment_terms', reduction: 20, description: "Acomptes exigés" }
    ]
  },
  {
    type: 'product_defect',
    name: "Défaut produit",
    description: "Produit défectueux causant des dommages",
    probability: 5,
    baseDamage: 30000,
    maxDamage: 500000,
    affectedAreas: ['produits', 'réputation', 'clients'],
    requiredInsurance: ['civil_liability', 'product_recall'],
    mitigationFactors: [
      { type: 'quality_control', reduction: 50, description: "Contrôle qualité strict" },
      { type: 'testing', reduction: 30, description: "Tests approfondis" }
    ]
  },
  {
    type: 'key_person_loss',
    name: "Perte homme-clé",
    description: "Départ ou incapacité d'une personne clé",
    probability: 3,
    baseDamage: 50000,
    maxDamage: 500000,
    affectedAreas: ['direction', 'projets', 'clients'],
    requiredInsurance: ['key_person'],
    mitigationFactors: [
      { type: 'succession_plan', reduction: 40, description: "Plan de succession" },
      { type: 'knowledge_sharing', reduction: 30, description: "Partage des connaissances" }
    ]
  },
  {
    type: 'lawsuit',
    name: "Procès",
    description: "Action en justice contre l'entreprise",
    probability: 10,
    baseDamage: 20000,
    maxDamage: 200000,
    affectedAreas: ['finances', 'réputation', 'temps'],
    requiredInsurance: ['legal_protection', 'directors_officers'],
    mitigationFactors: [
      { type: 'contracts_review', reduction: 35, description: "Revue juridique contrats" },
      { type: 'compliance', reduction: 30, description: "Programme conformité" }
    ]
  },
  {
    type: 'reputation_crisis',
    name: "Crise de réputation",
    description: "Scandale médiatique affectant l'image",
    probability: 8,
    baseDamage: 15000,
    maxDamage: 300000,
    affectedAreas: ['réputation', 'ventes', 'recrutement'],
    requiredInsurance: ['civil_liability'],
    mitigationFactors: [
      { type: 'crisis_plan', reduction: 40, description: "Plan de crise" },
      { type: 'pr_agency', reduction: 30, description: "Agence RP sous contrat" }
    ]
  }
];

export const BROKER_TEMPLATES: Omit<InsuranceBroker, 'id' | 'isContracted'>[] = [
  {
    name: "CourtAssur Express",
    fee: 3,
    effectiveness: 8,
    specialties: ['professional'],
    connections: [],
    reputation: 65
  },
  {
    name: "Premium Brokers",
    fee: 5,
    effectiveness: 15,
    specialties: ['professional', 'hr'],
    connections: [],
    reputation: 80
  },
  {
    name: "Elite Risk Advisors",
    fee: 8,
    effectiveness: 25,
    specialties: ['professional', 'hr', 'specialized'],
    connections: [],
    reputation: 95
  }
];
