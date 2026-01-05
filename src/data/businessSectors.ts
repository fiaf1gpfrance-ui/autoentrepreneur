// ===== BASE DE DONNÉES DES 26 SECTEURS D'ACTIVITÉ =====

import { SectorConfig, BusinessSector, SectorCategory } from '@/types/businessSectors';

// Métadonnées des secteurs (version simplifiée pour la création)
export interface SectorMetadata {
  id: BusinessSector;
  category: SectorCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  startingCapitalMin: number;
  startingCapitalRecommended: number;
  keyStats: {
    marginPotential: 'faible' | 'moyenne' | 'élevée' | 'très élevée';
    cycleEconomique: 'défensif' | 'neutre' | 'cyclique' | 'très cyclique';
    intensitéCapital: 'faible' | 'moyenne' | 'élevée' | 'très élevée';
    barrièresEntrée: 'faible' | 'moyenne' | 'élevée' | 'extrême';
    innovationRequise: 'faible' | 'moyenne' | 'élevée' | 'critique';
  };
  uniqueMechanics: string[];
}

// ==================== INDUSTRIE LOURDE (6 secteurs) ====================

const AUTOMOBILE: SectorMetadata = {
  id: 'automobile',
  category: 'industrie',
  name: 'Automobile',
  description: 'Conception, fabrication et vente de véhicules motorisés. Secteur à forte intensité capitalistique avec des cycles de développement longs.',
  icon: '🚗',
  color: '#3B82F6',
  difficulty: 5,
  startingCapitalMin: 50000000,
  startingCapitalRecommended: 200000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'très cyclique',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'extrême',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Gestion de chaîne d\'approvisionnement complexe (10000+ pièces)',
    'Rappels de véhicules et risques juridiques',
    'Transition électrique obligatoire',
    'Négociations syndicales majeures',
    'Homologation par pays',
    'Réseaux de concessionnaires'
  ]
};

const AERONAUTIQUE: SectorMetadata = {
  id: 'aeronautique',
  category: 'industrie',
  name: 'Aéronautique',
  description: 'Conception et fabrication d\'aéronefs civils et militaires. Secteur ultra-réglementé avec des contrats sur 20+ ans.',
  icon: '✈️',
  color: '#0EA5E9',
  difficulty: 5,
  startingCapitalMin: 500000000,
  startingCapitalRecommended: 2000000000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'extrême',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Certifications EASA/FAA obligatoires',
    'Carnets de commandes sur 10+ ans',
    'Contrats militaires gouvernementaux',
    'Sous-traitance mondiale (Tier 1, 2, 3)',
    'Incidents aériens = arrêt de flotte',
    'Technologies classifiées défense'
  ]
};

const SIDERURGIE: SectorMetadata = {
  id: 'siderurgie',
  category: 'industrie',
  name: 'Sidérurgie & Métallurgie',
  description: 'Production d\'acier, aluminium et métaux. Industrie cyclique dépendante des prix des matières premières.',
  icon: '🏭',
  color: '#6B7280',
  difficulty: 4,
  startingCapitalMin: 100000000,
  startingCapitalRecommended: 500000000,
  keyStats: {
    marginPotential: 'faible',
    cycleEconomique: 'très cyclique',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'élevée',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Volatilité des prix des métaux',
    'Taxes antidumping internationales',
    'Contrats long terme avec constructeurs',
    'Fours à arc électrique vs hauts-fourneaux',
    'Quotas carbone stricts',
    'Recyclage et économie circulaire'
  ]
};

const CHIMIE: SectorMetadata = {
  id: 'chimie',
  category: 'industrie',
  name: 'Chimie & Pétrochimie',
  description: 'Production de produits chimiques, plastiques, engrais. Secteur à hauts risques environnementaux et industriels.',
  icon: '🧪',
  color: '#8B5CF6',
  difficulty: 4,
  startingCapitalMin: 50000000,
  startingCapitalRecommended: 300000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'élevée',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Sites Seveso et risques d\'explosion',
    'Réglementations REACH strictes',
    'Brevets sur molécules',
    'Contrats pétrochimiques liés au pétrole',
    'Responsabilité environnementale étendue',
    'Spécialisation chimie fine vs commodités'
  ]
};

