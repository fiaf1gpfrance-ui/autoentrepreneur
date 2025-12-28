// ============================================
// ADVANCED PRODUCTION & LOGISTICS ENGINE - 100+ Features
// ============================================

import {
  ProductionLine, Machine, MachineStatus, ProductionShift, MaintenanceTicket,
  QualityControl, QualityTest, Certification, QualityStandard,
  Warehouse, WarehouseZone, WarehouseZoneConfig, Shipment, ShippingMethod,
  Route, RouteStop, FleetVehicle, InventoryMovement, ProductionOrder, BillOfMaterial,
  LeanMetric
} from '@/types/advancedFeatures';

// ==================== PRODUCTION LINES (20 features) ====================

export function createProductionLine(
  name: string,
  productId: string,
  capacity: number
): ProductionLine {
  return {
    id: `line_${Date.now()}`,
    name,
    productId,
    capacity,
    currentOutput: 0,
    efficiency: 85,
    machines: [],
    operators: [],
    shifts: [],
    status: 'stopped',
  };
}

export function addMachineToLine(line: ProductionLine, machine: Machine): ProductionLine {
  return {
    ...line,
    machines: [...line.machines, machine],
    capacity: line.capacity + machine.efficiency * 10,
  };
}

export function addShiftToLine(line: ProductionLine, shift: ProductionShift): ProductionLine {
  return { ...line, shifts: [...line.shifts, shift] };
}

export function startProduction(line: ProductionLine): ProductionLine {
  return { ...line, status: 'running' };
}

export function stopProduction(line: ProductionLine): ProductionLine {
  return { ...line, status: 'stopped', currentOutput: 0 };
}

export function calculateLineOutput(line: ProductionLine): number {
  if (line.status !== 'running') return 0;
  
  const machineEfficiency = line.machines.length > 0
    ? line.machines.reduce((sum, m) => sum + (m.status === 'operational' ? m.efficiency : 0), 0) / line.machines.length
    : 85;
  
  const operatorFactor = Math.min(1, line.operators.length / (line.machines.length * 2));
  
  return Math.round(line.capacity * (machineEfficiency / 100) * operatorFactor * (line.efficiency / 100));
}

export function updateLineEfficiency(line: ProductionLine): ProductionLine {
  const machineDowntime = line.machines.filter(m => m.status !== 'operational').length / (line.machines.length || 1);
  const newEfficiency = Math.max(50, line.efficiency - machineDowntime * 10 + Math.random() * 2 - 1);
  return { ...line, efficiency: Math.round(newEfficiency) };
}

// ==================== MACHINES (20 features) ====================

export function createMachine(
  name: string,
  type: string,
  purchasePrice: number,
  currentDay: number
): Machine {
  return {
    id: `machine_${Date.now()}`,
    name,
    type,
    status: 'operational',
    purchaseDate: currentDay,
    purchasePrice,
    currentValue: purchasePrice,
    maintenanceSchedule: [currentDay + 30, currentDay + 60, currentDay + 90],
    lastMaintenance: currentDay,
    nextMaintenance: currentDay + 30,
    breakdownRate: 0.02,
    efficiency: 95,
    energyConsumption: purchasePrice * 0.001,
  };
}

export function updateMachineStatus(machine: Machine, status: MachineStatus): Machine {
  return { ...machine, status };
}

export function depreciateMachine(machine: Machine, monthsPassed: number): Machine {
  const depreciationRate = 0.02;
  const newValue = machine.currentValue * Math.pow(1 - depreciationRate, monthsPassed);
  return { ...machine, currentValue: Math.max(machine.purchasePrice * 0.1, newValue) };
}

export function performMaintenance(machine: Machine, currentDay: number): Machine {
  return {
    ...machine,
    status: 'operational',
    lastMaintenance: currentDay,
    nextMaintenance: currentDay + 30,
    efficiency: Math.min(100, machine.efficiency + 5),
    breakdownRate: Math.max(0.01, machine.breakdownRate - 0.005),
  };
}

export function checkForBreakdown(machine: Machine): boolean {
  if (machine.status !== 'operational') return false;
  return Math.random() < machine.breakdownRate;
}

export function repairMachine(machine: Machine, currentDay: number): { machine: Machine; cost: number } {
  const repairCost = machine.purchasePrice * 0.05;
  return {
    machine: {
      ...machine,
      status: 'operational',
      lastMaintenance: currentDay,
      efficiency: Math.max(70, machine.efficiency - 5),
      breakdownRate: machine.breakdownRate + 0.005,
    },
    cost: repairCost,
  };
}

