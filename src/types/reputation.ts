// Système de réputation détaillé avec RP, médias et gestion de crise

export type StakeholderType = 'clients' | 'employees' | 'investors' | 'media' | 'regulators' | 'public';
export type MediaType = 'newspaper' | 'tv' | 'radio' | 'social_media' | 'blog' | 'influencer';
export type CrisisPhase = 'rumor' | 'article' | 'viral' | 'investigation' | 'trial' | 'resolved';
export type CrisisResponse = 'deny' | 'apologize' | 'blame' | 'compensate' | 'silence' | 'counter_attack' | 'legal_action';
export type PRAgentType = 'press_officer' | 'community_manager' | 'lobbyist' | 'crisis_manager' | 'influencer_manager';

// Score de réputation multi-dimensionnel
export interface ReputationScore {
  overall: number; // 0-100
  byStakeholder: Record<StakeholderType, number>;
  bySector: Record<string, number>;
  byRegion: Record<string, number>;
  trend: 'rising' | 'stable' | 'falling';
  history: ReputationHistoryPoint[];
}

export interface ReputationHistoryPoint {
  day: number;
  score: number;
  event?: string;
}

// Médias et journalistes
export interface MediaOutlet {
  id: string;
  name: string;
  type: MediaType;
  reach: number; // Audience en milliers
  credibility: number; // 0-100
  stance: number; // -100 (hostile) à +100 (favorable)
  journalists: Journalist[];
  influence: number; // Impact sur la réputation
}

export interface Journalist {
  id: string;
  name: string;
  specialty: string;
  reputation: number;
  relationship: number; // -100 à +100
  corruptible: boolean;
  bribeAmount?: number;
  lastContact?: number;
}

// Réseaux sociaux
export interface SocialMediaPresence {
  platform: string;
  followers: number;
  engagement: number; // 0-100
  sentiment: number; // -100 à +100
  viralPotential: number;
  communityManager?: PRAgent;
}

export interface ViralEvent {
  id: string;
  content: string;
  platform: string;
  isPositive: boolean;
  viralityScore: number;
  reachEstimate: number;
  startDay: number;
  peakDay?: number;
  decayRate: number;
  hashtags: string[];
  reputationImpact: number;
}

// Influenceurs et ambassadeurs
export interface Influencer {
  id: string;
  name: string;
  platform: MediaType;
  followers: number;
  niche: string;
  engagementRate: number;
  cost: number; // Coût mensuel
  credibility: number;
  exclusivity: boolean;
  contractEnd?: number;
  reputationBoost: number;
}

export interface Ambassador {
  id: string;
  name: string;
  type: 'celebrity' | 'expert' | 'athlete' | 'artist' | 'politician';
  fame: number; // 0-100
  cost: number;
  reputationBoost: number;
  riskFactor: number; // Risque de scandale
  contractDuration: number;
  contractEnd?: number;
}

// Scandales et rumeurs
export interface Scandal {
  id: string;
  type: ScandalType;
  title: string;
  description: string;
  severity: number; // 1-10
  phase: CrisisPhase;
  startDay: number;
  source?: string;
  isPublic: boolean;
  mediaAttention: number;
  responses: CrisisResponseRecord[];
  reputationDamage: number;
  financialDamage: number;
  legalRisk: number;
  stakeholdersAffected: StakeholderType[];
  resolutionProgress: number;
  expiresDay?: number;
}

export type ScandalType = 
  | 'product_defect'
  | 'data_breach'
  | 'ceo_misconduct'
  | 'environmental'
  | 'labor_abuse'
  | 'financial_fraud'
  | 'discrimination'
  | 'false_advertising'
  | 'tax_evasion'
  | 'bribery'
  | 'safety_violation'
  | 'competitor_attack';

export interface CrisisResponseRecord {
  type: CrisisResponse;
  day: number;
  cost: number;
  effectiveness: number;
  publicPerception: number;
}

