import { useState } from "react";
import { Company, LegalStatus, Sector, LEGAL_STATUS_MODIFIERS } from "@/types/game";
import { LEGAL_STRUCTURES, LegalStructureType, LegalStructure } from "@/types/legalStructures";
import { formatCurrency, generateEmployee } from "@/utils/gameEngine";
import { createCompany } from "@/utils/companyFactory";
import { 
  Building2, Scale, Factory, Cpu, Wrench, HeadphonesIcon, Cog,
  MapPin, User, Target, Zap, Shield, TrendingUp, Globe, Briefcase,
  GraduationCap, Heart, Star, Coins, Clock, Trophy, Rocket, Crown,
  Lightbulb, Users, Handshake, Leaf, Flame, Sparkles, Gift, Building,
  Landmark, Home, ChevronDown, ChevronUp, Info, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanySetupProps {
  onComplete: (company: Company, settings: GameSettings) => void;
}

export interface GameSettings {
  difficulty: Difficulty;
  gameMode: GameMode;
  founderType: FounderType;
  location: Location;
  startingBonus: StartingBonus;
  objective: GameObjective;
  legalStructure: LegalStructureType;
}

type Difficulty = 'tutorial' | 'easy' | 'normal' | 'hard' | 'hardcore';
type GameMode = 'sandbox' | 'career' | 'challenge' | 'speedrun' | 'survival';
type FounderType = 'visionary' | 'manager' | 'technical' | 'commercial' | 'financier' | 'diplomat';
type Location = 'paris' | 'lyon' | 'marseille' | 'bordeaux' | 'lille' | 'nantes' | 'toulouse' | 'strasbourg';
type StartingBonus = 'none' | 'extra_cash' | 'skilled_team' | 'reputation' | 'technology' | 'contacts' | 'lucky';
type GameObjective = 'millionaire' | 'empire' | 'innovation' | 'social' | 'international' | 'legacy' | 'freedom';

// Simplified mapping for game mechanics (uses 3 basic statuses internally)
const legalStatusMapping: Record<LegalStructureType, LegalStatus> = {
  'auto_entrepreneur': 'auto-entrepreneur',
  'ei': 'auto-entrepreneur',
  'eirl': 'auto-entrepreneur',
  'eurl': 'sarl',
  'sarl': 'sarl',
  'sarl_famille': 'sarl',
  'sas': 'sas',
  'sasu': 'sas',
  'sa': 'sas',
  'snc': 'sarl',
  'scs': 'sarl',
  'sca': 'sas',
  'sel': 'sarl',
  'selarl': 'sarl',
  'selas': 'sas',
  'scop': 'sarl',
  'scic': 'sarl',
  'association': 'auto-entrepreneur',
  'association_rip': 'auto-entrepreneur',
  'fondation': 'sas',
  'mutuelle': 'sarl',
  'gie': 'sarl',
  'geie': 'sas',
  'sci': 'sarl',
  'scm': 'sarl',
  'scp': 'sarl',
  'holding': 'sas',
  'se': 'sas',
  'sne': 'sas',
};

// Group structures by category for better UX
const structuresByCategory = {
  individual: { label: 'Entreprises Individuelles', icon: User, structures: ['auto_entrepreneur', 'ei', 'eirl'] as LegalStructureType[] },
  commercial: { label: 'Sociétés Commerciales', icon: Building, structures: ['eurl', 'sarl', 'sarl_famille', 'sas', 'sasu', 'sa', 'snc', 'scs', 'sca'] as LegalStructureType[] },
  liberal: { label: 'Professions Libérales', icon: Briefcase, structures: ['sel', 'selarl', 'selas'] as LegalStructureType[] },
  social: { label: 'Économie Sociale', icon: Heart, structures: ['scop', 'scic', 'association', 'association_rip', 'fondation', 'mutuelle'] as LegalStructureType[] },
  civil: { label: 'Sociétés Civiles', icon: Home, structures: ['sci', 'scm', 'scp'] as LegalStructureType[] },
  special: { label: 'Formes Spéciales', icon: Globe, structures: ['gie', 'geie', 'holding', 'se', 'sne'] as LegalStructureType[] },
};

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
  { value: 'tech', label: "Tech", description: "Marges élevées, salaires hauts, clients volatils.", icon: Cpu },
  { value: 'artisanat', label: "Artisanat", description: "Marges faibles, clients fidèles, croissance lente.", icon: Wrench },
  { value: 'services', label: "Services", description: "Équilibré. Marges correctes, flexibilité moyenne.", icon: HeadphonesIcon },
  { value: 'industrie', label: "Industrie", description: "Investissements lourds, clients stables, marges correctes.", icon: Cog },
];