const ENERGIE: SectorMetadata = {
  id: 'energie',
  category: 'industrie',
  name: 'Énergie',
  description: 'Production, distribution et vente d\'énergie (pétrole, gaz, renouvelables, nucléaire). Secteur stratégique ultra-réglementé.',
  icon: '⚡',
  color: '#F59E0B',
  difficulty: 5,
  startingCapitalMin: 100000000,
  startingCapitalRecommended: 1000000000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'défensif',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'extrême',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Concessions et licences d\'exploitation',
    'Prix régulés par l\'État',
    'Transition énergétique obligatoire',
    'Géopolitique et embargos',
    'Maintenance réseaux haute tension',
    'Trading énergie en temps réel'
  ]
};

const CONSTRUCTION: SectorMetadata = {
  id: 'construction',
  category: 'industrie',
  name: 'Construction & BTP',
  description: 'Construction de bâtiments, infrastructures, travaux publics. Secteur cyclique lié aux politiques d\'investissement.',
  icon: '🏗️',
  color: '#EA580C',
  difficulty: 3,
  startingCapitalMin: 1000000,
  startingCapitalRecommended: 20000000,
  keyStats: {
    marginPotential: 'faible',
    cycleEconomique: 'très cyclique',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'moyenne',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Appels d\'offres publics',
    'Garanties décennales',
    'Sous-traitance en cascade',
    'Accidents du travail et sécurité',
    'Pénalités de retard',
    'Variations météo impactent le planning'
  ]
};

// ==================== TECH & DIGITAL (7 secteurs) ====================

const SOFTWARE: SectorMetadata = {
  id: 'software',
  category: 'tech',
  name: 'Édition de logiciels',
  description: 'Développement et commercialisation de logiciels B2B/B2C. Modèles SaaS, licences, freemium.',
  icon: '💻',
  color: '#10B981',
  difficulty: 3,
  startingCapitalMin: 50000,
  startingCapitalRecommended: 500000,
  keyStats: {
    marginPotential: 'très élevée',
    cycleEconomique: 'défensif',
    intensitéCapital: 'faible',
    barrièresEntrée: 'faible',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Modèles SaaS et MRR/ARR',
    'Churn et rétention clients',
    'Sprints et méthodologie agile',
    'Open source vs propriétaire',
    'Scalabilité infinie',
    'Guerre des talents développeurs'
  ]
};

const INTELLIGENCE_ARTIFICIELLE: SectorMetadata = {
  id: 'intelligence_artificielle',
  category: 'tech',
  name: 'Intelligence Artificielle',
  description: 'Développement de solutions d\'IA, machine learning, deep learning. Secteur en hypercroissance.',
  icon: '🤖',
  color: '#6366F1',
  difficulty: 4,
  startingCapitalMin: 500000,
  startingCapitalRecommended: 5000000,
  keyStats: {
    marginPotential: 'très élevée',
    cycleEconomique: 'neutre',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'élevée',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Accès aux données d\'entraînement',
    'Coûts GPU/TPU exponentiels',
    'Réglementations IA émergentes',
    'Talents PhD ultra-rares',
    'Brevets algorithmes contestés',
    'Éthique et biais algorithmiques'
  ]
};

const CLOUD_COMPUTING: SectorMetadata = {
  id: 'cloud_computing',
  category: 'tech',
  name: 'Cloud Computing',
  description: 'Services d\'infrastructure cloud (IaaS, PaaS, SaaS). Oligopole dominé par les géants.',
  icon: '☁️',
  color: '#0891B2',
  difficulty: 5,
  startingCapitalMin: 10000000,
  startingCapitalRecommended: 100000000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'défensif',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'extrême',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Datacenters et coûts énergétiques',
    'SLAs et garanties de disponibilité',
    'Souveraineté des données',
    'Effet de réseau et lock-in',
    'Pricing complexe à l\'usage',
    'Concurrence AWS/Azure/GCP'
  ]
};

