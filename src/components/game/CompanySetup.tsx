import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// New modular components
import { SetupBackground } from "./setup/SetupBackground";
import { StepIndicator } from "./setup/SetupCarousel";
import { OptionCard, OptionListItem } from "./setup/OptionCard";
import { StepHeader } from "./setup/StepHeader";
import { NavigationButtons } from "./setup/NavigationButtons";

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

const sectorOptions = [
  { value: 'tech' as Sector, label: "Tech", description: "Marges élevées, salaires hauts, clients volatils.", icon: Cpu },
  { value: 'artisanat' as Sector, label: "Artisanat", description: "Marges faibles, clients fidèles, croissance lente.", icon: Wrench },
  { value: 'services' as Sector, label: "Services", description: "Équilibré. Marges correctes, flexibilité moyenne.", icon: HeadphonesIcon },
  { value: 'industrie' as Sector, label: "Industrie", description: "Investissements lourds, clients stables, marges correctes.", icon: Cog },
];

const difficultyOptions = [
  { value: 'tutorial' as Difficulty, label: "Tutoriel", description: "Apprentissage guidé, erreurs pardonnées.", icon: GraduationCap, color: "text-blue-400" },
  { value: 'easy' as Difficulty, label: "Facile", description: "Économie favorable, événements rares.", icon: Heart, color: "text-success" },
  { value: 'normal' as Difficulty, label: "Normal", description: "Simulation réaliste.", icon: Shield, color: "text-amber-400" },
  { value: 'hard' as Difficulty, label: "Difficile", description: "Économie instable, marges serrées.", icon: Flame, color: "text-orange-500" },
  { value: 'hardcore' as Difficulty, label: "Hardcore", description: "Aucune erreur tolérée.", icon: Trophy, color: "text-destructive" },
];

const gameModeOptions = [
  { value: 'sandbox' as GameMode, label: "Bac à sable", description: "Liberté totale, expérimentez !", icon: Sparkles },
  { value: 'career' as GameMode, label: "Carrière", description: "Progression structurée.", icon: Briefcase },
  { value: 'challenge' as GameMode, label: "Défis", description: "Objectifs avec contraintes.", icon: Target },
  { value: 'speedrun' as GameMode, label: "Speedrun", description: "Atteignez le million vite !", icon: Zap },
  { value: 'survival' as GameMode, label: "Survie", description: "Crises fréquentes.", icon: Shield },
];

const founderOptions = [
  { value: 'visionary' as FounderType, label: "Visionnaire", description: "Vous voyez au-delà.", bonus: "+20% Innovation", icon: Lightbulb },
  { value: 'manager' as FounderType, label: "Gestionnaire", description: "L'organisation est votre force.", bonus: "+15% Productivité", icon: Users },
  { value: 'technical' as FounderType, label: "Technique", description: "Expert dans votre domaine.", bonus: "+25% R&D", icon: Cpu },
  { value: 'commercial' as FounderType, label: "Commercial", description: "La vente n'a pas de secrets.", bonus: "+20% Ventes", icon: Handshake },
  { value: 'financier' as FounderType, label: "Financier", description: "Les chiffres sont votre langage.", bonus: "+10% Marges", icon: TrendingUp },
  { value: 'diplomat' as FounderType, label: "Diplomate", description: "Vous gérez les relations.", bonus: "+20% Réputation", icon: Globe },
];

const locationOptions = [
  { value: 'paris' as Location, label: "Paris", description: "Capitale économique.", bonus: "+30% Revenus, +40% Coûts", icon: MapPin },
  { value: 'lyon' as Location, label: "Lyon", description: "Carrefour industriel.", bonus: "+15% Industrie", icon: MapPin },
  { value: 'marseille' as Location, label: "Marseille", description: "Port méditerranéen.", bonus: "+25% Import/Export", icon: MapPin },
  { value: 'bordeaux' as Location, label: "Bordeaux", description: "Élégance et innovation.", bonus: "+15% Tech", icon: MapPin },
  { value: 'lille' as Location, label: "Lille", description: "Proximité européenne.", bonus: "+20% Commerce EU", icon: MapPin },
  { value: 'nantes' as Location, label: "Nantes", description: "Créativité et écologie.", bonus: "+25% Innovation", icon: MapPin },
  { value: 'toulouse' as Location, label: "Toulouse", description: "Capitale aérospatiale.", bonus: "+30% Tech/Industrie", icon: MapPin },
  { value: 'strasbourg' as Location, label: "Strasbourg", description: "Porte de l'Europe.", bonus: "+30% International", icon: MapPin },
];

