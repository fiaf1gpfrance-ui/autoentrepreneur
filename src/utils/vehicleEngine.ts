import {
  VehicleModel,
  CompanyVehicle,
  VehicleFleet,
  VehicleEvent,
  VehicleMaintenanceRecord,
  VehicleAccident,
  FleetStatistics,
  VehicleCategory,
  VehicleStatus,
  FuelType,
  VEHICLE_CATALOG,
  calculateMonthlyVehicleCost,
} from '@/types/vehicles';

// ==================== CRÉATION DE VÉHICULES ====================

export function purchaseVehicle(
  modelId: string,
  acquisitionType: 'achat' | 'leasing' | 'lld',
  color: string,
  currentDay: number
): CompanyVehicle | null {
  const model = VEHICLE_CATALOG.find(v => v.id === modelId);
  if (!model) return null;
  
  const licensePlate = generateLicensePlate();
  
  let acquisitionPrice = 0;
  let monthlyLeasingCost: number | undefined;
  let contractEndDate: number | undefined;
  
  switch (acquisitionType) {
    case 'achat':
      acquisitionPrice = model.purchasePrice;
      break;
    case 'leasing':
      acquisitionPrice = model.purchasePrice * 0.1; // Acompte 10%
      monthlyLeasingCost = model.leasingPrice;
      contractEndDate = currentDay + 365 * 3; // 3 ans
      break;
    case 'lld':
      acquisitionPrice = 0;
      monthlyLeasingCost = model.lldPrice;
      contractEndDate = currentDay + 365 * 4; // 4 ans
      break;
  }
  
  return {
    id: `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    modelId,
    model,
    acquisitionType,
    acquisitionDate: currentDay,
    acquisitionPrice,
    currentValue: model.purchasePrice,
    mileage: 0,
    status: 'available',
    licensePlate,
    color,
    lastMaintenanceDate: currentDay,
    nextMaintenanceDate: currentDay + 365, // 1 an ou 20000km
    maintenanceHistory: [],
    accidentHistory: [],
    fuelExpenses: [],
    monthlyLeasingCost,
    contractEndDate,
  };
}

function generateLicensePlate(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const randomLetters = () => letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
  const randomNumbers = () => Math.floor(100 + Math.random() * 900).toString();
  
  return `${randomLetters()}-${randomNumbers()}-${randomLetters()}`;
}

// ==================== ASSIGNATION ====================

export function assignVehicleToEmployee(
  vehicle: CompanyVehicle,
  employeeId: string,
  currentDay: number
): CompanyVehicle {
  return {
    ...vehicle,
    status: 'assigned',
    assignedTo: employeeId,
    assignedDate: currentDay,
  };
}

export function unassignVehicle(vehicle: CompanyVehicle): CompanyVehicle {
  return {
    ...vehicle,
    status: 'available',
    assignedTo: undefined,
    assignedDate: undefined,
  };
}

// ==================== MAINTENANCE ====================

export function scheduleMaintenance(
  vehicle: CompanyVehicle,
  type: VehicleMaintenanceRecord['type'],
  cost: number,
  garage: string,
  currentDay: number
): { vehicle: CompanyVehicle; record: VehicleMaintenanceRecord } {
  const record: VehicleMaintenanceRecord = {
    id: `maint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    vehicleId: vehicle.id,
    date: currentDay,
    type,
    description: getMaintenanceDescription(type),
    cost,
    mileageAtService: vehicle.mileage,
    garage,
    nextServiceMileage: vehicle.mileage + 20000,
  };
  
  return {
    vehicle: {
      ...vehicle,
      status: 'maintenance',
      lastMaintenanceDate: currentDay,
      nextMaintenanceDate: currentDay + 365,
      maintenanceHistory: [...vehicle.maintenanceHistory, record],
    },
    record,
  };
}

function getMaintenanceDescription(type: VehicleMaintenanceRecord['type']): string {
  const descriptions: Record<VehicleMaintenanceRecord['type'], string> = {
    revision: 'Révision complète du véhicule',
    repair: 'Réparation mécanique',
    tires: 'Changement de pneumatiques',
    brake: 'Remplacement des freins',
    engine: 'Réparation moteur',
    bodywork: 'Réparation carrosserie',
    inspection: 'Contrôle technique',
  };
  return descriptions[type];
}

export function completeMaintenance(vehicle: CompanyVehicle): CompanyVehicle {
  return {
    ...vehicle,
    status: vehicle.assignedTo ? 'assigned' : 'available',
  };
}

// ==================== ACCIDENTS ====================