const difficultyOptions: { value: Difficulty; label: string; description: string; icon: typeof Shield; color: string }[] = [
  { value: 'tutorial', label: "Tutoriel", description: "Apprentissage guidé, erreurs pardonnées, conseils réguliers.", icon: GraduationCap, color: "text-blue-400" },
  { value: 'easy', label: "Facile", description: "Économie favorable, événements rares, marges confortables.", icon: Heart, color: "text-success" },
  { value: 'normal', label: "Normal", description: "Simulation réaliste du monde des affaires français.", icon: Shield, color: "text-amber-400" },
  { value: 'hard', label: "Difficile", description: "Économie instable, inspections fréquentes, marges serrées.", icon: Flame, color: "text-orange-500" },
  { value: 'hardcore', label: "Hardcore", description: "Aucune erreur tolérée. Un faux pas = faillite.", icon: Trophy, color: "text-destructive" },
];

const gameModeOptions: { value: GameMode; label: string; description: string; icon: typeof Rocket }[] = [
  { value: 'sandbox', label: "Bac à sable", description: "Liberté totale, pas d'objectifs imposés. Expérimentez !", icon: Sparkles },
  { value: 'career', label: "Carrière", description: "Progression structurée avec missions et récompenses.", icon: Briefcase },
  { value: 'challenge', label: "Défis", description: "Objectifs spécifiques avec contraintes de temps.", icon: Target },
  { value: 'speedrun', label: "Speedrun", description: "Atteignez le million le plus vite possible !", icon: Zap },
  { value: 'survival', label: "Survie", description: "Crises fréquentes, survivez le plus longtemps possible.", icon: Shield },
];

const founderOptions: { value: FounderType; label: string; description: string; bonus: string; icon: typeof User }[] = [
  { value: 'visionary', label: "Visionnaire", description: "Vous voyez au-delà du présent.", bonus: "+20% Innovation, -10% Gestion", icon: Lightbulb },
  { value: 'manager', label: "Gestionnaire", description: "L'organisation est votre force.", bonus: "+15% Productivité, +10% Moral équipe", icon: Users },
  { value: 'technical', label: "Technique", description: "Expert dans votre domaine.", bonus: "+25% R&D, -5% Commercial", icon: Cpu },
  { value: 'commercial', label: "Commercial", description: "La vente n'a pas de secrets pour vous.", bonus: "+20% Ventes, +15% Négociation", icon: Handshake },
  { value: 'financier', label: "Financier", description: "Les chiffres sont votre langage.", bonus: "+10% Marges, +15% Prêts bancaires", icon: TrendingUp },
  { value: 'diplomat', label: "Diplomate", description: "Vous gérez les relations avec aisance.", bonus: "+20% Réputation, +15% International", icon: Globe },
];

