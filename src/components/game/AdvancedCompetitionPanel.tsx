import { useState, useMemo } from "react";
import { Company, Competitor, GameState } from "@/types/game";
import { 
  AdvancedCompetitorAI, 
  SpyAgent, 
  Alliance, 
  AllianceType,
  OffensiveActionType,
  SpyMissionType,
  ADVANCED_COMPETITOR_TEMPLATES,
} from "@/types/megaFeatures";
import { 
  generateCompetitorsForSector,
  makeAIDecision,
  executeAIAction,
  getAIReaction,
  createAlliance,
  executeSpyMission,
} from "@/utils/competitionAIEngine";
import { formatCurrency, formatPercent } from "@/utils/gameEngine";
import { 
  Target, 
  Eye, 
  Swords,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Zap,
  BarChart3,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  Handshake,
  Skull,
  Brain,
  Search,
  Clock,
  DollarSign,
  Lock,
  Unlock,
  Crown,
  Flame,
  Snowflake,
  Ghost,
  Briefcase,
  Crosshair,
  Radio,
  AlertOctagon,
  TrendingUp as Up,
  Building,
  Gavel,
  UserMinus,
  Megaphone,
  FileWarning,
  ShieldAlert,
  Bomb,
  Award,
  HeartHandshake,
  Sword,
  BadgeAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AdvancedCompetitionPanelProps {
  company: Company;
  gameState: GameState;
  onTreasuryChange: (amount: number) => void;
  onMarketShareChange: (amount: number) => void;
  onReputationChange: (amount: number) => void;
  onCompetitorUpdate: (competitors: AdvancedCompetitorAI[]) => void;
  onAllianceUpdate: (alliances: Alliance[]) => void;
  onSpyAgentUpdate: (agents: SpyAgent[]) => void;
}

// Types personnalité avec icônes et couleurs
const personalityConfig = {
  aggressive_shark: { icon: Skull, label: "Requin Agressif", color: "text-red-500", bgColor: "bg-red-500/20" },
  innovation_leader: { icon: Zap, label: "Leader Innovation", color: "text-cyan-500", bgColor: "bg-cyan-500/20" },
  silent_giant: { icon: Ghost, label: "Géant Silencieux", color: "text-slate-500", bgColor: "bg-slate-500/20" },
  alliance_builder: { icon: Handshake, label: "Bâtisseur d'Alliances", color: "text-green-500", bgColor: "bg-green-500/20" },
  opportunist: { icon: Target, label: "Opportuniste", color: "text-amber-500", bgColor: "bg-amber-500/20" },
  traditionalist: { icon: Shield, label: "Traditionaliste", color: "text-blue-500", bgColor: "bg-blue-500/20" },
  disruptor: { icon: Flame, label: "Disrupteur", color: "text-orange-500", bgColor: "bg-orange-500/20" },
  guerilla_fighter: { icon: Crosshair, label: "Guérillero", color: "text-purple-500", bgColor: "bg-purple-500/20" },
};

// Actions d'espionnage avancées
const spyMissions: { type: SpyMissionType; name: string; description: string; cost: number; duration: number; risk: number; successRate: number }[] = [
  { type: 'financial_audit', name: 'Audit Financier', description: 'Découvrir la santé financière du concurrent', cost: 5000, duration: 3, risk: 1, successRate: 85 },
  { type: 'product_intel', name: 'Renseignement Produit', description: 'Identifier les produits en développement', cost: 8000, duration: 5, risk: 2, successRate: 75 },
  { type: 'strategy_discovery', name: 'Découverte Stratégique', description: 'Révéler les plans stratégiques', cost: 15000, duration: 7, risk: 3, successRate: 60 },
  { type: 'talent_scouting', name: 'Chasse aux Talents', description: 'Identifier les employés clés à débaucher', cost: 6000, duration: 4, risk: 2, successRate: 80 },
  { type: 'price_intelligence', name: 'Intelligence Prix', description: 'Comprendre la structure de coûts', cost: 10000, duration: 5, risk: 2, successRate: 70 },
  { type: 'supply_chain_mapping', name: 'Cartographie Supply', description: 'Identifier les fournisseurs critiques', cost: 12000, duration: 6, risk: 2, successRate: 65 },
  { type: 'patent_research', name: 'Recherche Brevets', description: 'Analyser le portefeuille R&D', cost: 8000, duration: 4, risk: 1, successRate: 90 },
  { type: 'scandal_search', name: 'Recherche de Scandales', description: 'Trouver des informations compromettantes', cost: 25000, duration: 10, risk: 4, successRate: 40 },
  { type: 'infiltration', name: 'Infiltration Long Terme', description: 'Placer un agent dans l\'entreprise', cost: 50000, duration: 30, risk: 5, successRate: 30 },
  { type: 'counter_intelligence', name: 'Contre-Espionnage', description: 'Détecter leurs espions chez vous', cost: 20000, duration: 5, risk: 1, successRate: 75 },
  { type: 'sabotage_preparation', name: 'Préparation Sabotage', description: 'Planifier une action de sabotage', cost: 30000, duration: 14, risk: 5, successRate: 50 },
];

// Actions offensives
const offensiveActions: { type: OffensiveActionType; name: string; description: string; cost: number; risk: number; legal: boolean; impact: string }[] = [
  { type: 'aggressive_pricing', name: 'Prix Agressifs', description: 'Guerre des prix ciblée', cost: 20000, risk: 2, legal: true, impact: 'Part de marché +5%' },
  { type: 'marketing_war', name: 'Guerre Marketing', description: 'Campagne massive contre le concurrent', cost: 50000, risk: 2, legal: true, impact: 'Réputation concurrente -15%' },
  { type: 'talent_raid', name: 'Raid Talents', description: 'Débaucher les employés clés', cost: 75000, risk: 3, legal: true, impact: 'Innovation concurrente -20%' },
  { type: 'patent_blocking', name: 'Blocage Brevets', description: 'Brevets défensifs pour bloquer', cost: 40000, risk: 1, legal: true, impact: 'R&D concurrente ralentie' },
  { type: 'supplier_lockdown', name: 'Verrouillage Fournisseurs', description: 'Contrats exclusifs avec fournisseurs', cost: 100000, risk: 2, legal: true, impact: 'Coûts concurrents +30%' },
  { type: 'distribution_exclusivity', name: 'Exclusivité Distribution', description: 'Contrats exclusifs avec distributeurs', cost: 80000, risk: 2, legal: true, impact: 'Ventes concurrentes -25%' },
  { type: 'customer_poaching', name: 'Chasse aux Clients', description: 'Cibler les gros clients concurrents', cost: 30000, risk: 3, legal: true, impact: 'Revenus concurrents -10%' },
  { type: 'lobbying', name: 'Lobbying', description: 'Influencer la régulation', cost: 150000, risk: 2, legal: true, impact: 'Avantage réglementaire' },
  { type: 'legal_harassment', name: 'Harcèlement Juridique', description: 'Procès multiples pour épuiser', cost: 100000, risk: 3, legal: true, impact: 'Coûts légaux concurrents' },
  { type: 'negative_pr', name: 'PR Négative', description: 'Campagne de dénigrement subtile', cost: 25000, risk: 4, legal: false, impact: 'Réputation concurrente -25%' },
  { type: 'fake_reviews', name: 'Faux Avis', description: 'Avis négatifs orchestrés', cost: 10000, risk: 4, legal: false, impact: 'Ventes concurrentes -15%' },
  { type: 'influencer_attack', name: 'Attaque Influenceurs', description: 'Payer des influenceurs pour critiquer', cost: 35000, risk: 4, legal: false, impact: 'Image concurrente dégradée' },
  { type: 'sabotage_production', name: 'Sabotage Production', description: 'Perturber la chaîne de production', cost: 50000, risk: 5, legal: false, impact: 'Production concurrente -50%' },
  { type: 'data_theft', name: 'Vol de Données', description: 'Voler des données confidentielles', cost: 75000, risk: 5, legal: false, impact: 'Accès aux secrets' },
  { type: 'bribery', name: 'Corruption', description: 'Corrompre des décideurs', cost: 100000, risk: 5, legal: false, impact: 'Avantages illégaux' },
];

// Types d'alliances
const allianceTypes: { type: AllianceType; name: string; description: string; minReputation: number; benefits: string }[] = [
  { type: 'non_aggression', name: 'Non-Agression', description: 'Pacte de non-attaque mutuelle', minReputation: 20, benefits: 'Protection, Paix' },
  { type: 'price_fixing', name: 'Fixation des Prix', description: 'Entente sur les prix (illégal)', minReputation: 40, benefits: 'Marges +20%' },
  { type: 'market_sharing', name: 'Partage de Marché', description: 'Répartition des territoires', minReputation: 50, benefits: 'Stabilité, Moins de compétition' },
  { type: 'joint_venture', name: 'Joint Venture', description: 'Projet commun', minReputation: 60, benefits: 'R&D partagée, Coûts réduits' },
  { type: 'defense_pact', name: 'Pacte de Défense', description: 'Protection mutuelle', minReputation: 30, benefits: 'Défense commune' },
  { type: 'research_sharing', name: 'Partage R&D', description: 'Collaboration technologique', minReputation: 70, benefits: 'Innovation accélérée' },
  { type: 'supply_chain', name: 'Supply Chain Commune', description: 'Approvisionnement partagé', minReputation: 40, benefits: 'Coûts -10%' },
  { type: 'distribution', name: 'Distribution Commune', description: 'Réseau de distribution partagé', minReputation: 50, benefits: 'Accès marchés +15%' },
  { type: 'hostile_coalition', name: 'Coalition Hostile', description: 'Alliance contre un ennemi commun', minReputation: 10, benefits: 'Force de frappe combinée' },
];

export function AdvancedCompetitionPanel({ 
  company, 
  gameState,
  onTreasuryChange,
  onMarketShareChange,
  onReputationChange,
  onCompetitorUpdate,
  onAllianceUpdate,
  onSpyAgentUpdate,
}: AdvancedCompetitionPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'espionage' | 'offensive' | 'alliances' | 'agents'>('overview');
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);

  // Générer/récupérer les concurrents avancés
  const [advancedCompetitors, setAdvancedCompetitors] = useState<AdvancedCompetitorAI[]>(() => {
    return generateCompetitorsForSector(company.sector, 8);
  });

  // Agents espions
  const [spyAgents, setSpyAgents] = useState<SpyAgent[]>([
    { id: 'agent_1', name: 'Agent Alpha', skill: 70, loyalty: 80, status: 'available', successfulMissions: 0, failedMissions: 0, salary: 5000 },
  ]);

  // Alliances actives
  const [alliances, setAlliances] = useState<Alliance[]>([]);

  // Missions en cours
  const [activeMissions, setActiveMissions] = useState<{ mission: typeof spyMissions[0]; targetId: string; agentId: string; startDay: number }[]>([]);

  const tabs = [
    { id: 'overview', label: 'Vue Marché', icon: BarChart3 },
    { id: 'competitors', label: 'Concurrents IA', icon: Brain },
    { id: 'espionage', label: 'Espionnage', icon: Eye },
    { id: 'offensive', label: 'Actions Offensives', icon: Swords },
    { id: 'alliances', label: 'Alliances', icon: Handshake },
    { id: 'agents', label: 'Mes Agents', icon: Ghost },
  ] as const;

  const selectedCompetitor = advancedCompetitors.find(c => c.id === selectedCompetitorId);

  // Recruter un agent
  const hireAgent = () => {
    const cost = 10000;
    if (company.treasury < cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const names = ['Agent Beta', 'Agent Gamma', 'Agent Delta', 'Agent Epsilon', 'Agent Zeta', 'Agent Omega'];
    const newAgent: SpyAgent = {
      id: `agent_${Date.now()}`,
      name: names[spyAgents.length % names.length],
      skill: 50 + Math.floor(Math.random() * 30),
      loyalty: 60 + Math.floor(Math.random() * 30),
      status: 'available',
      successfulMissions: 0,
      failedMissions: 0,
      salary: 3000 + Math.floor(Math.random() * 4000),
    };

    setSpyAgents(prev => [...prev, newAgent]);
    onTreasuryChange(-cost);
    toast.success(`${newAgent.name} recruté !`);
  };

  // Lancer une mission d'espionnage
  const launchSpyMission = (missionType: SpyMissionType, targetId: string, agentId: string) => {
    const mission = spyMissions.find(m => m.type === missionType);
    const agent = spyAgents.find(a => a.id === agentId);
    if (!mission || !agent) return;

    if (company.treasury < mission.cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    if (agent.status !== 'available') {
      toast.error("Cet agent n'est pas disponible");
      return;
    }

    // Marquer l'agent comme en mission
    setSpyAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, status: 'on_mission' as const } : a
    ));

    // Ajouter la mission aux missions actives
    setActiveMissions(prev => [...prev, { 
      mission, 
      targetId, 
      agentId, 
      startDay: gameState.day 
    }]);

    onTreasuryChange(-mission.cost);
    toast.success(`Mission "${mission.name}" lancée contre ${advancedCompetitors.find(c => c.id === targetId)?.name} !`);

    // Simuler le résultat après le délai
    setTimeout(() => {
      const successRoll = Math.random() * 100;
      const modifiedSuccess = mission.successRate + (agent.skill - 50) / 2;
      const success = successRoll < modifiedSuccess;

      // Détection
      const detectionRoll = Math.random() * 100;
      const detected = detectionRoll < mission.risk * 15;

      if (success) {
        toast.success(`Mission "${mission.name}" réussie ! Intelligence obtenue.`);
        setSpyAgents(prev => prev.map(a => 
          a.id === agentId ? { 
            ...a, 
            status: 'available', 
            successfulMissions: a.successfulMissions + 1,
            skill: Math.min(100, a.skill + 2)
          } : a
        ));

        // Mettre à jour le concurrent avec les informations découvertes
        setAdvancedCompetitors(prev => prev.map(c => 
          c.id === targetId ? { ...c, spiedOn: true } : c
        ));
      } else {
        toast.error(`Mission "${mission.name}" échouée !`);
        setSpyAgents(prev => prev.map(a => 
          a.id === agentId ? { 
            ...a, 
            status: detected ? 'compromised' : 'available', 
            failedMissions: a.failedMissions + 1 
          } : a
        ));

        if (detected) {
          toast.error(`${agent.name} a été détecté ! Votre réputation en souffre.`);
          onReputationChange(-5);
        }
      }

      // Retirer la mission des missions actives
      setActiveMissions(prev => prev.filter(m => !(m.agentId === agentId && m.targetId === targetId)));
    }, 3000); // Simulé en 3 secondes pour la démo
  };

  // Lancer une action offensive
  const launchOffensiveAction = (actionType: OffensiveActionType, targetId: string) => {
    const action = offensiveActions.find(a => a.type === actionType);
    if (!action) return;

    if (company.treasury < action.cost) {
      toast.error("Trésorerie insuffisante");
      return;
    }

    const target = advancedCompetitors.find(c => c.id === targetId);
    if (!target) return;

    onTreasuryChange(-action.cost);

    // Calculer le succès
    const successChance = 70 - (action.risk * 10) + (company.reputation / 5);
    const success = Math.random() * 100 < successChance;

    if (success) {
      toast.success(`Action "${action.name}" réussie contre ${target.name} !`);

      // Appliquer les effets
      switch (actionType) {
        case 'aggressive_pricing':
          onMarketShareChange(5);
          break;
        case 'marketing_war':
          setAdvancedCompetitors(prev => prev.map(c => 
            c.id === targetId ? { ...c, reputation: Math.max(0, c.reputation - 15) } : c
          ));
          break;
        case 'talent_raid':
          setAdvancedCompetitors(prev => prev.map(c => 
            c.id === targetId ? { ...c, innovation: Math.max(0, c.innovation - 20), employees: Math.max(10, c.employees - 5) } : c
          ));
          break;
        default:
          break;
      }

      // Réaction de l'IA
      const reaction = getAIReaction(target, actionType, gameState.day);
      if (reaction) {
        toast.warning(`${target.name} prépare une contre-attaque: ${reaction} !`);
      }
    } else {
      toast.error(`Action "${action.name}" échouée !`);
      if (!action.legal && Math.random() < action.risk * 0.1) {
        toast.error("Votre entreprise fait l'objet d'une enquête !");
        onReputationChange(-15);
      }
    }

    // Mettre à jour la relation avec le concurrent
    setAdvancedCompetitors(prev => prev.map(c => 
      c.id === targetId ? { 
        ...c, 
        relationshipScore: c.relationshipScore - 20,
        targetingPlayer: true,
        isHostile: true
      } : c
    ));
  };

  // Proposer une alliance
  const proposeAlliance = (competitorId: string, type: AllianceType) => {
    const competitor = advancedCompetitors.find(c => c.id === competitorId);
    const allianceConfig = allianceTypes.find(a => a.type === type);
    if (!competitor || !allianceConfig) return;

    // Vérifier la relation
    if (competitor.relationshipScore < allianceConfig.minReputation - 50) {
      toast.error(`${competitor.name} refuse - relation trop dégradée`);
      return;
    }

    // Probabilité d'acceptation basée sur la personnalité et la relation
    let acceptChance = 30 + competitor.relationshipScore / 2;
    if (competitor.personality === 'alliance_builder') acceptChance += 30;
    if (competitor.personality === 'aggressive_shark') acceptChance -= 20;
    if (competitor.isHostile) acceptChance -= 40;

    if (Math.random() * 100 < acceptChance) {
      const newAlliance = createAlliance(['player', competitorId], type, gameState.day);
      setAlliances(prev => [...prev, newAlliance]);
      setAdvancedCompetitors(prev => prev.map(c => 
        c.id === competitorId ? { 
          ...c, 
          inAlliance: true, 
          allianceWith: [...c.allianceWith, 'player'],
          relationshipScore: Math.min(100, c.relationshipScore + 30)
        } : c
      ));
      toast.success(`Alliance "${allianceConfig.name}" formée avec ${competitor.name} !`);
    } else {
      toast.error(`${competitor.name} a refusé l'alliance`);
    }
  };

  // Briser une alliance
  const breakAlliance = (allianceId: string) => {
    const alliance = alliances.find(a => a.id === allianceId);
    if (!alliance) return;

    setAlliances(prev => prev.filter(a => a.id !== allianceId));
    alliance.members.forEach(memberId => {
      if (memberId !== 'player') {
        setAdvancedCompetitors(prev => prev.map(c => 
          c.id === memberId ? { 
            ...c, 
            inAlliance: false, 
            allianceWith: c.allianceWith.filter(a => a !== 'player'),
            relationshipScore: Math.max(-100, c.relationshipScore - 50),
            isHostile: true
          } : c
        ));
      }
    });
    toast.warning("Alliance rompue ! Les membres sont maintenant hostiles.");
    onReputationChange(-10);
  };

  const yourMarketShare = company.marketShare || 5;
  const totalCompetitorShare = advancedCompetitors.reduce((sum, c) => sum + c.marketShare, 0);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Market Dominance Chart */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Domination du Marché
        </h3>
        <div className="space-y-3">
          {/* Vous */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-primary flex items-center gap-2">
                <Crown className="w-4 h-4" /> {company.name} (Vous)
              </span>
              <span className="text-sm font-bold text-primary">{formatPercent(yourMarketShare)}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-5 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-primary to-primary/70 h-5"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, yourMarketShare)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Top 5 Competitors */}
          {advancedCompetitors
            .sort((a, b) => b.marketShare - a.marketShare)
            .slice(0, 5)
            .map((comp, index) => {
              const personality = personalityConfig[comp.personality];
              const PersonalityIcon = personality.icon;
              const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-green-500', 'bg-red-500'];
              
              return (
                <motion.div 
                  key={comp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm flex items-center gap-2">
                      <PersonalityIcon className={cn("w-3 h-3", personality.color)} />
                      {comp.name}
                      {comp.targetingPlayer && <Target className="w-3 h-3 text-destructive" />}
                      {comp.inAlliance && <Handshake className="w-3 h-3 text-green-500" />}
                    </span>
                    <span className="text-sm font-medium">{formatPercent(comp.marketShare)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                    <motion.div 
                      className={cn("h-4", colors[index % colors.length])}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, comp.marketShare)}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Threat Assessment */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-xs">Menaces Actives</span>
          </div>
          <div className="text-2xl font-bold text-warning">
            {advancedCompetitors.filter(c => c.targetingPlayer).length}
          </div>
        </div>
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Handshake className="w-4 h-4 text-success" />
            <span className="text-xs">Alliances</span>
          </div>
          <div className="text-2xl font-bold text-success">
            {alliances.length}
          </div>
        </div>
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Ghost className="w-4 h-4 text-purple-400" />
            <span className="text-xs">Agents Actifs</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {spyAgents.filter(a => a.status === 'available').length}/{spyAgents.length}
          </div>
        </div>
        <div className="game-panel p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span className="text-xs">Intel Collectée</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">
            {advancedCompetitors.filter(c => c.spiedOn).length}
          </div>
        </div>
      </div>

      {/* Recent AI Actions */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary animate-pulse" />
          Activité Concurrentielle Récente
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {advancedCompetitors
            .flatMap(c => c.actionsHistory.slice(-2).map(a => ({ ...a, compName: c.name })))
            .sort((a, b) => b.date - a.date)
            .slice(0, 6)
            .map((action, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{action.compName}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs",
                  action.success ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                )}>
                  {action.type.replace('_', ' ')}
                </span>
              </div>
            ))}
          {advancedCompetitors.every(c => c.actionsHistory.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">Aucune activité récente détectée</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        {advancedCompetitors.length} concurrents IA avec personnalités distinctes et comportements dynamiques.
      </p>
      
      {advancedCompetitors.map(comp => {
        const isExpanded = expandedCompetitor === comp.id;
        const personality = personalityConfig[comp.personality];
        const PersonalityIcon = personality.icon;
        
        return (
          <motion.div
            key={comp.id}
            layout
            className={cn(
              "game-panel p-4 cursor-pointer transition-all",
              isExpanded && "ring-2 ring-primary",
              comp.targetingPlayer && "border-l-4 border-l-destructive",
              comp.inAlliance && comp.allianceWith.includes('player') && "border-l-4 border-l-success"
            )}
          >
            <div 
              className="flex items-center justify-between"
              onClick={() => setExpandedCompetitor(isExpanded ? null : comp.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  personality.bgColor
                )}>
                  <PersonalityIcon className={cn("w-6 h-6", personality.color)} />
                </div>
                <div>
                  <h4 className="font-semibold flex items-center gap-2">
                    {comp.name}
                    {comp.targetingPlayer && <Target className="w-4 h-4 text-destructive" />}
                    {comp.isHostile && <Skull className="w-4 h-4 text-red-500" />}
                    {comp.spiedOn && <Eye className="w-4 h-4 text-cyan-400" />}
                  </h4>
                  <span className={cn("text-xs", personality.color)}>{personality.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold">{formatPercent(comp.marketShare)}</div>
                  <span className="text-xs text-muted-foreground">Part de marché</span>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded text-xs",
                  comp.relationshipScore > 30 ? "bg-success/20 text-success" :
                  comp.relationshipScore > -30 ? "bg-warning/20 text-warning" :
                  "bg-destructive/20 text-destructive"
                )}>
                  {comp.relationshipScore > 30 ? 'Amical' : comp.relationshipScore > -30 ? 'Neutre' : 'Hostile'}
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-border space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <DollarSign className="w-4 h-4 mx-auto mb-1 text-success" />
                        <div className="text-sm font-semibold">{formatCurrency(comp.treasury)}</div>
                        <span className="text-xs text-muted-foreground">Trésorerie</span>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <Target className="w-4 h-4 mx-auto mb-1 text-red-400" />
                        <div className="text-sm font-semibold">{comp.aggressiveness}</div>
                        <span className="text-xs text-muted-foreground">Agressivité</span>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <Zap className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                        <div className="text-sm font-semibold">{comp.innovation}</div>
                        <span className="text-xs text-muted-foreground">Innovation</span>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <Star className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                        <div className="text-sm font-semibold">{comp.reputation}</div>
                        <span className="text-xs text-muted-foreground">Réputation</span>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <Users className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <div className="text-sm font-semibold">{comp.employees}</div>
                        <span className="text-xs text-muted-foreground">Employés</span>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-2 text-center">
                        <TrendingUp className="w-4 h-4 mx-auto mb-1 text-cyan-400" />
                        <div className="text-sm font-semibold">{formatCurrency(comp.stockPrice)}</div>
                        <span className="text-xs text-muted-foreground">Action</span>
                      </div>
                    </div>

                    {/* Weaknesses if discovered */}
                    {comp.spiedOn && comp.weaknesses.length > 0 && (
                      <div className="bg-destructive/10 rounded-lg p-3">
                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                          <AlertOctagon className="w-4 h-4" /> Faiblesses Détectées
                        </h5>
                        <div className="space-y-1">
                          {comp.weaknesses.slice(0, 3).map((w, i) => (
                            <div key={i} className="text-xs flex justify-between">
                              <span>{w.description}</span>
                              <span className="text-destructive">Sévérité: {w.severity}/5</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompetitorId(comp.id);
                          setActiveTab('espionage');
                        }}
                        className="btn-game-secondary text-xs py-1.5 px-3"
                      >
                        <Eye className="w-3 h-3 mr-1 inline" />
                        Espionner
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompetitorId(comp.id);
                          setActiveTab('offensive');
                        }}
                        className="btn-game-primary text-xs py-1.5 px-3"
                      >
                        <Swords className="w-3 h-3 mr-1 inline" />
                        Attaquer
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompetitorId(comp.id);
                          setActiveTab('alliances');
                        }}
                        className="btn-game-secondary text-xs py-1.5 px-3"
                      >
                        <Handshake className="w-3 h-3 mr-1 inline" />
                        Alliance
                      </button>
                    </div>

                    {/* Current Strategy */}
                    {comp.currentStrategy && (
                      <div className="bg-primary/10 rounded-lg p-3">
                        <h5 className="text-xs font-semibold mb-1 text-primary">Stratégie Actuelle</h5>
                        <p className="text-sm">{comp.currentStrategy.type} - Budget: {formatCurrency(comp.currentStrategy.budget)}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );

  const renderEspionage = () => (
    <div className="space-y-6">
      {/* Target Selection */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4">Cible de l'Opération</h3>
        {selectedCompetitor ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <div>
                <span className="font-semibold">{selectedCompetitor.name}</span>
                <span className={cn("ml-2 text-xs", personalityConfig[selectedCompetitor.personality].color)}>
                  {personalityConfig[selectedCompetitor.personality].label}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCompetitorId(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Changer
            </button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sélectionnez un concurrent dans l'onglet "Concurrents IA"</p>
          </div>
        )}
      </div>

      {/* Available Agents */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Ghost className="w-4 h-4 text-purple-400" />
            Agents Disponibles
          </span>
          <span className="text-sm text-muted-foreground">
            {spyAgents.filter(a => a.status === 'available').length} disponibles
          </span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {spyAgents.map(agent => (
            <div 
              key={agent.id}
              className={cn(
                "p-2 rounded-lg text-center text-sm border",
                agent.status === 'available' ? "border-success/50 bg-success/10" :
                agent.status === 'on_mission' ? "border-amber-500/50 bg-amber-500/10" :
                "border-destructive/50 bg-destructive/10"
              )}
            >
              <Ghost className={cn(
                "w-5 h-5 mx-auto mb-1",
                agent.status === 'available' ? "text-success" :
                agent.status === 'on_mission' ? "text-amber-500" :
                "text-destructive"
              )} />
              <div className="font-medium">{agent.name}</div>
              <div className="text-xs text-muted-foreground">
                Skill: {agent.skill} | Loyalty: {agent.loyalty}
              </div>
              <div className="text-xs capitalize">
                {agent.status.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spy Missions */}
      <div className="grid gap-3">
        {spyMissions.map(mission => {
          const canAfford = company.treasury >= mission.cost;
          const hasAgent = spyAgents.some(a => a.status === 'available');
          const hasTarget = !!selectedCompetitorId;
          const isDisabled = !canAfford || !hasAgent || !hasTarget;
          
          return (
            <div
              key={mission.type}
              className={cn(
                "game-panel p-4 transition-all",
                isDisabled && "opacity-60"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    mission.risk <= 2 ? "bg-success/20" :
                    mission.risk <= 3 ? "bg-warning/20" :
                    "bg-destructive/20"
                  )}>
                    <Search className={cn(
                      "w-5 h-5",
                      mission.risk <= 2 ? "text-success" :
                      mission.risk <= 3 ? "text-warning" :
                      "text-destructive"
                    )} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{mission.name}</h4>
                    <p className="text-sm text-muted-foreground">{mission.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Coût: <span className="text-foreground font-medium">{formatCurrency(mission.cost)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Succès: <span className="text-foreground font-medium">{mission.successRate}%</span>
                  </span>
                  <span className="text-muted-foreground">
                    Durée: <span className="text-foreground font-medium">{mission.duration}j</span>
                  </span>
                  <span className={cn(
                    mission.risk <= 2 ? "text-success" :
                    mission.risk <= 3 ? "text-warning" :
                    "text-destructive"
                  )}>
                    Risque {mission.risk}/5
                  </span>
                </div>
                <button
                  onClick={() => {
                    const availableAgent = spyAgents.find(a => a.status === 'available');
                    if (availableAgent && selectedCompetitorId) {
                      launchSpyMission(mission.type, selectedCompetitorId, availableAgent.id);
                    }
                  }}
                  disabled={isDisabled}
                  className="btn-game-primary text-sm py-2 px-4 disabled:opacity-50"
                >
                  Lancer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderOffensive = () => (
    <div className="space-y-6">
      {/* Target Selection */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4">Cible de l'Attaque</h3>
        {selectedCompetitor ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crosshair className="w-5 h-5 text-destructive" />
              <div>
                <span className="font-semibold">{selectedCompetitor.name}</span>
                <span className="ml-2 text-sm text-muted-foreground">
                  Market Share: {formatPercent(selectedCompetitor.marketShare)}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedCompetitorId(null)}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Changer
            </button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <Swords className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sélectionnez un concurrent</p>
          </div>
        )}
      </div>

      {/* Offensive Actions - Legal */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-success" />
          Actions Légales
        </h3>
        <div className="grid gap-3">
          {offensiveActions.filter(a => a.legal).map(action => {
            const canAfford = company.treasury >= action.cost;
            const hasTarget = !!selectedCompetitorId;
            
            return (
              <div
                key={action.type}
                className={cn(
                  "p-3 bg-secondary/30 rounded-lg",
                  (!canAfford || !hasTarget) && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{action.name}</h4>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                    <span className="text-xs text-success mt-1 inline-block">{action.impact}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(action.cost)}</div>
                    <button
                      onClick={() => selectedCompetitorId && launchOffensiveAction(action.type, selectedCompetitorId)}
                      disabled={!canAfford || !hasTarget}
                      className="mt-1 btn-game-primary text-xs py-1 px-3 disabled:opacity-50"
                    >
                      Lancer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offensive Actions - Illegal */}
      <div className="game-panel p-4 border-destructive/50">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          Actions à Risque (Illégales)
        </h3>
        <p className="text-xs text-destructive mb-4">
          ⚠️ Ces actions peuvent avoir des conséquences juridiques et nuire à votre réputation
        </p>
        <div className="grid gap-3">
          {offensiveActions.filter(a => !a.legal).map(action => {
            const canAfford = company.treasury >= action.cost;
            const hasTarget = !!selectedCompetitorId;
            
            return (
              <div
                key={action.type}
                className={cn(
                  "p-3 bg-destructive/10 rounded-lg border border-destructive/30",
                  (!canAfford || !hasTarget) && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {action.name}
                      <Bomb className="w-3 h-3 text-destructive" />
                    </h4>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                    <span className="text-xs text-warning mt-1 inline-block">{action.impact}</span>
                    <span className="text-xs text-destructive ml-2">Risque: {action.risk}/5</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-destructive">{formatCurrency(action.cost)}</div>
                    <button
                      onClick={() => selectedCompetitorId && launchOffensiveAction(action.type, selectedCompetitorId)}
                      disabled={!canAfford || !hasTarget}
                      className="mt-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs py-1 px-3 rounded disabled:opacity-50"
                    >
                      Risquer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAlliances = () => (
    <div className="space-y-6">
      {/* Current Alliances */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-success" />
          Alliances Actives ({alliances.length})
        </h3>
        {alliances.length > 0 ? (
          <div className="space-y-3">
            {alliances.map(alliance => (
              <div key={alliance.id} className="p-3 bg-success/10 rounded-lg border border-success/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold">{alliance.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      Formée jour {alliance.createdAt} | Force: {alliance.strength}%
                    </span>
                  </div>
                  <button
                    onClick={() => breakAlliance(alliance.id)}
                    className="text-destructive text-xs hover:underline"
                  >
                    Rompre
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {alliance.members.map(m => (
                    <span key={m} className="text-xs bg-secondary px-2 py-0.5 rounded">
                      {m === 'player' ? company.name : advancedCompetitors.find(c => c.id === m)?.name || m}
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-xs text-success">
                  Avantages: {alliance.benefits.map(b => b.description).join(', ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Aucune alliance active</p>
        )}
      </div>

      {/* Propose Alliance */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4">Proposer une Alliance</h3>
        
        {selectedCompetitor ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg">
              <Handshake className="w-5 h-5 text-primary" />
              <div>
                <span className="font-semibold">{selectedCompetitor.name}</span>
                <span className={cn(
                  "ml-2 text-xs",
                  selectedCompetitor.relationshipScore > 30 ? "text-success" :
                  selectedCompetitor.relationshipScore > -30 ? "text-warning" :
                  "text-destructive"
                )}>
                  Relation: {selectedCompetitor.relationshipScore > 30 ? 'Amicale' : selectedCompetitor.relationshipScore > -30 ? 'Neutre' : 'Hostile'}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              {allianceTypes.map(allianceType => {
                const canPropose = selectedCompetitor.relationshipScore >= allianceType.minReputation - 50;
                const isIllegal = allianceType.type === 'price_fixing';
                
                return (
                  <div
                    key={allianceType.type}
                    className={cn(
                      "p-3 rounded-lg border",
                      canPropose ? (isIllegal ? "border-destructive/50 bg-destructive/10" : "border-border bg-secondary/30") : "opacity-50",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {allianceType.name}
                          {isIllegal && <AlertTriangle className="w-3 h-3 text-destructive" />}
                        </h4>
                        <p className="text-xs text-muted-foreground">{allianceType.description}</p>
                        <span className="text-xs text-success mt-1 inline-block">{allianceType.benefits}</span>
                      </div>
                      <button
                        onClick={() => proposeAlliance(selectedCompetitor.id, allianceType.type)}
                        disabled={!canPropose}
                        className={cn(
                          "text-xs py-1 px-3 rounded disabled:opacity-50",
                          isIllegal ? "bg-destructive text-destructive-foreground" : "btn-game-primary"
                        )}
                      >
                        Proposer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <Handshake className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Sélectionnez un concurrent pour proposer une alliance</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAgents = () => (
    <div className="space-y-6">
      {/* Agent Roster */}
      <div className="game-panel p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold flex items-center gap-2">
            <Ghost className="w-4 h-4 text-purple-400" />
            Réseau d'Agents ({spyAgents.length})
          </h3>
          <button
            onClick={hireAgent}
            disabled={company.treasury < 10000}
            className="btn-game-primary text-sm py-1.5 px-3 disabled:opacity-50"
          >
            Recruter (10 000€)
          </button>
        </div>

        <div className="grid gap-3">
          {spyAgents.map(agent => (
            <div 
              key={agent.id}
              className={cn(
                "p-4 rounded-lg border",
                agent.status === 'available' ? "border-success/50 bg-success/10" :
                agent.status === 'on_mission' ? "border-amber-500/50 bg-amber-500/10" :
                agent.status === 'compromised' ? "border-destructive/50 bg-destructive/10" :
                "border-slate-500/50 bg-slate-500/10"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Ghost className={cn(
                    "w-8 h-8",
                    agent.status === 'available' ? "text-success" :
                    agent.status === 'on_mission' ? "text-amber-500" :
                    "text-destructive"
                  )} />
                  <div>
                    <h4 className="font-semibold">{agent.name}</h4>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded capitalize",
                      agent.status === 'available' ? "bg-success/20 text-success" :
                      agent.status === 'on_mission' ? "bg-amber-500/20 text-amber-500" :
                      "bg-destructive/20 text-destructive"
                    )}>
                      {agent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div>Salaire: {formatCurrency(agent.salary)}/mois</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div className="p-2 bg-secondary/50 rounded">
                  <div className="font-semibold">{agent.skill}</div>
                  <div className="text-xs text-muted-foreground">Compétence</div>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <div className="font-semibold">{agent.loyalty}</div>
                  <div className="text-xs text-muted-foreground">Loyauté</div>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <div className="font-semibold text-success">{agent.successfulMissions}</div>
                  <div className="text-xs text-muted-foreground">Succès</div>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <div className="font-semibold text-destructive">{agent.failedMissions}</div>
                  <div className="text-xs text-muted-foreground">Échecs</div>
                </div>
              </div>

              {agent.currentMission && (
                <div className="mt-3 p-2 bg-amber-500/10 rounded text-sm">
                  <span className="text-amber-500">En mission:</span> {agent.currentMission.type}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Active Missions */}
      <div className="game-panel p-4">
        <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          Missions en Cours ({activeMissions.length})
        </h3>
        {activeMissions.length > 0 ? (
          <div className="space-y-2">
            {activeMissions.map((m, i) => (
              <div key={i} className="p-3 bg-amber-500/10 rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-medium">{m.mission.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    vs {advancedCompetitors.find(c => c.id === m.targetId)?.name}
                  </span>
                </div>
                <div className="text-xs text-amber-500">
                  {m.mission.duration - (gameState.day - m.startDay)}j restants
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Aucune mission en cours</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-display font-semibold">Compétition Avancée & IA</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'competitors' && renderCompetitors()}
        {activeTab === 'espionage' && renderEspionage()}
        {activeTab === 'offensive' && renderOffensive()}
        {activeTab === 'alliances' && renderAlliances()}
        {activeTab === 'agents' && renderAgents()}
      </div>
    </div>
  );
}
