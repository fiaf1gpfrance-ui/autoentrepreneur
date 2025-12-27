// Technology & R&D Engine - 70+ technology features
import { Product, Company, IntellectualProperty } from '@/types/game';

// ==================== TECHNOLOGY TYPES ====================
export type TechnologyCategory = 
  | 'ia' | 'cloud' | 'iot' | 'blockchain' | 'cybersecurity' 
  | 'automation' | 'data' | 'mobile' | 'web' | 'erp'
  | 'crm' | 'bi' | 'devops' | 'green_tech' | 'quantum';

export type ResearchArea = 
  | 'produit' | 'process' | 'materiau' | 'logiciel' | 'service'
  | 'energie' | 'bio' | 'nano' | 'robotique' | 'spatial';

export type TechnologyReadiness = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  level: number; // 1-10
  cost: number;
  monthlyMaintenance: number;
  productivityBonus: number;
  qualityBonus: number;
  automationLevel: number;
  implementationDate?: number;
  expirationDate?: number;
  vendor?: string;
  integrations: string[];
}

export interface ResearchProject {
  id: string;
  name: string;
  area: ResearchArea;
  description: string;
  budget: number;
  spentBudget: number;
  progress: number; // 0-100
  startDate: number;
  estimatedDuration: number; // days
  teamSize: number;
  trl: TechnologyReadiness;
  risks: ResearchRisk[];
  milestones: ResearchMilestone[];
  deliverables: string[];
  potentialPatents: number;
  successProbability: number;
}

export interface ResearchRisk {
  id: string;
  description: string;
  probability: number;
  impact: 'faible' | 'moyen' | 'eleve' | 'critique';
  mitigation: string;
  occurred: boolean;
}

export interface ResearchMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: number;
  completed: boolean;
  completedDate?: number;
}

export interface Innovation {
  id: string;
  name: string;
  description: string;
  type: 'incremental' | 'radical' | 'disruptive';
  source: 'interne' | 'acquisition' | 'partenariat' | 'open_innovation';
  value: number;
  implementationCost: number;
  impactScore: number;
  patents: string[];
  adoptionRate: number;
}

