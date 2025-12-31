import { useState, useMemo } from 'react';
import {
  Car,
  Truck,
  Fuel,
  Wrench,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Plus,
  Eye,
  UserPlus,
  UserMinus,
  Settings,
  Calendar,
  Gauge,
  Leaf,
  Crown,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CompanyVehicle,
  VehicleModel,
  VehicleCategory,
  calculateMonthlyVehicleCost,
} from '@/types/vehicles';
import { EXTENDED_VEHICLE_CATALOG, CATALOG_STATS } from '@/data/vehicleCatalog';
import {
  purchaseVehicle,
  assignVehicleToEmployee,
  unassignVehicle,
  scheduleMaintenance,
  calculateFleetTotals,
  calculateFleetStatistics,
} from '@/utils/vehicleEngine';
import { Employee } from '@/types/game';
import { toast } from 'sonner';

interface VehicleFleetPanelProps {
  treasury: number;
  employees: Employee[];
  day: number;
  onTreasuryChange: (amount: number) => void;
  onReputationChange: (amount: number) => void;
  onProductivityChange: (amount: number) => void;
}

const categoryIcons: Record<VehicleCategory, typeof Car> = {
  berline: Car,
  suv: Car,
  utilitaire: Truck,
  luxe: Crown,
  sport: Sparkles,
};

const categoryColors: Record<VehicleCategory, string> = {
  berline: 'bg-blue-500',
  suv: 'bg-green-500',
  utilitaire: 'bg-orange-500',
  luxe: 'bg-purple-500',
  sport: 'bg-red-500',
};

