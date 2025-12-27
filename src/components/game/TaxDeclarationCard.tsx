import { TaxDeclaration } from "@/types/game";
import { formatCurrency } from "@/utils/gameEngine";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaxDeclarationCardProps {
  declaration: TaxDeclaration;
  currentDay: number;
  onPay: (declaration: TaxDeclaration) => void;
}

const taxLabels = {
  tva: "TVA",
  urssaf: "URSSAF",
  is: "Impôt sur les Sociétés",
};

export function TaxDeclarationCard({ declaration, currentDay, onPay }: TaxDeclarationCardProps) {
  const isOverdue = !declaration.paid && currentDay > declaration.dueDate;
  const daysUntilDue = declaration.dueDate - currentDay;
  const totalAmount = declaration.amount + (declaration.penalty || 0);

  return (
    <div className={cn(
      "game-panel space-y-3",
      isOverdue && "border-destructive/50",
      declaration.paid && "opacity-60"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            declaration.paid ? "bg-success/20" : isOverdue ? "bg-destructive/20" : "bg-secondary"
          )}>
            {declaration.paid ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : isOverdue ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <FileText className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm">
              {taxLabels[declaration.type]}
            </h4>
            {declaration.paid ? (
              <p className="text-xs text-success">Payée</p>
            ) : isOverdue ? (
              <p className="text-xs text-destructive">
                En retard de {-daysUntilDue} jour(s)
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Échéance dans {daysUntilDue} jour(s)
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Montant dû</span>
          <span className="font-medium">{formatCurrency(declaration.amount)}</span>
        </div>
        {declaration.penalty && declaration.penalty > 0 && (
          <div className="flex justify-between text-destructive">
            <span>Pénalités</span>
            <span className="font-medium">+{formatCurrency(declaration.penalty)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-border pt-1 mt-1">
          <span className="font-medium">Total</span>
          <span className={cn(
            "font-bold",
            isOverdue ? "text-destructive" : "text-foreground"
          )}>
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {!declaration.paid && (
        <button
          onClick={() => onPay(declaration)}
          className={cn(
            "w-full text-xs py-1.5",
            isOverdue ? "btn-game-destructive" : "btn-game-primary"
          )}
        >
          Payer {formatCurrency(totalAmount)}
        </button>
      )}
    </div>
  );
}