export function reportAccident(
  vehicle: CompanyVehicle,
  description: string,
  severity: VehicleAccident['severity'],
  driverEmployeeId: string | undefined,
  atFault: boolean,
  currentDay: number
): { vehicle: CompanyVehicle; accident: VehicleAccident; reputationImpact: number } {
  const repairCost = calculateRepairCost(vehicle.model, severity);
  const insuranceCovered = atFault ? repairCost * 0.7 : repairCost * 0.95;
  const daysOutOfService = getDaysOutOfService(severity);
  const reputationImpact = getReputationImpact(severity, atFault);
  
  const accident: VehicleAccident = {
    id: `accident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    vehicleId: vehicle.id,
    date: currentDay,
    description,
    severity,
    driverEmployeeId,
    atFault,
    repairCost,
    insuranceCovered,
    daysOutOfService,
    resolved: false,
    reputationImpact,
  };
  
  return {
    vehicle: {
      ...vehicle,
      status: severity === 'total_loss' ? 'sold' : 'accident',
      accidentHistory: [...vehicle.accidentHistory, accident],
    },
    accident,
    reputationImpact,
  };
}

function calculateRepairCost(model: VehicleModel, severity: VehicleAccident['severity']): number {
  const multipliers: Record<VehicleAccident['severity'], number> = {
    minor: 0.02,
    moderate: 0.08,
    major: 0.25,
    total_loss: 1,
  };
  return Math.round(model.purchasePrice * multipliers[severity]);
}

function getDaysOutOfService(severity: VehicleAccident['severity']): number {
  const days: Record<VehicleAccident['severity'], number> = {
    minor: 1,
    moderate: 5,
    major: 21,
    total_loss: 999,
  };
  return days[severity];
}

function getReputationImpact(severity: VehicleAccident['severity'], atFault: boolean): number {
  const baseImpact: Record<VehicleAccident['severity'], number> = {
    minor: -1,
    moderate: -3,
    major: -7,
    total_loss: -15,
  };
  return atFault ? baseImpact[severity] * 1.5 : baseImpact[severity];
}

// ==================== DÉPRÉCIATION ====================

export function updateVehicleValue(vehicle: CompanyVehicle, currentDay: number): CompanyVehicle {
  if (vehicle.acquisitionType !== 'achat') return vehicle;
  
  const ageInYears = (currentDay - vehicle.acquisitionDate) / 365;
  const depreciationRate = 0.15; // 15% par an
  const currentValue = vehicle.model.purchasePrice * Math.pow(1 - depreciationRate, ageInYears);
  
  // Dépréciation supplémentaire pour kilométrage élevé
  const mileageDepreciation = Math.max(0, (vehicle.mileage - 100000) / 100000) * 0.1;
  
  return {
    ...vehicle,
    currentValue: Math.max(vehicle.model.purchasePrice * 0.1, currentValue * (1 - mileageDepreciation)),
  };
}

// ==================== ÉVÉNEMENTS ALÉATOIRES ====================

export function generateVehicleEvent(
  vehicles: CompanyVehicle[],
  currentDay: number
): VehicleEvent | null {
  if (vehicles.length === 0) return null;
  
  const eventChance = 0.02; // 2% par jour
  if (Math.random() > eventChance) return null;
  
  const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  const eventTypes: VehicleEvent['type'][] = ['breakdown', 'accident', 'theft', 'recall', 'fine', 'inspection_due'];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  return createVehicleEvent(vehicle, eventType, currentDay);
}

function createVehicleEvent(
  vehicle: CompanyVehicle,
  type: VehicleEvent['type'],
  currentDay: number
): VehicleEvent {
  const events: Record<VehicleEvent['type'], { title: string; description: string; impact: VehicleEvent['impact'] }> = {
    breakdown: {
      title: 'Panne véhicule',
      description: `${vehicle.model.brand} ${vehicle.model.model} (${vehicle.licensePlate}) en panne sur la route`,
      impact: { cost: 500 + Math.random() * 1500, productivity: -5, downtime: 1 + Math.floor(Math.random() * 3) },
    },
    accident: {
      title: 'Accident signalé',
      description: `Accident impliquant ${vehicle.model.brand} ${vehicle.model.model}`,
      impact: { cost: 1000 + Math.random() * 5000, reputation: -3, downtime: 3 + Math.floor(Math.random() * 7) },
    },
    theft: {
      title: 'Vol de véhicule',
      description: `${vehicle.model.brand} ${vehicle.model.model} volé(e)`,
      impact: { cost: vehicle.currentValue * 0.1, reputation: -5 },
    },
    recall: {
      title: 'Rappel constructeur',
      description: `Rappel de sécurité pour ${vehicle.model.brand} ${vehicle.model.model}`,
      impact: { downtime: 1 },
    },
    fine: {
      title: 'Amende reçue',
      description: `Infraction au code de la route avec ${vehicle.licensePlate}`,
      impact: { cost: 90 + Math.random() * 400, reputation: -1 },
    },
    inspection_due: {
      title: 'Contrôle technique à passer',
      description: `${vehicle.model.brand} ${vehicle.model.model} doit passer le contrôle technique`,
      impact: { cost: 80, downtime: 1 },
    },
    lease_end: {
      title: 'Fin de contrat leasing',
      description: `Contrat de leasing ${vehicle.model.brand} ${vehicle.model.model} arrive à échéance`,
      impact: { cost: 0 },
    },
  };
  
  const eventData = events[type];
  
  return {
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    vehicleId: vehicle.id,
    title: eventData.title,
    description: eventData.description,
    date: currentDay,
    impact: eventData.impact,
    resolved: false,
  };
}

// ==================== STATISTIQUES DE FLOTTE ====================

export function calculateFleetStatistics(fleet: VehicleFleet): FleetStatistics {
  const vehicles = fleet.vehicles;
  
  const vehiclesByCategory: Record<VehicleCategory, number> = {
    berline: 0,
    suv: 0,
    utilitaire: 0,
    luxe: 0,
    sport: 0,
  };
  
  const vehiclesByStatus: Record<VehicleStatus, number> = {
    available: 0,
    assigned: 0,
    maintenance: 0,
    accident: 0,
    sold: 0,
  };
  
  const vehiclesByFuelType: Record<FuelType, number> = {
    essence: 0,
    diesel: 0,
    hybride: 0,
    electrique: 0,
  };
  
  let totalAge = 0;
  let totalMileage = 0;
  let totalMonthlyCost = 0;
  let totalCO2 = 0;
  let totalReputation = 0;
  let totalProductivity = 0;
  
  vehicles.forEach(v => {
    vehiclesByCategory[v.model.category]++;
    vehiclesByStatus[v.status]++;
    vehiclesByFuelType[v.model.fuelType]++;
    totalMileage += v.mileage;
    totalMonthlyCost += calculateMonthlyVehicleCost(v);
    totalCO2 += v.model.co2Emissions;
    totalReputation += v.model.reputationBonus;
    totalProductivity += v.model.productivityBonus;
  });
  
  return {
    totalVehicles: vehicles.length,
    vehiclesByCategory,
    vehiclesByStatus,
    vehiclesByFuelType,
    averageAge: vehicles.length > 0 ? totalAge / vehicles.length : 0,
    averageMileage: vehicles.length > 0 ? totalMileage / vehicles.length : 0,
    totalMonthlyCost,
    totalAnnualCost: totalMonthlyCost * 12,
    co2Emissions: vehicles.length > 0 ? totalCO2 / vehicles.length : 0,
    reputationContribution: totalReputation,
    productivityContribution: totalProductivity,
  };
}

// ==================== CALCULS DE FLOTTE ====================

export function calculateFleetTotals(vehicles: CompanyVehicle[]): VehicleFleet {
  let totalValue = 0;
  let monthlyOperatingCost = 0;
  let totalMileage = 0;
  let totalReputationBonus = 0;
  let totalProductivityBonus = 0;
  
  vehicles.forEach(v => {
    totalValue += v.currentValue;
    monthlyOperatingCost += calculateMonthlyVehicleCost(v);
    totalMileage += v.mileage;
    totalReputationBonus += v.model.reputationBonus;
    totalProductivityBonus += v.model.productivityBonus;
  });
  
  return {
    vehicles,
    totalValue,
    monthlyOperatingCost,
    averageMileage: vehicles.length > 0 ? totalMileage / vehicles.length : 0,
    totalReputationBonus,
    totalProductivityBonus,
    maintenanceBudget: monthlyOperatingCost * 0.2,
    fuelBudget: monthlyOperatingCost * 0.3,
  };
}

// ==================== SIMULATION KILOMÉTRAGE ====================

export function simulateDailyMileage(vehicle: CompanyVehicle): number {
  if (vehicle.status !== 'assigned') return 0;
  
  // Entre 30 et 80 km par jour ouvré
  const baseMileage = 30 + Math.random() * 50;
  
  // Les véhicules de luxe/sport sont moins utilisés
  const categoryMultiplier = {
    berline: 1.0,
    suv: 1.1,
    utilitaire: 1.5,
    luxe: 0.5,
    sport: 0.3,
  }[vehicle.model.category];
  
  return Math.round(baseMileage * categoryMultiplier);
}

export function updateVehicleMileage(vehicle: CompanyVehicle): CompanyVehicle {
  const dailyMileage = simulateDailyMileage(vehicle);
  return {
    ...vehicle,
    mileage: vehicle.mileage + dailyMileage,
  };
}

// ==================== VENTE DE VÉHICULE ====================

export function sellVehicle(vehicle: CompanyVehicle): { salePrice: number; profit: number } {
  const salePrice = vehicle.currentValue * (0.9 + Math.random() * 0.15); // 90-105% de la valeur
  const profit = salePrice - vehicle.acquisitionPrice;
  
  return {
    salePrice: Math.round(salePrice),
    profit: Math.round(profit),
  };
}