export function calculateMachineROI(machine: Machine, outputValue: number, monthsOperating: number): number {
  const totalOutput = outputValue * monthsOperating;
  const totalCost = machine.purchasePrice + machine.energyConsumption * monthsOperating;
  return (totalOutput - totalCost) / totalCost * 100;
}

// ==================== PRODUCTION SHIFTS (10 features) ====================

export function createShift(
  name: string,
  startTime: string,
  endTime: string,
  workers: number,
  productionTarget: number
): ProductionShift {
  return {
    id: `shift_${Date.now()}`,
    name,
    startTime,
    endTime,
    workers,
    productionTarget,
    actualProduction: 0,
    qualityRate: 98,
  };
}

export function updateShiftProduction(shift: ProductionShift, produced: number): ProductionShift {
  return {
    ...shift,
    actualProduction: produced,
    qualityRate: Math.max(90, shift.qualityRate - (produced > shift.productionTarget ? 1 : -0.5)),
  };
}

export function calculateShiftEfficiency(shift: ProductionShift): number {
  return (shift.actualProduction / shift.productionTarget) * 100;
}

// ==================== MAINTENANCE (15 features) ====================

export function createMaintenanceTicket(
  machineId: string,
  type: 'preventive' | 'corrective' | 'predictive',
  description: string,
  priority: 'low' | 'medium' | 'high' | 'critical',
  estimatedCost: number,
  estimatedDowntime: number,
  currentDay: number
): MaintenanceTicket {
  return {
    id: `ticket_${Date.now()}`,
    machineId,
    type,
    priority,
    description,
    estimatedCost,
    estimatedDowntime,
    status: 'open',
    createdDate: currentDay,
  };
}

export function startMaintenance(ticket: MaintenanceTicket): MaintenanceTicket {
  return { ...ticket, status: 'in_progress' };
}

export function completeMaintenance(
  ticket: MaintenanceTicket,
  actualCost: number,
  actualDowntime: number,
  currentDay: number
): MaintenanceTicket {
  return {
    ...ticket,
    status: 'completed',
    actualCost,
    actualDowntime,
    completedDate: currentDay,
  };
}

export function calculateMaintenanceCost(tickets: MaintenanceTicket[]): number {
  return tickets
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0);
}

export function predictNextMaintenance(machine: Machine): number {
  const avgInterval = 30;
  const ageMultiplier = 1 - (machine.breakdownRate * 10);
  return Math.round(avgInterval * ageMultiplier);
}

// ==================== QUALITY CONTROL (20 features) ====================

export function createQualityControl(
  productId: string,
  batchNumber: string,
  inspector: string,
  currentDay: number
): QualityControl {
  return {
    id: `qc_${Date.now()}`,
    productId,
    batchNumber,
    inspectionDate: currentDay,
    inspector,
    tests: [],
    overallResult: 'pass',
    defectRate: 0,
    actions: [],
  };
}

export function addQualityTest(
  qc: QualityControl,
  name: string,
  standard: string,
  target: number,
  actual: number,
  tolerance: number
): QualityControl {
  const passed = Math.abs(actual - target) <= tolerance;
  const test: QualityTest = {
    id: `test_${Date.now()}_${qc.tests.length}`,
    name,
    standard,
    target,
    actual,
    tolerance,
    passed,
  };
  
  const allTests = [...qc.tests, test];
  const failedTests = allTests.filter(t => !t.passed).length;
  
  let overallResult: QualityControl['overallResult'] = 'pass';
  if (failedTests > allTests.length * 0.3) overallResult = 'fail';
  else if (failedTests > 0) overallResult = 'conditional';
  
  return {
    ...qc,
    tests: allTests,
    overallResult,
    defectRate: failedTests / allTests.length * 100,
  };
}

export function addCorrectiveAction(qc: QualityControl, action: string): QualityControl {
  return { ...qc, actions: [...qc.actions, action] };
}

export function calculateDefectRate(controls: QualityControl[]): number {
  if (controls.length === 0) return 0;
  return controls.reduce((sum, c) => sum + c.defectRate, 0) / controls.length;
}

// ==================== CERTIFICATIONS (10 features) ====================

const CERTIFICATION_DATABASE: Omit<Certification, 'id' | 'issueDate' | 'expirationDate' | 'auditor' | 'status'>[] = [
  { standard: 'iso9001', name: 'ISO 9001 - Qualité', cost: 15000, reputationBonus: 10 },
  { standard: 'iso14001', name: 'ISO 14001 - Environnement', cost: 20000, reputationBonus: 12 },
  { standard: 'iso45001', name: 'ISO 45001 - Sécurité', cost: 18000, reputationBonus: 8 },
  { standard: 'iso27001', name: 'ISO 27001 - Sécurité Info', cost: 25000, reputationBonus: 15 },
  { standard: 'haccp', name: 'HACCP - Alimentaire', cost: 12000, reputationBonus: 10 },
  { standard: 'gmp', name: 'GMP - Bonnes Pratiques', cost: 22000, reputationBonus: 12 },
  { standard: 'ce', name: 'Marquage CE', cost: 8000, reputationBonus: 5 },
];

