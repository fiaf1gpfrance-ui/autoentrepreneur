// Types pour le système de production avancé

export interface ProductionLine {
  id: string;
  name: string;
  type: ProductionLineType;
  capacity: number; // Unités par jour
  currentOutput: number;
  efficiency: number; // 0-100%
  quality: number; // 0-100%
  status: ProductionStatus;
  equipment: ProductionEquipment[];
  workers: number;
  maintenanceLevel: number; // 0-100%
  lastMaintenance: number; // Jour du jeu
  operatingCosts: number; // Coût journalier
}

export type ProductionLineType = 
  | 'assembly' // Assemblage
  | 'manufacturing' // Fabrication
  | 'packaging' // Conditionnement
  | 'quality_control' // Contrôle qualité
  | 'r&d_pilot' // Ligne pilote R&D
  | 'automated' // Ligne automatisée
  | 'artisanal'; // Production artisanale

export type ProductionStatus = 
  | 'operational' // En fonctionnement
  | 'maintenance' // En maintenance
  | 'stopped' // Arrêtée
  | 'upgrading'; // En amélioration

export interface ProductionEquipment {
  id: string;
  name: string;
  type: EquipmentType;
  category: EquipmentCategory;
  purchasePrice: number;
  maintenanceCost: number; // Par mois
  condition: number; // 0-100%
  efficiency: number; // Bonus de productivité
  qualityBonus: number; // Bonus qualité
  capacityBonus: number; // Bonus capacité
  purchaseDate: number;
  warrantyMonths: number;
  depreciationYears: number;
}

export type EquipmentCategory = 
  | 'basic' // Équipement basique
  | 'standard' // Équipement standard
  | 'premium' // Équipement premium
  | 'advanced' // Équipement avancé
  | 'cutting_edge'; // Technologie de pointe

export type EquipmentType =
  | 'machine_tool' // Machine-outil
  | 'assembly_robot' // Robot d'assemblage
  | 'conveyor' // Convoyeur
  | 'packaging_machine' // Machine d'emballage
  | 'quality_scanner' // Scanner qualité
  | '3d_printer' // Imprimante 3D
  | 'cnc_machine' // Machine CNC
  | 'injection_molder' // Presse à injection
  | 'laser_cutter' // Découpe laser
  | 'testing_station' // Station de test
  | 'storage_system' // Système de stockage
  | 'forklift' // Chariot élévateur
  | 'agv' // Véhicule à guidage automatique
  | 'erp_module'; // Module ERP production

// Catalogue d'équipements disponibles à l'achat
export interface EquipmentCatalogItem {
  id: string;
  name: string;
  type: EquipmentType;
  category: EquipmentCategory;
  price: number;
  maintenanceCost: number;
  efficiency: number;
  qualityBonus: number;
  capacityBonus: number;
  warrantyMonths: number;
  depreciationYears: number;
  description: string;
  requirements?: EquipmentRequirement[];
}

export interface EquipmentRequirement {
  type: 'min_employees' | 'min_revenue' | 'certification' | 'other_equipment';
  value: number | string;
  description: string;
}

