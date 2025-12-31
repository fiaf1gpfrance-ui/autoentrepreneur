import { useState } from "react";
import { Company, LegalStatus, Sector, LEGAL_STATUS_MODIFIERS } from "@/types/game";
import { LEGAL_STRUCTURES, LegalStructureType, LegalStructure } from "@/types/legalStructures";
import { 
  CompanyBranding, 
  CompanyValue, 
  COMPANY_VALUES, 
  OfficeChoice, 
  OFFICE_OPTIONS,
  CoFounder,
  COFOUNDER_TEMPLATES,
  BusinessPlan,
  RevenueModel,
  REVENUE_MODELS,
  GrowthStrategy,
  GROWTH_STRATEGIES,
  LOGO_OPTIONS,
  COLOR_OPTIONS,
} from "@/types/advancedCreation";
import {
  ManagementStyle,
  MANAGEMENT_STYLES,
  CultureType,
  CULTURE_TYPES,
  HRPolicy,
  HR_POLICIES,
  MarketingStrategy,
  MARKETING_STRATEGIES,
  SalesStrategy,
  SALES_STRATEGIES,
  QualityPolicy,
  QUALITY_POLICIES,
  EnvironmentalPolicy,
  ENVIRONMENTAL_POLICIES,
  TechStack,
  TECH_STACKS,
  RemotePolicy,
  REMOTE_POLICIES,
  InnovationStrategy,
  INNOVATION_STRATEGIES,
  OrgStructure,
  ORG_STRUCTURES,
  SalaryPolicy,
  SALARY_POLICIES,
  InternationalAmbition,
  INTERNATIONAL_AMBITIONS,
  FundingMode,
  FUNDING_MODES,
  PricingPosition,
  PRICING_POSITIONS,
  WorkSchedule,
  WORK_SCHEDULES,
  TargetCustomer,
  TARGET_CUSTOMERS,
  EMPLOYEE_PERKS,
  EXTENDED_VALUES,
} from "@/data/extendedCreationOptions";
import { formatCurrency, generateEmployee } from "@/utils/gameEngine";
import { createCompany } from "@/utils/companyFactory";
import { 
  Building2, Scale, Factory, Cpu, Wrench, HeadphonesIcon, Cog,
  MapPin, User, Target, Zap, Shield, TrendingUp, Globe, Briefcase,
  GraduationCap, Heart, Star, Coins, Clock, Trophy, Rocket, Crown,
  Lightbulb, Users, Handshake, Leaf, Flame, Sparkles, Gift, Building,
  Landmark, Home, ChevronDown, ChevronUp, Info, Check, Palette, FileText,
  PenTool, UserPlus, Percent, Settings, Megaphone, ShoppingCart, Award,
  Laptop, Wifi, Brain, Network, DollarSign, Earth, Banknote, Tag,
  CalendarDays, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  branding?: CompanyBranding;
  office?: OfficeChoice;
  coFounders?: CoFounder[];
  businessPlan?: BusinessPlan;
  // New advanced settings
  managementStyle?: ManagementStyle;
  cultureType?: CultureType;
  hrPolicy?: HRPolicy;
  marketingStrategy?: MarketingStrategy;
  salesStrategy?: SalesStrategy;
  qualityPolicy?: QualityPolicy;
  environmentalPolicy?: EnvironmentalPolicy;
  techStack?: TechStack;
  remotePolicy?: RemotePolicy;
  innovationStrategy?: InnovationStrategy;
  orgStructure?: OrgStructure;
  salaryPolicy?: SalaryPolicy;
  internationalAmbition?: InternationalAmbition;
  fundingMode?: FundingMode;
  pricingPosition?: PricingPosition;
}