export function getAvailableCertifications(): typeof CERTIFICATION_DATABASE {
  return CERTIFICATION_DATABASE;
}

export function createCertification(
  standard: QualityStandard,
  currentDay: number
): Certification | null {
  const template = CERTIFICATION_DATABASE.find(c => c.standard === standard);
  if (!template) return null;
  
  const auditors = ['Bureau Veritas', 'SGS', 'TÜV', 'AFNOR', 'DNV'];
  
  return {
    id: `cert_${Date.now()}`,
    ...template,
    issueDate: currentDay,
    expirationDate: currentDay + 365 * 3,
    auditor: auditors[Math.floor(Math.random() * auditors.length)],
    status: 'active',
  };
}

export function renewCertification(cert: Certification, currentDay: number): Certification {
  return {
    ...cert,
    issueDate: currentDay,
    expirationDate: currentDay + 365 * 3,
    status: 'active',
  };
}

export function checkCertificationStatus(cert: Certification, currentDay: number): Certification {
  if (currentDay > cert.expirationDate) {
    return { ...cert, status: 'expired' };
  }
  if (currentDay > cert.expirationDate - 60) {
    return { ...cert, status: 'pending_renewal' };
  }
  return cert;
}

// ==================== WAREHOUSING (15 features) ====================

export function createWarehouse(
  name: string,
  location: string,
  size: number,
  automated: boolean
): Warehouse {
  const zones: WarehouseZoneConfig[] = [
    { type: 'receiving', size: size * 0.1, capacity: size * 0.1, utilization: 0 },
    { type: 'storage', size: size * 0.6, capacity: size * 0.6, utilization: 0 },
    { type: 'picking', size: size * 0.15, capacity: size * 0.15, utilization: 0 },
    { type: 'packing', size: size * 0.1, capacity: size * 0.1, utilization: 0 },
    { type: 'shipping', size: size * 0.05, capacity: size * 0.05, utilization: 0 },
  ];
  
  return {
    id: `warehouse_${Date.now()}`,
    name,
    location,
    size,
    capacity: size * 0.8,
    utilization: 0,
    zones,
    cost: size * (automated ? 50 : 30),
    staff: automated ? Math.ceil(size / 500) : Math.ceil(size / 100),
    automated,
  };
}

export function updateWarehouseUtilization(
  warehouse: Warehouse,
  inventoryVolume: number
): Warehouse {
  const utilization = (inventoryVolume / warehouse.capacity) * 100;
  return { ...warehouse, utilization: Math.min(100, utilization) };
}

export function getWarehouseEfficiency(warehouse: Warehouse): number {
  const utilizationScore = warehouse.utilization > 80 ? 100 - (warehouse.utilization - 80) * 2 : warehouse.utilization;
  const automationBonus = warehouse.automated ? 15 : 0;
  return Math.min(100, utilizationScore + automationBonus);
}

// ==================== SHIPPING & LOGISTICS (15 features) ====================

export function createShipment(
  orderId: string,
  method: ShippingMethod,
  carrier: string,
  origin: string,
  destination: string,
  weight: number,
  volume: number,
  currentDay: number
): Shipment {
  const deliveryTimes: Record<ShippingMethod, number> = {
    road: 3, rail: 5, sea: 21, air: 2, multimodal: 7,
  };
  
  const costs: Record<ShippingMethod, number> = {
    road: weight * 0.5, rail: weight * 0.3, sea: weight * 0.15, air: weight * 2, multimodal: weight * 0.8,
  };
  
  return {
    id: `shipment_${Date.now()}`,
    orderId,
    method,
    carrier,
    origin,
    destination,
    weight,
    volume,
    cost: costs[method],
    estimatedDelivery: currentDay + deliveryTimes[method],
    status: 'preparing',
    trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  };
}

export function updateShipmentStatus(
  shipment: Shipment,
  status: Shipment['status'],
  actualDelivery?: number
): Shipment {
  return { ...shipment, status, actualDelivery };
}

export function calculateShippingCost(
  method: ShippingMethod,
  weight: number,
  distance: number
): number {
  const baseCosts: Record<ShippingMethod, number> = {
    road: 0.5, rail: 0.3, sea: 0.15, air: 2, multimodal: 0.8,
  };
  return weight * baseCosts[method] * (1 + distance / 10000);
}