const CYBERSECURITE: SectorMetadata = {
  id: 'cybersecurite',
  category: 'tech',
  name: 'Cybersécurité',
  description: 'Solutions de protection des systèmes informatiques. Marché en forte croissance avec les cybermenaces.',
  icon: '🔐',
  color: '#DC2626',
  difficulty: 3,
  startingCapitalMin: 200000,
  startingCapitalRecommended: 2000000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'défensif',
    intensitéCapital: 'faible',
    barrièresEntrée: 'moyenne',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Veille menaces en temps réel',
    'Certifications sécurité (ISO 27001)',
    'Bug bounty programs',
    'Réponse aux incidents 24/7',
    'Réglementations RGPD/NIS2',
    'Recrutement hackers éthiques'
  ]
};

const FINTECH: SectorMetadata = {
  id: 'fintech',
  category: 'tech',
  name: 'Fintech',
  description: 'Technologies financières : paiements, néobanques, crypto, trading. Ultra-réglementé.',
  icon: '💳',
  color: '#7C3AED',
  difficulty: 4,
  startingCapitalMin: 2000000,
  startingCapitalRecommended: 20000000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'neutre',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'élevée',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Licences bancaires/EME obligatoires',
    'Réglementations AML/KYC',
    'Partenariats avec banques traditionnelles',
    'Fraude et chargebacks',
    'Open Banking et APIs',
    'Crypto et réglementations MiCA'
  ]
};

const GAMING: SectorMetadata = {
  id: 'gaming',
  category: 'tech',
  name: 'Jeux Vidéo',
  description: 'Développement et édition de jeux vidéo. Marché de masse avec des succès imprévisibles.',
  icon: '🎮',
  color: '#EC4899',
  difficulty: 3,
  startingCapitalMin: 100000,
  startingCapitalRecommended: 2000000,
  keyStats: {
    marginPotential: 'très élevée',
    cycleEconomique: 'neutre',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'faible',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Cycles de développement 2-5 ans',
    'Crunch et burnout équipes',
    'Modèles F2P et microtransactions',
    'Metacritic score = succès',
    'eSports et streaming',
    'Plateformes et exclusivités'
  ]
};

const BIOTECH: SectorMetadata = {
  id: 'biotech',
  category: 'tech',
  name: 'Biotechnologie',
  description: 'Recherche et développement de traitements biologiques, thérapies géniques. Ultra-long terme.',
  icon: '🧬',
  color: '#22C55E',
  difficulty: 5,
  startingCapitalMin: 10000000,
  startingCapitalRecommended: 100000000,
  keyStats: {
    marginPotential: 'très élevée',
    cycleEconomique: 'défensif',
    intensitéCapital: 'élevée',
    barrièresEntrée: 'extrême',
    innovationRequise: 'critique'
  },
  uniqueMechanics: [
    'Essais cliniques Phase I-III (10+ ans)',
    'Approbations FDA/EMA',
    'Brevets 20 ans sur molécules',
    'Partenariats big pharma',
    'Risque binaire (succès/échec)',
    'Financement par levées successives'
  ]
};

// ==================== SERVICES (7 secteurs) ====================

const CONSEIL: SectorMetadata = {
  id: 'conseil',
  category: 'services',
  name: 'Conseil',
  description: 'Conseil en stratégie, management, IT. Business model basé sur le temps facturé.',
  icon: '📊',
  color: '#1E40AF',
  difficulty: 2,
  startingCapitalMin: 20000,
  startingCapitalRecommended: 200000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'faible',
    barrièresEntrée: 'faible',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Facturation au jour (TJM)',
    'Pyramide des grades (analyst→partner)',
    'Up or out culture',
    'Réputation et références clients',
    'Missions et staffing',
    'Knowledge management'
  ]
};