const locationOptions: { value: Location; label: string; description: string; bonus: string }[] = [
  { value: 'paris', label: "Paris", description: "Capitale économique, concurrence intense.", bonus: "+30% Revenus, +40% Coûts, +20% Visibilité" },
  { value: 'lyon', label: "Lyon", description: "Carrefour industriel et gastronomique.", bonus: "+15% Industrie, +10% Services, Coûts moyens" },
  { value: 'marseille', label: "Marseille", description: "Port méditerranéen, commerce international.", bonus: "+25% Import/Export, -10% Coûts" },
  { value: 'bordeaux', label: "Bordeaux", description: "Élégance et innovation.", bonus: "+15% Tech, +20% Artisanat, Bonne qualité de vie" },
  { value: 'lille', label: "Lille", description: "Proximité européenne, dynamisme nordiste.", bonus: "+20% Commerce européen, -15% Coûts" },
  { value: 'nantes', label: "Nantes", description: "Créativité et économie verte.", bonus: "+25% Innovation, +15% RSE" },
  { value: 'toulouse', label: "Toulouse", description: "Capitale aérospatiale et tech.", bonus: "+30% Tech/Industrie, Talents disponibles" },
  { value: 'strasbourg', label: "Strasbourg", description: "Porte de l'Europe.", bonus: "+30% International, +20% Institutions" },
];

const startingBonusOptions: { value: StartingBonus; label: string; description: string; effect: string; icon: typeof Gift }[] = [
  { value: 'none', label: "Aucun", description: "Partez de zéro, comme un vrai entrepreneur.", effect: "Pas de bonus", icon: Shield },
  { value: 'extra_cash', label: "Héritage", description: "Un oncle généreux vous a laissé un petit pécule.", effect: "+50 000€ de départ, +500 pièces", icon: Coins },
  { value: 'skilled_team', label: "Dream Team", description: "Vous démarrez avec une équipe expérimentée.", effect: "+3 employés qualifiés gratuits", icon: Users },
  { value: 'reputation', label: "Réputation", description: "Votre nom est déjà connu dans le milieu.", effect: "+30 Réputation, +20 Crédibilité", icon: Star },
  { value: 'technology', label: "Innovateur", description: "Vous avez déjà développé des technologies.", effect: "+3 technologies débloquées", icon: Cpu },
  { value: 'contacts', label: "Carnet d'adresses", description: "Vous connaissez les bonnes personnes.", effect: "+5 clients potentiels, Accès VIP banque", icon: Handshake },
  { value: 'lucky', label: "Chanceux", description: "La chance vous sourit souvent.", effect: "+15% chances événements positifs", icon: Sparkles },
];

const objectiveOptions: { value: GameObjective; label: string; description: string; target: string; icon: typeof Trophy }[] = [
  { value: 'millionaire', label: "Millionnaire", description: "Accumulez une fortune personnelle.", target: "Atteindre 1 000 000€ de trésorerie", icon: Coins },
  { value: 'empire', label: "Empire", description: "Construisez un conglomérat.", target: "100 employés, 10 filiales, 50% part de marché", icon: Crown },
  { value: 'innovation', label: "Pionnier", description: "Révolutionnez votre secteur.", target: "Débloquer toutes les technologies", icon: Lightbulb },
  { value: 'social', label: "Patron idéal", description: "Créez l'entreprise où tout le monde veut travailler.", target: "50 employés avec moral 90%+", icon: Heart },
  { value: 'international', label: "Mondial", description: "Conquérez le monde.", target: "Présence dans 20 pays", icon: Globe },
  { value: 'legacy', label: "Héritage", description: "Laissez une marque durable.", target: "50 achievements, 10 ans d'activité", icon: Trophy },
  { value: 'freedom', label: "Liberté", description: "Pas d'objectif, juste l'aventure.", target: "Jouez comme vous voulez !", icon: Rocket },
];

const TOTAL_STEPS = 8;

