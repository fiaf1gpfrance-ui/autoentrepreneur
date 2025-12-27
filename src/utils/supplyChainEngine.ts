// Supply Chain & Real Estate Engine
import {
  Property,
  PropertyType,
  LeaseType,
  Supplier,
  SupplierContract,
  InventoryItem,
  Client,
  ClientContract,
  Invoice,
  PROPERTY_CONFIGS,
  Company,
} from '@/types/game';

const generateId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ==================== REAL ESTATE ====================

const LOCATIONS = [
  { name: 'Paris Centre', prestige: 10, priceMultiplier: 2.5 },
  { name: 'La Défense', prestige: 9, priceMultiplier: 2.2 },
  { name: 'Lyon Part-Dieu', prestige: 8, priceMultiplier: 1.5 },
  { name: 'Marseille Euroméditerranée', prestige: 7, priceMultiplier: 1.3 },
  { name: 'Toulouse Aerospace', prestige: 7, priceMultiplier: 1.2 },
  { name: 'Nantes Atlantique', prestige: 6, priceMultiplier: 1.1 },
  { name: 'Zone Industrielle', prestige: 3, priceMultiplier: 0.6 },
  { name: 'Périphérie', prestige: 4, priceMultiplier: 0.7 },
];

export function generateProperty(
  type: PropertyType,
  size: number,
  leaseType: LeaseType
): Property {
  const config = PROPERTY_CONFIGS[type];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  
  const baseRent = config.baseRentPerM2 * size * location.priceMultiplier;
  const basePrice = config.basePricePerM2 * size * location.priceMultiplier;

  return {
    id: generateId('prop'),
    name: `${config.name} ${location.name}`,
    type,
    size,
    maxEmployees: Math.floor(size * config.maxEmployeesPerM2),
    leaseType,
    monthlyRent: leaseType === 'location' ? Math.round(baseRent) : undefined,
    purchasePrice: leaseType === 'achat' ? Math.round(basePrice) : undefined,
    currentValue: Math.round(basePrice),
    moralBonus: config.moralBonus + Math.floor(location.prestige / 2),
    productivityBonus: config.productivityBonus,
    location: location.name,
    prestige: location.prestige,
    condition: 90 + Math.floor(Math.random() * 10),
    maintenanceCost: Math.round(baseRent * 0.1),
  };
}

export function getAvailableProperties(
  treasury: number,
  employeeCount: number
): Property[] {
  const properties: Property[] = [];
  const types: PropertyType[] = ['bureau', 'entrepot', 'usine', 'boutique', 'siege_social'];
  const sizes = [50, 100, 200, 500, 1000];

  for (const type of types) {
    for (const size of sizes) {
      // Location property
      const rental = generateProperty(type, size, 'location');
      if ((rental.monthlyRent || 0) < treasury * 0.1) {
        properties.push(rental);
      }

      // Purchase property (if treasury allows)
      if (treasury > 50000) {
        const purchase = generateProperty(type, size, 'achat');
        if ((purchase.purchasePrice || 0) < treasury * 0.8) {
          properties.push(purchase);
        }
      }
    }
  }

  return properties.slice(0, 12); // Limit to 12 options
}

export function calculatePropertyImpact(properties: Property[]): {
  maxEmployees: number;
  moralBonus: number;
  productivityBonus: number;
  monthlyCost: number;
} {
  return properties.reduce(
    (acc, prop) => ({
      maxEmployees: acc.maxEmployees + prop.maxEmployees,
      moralBonus: acc.moralBonus + prop.moralBonus,
      productivityBonus: acc.productivityBonus + prop.productivityBonus,
      monthlyCost: acc.monthlyCost + (prop.monthlyRent || 0) + prop.maintenanceCost,
    }),
    { maxEmployees: 5, moralBonus: 0, productivityBonus: 0, monthlyCost: 0 }
  );
}

// ==================== SUPPLIERS ====================

const SUPPLIER_NAMES = [
  'FourniFrance', 'TechSupply Pro', 'LogiStock', 'MatérioPremium',
  'ServicePlus', 'QualitéMax', 'RapidLivraison', 'EuroFournitures',
  'IndustriPartner', 'GreenSupply', 'FastDelivery', 'ProMaterials'
];

const SUPPLIER_CATEGORIES = [
  'Matières premières', 'Équipements IT', 'Fournitures bureau',
  'Services externalisés', 'Logistique', 'Emballage', 'Énergie'
];