export const EQUIPMENT_CATALOG: EquipmentCatalogItem[] = [
  // Équipements basiques
  {
    id: 'basic_workstation',
    name: 'Poste de travail basique',
    type: 'machine_tool',
    category: 'basic',
    price: 2000,
    maintenanceCost: 50,
    efficiency: 0.05,
    qualityBonus: 0,
    capacityBonus: 10,
    warrantyMonths: 12,
    depreciationYears: 5,
    description: 'Poste de travail manuel simple'
  },
  {
    id: 'manual_conveyor',
    name: 'Convoyeur manuel',
    type: 'conveyor',
    category: 'basic',
    price: 5000,
    maintenanceCost: 100,
    efficiency: 0.08,
    qualityBonus: 0,
    capacityBonus: 20,
    warrantyMonths: 12,
    depreciationYears: 7,
    description: 'Système de convoyage à commande manuelle'
  },
  {
    id: 'basic_packaging',
    name: 'Machine d\'emballage basique',
    type: 'packaging_machine',
    category: 'basic',
    price: 8000,
    maintenanceCost: 150,
    efficiency: 0.10,
    qualityBonus: 0.02,
    capacityBonus: 15,
    warrantyMonths: 12,
    depreciationYears: 5,
    description: 'Emballage semi-automatique'
  },
  
  // Équipements standard
  {
    id: 'cnc_basic',
    name: 'Machine CNC d\'entrée de gamme',
    type: 'cnc_machine',
    category: 'standard',
    price: 25000,
    maintenanceCost: 400,
    efficiency: 0.15,
    qualityBonus: 0.10,
    capacityBonus: 30,
    warrantyMonths: 24,
    depreciationYears: 7,
    description: 'Usinage CNC 3 axes'
  },
  {
    id: 'auto_conveyor',
    name: 'Convoyeur automatisé',
    type: 'conveyor',
    category: 'standard',
    price: 15000,
    maintenanceCost: 200,
    efficiency: 0.12,
    qualityBonus: 0.03,
    capacityBonus: 35,
    warrantyMonths: 24,
    depreciationYears: 8,
    description: 'Convoyeur avec capteurs et automatisation'
  },
  {
    id: 'quality_scanner_basic',
    name: 'Scanner qualité optique',
    type: 'quality_scanner',
    category: 'standard',
    price: 12000,
    maintenanceCost: 180,
    efficiency: 0.05,
    qualityBonus: 0.15,
    capacityBonus: 0,
    warrantyMonths: 24,
    depreciationYears: 5,
    description: 'Contrôle qualité visuel automatisé'
  },
  {
    id: 'forklift_electric',
    name: 'Chariot élévateur électrique',
    type: 'forklift',
    category: 'standard',
    price: 20000,
    maintenanceCost: 250,
    efficiency: 0.10,
    qualityBonus: 0,
    capacityBonus: 25,
    warrantyMonths: 36,
    depreciationYears: 8,
    description: 'Manutention efficace et silencieuse'
  },
  
  // Équipements premium
  {
    id: 'cnc_advanced',
    name: 'Centre d\'usinage CNC 5 axes',
    type: 'cnc_machine',
    category: 'premium',
    price: 80000,
    maintenanceCost: 800,
    efficiency: 0.25,
    qualityBonus: 0.20,
    capacityBonus: 50,
    warrantyMonths: 36,
    depreciationYears: 10,
    description: 'Usinage haute précision multi-axes',
    requirements: [
      { type: 'min_employees', value: 3, description: '3 opérateurs qualifiés minimum' }
    ]
  },
  {
    id: 'assembly_robot_basic',
    name: 'Robot d\'assemblage collaboratif',
    type: 'assembly_robot',
    category: 'premium',
    price: 45000,
    maintenanceCost: 500,
    efficiency: 0.20,
    qualityBonus: 0.15,
    capacityBonus: 40,
    warrantyMonths: 24,
    depreciationYears: 7,
    description: 'Cobot pour assemblage répétitif'
  },
  {
    id: 'injection_molder',
    name: 'Presse à injection plastique',
    type: 'injection_molder',
    category: 'premium',
    price: 60000,
    maintenanceCost: 600,
    efficiency: 0.22,
    qualityBonus: 0.18,
    capacityBonus: 60,
    warrantyMonths: 24,
    depreciationYears: 10,
    description: 'Production pièces plastiques en série'
  },
  {
    id: 'laser_cutter_medium',
    name: 'Découpe laser CO2',
    type: 'laser_cutter',
    category: 'premium',
    price: 35000,
    maintenanceCost: 400,
    efficiency: 0.18,
    qualityBonus: 0.22,
    capacityBonus: 35,
    warrantyMonths: 24,
    depreciationYears: 8,
    description: 'Découpe précise multi-matériaux'
  },
  
  // Équipements avancés
  {
    id: '3d_printer_industrial',
    name: 'Imprimante 3D industrielle',
    type: '3d_printer',
    category: 'advanced',
    price: 120000,
    maintenanceCost: 1000,
    efficiency: 0.15,
    qualityBonus: 0.25,
    capacityBonus: 20,
    warrantyMonths: 36,
    depreciationYears: 5,
    description: 'Fabrication additive métal/polymère',
    requirements: [
      { type: 'min_employees', value: 2, description: 'Techniciens spécialisés' },
      { type: 'certification', value: 'iso_9001', description: 'Certification qualité recommandée' }
    ]
  },
  {
    id: 'agv_fleet',
    name: 'Flotte AGV (3 unités)',
    type: 'agv',
    category: 'advanced',
    price: 90000,
    maintenanceCost: 800,
    efficiency: 0.20,
    qualityBonus: 0.05,
    capacityBonus: 45,
    warrantyMonths: 36,
    depreciationYears: 7,
    description: 'Véhicules autonomes pour logistique interne'
  },
  {
    id: 'testing_station_auto',
    name: 'Station de test automatisée',
    type: 'testing_station',
    category: 'advanced',
    price: 55000,
    maintenanceCost: 450,
    efficiency: 0.08,
    qualityBonus: 0.30,
    capacityBonus: 10,
    warrantyMonths: 24,
    depreciationYears: 6,
    description: 'Tests automatiques avec reporting'
  },
  {
    id: 'erp_production',
    name: 'Module ERP Production',
    type: 'erp_module',
    category: 'advanced',
    price: 25000,
    maintenanceCost: 500,
    efficiency: 0.15,
    qualityBonus: 0.10,
    capacityBonus: 20,
    warrantyMonths: 12,
    depreciationYears: 3,
    description: 'Suivi production temps réel'
  },
  
  // Technologie de pointe
  {
    id: 'robot_cell_full',
    name: 'Cellule robotisée complète',
    type: 'assembly_robot',
    category: 'cutting_edge',
    price: 250000,
    maintenanceCost: 2000,
    efficiency: 0.40,
    qualityBonus: 0.30,
    capacityBonus: 80,
    warrantyMonths: 48,
    depreciationYears: 10,
    description: 'Ligne d\'assemblage 100% robotisée',
    requirements: [
      { type: 'min_employees', value: 5, description: 'Équipe technique dédiée' },
      { type: 'min_revenue', value: 1000000, description: 'CA min 1M€' }
    ]
  },
  {
    id: 'quality_ai',
    name: 'Système qualité IA',
    type: 'quality_scanner',
    category: 'cutting_edge',
    price: 180000,
    maintenanceCost: 1500,
    efficiency: 0.10,
    qualityBonus: 0.50,
    capacityBonus: 15,
    warrantyMonths: 24,
    depreciationYears: 4,
    description: 'Contrôle qualité par intelligence artificielle',
    requirements: [
      { type: 'other_equipment', value: 'erp_production', description: 'Module ERP requis' }
    ]
  },
  {
    id: 'smart_factory_kit',
    name: 'Kit Usine 4.0',
    type: 'erp_module',
    category: 'cutting_edge',
    price: 350000,
    maintenanceCost: 3000,
    efficiency: 0.35,
    qualityBonus: 0.25,
    capacityBonus: 50,
    warrantyMonths: 36,
    depreciationYears: 5,
    description: 'Digitalisation complète de la production',
    requirements: [
      { type: 'min_employees', value: 10, description: '10 employés minimum' },
      { type: 'min_revenue', value: 2000000, description: 'CA min 2M€' }
    ]
  }
];

// Actions de production
export interface ProductionAction {
  type: ProductionActionType;
  cost: number;
  duration: number; // En jours
  effect: ProductionEffect;
}

export type ProductionActionType =
  | 'buy_equipment'
  | 'sell_equipment'
  | 'maintenance'
  | 'upgrade_line'
  | 'create_line'
  | 'close_line'
  | 'hire_operator'
  | 'train_operator'
  | 'optimize_process'
  | 'implement_lean'
  | 'quality_audit';

export interface ProductionEffect {
  efficiency?: number;
  quality?: number;
  capacity?: number;
  costs?: number;
  morale?: number;
}
