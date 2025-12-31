import {
  ProductionLine,
  Machine,
  ProductionShift,
  ProductionBatch,
  QualityControl,
  QualityGrade,
  AutomationSystem,
  MaintenanceSchedule,
} from '@/types/advancedSystems';

// Machine types with configurations
export const MACHINE_TYPES: Record<string, {
  baseCost: number;
  efficiency: number;
  maintenance: number;
  lifespan: number;
  operatingCost: number;
}> = {
  basic_assembly: { baseCost: 50000, efficiency: 70, maintenance: 500, lifespan: 3650, operatingCost: 50 },
  cnc_machine: { baseCost: 150000, efficiency: 85, maintenance: 1000, lifespan: 5475, operatingCost: 100 },
  robotic_arm: { baseCost: 300000, efficiency: 95, maintenance: 2000, lifespan: 7300, operatingCost: 150 },
  packaging_line: { baseCost: 80000, efficiency: 90, maintenance: 400, lifespan: 3650, operatingCost: 40 },
  quality_scanner: { baseCost: 100000, efficiency: 99, maintenance: 800, lifespan: 5475, operatingCost: 60 },
  laser_cutter: { baseCost: 200000, efficiency: 92, maintenance: 1500, lifespan: 4380, operatingCost: 120 },
  printing_press: { baseCost: 250000, efficiency: 88, maintenance: 1200, lifespan: 5475, operatingCost: 80 },
  injection_molder: { baseCost: 180000, efficiency: 90, maintenance: 900, lifespan: 5475, operatingCost: 90 },
};

export const AUTOMATION_SYSTEMS: Record<string, {
  cost: number;
  installCost: number;
  maintenanceCost: number;
  efficiencyBoost: number;
  laborReduction: number;
}> = {
  robot: { cost: 500000, installCost: 50000, maintenanceCost: 2000, efficiencyBoost: 20, laborReduction: 30 },
  plc: { cost: 100000, installCost: 20000, maintenanceCost: 500, efficiencyBoost: 10, laborReduction: 10 },
  scada: { cost: 200000, installCost: 30000, maintenanceCost: 1000, efficiencyBoost: 15, laborReduction: 15 },
  erp_integration: { cost: 150000, installCost: 40000, maintenanceCost: 800, efficiencyBoost: 25, laborReduction: 20 },
  ai_optimization: { cost: 300000, installCost: 60000, maintenanceCost: 1500, efficiencyBoost: 35, laborReduction: 25 },
};

export function createMachine(type: string, currentDay: number): Machine {
  const config = MACHINE_TYPES[type] || MACHINE_TYPES.basic_assembly;
  
  return {
    id: `machine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type,
    status: 'idle',
    efficiency: config.efficiency,
    age: 0,
    maintenanceLevel: 100,
    nextMaintenance: currentDay + 30,
    operatingCost: config.operatingCost,
    purchasePrice: config.baseCost,
    depreciationRate: config.baseCost / config.lifespan,
    currentValue: config.baseCost,
  };
}

export function createProductionLine(
  name: string,
  productId: string,
  capacity: number,
  currentDay: number
): ProductionLine {
  return {
    id: `line_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    productId,
    capacity,
    currentOutput: 0,
    efficiency: 70,
    machines: [],
    workers: [],
    shifts: [
      {
        id: 'shift_morning',
        name: 'Matin (6h-14h)',
        startHour: 6,
        endHour: 14,
        workers: [],
        productivity: 100,
        active: true,
      },
      {
        id: 'shift_afternoon',
        name: 'Après-midi (14h-22h)',
        startHour: 14,
        endHour: 22,
        workers: [],
        productivity: 95,
        active: false,
      },
      {
        id: 'shift_night',
        name: 'Nuit (22h-6h)',
        startHour: 22,
        endHour: 6,
        workers: [],
        productivity: 85,
        active: false,
      },
    ],
    maintenanceSchedule: {
      lastMaintenance: currentDay,
      nextMaintenance: currentDay + 30,
      maintenanceType: 'preventive',
      estimatedCost: 2000,
      estimatedDowntime: 8,
    },
  };
}

export function calculateLineEfficiency(line: ProductionLine): number {
  if (line.machines.length === 0) return 50;
  
  const machineEfficiency = line.machines.reduce((sum, m) => sum + m.efficiency * (m.maintenanceLevel / 100), 0) / line.machines.length;
  const workerBonus = Math.min(20, line.workers.length * 2);
  const shiftBonus = line.shifts.filter(s => s.active).length * 5;
  
  return Math.min(100, machineEfficiency + workerBonus + shiftBonus);
}

export function calculateDailyOutput(line: ProductionLine): number {
  const efficiency = calculateLineEfficiency(line);
  const activeShifts = line.shifts.filter(s => s.active);
  const shiftMultiplier = activeShifts.reduce((sum, s) => sum + s.productivity / 100, 0) / 3;
  
  return Math.floor(line.capacity * (efficiency / 100) * shiftMultiplier);
}

