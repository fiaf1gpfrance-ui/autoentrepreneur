// Types for advanced company creation

export interface CompanyBranding {
  logo: string; // emoji or icon key
  primaryColor: string;
  secondaryColor: string;
  slogan: string;
  mission: string;
  values: CompanyValue[];
}

export type CompanyValue = 'innovation' | 'qualite' | 'respect' | 'durabilite' | 'excellence' | 'integrite' | 'collaboration' | 'audace' | 'transparence' | 'agilite';

export const COMPANY_VALUES: Record<CompanyValue, { label: string; description: string; bonus: string }> = {
  innovation: { label: 'Innovation', description: 'Toujours chercher de nouvelles solutions', bonus: '+15% R&D' },
  qualite: { label: 'Qualité', description: 'Ne jamais faire de compromis sur la qualité', bonus: '+10% Prix de vente' },
  respect: { label: 'Respect', description: 'Respect des personnes et de l\'environnement', bonus: '+15% Moral employés' },
  durabilite: { label: 'Durabilité', description: 'Penser long terme et responsable', bonus: '+10% Réputation' },
  excellence: { label: 'Excellence', description: 'Viser l\'excellence en tout', bonus: '+10% Productivité' },
  integrite: { label: 'Intégrité', description: 'Agir avec honnêteté et transparence', bonus: '+15% Crédibilité' },
  collaboration: { label: 'Collaboration', description: 'Travailler ensemble pour réussir', bonus: '+20% Moral équipe' },
  audace: { label: 'Audace', description: 'Oser prendre des risques calculés', bonus: '+20% Croissance' },
  transparence: { label: 'Transparence', description: 'Communiquer ouvertement', bonus: '+10% Relations clients' },
  agilite: { label: 'Agilité', description: 'S\'adapter rapidement au changement', bonus: '+15% Réactivité' },
};

export interface OfficeChoice {
  id: string;
  type: 'domicile' | 'coworking' | 'petit_bureau' | 'bureau_moyen' | 'grand_bureau' | 'local_commercial';
  name: string;
  description: string;
  monthlyRent: number;
  maxEmployees: number;
  prestige: number;
  moralBonus: number;
  productivityBonus: number;
  location: string;
}

export const OFFICE_OPTIONS: OfficeChoice[] = [
  { id: 'domicile', type: 'domicile', name: 'Domicile', description: 'Travaillez depuis chez vous', monthlyRent: 0, maxEmployees: 1, prestige: 1, moralBonus: 5, productivityBonus: -5, location: 'Personnel' },
  { id: 'coworking', type: 'coworking', name: 'Espace Coworking', description: 'Bureau partagé moderne', monthlyRent: 300, maxEmployees: 3, prestige: 3, moralBonus: 10, productivityBonus: 5, location: 'Centre-ville' },
  { id: 'petit_bureau', type: 'petit_bureau', name: 'Petit Bureau', description: 'Bureau privé 20m²', monthlyRent: 800, maxEmployees: 5, prestige: 4, moralBonus: 8, productivityBonus: 8, location: 'Quartier affaires' },
  { id: 'bureau_moyen', type: 'bureau_moyen', name: 'Bureau Moyen', description: 'Bureau spacieux 80m²', monthlyRent: 2500, maxEmployees: 15, prestige: 6, moralBonus: 12, productivityBonus: 12, location: 'Centre-ville' },
  { id: 'grand_bureau', type: 'grand_bureau', name: 'Grand Bureau', description: 'Plateau open-space 200m²', monthlyRent: 6000, maxEmployees: 40, prestige: 8, moralBonus: 15, productivityBonus: 15, location: 'Tour d\'affaires' },
  { id: 'local_commercial', type: 'local_commercial', name: 'Local Commercial', description: 'Boutique avec vitrine', monthlyRent: 3500, maxEmployees: 10, prestige: 7, moralBonus: 10, productivityBonus: 5, location: 'Rue commerçante' },
];

export interface CoFounder {
  id: string;
  name: string;
  role: 'technique' | 'commercial' | 'finance' | 'operations' | 'marketing';
  skills: number;
  equity: number; // percentage
  salary: number;
  experience: number; // years
  trait: string;
  avatar: string;
}

export const COFOUNDER_TEMPLATES: Omit<CoFounder, 'id' | 'equity' | 'salary'>[] = [
  { name: 'Alexandre Martin', role: 'technique', skills: 85, experience: 8, trait: 'Génie du code', avatar: '👨‍💻' },
  { name: 'Sophie Dubois', role: 'commercial', skills: 90, experience: 12, trait: 'Négociatrice hors pair', avatar: '👩‍💼' },
  { name: 'Thomas Bernard', role: 'finance', skills: 88, experience: 10, trait: 'As des chiffres', avatar: '👨‍💹' },
  { name: 'Marie Leroy', role: 'operations', skills: 82, experience: 7, trait: 'Organisatrice née', avatar: '👩‍🔧' },
  { name: 'Pierre Moreau', role: 'marketing', skills: 87, experience: 9, trait: 'Créatif visionnaire', avatar: '👨‍🎨' },
  { name: 'Julie Richard', role: 'technique', skills: 92, experience: 15, trait: 'Architecte système', avatar: '👩‍💻' },
  { name: 'François Petit', role: 'commercial', skills: 85, experience: 6, trait: 'Chasseur de deals', avatar: '🕴️' },
  { name: 'Camille Durand', role: 'finance', skills: 80, experience: 5, trait: 'Analyste précis', avatar: '👩‍💹' },
];

