// Moteur de gestion des assurances

import {
  InsuranceState,
  Insurance,
  InsuranceType,
  Claim,
  Incident,
  Risk,
  RiskType,
  ClaimStatus,
  InsuranceProvider,
  InsuranceBroker,
  INSURANCE_DEFINITIONS,
  INSURANCE_PROVIDER_TEMPLATES,
  RISK_TEMPLATES,
  BROKER_TEMPLATES
} from "@/types/insurance";
import { getReputationInsuranceModifier } from "./reputationEngine";

// Initialiser l'état des assurances
export function initializeInsuranceState(): InsuranceState {
  return {
    policies: [],
    claims: [],
    incidents: [],
    providers: INSURANCE_PROVIDER_TEMPLATES.map((p, i) => ({ ...p, id: `provider_${i}` })),
    broker: undefined,
    totalPremiums: 0,
    totalCoverage: 0,
    claimsThisYear: 0,
    averageBonusMalus: 0,
    insuranceScore: 70,
    lastAssessment: 0
  };
}

// Calculer le score de risque de l'entreprise
export function calculateInsuranceScore(
  state: InsuranceState,
  reputationScore: number,
  employeeCount: number,
  revenue: number,
  yearsInBusiness: number
): number {
  let score = 50;
  
  // Historique des sinistres
  score -= state.claimsThisYear * 5;
  
  // Réputation
  score += (reputationScore - 50) * 0.3;
  
  // Taille (plus grande = plus de risque mais aussi plus stable)
  if (employeeCount > 100) score += 5;
  else if (employeeCount < 10) score -= 5;
  
  // Ancienneté
  score += Math.min(15, yearsInBusiness * 2);
  
  // Revenue stable
  if (revenue > 1000000) score += 10;
  else if (revenue < 100000) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

// Souscrire une assurance
export function subscribeInsurance(
  state: InsuranceState,
  insuranceType: InsuranceType,
  providerId: string,
  coverageLevel: Insurance['coverageLevel'],
  reputationScore: number,
  day: number
): { state: InsuranceState; success: boolean; message: string; insurance?: Insurance } {
  const template = INSURANCE_DEFINITIONS.find(d => d.type === insuranceType);
  const provider = state.providers.find(p => p.id === providerId);
  
  if (!template || !provider) {
    return { state, success: false, message: "Assurance ou fournisseur introuvable" };
  }
  
  // Vérifier si le provider peut assurer ce type
  if (!provider.specialties.includes(insuranceType)) {
    return { state, success: false, message: `${provider.name} ne propose pas cette assurance` };
  }
  
  // Vérifier le seuil de réputation
  const reputationModifier = getReputationInsuranceModifier(reputationScore);
  if (reputationScore < provider.refusalThreshold) {
    return { state, success: false, message: `${provider.name} refuse de vous assurer (réputation trop basse)` };
  }
  
  // Calculer le prix
  const levelMultipliers = { basic: 0.7, standard: 1, premium: 1.5, unlimited: 2.5 };
  const coverageMultipliers = { basic: 0.5, standard: 1, premium: 2, unlimited: 5 };
  
  const basePremium = template.monthlyPremium;
  const finalPremium = Math.round(
    basePremium * 
    provider.priceMultiplier * 
    levelMultipliers[coverageLevel] *
    (1 + reputationModifier) *
    (1 - (state.broker?.effectiveness || 0) / 100)
  );
  
  const coverageAmount = Math.round(template.coverageAmount * coverageMultipliers[coverageLevel]);
  
  const insurance: Insurance = {
    id: `insurance_${Date.now()}`,
    type: insuranceType,
    category: template.category,
    name: template.name,
    description: template.description,
    provider,
    status: 'active',
    coverageLevel,
    coverageAmount,
    deductible: Math.round(template.deductible * (coverageLevel === 'basic' ? 2 : coverageLevel === 'premium' ? 0.5 : 1)),
    monthlyPremium: finalPremium,
    yearlyPremium: finalPremium * 11, // 11 mois payés pour 12 de couverture
    bonusMalus: 0,
    claimsHistory: 0,
    startDate: day,
    endDate: day + 365,
    lastPayment: day,
    coveredRisks: template.coveredRisks,
    exclusions: template.exclusions
  };
  
  return {
    state: {
      ...state,
      policies: [...state.policies, insurance],
      totalPremiums: state.totalPremiums + finalPremium,
      totalCoverage: state.totalCoverage + coverageAmount
    },
    success: true,
    message: `Assurance ${template.name} souscrite chez ${provider.name}`,
    insurance
  };
}

// Résilier une assurance
export function cancelInsurance(state: InsuranceState, insuranceId: string): InsuranceState {
  const insurance = state.policies.find(p => p.id === insuranceId);
  if (!insurance) return state;
  
  return {
    ...state,
    policies: state.policies.map(p => 
      p.id === insuranceId ? { ...p, status: 'cancelled' as const } : p
    ),
    totalPremiums: state.totalPremiums - insurance.monthlyPremium,
    totalCoverage: state.totalCoverage - insurance.coverageAmount
  };
}

// Engager un courtier
export function hireBroker(state: InsuranceState, brokerId: string): InsuranceState {
  const brokerTemplate = BROKER_TEMPLATES.find((_, i) => `broker_${i}` === brokerId);
  if (!brokerTemplate) return state;
  
  const broker: InsuranceBroker = {
    ...brokerTemplate,
    id: brokerId,
    isContracted: true
  };
  
  // Recalculer les primes avec le courtier
  const newPolicies = state.policies.map(policy => {
    const newPremium = Math.round(policy.monthlyPremium * (1 - broker.effectiveness / 100));
    return { ...policy, monthlyPremium: newPremium };
  });
  
  return {
    ...state,
    broker,
    policies: newPolicies,
    totalPremiums: newPolicies.reduce((sum, p) => sum + p.monthlyPremium, 0)
  };
}

// Simuler un incident
export function triggerIncident(
  state: InsuranceState,
  riskType: RiskType,
  day: number
): { state: InsuranceState; incident: Incident; isCovered: boolean; claim?: Claim } {
  const riskTemplate = RISK_TEMPLATES.find(r => r.type === riskType);
  if (!riskTemplate) {
    const defaultIncident: Incident = {
      id: `incident_${Date.now()}`,
      type: riskType,
      title: "Incident",
      description: "Un incident s'est produit",
      date: day,
      severity: 5,
      directDamage: 10000,
      indirectDamage: 5000,
      isCovered: false,
      isResolved: false,
      resolutionCost: 0,
      daysSinceIncident: 0
    };
    return { state, incident: defaultIncident, isCovered: false };
  }
  
  const severity = 1 + Math.floor(Math.random() * 10);
  const damageMultiplier = severity / 5;
  const directDamage = Math.round(riskTemplate.baseDamage * damageMultiplier + Math.random() * (riskTemplate.maxDamage - riskTemplate.baseDamage) * damageMultiplier * 0.3);
  const indirectDamage = Math.round(directDamage * 0.3);
  
  // Vérifier la couverture
  const applicableInsurance = state.policies.find(p => 
    p.status === 'active' && 
    riskTemplate.requiredInsurance.includes(p.type)
  );
  
  const incident: Incident = {
    id: `incident_${Date.now()}`,
    type: riskType,
    title: riskTemplate.name,
    description: riskTemplate.description,
    date: day,
    severity,
    directDamage,
    indirectDamage,
    isCovered: !!applicableInsurance,
    applicableInsurance: applicableInsurance?.type,
    isResolved: false,
    resolutionCost: 0,
    daysSinceIncident: 0
  };
  
  let newState = {
    ...state,
    incidents: [...state.incidents, incident]
  };
  
  // Créer une réclamation si couvert
  if (applicableInsurance) {
    const claim = createClaim(newState, incident, applicableInsurance, day);
    newState = claim.state;
    return { state: newState, incident: { ...incident, claimId: claim.claim.id }, isCovered: true, claim: claim.claim };
  }
  
  return { state: newState, incident, isCovered: false };
}

// Créer une réclamation
function createClaim(
  state: InsuranceState,
  incident: Incident,
  insurance: Insurance,
  day: number
): { state: InsuranceState; claim: Claim } {
  const claim: Claim = {
    id: `claim_${Date.now()}`,
    insuranceId: insurance.id,
    insuranceType: insurance.type,
    status: 'pending',
    eventType: incident.type,
    eventDate: incident.date,
    reportDate: day,
    description: incident.description,
    claimedAmount: incident.directDamage,
    deductibleApplied: insurance.deductible,
    documents: [],
    notes: [],
    reputationImpact: 0,
    businessImpact: incident.indirectDamage
  };
  
  return {
    state: {
      ...state,
      claims: [...state.claims, claim],
      claimsThisYear: state.claimsThisYear + 1
    },
    claim
  };
}

// Traiter une réclamation
export function processClaim(
  state: InsuranceState,
  claimId: string,
  approve: boolean,
  day: number
): InsuranceState {
  const claim = state.claims.find(c => c.id === claimId);
  if (!claim) return state;
  
  const insurance = state.policies.find(p => p.id === claim.insuranceId);
  if (!insurance) return state;
  
  if (approve) {
    const approvedAmount = Math.min(claim.claimedAmount, insurance.coverageAmount);
    const paidAmount = Math.max(0, approvedAmount - claim.deductibleApplied);
    
    // Mettre à jour le bonus/malus
    const newBonusMalus = Math.min(100, insurance.bonusMalus + 10);
    
    return {
      ...state,
      claims: state.claims.map(c => 
        c.id === claimId 
          ? { 
              ...c, 
              status: 'paid' as ClaimStatus, 
              approvedAmount, 
              paidAmount,
              resolutionDate: day 
            } 
          : c
      ),
      policies: state.policies.map(p => 
        p.id === insurance.id 
          ? { 
              ...p, 
              claimsHistory: p.claimsHistory + 1,
              bonusMalus: newBonusMalus,
              monthlyPremium: Math.round(p.monthlyPremium * (1 + newBonusMalus / 200))
            } 
          : p
      ),
      incidents: state.incidents.map(i => 
        i.claimId === claimId ? { ...i, isResolved: true } : i
      )
    };
  } else {
    return {
      ...state,
      claims: state.claims.map(c => 
        c.id === claimId 
          ? { ...c, status: 'rejected' as ClaimStatus, resolutionDate: day } 
          : c
      )
    };
  }
}

// Tick mensuel des assurances
export function processInsuranceMonthlyTick(state: InsuranceState, day: number): InsuranceState {
  // Vérifier les expirations
  const updatedPolicies = state.policies.map(policy => {
    if (policy.status === 'active' && day >= policy.endDate) {
      return { ...policy, status: 'expired' as const };
    }
    
    // Renouvellement automatique avec bonus
    if (policy.status === 'active' && policy.claimsHistory === 0) {
      const yearsSinceStart = Math.floor((day - policy.startDate) / 365);
      const bonusReduction = Math.min(50, yearsSinceStart * 5); // -5% par an sans sinistre, max -50%
      return { ...policy, bonusMalus: -bonusReduction };
    }
    
    return policy;
  });
  
  // Calculer les totaux
  const activePolicies = updatedPolicies.filter(p => p.status === 'active');
  const totalPremiums = activePolicies.reduce((sum, p) => sum + p.monthlyPremium, 0);
  const totalCoverage = activePolicies.reduce((sum, p) => sum + p.coverageAmount, 0);
  const averageBonusMalus = activePolicies.length > 0
    ? activePolicies.reduce((sum, p) => sum + p.bonusMalus, 0) / activePolicies.length
    : 0;
  
  return {
    ...state,
    policies: updatedPolicies,
    totalPremiums,
    totalCoverage,
    averageBonusMalus
  };
}

// Obtenir les risques non couverts
export function getUncoveredRisks(state: InsuranceState): Risk[] {
  const coveredTypes = new Set(
    state.policies
      .filter(p => p.status === 'active')
      .map(p => p.type)
  );
  
  return RISK_TEMPLATES.filter(risk => 
    !risk.requiredInsurance.every(ins => coveredTypes.has(ins))
  ).map((r, i) => ({ ...r, id: `risk_${i}` }));
}

// Calculer le coût total si non assuré
export function calculateUninsuredExposure(state: InsuranceState): number {
  const uncoveredRisks = getUncoveredRisks(state);
  
  return uncoveredRisks.reduce((total, risk) => {
    // Exposition = probabilité * dommage moyen
    const averageDamage = (risk.baseDamage + risk.maxDamage) / 2;
    return total + (risk.probability / 100) * averageDamage;
  }, 0);
}

// Recommandations d'assurance
export function getInsuranceRecommendations(
  state: InsuranceState,
  employeeCount: number,
  hasInternational: boolean,
  hasProducts: boolean
): { type: InsuranceType; priority: 'critical' | 'high' | 'medium' | 'low'; reason: string }[] {
  const recommendations: { type: InsuranceType; priority: 'critical' | 'high' | 'medium' | 'low'; reason: string }[] = [];
  const existingTypes = new Set(state.policies.filter(p => p.status === 'active').map(p => p.type));
  
  // RC Pro - toujours critique
  if (!existingTypes.has('civil_liability')) {
    recommendations.push({
      type: 'civil_liability',
      priority: 'critical',
      reason: "Protection essentielle contre les réclamations de tiers"
    });
  }
  
  // Locaux - critique si propriétés
  if (!existingTypes.has('property')) {
    recommendations.push({
      type: 'property',
      priority: 'high',
      reason: "Protège vos locaux et équipements"
    });
  }
  
  // Accidents travail - selon effectif
  if (!existingTypes.has('workplace_accident') && employeeCount > 5) {
    recommendations.push({
      type: 'workplace_accident',
      priority: 'high',
      reason: `${employeeCount} employés exposés aux accidents`
    });
  }
  
  // Cyber - selon taille
  if (!existingTypes.has('cyber') && employeeCount > 10) {
    recommendations.push({
      type: 'cyber',
      priority: 'high',
      reason: "Risque cyber croissant pour les entreprises"
    });
  }
  
  // Homme-clé - selon taille
  if (!existingTypes.has('key_person') && employeeCount > 20) {
    recommendations.push({
      type: 'key_person',
      priority: 'medium',
      reason: "Protège contre la perte de personnes clés"
    });
  }
  
  // Transport - si produits
  if (!existingTypes.has('transport') && hasProducts) {
    recommendations.push({
      type: 'transport',
      priority: 'medium',
      reason: "Couvre les marchandises en transit"
    });
  }
  
  // Risques politiques - si international
  if (!existingTypes.has('political_risk') && hasInternational) {
    recommendations.push({
      type: 'political_risk',
      priority: 'medium',
      reason: "Protection pour vos opérations internationales"
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
