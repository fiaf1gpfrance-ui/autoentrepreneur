// ============= MOTEUR D'IA CONCURRENTIELLE AVANCÉ =============

import { 
  AdvancedCompetitorAI, 
  AIActionType, 
  AIAction,
  CompetitorPersonality,
  Alliance,
  AllianceType,
  SpyMission,
  OffensiveAction,
  ActionImpact,
  CompetitorWeakness,
  DiscoveredSecret,
  PlannedAction,
  MarketDynamics,
  EconomicEvent,
  ADVANCED_COMPETITOR_TEMPLATES,
} from '@/types/megaFeatures';
import { Company, Sector, GameState } from '@/types/game';

// ==================== GÉNÉRATION DE CONCURRENTS ====================

export function generateCompetitorsForSector(sector: Sector, count: number = 5): AdvancedCompetitorAI[] {
  const sectorCompetitors = ADVANCED_COMPETITOR_TEMPLATES.filter(c => c.sector === sector);
  const allSectorCompetitors = [...sectorCompetitors];
  
  // Ajouter des concurrents génériques si pas assez
  while (allSectorCompetitors.length < count) {
    const template = sectorCompetitors[Math.floor(Math.random() * sectorCompetitors.length)] || ADVANCED_COMPETITOR_TEMPLATES[0];
    allSectorCompetitors.push({
      ...template,
      name: `${template.name} ${allSectorCompetitors.length + 1}`,
      marketShare: Math.random() * 15 + 5,
      treasury: template.treasury * (0.5 + Math.random()),
    });
  }
  
  return allSectorCompetitors.slice(0, count).map((template, index) => ({
    ...template,
    id: `adv_comp_${index}_${Date.now()}`,
    actionsHistory: [],
    knownSecrets: [],
  }));
}

// ==================== DÉCISIONS IA ====================

interface AIDecisionContext {
  competitor: AdvancedCompetitorAI;
  player: Company;
  allCompetitors: AdvancedCompetitorAI[];
  gameState: GameState;
  marketDynamics?: MarketDynamics;
  currentEvents: EconomicEvent[];
}