// ==================== TECHNOLOGY DATABASE - 50+ technologies ====================
export const TECHNOLOGIES_DATABASE: Omit<Technology, 'id' | 'implementationDate'>[] = [
  // IA & Data
  { name: 'Machine Learning Platform', category: 'ia', level: 7, cost: 50000, monthlyMaintenance: 2000, productivityBonus: 15, qualityBonus: 10, automationLevel: 30, integrations: ['erp', 'crm', 'bi'] },
  { name: 'Chatbot IA', category: 'ia', level: 4, cost: 15000, monthlyMaintenance: 500, productivityBonus: 8, qualityBonus: 5, automationLevel: 20, integrations: ['crm', 'web'] },
  { name: 'Computer Vision', category: 'ia', level: 8, cost: 80000, monthlyMaintenance: 3000, productivityBonus: 20, qualityBonus: 25, automationLevel: 40, integrations: ['automation', 'iot'] },
  { name: 'NLP Engine', category: 'ia', level: 6, cost: 40000, monthlyMaintenance: 1500, productivityBonus: 12, qualityBonus: 8, automationLevel: 25, integrations: ['crm', 'bi'] },
  { name: 'Predictive Analytics', category: 'ia', level: 7, cost: 60000, monthlyMaintenance: 2500, productivityBonus: 18, qualityBonus: 12, automationLevel: 15, integrations: ['bi', 'erp'] },
  
  // Cloud
  { name: 'Cloud Public', category: 'cloud', level: 5, cost: 20000, monthlyMaintenance: 3000, productivityBonus: 10, qualityBonus: 5, automationLevel: 20, integrations: ['web', 'mobile', 'erp'] },
  { name: 'Cloud Privé', category: 'cloud', level: 7, cost: 100000, monthlyMaintenance: 8000, productivityBonus: 15, qualityBonus: 10, automationLevel: 25, integrations: ['erp', 'cybersecurity'] },
  { name: 'Cloud Hybride', category: 'cloud', level: 8, cost: 150000, monthlyMaintenance: 12000, productivityBonus: 18, qualityBonus: 12, automationLevel: 30, integrations: ['cloud', 'cybersecurity'] },
  { name: 'Serverless Computing', category: 'cloud', level: 6, cost: 30000, monthlyMaintenance: 1000, productivityBonus: 12, qualityBonus: 8, automationLevel: 35, integrations: ['web', 'mobile'] },
  { name: 'Container Orchestration', category: 'cloud', level: 7, cost: 45000, monthlyMaintenance: 2000, productivityBonus: 15, qualityBonus: 10, automationLevel: 40, integrations: ['devops', 'cloud'] },
  
  // IoT
  { name: 'Plateforme IoT', category: 'iot', level: 6, cost: 40000, monthlyMaintenance: 2000, productivityBonus: 12, qualityBonus: 15, automationLevel: 35, integrations: ['cloud', 'data'] },
  { name: 'Capteurs Intelligents', category: 'iot', level: 5, cost: 25000, monthlyMaintenance: 1000, productivityBonus: 10, qualityBonus: 20, automationLevel: 25, integrations: ['iot', 'automation'] },
  { name: 'Digital Twin', category: 'iot', level: 8, cost: 100000, monthlyMaintenance: 5000, productivityBonus: 20, qualityBonus: 25, automationLevel: 30, integrations: ['ia', 'iot'] },
  { name: 'Edge Computing', category: 'iot', level: 7, cost: 55000, monthlyMaintenance: 2500, productivityBonus: 15, qualityBonus: 12, automationLevel: 28, integrations: ['iot', 'cloud'] },
  
  // Cybersecurity
  { name: 'Firewall Nouvelle Génération', category: 'cybersecurity', level: 6, cost: 30000, monthlyMaintenance: 1500, productivityBonus: 0, qualityBonus: 5, automationLevel: 10, integrations: ['cloud', 'erp'] },
  { name: 'SIEM', category: 'cybersecurity', level: 7, cost: 60000, monthlyMaintenance: 3000, productivityBonus: 0, qualityBonus: 8, automationLevel: 20, integrations: ['cloud', 'cybersecurity'] },
  { name: 'Zero Trust Architecture', category: 'cybersecurity', level: 8, cost: 80000, monthlyMaintenance: 4000, productivityBonus: 0, qualityBonus: 10, automationLevel: 25, integrations: ['cloud', 'cybersecurity'] },
  { name: 'Endpoint Protection', category: 'cybersecurity', level: 5, cost: 15000, monthlyMaintenance: 800, productivityBonus: 0, qualityBonus: 5, automationLevel: 15, integrations: ['cybersecurity'] },
  { name: 'Data Loss Prevention', category: 'cybersecurity', level: 6, cost: 35000, monthlyMaintenance: 1800, productivityBonus: 0, qualityBonus: 8, automationLevel: 18, integrations: ['cybersecurity', 'cloud'] },
  
  // Automation
  { name: 'RPA Basic', category: 'automation', level: 4, cost: 20000, monthlyMaintenance: 1000, productivityBonus: 15, qualityBonus: 5, automationLevel: 40, integrations: ['erp', 'crm'] },
  { name: 'RPA Advanced', category: 'automation', level: 7, cost: 60000, monthlyMaintenance: 3000, productivityBonus: 25, qualityBonus: 10, automationLevel: 60, integrations: ['erp', 'crm', 'ia'] },
  { name: 'Hyperautomation', category: 'automation', level: 9, cost: 150000, monthlyMaintenance: 8000, productivityBonus: 35, qualityBonus: 15, automationLevel: 80, integrations: ['ia', 'automation', 'erp'] },
  { name: 'Workflow Automation', category: 'automation', level: 5, cost: 25000, monthlyMaintenance: 1200, productivityBonus: 18, qualityBonus: 8, automationLevel: 35, integrations: ['erp', 'crm'] },
  { name: 'Industrial Automation', category: 'automation', level: 8, cost: 200000, monthlyMaintenance: 10000, productivityBonus: 40, qualityBonus: 20, automationLevel: 70, integrations: ['iot', 'robotique'] },
  
  // Data & BI
  { name: 'Data Warehouse', category: 'data', level: 6, cost: 50000, monthlyMaintenance: 3000, productivityBonus: 10, qualityBonus: 15, automationLevel: 10, integrations: ['bi', 'erp'] },
  { name: 'Data Lake', category: 'data', level: 7, cost: 80000, monthlyMaintenance: 4000, productivityBonus: 12, qualityBonus: 18, automationLevel: 15, integrations: ['ia', 'bi'] },
  { name: 'Real-time Analytics', category: 'data', level: 8, cost: 70000, monthlyMaintenance: 3500, productivityBonus: 15, qualityBonus: 12, automationLevel: 20, integrations: ['bi', 'iot'] },
  { name: 'Business Intelligence Suite', category: 'bi', level: 6, cost: 40000, monthlyMaintenance: 2000, productivityBonus: 15, qualityBonus: 10, automationLevel: 15, integrations: ['erp', 'crm', 'data'] },
  { name: 'Self-Service BI', category: 'bi', level: 5, cost: 25000, monthlyMaintenance: 1200, productivityBonus: 12, qualityBonus: 8, automationLevel: 10, integrations: ['bi', 'data'] },
  
  // ERP & CRM
  { name: 'ERP Cloud', category: 'erp', level: 7, cost: 100000, monthlyMaintenance: 5000, productivityBonus: 20, qualityBonus: 15, automationLevel: 35, integrations: ['cloud', 'crm', 'bi'] },
  { name: 'ERP On-Premise', category: 'erp', level: 6, cost: 150000, monthlyMaintenance: 3000, productivityBonus: 18, qualityBonus: 12, automationLevel: 30, integrations: ['bi', 'crm'] },
  { name: 'CRM Avancé', category: 'crm', level: 6, cost: 35000, monthlyMaintenance: 1500, productivityBonus: 15, qualityBonus: 10, automationLevel: 25, integrations: ['erp', 'ia', 'bi'] },
  { name: 'Marketing Automation', category: 'crm', level: 5, cost: 20000, monthlyMaintenance: 1000, productivityBonus: 12, qualityBonus: 8, automationLevel: 40, integrations: ['crm', 'web'] },
  
  // Web & Mobile
  { name: 'E-commerce Platform', category: 'web', level: 5, cost: 30000, monthlyMaintenance: 1500, productivityBonus: 10, qualityBonus: 8, automationLevel: 20, integrations: ['crm', 'erp'] },
  { name: 'Progressive Web App', category: 'web', level: 6, cost: 25000, monthlyMaintenance: 1000, productivityBonus: 8, qualityBonus: 12, automationLevel: 10, integrations: ['mobile', 'cloud'] },
  { name: 'Native Mobile Apps', category: 'mobile', level: 6, cost: 40000, monthlyMaintenance: 2000, productivityBonus: 10, qualityBonus: 15, automationLevel: 15, integrations: ['cloud', 'crm'] },
  { name: 'Cross-Platform Framework', category: 'mobile', level: 5, cost: 20000, monthlyMaintenance: 800, productivityBonus: 8, qualityBonus: 10, automationLevel: 10, integrations: ['web', 'mobile'] },
  
  // DevOps
  { name: 'CI/CD Pipeline', category: 'devops', level: 6, cost: 25000, monthlyMaintenance: 1000, productivityBonus: 20, qualityBonus: 15, automationLevel: 50, integrations: ['cloud', 'devops'] },
  { name: 'Infrastructure as Code', category: 'devops', level: 7, cost: 35000, monthlyMaintenance: 1500, productivityBonus: 18, qualityBonus: 12, automationLevel: 45, integrations: ['cloud', 'devops'] },
  { name: 'Monitoring Avancé', category: 'devops', level: 5, cost: 15000, monthlyMaintenance: 600, productivityBonus: 10, qualityBonus: 10, automationLevel: 20, integrations: ['cloud', 'devops'] },
  { name: 'GitOps', category: 'devops', level: 7, cost: 30000, monthlyMaintenance: 1200, productivityBonus: 15, qualityBonus: 12, automationLevel: 40, integrations: ['devops', 'cloud'] },
  
  // Green Tech
  { name: 'Smart Building', category: 'green_tech', level: 6, cost: 80000, monthlyMaintenance: 2000, productivityBonus: 8, qualityBonus: 5, automationLevel: 30, integrations: ['iot', 'automation'] },
  { name: 'Energy Management', category: 'green_tech', level: 5, cost: 40000, monthlyMaintenance: 1500, productivityBonus: 5, qualityBonus: 5, automationLevel: 25, integrations: ['iot', 'bi'] },
  { name: 'Carbon Tracking', category: 'green_tech', level: 4, cost: 20000, monthlyMaintenance: 800, productivityBonus: 0, qualityBonus: 10, automationLevel: 15, integrations: ['bi', 'erp'] },
  { name: 'Circular Economy Platform', category: 'green_tech', level: 6, cost: 50000, monthlyMaintenance: 2000, productivityBonus: 5, qualityBonus: 15, automationLevel: 20, integrations: ['erp', 'data'] },
  
  // Advanced
  { name: 'Blockchain Enterprise', category: 'blockchain', level: 7, cost: 100000, monthlyMaintenance: 5000, productivityBonus: 5, qualityBonus: 20, automationLevel: 25, integrations: ['cloud', 'cybersecurity'] },
  { name: 'Smart Contracts', category: 'blockchain', level: 6, cost: 50000, monthlyMaintenance: 2000, productivityBonus: 8, qualityBonus: 15, automationLevel: 35, integrations: ['blockchain'] },
  { name: 'Quantum Computing Access', category: 'quantum', level: 9, cost: 200000, monthlyMaintenance: 15000, productivityBonus: 25, qualityBonus: 30, automationLevel: 10, integrations: ['ia', 'data'] },
];