export function calculateOnTimeDeliveryRate(shipments: Shipment[]): number {
  const delivered = shipments.filter(s => s.status === 'delivered');
  if (delivered.length === 0) return 100;
  
  const onTime = delivered.filter(s => 
    s.actualDelivery && s.actualDelivery <= s.estimatedDelivery
  ).length;
  
  return (onTime / delivered.length) * 100;
}

// ==================== FLEET MANAGEMENT (10 features) ====================

export function createFleetVehicle(
  type: FleetVehicle['type'],
  licensePlate: string,
  capacity: number,
  cost: number,
  currentDay: number
): FleetVehicle {
  return {
    id: `vehicle_${Date.now()}`,
    type,
    licensePlate,
    capacity,
    status: 'available',
    fuelConsumption: type === 'truck' ? 35 : type === 'van' ? 12 : type === 'forklift' ? 5 : 20,
    mileage: 0,
    nextService: currentDay + 90,
    cost,
  };
}

export function updateVehicleMileage(vehicle: FleetVehicle, distance: number): FleetVehicle {
  return { ...vehicle, mileage: vehicle.mileage + distance };
}

export function serviceVehicle(vehicle: FleetVehicle, currentDay: number): { vehicle: FleetVehicle; cost: number } {
  const serviceCost = vehicle.cost * 0.02;
  return {
    vehicle: {
      ...vehicle,
      nextService: currentDay + 90,
      status: 'available',
    },
    cost: serviceCost,
  };
}

export function calculateFleetCost(fleet: FleetVehicle[], fuelPrice: number): number {
  return fleet.reduce((sum, v) => {
    const fuelCost = (v.mileage / 100) * v.fuelConsumption * fuelPrice;
    return sum + fuelCost + v.cost * 0.001;
  }, 0);
}

// ==================== PRODUCTION ORDERS (10 features) ====================

export function createProductionOrder(
  productId: string,
  quantity: number,
  priority: ProductionOrder['priority'],
  dueDate: number,
  materials: BillOfMaterial[]
): ProductionOrder {
  return {
    id: `order_${Date.now()}`,
    productId,
    quantity,
    priority,
    dueDate,
    status: 'planned',
    materials,
  };
}

export function scheduleOrder(order: ProductionOrder, lineId: string, startDate: number): ProductionOrder {
  return { ...order, status: 'scheduled', lineId, startDate };
}

export function startOrder(order: ProductionOrder): ProductionOrder {
  return { ...order, status: 'in_progress' };
}

export function completeOrder(order: ProductionOrder, completionDate: number): ProductionOrder {
  return { ...order, status: 'completed', completionDate };
}

export function calculateMaterialCost(materials: BillOfMaterial[]): number {
  return materials.reduce((sum, m) => sum + m.cost * m.quantity, 0);
}

export function checkMaterialAvailability(materials: BillOfMaterial[]): boolean {
  return materials.every(m => m.available);
}

// ==================== LEAN METRICS (5 features) ====================

export function calculateLeanMetrics(
  lines: ProductionLine[],
  orders: ProductionOrder[],
  controls: QualityControl[]
): LeanMetric {
  const runningLines = lines.filter(l => l.status === 'running');
  
  const oee = runningLines.length > 0
    ? runningLines.reduce((sum, l) => sum + l.efficiency, 0) / runningLines.length
    : 0;
  
  const avgCycleTime = orders.length > 0
    ? orders.filter(o => o.completionDate && o.startDate)
        .reduce((sum, o) => sum + ((o.completionDate || 0) - (o.startDate || 0)), 0) / orders.length
    : 0;
  
  const defectRate = calculateDefectRate(controls);
  
  return {
    oee,
    taktTime: 8 * 60 / (orders.reduce((sum, o) => sum + o.quantity, 0) || 1),
    cycleTime: avgCycleTime,
    leadTime: avgCycleTime * 1.5,
    wip: orders.filter(o => o.status === 'in_progress').reduce((sum, o) => sum + o.quantity, 0),
    defectRate,
    firstPassYield: 100 - defectRate,
  };
}

export function getKaizenSuggestions(metrics: LeanMetric): string[] {
  const suggestions: string[] = [];
  
  if (metrics.oee < 85) suggestions.push('Améliorer l\'OEE par maintenance préventive');
  if (metrics.defectRate > 2) suggestions.push('Réduire le taux de défauts par formation qualité');
  if (metrics.wip > 100) suggestions.push('Réduire les encours de production');
  if (metrics.cycleTime > metrics.taktTime) suggestions.push('Optimiser le temps de cycle');
  if (metrics.firstPassYield < 95) suggestions.push('Améliorer le rendement premier passage');
  
  return suggestions;
}