export function makeAIDecision(context: AIDecisionContext): AIActionType | null {
  const { competitor, player, allCompetitors, gameState } = context;
  
  // Personnalité détermine le comportement
  const personalityWeights = getPersonalityWeights(competitor.personality);
  
  // Facteurs de décision
  const factors = calculateDecisionFactors(context);
  
  // Score chaque action possible
  const actionScores = scoreActions(competitor, factors, personalityWeights);
  
  // Sélectionner l'action avec le meilleur score (avec un peu de random)
  const topActions = Object.entries(actionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  if (topActions.length === 0) return null;
  
  // 60% chance de prendre la meilleure, 30% la 2ème, 10% la 3ème
  const rand = Math.random();
  if (rand < 0.6 || topActions.length === 1) {
    return topActions[0][0] as AIActionType;
  } else if (rand < 0.9 || topActions.length === 2) {
    return topActions[1][0] as AIActionType;
  } else {
    return topActions[2][0] as AIActionType;
  }
}

function getPersonalityWeights(personality: CompetitorPersonality): Record<string, number> {
  const weights: Record<CompetitorPersonality, Record<string, number>> = {
    aggressive_shark: {
      attack: 2.0, defense: 0.5, expansion: 1.5, innovation: 0.8, alliance: 0.3, acquisition: 1.8,
    },
    innovation_leader: {
      attack: 0.5, defense: 1.0, expansion: 1.2, innovation: 2.5, alliance: 1.0, acquisition: 0.7,
    },
    silent_giant: {
      attack: 0.4, defense: 1.5, expansion: 0.8, innovation: 1.0, alliance: 1.2, acquisition: 2.0,
    },
    alliance_builder: {
      attack: 0.6, defense: 1.2, expansion: 1.0, innovation: 0.8, alliance: 2.5, acquisition: 0.5,
    },
    opportunist: {
      attack: 1.5, defense: 0.8, expansion: 1.8, innovation: 1.0, alliance: 1.2, acquisition: 1.5,
    },
    traditionalist: {
      attack: 0.3, defense: 2.0, expansion: 0.5, innovation: 0.4, alliance: 0.8, acquisition: 0.3,
    },
    disruptor: {
      attack: 1.8, defense: 0.4, expansion: 2.0, innovation: 2.0, alliance: 0.5, acquisition: 0.6,
    },
    guerilla_fighter: {
      attack: 2.5, defense: 0.6, expansion: 1.0, innovation: 1.2, alliance: 0.4, acquisition: 0.3,
    },
  };
  return weights[personality];
}

interface DecisionFactors {
  playerThreat: number; // 0-100
  marketOpportunity: number; // 0-100
  financialHealth: number; // 0-100
  competitivePosition: number; // 0-100
  allianceOpportunity: number; // 0-100
  retaliationNeeded: boolean;
  economicConditions: 'good' | 'neutral' | 'bad';
}

function calculateDecisionFactors(context: AIDecisionContext): DecisionFactors {
  const { competitor, player, allCompetitors, gameState } = context;
  
  // Le joueur est-il une menace?
  const playerThreat = Math.min(100, 
    (player.marketShare > competitor.marketShare ? 40 : 0) +
    (player.reputation > competitor.reputation ? 20 : 0) +
    (player.innovationScore > competitor.innovation ? 20 : 0) +
    (competitor.targetingPlayer ? 30 : 0)
  );
  
  // Opportunités de marché
  const marketOpportunity = 
    100 - (allCompetitors.reduce((sum, c) => sum + c.marketShare, 0) + player.marketShare);
  
  // Santé financière
  const financialHealth = Math.min(100, competitor.treasury / 100000 * 10);
  
  // Position concurrentielle
  const competitivePosition = 
    (competitor.marketShare / (allCompetitors.reduce((sum, c) => sum + c.marketShare, 0) + player.marketShare)) * 100;
  
  // Opportunité d'alliance
  const potentialAllies = allCompetitors.filter(c => 
    c.id !== competitor.id && 
    !c.isHostile && 
    c.relationshipScore > 0 &&
    !c.inAlliance
  );
  const allianceOpportunity = potentialAllies.length * 20;
  
  // Représailles nécessaires?
  const retaliationNeeded = competitor.sabotaged || 
    (competitor.actionsHistory.some(a => a.wasRetaliation === false && a.target === 'player'));
  
  // Conditions économiques
  const economicConditions = 
    gameState.economicWeather === 'croissance' ? 'good' :
    gameState.economicWeather === 'stable' ? 'neutral' : 'bad';
  
  return {
    playerThreat,
    marketOpportunity,
    financialHealth,
    competitivePosition,
    allianceOpportunity,
    retaliationNeeded,
    economicConditions,
  };
}

function scoreActions(
  competitor: AdvancedCompetitorAI, 
  factors: DecisionFactors,
  weights: Record<string, number>
): Record<AIActionType, number> {
  const scores: Partial<Record<AIActionType, number>> = {};
  
  // Actions d'attaque
  if (factors.playerThreat > 50 || competitor.targetingPlayer) {
    scores.price_cut = 30 * weights.attack + (factors.financialHealth > 50 ? 20 : 0);
    scores.marketing_blitz = 25 * weights.attack + (factors.financialHealth > 60 ? 15 : 0);
    scores.talent_poaching = 20 * weights.attack + (factors.playerThreat > 70 ? 25 : 0);
  }
  
  // Actions de défense
  if (factors.competitivePosition < 30) {
    scores.price_increase = 15 * weights.defense;
    scores.restructuring = 25 * weights.defense + (factors.financialHealth < 40 ? 20 : 0);
  }
  
  // Actions d'expansion
  if (factors.marketOpportunity > 30 && factors.financialHealth > 50) {
    scores.expansion = 35 * weights.expansion;
    scores.product_launch = 30 * weights.expansion;
  }
  
  // Actions d'innovation
  if (competitor.innovation > 60 || weights.innovation > 1.5) {
    scores.patent_filing = 25 * weights.innovation;
    scores.product_launch = 30 * weights.innovation;
  }
  
  // Actions d'alliance
  if (factors.allianceOpportunity > 40 && !competitor.inAlliance) {
    scores.alliance_formation = 35 * weights.alliance;
    scores.partnership = 30 * weights.alliance;
  }
  
  // Actions d'acquisition
  if (factors.financialHealth > 70) {
    scores.acquisition_attempt = 25 * weights.acquisition;
    scores.merger = 20 * weights.acquisition;
  }
  
  // Représailles
  if (factors.retaliationNeeded && competitor.aggressiveness > 50) {
    scores.lawsuit = 40;
    scores.public_statement = 30;
    if (competitor.aggressiveness > 80) {
      scores.sabotage = 20;
    }
  }
  
  // Ajustements économiques
  if (factors.economicConditions === 'bad') {
    scores.layoffs = (scores.layoffs || 0) + 30;
    scores.restructuring = (scores.restructuring || 0) + 25;
    // Réduire les actions coûteuses
    Object.keys(scores).forEach(key => {
      if (['expansion', 'acquisition_attempt', 'marketing_blitz'].includes(key)) {
        scores[key as AIActionType] = (scores[key as AIActionType] || 0) * 0.5;
      }
    });
  }
  
  return scores as Record<AIActionType, number>;
}

// ==================== EXÉCUTION D'ACTIONS IA ====================

export function executeAIAction(
  competitor: AdvancedCompetitorAI,
  actionType: AIActionType,
  target: 'player' | string,
  day: number
): { updatedCompetitor: AdvancedCompetitorAI; impact: ActionImpact } {
  const impact: ActionImpact = {};
  let updatedCompetitor = { ...competitor };
  
  switch (actionType) {
    case 'price_cut':
      impact.sectorPrices = -5;
      impact.playerMarketShare = -2;
      impact.competitorMarketShare = 3;
      updatedCompetitor.treasury -= 20000;
      break;
      
    case 'marketing_blitz':
      impact.playerMarketShare = -3;
      impact.competitorMarketShare = 4;
      updatedCompetitor.treasury -= 50000;
      updatedCompetitor.reputation += 5;
      break;
      
    case 'talent_poaching':
      impact.playerRevenue = -5;
      updatedCompetitor.employees += 5;
      updatedCompetitor.treasury -= 75000;
      break;
      
    case 'product_launch':
      impact.competitorMarketShare = 5;
      updatedCompetitor.treasury -= 100000;
      updatedCompetitor.products.push({
        id: `prod_${Date.now()}`,
        name: `Nouveau Produit ${competitor.name}`,
        price: Math.random() * 500 + 100,
        quality: Math.random() * 30 + 60,
        marketShare: 2,
        rdProgress: 100,
        launchDate: day,
      });
      break;
      
    case 'acquisition_attempt':
      // Tentative d'acquisition d'un autre concurrent
      impact.competitorMarketShare = 10;
      updatedCompetitor.treasury -= 500000;
      break;
      
    case 'alliance_formation':
      updatedCompetitor.inAlliance = true;
      updatedCompetitor.relationshipScore += 20;
      break;
      
    case 'sabotage':
      impact.playerRevenue = -15;
      impact.playerReputation = -10;
      updatedCompetitor.reputation -= 5;
      break;
      
    case 'lawsuit':
      impact.playerReputation = -5;
      updatedCompetitor.treasury -= 50000;
      break;
      
    case 'layoffs':
      updatedCompetitor.employees = Math.max(10, updatedCompetitor.employees - 20);
      updatedCompetitor.reputation -= 10;
      break;
      
    case 'expansion':
      impact.competitorMarketShare = 3;
      updatedCompetitor.treasury -= 150000;
      break;
      
    default:
      break;
  }
  
  // Enregistrer l'action
  const action: AIAction = {
    id: `action_${Date.now()}`,
    type: actionType,
    date: day,
    target: target === 'player' ? 'player' : target,
    success: Math.random() > 0.2,
    impact,
    wasRetaliation: false,
  };
  
  updatedCompetitor.actionsHistory = [...updatedCompetitor.actionsHistory, action];
  
  return { updatedCompetitor, impact };
}

// ==================== RÉACTIONS AUX ACTIONS DU JOUEUR ====================

export function getAIReaction(
  competitor: AdvancedCompetitorAI,
  playerAction: string,
  day: number
): AIActionType | null {
  // Probabilité de réaction basée sur l'agressivité
  if (Math.random() * 100 > competitor.aggressiveness) return null;
  
  const reactions: Record<string, AIActionType[]> = {
    price_cut: ['price_cut', 'marketing_blitz', 'lawsuit'],
    marketing_campaign: ['marketing_blitz', 'price_cut'],
    product_launch: ['product_launch', 'marketing_blitz'],
    talent_raid: ['talent_poaching', 'lawsuit', 'public_statement'],
    espionage: ['espionage', 'lawsuit', 'sabotage'],
    acquisition: ['alliance_formation', 'merger', 'public_statement'],
    sabotage: ['lawsuit', 'sabotage', 'public_statement'],
  };
  
  const possibleReactions = reactions[playerAction] || ['public_statement'];
  const reaction = possibleReactions[Math.floor(Math.random() * possibleReactions.length)];
  
  // Marquer comme représailles
  return reaction;
}

// ==================== GESTION DES ALLIANCES ====================

export function canFormAlliance(
  competitor1: AdvancedCompetitorAI,
  competitor2: AdvancedCompetitorAI
): boolean {
  // Ne peut pas s'allier avec un ennemi
  if (competitor1.isHostile && competitor2.allianceWith.includes(competitor1.id)) return false;
  if (competitor2.isHostile && competitor1.allianceWith.includes(competitor2.id)) return false;
  
  // Besoin d'une relation neutre ou positive
  if (competitor1.relationshipScore < -20 || competitor2.relationshipScore < -20) return false;
  
  // Pas déjà en alliance
  if (competitor1.inAlliance || competitor2.inAlliance) return false;
  
  return true;
}

export function createAlliance(
  members: string[],
  type: AllianceType,
  day: number
): Alliance {
  return {
    id: `alliance_${Date.now()}`,
    name: `Alliance ${type}`,
    members,
    leader: members[0],
    type,
    benefits: getAllianceBenefits(type),
    obligations: getAllianceObligations(type),
    createdAt: day,
    strength: 50,
    publicAnnounced: type !== 'price_fixing',
  };
}

function getAllianceBenefits(type: AllianceType) {
  const benefits: Record<AllianceType, { type: any; value: number; description: string }[]> = {
    non_aggression: [
      { type: 'protection', value: 1, description: 'Protection contre les attaques' },
    ],
    price_fixing: [
      { type: 'cost_reduction', value: 20, description: 'Marges augmentées de 20%' },
    ],
    market_sharing: [
      { type: 'market_access', value: 10, description: '+10% part de marché garantie' },
    ],
    joint_venture: [
      { type: 'cost_reduction', value: 15, description: 'Coûts R&D réduits de 15%' },
      { type: 'technology_sharing', value: 1, description: 'Partage de technologie' },
    ],
    defense_pact: [
      { type: 'protection', value: 2, description: 'Défense mutuelle renforcée' },
    ],
    research_sharing: [
      { type: 'technology_sharing', value: 2, description: 'R&D accélérée' },
    ],
    supply_chain: [
      { type: 'cost_reduction', value: 10, description: 'Coûts d\'approvisionnement -10%' },
    ],
    distribution: [
      { type: 'market_access', value: 15, description: 'Accès à de nouveaux marchés' },
    ],
    hostile_coalition: [
      { type: 'intelligence', value: 2, description: 'Renseignements partagés' },
      { type: 'protection', value: 1, description: 'Force de frappe commune' },
    ],
  };
  return benefits[type] || [];
}

function getAllianceObligations(type: AllianceType) {
  const obligations: Record<AllianceType, { type: any; value: number; description: string }[]> = {
    non_aggression: [
      { type: 'non_compete', value: 1, description: 'Ne pas attaquer les membres' },
    ],
    price_fixing: [
      { type: 'market_restriction', value: 1, description: 'Respecter les prix fixés' },
    ],
    market_sharing: [
      { type: 'market_restriction', value: 1, description: 'Respecter les territoires' },
    ],
    joint_venture: [
      { type: 'revenue_share', value: 50, description: 'Partage des revenus 50/50' },
    ],
    defense_pact: [
      { type: 'mutual_defense', value: 1, description: 'Obligation de défense' },
    ],
    research_sharing: [
      { type: 'information_sharing', value: 1, description: 'Partage des découvertes' },
    ],
    supply_chain: [
      { type: 'revenue_share', value: 10, description: 'Commission de 10%' },
    ],
    distribution: [
      { type: 'revenue_share', value: 15, description: 'Commission de 15%' },
    ],
    hostile_coalition: [
      { type: 'mutual_defense', value: 2, description: 'Attaque coordonnée obligatoire' },
    ],
  };
  return obligations[type] || [];
}

// ==================== MISSIONS D'ESPIONNAGE ====================

export function executeSpyMission(
  mission: SpyMission,
  agent: { skill: number },
  competitor: AdvancedCompetitorAI
): {
  success: boolean;
  detected: boolean;
  results?: {
    secrets: DiscoveredSecret[];
    weaknesses: CompetitorWeakness[];
  };
} {
  // Calcul du succès
  const successModifier = agent.skill / 100;
  const successChance = mission.successProbability * successModifier;
  const success = Math.random() * 100 < successChance;
  
  // Calcul de la détection
  const detectionChance = (mission.riskLevel * 10) * (1 - successModifier * 0.5);
  const detected = Math.random() * 100 < detectionChance;
  
  if (!success) {
    return { success: false, detected };
  }
  
  // Générer les résultats
  const secrets: DiscoveredSecret[] = [];
  const weaknesses: CompetitorWeakness[] = [];
  
  switch (mission.type) {
    case 'financial_audit':
      secrets.push({
        id: `secret_${Date.now()}`,
        type: 'financial',
        description: `Trésorerie réelle: ${competitor.treasury}€, Dettes cachées possibles`,
        value: 10000,
        discoveredAt: Date.now(),
        canExploit: competitor.treasury < 500000,
        exploitOptions: competitor.treasury < 500000 ? [{
          id: 'exploit_financial',
          name: 'Guerre d\'usure',
          description: 'Forcez-les à dépenser jusqu\'à épuisement',
          cost: 50000,
          riskLevel: 2,
          impact: { competitorMarketShare: -5 },
          legalRisk: false,
        }] : [],
      });
      break;
      
    case 'product_intel':
      const upcomingProducts = competitor.products.filter(p => p.rdProgress < 100);
      if (upcomingProducts.length > 0) {
        secrets.push({
          id: `secret_${Date.now()}`,
          type: 'product',
          description: `Produits en développement: ${upcomingProducts.map(p => p.name).join(', ')}`,
          value: 25000,
          discoveredAt: Date.now(),
          canExploit: true,
          exploitOptions: [{
            id: 'exploit_product',
            name: 'Lancement préemptif',
            description: 'Sortez votre produit avant eux',
            cost: 30000,
            riskLevel: 2,
            impact: { playerMarketShare: 5 },
            legalRisk: false,
          }],
        });
      }
      break;
      
    case 'scandal_search':
      if (Math.random() < 0.3) {
        secrets.push({
          id: `secret_${Date.now()}`,
          type: 'scandal',
          description: `Pratiques douteuses découvertes chez ${competitor.name}`,
          value: 50000,
          discoveredAt: Date.now(),
          canExploit: true,
          exploitOptions: [
            {
              id: 'exploit_media',
              name: 'Fuite médias',
              description: 'Révélez le scandale aux médias',
              cost: 10000,
              riskLevel: 3,
              impact: { competitorMarketShare: -10, playerReputation: -5 },
              legalRisk: true,
            },
            {
              id: 'exploit_blackmail',
              name: 'Chantage',
              description: 'Négociez leur silence contre des avantages',
              cost: 0,
              riskLevel: 5,
              impact: { playerRevenue: 20 },
              legalRisk: true,
            },
          ],
        });
      }
      break;
      
    default:
      break;
  }
  
  // Ajouter des faiblesses découvertes
  if (success && Math.random() < 0.4) {
    weaknesses.push(...competitor.weaknesses.filter(w => Math.random() < 0.5));
  }
  
  return { success, detected, results: { secrets, weaknesses } };
}

// ==================== CALCUL DES ACTIONS PLANIFIÉES ====================

export function planNextAction(
  competitor: AdvancedCompetitorAI,
  context: AIDecisionContext,
  day: number
): PlannedAction | undefined {
  const decision = makeAIDecision(context);
  if (!decision) return undefined;
  
  // Délai basé sur le type d'action
  const actionDelays: Partial<Record<AIActionType, number>> = {
    price_cut: 3,
    marketing_blitz: 7,
    product_launch: 30,
    acquisition_attempt: 60,
    merger: 90,
    expansion: 45,
    layoffs: 14,
    sabotage: 21,
    alliance_formation: 14,
  };
  
  const delay = actionDelays[decision] || 14;
  
  return {
    type: decision,
    targetDate: day + delay,
    probability: 0.7 + (competitor.aggressiveness / 100) * 0.3,
    canBeBlocked: ['price_cut', 'talent_poaching', 'sabotage'].includes(decision),
    blockCost: Math.floor(competitor.treasury * 0.1),
  };
}

// ==================== TICK DU SYSTÈME DE COMPÉTITION ====================

export interface CompetitionTickResult {
  updatedCompetitors: AdvancedCompetitorAI[];
  playerEffects: {
    marketShare?: number;
    reputation?: number;
    revenue?: number;
    treasury?: number;
  };
  newEvents: {
    id: string;
    competitorId: string;
    action: AIActionType;
    description: string;
    severity: 'info' | 'warning' | 'critical';
  }[];
  marketChanges: {
    priceIndex?: number;
    totalMarketSize?: number;
  };
}

export function processCompetitionTick(
  competitors: AdvancedCompetitorAI[],
  player: Company,
  gameState: GameState,
  day: number
): CompetitionTickResult {
  const result: CompetitionTickResult = {
    updatedCompetitors: [],
    playerEffects: {},
    newEvents: [],
    marketChanges: {},
  };
  
  let cumulativePlayerEffects = {
    marketShare: 0,
    reputation: 0,
    revenue: 0,
    treasury: 0,
  };
  
  for (const competitor of competitors) {
    // 20% chance par jour qu'un concurrent agisse
    if (Math.random() < 0.2) {
      const context: AIDecisionContext = {
        competitor,
        player,
        allCompetitors: competitors,
        gameState,
        currentEvents: [],
      };
      
      const action = makeAIDecision(context);
      
      if (action) {
        const { updatedCompetitor, impact } = executeAIAction(
          competitor,
          action,
          competitor.targetingPlayer ? 'player' : `comp_${Math.floor(Math.random() * competitors.length)}`,
          day
        );
        
        result.updatedCompetitors.push(updatedCompetitor);
        
        // Appliquer les impacts sur le joueur
        if (impact.playerMarketShare) cumulativePlayerEffects.marketShare += impact.playerMarketShare;
        if (impact.playerReputation) cumulativePlayerEffects.reputation += impact.playerReputation;
        if (impact.playerRevenue) cumulativePlayerEffects.revenue += impact.playerRevenue;
        
        // Créer un événement si significatif
        if (competitor.targetingPlayer || impact.playerMarketShare || impact.playerReputation) {
          result.newEvents.push({
            id: `event_${Date.now()}_${Math.random()}`,
            competitorId: competitor.id,
            action,
            description: generateActionDescription(competitor, action, impact),
            severity: Math.abs(impact.playerMarketShare || 0) > 5 ? 'critical' : 
                     Math.abs(impact.playerMarketShare || 0) > 2 ? 'warning' : 'info',
          });
        }
      } else {
        result.updatedCompetitors.push(competitor);
      }
    } else {
      result.updatedCompetitors.push(competitor);
    }
  }
  
  result.playerEffects = cumulativePlayerEffects;
  
  return result;
}

function generateActionDescription(
  competitor: AdvancedCompetitorAI,
  action: AIActionType,
  impact: ActionImpact
): string {
  const descriptions: Record<AIActionType, string> = {
    price_cut: `${competitor.name} a lancé une guerre des prix`,
    price_increase: `${competitor.name} a augmenté ses prix`,
    marketing_blitz: `${competitor.name} a lancé une campagne marketing massive`,
    viral_campaign: `${competitor.name} fait le buzz sur les réseaux sociaux`,
    product_launch: `${competitor.name} a lancé un nouveau produit`,
    product_discontinue: `${competitor.name} a arrêté un de ses produits`,
    talent_poaching: `${competitor.name} débauche des talents`,
    mass_hiring: `${competitor.name} recrute massivement`,
    expansion: `${competitor.name} s'étend sur de nouveaux marchés`,
    merger: `${competitor.name} fusionne avec un autre acteur`,
    acquisition_attempt: `${competitor.name} tente une acquisition`,
    patent_filing: `${competitor.name} a déposé de nouveaux brevets`,
    lawsuit: `${competitor.name} vous attaque en justice`,
    sabotage: `Sabotage suspecté venant de ${competitor.name}`,
    espionage: `${competitor.name} semble vous espionner`,
    alliance_formation: `${competitor.name} a formé une alliance`,
    alliance_break: `${competitor.name} a rompu une alliance`,
    public_statement: `${competitor.name} a fait une déclaration publique`,
    press_conference: `${competitor.name} organise une conférence de presse`,
    investor_pitch: `${competitor.name} lève des fonds`,
    ipo_announcement: `${competitor.name} annonce une introduction en bourse`,
    layoffs: `${competitor.name} licencie du personnel`,
    restructuring: `${competitor.name} se restructure`,
    partnership: `${competitor.name} signe un partenariat`,
    exclusive_deal: `${competitor.name} signe un contrat exclusif`,
  };
  
  return descriptions[action] || `${competitor.name} a pris une action`;
}