export function generateSupplier(): Supplier {
  const name = SUPPLIER_NAMES[Math.floor(Math.random() * SUPPLIER_NAMES.length)];
  const category = SUPPLIER_CATEGORIES[Math.floor(Math.random() * SUPPLIER_CATEGORIES.length)];

  return {
    id: generateId('sup'),
    name: `${name} ${Math.floor(Math.random() * 100)}`,
    category,
    relation: 'nouveau',
    reliability: 50 + Math.floor(Math.random() * 40),
    quality: 50 + Math.floor(Math.random() * 40),
    priceLevel: 0.9 + Math.random() * 0.3,
    paymentDelay: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
    deliveryTime: 3 + Math.floor(Math.random() * 12),
    minOrderAmount: 500 + Math.floor(Math.random() * 2000),
    contracts: [],
  };
}

export function createSupplierContract(
  supplier: Supplier,
  productType: string,
  monthlyVolume: number,
  duration: number,
  currentDay: number
): SupplierContract {
  const basePrice = 100 * supplier.priceLevel;
  const volumeDiscount = monthlyVolume > 1000 ? 0.9 : monthlyVolume > 500 ? 0.95 : 1;
  const durationDiscount = duration > 12 ? 0.95 : duration > 6 ? 0.97 : 1;

  return {
    id: generateId('sc'),
    supplierId: supplier.id,
    productType,
    monthlyVolume,
    unitPrice: Math.round(basePrice * volumeDiscount * durationDiscount * 100) / 100,
    duration,
    startDate: currentDay,
    penalty: monthlyVolume * basePrice * 0.2, // 20% penalty for breach
  };
}

export function processSupplierDelivery(
  supplier: Supplier,
  contract: SupplierContract
): { success: boolean; delay: number; qualityIssue: boolean } {
  const reliabilityRoll = Math.random() * 100;
  const qualityRoll = Math.random() * 100;

  return {
    success: reliabilityRoll < supplier.reliability,
    delay: reliabilityRoll < supplier.reliability ? 0 : Math.floor(Math.random() * 7) + 1,
    qualityIssue: qualityRoll > supplier.quality,
  };
}

// ==================== INVENTORY ====================

export function createInventoryItem(
  name: string,
  category: string,
  supplierId: string,
  unitCost: number
): InventoryItem {
  return {
    id: generateId('inv'),
    name,
    category,
    quantity: 0,
    unitCost,
    reorderLevel: 50,
    maxStock: 500,
    supplierId,
  };
}

export function calculateInventoryValue(inventory: InventoryItem[]): number {
  return inventory.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
}

export function checkReorderNeeded(inventory: InventoryItem[]): InventoryItem[] {
  return inventory.filter(item => item.quantity <= item.reorderLevel);
}

// ==================== CLIENTS ====================

const CLIENT_NAMES = {
  particulier: ['Martin', 'Dubois', 'Durand', 'Moreau', 'Laurent', 'Simon', 'Michel'],
  tpe: ['Boulangerie du Coin', 'Garage Auto+', 'Coiffure Style', 'Resto Italien'],
  pme: ['TechnoSoft SARL', 'Distribution Express', 'Services Conseil', 'Marketing Plus'],
  grand_compte: ['Carrefour', 'Orange', 'Total', 'BNP Paribas', 'EDF', 'SNCF'],
  public: ['Mairie de Paris', 'Région IDF', 'Ministère Économie', 'Hôpital Central'],
};

export function generateClient(type: Client['type'], sector?: string): Client {
  const names = CLIENT_NAMES[type];
  const name = names[Math.floor(Math.random() * names.length)];

  const creditRatings = {
    particulier: 50 + Math.floor(Math.random() * 30),
    tpe: 55 + Math.floor(Math.random() * 25),
    pme: 60 + Math.floor(Math.random() * 25),
    grand_compte: 80 + Math.floor(Math.random() * 15),
    public: 95 + Math.floor(Math.random() * 5),
  };

  const paymentDelays = {
    particulier: 0,
    tpe: 30,
    pme: 45,
    grand_compte: 60,
    public: 90,
  };

  return {
    id: generateId('cli'),
    name: type === 'particulier' ? `M./Mme ${name}` : name,
    type,
    sector: sector || 'Général',
    creditRating: creditRatings[type],
    paymentDelay: paymentDelays[type],
    totalRevenue: 0,
    relationshipScore: 50,
    contracts: [],
    lastContactDate: 0,
  };
}