// ==================== RESEARCH PROJECTS - 30+ ====================
export const RESEARCH_AREAS: { area: ResearchArea; name: string; baseTime: number; baseCost: number }[] = [
  { area: 'produit', name: 'Développement Produit', baseTime: 180, baseCost: 50000 },
  { area: 'process', name: 'Amélioration Process', baseTime: 120, baseCost: 30000 },
  { area: 'materiau', name: 'Nouveaux Matériaux', baseTime: 360, baseCost: 100000 },
  { area: 'logiciel', name: 'Développement Logiciel', baseTime: 90, baseCost: 40000 },
  { area: 'service', name: 'Innovation Service', baseTime: 60, baseCost: 20000 },
  { area: 'energie', name: 'Énergie Propre', baseTime: 240, baseCost: 80000 },
  { area: 'bio', name: 'Biotechnologie', baseTime: 300, baseCost: 150000 },
  { area: 'nano', name: 'Nanotechnologie', baseTime: 365, baseCost: 200000 },
  { area: 'robotique', name: 'Robotique', baseTime: 270, baseCost: 120000 },
  { area: 'spatial', name: 'Technologies Spatiales', baseTime: 540, baseCost: 500000 },
];

// ==================== TECHNOLOGY FUNCTIONS ====================

// Create a new technology implementation
export function implementTechnology(techName: string, currentDay: number): Technology | null {
  const tech = TECHNOLOGIES_DATABASE.find(t => t.name === techName);
  if (!tech) return null;
  
  return {
    ...tech,
    id: `tech_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    implementationDate: currentDay,
  };
}

// Create a new research project
export function createResearchProject(
  name: string,
  area: ResearchArea,
  budget: number,
  teamSize: number,
  currentDay: number
): ResearchProject {
  const areaConfig = RESEARCH_AREAS.find(a => a.area === area)!;
  const scaleFactor = budget / areaConfig.baseCost;
  
  return {
    id: `rnd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    area,
    description: `Projet de recherche en ${areaConfig.name}`,
    budget,
    spentBudget: 0,
    progress: 0,
    startDate: currentDay,
    estimatedDuration: Math.round(areaConfig.baseTime / Math.sqrt(scaleFactor)),
    teamSize,
    trl: 1,
    risks: generateResearchRisks(area),
    milestones: generateMilestones(areaConfig.baseTime),
    deliverables: [],
    potentialPatents: Math.floor(scaleFactor * 2),
    successProbability: 60 + teamSize * 2,
  };
}