const BANQUE: SectorMetadata = {
  id: 'banque',
  category: 'services',
  name: 'Banque',
  description: 'Services bancaires traditionnels : dépôts, crédits, investissement. Ultra-réglementé.',
  icon: '🏦',
  color: '#1E3A8A',
  difficulty: 5,
  startingCapitalMin: 50000000,
  startingCapitalRecommended: 500000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'très élevée',
    barrièresEntrée: 'extrême',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Ratios prudentiels Bâle III',
    'Licences bancaires',
    'Gestion du risque de crédit',
    'Taux directeurs BCE/Fed',
    'Stress tests régulateurs',
    'Systèmes legacy à moderniser'
  ]
};

const ASSURANCE: SectorMetadata = {
  id: 'assurance',
  category: 'services',
  name: 'Assurance',
  description: 'Assurance vie, dommages, santé. Business model basé sur la gestion du risque.',
  icon: '🛡️',
  color: '#0F766E',
  difficulty: 4,
  startingCapitalMin: 20000000,
  startingCapitalRecommended: 200000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'défensif',
    intensitéCapital: 'élevée',
    barrièresEntrée: 'élevée',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Actuariat et modélisation des risques',
    'Réserves techniques obligatoires',
    'Solvabilité II',
    'Réassurance',
    'Sinistres catastrophiques',
    'Distribution via courtiers/agents'
  ]
};

const IMMOBILIER: SectorMetadata = {
  id: 'immobilier',
  category: 'services',
  name: 'Immobilier',
  description: 'Promotion, gestion et transaction immobilière. Secteur cyclique lié aux taux d\'intérêt.',
  icon: '🏠',
  color: '#B45309',
  difficulty: 3,
  startingCapitalMin: 500000,
  startingCapitalRecommended: 10000000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'très cyclique',
    intensitéCapital: 'élevée',
    barrièresEntrée: 'moyenne',
    innovationRequise: 'faible'
  },
  uniqueMechanics: [
    'Effet de levier bancaire',
    'Cycles immobiliers 7-10 ans',
    'Zonage et permis de construire',
    'Gestion locative',
    'SCPI et foncières cotées',
    'Fiscalité complexe (LMNP, SCI...)'
  ]
};

const JURIDIQUE: SectorMetadata = {
  id: 'juridique',
  category: 'services',
  name: 'Juridique',
  description: 'Cabinets d\'avocats, notaires, conseils juridiques. Profession réglementée.',
  icon: '⚖️',
  color: '#4B5563',
  difficulty: 3,
  startingCapitalMin: 50000,
  startingCapitalRecommended: 500000,
  keyStats: {
    marginPotential: 'élevée',
    cycleEconomique: 'défensif',
    intensitéCapital: 'faible',
    barrièresEntrée: 'élevée',
    innovationRequise: 'faible'
  },
  uniqueMechanics: [
    'Barreau et ordre professionnel',
    'Secret professionnel',
    'Honoraires libres ou réglementés',
    'Conflits d\'intérêts',
    'Spécialisations (M&A, pénal, fiscal...)',
    'Legal tech et automatisation'
  ]
};

const SANTE: SectorMetadata = {
  id: 'sante',
  category: 'services',
  name: 'Santé',
  description: 'Cliniques, laboratoires, services médicaux. Secteur défensif ultra-réglementé.',
  icon: '🏥',
  color: '#0D9488',
  difficulty: 4,
  startingCapitalMin: 2000000,
  startingCapitalRecommended: 20000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'défensif',
    intensitéCapital: 'élevée',
    barrièresEntrée: 'élevée',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Accréditations sanitaires',
    'Conventionnement sécurité sociale',
    'Responsabilité médicale',
    'Pénurie de personnel soignant',
    'Équipements médicaux coûteux',
    'Données patients RGPD santé'
  ]
};