export function performMaintenance(machine: Machine, type: 'preventive' | 'corrective', currentDay: number): Machine {
  const maintenanceBoost = type === 'preventive' ? 30 : 50;
  const newMaintenanceLevel = Math.min(100, machine.maintenanceLevel + maintenanceBoost);
  
  return {
    ...machine,
    maintenanceLevel: newMaintenanceLevel,
    status: 'idle',
    nextMaintenance: currentDay + (type === 'preventive' ? 30 : 14),
  };
}

export function degradeMachine(machine: Machine): Machine {
  const degradation = Math.random() * 0.5 + 0.1;
  const newMaintenanceLevel = Math.max(0, machine.maintenanceLevel - degradation);
  
  let status = machine.status;
  if (newMaintenanceLevel < 20) {
    status = Math.random() < 0.1 ? 'broken' : machine.status;
  }
  if (newMaintenanceLevel < 10) {
    status = 'broken';
  }
  
  return {
    ...machine,
    maintenanceLevel: newMaintenanceLevel,
    status,
    age: machine.age + 1,
    currentValue: Math.max(0, machine.currentValue - machine.depreciationRate),
  };
}

export function startProductionBatch(
  productId: string,
  lineId: string,
  quantity: number,
  materialCost: number,
  laborCost: number,
  currentDay: number
): ProductionBatch {
  const overheadCost = laborCost * 0.15;
  const totalCost = materialCost + laborCost + overheadCost;
  
  return {
    id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    productId,
    lineId,
    quantity,
    startDate: currentDay,
    status: 'in_progress',
    rawMaterialsUsed: [],
    laborCost,
    materialCost,
    overheadCost,
    unitCost: totalCost / quantity,
  };
}

export function completeBatch(batch: ProductionBatch, currentDay: number): ProductionBatch {
  return {
    ...batch,
    status: 'completed',
    endDate: currentDay,
  };
}

export function performQualityControl(
  productId: string,
  batchId: string,
  sampleSize: number,
  currentDay: number,
  inspector: string
): QualityControl {
  const defectRate = Math.random() * 10;
  const grades: Record<QualityGrade, number> = {
    A: Math.floor(sampleSize * (0.4 + Math.random() * 0.3)),
    B: Math.floor(sampleSize * (0.2 + Math.random() * 0.15)),
    C: Math.floor(sampleSize * (0.1 + Math.random() * 0.1)),
    D: Math.floor(sampleSize * (0.02 + Math.random() * 0.05)),
    rejected: Math.floor(sampleSize * defectRate / 100),
  };
  
  // Adjust to match sample size
  const total = Object.values(grades).reduce((sum, v) => sum + v, 0);
  const diff = sampleSize - total;
  grades.A = Math.max(0, grades.A + diff);
  
  const passed = defectRate < 5;
  
  return {
    id: `qc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    productId,
    batchId,
    inspectionDate: currentDay,
    sampleSize,
    defectRate,
    grades,
    passed,
    inspector,
    notes: passed ? 'Contrôle qualité passé' : 'Taux de défauts trop élevé',
  };
}

export function installAutomation(
  type: AutomationSystem['type'],
  lineId: string,
  currentDay: number
): AutomationSystem {
  const config = AUTOMATION_SYSTEMS[type] || AUTOMATION_SYSTEMS.robot;
  
  return {
    id: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    type,
    lineId,
    purchasePrice: config.cost,
    installationCost: config.installCost,
    maintenanceCost: config.maintenanceCost,
    efficiencyBoost: config.efficiencyBoost,
    laborReduction: config.laborReduction,
    active: true,
    installedAt: currentDay,
  };
}

export function calculateProductionCosts(line: ProductionLine, automations: AutomationSystem[]): {
  laborCost: number;
  machineCost: number;
  maintenanceCost: number;
  automationCost: number;
  total: number;
} {
  const laborReduction = automations
    .filter(a => a.lineId === line.id && a.active)
    .reduce((sum, a) => sum + a.laborReduction, 0);
  
  const baseLaborCost = line.workers.length * 150; // 150€/jour par ouvrier
  const laborCost = baseLaborCost * (1 - laborReduction / 100);
  
  const machineCost = line.machines
    .filter(m => m.status === 'running')
    .reduce((sum, m) => sum + m.operatingCost, 0);
  
  const maintenanceCost = line.maintenanceSchedule.estimatedCost / 30; // coût journalier
  
  const automationCost = automations
    .filter(a => a.lineId === line.id && a.active)
    .reduce((sum, a) => sum + a.maintenanceCost / 30, 0);
  
  return {
    laborCost,
    machineCost,
    maintenanceCost,
    automationCost,
    total: laborCost + machineCost + maintenanceCost + automationCost,
  };
}

export function calculateOEE(line: ProductionLine): {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
} {
  const workingMachines = line.machines.filter(m => m.status !== 'broken' && m.status !== 'maintenance');
  const availability = line.machines.length > 0 
    ? (workingMachines.length / line.machines.length) * 100 
    : 100;
  
  const performance = calculateLineEfficiency(line);
  const quality = 95 + Math.random() * 5; // Simplified quality metric
  
  const oee = (availability * performance * quality) / 10000;
  
  return { availability, performance, quality, oee };
}