export function createClientContract(
  client: Client,
  name: string,
  value: number,
  duration: number,
  currentDay: number
): ClientContract {
  return {
    id: generateId('cc'),
    clientId: client.id,
    name,
    status: 'negotiation',
    value,
    monthlyValue: Math.round(value / duration),
    startDate: currentDay,
    endDate: currentDay + duration * 30,
    paymentTerms: client.paymentDelay,
    penalties: 0,
    unpaidAmount: 0,
  };
}

export function createInvoice(
  clientId: string,
  contractId: string,
  amount: number,
  currentDay: number,
  paymentTerms: number
): Invoice {
  return {
    id: generateId('fac'),
    clientId,
    contractId,
    amount,
    issueDate: currentDay,
    dueDate: currentDay + paymentTerms,
    paid: false,
    overdue: false,
  };
}

export function processInvoicePayment(
  invoice: Invoice,
  client: Client,
  currentDay: number
): { paid: boolean; amount: number; partial?: number } {
  if (invoice.paid) return { paid: true, amount: 0 };

  // Check if overdue
  if (currentDay > invoice.dueDate) {
    invoice.overdue = true;
  }

  // Payment probability based on credit rating
  const paymentChance = client.creditRating / 100;
  const delayDays = currentDay - invoice.dueDate;

  // More likely to pay as time passes (up to 60 days)
  const urgencyBonus = Math.min(delayDays * 0.01, 0.3);

  if (Math.random() < paymentChance + urgencyBonus) {
    // Full payment
    return { paid: true, amount: invoice.amount };
  } else if (Math.random() < 0.2) {
    // Partial payment
    const partial = Math.round(invoice.amount * (0.3 + Math.random() * 0.4));
    return { paid: false, amount: partial, partial };
  }

  return { paid: false, amount: 0 };
}

export function calculateClientReceivables(invoices: Invoice[]): number {
  return invoices
    .filter(inv => !inv.paid)
    .reduce((sum, inv) => sum + inv.amount, 0);
}

export function calculateOverdueReceivables(invoices: Invoice[], currentDay: number): number {
  return invoices
    .filter(inv => !inv.paid && currentDay > inv.dueDate)
    .reduce((sum, inv) => sum + inv.amount, 0);
}

// ==================== MONTHLY PROCESSING ====================

export function processMonthlySupplyChain(
  company: Company,
  currentDay: number
): {
  company: Company;
  supplierPayments: number;
  clientPayments: number;
  inventoryCost: number;
  events: string[];
} {
  const events: string[] = [];
  let supplierPayments = 0;
  let clientPayments = 0;
  let inventoryCost = 0;

  const updatedCompany = { ...company };

  // Process supplier contracts
  updatedCompany.suppliers = company.suppliers.map(supplier => {
    supplier.contracts.forEach(contract => {
      const delivery = processSupplierDelivery(supplier, contract);
      const payment = contract.monthlyVolume * contract.unitPrice;
      supplierPayments += payment;

      if (!delivery.success) {
        events.push(`Retard de livraison de ${supplier.name}: ${delivery.delay} jours`);
      }
      if (delivery.qualityIssue) {
        events.push(`Problème qualité avec ${supplier.name}`);
      }
    });

    // Update relationship based on volume
    const totalVolume = supplier.contracts.reduce((sum, c) => sum + c.monthlyVolume, 0);
    if (totalVolume > 5000 && supplier.relation !== 'strategique') {
      supplier.relation = 'partenaire';
    } else if (totalVolume > 1000 && supplier.relation === 'nouveau') {
      supplier.relation = 'regulier';
    }

    return supplier;
  });

  // Process client invoices
  updatedCompany.invoices = company.invoices.map(invoice => {
    if (invoice.paid) return invoice;

    const client = company.clients.find(c => c.id === invoice.clientId);
    if (!client) return invoice;

    const result = processInvoicePayment(invoice, client, currentDay);
    if (result.paid) {
      clientPayments += result.amount;
      invoice.paid = true;
      invoice.paidDate = currentDay;
    } else if (result.partial) {
      clientPayments += result.partial;
      invoice.amount -= result.partial;
      events.push(`Paiement partiel de ${client.name}: ${result.partial}€`);
    } else if (invoice.overdue) {
      events.push(`Impayé client ${client.name}: ${invoice.amount}€`);
    }

    return invoice;
  });

  // Calculate inventory holding cost
  inventoryCost = calculateInventoryValue(company.inventory) * 0.02; // 2% monthly

  return {
    company: updatedCompany,
    supplierPayments,
    clientPayments,
    inventoryCost,
    events,
  };
}
