// Customer & Service Engine - 50+ customer management features
import { Client, ClientContract, Invoice, Company } from '@/types/game';

// ==================== CUSTOMER TYPES ====================
export type CustomerSegment = 'vip' | 'premium' | 'standard' | 'economy' | 'prospect';
export type CustomerStatus = 'actif' | 'dormant' | 'churned' | 'prospect' | 'blacklisted';
export type SatisfactionLevel = 'tres_satisfait' | 'satisfait' | 'neutre' | 'insatisfait' | 'tres_insatisfait';
export type SupportTicketPriority = 'basse' | 'moyenne' | 'haute' | 'urgente' | 'critique';
export type SupportTicketStatus = 'ouvert' | 'en_cours' | 'en_attente' | 'resolu' | 'ferme';

export interface CustomerProfile {
  id: string;
  clientId: string;
  segment: CustomerSegment;
  status: CustomerStatus;
  lifetimeValue: number;
  averageOrderValue: number;
  purchaseFrequency: number; // purchases per year
  lastPurchaseDate: number;
  firstPurchaseDate: number;
  satisfactionScore: number; // 0-100
  loyaltyPoints: number;
  preferences: string[];
  communicationPreference: 'email' | 'telephone' | 'sms' | 'courrier';
  riskScore: number; // 0-100, churn risk
}

export interface SupportTicket {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  createdDate: number;
  updatedDate: number;
  resolvedDate?: number;
  assignedTo?: string;
  category: string;
  responses: TicketResponse[];
  satisfactionRating?: number;
  escalated: boolean;
  slaBreached: boolean;
}

export interface TicketResponse {
  id: string;
  date: number;
  author: string;
  message: string;
  isInternal: boolean;
}

export interface CustomerFeedback {
  id: string;
  clientId: string;
  date: number;
  type: 'review' | 'survey' | 'complaint' | 'suggestion' | 'praise';
  rating: number; // 1-5
  comment: string;
  productId?: string;
  resolved: boolean;
  actionTaken?: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  tiers: LoyaltyTier[];
  pointsPerEuro: number;
  pointsValue: number; // value of 1 point in euros
  activeMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
}

export interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  discountPercent: number;
  prioritySupport: boolean;
}

// ==================== SERVICE LEVEL AGREEMENTS ====================
export interface SLA {
  id: string;
  name: string;
  responseTime: number; // hours
  resolutionTime: number; // hours
  availabilityTarget: number; // percentage
  penaltyPerBreach: number;
  clientIds: string[];
}

