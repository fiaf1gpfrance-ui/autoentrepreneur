// Moteur de gestion de la réputation

import {
  ReputationState,
  ReputationScore,
  Scandal,
  Rumor,
  CrisisPhase,
  CrisisResponse,
  StakeholderType,
  PRAgent,
  Influencer,
  Ambassador,
  MediaOutlet,
  ViralEvent,
  MEDIA_OUTLET_TEMPLATES,
  SCANDAL_TEMPLATES,
  PR_AGENCY_TEMPLATES,
  INFLUENCER_TEMPLATES,
  ScandalType,
  PRAgency,
  LobbyingCampaign
} from "@/types/reputation";

// Initialiser l'état de réputation
export function initializeReputationState(): ReputationState {
  return {
    score: {
      overall: 70,
      byStakeholder: {
        clients: 70,
        employees: 70,
        investors: 70,
        media: 50,
        regulators: 60,
        public: 65
      },
      bySector: {},
      byRegion: { 'FR': 70 },
      trend: 'stable',
      history: [{ day: 1, score: 70 }]
    },
    mediaOutlets: MEDIA_OUTLET_TEMPLATES.map((m, i) => ({
      ...m,
      id: `media_${i}`,
      journalists: generateJournalists(2)
    })),
    socialMedia: [
      { platform: 'LinkedIn', followers: 500, engagement: 3, sentiment: 20, viralPotential: 30 },
      { platform: 'Twitter', followers: 200, engagement: 2, sentiment: 0, viralPotential: 60 },
      { platform: 'Facebook', followers: 800, engagement: 1.5, sentiment: 10, viralPotential: 40 }
    ],
    influencers: [],
    ambassadors: [],
    scandals: [],
    activeRumors: [],
    viralEvents: [],
    prAgents: [],
    contractedAgencies: [],
    lobbyingCampaigns: [],
    pressReleases: [],
    mediaEvents: [],
    crisisBudget: 0
  };
}