// Rumeurs
export interface Rumor {
  id: string;
  content: string;
  isTrue: boolean;
  spreadRate: number;
  currentReach: number; // 0-100
  source?: string;
  startDay: number;
  canBecomeScandal: boolean;
  scandalType?: ScandalType;
}

// Équipe RP
export interface PRAgent {
  id: string;
  name: string;
  type: PRAgentType;
  level: number; // 1-5
  salary: number;
  skills: PRSkill[];
  effectiveness: number;
  experience: number;
  hiredDay: number;
  assignments: string[];
}

export interface PRSkill {
  type: 'media_relations' | 'crisis_management' | 'social_media' | 'lobbying' | 'event_planning' | 'writing';
  level: number;
}

// Prestataires externes
export interface PRAgency {
  id: string;
  name: string;
  specialty: string;
  tier: 'budget' | 'standard' | 'premium' | 'elite';
  monthlyFee: number;
  effectiveness: number;
  crisisBonus: number;
  mediaConnections: number;
  reputation: number;
  isContracted: boolean;
  contractEnd?: number;
}

// Lobbying
export interface LobbyingCampaign {
  id: string;
  target: 'government' | 'regulator' | 'association' | 'ngo';
  objective: string;
  budget: number;
  progress: number;
  startDay: number;
  estimatedDuration: number;
  successProbability: number;
  benefits: LobbyingBenefit[];
}

export interface LobbyingBenefit {
  type: 'tax_reduction' | 'regulation_delay' | 'subsidy' | 'license' | 'favorable_law';
  value: number;
  description: string;
}

// État global de la réputation
export interface ReputationState {
  score: ReputationScore;
  mediaOutlets: MediaOutlet[];
  socialMedia: SocialMediaPresence[];
  influencers: Influencer[];
  ambassadors: Ambassador[];
  scandals: Scandal[];
  activeRumors: Rumor[];
  viralEvents: ViralEvent[];
  prAgents: PRAgent[];
  contractedAgencies: PRAgency[];
  lobbyingCampaigns: LobbyingCampaign[];
  pressReleases: PressRelease[];
  mediaEvents: MediaEvent[];
  crisisBudget: number;
}

export interface PressRelease {
  id: string;
  title: string;
  content: string;
  day: number;
  reach: number;
  sentiment: number;
  cost: number;
}

export interface MediaEvent {
  id: string;
  type: 'press_conference' | 'product_launch' | 'charity_gala' | 'interview' | 'sponsorship';
  title: string;
  day: number;
  budget: number;
  attendees: number;
  mediaPresent: string[];
  reputationImpact: number;
  success: boolean;
}

// Templates
export const MEDIA_OUTLET_TEMPLATES: Omit<MediaOutlet, 'id'>[] = [
  {
    name: "Le Monde Économique",
    type: "newspaper",
    reach: 500,
    credibility: 90,
    stance: 0,
    journalists: [],
    influence: 85
  },
  {
    name: "BFM Business",
    type: "tv",
    reach: 800,
    credibility: 70,
    stance: 10,
    journalists: [],
    influence: 75
  },
  {
    name: "France Info",
    type: "radio",
    reach: 600,
    credibility: 85,
    stance: 0,
    journalists: [],
    influence: 70
  },
  {
    name: "TechCrunch FR",
    type: "blog",
    reach: 200,
    credibility: 75,
    stance: 20,
    journalists: [],
    influence: 60
  },
  {
    name: "Le Canard Enchaîné",
    type: "newspaper",
    reach: 300,
    credibility: 95,
    stance: -30,
    journalists: [],
    influence: 90
  }
];