type Difficulty = 'tutorial' | 'easy' | 'normal' | 'hard' | 'hardcore';
type GameMode = 'sandbox' | 'career' | 'challenge' | 'speedrun' | 'survival';
type FounderType = 'visionary' | 'manager' | 'technical' | 'commercial' | 'financier' | 'diplomat';
type Location = 'paris' | 'lyon' | 'marseille' | 'bordeaux' | 'lille' | 'nantes' | 'toulouse' | 'strasbourg';
type StartingBonus = 'none' | 'extra_cash' | 'skilled_team' | 'reputation' | 'technology' | 'contacts' | 'lucky';
type GameObjective = 'millionaire' | 'empire' | 'innovation' | 'social' | 'international' | 'legacy' | 'freedom';

// Simplified mapping for game mechanics
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

// Group structures by category
const structuresByCategory = {
  individual: { label: 'Entreprises Individuelles', icon: User, structures: ['auto_entrepreneur', 'ei', 'eirl'] as LegalStructureType[] },
  commercial: { label: 'Sociétés Commerciales', icon: Building, structures: ['eurl', 'sarl', 'sarl_famille', 'sas', 'sasu', 'sa', 'snc', 'scs', 'sca'] as LegalStructureType[] },
  liberal: { label: 'Professions Libérales', icon: Briefcase, structures: ['sel', 'selarl', 'selas'] as LegalStructureType[] },
  social: { label: 'Économie Sociale', icon: Heart, structures: ['scop', 'scic', 'association', 'association_rip', 'fondation', 'mutuelle'] as LegalStructureType[] },
  civil: { label: 'Sociétés Civiles', icon: Home, structures: ['sci', 'scm', 'scp'] as LegalStructureType[] },
  special: { label: 'Formes Spéciales', icon: Globe, structures: ['gie', 'geie', 'holding', 'se', 'sne'] as LegalStructureType[] },
};

const sectorOptions: { value: Sector; label: string; description: string; icon: typeof Cpu }[] = [
  { value: 'tech', label: "Tech", description: "Marges élevées, salaires hauts, clients volatils.", icon: Cpu },
  { value: 'artisanat', label: "Artisanat", description: "Marges faibles, clients fidèles, croissance lente.", icon: Wrench },
  { value: 'services', label: "Services", description: "Équilibré. Marges correctes, flexibilité moyenne.", icon: HeadphonesIcon },
  { value: 'industrie', label: "Industrie", description: "Investissements lourds, clients stables, marges correctes.", icon: Cog },
];

const difficultyOptions: { value: Difficulty; label: string; description: string; icon: typeof Shield; color: string }[] = [
  { value: 'tutorial', label: "Tutoriel", description: "Apprentissage guidé, erreurs pardonnées.", icon: GraduationCap, color: "text-blue-400" },
  { value: 'easy', label: "Facile", description: "Économie favorable, événements rares.", icon: Heart, color: "text-success" },
  { value: 'normal', label: "Normal", description: "Simulation réaliste.", icon: Shield, color: "text-amber-400" },
  { value: 'hard', label: "Difficile", description: "Économie instable, marges serrées.", icon: Flame, color: "text-orange-500" },
  { value: 'hardcore', label: "Hardcore", description: "Aucune erreur tolérée.", icon: Trophy, color: "text-destructive" },
];

const gameModeOptions: { value: GameMode; label: string; description: string; icon: typeof Rocket }[] = [
  { value: 'sandbox', label: "Bac à sable", description: "Liberté totale, expérimentez !", icon: Sparkles },
  { value: 'career', label: "Carrière", description: "Progression structurée.", icon: Briefcase },
  { value: 'challenge', label: "Défis", description: "Objectifs avec contraintes.", icon: Target },
  { value: 'speedrun', label: "Speedrun", description: "Atteignez le million vite !", icon: Zap },
  { value: 'survival', label: "Survie", description: "Crises fréquentes.", icon: Shield },
];