function generateJournalists(count: number) {
  const firstNames = ['Marie', 'Jean', 'Sophie', 'Pierre', 'Claire', 'Thomas', 'Julie', 'Nicolas'];
  const lastNames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Durand', 'Moreau', 'Simon', 'Laurent'];
  const specialties = ['Économie', 'Tech', 'Société', 'Environnement', 'Social'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `journalist_${Date.now()}_${i}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    specialty: specialties[Math.floor(Math.random() * specialties.length)],
    reputation: 50 + Math.floor(Math.random() * 40),
    relationship: -20 + Math.floor(Math.random() * 40),
    corruptible: Math.random() < 0.2,
    bribeAmount: Math.random() < 0.2 ? 5000 + Math.floor(Math.random() * 20000) : undefined
  }));
}

// Calculer le score global de réputation
export function calculateOverallReputation(state: ReputationState): number {
  const stakeholderWeights: Record<StakeholderType, number> = {
    clients: 0.25,
    employees: 0.15,
    investors: 0.20,
    media: 0.15,
    regulators: 0.10,
    public: 0.15
  };
  
  let weighted = 0;
  for (const [stakeholder, weight] of Object.entries(stakeholderWeights)) {
    weighted += state.score.byStakeholder[stakeholder as StakeholderType] * weight;
  }
  
  // Bonus influenceurs et ambassadeurs
  const influencerBonus = state.influencers.reduce((sum, i) => sum + i.reputationBoost, 0);
  const ambassadorBonus = state.ambassadors.reduce((sum, a) => sum + a.reputationBoost, 0);
  
  // Malus scandales actifs
  const scandalMalus = state.scandals
    .filter(s => s.phase !== 'resolved')
    .reduce((sum, s) => sum + (s.reputationDamage * (s.mediaAttention / 100)), 0);
  
  return Math.max(0, Math.min(100, weighted + influencerBonus + ambassadorBonus - scandalMalus));
}

// Tick quotidien de la réputation
export function processReputationTick(state: ReputationState, day: number): ReputationState {
  let newState = { ...state };
  
  // Évolution des rumeurs
  newState.activeRumors = newState.activeRumors
    .map(rumor => {
      const newReach = Math.min(100, rumor.currentReach + rumor.spreadRate);
      
      // Convertir en scandale si atteint seuil
      if (rumor.canBecomeScandal && newReach >= 70 && rumor.scandalType) {
        const scandalTemplate = SCANDAL_TEMPLATES.find(s => s.type === rumor.scandalType);
        if (scandalTemplate) {
          newState.scandals.push({
            ...scandalTemplate,
            id: `scandal_${Date.now()}`,
            startDay: day,
            responses: []
          });
        }
        return null; // Supprimer la rumeur
      }
      
      return { ...rumor, currentReach: newReach };
    })
    .filter(Boolean) as Rumor[];
  
  // Évolution des scandales
  newState.scandals = newState.scandals.map(scandal => {
    if (scandal.phase === 'resolved') return scandal;
    
    // Propagation naturelle si non géré
    let newPhase: CrisisPhase = scandal.phase;
    let newMediaAttention = scandal.mediaAttention;
    
    const daysSinceStart = day - scandal.startDay;
    
    if (scandal.responses.length === 0) {
      // Pas de réponse = aggravation
      newMediaAttention = Math.min(100, scandal.mediaAttention + 5);
      
      if (daysSinceStart > 3 && scandal.phase === 'rumor') newPhase = 'article';
      else if (daysSinceStart > 7 && scandal.phase === 'article') newPhase = 'viral';
      else if (daysSinceStart > 14 && scandal.phase === 'viral') newPhase = 'investigation';
      else if (daysSinceStart > 30 && scandal.phase === 'investigation') newPhase = 'trial';
    }
    
    // Décroissance naturelle si géré
    if (scandal.resolutionProgress >= 80) {
      newMediaAttention = Math.max(0, scandal.mediaAttention - 3);
      if (newMediaAttention === 0) newPhase = 'resolved';
    }
    
    return {
      ...scandal,
      phase: newPhase,
      mediaAttention: newMediaAttention,
      isPublic: newPhase !== 'rumor'
    };
  });
  
  // Évolution des événements viraux
  newState.viralEvents = newState.viralEvents
    .map(event => {
      const daysSinceStart = day - event.startDay;
      const decayedScore = event.viralityScore * Math.pow(1 - event.decayRate, daysSinceStart);
      
      if (decayedScore < 5) return null;
      
      return { ...event, viralityScore: decayedScore };
    })
    .filter(Boolean) as ViralEvent[];
  
  // Mise à jour du score
  newState.score.overall = calculateOverallReputation(newState);
  
  // Tendance
  const lastScore = newState.score.history[newState.score.history.length - 1]?.score || 70;
  if (newState.score.overall > lastScore + 2) newState.score.trend = 'rising';
  else if (newState.score.overall < lastScore - 2) newState.score.trend = 'falling';
  else newState.score.trend = 'stable';
  
  // Historique
  newState.score.history.push({ day, score: newState.score.overall });
  if (newState.score.history.length > 365) {
    newState.score.history = newState.score.history.slice(-365);
  }
  
  // Lobbying progress
  newState.lobbyingCampaigns = newState.lobbyingCampaigns.map(campaign => {
    if (campaign.progress >= 100) return campaign;
    
    const dailyProgress = 100 / campaign.estimatedDuration;
    return { ...campaign, progress: Math.min(100, campaign.progress + dailyProgress) };
  });
  
  return newState;
}

// Répondre à une crise
export function respondToCrisis(
  state: ReputationState,
  scandalId: string,
  response: CrisisResponse,
  day: number,
  budget: number
): { state: ReputationState; success: boolean; message: string } {
  const scandal = state.scandals.find(s => s.id === scandalId);
  if (!scandal) return { state, success: false, message: "Scandale non trouvé" };
  
  const responseEffects: Record<CrisisResponse, { effectiveness: number; perception: number; costMultiplier: number }> = {
    deny: { effectiveness: 20, perception: -20, costMultiplier: 0.5 },
    apologize: { effectiveness: 60, perception: 30, costMultiplier: 1 },
    blame: { effectiveness: 30, perception: -10, costMultiplier: 0.3 },
    compensate: { effectiveness: 80, perception: 40, costMultiplier: 2 },
    silence: { effectiveness: 10, perception: -30, costMultiplier: 0 },
    counter_attack: { effectiveness: 40, perception: -15, costMultiplier: 1.5 },
    legal_action: { effectiveness: 50, perception: 0, costMultiplier: 3 }
  };
  
  const effect = responseEffects[response];
  const cost = budget * effect.costMultiplier;
  
  // Bonus des agents PR
  const prBonus = state.prAgents
    .filter(a => a.type === 'crisis_manager')
    .reduce((sum, a) => sum + a.effectiveness * 0.1, 0);
  
  // Bonus des agences
  const agencyBonus = state.contractedAgencies
    .reduce((sum, a) => sum + a.crisisBonus * 0.01, 0);
  
  const finalEffectiveness = Math.min(100, effect.effectiveness + prBonus + agencyBonus);
  
  const newResponse = {
    type: response,
    day,
    cost,
    effectiveness: finalEffectiveness,
    publicPerception: effect.perception
  };
  
  const newScandals = state.scandals.map(s => {
    if (s.id !== scandalId) return s;
    
    const newProgress = Math.min(100, s.resolutionProgress + finalEffectiveness / 2);
    const newMediaAttention = Math.max(0, s.mediaAttention - finalEffectiveness / 3);
    
    return {
      ...s,
      responses: [...s.responses, newResponse],
      resolutionProgress: newProgress,
      mediaAttention: newMediaAttention
    };
  });
  
  // Impact sur les stakeholders
  const newStakeholders = { ...state.score.byStakeholder };
  scandal.stakeholdersAffected.forEach(stakeholder => {
    newStakeholders[stakeholder] = Math.max(0, Math.min(100,
      newStakeholders[stakeholder] + effect.perception * 0.5
    ));
  });
  
  return {
    state: {
      ...state,
      scandals: newScandals,
      crisisBudget: state.crisisBudget - cost,
      score: {
        ...state.score,
        byStakeholder: newStakeholders
      }
    },
    success: true,
    message: `Réponse "${response}" appliquée avec ${finalEffectiveness.toFixed(0)}% d'efficacité`
  };
}

