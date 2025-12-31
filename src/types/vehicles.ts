// ==================== COMPANY VEHICLE SYSTEM TYPES ====================

export type VehicleCategory = 'berline' | 'suv' | 'utilitaire' | 'luxe' | 'sport';
export type VehicleStatus = 'available' | 'assigned' | 'maintenance' | 'accident' | 'sold';
export type FuelType = 'essence' | 'diesel' | 'hybride' | 'electrique';
export type AcquisitionType = 'achat' | 'leasing' | 'lld'; // Location Longue Durée

// Modèle de véhicule disponible à l'achat
export interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  category: VehicleCategory;
  year: number;
  fuelType: FuelType;
  power: number; // CV
  co2Emissions: number; // g/km
  fuelConsumption: number; // L/100km
  trunk: number; // Litres
  seats: number;
  purchasePrice: number;
  leasingPrice: number; // /mois
  lldPrice: number; // /mois
  insuranceCost: number; // /mois
  maintenanceCost: number; // /an
  reputationBonus: number; // Impact sur crédibilité
  productivityBonus: number; // % boost productivité employé
  prestigeLevel: number; // 1-10
  image?: string;
}

// Véhicule possédé par l'entreprise
export interface CompanyVehicle {
  id: string;
  modelId: string;
  model: VehicleModel;
  acquisitionType: AcquisitionType;
  acquisitionDate: number;
  acquisitionPrice: number;
  currentValue: number; // Valeur après dépréciation
  mileage: number;
  status: VehicleStatus;
  assignedTo?: string; // Employee ID
  assignedDate?: number;
  licensePlate: string;
  color: string;
  lastMaintenanceDate: number;
  nextMaintenanceDate: number;
  maintenanceHistory: VehicleMaintenanceRecord[];
  accidentHistory: VehicleAccident[];
  fuelExpenses: FuelExpense[];
  monthlyLeasingCost?: number;
  contractEndDate?: number; // Pour leasing/LLD
}

// Historique de maintenance
export interface VehicleMaintenanceRecord {
  id: string;
  vehicleId: string;
  date: number;
  type: 'revision' | 'repair' | 'tires' | 'brake' | 'engine' | 'bodywork' | 'inspection';
  description: string;
  cost: number;
  mileageAtService: number;
  garage: string;
  nextServiceMileage?: number;
}

// Accident de véhicule
export interface VehicleAccident {
  id: string;
  vehicleId: string;
  date: number;
  description: string;
  severity: 'minor' | 'moderate' | 'major' | 'total_loss';
  driverEmployeeId?: string;
  atFault: boolean;
  repairCost: number;
  insuranceCovered: number;
  daysOutOfService: number;
  resolved: boolean;
  reputationImpact: number;
}

// Dépenses de carburant
export interface FuelExpense {
  id: string;
  vehicleId: string;
  date: number;
  liters: number;
  cost: number;
  mileage: number;
  station: string;
}

// Flotte de véhicules
export interface VehicleFleet {
  vehicles: CompanyVehicle[];
  totalValue: number;
  monthlyOperatingCost: number;
  averageMileage: number;
  totalReputationBonus: number;
  totalProductivityBonus: number;
  maintenanceBudget: number;
  fuelBudget: number;
}

// Événement de véhicule
export interface VehicleEvent {
  id: string;
  type: 'breakdown' | 'accident' | 'theft' | 'recall' | 'fine' | 'inspection_due' | 'lease_end';
  vehicleId: string;
  title: string;
  description: string;
  date: number;
  impact: {
    cost?: number;
    reputation?: number;
    productivity?: number;
    downtime?: number; // jours
  };
  resolved: boolean;
  resolution?: string;
}

// Contrat de leasing/LLD
export interface VehicleContract {
  id: string;
  vehicleId: string;
  type: 'leasing' | 'lld';
  provider: string;
  monthlyPayment: number;
  startDate: number;
  endDate: number;
  mileageLimit: number;
  excessMileageCost: number; // €/km au-delà
  deposit: number;
  buyoutOption?: number; // Prix rachat fin de contrat
  servicesIncluded: string[];
}