export const SCANDAL_TEMPLATES: Omit<Scandal, 'id' | 'startDay' | 'responses'>[] = [
  {
    type: 'product_defect',
    title: "Défaut de fabrication majeur",
    description: "Un défaut de conception affecte des milliers de produits",
    severity: 7,
    phase: 'rumor',
    isPublic: false,
    mediaAttention: 0,
    reputationDamage: 25,
    financialDamage: 100000,
    legalRisk: 40,
    stakeholdersAffected: ['clients', 'media', 'regulators'],
    resolutionProgress: 0
  },
  {
    type: 'data_breach',
    title: "Fuite de données personnelles",
    description: "Les données de milliers de clients ont été compromises",
    severity: 8,
    phase: 'rumor',
    isPublic: false,
    mediaAttention: 0,
    reputationDamage: 35,
    financialDamage: 200000,
    legalRisk: 70,
    stakeholdersAffected: ['clients', 'media', 'regulators', 'public'],
    resolutionProgress: 0
  },
  {
    type: 'ceo_misconduct',
    title: "Comportement inapproprié du PDG",
    description: "Des accusations de comportement déplacé visent le dirigeant",
    severity: 9,
    phase: 'rumor',
    isPublic: false,
    mediaAttention: 0,
    reputationDamage: 45,
    financialDamage: 0,
    legalRisk: 50,
    stakeholdersAffected: ['employees', 'investors', 'media', 'public'],
    resolutionProgress: 0
  },
  {
    type: 'environmental',
    title: "Pollution environnementale",
    description: "L'entreprise est accusée de déversements illégaux",
    severity: 8,
    phase: 'rumor',
    isPublic: false,
    mediaAttention: 0,
    reputationDamage: 40,
    financialDamage: 500000,
    legalRisk: 80,
    stakeholdersAffected: ['regulators', 'media', 'public'],
    resolutionProgress: 0
  },
  {
    type: 'labor_abuse',
    title: "Conditions de travail déplorables",
    description: "Des employés dénoncent des conditions inhumaines",
    severity: 7,
    phase: 'rumor',
    isPublic: false,
    mediaAttention: 0,
    reputationDamage: 30,
    financialDamage: 50000,
    legalRisk: 60,
    stakeholdersAffected: ['employees', 'media', 'public', 'regulators'],
    resolutionProgress: 0
  }
];

export const PR_AGENCY_TEMPLATES: Omit<PRAgency, 'id' | 'isContracted'>[] = [
  {
    name: "Com' Express",
    specialty: "Relations presse généralistes",
    tier: "budget",
    monthlyFee: 3000,
    effectiveness: 50,
    crisisBonus: 10,
    mediaConnections: 30,
    reputation: 60
  },
  {
    name: "MediaVision",
    specialty: "Stratégie médiatique",
    tier: "standard",
    monthlyFee: 8000,
    effectiveness: 70,
    crisisBonus: 25,
    mediaConnections: 60,
    reputation: 75
  },
  {
    name: "CrisisGuard",
    specialty: "Gestion de crise",
    tier: "premium",
    monthlyFee: 15000,
    effectiveness: 85,
    crisisBonus: 50,
    mediaConnections: 80,
    reputation: 90
  },
  {
    name: "Apex Communications",
    specialty: "Lobbying et influence",
    tier: "elite",
    monthlyFee: 30000,
    effectiveness: 95,
    crisisBonus: 70,
    mediaConnections: 95,
    reputation: 98
  }
];

export const INFLUENCER_TEMPLATES: Omit<Influencer, 'id'>[] = [
  {
    name: "TechReviewerPro",
    platform: "social_media",
    followers: 500000,
    niche: "Technologie",
    engagementRate: 4.5,
    cost: 5000,
    credibility: 75,
    exclusivity: false,
    reputationBoost: 5
  },
  {
    name: "EcoWarrior",
    platform: "social_media",
    followers: 300000,
    niche: "Environnement",
    engagementRate: 6.2,
    cost: 4000,
    credibility: 85,
    exclusivity: false,
    reputationBoost: 7
  },
  {
    name: "BusinessInsider_FR",
    platform: "blog",
    followers: 150000,
    niche: "Business",
    engagementRate: 3.8,
    cost: 3000,
    credibility: 80,
    exclusivity: true,
    reputationBoost: 6
  },
  {
    name: "LifestyleQueen",
    platform: "social_media",
    followers: 800000,
    niche: "Lifestyle",
    engagementRate: 5.1,
    cost: 8000,
    credibility: 60,
    exclusivity: false,
    reputationBoost: 4
  }
];