// Recruter un agent PR
export function hirePRAgent(
  state: ReputationState,
  agentType: PRAgent['type'],
  level: number
): { state: ReputationState; agent: PRAgent } {
  const salaries: Record<PRAgent['type'], number[]> = {
    press_officer: [2500, 3500, 5000, 7000, 10000],
    community_manager: [2000, 3000, 4500, 6000, 8000],
    lobbyist: [4000, 6000, 9000, 12000, 18000],
    crisis_manager: [5000, 7500, 10000, 15000, 25000],
    influencer_manager: [3000, 4500, 6500, 9000, 12000]
  };
  
  const firstNames = ['Marie', 'Jean', 'Sophie', 'Pierre', 'Claire'];
  const lastNames = ['Martin', 'Bernard', 'Petit', 'Dubois', 'Moreau'];
  
  const agent: PRAgent = {
    id: `pr_${Date.now()}`,
    name: `${firstNames[Math.floor(Math.random() * 5)]} ${lastNames[Math.floor(Math.random() * 5)]}`,
    type: agentType,
    level,
    salary: salaries[agentType][level - 1],
    skills: [],
    effectiveness: 40 + level * 12,
    experience: 0,
    hiredDay: 0,
    assignments: []
  };
  
  return {
    state: { ...state, prAgents: [...state.prAgents, agent] },
    agent
  };
}

// Contracter une agence
export function contractPRAgency(
  state: ReputationState,
  agencyId: string,
  duration: number,
  day: number
): ReputationState {
  const agency = PR_AGENCY_TEMPLATES.find((_, i) => `agency_${i}` === agencyId);
  if (!agency) return state;
  
  const contractedAgency: PRAgency = {
    ...agency,
    id: agencyId,
    isContracted: true,
    contractEnd: day + duration
  };
  
  return {
    ...state,
    contractedAgencies: [...state.contractedAgencies, contractedAgency]
  };
}