const founderOptions: { value: FounderType; label: string; description: string; bonus: string; icon: typeof User }[] = [
  { value: 'visionary', label: "Visionnaire", description: "Vous voyez au-delà.", bonus: "+20% Innovation", icon: Lightbulb },
  { value: 'manager', label: "Gestionnaire", description: "L'organisation est votre force.", bonus: "+15% Productivité", icon: Users },
  { value: 'technical', label: "Technique", description: "Expert dans votre domaine.", bonus: "+25% R&D", icon: Cpu },
  { value: 'commercial', label: "Commercial", description: "La vente n'a pas de secrets.", bonus: "+20% Ventes", icon: Handshake },
  { value: 'financier', label: "Financier", description: "Les chiffres sont votre langage.", bonus: "+10% Marges", icon: TrendingUp },
  { value: 'diplomat', label: "Diplomate", description: "Vous gérez les relations.", bonus: "+20% Réputation", icon: Globe },
];

const locationOptions: { value: Location; label: string; description: string; bonus: string }[] = [
  { value: 'paris', label: "Paris", description: "Capitale économique.", bonus: "+30% Revenus, +40% Coûts" },
  { value: 'lyon', label: "Lyon", description: "Carrefour industriel.", bonus: "+15% Industrie" },
  { value: 'marseille', label: "Marseille", description: "Port méditerranéen.", bonus: "+25% Import/Export" },
  { value: 'bordeaux', label: "Bordeaux", description: "Élégance et innovation.", bonus: "+15% Tech" },
  { value: 'lille', label: "Lille", description: "Proximité européenne.", bonus: "+20% Commerce EU" },
  { value: 'nantes', label: "Nantes", description: "Créativité et écologie.", bonus: "+25% Innovation" },
  { value: 'toulouse', label: "Toulouse", description: "Capitale aérospatiale.", bonus: "+30% Tech/Industrie" },
  { value: 'strasbourg', label: "Strasbourg", description: "Porte de l'Europe.", bonus: "+30% International" },
];

const startingBonusOptions: { value: StartingBonus; label: string; description: string; effect: string; icon: typeof Gift }[] = [
  { value: 'none', label: "Aucun", description: "Partez de zéro.", effect: "Pas de bonus", icon: Shield },
  { value: 'extra_cash', label: "Héritage", description: "Un oncle généreux.", effect: "+50 000€", icon: Coins },
  { value: 'skilled_team', label: "Dream Team", description: "Équipe expérimentée.", effect: "+3 employés", icon: Users },
  { value: 'reputation', label: "Réputation", description: "Nom déjà connu.", effect: "+30 Réputation", icon: Star },
  { value: 'technology', label: "Innovateur", description: "Technologies existantes.", effect: "+3 technologies", icon: Cpu },
  { value: 'contacts', label: "Carnet d'adresses", description: "Bonnes personnes.", effect: "+5 clients", icon: Handshake },
  { value: 'lucky', label: "Chanceux", description: "La chance vous sourit.", effect: "+15% événements positifs", icon: Sparkles },
];

const objectiveOptions: { value: GameObjective; label: string; description: string; target: string; icon: typeof Trophy }[] = [
  { value: 'millionaire', label: "Millionnaire", description: "Accumulez une fortune.", target: "1 000 000€", icon: Coins },
  { value: 'empire', label: "Empire", description: "Construisez un conglomérat.", target: "100 employés", icon: Crown },
  { value: 'innovation', label: "Pionnier", description: "Révolutionnez le secteur.", target: "Toutes les technologies", icon: Lightbulb },
  { value: 'social', label: "Patron idéal", description: "Entreprise où tous veulent travailler.", target: "Moral 90%+", icon: Heart },
  { value: 'international', label: "Mondial", description: "Conquérez le monde.", target: "20 pays", icon: Globe },
  { value: 'legacy', label: "Héritage", description: "Laissez une marque.", target: "50 achievements", icon: Trophy },
  { value: 'freedom', label: "Liberté", description: "Pas d'objectif.", target: "Jouez libre !", icon: Rocket },
];