// Generate research risks
function generateResearchRisks(area: ResearchArea): ResearchRisk[] {
  const riskTemplates = [
    { description: 'Retard technique', probability: 40, impact: 'moyen' as const },
    { description: 'Dépassement budget', probability: 35, impact: 'eleve' as const },
    { description: 'Échec prototype', probability: 25, impact: 'critique' as const },
    { description: 'Perte talent clé', probability: 15, impact: 'eleve' as const },
    { description: 'Concurrent plus rapide', probability: 30, impact: 'critique' as const },
    { description: 'Réglementation nouvelle', probability: 20, impact: 'moyen' as const },
    { description: 'Approvisionnement', probability: 25, impact: 'faible' as const },
  ];
  
  return riskTemplates.slice(0, 4).map((r, i) => ({
    id: `risk_${i}`,
    ...r,
    mitigation: 'Plan de contingence à définir',
    occurred: false,
  }));
}

// Generate research milestones
function generateMilestones(duration: number): ResearchMilestone[] {
  const milestoneNames = [
    'Étude de faisabilité',
    'Conception préliminaire',
    'Prototype initial',
    'Tests et validation',
    'Optimisation',
    'Préparation production',
  ];
  
  return milestoneNames.map((name, i) => ({
    id: `ms_${i}`,
    name,
    description: `Phase ${i + 1}: ${name}`,
    targetDate: Math.round((duration / milestoneNames.length) * (i + 1)),
    completed: false,
  }));
}