const startingBonusOptions = [
  { value: 'none' as StartingBonus, label: "Aucun", description: "Partez de zéro.", effect: "Pas de bonus", icon: Shield },
  { value: 'extra_cash' as StartingBonus, label: "Héritage", description: "Un oncle généreux.", effect: "+50 000€", icon: Coins },
  { value: 'skilled_team' as StartingBonus, label: "Dream Team", description: "Équipe expérimentée.", effect: "+3 employés", icon: Users },
  { value: 'reputation' as StartingBonus, label: "Réputation", description: "Nom déjà connu.", effect: "+30 Réputation", icon: Star },
  { value: 'technology' as StartingBonus, label: "Innovateur", description: "Technologies existantes.", effect: "+3 technologies", icon: Cpu },
  { value: 'contacts' as StartingBonus, label: "Carnet d'adresses", description: "Bonnes personnes.", effect: "+5 clients", icon: Handshake },
  { value: 'lucky' as StartingBonus, label: "Chanceux", description: "La chance vous sourit.", effect: "+15% événements positifs", icon: Sparkles },
];

const objectiveOptions = [
  { value: 'millionaire' as GameObjective, label: "Millionnaire", description: "Accumulez une fortune.", target: "1 000 000€", icon: Coins },
  { value: 'empire' as GameObjective, label: "Empire", description: "Construisez un conglomérat.", target: "100 employés", icon: Crown },
  { value: 'innovation' as GameObjective, label: "Pionnier", description: "Révolutionnez le secteur.", target: "Toutes les technologies", icon: Lightbulb },
  { value: 'social' as GameObjective, label: "Patron idéal", description: "Entreprise où tous veulent travailler.", target: "Moral 90%+", icon: Heart },
  { value: 'international' as GameObjective, label: "Mondial", description: "Conquérez le monde.", target: "20 pays", icon: Globe },
  { value: 'legacy' as GameObjective, label: "Héritage", description: "Laissez une marque.", target: "50 achievements", icon: Trophy },
  { value: 'freedom' as GameObjective, label: "Liberté", description: "Pas d'objectif.", target: "Jouez libre !", icon: Rocket },
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
  
  // Advanced options
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

  const canProgress = (): boolean => {
    if (step === 3 && !companyName.trim()) return false;
    if (step === 5 && !selectedLegalStructure) return false;
    if (step === 6 && !sector) return false;
    return true;
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

  const renderAdvancedOptions = <T extends string>(
    options: Record<T, { label: string; description: string }>,
    selected: T,
    onSelect: (value: T) => void,
    icon: typeof User
  ) => {
    const Icon = icon;
    const entries = Object.entries(options) as [T, { label: string; description: string }][];
    return (
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([key, value], index) => (
          <OptionCard
            key={key}
            value={key}
            label={value.label}
            description={value.description}
            icon={Icon}
            isSelected={selected === key}
            onClick={() => onSelect(key)}
            index={index}
          />
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    const animationProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div key={step} {...animationProps} className="space-y-6">
          {/* Step 1: Difficulty */}
          {step === 1 && (
            <>
              <StepHeader icon={Shield} title="Niveau de difficulté" subtitle="Choisissez votre niveau de défi" step={step} totalSteps={TOTAL_STEPS} />
              <div className="grid grid-cols-1 gap-3">
                {difficultyOptions.map((option, index) => (
                  <OptionCard
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    icon={option.icon}
                    isSelected={difficulty === option.value}
                    onClick={() => setDifficulty(option.value)}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 2: Game Mode */}
          {step === 2 && (
            <>
              <StepHeader icon={Rocket} title="Mode de jeu" subtitle="Comment voulez-vous jouer ?" step={step} totalSteps={TOTAL_STEPS} />
              <div className="grid grid-cols-2 gap-3">
                {gameModeOptions.map((option, index) => (
                  <OptionCard
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    icon={option.icon}
                    isSelected={gameMode === option.value}
                    onClick={() => setGameMode(option.value)}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 3: Company Name */}
          {step === 3 && (
            <>
              <StepHeader icon={Building2} title="Nom de votre entreprise" subtitle="Choisissez un nom qui marquera les esprits" step={step} totalSteps={TOTAL_STEPS} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ma Super Entreprise"
                  maxLength={50}
                  className="w-full bg-card/50 border-2 border-border rounded-2xl px-6 py-4 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                />
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  animate={{ opacity: companyName.length > 0 ? 1 : 0 }}
                >
                  {companyName.length}/50
                </motion.div>
              </motion.div>
            </>
          )}

          {/* Step 4: Founder Type */}
          {step === 4 && (
            <>
              <StepHeader icon={User} title="Profil du fondateur" subtitle="Quel type d'entrepreneur êtes-vous ?" step={step} totalSteps={TOTAL_STEPS} />
              <div className="grid grid-cols-2 gap-3">
                {founderOptions.map((option, index) => (
                  <OptionCard
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    description={option.description}
                    bonus={option.bonus}
                    icon={option.icon}
                    isSelected={founderType === option.value}
                    onClick={() => setFounderType(option.value)}
                    index={index}
                    showConfetti
                  />
                ))}
              </div>
            </>
          )}

          {/* Step 5: Legal Structure */}
          {step === 5 && (
            <>
              <StepHeader icon={Scale} title="Structure juridique" subtitle="Choisissez parmi 30+ formes juridiques" step={step} totalSteps={TOTAL_STEPS} />
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-3">
                  {Object.entries(structuresByCategory).map(([catKey, category]) => {
                    const CategoryIcon = category.icon;
                    const isExpanded = expandedCategory === catKey;
                    const hasSelectedStructure = category.structures.some(s => s === selectedLegalStructure);
                    
                    return (
                      <motion.div
                        key={catKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "rounded-2xl border-2 transition-all overflow-hidden",
                          hasSelectedStructure ? "border-primary bg-primary/5" : "border-border/50 bg-card/30"
                        )}
                      >
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                          className="w-full flex items-center justify-between p-4 hover:bg-card/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "p-2 rounded-xl",
                              hasSelectedStructure ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                              <CategoryIcon className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">{category.label}</span>
                            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                              {category.structures.length}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-2">
                                {category.structures.map((structId, index) => {
                                  const structure = LEGAL_STRUCTURES[structId];
                                  if (!structure) return null;
                                  
                                  return (
                                    <OptionListItem
                                      key={structId}
                                      label={structure.name}
                                      description={structure.description}
                                      isSelected={selectedLegalStructure === structId}
                                      onClick={() => handleSelectLegalStructure(structId)}
                                      index={index}
                                    />
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          )}

          {/* Step 6: Sector & Location */}
          {step === 6 && (
            <>
              <StepHeader icon={Briefcase} title="Secteur & Localisation" subtitle="Définissez votre marché" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" /> Secteur d'activité
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {sectorOptions.map((option, index) => (
                      <OptionCard
                        key={option.value}
                        value={option.value}
                        label={option.label}
                        description={option.description}
                        icon={option.icon}
                        isSelected={sector === option.value}
                        onClick={() => setSector(option.value)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" /> Siège social
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {locationOptions.map((option, index) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setLocation(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all",
                          location === option.value
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border/50 bg-card/30 hover:border-primary/40"
                        )}
                      >
                        <MapPin className={cn(
                          "w-4 h-4",
                          location === option.value ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className={cn(
                          "font-medium text-xs",
                          location === option.value ? "text-primary" : "text-foreground"
                        )}>{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 7: Starting Bonus & Objective */}
          {step === 7 && (
            <>
              <StepHeader icon={Gift} title="Avantages & Objectif" subtitle="Configurez votre départ" step={step} totalSteps={TOTAL_STEPS} />
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                      <Gift className="w-4 h-4" /> Bonus de départ
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {startingBonusOptions.map((option, index) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          description={option.description}
                          bonus={option.effect}
                          icon={option.icon}
                          isSelected={startingBonus === option.value}
                          onClick={() => setStartingBonus(option.value)}
                          index={index}
                          showConfetti
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                      <Target className="w-4 h-4" /> Objectif
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {objectiveOptions.map((option, index) => (
                        <OptionCard
                          key={option.value}
                          value={option.value}
                          label={option.label}
                          description={option.description}
                          bonus={option.target}
                          icon={option.icon}
                          isSelected={objective === option.value}
                          onClick={() => setObjective(option.value)}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}

          {/* Step 8: Management Style */}
          {step === 8 && (
            <>
              <StepHeader icon={Users} title="Style de Management" subtitle="Comment allez-vous diriger votre équipe ?" step={step} totalSteps={TOTAL_STEPS} />
              {renderAdvancedOptions(MANAGEMENT_STYLES, managementStyle, setManagementStyle, Users)}
            </>
          )}

          {/* Step 9: Company Culture */}
          {step === 9 && (
            <>
              <StepHeader icon={Heart} title="Culture d'Entreprise" subtitle="Quelle ambiance voulez-vous créer ?" step={step} totalSteps={TOTAL_STEPS} />
              {renderAdvancedOptions(CULTURE_TYPES, cultureType, setCultureType, Heart)}
            </>
          )}

          {/* Step 10: HR Policy */}
          {step === 10 && (
            <>
              <StepHeader icon={UserCheck} title="Politique RH" subtitle="Comment attirer et retenir les talents ?" step={step} totalSteps={TOTAL_STEPS} />
              {renderAdvancedOptions(HR_POLICIES, hrPolicy, setHrPolicy, UserCheck)}
            </>
          )}

          {/* Step 11: Marketing Strategy */}
          {step === 11 && (
            <>
              <StepHeader icon={Megaphone} title="Stratégie Marketing" subtitle="Comment allez-vous vous faire connaître ?" step={step} totalSteps={TOTAL_STEPS} />
              {renderAdvancedOptions(MARKETING_STRATEGIES, marketingStrategy, setMarketingStrategy, Megaphone)}
            </>
          )}

          {/* Step 12: Sales Strategy */}
          {step === 12 && (
            <>
              <StepHeader icon={ShoppingCart} title="Stratégie Commerciale" subtitle="Comment allez-vous vendre ?" step={step} totalSteps={TOTAL_STEPS} />
              {renderAdvancedOptions(SALES_STRATEGIES, salesStrategy, setSalesStrategy, ShoppingCart)}
            </>
          )}

          {/* Step 13: Tech & Remote */}
          {step === 13 && (
            <>
              <StepHeader icon={Laptop} title="Technologie & Télétravail" subtitle="Configurez votre environnement de travail" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Laptop className="w-4 h-4" /> Stack Technologique
                  </h3>
                  {renderAdvancedOptions(TECH_STACKS, techStack, setTechStack, Laptop)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Wifi className="w-4 h-4" /> Politique Télétravail
                  </h3>
                  {renderAdvancedOptions(REMOTE_POLICIES, remotePolicy, setRemotePolicy, Wifi)}
                </div>
              </div>
            </>
          )}

          {/* Step 14: Quality & Environment */}
          {step === 14 && (
            <>
              <StepHeader icon={Award} title="Qualité & Environnement" subtitle="Définissez vos standards" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4" /> Politique Qualité
                  </h3>
                  {renderAdvancedOptions(QUALITY_POLICIES, qualityPolicy, setQualityPolicy, Award)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Leaf className="w-4 h-4" /> Politique Environnementale
                  </h3>
                  {renderAdvancedOptions(ENVIRONMENTAL_POLICIES, environmentalPolicy, setEnvironmentalPolicy, Leaf)}
                </div>
              </div>
            </>
          )}

          {/* Step 15: Innovation & Organization */}
          {step === 15 && (
            <>
              <StepHeader icon={Brain} title="Innovation & Organisation" subtitle="Structurez votre entreprise" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Brain className="w-4 h-4" /> Stratégie d'Innovation
                  </h3>
                  {renderAdvancedOptions(INNOVATION_STRATEGIES, innovationStrategy, setInnovationStrategy, Brain)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Network className="w-4 h-4" /> Structure Organisationnelle
                  </h3>
                  {renderAdvancedOptions(ORG_STRUCTURES, orgStructure, setOrgStructure, Network)}
                </div>
              </div>
            </>
          )}

          {/* Step 16: Salary & Pricing */}
          {step === 16 && (
            <>
              <StepHeader icon={DollarSign} title="Salaires & Pricing" subtitle="Définissez votre politique financière" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4" /> Politique Salariale
                  </h3>
                  {renderAdvancedOptions(SALARY_POLICIES, salaryPolicy, setSalaryPolicy, DollarSign)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-4 h-4" /> Positionnement Prix
                  </h3>
                  {renderAdvancedOptions(PRICING_POSITIONS, pricingPosition, setPricingPosition, Tag)}
                </div>
              </div>
            </>
          )}

          {/* Step 17: International & Funding */}
          {step === 17 && (
            <>
              <StepHeader icon={Earth} title="International & Financement" subtitle="Planifiez votre croissance" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Earth className="w-4 h-4" /> Ambition Internationale
                  </h3>
                  {renderAdvancedOptions(INTERNATIONAL_AMBITIONS, internationalAmbition, setInternationalAmbition, Earth)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-muted-foreground">
                    <Banknote className="w-4 h-4" /> Mode de Financement
                  </h3>
                  {renderAdvancedOptions(FUNDING_MODES, fundingMode, setFundingMode, Banknote)}
                </div>
              </div>
            </>
          )}

          {/* Step 18: Capital & Summary */}
          {step === 18 && (
            <>
              <StepHeader icon={Coins} title="Capital & Récapitulatif" subtitle="Finalisez votre entreprise" step={step} totalSteps={TOTAL_STEPS} />
              <div className="space-y-6">
                {/* Capital slider */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-primary/10 to-transparent rounded-2xl p-6 border-2 border-primary/20"
                >
                  <div className="text-center mb-4">
                    <motion.span
                      key={capital}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-display font-bold text-primary"
                    >
                      {formatCurrency(capital + (startingBonus === 'extra_cash' ? 50000 : 0))}
                    </motion.span>
                    {startingBonus === 'extra_cash' && (
                      <p className="text-sm text-success mt-2">+50 000€ bonus héritage inclus</p>
                    )}
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="5000"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    className="w-full accent-primary h-2 rounded-full appearance-none bg-muted cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>5 000€</span>
                    <span>100 000€</span>
                  </div>
                </motion.div>

                {/* Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border/50"
                >
                  <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Récapitulatif
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    {[
                      { label: "Entreprise", value: companyName || '-' },
                      { label: "Difficulté", value: difficultyOptions.find(o => o.value === difficulty)?.label },
                      { label: "Mode", value: gameModeOptions.find(o => o.value === gameMode)?.label },
                      { label: "Fondateur", value: founderOptions.find(o => o.value === founderType)?.label },
                      { label: "Secteur", value: sector ? sectorOptions.find(o => o.value === sector)?.label : '-' },
                      { label: "Siège", value: locationOptions.find(o => o.value === location)?.label },
                      { label: "Management", value: MANAGEMENT_STYLES[managementStyle]?.label },
                      { label: "Culture", value: CULTURE_TYPES[cultureType]?.label },
                      { label: "Télétravail", value: REMOTE_POLICIES[remotePolicy]?.label },
                      { label: "International", value: INTERNATIONAL_AMBITIONS[internationalAmbition]?.label },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex justify-between py-1 border-b border-border/30"
                      >
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground truncate ml-2">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <SetupBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Simu'<span className="text-primary text-glow">Entrepreneur</span>
          </h1>
          <p className="text-muted-foreground">Le Défi Citoyen</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative bg-card/40 backdrop-blur-xl border-2 border-border/50 rounded-3xl p-6 shadow-2xl shadow-black/20 overflow-hidden"
        >
          {/* Gradient overlay on card */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          {/* Step indicator */}
          <StepIndicator
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            onStepClick={(s) => setStep(s)}
          />

          {/* Content */}
          <ScrollArea className="h-[55vh] pr-4">
            <div className="relative z-10 pb-4">
              {renderStepContent()}
            </div>
          </ScrollArea>

          {/* Navigation */}
          <div className="relative z-10 border-t border-border/50 mt-4 pt-2">
            <NavigationButtons
              step={step}
              totalSteps={TOTAL_STEPS}
              onPrev={() => setStep(step - 1)}
              onNext={() => canProgress() && setStep(step + 1)}
              onComplete={handleComplete}
              canProgress={canProgress()}
            />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Simulation basée sur le système fiscal français 2024 • 18 étapes • 300+ options
        </motion.p>
      </motion.div>
    </div>
  );
}
