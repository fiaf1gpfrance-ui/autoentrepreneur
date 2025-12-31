import { AlertTriangle, Receipt, Calendar, CheckCircle2, Clock, Euro } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/gameEngine";

interface TaxAlert {
  id: string;
  type: 'tva' | 'is' | 'cotisations' | 'cfe' | 'cvae';
  name: string;
  amount: number;
  dueDay: number;
  status: 'paid' | 'pending' | 'overdue';
}

interface TaxAlertWidgetProps {
  currentDay: number;
  taxAlerts: TaxAlert[];
  treasury: number;
}

export function TaxAlertWidget({ currentDay, taxAlerts, treasury }: TaxAlertWidgetProps) {
  const alerts = taxAlerts.length > 0 ? taxAlerts : [
    { id: '1', type: 'tva' as const, name: 'TVA Trimestre', amount: 12500, dueDay: currentDay + 5, status: 'pending' as const },
    { id: '2', type: 'is' as const, name: 'Impôt Sociétés', amount: 25000, dueDay: currentDay + 15, status: 'pending' as const },
    { id: '3', type: 'cotisations' as const, name: 'Cotisations URSSAF', amount: 8500, dueDay: currentDay + 10, status: 'pending' as const },
  ];

  const totalDue = alerts.filter(a => a.status !== 'paid').reduce((sum, a) => sum + a.amount, 0);
  const canPayAll = treasury >= totalDue;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="w-3 h-3 text-success" />;
      case 'overdue': return <AlertTriangle className="w-3 h-3 text-destructive" />;
      default: return <Clock className="w-3 h-3 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'border-success/30 bg-success/10';
      case 'overdue': return 'border-destructive/30 bg-destructive/10';
      default: return 'border-warning/30 bg-warning/10';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tva': return 'TVA';
      case 'is': return 'IS';
      case 'cotisations': return 'URF';
      case 'cfe': return 'CFE';
      case 'cvae': return 'CVA';
      default: return 'TAX';
    }
  };

  return (
    <div className="space-y-2">
      {/* Summary */}
      <div className={cn(
        "flex items-center justify-between p-2 rounded-lg border",
        canPayAll ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10"
      )}>
        <div className="flex items-center gap-2">
          <Euro className={cn("w-4 h-4", canPayAll ? "text-success" : "text-destructive")} />
          <div>
            <div className="text-[10px] text-muted-foreground">Total à payer</div>
            <div className="text-xs font-bold">{formatCurrency(totalDue)}</div>
          </div>
        </div>
        <div className={cn(
          "text-[10px] px-2 py-0.5 rounded",
          canPayAll ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {canPayAll ? 'OK' : 'Insuffisant'}
        </div>
      </div>

      {/* Tax List */}
      <div className="space-y-1 max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={cn(
              "flex items-center gap-2 p-1.5 rounded border transition-all",
              getStatusColor(alert.status)
            )}
          >
            <div className="w-6 h-6 rounded bg-background/50 flex items-center justify-center">
              <span className="text-[8px] font-bold">{getTypeIcon(alert.type)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-medium truncate">{alert.name}</div>
              <div className="text-[9px] text-muted-foreground flex items-center gap-1">
                <Calendar className="w-2.5 h-2.5" />
                J+{alert.dueDay - currentDay}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold">{formatCurrency(alert.amount)}</div>
              {getStatusIcon(alert.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-success" />
          Payé
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-warning" />
          En attente
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          En retard
        </div>
      </div>
    </div>
  );
}