const TRANSPORT: SectorMetadata = {
  id: 'transport',
  category: 'services',
  name: 'Transport & Logistique',
  description: 'Transport de personnes et marchandises, logistique. Secteur à faibles marges.',
  icon: '🚚',
  color: '#2563EB',
  difficulty: 3,
  startingCapitalMin: 200000,
  startingCapitalRecommended: 5000000,
  keyStats: {
    marginPotential: 'faible',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'moyenne',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Licences de transport',
    'Coûts carburant volatils',
    'Réglementations temps de conduite',
    'Last mile delivery',
    'Entreposage et stock',
    'Tracking et visibilité'
  ]
};

// ==================== COMMERCE & RETAIL (6 secteurs) ====================

const GRANDE_DISTRIBUTION: SectorMetadata = {
  id: 'grande_distribution',
  category: 'commerce',
  name: 'Grande Distribution',
  description: 'Hypermarchés, supermarchés, discounters. Marges faibles, volumes élevés.',
  icon: '🛒',
  color: '#16A34A',
  difficulty: 4,
  startingCapitalMin: 5000000,
  startingCapitalRecommended: 50000000,
  keyStats: {
    marginPotential: 'faible',
    cycleEconomique: 'défensif',
    intensitéCapital: 'élevée',
    barrièresEntrée: 'élevée',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Négociations fournisseurs (marges arrière)',
    'MDD et marques propres',
    'Gestion des stocks et DLC',
    'Implantations et zones de chalandise',
    'Guerre des prix',
    'Omnicanal (drive, livraison)'
  ]
};

const ECOMMERCE: SectorMetadata = {
  id: 'ecommerce',
  category: 'commerce',
  name: 'E-commerce',
  description: 'Vente en ligne, marketplaces. Croissance forte mais marges sous pression.',
  icon: '🌐',
  color: '#F97316',
  difficulty: 3,
  startingCapitalMin: 50000,
  startingCapitalRecommended: 1000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'neutre',
    intensitéCapital: 'faible',
    barrièresEntrée: 'faible',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'CAC (coût acquisition client)',
    'Taux de conversion',
    'Logistique et retours',
    'SEO et marketing digital',
    'Marketplaces vs D2C',
    'Reviews et réputation'
  ]
};

const LUXE: SectorMetadata = {
  id: 'luxe',
  category: 'commerce',
  name: 'Luxe',
  description: 'Mode haut de gamme, joaillerie, horlogerie. Marges exceptionnelles, clientèle exclusive.',
  icon: '💎',
  color: '#9333EA',
  difficulty: 4,
  startingCapitalMin: 2000000,
  startingCapitalRecommended: 30000000,
  keyStats: {
    marginPotential: 'très élevée',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'élevée',
    innovationRequise: 'moyenne'
  },
  uniqueMechanics: [
    'Héritage et histoire de marque',
    'Exclusivité et rareté contrôlée',
    'Artisanat et savoir-faire',
    'Boutiques flagship',
    'Clientèle VIP et personal shoppers',
    'Contrefaçon et protection IP'
  ]
};

const RESTAURATION: SectorMetadata = {
  id: 'restauration',
  category: 'commerce',
  name: 'Restauration',
  description: 'Restaurants, fast-food, cafés. Marges serrées, turnover élevé.',
  icon: '🍽️',
  color: '#EF4444',
  difficulty: 2,
  startingCapitalMin: 50000,
  startingCapitalRecommended: 300000,
  keyStats: {
    marginPotential: 'faible',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'faible',
    innovationRequise: 'faible'
  },
  uniqueMechanics: [
    'Normes d\'hygiène HACCP',
    'Gestion du food cost',
    'Personnel en tension',
    'Livraison et dark kitchens',
    'Avis en ligne critiques',
    'Saisonnalité et emplacement'
  ]
};