export interface BusinessPlan {
  targetMarket: string;
  competitiveAdvantage: string;
  revenueModel: RevenueModel;
  yearOneGoals: BusinessGoal[];
  initialStrategy: GrowthStrategy;
  fundingNeeds: number;
}

export type RevenueModel = 'vente_directe' | 'abonnement' | 'freemium' | 'commission' | 'publicite' | 'licence' | 'hybride';

export const REVENUE_MODELS: Record<RevenueModel, { label: string; description: string; pros: string[]; cons: string[] }> = {
  vente_directe: { label: 'Vente Directe', description: 'Vente de produits ou services', pros: ['Simple à comprendre', 'Cash immédiat'], cons: ['Revenus fluctuants', 'Effort constant'] },
  abonnement: { label: 'Abonnement', description: 'Revenus récurrents mensuels/annuels', pros: ['Revenus prévisibles', 'Fidélisation'], cons: ['Acquisition coûteuse', 'Churn'] },
  freemium: { label: 'Freemium', description: 'Version gratuite + premium payante', pros: ['Acquisition facile', 'Viralité'], cons: ['Conversion faible', 'Coûts fixes'] },
  commission: { label: 'Commission', description: 'Pourcentage sur transactions', pros: ['Scalable', 'Alignement intérêts'], cons: ['Volume nécessaire', 'Dépendance'] },
  publicite: { label: 'Publicité', description: 'Monétisation par la pub', pros: ['Gratuit pour users', 'Scalable'], cons: ['UX dégradée', 'Revenus instables'] },
  licence: { label: 'Licence', description: 'Vente de droits d\'utilisation', pros: ['Marges élevées', 'Récurrent'], cons: ['Cycle long', 'Support nécessaire'] },
  hybride: { label: 'Hybride', description: 'Combinaison de plusieurs modèles', pros: ['Diversification', 'Optimisation'], cons: ['Complexité', 'Focus dilué'] },
};

export interface BusinessGoal {
  id: string;
  type: 'revenue' | 'employees' | 'customers' | 'products' | 'market_share';
  target: number;
  unit: string;
}

export type GrowthStrategy = 'bootstrap' | 'blitzscaling' | 'sustainable' | 'niche' | 'acquisition';

export const GROWTH_STRATEGIES: Record<GrowthStrategy, { label: string; description: string; riskLevel: number; growthPotential: number }> = {
  bootstrap: { label: 'Bootstrap', description: 'Croissance autofinancée, pas de levée de fonds', riskLevel: 2, growthPotential: 3 },
  blitzscaling: { label: 'Blitzscaling', description: 'Croissance ultra-rapide, brûler du cash', riskLevel: 5, growthPotential: 5 },
  sustainable: { label: 'Croissance Durable', description: 'Équilibre entre croissance et rentabilité', riskLevel: 2, growthPotential: 3 },
  niche: { label: 'Stratégie de Niche', description: 'Dominer un segment spécifique', riskLevel: 3, growthPotential: 3 },
  acquisition: { label: 'Croissance Externe', description: 'Grandir par acquisitions', riskLevel: 4, growthPotential: 4 },
};

// Logo options (emoji-based)
export const LOGO_OPTIONS = [
  '🚀', '💡', '⭐', '🎯', '🔥', '💎', '🌟', '⚡', '🎨', '🔧',
  '🏆', '🌱', '🦁', '🦅', '🐉', '🌈', '☀️', '🌊', '🏔️', '🌍',
  '💼', '📊', '🎭', '🎪', '🎢', '🎡', '🎠', '🎲', '🎮', '🎬',
];

// Color palette options
export const COLOR_OPTIONS = [
  { name: 'Bleu Royal', primary: '#1e40af', secondary: '#3b82f6' },
  { name: 'Vert Émeraude', primary: '#047857', secondary: '#10b981' },
  { name: 'Rouge Passion', primary: '#b91c1c', secondary: '#ef4444' },
  { name: 'Orange Énergie', primary: '#c2410c', secondary: '#f97316' },
  { name: 'Violet Innovation', primary: '#7c3aed', secondary: '#a78bfa' },
  { name: 'Rose Moderne', primary: '#be185d', secondary: '#ec4899' },
  { name: 'Cyan Tech', primary: '#0891b2', secondary: '#22d3ee' },
  { name: 'Jaune Dynamique', primary: '#ca8a04', secondary: '#facc15' },
  { name: 'Gris Premium', primary: '#374151', secondary: '#6b7280' },
  { name: 'Noir Élégant', primary: '#18181b', secondary: '#3f3f46' },
];
