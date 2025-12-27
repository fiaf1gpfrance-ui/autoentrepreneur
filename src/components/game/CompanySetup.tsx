import { useState } from "react";
import { Company, LegalStatus, Sector, LEGAL_STATUS_MODIFIERS } from "@/types/game";
import { formatCurrency, generateEmployee } from "@/utils/gameEngine";
import { createCompany } from "@/utils/companyFactory";
import { Building2, Scale, Factory, Cpu, Wrench, HeadphonesIcon, Cog } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanySetupProps {
  onComplete: (company: Company) => void;
}

const legalStatusOptions: { value: LegalStatus; label: string; description: string; icon: typeof Building2 }[] = [
  {
    value: 'auto-entrepreneur',
    label: "Auto-Entrepreneur",
    description: "Simple et limité. Plafond CA: 77 700€. Charges simplifiées.",
    icon: Building2,
  },
  {
    value: 'sarl',
    label: "SARL",
    description: "Classique et équilibré. Responsabilité limitée. Fiscalité standard.",
    icon: Scale,
  },
  {
    value: 'sas',
    label: "SAS",
    description: "Flexible mais complexe. Idéal pour lever des fonds. +10 crédibilité.",
    icon: Factory,
  },
];

const sectorOptions: { value: Sector; label: string; description: string; icon: typeof Cpu }[] = [
  {
    value: 'tech',
    label: "Tech",
    description: "Marges élevées (+40%), salaires hauts (+50%), clients volatils.",
    icon: Cpu,
  },
  {
    value: 'artisanat',
    label: "Artisanat",
    description: "Marges faibles (-20%), clients fidèles (+40%), innovation lente.",
    icon: Wrench,
  },
  {
    value: 'services',
    label: "Services",
    description: "Équilibré. Marges correctes, flexibilité moyenne.",
    icon: HeadphonesIcon,
  },
  {
    value: 'industrie',
    label: "Industrie",
    description: "Marges standards, salaires corrects, clients stables (+20%).",
    icon: Cog,
  },
];

export function CompanySetup({ onComplete }: CompanySetupProps) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [legalStatus, setLegalStatus] = useState<LegalStatus | null>(null);
  const [sector, setSector] = useState<Sector | null>(null);
  const [capital, setCapital] = useState(10000);

  const handleComplete = () => {
    if (!companyName || !legalStatus || !sector) return;

    const statusMod = LEGAL_STATUS_MODIFIERS[legalStatus];
    const company = createCompany(companyName, legalStatus, sector, capital, 1);
    
    // Apply credibility bonus from legal status and add initial employee
    company.credibility = 50 + statusMod.credibilityBonus;
    company.employees = [generateEmployee(sector, 1)];

    onComplete(company);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Simu'<span className="text-primary text-glow">Entrepreneur</span>
          </h1>
          <p className="text-muted-foreground">Le Défi Citoyen</p>
        </div>

        <div className="game-panel">
          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  s === step ? "bg-primary scale-125" : s < step ? "bg-primary/50" : "bg-muted"
                )}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">
                  Nom de votre entreprise
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choisissez un nom qui marquera les esprits
                </p>
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ma Super Entreprise"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => companyName && setStep(2)}
                disabled={!companyName}
                className="w-full btn-game-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">
                  Statut juridique
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ce choix impacte votre fiscalité et votre crédibilité
                </p>
              </div>
              <div className="grid gap-3">
                {legalStatusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLegalStatus(option.value)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border text-left transition-all",
                      legalStatus === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn(
                      "w-6 h-6 shrink-0",
                      legalStatus === option.value ? "text-primary" : "text-muted-foreground"
                    )} />
                    <div>
                      <h3 className="font-display font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-game-secondary">
                  Retour
                </button>
                <button
                  onClick={() => legalStatus && setStep(3)}
                  disabled={!legalStatus}
                  className="flex-1 btn-game-primary disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">
                  Secteur d'activité
                </h2>
                <p className="text-sm text-muted-foreground">
                  Chaque secteur a ses avantages et défis uniques
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sectorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSector(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border text-center transition-all",
                      sector === option.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn(
                      "w-8 h-8",
                      sector === option.value ? "text-primary" : "text-muted-foreground"
                    )} />
                    <h3 className="font-display font-semibold">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 btn-game-secondary">
                  Retour
                </button>
                <button
                  onClick={() => sector && setStep(4)}
                  disabled={!sector}
                  className="flex-1 btn-game-primary disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">
                  Capital de départ
                </h2>
                <p className="text-sm text-muted-foreground">
                  Votre trésorerie initiale pour lancer l'aventure
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-display font-bold text-primary">
                    {formatCurrency(capital)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 000€</span>
                  <span>100 000€</span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <h3 className="font-display font-semibold text-sm mb-3">Récapitulatif</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entreprise</span>
                  <span className="font-medium">{companyName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Statut</span>
                  <span className="font-medium">
                    {legalStatusOptions.find(o => o.value === legalStatus)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Secteur</span>
                  <span className="font-medium">
                    {sectorOptions.find(o => o.value === sector)?.label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capital</span>
                  <span className="font-medium text-primary">{formatCurrency(capital)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 btn-game-secondary">
                  Retour
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 btn-game-primary"
                >
                  Lancer l'entreprise
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Simulation basée sur le système fiscal français 2024
        </p>
      </div>
    </div>
  );
}