const MODE: SectorMetadata = {
  id: 'mode',
  category: 'commerce',
  name: 'Mode & Textile',
  description: 'Création et distribution de vêtements, accessoires. Tendances rapides, stocks risqués.',
  icon: '👗',
  color: '#DB2777',
  difficulty: 3,
  startingCapitalMin: 100000,
  startingCapitalRecommended: 2000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'moyenne',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Collections saisonnières (2-4/an)',
    'Fast fashion vs slow fashion',
    'Sourcing et éthique',
    'Soldes et déstockage',
    'Influenceurs et défilés',
    'Tailles et retours'
  ]
};

const MEDIAS: SectorMetadata = {
  id: 'medias',
  category: 'commerce',
  name: 'Médias & Divertissement',
  description: 'Presse, audiovisuel, streaming. Modèles publicitaires et abonnements.',
  icon: '📺',
  color: '#A855F7',
  difficulty: 3,
  startingCapitalMin: 500000,
  startingCapitalRecommended: 10000000,
  keyStats: {
    marginPotential: 'moyenne',
    cycleEconomique: 'cyclique',
    intensitéCapital: 'moyenne',
    barrièresEntrée: 'moyenne',
    innovationRequise: 'élevée'
  },
  uniqueMechanics: [
    'Contenus originaux vs licenciés',
    'Revenus pub vs abonnements',
    'Droits de diffusion',
    'Audiences et ratings',
    'Régulation CSA/FCC',
    'Guerre du streaming'
  ]
};

// ==================== EXPORT FINAL ====================

export const ALL_SECTORS: SectorMetadata[] = [
  // Industrie
  AUTOMOBILE, AERONAUTIQUE, SIDERURGIE, CHIMIE, ENERGIE, CONSTRUCTION,
  // Tech
  SOFTWARE, INTELLIGENCE_ARTIFICIELLE, CLOUD_COMPUTING, CYBERSECURITE, FINTECH, GAMING, BIOTECH,
  // Services
  CONSEIL, BANQUE, ASSURANCE, IMMOBILIER, JURIDIQUE, SANTE, TRANSPORT,
  // Commerce
  GRANDE_DISTRIBUTION, ECOMMERCE, LUXE, RESTAURATION, MODE, MEDIAS
];

export const SECTORS_BY_CATEGORY: Record<SectorCategory, SectorMetadata[]> = {
  industrie: [AUTOMOBILE, AERONAUTIQUE, SIDERURGIE, CHIMIE, ENERGIE, CONSTRUCTION],
  tech: [SOFTWARE, INTELLIGENCE_ARTIFICIELLE, CLOUD_COMPUTING, CYBERSECURITE, FINTECH, GAMING, BIOTECH],
  services: [CONSEIL, BANQUE, ASSURANCE, IMMOBILIER, JURIDIQUE, SANTE, TRANSPORT],
  commerce: [GRANDE_DISTRIBUTION, ECOMMERCE, LUXE, RESTAURATION, MODE, MEDIAS]
};

export const CATEGORY_INFO: Record<SectorCategory, { name: string; icon: string; color: string; description: string }> = {
  industrie: {
    name: 'Industrie Lourde',
    icon: '🏭',
    color: '#6B7280',
    description: 'Secteurs à forte intensité capitalistique : automobile, aéronautique, énergie...'
  },
  tech: {
    name: 'Tech & Digital',
    icon: '💻',
    color: '#10B981',
    description: 'Entreprises technologiques : software, IA, fintech, gaming...'
  },
  services: {
    name: 'Services',
    icon: '📊',
    color: '#3B82F6',
    description: 'Services aux entreprises et particuliers : conseil, banque, santé...'
  },
  commerce: {
    name: 'Commerce & Retail',
    icon: '🛍️',
    color: '#F59E0B',
    description: 'Distribution et vente : e-commerce, luxe, restauration...'
  }
};

export const getSectorById = (id: BusinessSector): SectorMetadata | undefined => {
  return ALL_SECTORS.find(s => s.id === id);
};

export const getSectorsByDifficulty = (difficulty: 1 | 2 | 3 | 4 | 5): SectorMetadata[] => {
  return ALL_SECTORS.filter(s => s.difficulty === difficulty);
};