// Statistiques de flotte
export interface FleetStatistics {
  totalVehicles: number;
  vehiclesByCategory: Record<VehicleCategory, number>;
  vehiclesByStatus: Record<VehicleStatus, number>;
  vehiclesByFuelType: Record<FuelType, number>;
  averageAge: number;
  averageMileage: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  co2Emissions: number;
  reputationContribution: number;
  productivityContribution: number;
}

// Note: Le catalogue étendu est dans src/data/vehicleCatalog.ts
// Pour éviter les dépendances circulaires, on garde un catalogue minimal ici
// Utilisez EXTENDED_VEHICLE_CATALOG depuis '@/data/vehicleCatalog' pour le catalogue complet

// Catalogue de véhicules de base (pour compatibilité)
export const VEHICLE_CATALOG: VehicleModel[] = [
  // BERLINES PREMIUM
  {
    id: 'bmw_320d',
    brand: 'BMW',
    model: 'Série 3 320d',
    category: 'berline',
    year: 2024,
    fuelType: 'diesel',
    power: 190,
    co2Emissions: 125,
    fuelConsumption: 4.8,
    trunk: 480,
    seats: 5,
    purchasePrice: 52000,
    leasingPrice: 650,
    lldPrice: 750,
    insuranceCost: 180,
    maintenanceCost: 1200,
    reputationBonus: 3,
    productivityBonus: 5,
    prestigeLevel: 6,
  },
  {
    id: 'mercedes_c220d',
    brand: 'Mercedes',
    model: 'Classe C 220d',
    category: 'berline',
    year: 2024,
    fuelType: 'diesel',
    power: 200,
    co2Emissions: 128,
    fuelConsumption: 5.0,
    trunk: 455,
    seats: 5,
    purchasePrice: 55000,
    leasingPrice: 680,
    lldPrice: 780,
    insuranceCost: 190,
    maintenanceCost: 1300,
    reputationBonus: 4,
    productivityBonus: 5,
    prestigeLevel: 7,
  },
  {
    id: 'audi_a4',
    brand: 'Audi',
    model: 'A4 40 TDI',
    category: 'berline',
    year: 2024,
    fuelType: 'diesel',
    power: 204,
    co2Emissions: 130,
    fuelConsumption: 5.1,
    trunk: 460,
    seats: 5,
    purchasePrice: 53000,
    leasingPrice: 660,
    lldPrice: 760,
    insuranceCost: 185,
    maintenanceCost: 1250,
    reputationBonus: 3,
    productivityBonus: 5,
    prestigeLevel: 6,
  },
  {
    id: 'tesla_model3',
    brand: 'Tesla',
    model: 'Model 3',
    category: 'berline',
    year: 2024,
    fuelType: 'electrique',
    power: 283,
    co2Emissions: 0,
    fuelConsumption: 14.3, // kWh/100km
    trunk: 561,
    seats: 5,
    purchasePrice: 42990,
    leasingPrice: 550,
    lldPrice: 650,
    insuranceCost: 170,
    maintenanceCost: 600,
    reputationBonus: 5,
    productivityBonus: 6,
    prestigeLevel: 7,
  },
  // SUV & 4x4
  {
    id: 'bmw_x3',
    brand: 'BMW',
    model: 'X3 xDrive30d',
    category: 'suv',
    year: 2024,
    fuelType: 'diesel',
    power: 286,
    co2Emissions: 155,
    fuelConsumption: 6.0,
    trunk: 550,
    seats: 5,
    purchasePrice: 68000,
    leasingPrice: 850,
    lldPrice: 950,
    insuranceCost: 220,
    maintenanceCost: 1500,
    reputationBonus: 5,
    productivityBonus: 4,
    prestigeLevel: 7,
  },
  {
    id: 'range_rover_sport',
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    category: 'suv',
    year: 2024,
    fuelType: 'hybride',
    power: 400,
    co2Emissions: 68,
    fuelConsumption: 3.0,
    trunk: 780,
    seats: 5,
    purchasePrice: 95000,
    leasingPrice: 1200,
    lldPrice: 1400,
    insuranceCost: 350,
    maintenanceCost: 2000,
    reputationBonus: 8,
    productivityBonus: 5,
    prestigeLevel: 9,
  },
  {
    id: 'porsche_cayenne',
    brand: 'Porsche',
    model: 'Cayenne E-Hybrid',
    category: 'suv',
    year: 2024,
    fuelType: 'hybride',
    power: 470,
    co2Emissions: 71,
    fuelConsumption: 3.1,
    trunk: 772,
    seats: 5,
    purchasePrice: 110000,
    leasingPrice: 1400,
    lldPrice: 1600,
    insuranceCost: 400,
    maintenanceCost: 2200,
    reputationBonus: 9,
    productivityBonus: 6,
    prestigeLevel: 9,
  },
  {
    id: 'audi_q5',
    brand: 'Audi',
    model: 'Q5 45 TFSI',
    category: 'suv',
    year: 2024,
    fuelType: 'essence',
    power: 265,
    co2Emissions: 175,
    fuelConsumption: 7.8,
    trunk: 520,
    seats: 5,
    purchasePrice: 62000,
    leasingPrice: 780,
    lldPrice: 880,
    insuranceCost: 200,
    maintenanceCost: 1400,
    reputationBonus: 5,
    productivityBonus: 4,
    prestigeLevel: 7,
  },
  // UTILITAIRES
  {
    id: 'renault_kangoo',
    brand: 'Renault',
    model: 'Kangoo Van',
    category: 'utilitaire',
    year: 2024,
    fuelType: 'diesel',
    power: 115,
    co2Emissions: 145,
    fuelConsumption: 5.5,
    trunk: 3300,
    seats: 2,
    purchasePrice: 25000,
    leasingPrice: 320,
    lldPrice: 380,
    insuranceCost: 100,
    maintenanceCost: 800,
    reputationBonus: 0,
    productivityBonus: 8,
    prestigeLevel: 2,
  },
  {
    id: 'mercedes_sprinter',
    brand: 'Mercedes',
    model: 'Sprinter 314 CDI',
    category: 'utilitaire',
    year: 2024,
    fuelType: 'diesel',
    power: 143,
    co2Emissions: 198,
    fuelConsumption: 7.5,
    trunk: 10500,
    seats: 3,
    purchasePrice: 45000,
    leasingPrice: 550,
    lldPrice: 650,
    insuranceCost: 150,
    maintenanceCost: 1100,
    reputationBonus: 1,
    productivityBonus: 12,
    prestigeLevel: 4,
  },
  {
    id: 'citroen_berlingo',
    brand: 'Citroën',
    model: 'ë-Berlingo Van',
    category: 'utilitaire',
    year: 2024,
    fuelType: 'electrique',
    power: 136,
    co2Emissions: 0,
    fuelConsumption: 20.1,
    trunk: 3300,
    seats: 2,
    purchasePrice: 38000,
    leasingPrice: 450,
    lldPrice: 520,
    insuranceCost: 110,
    maintenanceCost: 500,
    reputationBonus: 2,
    productivityBonus: 8,
    prestigeLevel: 3,
  },
  {
    id: 'iveco_daily',
    brand: 'Iveco',
    model: 'Daily 35C18',
    category: 'utilitaire',
    year: 2024,
    fuelType: 'diesel',
    power: 180,
    co2Emissions: 220,
    fuelConsumption: 8.5,
    trunk: 15600,
    seats: 3,
    purchasePrice: 55000,
    leasingPrice: 680,
    lldPrice: 780,
    insuranceCost: 180,
    maintenanceCost: 1400,
    reputationBonus: 1,
    productivityBonus: 15,
    prestigeLevel: 3,
  },
  // LUXE & SPORT
  {
    id: 'porsche_911',
    brand: 'Porsche',
    model: '911 Carrera S',
    category: 'sport',
    year: 2024,
    fuelType: 'essence',
    power: 450,
    co2Emissions: 230,
    fuelConsumption: 10.1,
    trunk: 132,
    seats: 4,
    purchasePrice: 145000,
    leasingPrice: 1800,
    lldPrice: 2100,
    insuranceCost: 600,
    maintenanceCost: 3000,
    reputationBonus: 12,
    productivityBonus: 3,
    prestigeLevel: 10,
  },
  {
    id: 'ferrari_roma',
    brand: 'Ferrari',
    model: 'Roma',
    category: 'sport',
    year: 2024,
    fuelType: 'essence',
    power: 620,
    co2Emissions: 255,
    fuelConsumption: 11.3,
    trunk: 272,
    seats: 4,
    purchasePrice: 245000,
    leasingPrice: 3000,
    lldPrice: 3500,
    insuranceCost: 1200,
    maintenanceCost: 5000,
    reputationBonus: 15,
    productivityBonus: 2,
    prestigeLevel: 10,
  },
  {
    id: 'bentley_continental',
    brand: 'Bentley',
    model: 'Continental GT',
    category: 'luxe',
    year: 2024,
    fuelType: 'essence',
    power: 550,
    co2Emissions: 280,
    fuelConsumption: 12.4,
    trunk: 358,
    seats: 4,
    purchasePrice: 220000,
    leasingPrice: 2800,
    lldPrice: 3200,
    insuranceCost: 1000,
    maintenanceCost: 4500,
    reputationBonus: 14,
    productivityBonus: 4,
    prestigeLevel: 10,
  },
  {
    id: 'rolls_ghost',
    brand: 'Rolls-Royce',
    model: 'Ghost',
    category: 'luxe',
    year: 2024,
    fuelType: 'essence',
    power: 571,
    co2Emissions: 295,
    fuelConsumption: 13.0,
    trunk: 500,
    seats: 5,
    purchasePrice: 350000,
    leasingPrice: 4500,
    lldPrice: 5200,
    insuranceCost: 1500,
    maintenanceCost: 6000,
    reputationBonus: 20,
    productivityBonus: 5,
    prestigeLevel: 10,
  },
  {
    id: 'mercedes_s500',
    brand: 'Mercedes',
    model: 'Classe S 500',
    category: 'luxe',
    year: 2024,
    fuelType: 'hybride',
    power: 449,
    co2Emissions: 55,
    fuelConsumption: 2.4,
    trunk: 540,
    seats: 5,
    purchasePrice: 135000,
    leasingPrice: 1700,
    lldPrice: 1950,
    insuranceCost: 500,
    maintenanceCost: 2500,
    reputationBonus: 10,
    productivityBonus: 6,
    prestigeLevel: 9,
  },
  {
    id: 'bmw_m5',
    brand: 'BMW',
    model: 'M5 Competition',
    category: 'sport',
    year: 2024,
    fuelType: 'essence',
    power: 625,
    co2Emissions: 254,
    fuelConsumption: 11.2,
    trunk: 530,
    seats: 5,
    purchasePrice: 145000,
    leasingPrice: 1850,
    lldPrice: 2100,
    insuranceCost: 550,
    maintenanceCost: 2800,
    reputationBonus: 10,
    productivityBonus: 5,
    prestigeLevel: 9,
  },
];

// Fonction utilitaire pour obtenir un modèle par ID
export function getVehicleModel(modelId: string): VehicleModel | undefined {
  return VEHICLE_CATALOG.find(v => v.id === modelId);
}

// Calculer le coût mensuel total d'un véhicule
export function calculateMonthlyVehicleCost(vehicle: CompanyVehicle): number {
  const model = vehicle.model;
  let monthlyCost = model.insuranceCost + (model.maintenanceCost / 12);
  
  if (vehicle.acquisitionType === 'leasing' && vehicle.monthlyLeasingCost) {
    monthlyCost += vehicle.monthlyLeasingCost;
  } else if (vehicle.acquisitionType === 'lld' && vehicle.monthlyLeasingCost) {
    monthlyCost += vehicle.monthlyLeasingCost;
  }
  
  // Estimation carburant (500km/mois moyenne)
  const fuelCostPerMonth = (500 / 100) * model.fuelConsumption * 1.8; // 1.8€/L
  monthlyCost += fuelCostPerMonth;
  
  return Math.round(monthlyCost);
}
