// Types pour le système commercial avancé

export interface SalesTeam {
  id: string;
  name: string;
  members: Salesperson[];
  territory: string;
  targets: SalesTarget;
  performance: SalesPerformance;
}

export interface Salesperson {
  id: string;
  name: string;
  role: SalespersonRole;
  salary: number;
  commission: number; // Pourcentage
  experience: number; // Années
  skills: SalesSkill[];
  performance: number; // 0-100
  satisfaction: number; // 0-100
  clients: string[]; // IDs des clients gérés
  hireDate: number;
}

export type SalespersonRole =
  | 'junior_sales' // Commercial junior
  | 'sales_rep' // Commercial
  | 'senior_sales' // Commercial senior
  | 'key_account' // Grands comptes
  | 'sales_manager' // Responsable commercial
  | 'sales_director' // Directeur commercial
  | 'business_developer' // Business developer
  | 'inside_sales' // Sédentaire
  | 'field_sales'; // Terrain

export type SalesSkill =
  | 'negotiation' // Négociation
  | 'prospecting' // Prospection
  | 'closing' // Closing
  | 'relationship' // Relationnel
  | 'technical' // Technique
  | 'presentation' // Présentation
  | 'digital' // Digital
  | 'international'; // International

export interface SalesTarget {
  revenue: number;
  newClients: number;
  retention: number; // %
  avgDealSize: number;
  period: 'monthly' | 'quarterly' | 'yearly';
}

export interface SalesPerformance {
  revenue: number;
  newClientsAcquired: number;
  retentionRate: number;
  avgDealSize: number;
  conversionRate: number;
  callsMade: number;
  meetingsHeld: number;
  proposalsSent: number;
  dealsWon: number;
  dealsLost: number;
}

// Clients CRM
export interface CRMClient {
  id: string;
  name: string;
  type: ClientType;
  sector: string;
  size: ClientSize;
  status: ClientStatus;
  contactInfo: ContactInfo;
  assignedTo: string; // Salesperson ID
  revenue: number; // CA généré
  potential: number; // Potentiel estimé
  lastContact: number;
  nextAction: string;
  nextActionDate: number;
  notes: string[];
  opportunities: Opportunity[];
  orders: string[]; // Order IDs
  satisfaction: number; // 0-100
  loyaltyScore: number; // 0-100
}

export type ClientType =
  | 'prospect' // Prospect
  | 'lead' // Lead qualifié
  | 'customer' // Client
  | 'key_account' // Grand compte
  | 'partner' // Partenaire
  | 'churned'; // Client perdu

export type ClientSize =
  | 'tpe' // TPE (< 10 salariés)
  | 'pme' // PME (10-250)
  | 'eti' // ETI (250-5000)
  | 'ge'; // Grande entreprise (> 5000)

export type ClientStatus =
  | 'active' // Actif
  | 'inactive' // Inactif
  | 'at_risk' // À risque
  | 'churned' // Perdu
  | 'pending'; // En attente

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  website?: string;
  linkedin?: string;
}

// Opportunités commerciales
export interface Opportunity {
  id: string;
  clientId: string;
  title: string;
  value: number;
  probability: number; // 0-100%
  stage: OpportunityStage;
  createdDate: number;
  expectedCloseDate: number;
  products: string[]; // Product IDs
  notes: string;
  competitors: string[];
  assignedTo: string;
}

export type OpportunityStage =
  | 'qualification' // Qualification
  | 'needs_analysis' // Analyse besoins
  | 'proposal' // Proposition
  | 'negotiation' // Négociation
  | 'closing' // Closing
  | 'won' // Gagné
  | 'lost'; // Perdu

// Catalogue de profils commerciaux à recruter
export interface SalespersonTemplate {
  id: string;
  role: SalespersonRole;
  title: string;
  baseSalary: number;
  commission: number;
  skills: SalesSkill[];
  experience: number;
  description: string;
  requirements?: SalesRequirement[];
}

export interface SalesRequirement {
  type: 'min_revenue' | 'min_team_size' | 'certification' | 'market_presence';
  value: number | string;
  description: string;
}