// Engager un influenceur
export function hireInfluencer(
  state: ReputationState,
  influencerId: string,
  duration: number,
  day: number
): ReputationState {
  const template = INFLUENCER_TEMPLATES.find((_, i) => `influencer_${i}` === influencerId);
  if (!template) return state;
  
  const influencer: Influencer = {
    ...template,
    id: influencerId,
    contractEnd: day + duration
  };
  
  return {
    ...state,
    influencers: [...state.influencers, influencer]
  };
}

// Générer une rumeur aléatoire
export function generateRandomRumor(day: number, reputationScore: number): Rumor {
  const rumorTypes = [
    { content: "Des sources internes parlent de problèmes financiers", isTrue: false, canBecomeScandal: true, scandalType: 'financial_fraud' as ScandalType },
    { content: "Un employé aurait dénoncé des conditions de travail difficiles", isTrue: true, canBecomeScandal: true, scandalType: 'labor_abuse' as ScandalType },
    { content: "Le PDG serait en négociation pour vendre l'entreprise", isTrue: false, canBecomeScandal: false },
    { content: "Un produit aurait causé des problèmes chez un client", isTrue: true, canBecomeScandal: true, scandalType: 'product_defect' as ScandalType },
    { content: "L'entreprise délocaliserait une partie de sa production", isTrue: false, canBecomeScandal: false }
  ];
  
  const template = rumorTypes[Math.floor(Math.random() * rumorTypes.length)];
  
  // Moins bonne réputation = rumeurs plus rapides
  const spreadRate = (100 - reputationScore) / 20 + 1;
  
  return {
    id: `rumor_${Date.now()}`,
    content: template.content,
    isTrue: template.isTrue,
    spreadRate,
    currentReach: 5,
    startDay: day,
    canBecomeScandal: template.canBecomeScandal,
    scandalType: template.scandalType
  };
}

// Lancer une campagne de lobbying
export function startLobbyingCampaign(
  state: ReputationState,
  target: LobbyingCampaign['target'],
  objective: string,
  budget: number,
  day: number
): ReputationState {
  const campaign: LobbyingCampaign = {
    id: `lobby_${Date.now()}`,
    target,
    objective,
    budget,
    progress: 0,
    startDay: day,
    estimatedDuration: Math.max(30, 180 - budget / 1000),
    successProbability: Math.min(90, 30 + budget / 500),
    benefits: []
  };
  
  return {
    ...state,
    lobbyingCampaigns: [...state.lobbyingCampaigns, campaign]
  };
}

// Publier un communiqué de presse
export function publishPressRelease(
  state: ReputationState,
  title: string,
  content: string,
  budget: number,
  day: number
): ReputationState {
  // Calcul de la portée basée sur le budget et les relations médias
  const baseReach = budget / 100;
  const mediaBonus = state.prAgents
    .filter(a => a.type === 'press_officer')
    .reduce((sum, a) => sum + a.effectiveness, 0);
  
  const reach = Math.min(100, baseReach + mediaBonus);
  const sentiment = Math.min(50, reach / 2);
  
  const pressRelease = {
    id: `pr_${Date.now()}`,
    title,
    content,
    day,
    reach,
    sentiment,
    cost: budget
  };
  
  // Impact sur la réputation média
  const newStakeholders = { ...state.score.byStakeholder };
  newStakeholders.media = Math.min(100, newStakeholders.media + reach * 0.1);
  newStakeholders.public = Math.min(100, newStakeholders.public + reach * 0.05);
  
  return {
    ...state,
    pressReleases: [...state.pressReleases, pressRelease],
    score: { ...state.score, byStakeholder: newStakeholders }
  };
}

// Calculer l'impact de la réputation sur les assurances
export function getReputationInsuranceModifier(reputationScore: number): number {
  // Bonne réputation = primes moins chères
  // Mauvaise réputation = primes plus chères ou refus
  if (reputationScore >= 80) return -0.15; // -15%
  if (reputationScore >= 60) return 0;
  if (reputationScore >= 40) return 0.20; // +20%
  if (reputationScore >= 20) return 0.50; // +50%
  return 1.0; // +100% ou refus possible
}