export function VehicleFleetPanel({
  treasury,
  employees,
  day,
  onTreasuryChange,
  onReputationChange,
  onProductivityChange,
}: VehicleFleetPanelProps) {
  const [vehicles, setVehicles] = useState<CompanyVehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'all'>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<CompanyVehicle | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const [acquisitionType, setAcquisitionType] = useState<'achat' | 'leasing' | 'lld'>('achat');

  const fleet = useMemo(() => calculateFleetTotals(vehicles), [vehicles]);
  const stats = useMemo(() => calculateFleetStatistics(fleet), [fleet]);

  const filteredCatalog = useMemo(() => {
    if (selectedCategory === 'all') return EXTENDED_VEHICLE_CATALOG;
    return EXTENDED_VEHICLE_CATALOG.filter(v => v.category === selectedCategory);
  }, [selectedCategory]);

  const filteredVehicles = useMemo(() => {
    if (selectedCategory === 'all') return vehicles;
    return vehicles.filter(v => v.model.category === selectedCategory);
  }, [vehicles, selectedCategory]);

  const handlePurchase = (model: VehicleModel) => {
    let cost = 0;
    switch (acquisitionType) {
      case 'achat': cost = model.purchasePrice; break;
      case 'leasing': cost = model.purchasePrice * 0.1; break;
      case 'lld': cost = model.lldPrice; break;
    }

    if (treasury < cost) {
      toast.error('Trésorerie insuffisante');
      return;
    }

    const colors = ['Noir', 'Blanc', 'Gris', 'Bleu', 'Rouge'];
    const vehicle = purchaseVehicle(model.id, acquisitionType, colors[Math.floor(Math.random() * colors.length)], day);
    
    if (!vehicle) {
      toast.error('Erreur lors de l\'achat');
      return;
    }

    setVehicles(prev => [...prev, vehicle]);
    onTreasuryChange(-cost);
    onReputationChange(model.reputationBonus);
    toast.success(`${model.brand} ${model.model} ajouté à la flotte !`);
    setShowCatalog(false);
  };

  const handleAssign = (vehicleId: string, employeeId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const updated = assignVehicleToEmployee(v, employeeId, day);
        onProductivityChange(v.model.productivityBonus);
        toast.success(`Véhicule assigné !`);
        return updated;
      }
      return v;
    }));
  };

  const handleUnassign = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        onProductivityChange(-v.model.productivityBonus);
        toast.info('Véhicule libéré');
        return unassignVehicle(v);
      }
      return v;
    }));
  };

  const handleMaintenance = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    const cost = vehicle.model.maintenanceCost / 4;
    if (treasury < cost) {
      toast.error('Trésorerie insuffisante');
      return;
    }

    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const result = scheduleMaintenance(v, 'revision', cost, 'Garage Officiel', day);
        return result.vehicle;
      }
      return v;
    }));
    onTreasuryChange(-cost);
    toast.success('Maintenance planifiée');
  };

  const handleSell = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    if (vehicle.acquisitionType !== 'achat') {
      toast.error('Impossible de vendre un véhicule en location');
      return;
    }

    const salePrice = vehicle.currentValue * 0.9;
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
    onTreasuryChange(salePrice);
    onReputationChange(-vehicle.model.reputationBonus);
    if (vehicle.assignedTo) {
      onProductivityChange(-vehicle.model.productivityBonus);
    }
    toast.success(`Véhicule vendu pour ${salePrice.toLocaleString()}€`);
  };

  const formatCurrency = (amount: number) => amount.toLocaleString('fr-FR') + ' €';

  return (
    <div className="space-y-4">
      {/* Fleet Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Car className="w-3 h-3" />
              Véhicules
            </div>
            <p className="font-bold text-lg">{stats.totalVehicles}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <DollarSign className="w-3 h-3" />
              Valeur flotte
            </div>
            <p className="font-bold text-lg">{formatCurrency(fleet.totalValue)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Fuel className="w-3 h-3" />
              Coût mensuel
            </div>
            <p className="font-bold text-lg">{formatCurrency(stats.totalMonthlyCost)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              Réputation
            </div>
            <p className="font-bold text-lg text-green-500">+{stats.reputationContribution}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Gauge className="w-3 h-3 text-blue-500" />
              Productivité
            </div>
            <p className="font-bold text-lg text-blue-500">+{stats.productivityContribution}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as VehicleCategory | 'all')}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              <SelectItem value="berline">Berlines</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="utilitaire">Utilitaires</SelectItem>
              <SelectItem value="luxe">Luxe</SelectItem>
              <SelectItem value="sport">Sport</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={showCatalog} onOpenChange={setShowCatalog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Ajouter véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Catalogue de véhicules</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as VehicleCategory | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="berline">Berlines</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="utilitaire">Utilitaires</SelectItem>
                    <SelectItem value="luxe">Luxe</SelectItem>
                    <SelectItem value="sport">Sport</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={acquisitionType} onValueChange={(v) => setAcquisitionType(v as 'achat' | 'leasing' | 'lld')}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achat">Achat</SelectItem>
                    <SelectItem value="leasing">Leasing</SelectItem>
                    <SelectItem value="lld">LLD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredCatalog.map(model => {
                    const Icon = categoryIcons[model.category];
                    const price = acquisitionType === 'achat' ? model.purchasePrice : 
                                 acquisitionType === 'leasing' ? model.purchasePrice * 0.1 : 
                                 model.lldPrice;
                    const canAfford = treasury >= price;
                    
                    return (
                      <Card key={model.id} className={cn('hover:border-primary/50 transition-colors', !canAfford && 'opacity-50')}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', categoryColors[model.category])}>
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold">{model.brand}</h4>
                                <p className="text-sm text-muted-foreground">{model.model}</p>
                              </div>
                            </div>
                            <Badge variant="outline">{model.year}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                            <div className="text-center">
                              <Gauge className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="font-medium">{model.power} CV</p>
                            </div>
                            <div className="text-center">
                              <Leaf className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="font-medium">{model.co2Emissions} g/km</p>
                            </div>
                            <div className="text-center">
                              <Fuel className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                              <p className="font-medium">{model.fuelConsumption} L/100</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              +{model.reputationBonus} réputation
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Gauge className="w-3 h-3 mr-1" />
                              +{model.productivityBonus}% productivité
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold">{formatCurrency(price)}</p>
                              <p className="text-xs text-muted-foreground">
                                {acquisitionType === 'achat' ? 'Achat' : acquisitionType === 'leasing' ? 'Acompte leasing' : '/mois LLD'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              disabled={!canAfford}
                              onClick={() => handlePurchase(model)}
                            >
                              {acquisitionType === 'achat' ? 'Acheter' : 'Commander'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vehicle List */}
      {vehicles.length === 0 ? (
        <Card className="p-8 text-center">
          <Car className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-medium mb-1">Aucun véhicule</h3>
          <p className="text-sm text-muted-foreground mb-4">Ajoutez des véhicules à votre flotte</p>
          <Button onClick={() => setShowCatalog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Parcourir le catalogue
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredVehicles.map(vehicle => {
            const Icon = categoryIcons[vehicle.model.category];
            const assignedEmployee = employees.find(e => e.id === vehicle.assignedTo);
            const needsMaintenance = day - vehicle.lastMaintenanceDate > 300;
            
            return (
              <Card key={vehicle.id} className={cn(vehicle.status === 'maintenance' && 'border-orange-500/50', vehicle.status === 'accident' && 'border-red-500/50')}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', categoryColors[vehicle.model.category])}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{vehicle.model.brand} {vehicle.model.model}</h4>
                        <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                      </div>
                    </div>
                    <Badge variant={vehicle.status === 'available' ? 'default' : vehicle.status === 'assigned' ? 'secondary' : 'destructive'}>
                      {vehicle.status === 'available' ? 'Disponible' : vehicle.status === 'assigned' ? 'Assigné' : vehicle.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Kilométrage</span>
                      <span>{vehicle.mileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Valeur</span>
                      <span>{formatCurrency(vehicle.currentValue)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Coût mensuel</span>
                      <span>{formatCurrency(calculateMonthlyVehicleCost(vehicle))}</span>
                    </div>
                  </div>

                  {assignedEmployee && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-lg">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{assignedEmployee.name}</span>
                    </div>
                  )}

                  {needsMaintenance && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-orange-500/10 rounded-lg text-orange-500">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-xs">Maintenance recommandée</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {vehicle.status === 'available' ? (
                      <Select onValueChange={(v) => handleAssign(vehicle.id, v)}>
                        <SelectTrigger className="flex-1 h-8 text-xs">
                          <UserPlus className="w-3 h-3 mr-1" />
                          Assigner
                        </SelectTrigger>
                        <SelectContent>
                          {employees.filter(e => !vehicles.some(v => v.assignedTo === e.id)).map(e => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : vehicle.status === 'assigned' && (
                      <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => handleUnassign(vehicle.id)}>
                        <UserMinus className="w-3 h-3 mr-1" />
                        Libérer
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => handleMaintenance(vehicle.id)}>
                      <Wrench className="w-3 h-3" />
                    </Button>
                    {vehicle.acquisitionType === 'achat' && (
                      <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => handleSell(vehicle.id)}>
                        Vendre
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