export const SALESPERSON_CATALOG: SalespersonTemplate[] = [
  // Niveau entrée
  {
    id: 'inside_sales_junior',
    role: 'inside_sales',
    title: 'Commercial sédentaire junior',
    baseSalary: 25000,
    commission: 0.03,
    skills: ['digital', 'prospecting'],
    experience: 0,
    description: 'Appels sortants et qualification de leads'
  },
  {
    id: 'junior_sales_rep',
    role: 'junior_sales',
    title: 'Commercial junior terrain',
    baseSalary: 28000,
    commission: 0.05,
    skills: ['prospecting', 'presentation'],
    experience: 1,
    description: 'Prospection terrain et premiers rendez-vous'
  },
  
  // Niveau intermédiaire
  {
    id: 'sales_rep_standard',
    role: 'sales_rep',
    title: 'Commercial confirmé',
    baseSalary: 35000,
    commission: 0.08,
    skills: ['negotiation', 'closing', 'relationship'],
    experience: 3,
    description: 'Gestion cycle de vente complet'
  },
  {
    id: 'business_developer',
    role: 'business_developer',
    title: 'Business Developer',
    baseSalary: 40000,
    commission: 0.10,
    skills: ['prospecting', 'negotiation', 'digital'],
    experience: 4,
    description: 'Développement nouveaux marchés'
  },
  {
    id: 'inside_sales_senior',
    role: 'inside_sales',
    title: 'Commercial sédentaire senior',
    baseSalary: 38000,
    commission: 0.07,
    skills: ['digital', 'closing', 'relationship'],
    experience: 4,
    description: 'Vente complexe à distance'
  },
  
  // Niveau senior
  {
    id: 'senior_sales',
    role: 'senior_sales',
    title: 'Commercial senior',
    baseSalary: 48000,
    commission: 0.12,
    skills: ['negotiation', 'closing', 'relationship', 'technical'],
    experience: 6,
    description: 'Ventes complexes et stratégiques'
  },
  {
    id: 'key_account_manager',
    role: 'key_account',
    title: 'Key Account Manager',
    baseSalary: 55000,
    commission: 0.10,
    skills: ['relationship', 'negotiation', 'presentation', 'technical'],
    experience: 7,
    description: 'Gestion grands comptes stratégiques',
    requirements: [
      { type: 'min_revenue', value: 500000, description: 'CA min 500k€' }
    ]
  },
  {
    id: 'field_sales_international',
    role: 'field_sales',
    title: 'Commercial export',
    baseSalary: 50000,
    commission: 0.12,
    skills: ['international', 'negotiation', 'relationship'],
    experience: 5,
    description: 'Développement marchés internationaux',
    requirements: [
      { type: 'market_presence', value: 'international', description: 'Présence internationale' }
    ]
  },
  
  // Management
  {
    id: 'sales_manager',
    role: 'sales_manager',
    title: 'Responsable commercial',
    baseSalary: 60000,
    commission: 0.05,
    skills: ['negotiation', 'closing', 'relationship', 'presentation'],
    experience: 8,
    description: 'Management équipe commerciale',
    requirements: [
      { type: 'min_team_size', value: 3, description: '3 commerciaux minimum' }
    ]
  },
  {
    id: 'sales_director',
    role: 'sales_director',
    title: 'Directeur commercial',
    baseSalary: 85000,
    commission: 0.03,
    skills: ['negotiation', 'closing', 'relationship', 'presentation', 'technical'],
    experience: 12,
    description: 'Direction stratégie commerciale',
    requirements: [
      { type: 'min_revenue', value: 2000000, description: 'CA min 2M€' },
      { type: 'min_team_size', value: 5, description: '5 commerciaux minimum' }
    ]
  }
];

// Actions commerciales
export interface CommercialAction {
  type: CommercialActionType;
  cost: number;
  duration: number; // En jours
  effect: CommercialEffect;
}

export type CommercialActionType =
  | 'hire_salesperson'
  | 'fire_salesperson'
  | 'train_salesperson'
  | 'create_opportunity'
  | 'advance_opportunity'
  | 'close_deal'
  | 'contact_client'
  | 'client_meeting'
  | 'send_proposal'
  | 'launch_campaign'
  | 'territory_expansion'
  | 'crm_upgrade';

export interface CommercialEffect {
  revenue?: number;
  newClients?: number;
  retention?: number;
  teamMorale?: number;
  brandAwareness?: number;
}

// Campagnes commerciales
export interface SalesCampaign {
  id: string;
  name: string;
  type: CampaignType;
  budget: number;
  startDate: number;
  endDate: number;
  targets: CampaignTarget;
  results?: CampaignResults;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export type CampaignType =
  | 'cold_calling' // Appels à froid
  | 'email_campaign' // Emailing
  | 'trade_show' // Salon professionnel
  | 'webinar' // Webinaire
  | 'referral' // Programme parrainage
  | 'partnership' // Partenariat
  | 'social_selling'; // Vente sociale

export interface CampaignTarget {
  leads: number;
  meetings: number;
  revenue: number;
}

export interface CampaignResults {
  leadsGenerated: number;
  meetingsBooked: number;
  revenueGenerated: number;
  roi: number;
}
