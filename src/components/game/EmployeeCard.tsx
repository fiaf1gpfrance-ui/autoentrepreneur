import { Employee } from "@/types/game";
import { calculateSuperBrut, calculateNetSalary, formatCurrency, getMoralColor } from "@/utils/gameEngine";
import { GaugeBar } from "./GaugeBar";
import { User, Briefcase, Heart, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  employee: Employee;
  onFire?: (id: string) => void;
}

const traitLabels: Record<string, { label: string; color: string }> = {
  syndicaliste: { label: "Syndicaliste", color: "bg-destructive/20 text-destructive" },
  workaholic: { label: "Workaholic", color: "bg-success/20 text-success" },
  creatif: { label: "Créatif", color: "bg-purple-500/20 text-purple-400" },
  rigoureux: { label: "Rigoureux", color: "bg-primary/20 text-primary" },
  leader: { label: "Leader", color: "bg-warning/20 text-warning" },
  discret: { label: "Discret", color: "bg-muted text-muted-foreground" },
};

const contractLabels: Record<string, string> = {
  cdi: "CDI",
  cdd: "CDD",
  alternance: "Alternance",
};

export function EmployeeCard({ employee, onFire }: EmployeeCardProps) {
  const superBrut = calculateSuperBrut(employee.brutSalary);
  const netSalary = calculateNetSalary(employee.brutSalary);
  const trait = traitLabels[employee.trait] || { label: employee.trait || "Standard", color: "bg-muted text-muted-foreground" };

  return (
    <div className="game-panel space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm">{employee.name}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {employee.role}
            </p>
          </div>
        </div>
        <span className={cn("text-xs px-2 py-1 rounded-full", trait.color)}>
          {trait.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-muted-foreground">Contrat</span>
          <p className="font-medium">{contractLabels[employee.contractType]}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Coût total</span>
          <p className="font-medium text-destructive">{formatCurrency(superBrut)}/mois</p>
        </div>
        <div>
          <span className="text-muted-foreground">Brut</span>
          <p className="font-medium">{formatCurrency(employee.brutSalary)}</p>
        </div>
        <div>
          <span className="text-muted-foreground">Net</span>
          <p className="font-medium text-success">{formatCurrency(netSalary)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <GaugeBar 
          value={employee.skills} 
          label="Compétences" 
          colorClass="bg-primary"
        />
        <GaugeBar 
          value={employee.moral} 
          label="Moral" 
          colorClass={employee.moral >= 70 ? "bg-success" : employee.moral >= 40 ? "bg-warning" : "bg-destructive"}
        />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Productivité
          </span>
          <span className={cn(
            "font-medium",
            employee.productivity >= 100 ? "text-success" : "text-warning"
          )}>
            {Math.round(employee.productivity)}%
          </span>
        </div>
      </div>

      {onFire && (
        <button
          onClick={() => onFire(employee.id)}
          className="w-full btn-game-destructive text-xs py-1.5"
        >
          Licencier
        </button>
      )}
    </div>
  );
}