const TOTAL_STEPS = 18;

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
  
  // New advanced options
  const [managementStyle, setManagementStyle] = useState<ManagementStyle>('participatif');
  const [cultureType, setCultureType] = useState<CultureType>('startup');
  const [hrPolicy, setHrPolicy] = useState<HRPolicy>('work_life_balance');
  const [marketingStrategy, setMarketingStrategy] = useState<MarketingStrategy>('inbound');
  const [salesStrategy, setSalesStrategy] = useState<SalesStrategy>('direct');
  const [qualityPolicy, setQualityPolicy] = useState<QualityPolicy>('agile_quality');
  const [environmentalPolicy, setEnvironmentalPolicy] = useState<EnvironmentalPolicy>('eco_friendly');
  const [techStack, setTechStack] = useState<TechStack>('modern');
  const [remotePolicy, setRemotePolicy] = useState<RemotePolicy>('hybrid_flexible');
  const [innovationStrategy, setInnovationStrategy] = useState<InnovationStrategy>('r_and_d');
  const [orgStructure, setOrgStructure] = useState<OrgStructure>('flat');
  const [salaryPolicy, setSalaryPolicy] = useState<SalaryPolicy>('market_rate');
  const [internationalAmbition, setInternationalAmbition] = useState<InternationalAmbition>('national');
  const [fundingMode, setFundingMode] = useState<FundingMode>('bootstrapped');
  const [pricingPosition, setPricingPosition] = useState<PricingPosition>('value');

  const handleSelectLegalStructure = (structureId: LegalStructureType) => {
    setSelectedLegalStructure(structureId);
    const mappedStatus = legalStatusMapping[structureId];
    setLegalStatus(mappedStatus);
  };

  const handleComplete = () => {
    if (!companyName || !legalStatus || !sector || !selectedLegalStructure) return;

    const structure = LEGAL_STRUCTURES[selectedLegalStructure];
    let adjustedCapital = Math.max(capital, structure.capitalMin);
    
    if (startingBonus === 'extra_cash') adjustedCapital += 50000;
    
    const company = createCompany(companyName, legalStatus, sector, adjustedCapital, 1);
    
    company.credibility = 50 + structure.credibilityBonus;
    
    if (startingBonus === 'reputation') {
      company.reputation += 30;
      company.credibility += 20;
    }
    
    if (startingBonus === 'extra_cash') {
      company.coins += 500;
    }
    
    const employeeCount = startingBonus === 'skilled_team' ? 4 : 1;
    company.employees = Array.from({ length: employeeCount }, () => generateEmployee(sector, 1));
    
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
      managementStyle,
      cultureType,
      hrPolicy,
      marketingStrategy,
      salesStrategy,
      qualityPolicy,
      environmentalPolicy,
      techStack,
      remotePolicy,
      innovationStrategy,
      orgStructure,
      salaryPolicy,
      internationalAmbition,
      fundingMode,
      pricingPosition,
    };

    onComplete(company, settings);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-6 flex-wrap">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
        <div
          key={s}
          className={cn(
            "w-2 h-2 rounded-full transition-all cursor-pointer",
            s === step ? "bg-primary scale-125" : s < step ? "bg-primary/50 hover:bg-primary/70" : "bg-muted"
          )}
          onClick={() => s < step && setStep(s)}
          title={`Étape ${s}`}
        />
      ))}
    </div>
  );

  const renderOptionGrid = <T extends string>(
    options: { value: T; label: string; description?: string; bonus?: string; icon?: typeof User }[],
    selected: T,
    onSelect: (value: T) => void,
    cols: number = 2
  ) => (
    <div className={cn("grid gap-2", cols === 2 ? "grid-cols-2" : cols === 3 ? "grid-cols-3" : "grid-cols-4")}>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border text-center transition-all",
              selected === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            )}
          >
            {Icon && <Icon className={cn("w-5 h-5", selected === option.value ? "text-primary" : "text-muted-foreground")} />}
            <span className="font-semibold text-xs">{option.label}</span>
            {option.description && <span className="text-xs text-muted-foreground line-clamp-2">{option.description}</span>}
            {option.bonus && <span className="text-xs text-primary">{option.bonus}</span>}
          </button>
        );
      })}
    </div>
  );

  const renderAdvancedOptionGrid = <T extends string>(
    options: Record<T, { label: string; description: string }>,
    selected: T,
    onSelect: (value: T) => void,
    icon: typeof User
  ) => {
    const Icon = icon;
    return (
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(options) as [T, { label: string; description: string }][]).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "flex flex-col items-start gap-1 p-3 rounded-lg border text-left transition-all",
              selected === key ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            )}
          >
            <div className="flex items-center gap-2">
              <Icon className={cn("w-4 h-4", selected === key ? "text-primary" : "text-muted-foreground")} />
              <span className="font-semibold text-xs">{value.label}</span>
            </div>
            <span className="text-xs text-muted-foreground line-clamp-2">{value.description}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">
            Simu'<span className="text-primary text-glow">Entrepreneur</span>
          </h1>
          <p className="text-muted-foreground text-sm">Le Défi Citoyen</p>
        </div>

        <div className="game-panel max-h-[75vh] overflow-hidden flex flex-col">
          {renderStepIndicator()}
          
          <ScrollArea className="flex-1 pr-2">
            <div className="space-y-4 pb-4">

          {/* Step 1: Difficulty */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Niveau de difficulté</h2>
                <p className="text-xs text-muted-foreground">Choisissez votre niveau de défi</p>
              </div>
              <div className="grid gap-2">
                {difficultyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDifficulty(option.value)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border text-left transition-all",
                      difficulty === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn("w-5 h-5 shrink-0", option.color)} />
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-sm">{option.label}</h3>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Game Mode */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Mode de jeu</h2>
                <p className="text-xs text-muted-foreground">Comment voulez-vous jouer ?</p>
              </div>
              {renderOptionGrid(gameModeOptions, gameMode, (v) => setGameMode(v as GameMode))}
            </div>
          )}

          {/* Step 3: Company Name */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Nom de votre entreprise</h2>
                <p className="text-xs text-muted-foreground">Choisissez un nom qui marquera les esprits</p>
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ma Super Entreprise"
                maxLength={50}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Step 4: Founder Type */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Profil du fondateur</h2>
                <p className="text-xs text-muted-foreground">Quel type d'entrepreneur êtes-vous ?</p>
              </div>
              {renderOptionGrid(founderOptions, founderType, (v) => setFounderType(v as FounderType))}
            </div>
          )}

          {/* Step 5: Legal Structure */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Structure juridique</h2>
                <p className="text-xs text-muted-foreground">Choisissez parmi 30+ formes juridiques</p>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
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
                        className="w-full flex items-center justify-between p-2 hover:bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon className={cn("w-4 h-4", hasSelectedStructure ? "text-primary" : "text-muted-foreground")} />
                          <span className="font-semibold text-sm">{category.label}</span>
                          <span className="text-xs text-muted-foreground">({category.structures.length})</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-2 pb-2 space-y-1">
                          {category.structures.map(structId => {
                            const structure = LEGAL_STRUCTURES[structId];
                            if (!structure) return null;
                            const isSelected = selectedLegalStructure === structId;
                            
                            return (
                              <button
                                key={structId}
                                onClick={() => handleSelectLegalStructure(structId)}
                                className={cn(
                                  "w-full flex flex-col p-2 rounded-lg border text-left transition-all",
                                  isSelected ? "border-primary bg-primary/10" : "border-border/50 hover:border-primary/50"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-xs">{structure.name}</span>
                                  {isSelected && <Check className="w-3 h-3 text-primary" />}
                                </div>
                                <p className="text-xs text-muted-foreground">{structure.description}</p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 6: Sector & Location */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Secteur & Localisation</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2 flex items-center gap-2">
                  <Briefcase className="w-3 h-3" /> Secteur d'activité
                </h3>
                {renderOptionGrid(sectorOptions, sector || 'tech', (v) => setSector(v as Sector))}
              </div>

              <div>
                <h3 className="font-semibold text-xs mb-2 flex items-center gap-2">
                  <MapPin className="w-3 h-3" /> Siège social
                </h3>
                <div className="grid grid-cols-4 gap-1">
                  {locationOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setLocation(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all",
                        location === option.value ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                      )}
                    >
                      <MapPin className={cn("w-3 h-3", location === option.value ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-semibold text-xs">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Starting Bonus & Objective */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Avantages & Objectif</h2>
              </div>

              <div>
                <h3 className="font-semibold text-xs mb-2"><Gift className="w-3 h-3 inline mr-1" />Bonus de départ</h3>
                {renderOptionGrid(startingBonusOptions, startingBonus, (v) => setStartingBonus(v as StartingBonus))}
              </div>

              <div>
                <h3 className="font-semibold text-xs mb-2"><Target className="w-3 h-3 inline mr-1" />Objectif</h3>
                {renderOptionGrid(objectiveOptions, objective, (v) => setObjective(v as GameObjective))}
              </div>
            </div>
          )}

          {/* Step 8: Management Style */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Style de Management</h2>
                <p className="text-xs text-muted-foreground">Comment allez-vous diriger votre équipe ?</p>
              </div>
              {renderAdvancedOptionGrid(MANAGEMENT_STYLES, managementStyle, setManagementStyle, Users)}
            </div>
          )}

          {/* Step 9: Company Culture */}
          {step === 9 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Culture d'Entreprise</h2>
                <p className="text-xs text-muted-foreground">Quelle ambiance voulez-vous créer ?</p>
              </div>
              {renderAdvancedOptionGrid(CULTURE_TYPES, cultureType, setCultureType, Heart)}
            </div>
          )}

          {/* Step 10: HR Policy */}
          {step === 10 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Politique RH</h2>
                <p className="text-xs text-muted-foreground">Comment attirer et retenir les talents ?</p>
              </div>
              {renderAdvancedOptionGrid(HR_POLICIES, hrPolicy, setHrPolicy, UserCheck)}
            </div>
          )}

          {/* Step 11: Marketing Strategy */}
          {step === 11 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Stratégie Marketing</h2>
                <p className="text-xs text-muted-foreground">Comment allez-vous vous faire connaître ?</p>
              </div>
              {renderAdvancedOptionGrid(MARKETING_STRATEGIES, marketingStrategy, setMarketingStrategy, Megaphone)}
            </div>
          )}

          {/* Step 12: Sales Strategy */}
          {step === 12 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Stratégie Commerciale</h2>
                <p className="text-xs text-muted-foreground">Comment allez-vous vendre ?</p>
              </div>
              {renderAdvancedOptionGrid(SALES_STRATEGIES, salesStrategy, setSalesStrategy, ShoppingCart)}
            </div>
          )}

          {/* Step 13: Tech & Remote */}
          {step === 13 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Technologie & Télétravail</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Laptop className="w-3 h-3 inline mr-1" />Stack Technologique</h3>
                {renderAdvancedOptionGrid(TECH_STACKS, techStack, setTechStack, Laptop)}
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Wifi className="w-3 h-3 inline mr-1" />Politique Télétravail</h3>
                {renderAdvancedOptionGrid(REMOTE_POLICIES, remotePolicy, setRemotePolicy, Wifi)}
              </div>
            </div>
          )}

          {/* Step 14: Quality & Environment */}
          {step === 14 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Qualité & Environnement</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Award className="w-3 h-3 inline mr-1" />Politique Qualité</h3>
                {renderAdvancedOptionGrid(QUALITY_POLICIES, qualityPolicy, setQualityPolicy, Award)}
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Leaf className="w-3 h-3 inline mr-1" />Politique Environnementale</h3>
                {renderAdvancedOptionGrid(ENVIRONMENTAL_POLICIES, environmentalPolicy, setEnvironmentalPolicy, Leaf)}
              </div>
            </div>
          )}

          {/* Step 15: Innovation & Organization */}
          {step === 15 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Innovation & Organisation</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Brain className="w-3 h-3 inline mr-1" />Stratégie d'Innovation</h3>
                {renderAdvancedOptionGrid(INNOVATION_STRATEGIES, innovationStrategy, setInnovationStrategy, Brain)}
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Network className="w-3 h-3 inline mr-1" />Structure Organisationnelle</h3>
                {renderAdvancedOptionGrid(ORG_STRUCTURES, orgStructure, setOrgStructure, Network)}
              </div>
            </div>
          )}

          {/* Step 16: Salary & Pricing */}
          {step === 16 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Salaires & Pricing</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><DollarSign className="w-3 h-3 inline mr-1" />Politique Salariale</h3>
                {renderAdvancedOptionGrid(SALARY_POLICIES, salaryPolicy, setSalaryPolicy, DollarSign)}
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Tag className="w-3 h-3 inline mr-1" />Positionnement Prix</h3>
                {renderAdvancedOptionGrid(PRICING_POSITIONS, pricingPosition, setPricingPosition, Tag)}
              </div>
            </div>
          )}

          {/* Step 17: International & Funding */}
          {step === 17 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">International & Financement</h2>
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Earth className="w-3 h-3 inline mr-1" />Ambition Internationale</h3>
                {renderAdvancedOptionGrid(INTERNATIONAL_AMBITIONS, internationalAmbition, setInternationalAmbition, Earth)}
              </div>
              
              <div>
                <h3 className="font-semibold text-xs mb-2"><Banknote className="w-3 h-3 inline mr-1" />Mode de Financement</h3>
                {renderAdvancedOptionGrid(FUNDING_MODES, fundingMode, setFundingMode, Banknote)}
              </div>
            </div>
          )}

          {/* Step 18: Capital & Summary */}
          {step === 18 && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-display font-semibold mb-1">Capital & Récapitulatif</h2>
              </div>

              <div className="space-y-3">
                <div className="text-center">
                  <span className="text-3xl font-display font-bold text-primary">
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
              <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
                <h3 className="font-display font-semibold text-xs mb-2">Récapitulatif</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Entreprise</span>
                    <span className="font-medium truncate ml-2">{companyName || '-'}</span>
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
                    <span className="text-muted-foreground">Secteur</span>
                    <span className="font-medium">{sector ? sectorOptions.find(o => o.value === sector)?.label : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Siège</span>
                    <span className="font-medium">{locationOptions.find(o => o.value === location)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Management</span>
                    <span className="font-medium">{MANAGEMENT_STYLES[managementStyle]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Culture</span>
                    <span className="font-medium">{CULTURE_TYPES[cultureType]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Télétravail</span>
                    <span className="font-medium">{REMOTE_POLICIES[remotePolicy]?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">International</span>
                    <span className="font-medium">{INTERNATIONAL_AMBITIONS[internationalAmbition]?.label}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
            </div>
          </ScrollArea>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 btn-game-secondary">
                Retour
              </button>
            )}
            {step < TOTAL_STEPS ? (
              <button
                onClick={() => {
                  if (step === 3 && !companyName.trim()) return;
                  if (step === 5 && !selectedLegalStructure) return;
                  if (step === 6 && !sector) return;
                  setStep(step + 1);
                }}
                disabled={(step === 3 && !companyName.trim()) || (step === 5 && !selectedLegalStructure) || (step === 6 && !sector)}
                className="flex-1 btn-game-primary disabled:opacity-50"
              >
                Continuer
              </button>
            ) : (
              <button onClick={handleComplete} className="flex-1 btn-game-primary">
                <Rocket className="w-4 h-4 mr-2 inline" />
                Lancer l'entreprise !
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Simulation basée sur le système fiscal français 2024 • 18 étapes • 300+ options
        </p>
      </div>
    </div>
  );
}
