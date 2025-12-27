import { useState } from "react";
import { Supplier, InventoryItem, Client, Invoice, ClientContract } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { Truck, Package, Users, FileText, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupplyChainPanelProps {
  suppliers: Supplier[];
  inventory: InventoryItem[];
  clients: Client[];
  invoices: Invoice[];
  treasury: number;
  onAddSupplier: (supplier: Partial<Supplier>) => void;
  onOrderInventory: (supplierId: string, item: string, quantity: number) => void;
  onAddClient: (client: Partial<Client>) => void;
  onCreateContract: (clientId: string, contract: Partial<ClientContract>) => void;
  onPayInvoice: (invoiceId: string) => void;
}

const availableSuppliers: Partial<Supplier>[] = [
  { name: "TechParts Pro", category: "Composants", reliability: 85, quality: 90, priceLevel: 1.1, deliveryTime: 5 },
  { name: "Budget Supply", category: "Fournitures", reliability: 70, quality: 60, priceLevel: 0.8, deliveryTime: 10 },
  { name: "Premium Materials", category: "Matières premières", reliability: 95, quality: 95, priceLevel: 1.3, deliveryTime: 3 },
  { name: "Quick Delivery Co", category: "Logistique", reliability: 90, quality: 75, priceLevel: 1.0, deliveryTime: 2 },
  { name: "Eco Supplies", category: "Fournitures éco", reliability: 80, quality: 85, priceLevel: 1.15, deliveryTime: 7 },
];

const relationLabels = {
  nouveau: { label: "Nouveau", color: "text-muted-foreground" },
  regulier: { label: "Régulier", color: "text-foreground" },
  partenaire: { label: "Partenaire", color: "text-primary" },
  strategique: { label: "Stratégique", color: "text-warning" },
};

const clientTypeLabels = {
  particulier: "Particulier",
  tpe: "TPE",
  pme: "PME",
  grand_compte: "Grand Compte",
  public: "Secteur Public",
};

export function SupplyChainPanel({
  suppliers,
  inventory,
  clients,
  invoices,
  treasury,
  onAddSupplier,
  onOrderInventory,
  onAddClient,
  onCreateContract,
  onPayInvoice,
}: SupplyChainPanelProps) {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'inventory' | 'clients' | 'invoices'>('suppliers');

  const pendingInvoices = invoices.filter(i => !i.paid);
  const overdueInvoices = invoices.filter(i => !i.paid && i.overdue);
  const totalReceivables = pendingInvoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="game-panel text-center">
          <Truck className="w-6 h-6 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Fournisseurs</p>
          <p className="text-xl font-bold">{suppliers.length}</p>
        </div>
        <div className="game-panel text-center">
          <Package className="w-6 h-6 text-info mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Stock</p>
          <p className="text-xl font-bold">{inventory.reduce((s, i) => s + i.quantity, 0)}</p>
        </div>
        <div className="game-panel text-center">
          <Users className="w-6 h-6 text-success mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Clients</p>
          <p className="text-xl font-bold">{clients.length}</p>
        </div>
        <div className="game-panel text-center">
          <FileText className="w-6 h-6 text-warning mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Créances</p>
          <p className={cn("text-xl font-bold", overdueInvoices.length > 0 ? "text-destructive" : "text-foreground")}>
            {formatCurrency(totalReceivables)}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'suppliers', label: 'Fournisseurs', icon: Truck },
          { id: 'inventory', label: 'Inventaire', icon: Package },
          { id: 'clients', label: 'Clients', icon: Users },
          { id: 'invoices', label: 'Factures', icon: FileText, badge: overdueInvoices.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors relative",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Suppliers Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Available Suppliers */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Fournisseurs disponibles</h4>
            <div className="space-y-3">
              {availableSuppliers.map((sup, idx) => (
                <div key={idx} className="bg-secondary/50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-sm">{sup.name}</p>
                      <p className="text-xs text-muted-foreground">{sup.category}</p>
                    </div>
                    <button
                      onClick={() => onAddSupplier(sup)}
                      className="btn-game-primary text-xs py-1 px-2"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Fiabilité</span>
                      <p className={cn("font-medium", (sup.reliability || 0) >= 80 ? "text-success" : "text-warning")}>
                        {sup.reliability}%
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Qualité</span>
                      <p className="font-medium">{sup.quality}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Prix</span>
                      <p className={cn("font-medium", (sup.priceLevel || 1) <= 1 ? "text-success" : "text-warning")}>
                        x{sup.priceLevel}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Suppliers */}
          <div className="game-panel">
            <h4 className="font-display font-semibold mb-4">Mes fournisseurs ({suppliers.length})</h4>
            {suppliers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Ajoutez des fournisseurs pour gérer votre chaîne d'approvisionnement.
              </p>
            ) : (
              <div className="space-y-3">
                {suppliers.map(sup => {
                  const rel = relationLabels[sup.relation];
                  return (
                    <div key={sup.id} className="bg-secondary/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">{sup.name}</p>
                          <p className={cn("text-xs", rel.color)}>{rel.label}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{sup.category}</span>
                      </div>
                      <GaugeBar value={sup.reliability} label="Fiabilité" colorClass="bg-primary" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">Inventaire</h4>
          {inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun stock. Passez des commandes auprès de vos fournisseurs.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Article</th>
                    <th className="text-right py-2">Quantité</th>
                    <th className="text-right py-2">Coût unitaire</th>
                    <th className="text-right py-2">Valeur</th>
                    <th className="text-center py-2">État</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id} className="border-b border-border/50">
                      <td className="py-2">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">{formatCurrency(item.unitCost)}</td>
                      <td className="text-right py-2 font-medium">
                        {formatCurrency(item.quantity * item.unitCost)}
                      </td>
                      <td className="text-center py-2">
                        {item.quantity <= item.reorderLevel ? (
                          <span className="text-destructive flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Bas
                          </span>
                        ) : (
                          <span className="text-success flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" /> OK
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-2 gap-4">
          {clients.length === 0 ? (
            <div className="col-span-2 game-panel text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun client. Les clients arrivent avec les ventes.</p>
            </div>
          ) : (
            clients.map(client => (
              <div key={client.id} className="game-panel">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-display font-semibold text-sm">{client.name}</h4>
                    <p className="text-xs text-muted-foreground">{clientTypeLabels[client.type]}</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {client.contracts.length} contrat(s)
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <GaugeBar value={client.relationshipScore} label="Relation" colorClass="bg-primary" />
                  <GaugeBar value={client.creditRating} label="Solvabilité" colorClass={client.creditRating >= 70 ? "bg-success" : "bg-warning"} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">CA total</span>
                    <p className="font-medium text-success">{formatCurrency(client.totalRevenue)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Délai paiement</span>
                    <p className="font-medium">{client.paymentDelay} jours</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="game-panel">
          <h4 className="font-display font-semibold mb-4">
            Factures clients ({pendingInvoices.length} en attente)
          </h4>
          {invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune facture. Les factures sont générées automatiquement lors des ventes.
            </p>
          ) : (
            <div className="space-y-2">
              {invoices.map(invoice => {
                const client = clients.find(c => c.id === invoice.clientId);
                return (
                  <div 
                    key={invoice.id} 
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg",
                      invoice.paid ? "bg-success/10" : invoice.overdue ? "bg-destructive/10" : "bg-secondary/50"
                    )}
                  >
                    <div>
                      <p className="font-medium text-sm">{client?.name || "Client inconnu"}</p>
                      <p className="text-xs text-muted-foreground">
                        Émise jour {invoice.issueDate} • Échéance jour {invoice.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(invoice.amount)}</p>
                      {invoice.paid ? (
                        <span className="text-xs text-success">Payée</span>
                      ) : invoice.overdue ? (
                        <span className="text-xs text-destructive">En retard</span>
                      ) : (
                        <span className="text-xs text-warning">En attente</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