// Process daily R&D progress
export function processResearchDay(project: ResearchProject, currentDay: number): ResearchProject {
  if (project.progress >= 100) return project;
  
  const elapsed = currentDay - project.startDate;
  const dailyProgress = 100 / project.estimatedDuration;
  const teamBonus = project.teamSize * 0.1;
  
  // Check for risk occurrence
  const updatedRisks = project.risks.map(risk => {
    if (!risk.occurred && Math.random() * 100 < risk.probability / project.estimatedDuration) {
      return { ...risk, occurred: true };
    }
    return risk;
  });
  
  // Calculate impact of occurred risks
  const riskImpact = updatedRisks.filter(r => r.occurred).reduce((sum, r) => {
    const impactValues = { faible: 0.1, moyen: 0.2, eleve: 0.3, critique: 0.5 };
    return sum + impactValues[r.impact];
  }, 0);
  
  const actualProgress = dailyProgress * (1 + teamBonus) * (1 - riskImpact);
  const newProgress = Math.min(100, project.progress + actualProgress);
  
  // Update milestones
  const updatedMilestones = project.milestones.map(ms => {
    if (!ms.completed && elapsed >= ms.targetDate * (project.progress / 100)) {
      return { ...ms, completed: true, completedDate: currentDay };
    }
    return ms;
  });
  
  // Update TRL based on progress
  const newTrl = Math.min(9, Math.ceil(newProgress / 11)) as TechnologyReadiness;
  
  return {
    ...project,
    progress: newProgress,
    spentBudget: project.budget * (newProgress / 100),
    risks: updatedRisks,
    milestones: updatedMilestones,
    trl: newTrl,
  };
}

// Calculate innovation score
export function calculateInnovationScore(company: Company): number {
  const patentScore = company.intellectualProperty.filter(ip => ip.type === 'brevet').length * 5;
  const rdScore = company.products.filter(p => p.phase === 'rd').length * 3;
  const qualityScore = company.products.reduce((sum, p) => sum + p.quality, 0) / Math.max(1, company.products.length);
  
  return Math.min(100, patentScore + rdScore + qualityScore / 2);
}

// Generate patent from research
export function generatePatent(project: ResearchProject, currentDay: number): IntellectualProperty {
  return {
    id: `pat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'brevet',
    name: `Brevet ${project.name}`,
    registrationDate: currentDay,
    expirationDate: currentDay + 7300, // 20 years
    annualFee: 2000,
    value: project.budget * 2,
  };
}

// Calculate technology debt
export function calculateTechDebt(technologies: Technology[], currentDay: number): number {
  return technologies.reduce((debt, tech) => {
    if (!tech.implementationDate) return debt;
    const age = (currentDay - tech.implementationDate) / 365;
    const obsolescenceRate = (10 - tech.level) * 0.05;
    return debt + age * obsolescenceRate * tech.cost;
  }, 0);
}

// Get technology recommendations
export function recommendTechnologies(company: Company): string[] {
  const existing = company.products.map(p => p.name.toLowerCase());
  const recommendations: string[] = [];
  
  // Basic needs
  if (!existing.some(e => e.includes('erp'))) {
    recommendations.push('ERP Cloud');
  }
  if (!existing.some(e => e.includes('crm'))) {
    recommendations.push('CRM Avancé');
  }
  if (company.employees.length > 20 && !existing.some(e => e.includes('bi'))) {
    recommendations.push('Business Intelligence Suite');
  }
  if (company.employees.length > 50) {
    recommendations.push('RPA Advanced');
  }
  if (company.foreignMarkets.length > 0) {
    recommendations.push('Cloud Hybride');
  }
  
  return recommendations.slice(0, 5);
}