export function CompanySetup({ onComplete }: CompanySetupProps) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [legalStatus, setLegalStatus] = useState<LegalStatus | null>(null);
  const [selectedLegalStructure, setSelectedLegalStructure] = useState<LegalStructureType | null>(null);
  const [sector, setSector] = useState<Sector | null>(null);
  const [capital, setCapital] = useState(10000);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [gameMode, setGameMode] = useState<GameMode>('career');
  const [founderType, setFounderType] = useState<FounderType>('visionary');
  const [location, setLocation] = useState<Location>('paris');
  const [startingBonus, setStartingBonus] = useState<StartingBonus>('none');
  const [objective, setObjective] = useState<GameObjective>('millionaire');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('commercial');

  // Handle legal structure selection
  const handleSelectLegalStructure = (structureId: LegalStructureType) => {
    setSelectedLegalStructure(structureId);
    // Map to simplified legal status for game mechanics
    const mappedStatus = legalStatusMapping[structureId];
    setLegalStatus(mappedStatus);
  };

  const handleComplete = () => {
    if (!companyName || !legalStatus || !sector || !selectedLegalStructure) return;

    const statusMod = LEGAL_STATUS_MODIFIERS[legalStatus];
    const structure = LEGAL_STRUCTURES[selectedLegalStructure];
    let adjustedCapital = Math.max(capital, structure.capitalMin);
    
    // Apply starting bonus
    if (startingBonus === 'extra_cash') adjustedCapital += 50000;
    
    const company = createCompany(companyName, legalStatus, sector, adjustedCapital, 1);
    
    // Apply credibility bonus from legal structure
    company.credibility = 50 + structure.credibilityBonus;
    
    // Apply reputation bonus
    if (startingBonus === 'reputation') {
      company.reputation += 30;
      company.credibility += 20;
    }
    
    // Apply starting coins bonus
    if (startingBonus === 'extra_cash') {
      company.coins += 500;
    }
    
    // Add initial employee(s)
    const employeeCount = startingBonus === 'skilled_team' ? 4 : 1;
    company.employees = Array.from({ length: employeeCount }, () => generateEmployee(sector, 1));
    
    // Unlock technologies if tech bonus
    if (startingBonus === 'technology') {
      company.technologies = company.technologies.map((t, i) => 
        i < 3 ? { ...t, unlocked: true } : t
      );
    }

    const settings: GameSettings = {
      difficulty,
      gameMode,
      founderType,
      location,
      startingBonus,
      objective,
      legalStructure: selectedLegalStructure,
    };

    onComplete(company, settings);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1.5 mb-8">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all cursor-pointer",
            s === step ? "bg-primary scale-125" : s < step ? "bg-primary/50 hover:bg-primary/70" : "bg-muted"
          )}
          onClick={() => s < step && setStep(s)}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Simu'<span className="text-primary text-glow">Entrepreneur</span>
          </h1>
          <p className="text-muted-foreground">Le Défi Citoyen</p>
        </div>

        <div className="game-panel">
          {renderStepIndicator()}

          {/* Step 1: Difficulty */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Niveau de difficulté</h2>
                <p className="text-sm text-muted-foreground">Choisissez votre niveau de défi</p>
              </div>
              <div className="grid gap-3">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                      difficulty === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn("w-6 h-6 shrink-0", option.color)} />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="w-full btn-game-primary">
                Continuer
              </button>
            </div>
          )}

          {/* Step 2: Game Mode */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Mode de jeu</h2>
                <p className="text-sm text-muted-foreground">Comment voulez-vous jouer ?</p>
              </div>
              <div className="grid gap-3">
                {gameModeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setGameMode(option.value)}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border text-left transition-all",
                      gameMode === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn("w-6 h-6 shrink-0", gameMode === option.value ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <h3 className="font-display font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 btn-game-secondary">Retour</button>
                <button onClick={() => setStep(3)} className="flex-1 btn-game-primary">Continuer</button>
              </div>
            </div>
          )}

          {/* Step 3: Company Name */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Nom de votre entreprise</h2>
                <p className="text-sm text-muted-foreground">Choisissez un nom qui marquera les esprits</p>
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ma Super Entreprise"
                maxLength={50}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 btn-game-secondary">Retour</button>
                <button
                  onClick={() => companyName.trim() && setStep(4)}
                  disabled={!companyName.trim()}
                  className="flex-1 btn-game-primary disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Founder Type */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Profil du fondateur</h2>
                <p className="text-sm text-muted-foreground">Quel type d'entrepreneur êtes-vous ?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {founderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFounderType(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border text-center transition-all",
                      founderType === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn("w-8 h-8", founderType === option.value ? "text-primary" : "text-muted-foreground")} />
                    <h3 className="font-display font-semibold text-sm">{option.label}</h3>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                    <span className="text-xs text-primary">{option.bonus}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="flex-1 btn-game-secondary">Retour</button>
                <button onClick={() => setStep(5)} className="flex-1 btn-game-primary">Continuer</button>
              </div>
            </div>
          )}

          {/* Step 5: Legal Structure - Complete Selection */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Structure juridique</h2>
                <p className="text-sm text-muted-foreground">Choisissez parmi 30+ formes juridiques françaises</p>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                {Object.entries(structuresByCategory).map(([catKey, category]) => {
                  const CategoryIcon = category.icon;
                  const isExpanded = expandedCategory === catKey;
                  const hasSelectedStructure = category.structures.some(s => s === selectedLegalStructure);
                  
                  return (
                    <div key={catKey} className={cn(
                      "rounded-lg border transition-all",
                      hasSelectedStructure ? "border-primary bg-primary/5" : "border-border"
                    )}>
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                        className="w-full flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CategoryIcon className={cn("w-5 h-5", hasSelectedStructure ? "text-primary" : "text-muted-foreground")} />
                          <span className="font-semibold">{category.label}</span>
                          <span className="text-xs text-muted-foreground">({category.structures.length})</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-2">
                          {category.structures.map(structId => {
                            const structure = LEGAL_STRUCTURES[structId];
                            if (!structure) return null;
                            const isSelected = selectedLegalStructure === structId;
                            
                            return (
                              <button
                                key={structId}
                                onClick={() => handleSelectLegalStructure(structId)}
                                className={cn(
                                  "w-full flex flex-col p-3 rounded-lg border text-left transition-all",
                                  isSelected ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
                                )}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{structure.name}</span>
                                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                                  </div>
                                  <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    structure.credibilityBonus >= 15 ? "bg-success/20 text-success" :
                                    structure.credibilityBonus >= 5 ? "bg-info/20 text-info" :
                                    structure.credibilityBonus < 0 ? "bg-destructive/20 text-destructive" :
                                    "bg-muted text-muted-foreground"
                                  )}>
                                    {structure.credibilityBonus >= 0 ? '+' : ''}{structure.credibilityBonus} créd.
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{structure.description}</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="px-2 py-0.5 bg-secondary rounded">
                                    Capital min: {structure.capitalMin === 0 ? '0€' : formatCurrency(structure.capitalMin)}
                                  </span>
                                  <span className="px-2 py-0.5 bg-secondary rounded">
                                    Charges: {Math.round(structure.socialChargesRate * 100)}%
                                  </span>
                                  <span className={cn(
                                    "px-2 py-0.5 rounded",
                                    structure.limitedLiability ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                                  )}>
                                    {structure.limitedLiability ? 'Resp. limitée' : 'Resp. illimitée'}
                                  </span>
                                  {structure.canRaiseFunds && (
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">Levée de fonds</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected structure summary */}
              {selectedLegalStructure && LEGAL_STRUCTURES[selectedLegalStructure] && (
                <div className="bg-primary/10 border border-primary rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{LEGAL_STRUCTURES[selectedLegalStructure].fullName}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-muted-foreground">Impôt: </span>
                      <span className="font-medium">{LEGAL_STRUCTURES[selectedLegalStructure].taxRegime.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Social: </span>
                      <span className="font-medium">{LEGAL_STRUCTURES[selectedLegalStructure].socialRegime.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Complexité: </span>
                      <span className="font-medium">{LEGAL_STRUCTURES[selectedLegalStructure].governanceComplexity}/5</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {LEGAL_STRUCTURES[selectedLegalStructure].advantages.slice(0, 3).map((adv, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-success/20 text-success rounded">✓ {adv}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="flex-1 btn-game-secondary">Retour</button>
                <button
                  onClick={() => selectedLegalStructure && setStep(6)}
                  disabled={!selectedLegalStructure}
                  className="flex-1 btn-game-primary disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 6: Sector & Location */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Secteur & Localisation</h2>
                <p className="text-sm text-muted-foreground">Où et dans quel domaine allez-vous opérer ?</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Secteur d'activité
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {sectorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSector(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border text-center transition-all",
                        sector === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      )}
                    >
                      <option.icon className={cn("w-6 h-6", sector === option.value ? "text-primary" : "text-muted-foreground")} />
                      <h3 className="font-display font-semibold text-sm">{option.label}</h3>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Localisation du siège
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {locationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLocation(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all",
                        location === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      )}
                    >
                      <MapPin className={cn("w-4 h-4", location === option.value ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-semibold text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
                {location && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {locationOptions.find(l => l.value === location)?.bonus}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(5)} className="flex-1 btn-game-secondary">Retour</button>
                <button
                  onClick={() => sector && setStep(7)}
                  disabled={!sector}
                  className="flex-1 btn-game-primary disabled:opacity-50"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* Step 7: Starting Bonus & Objective */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Avantages & Objectif</h2>
                <p className="text-sm text-muted-foreground">Personnalisez votre départ et votre but</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4" /> Bonus de départ
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {startingBonusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStartingBonus(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-all",
                        startingBonus === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      )}
                    >
                      <option.icon className={cn("w-5 h-5", startingBonus === option.value ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-semibold text-xs">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.effect}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Objectif principal
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {objectiveOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setObjective(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-all",
                        objective === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      )}
                    >
                      <option.icon className={cn("w-5 h-5", objective === option.value ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-semibold text-xs">{option.label}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">{option.target}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(6)} className="flex-1 btn-game-secondary">Retour</button>
                <button onClick={() => setStep(8)} className="flex-1 btn-game-primary">Continuer</button>
              </div>
            </div>
          )}

          {/* Step 8: Capital & Summary */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-display font-semibold mb-2">Capital & Récapitulatif</h2>
                <p className="text-sm text-muted-foreground">Dernières vérifications avant le grand lancement</p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-4xl font-display font-bold text-primary">
                    {formatCurrency(capital + (startingBonus === 'extra_cash' ? 50000 : 0))}
                  </span>
                  {startingBonus === 'extra_cash' && (
                    <p className="text-xs text-success mt-1">+50 000€ bonus héritage inclus</p>
                  )}
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
                <h3 className="font-display font-semibold text-sm mb-3">Récapitulatif complet</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entreprise</span>
                    <span className="font-medium">{companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Difficulté</span>
                    <span className="font-medium">{difficultyOptions.find(o => o.value === difficulty)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mode</span>
                    <span className="font-medium">{gameModeOptions.find(o => o.value === gameMode)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fondateur</span>
                    <span className="font-medium">{founderOptions.find(o => o.value === founderType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-medium">{selectedLegalStructure ? LEGAL_STRUCTURES[selectedLegalStructure]?.name : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Secteur</span>
                    <span className="font-medium">{sector ? sectorOptions.find(o => o.value === sector)?.label : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Siège</span>
                    <span className="font-medium">{locationOptions.find(o => o.value === location)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bonus</span>
                    <span className="font-medium">{startingBonusOptions.find(o => o.value === startingBonus)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objectif</span>
                    <span className="font-medium">{objectiveOptions.find(o => o.value === objective)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capital</span>
                    <span className="font-medium text-primary">{formatCurrency(capital + (startingBonus === 'extra_cash' ? 50000 : 0))}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(7)} className="flex-1 btn-game-secondary">Retour</button>
                <button onClick={handleComplete} className="flex-1 btn-game-primary">
                  <Rocket className="w-4 h-4 mr-2 inline" />
                  Lancer l'entreprise !
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