// ==================== CUSTOMER DATABASE TEMPLATES ====================
export const CLIENT_TEMPLATES: Omit<Client, 'id' | 'contracts' | 'lastContactDate'>[] = [
  { name: 'Artisan Local', type: 'particulier', sector: 'artisanat', creditRating: 70, paymentDelay: 15, totalRevenue: 0, relationshipScore: 50 },
  { name: 'PME Tech', type: 'pme', sector: 'tech', creditRating: 80, paymentDelay: 30, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Groupe Industriel', type: 'grand_compte', sector: 'industrie', creditRating: 95, paymentDelay: 60, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Startup Innovation', type: 'tpe', sector: 'tech', creditRating: 60, paymentDelay: 30, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Commerce de Proximité', type: 'tpe', sector: 'services', creditRating: 65, paymentDelay: 15, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Société de Conseil', type: 'pme', sector: 'services', creditRating: 75, paymentDelay: 45, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Collectivité Locale', type: 'public', sector: 'services', creditRating: 100, paymentDelay: 90, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Ministère', type: 'public', sector: 'services', creditRating: 100, paymentDelay: 120, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Multinationale', type: 'grand_compte', sector: 'industrie', creditRating: 98, paymentDelay: 60, totalRevenue: 0, relationshipScore: 50 },
  { name: 'Association', type: 'particulier', sector: 'services', creditRating: 50, paymentDelay: 30, totalRevenue: 0, relationshipScore: 50 },
];

// ==================== SLA TEMPLATES ====================
export const SLA_TEMPLATES: Omit<SLA, 'id' | 'clientIds'>[] = [
  { name: 'Standard', responseTime: 24, resolutionTime: 72, availabilityTarget: 99, penaltyPerBreach: 100 },
  { name: 'Premium', responseTime: 8, resolutionTime: 24, availabilityTarget: 99.5, penaltyPerBreach: 500 },
  { name: 'Enterprise', responseTime: 4, resolutionTime: 8, availabilityTarget: 99.9, penaltyPerBreach: 2000 },
  { name: 'Critical', responseTime: 1, resolutionTime: 4, availabilityTarget: 99.99, penaltyPerBreach: 5000 },
];

// ==================== LOYALTY TIERS ====================
export const DEFAULT_LOYALTY_TIERS: LoyaltyTier[] = [
  { name: 'Bronze', minPoints: 0, benefits: ['Newsletter exclusive'], discountPercent: 0, prioritySupport: false },
  { name: 'Argent', minPoints: 1000, benefits: ['Newsletter exclusive', 'Avant-premières'], discountPercent: 5, prioritySupport: false },
  { name: 'Or', minPoints: 5000, benefits: ['Newsletter exclusive', 'Avant-premières', 'Événements VIP'], discountPercent: 10, prioritySupport: true },
  { name: 'Platine', minPoints: 20000, benefits: ['Newsletter exclusive', 'Avant-premières', 'Événements VIP', 'Conseiller dédié'], discountPercent: 15, prioritySupport: true },
  { name: 'Diamant', minPoints: 50000, benefits: ['Tous les avantages', 'Accès exclusif', 'Cadeaux personnalisés'], discountPercent: 20, prioritySupport: true },
];

// ==================== CUSTOMER FUNCTIONS ====================

// Generate a new client
export function generateClient(sector: string, currentDay: number): Client {
  const template = CLIENT_TEMPLATES[Math.floor(Math.random() * CLIENT_TEMPLATES.length)];
  const names = [
    'Dupont', 'Martin', 'Bernard', 'Lefebvre', 'Moreau', 'Simon', 'Laurent',
    'Tech Solutions', 'Digital Agency', 'Consulting Group', 'Industries SA',
    'Services Plus', 'Innovation Lab', 'Green Energy', 'Smart Systems',
  ];
  const suffixes = ['SARL', 'SAS', 'SA', 'et Fils', '& Partners', 'Group', 'France'];
  
  const name = `${names[Math.floor(Math.random() * names.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  
  return {
    ...template,
    id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    contracts: [],
    lastContactDate: currentDay,
  };
}

// Create a customer profile
export function createCustomerProfile(client: Client): CustomerProfile {
  return {
    id: `profile_${client.id}`,
    clientId: client.id,
    segment: client.totalRevenue > 100000 ? 'vip' : client.totalRevenue > 10000 ? 'premium' : 'standard',
    status: 'actif',
    lifetimeValue: client.totalRevenue * 3,
    averageOrderValue: client.totalRevenue / Math.max(1, client.contracts.length),
    purchaseFrequency: client.contracts.length,
    lastPurchaseDate: client.lastContactDate,
    firstPurchaseDate: client.contracts[0]?.startDate || client.lastContactDate,
    satisfactionScore: client.relationshipScore,
    loyaltyPoints: Math.floor(client.totalRevenue / 10),
    preferences: [],
    communicationPreference: 'email',
    riskScore: 100 - client.relationshipScore,
  };
}

// Create a support ticket
export function createSupportTicket(
  clientId: string,
  subject: string,
  description: string,
  priority: SupportTicketPriority,
  currentDay: number
): SupportTicket {
  return {
    id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clientId,
    subject,
    description,
    priority,
    status: 'ouvert',
    createdDate: currentDay,
    updatedDate: currentDay,
    category: 'general',
    responses: [],
    escalated: priority === 'critique',
    slaBreached: false,
  };
}

// Respond to support ticket
export function respondToTicket(ticket: SupportTicket, message: string, author: string, currentDay: number): SupportTicket {
  const response: TicketResponse = {
    id: `resp_${Date.now()}`,
    date: currentDay,
    author,
    message,
    isInternal: false,
  };
  
  return {
    ...ticket,
    responses: [...ticket.responses, response],
    updatedDate: currentDay,
    status: 'en_cours',
  };
}

// Resolve support ticket
export function resolveTicket(ticket: SupportTicket, currentDay: number): SupportTicket {
  return {
    ...ticket,
    status: 'resolu',
    resolvedDate: currentDay,
    updatedDate: currentDay,
  };
}

// Calculate SLA compliance
export function calculateSLACompliance(tickets: SupportTicket[], sla: SLA): number {
  if (tickets.length === 0) return 100;
  
  const compliantTickets = tickets.filter(t => {
    if (!t.resolvedDate) return true; // Still open
    const responseTime = t.responses[0] ? t.responses[0].date - t.createdDate : 0;
    const resolutionTime = t.resolvedDate - t.createdDate;
    return responseTime <= sla.responseTime && resolutionTime <= sla.resolutionTime;
  });
  
  return (compliantTickets.length / tickets.length) * 100;
}

// Create customer feedback
export function createFeedback(
  clientId: string,
  type: CustomerFeedback['type'],
  rating: number,
  comment: string,
  currentDay: number,
  productId?: string
): CustomerFeedback {
  return {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clientId,
    date: currentDay,
    type,
    rating,
    comment,
    productId,
    resolved: false,
  };
}

// Calculate churn risk
export function calculateChurnRisk(client: Client, currentDay: number): number {
  let risk = 0;
  
  // Low relationship score
  if (client.relationshipScore < 30) risk += 40;
  else if (client.relationshipScore < 50) risk += 20;
  
  // No recent activity
  const daysSinceContact = currentDay - client.lastContactDate;
  if (daysSinceContact > 180) risk += 30;
  else if (daysSinceContact > 90) risk += 15;
  
  // Payment issues
  const unpaidInvoices = client.contracts.filter(c => c.unpaidAmount > 0).length;
  if (unpaidInvoices > 0) risk += 10 * unpaidInvoices;
  
  // Declining contract values
  const contracts = client.contracts.sort((a, b) => b.startDate - a.startDate);
  if (contracts.length >= 2) {
    if (contracts[0].value < contracts[1].value * 0.8) risk += 15;
  }
  
  return Math.min(100, risk);
}

// Generate invoice
export function generateInvoice(contract: ClientContract, currentDay: number): Invoice {
  return {
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    clientId: contract.clientId,
    contractId: contract.id,
    amount: contract.monthlyValue,
    issueDate: currentDay,
    dueDate: currentDay + contract.paymentTerms,
    paid: false,
    overdue: false,
  };
}

// Process invoice payment
export function processInvoicePayment(invoice: Invoice, currentDay: number): Invoice {
  return {
    ...invoice,
    paid: true,
    paidDate: currentDay,
    overdue: currentDay > invoice.dueDate,
  };
}

// Calculate customer health score
export function calculateHealthScore(client: Client, tickets: SupportTicket[]): number {
  let score = 100;
  
  // Relationship impact
  score *= client.relationshipScore / 100;
  
  // Ticket impact
  const openTickets = tickets.filter(t => t.status !== 'resolu' && t.status !== 'ferme').length;
  score -= openTickets * 5;
  
  // Payment impact
  if (client.creditRating < 50) score -= 20;
  
  // Contract value impact
  if (client.totalRevenue > 50000) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

// Segment customers
export function segmentCustomers(clients: Client[]): Record<CustomerSegment, Client[]> {
  return {
    vip: clients.filter(c => c.totalRevenue > 100000 && c.relationshipScore > 80),
    premium: clients.filter(c => c.totalRevenue > 20000 && c.totalRevenue <= 100000),
    standard: clients.filter(c => c.totalRevenue > 5000 && c.totalRevenue <= 20000),
    economy: clients.filter(c => c.totalRevenue > 0 && c.totalRevenue <= 5000),
    prospect: clients.filter(c => c.totalRevenue === 0),
  };
}

// Calculate average resolution time
export function calculateAvgResolutionTime(tickets: SupportTicket[]): number {
  const resolvedTickets = tickets.filter(t => t.resolvedDate);
  if (resolvedTickets.length === 0) return 0;
  
  const totalTime = resolvedTickets.reduce((sum, t) => sum + (t.resolvedDate! - t.createdDate), 0);
  return totalTime / resolvedTickets.length;
}

// Create loyalty program
export function createLoyaltyProgram(name: string): LoyaltyProgram {
  return {
    id: `loyalty_${Date.now()}`,
    name,
    tiers: DEFAULT_LOYALTY_TIERS,
    pointsPerEuro: 1,
    pointsValue: 0.01,
    activeMembers: 0,
    totalPointsIssued: 0,
    totalPointsRedeemed: 0,
  };
}

// Calculate customer tier
export function calculateLoyaltyTier(points: number, program: LoyaltyProgram): LoyaltyTier {
  const sortedTiers = [...program.tiers].sort((a, b) => b.minPoints - a.minPoints);
  return sortedTiers.find(t => points >= t.minPoints) || program.tiers[0];
}

// Award loyalty points
export function awardLoyaltyPoints(profile: CustomerProfile, purchaseAmount: number, program: LoyaltyProgram): CustomerProfile {
  const points = Math.floor(purchaseAmount * program.pointsPerEuro);
  return {
    ...profile,
    loyaltyPoints: profile.loyaltyPoints + points,
  };
}

// Redeem loyalty points
export function redeemLoyaltyPoints(profile: CustomerProfile, points: number, program: LoyaltyProgram): { profile: CustomerProfile; value: number } {
  const maxRedeemable = profile.loyaltyPoints;
  const actualPoints = Math.min(points, maxRedeemable);
  const value = actualPoints * program.pointsValue;
  
  return {
    profile: { ...profile, loyaltyPoints: profile.loyaltyPoints - actualPoints },
    value,
  };
}
