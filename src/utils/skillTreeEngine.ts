// Moteur de l'arbre de compétences

import { 
  Skill, 
  SkillTreeState, 
  SkillCategory, 
  SkillTier,
  SpecializationPath,
  SkillMilestone,
  SKILL_DEFINITIONS,
  SPECIALIZATION_DEFINITIONS,
  SKILL_MILESTONES,
  SkillEffect
} from "@/types/skillTree";

// Initialiser l'arbre de compétences
export function initializeSkillTree(): SkillTreeState {
  const skills: Record<string, Skill> = {};
  
  SKILL_DEFINITIONS.forEach(skillDef => {
    skills[skillDef.id] = {
      ...skillDef,
      currentLevel: 0,
      isUnlocked: skillDef.tier === 1 && skillDef.prerequisites.length === 0
    };
  });

  return {
    skillPoints: 5, // Points de départ
    totalSkillPointsEarned: 5,
    skills,
    unlockedSpecializations: [],
    activeSpecialization: undefined,
    milestones: SKILL_MILESTONES.map(m => ({ ...m }))
  };
}

// Vérifier si une compétence peut être débloquée
export function canUnlockSkill(state: SkillTreeState, skillId: string): { canUnlock: boolean; reason?: string } {
  const skill = state.skills[skillId];
  
  if (!skill) {
    return { canUnlock: false, reason: "Compétence introuvable" };
  }
  
  if (skill.currentLevel >= skill.maxLevel) {
    return { canUnlock: false, reason: "Niveau maximum atteint" };
  }
  
  const cost = getSkillCost(skill);
  if (state.skillPoints < cost) {
    return { canUnlock: false, reason: `Points insuffisants (${state.skillPoints}/${cost})` };
  }
  
  // Vérifier les prérequis
  for (const prereqId of skill.prerequisites) {
    const prereq = state.skills[prereqId];
    if (!prereq || prereq.currentLevel === 0) {
      return { canUnlock: false, reason: `Prérequis manquant: ${prereq?.name || prereqId}` };
    }
  }
  
  return { canUnlock: true };
}

// Calculer le coût d'une compétence (augmente avec le niveau)
export function getSkillCost(skill: Skill): number {
  const baseCost = skill.cost;
  const levelMultiplier = skill.currentLevel > 0 ? 1 + (skill.currentLevel * 0.5) : 1;
  return Math.ceil(baseCost * levelMultiplier);
}

// Débloquer/améliorer une compétence
export function unlockSkill(state: SkillTreeState, skillId: string): SkillTreeState {
  const { canUnlock, reason } = canUnlockSkill(state, skillId);
  
  if (!canUnlock) {
    console.warn(`Cannot unlock skill ${skillId}: ${reason}`);
    return state;
  }
  
  const skill = state.skills[skillId];
  const cost = getSkillCost(skill);
  
  const newSkills = {
    ...state.skills,
    [skillId]: {
      ...skill,
      currentLevel: skill.currentLevel + 1,
      isUnlocked: true
    }
  };
  
  // Débloquer les compétences dépendantes
  Object.keys(newSkills).forEach(id => {
    const s = newSkills[id];
    if (!s.isUnlocked && s.prerequisites.every(prereqId => newSkills[prereqId]?.currentLevel > 0)) {
      newSkills[id] = { ...s, isUnlocked: true };
    }
  });
  
  const newState: SkillTreeState = {
    ...state,
    skillPoints: state.skillPoints - cost,
    skills: newSkills
  };
  
  // Vérifier les jalons
  return checkMilestones(newState);
}

// Vérifier et compléter les jalons
export function checkMilestones(state: SkillTreeState): SkillTreeState {
  const newMilestones = state.milestones.map(milestone => {
    if (milestone.isCompleted) return milestone;
    
    const isComplete = checkMilestoneRequirement(state, milestone);
    
    return isComplete ? { ...milestone, isCompleted: true, completedAt: Date.now() } : milestone;
  });
  
  // Calculer les récompenses
  let skillPointsGained = 0;
  const newUnlockedSpecs = [...state.unlockedSpecializations];
  
  newMilestones.forEach((milestone, index) => {
    if (milestone.isCompleted && !state.milestones[index].isCompleted) {
      if (milestone.reward.type === 'skill_points' && typeof milestone.reward.value === 'number') {
        skillPointsGained += milestone.reward.value;
      } else if (milestone.reward.type === 'unlock_specialization') {
        // Marquer que les spécialisations sont disponibles
      }
    }
  });
  
  return {
    ...state,
    skillPoints: state.skillPoints + skillPointsGained,
    totalSkillPointsEarned: state.totalSkillPointsEarned + skillPointsGained,
    milestones: newMilestones,
    unlockedSpecializations: newUnlockedSpecs
  };
}

// Vérifier si un jalon est complété
function checkMilestoneRequirement(state: SkillTreeState, milestone: SkillMilestone): boolean {
  const { type, value, category } = milestone.requirement;
  const skills = Object.values(state.skills);
  
  switch (type) {
    case 'skills_unlocked':
      return skills.filter(s => s.currentLevel > 0).length >= value;
      
    case 'tier_reached':
      return skills.some(s => s.currentLevel > 0 && s.tier >= value);
      
    case 'category_mastered':
      if (category) {
        return skills
          .filter(s => s.category === category)
          .every(s => s.currentLevel >= s.maxLevel);
      }
      // N'importe quelle catégorie
      const categories: SkillCategory[] = ['management', 'finance', 'marketing', 'technology', 'hr', 'production', 'international', 'legal'];
      return categories.some(cat => 
        skills.filter(s => s.category === cat).every(s => s.currentLevel >= s.maxLevel)
      );
      
    case 'total_levels':
      return skills.reduce((sum, s) => sum + s.currentLevel, 0) >= value;
      
    default:
      return false;
  }
}

// Calculer les bonus totaux des compétences
export function calculateTotalSkillBonuses(state: SkillTreeState): Record<string, number> {
  const bonuses: Record<string, number> = {};
  
  Object.values(state.skills).forEach(skill => {
    if (skill.currentLevel > 0) {
      skill.effects.forEach(effect => {
        const value = effect.perLevel ? effect.value * skill.currentLevel : effect.value;
        bonuses[effect.type] = (bonuses[effect.type] || 0) + value;
      });
    }
  });
  
  // Ajouter les bonus de spécialisation
  if (state.activeSpecialization) {
    const spec = SPECIALIZATION_DEFINITIONS.find(s => s.id === state.activeSpecialization);
    if (spec) {
      spec.bonuses.forEach(bonus => {
        bonuses[bonus.type] = (bonuses[bonus.type] || 0) + bonus.value;
      });
    }
  }
  
  return bonuses;
}

// Obtenir les compétences par catégorie
export function getSkillsByCategory(state: SkillTreeState, category: SkillCategory): Skill[] {
  return Object.values(state.skills)
    .filter(s => s.category === category)
    .sort((a, b) => a.tier - b.tier);
}

// Obtenir les compétences par tier
export function getSkillsByTier(state: SkillTreeState, tier: SkillTier): Skill[] {
  return Object.values(state.skills)
    .filter(s => s.tier === tier)
    .sort((a, b) => a.category.localeCompare(b.category));
}

// Vérifier si une spécialisation peut être activée
export function canActivateSpecialization(state: SkillTreeState, specId: SpecializationPath): { canActivate: boolean; reason?: string } {
  const spec = SPECIALIZATION_DEFINITIONS.find(s => s.id === specId);
  
  if (!spec) {
    return { canActivate: false, reason: "Spécialisation introuvable" };
  }
  
  // Vérifier que toutes les compétences requises sont débloquées
  for (const skillId of spec.requiredSkills) {
    const skill = state.skills[skillId];
    if (!skill || skill.currentLevel === 0) {
      return { canActivate: false, reason: `Compétence requise manquante: ${skill?.name || skillId}` };
    }
  }
  
  return { canActivate: true };
}

// Activer une spécialisation
export function activateSpecialization(state: SkillTreeState, specId: SpecializationPath): SkillTreeState {
  const { canActivate, reason } = canActivateSpecialization(state, specId);
  
  if (!canActivate) {
    console.warn(`Cannot activate specialization ${specId}: ${reason}`);
    return state;
  }
  
  const newUnlocked = state.unlockedSpecializations.includes(specId) 
    ? state.unlockedSpecializations 
    : [...state.unlockedSpecializations, specId];
  
  return {
    ...state,
    activeSpecialization: specId,
    unlockedSpecializations: newUnlocked
  };
}

// Obtenir la progression globale
export function getOverallProgress(state: SkillTreeState): {
  totalSkills: number;
  unlockedSkills: number;
  totalLevels: number;
  maxLevels: number;
  percentage: number;
  tierProgress: Record<SkillTier, { unlocked: number; total: number }>;
  categoryProgress: Record<SkillCategory, { unlocked: number; total: number }>;
} {
  const skills = Object.values(state.skills);
  const totalSkills = skills.length;
  const unlockedSkills = skills.filter(s => s.currentLevel > 0).length;
  const totalLevels = skills.reduce((sum, s) => sum + s.currentLevel, 0);
  const maxLevels = skills.reduce((sum, s) => sum + s.maxLevel, 0);
  
  const tierProgress: Record<SkillTier, { unlocked: number; total: number }> = {
    1: { unlocked: 0, total: 0 },
    2: { unlocked: 0, total: 0 },
    3: { unlocked: 0, total: 0 },
    4: { unlocked: 0, total: 0 },
    5: { unlocked: 0, total: 0 }
  };
  
  const categoryProgress: Record<SkillCategory, { unlocked: number; total: number }> = {
    management: { unlocked: 0, total: 0 },
    finance: { unlocked: 0, total: 0 },
    marketing: { unlocked: 0, total: 0 },
    technology: { unlocked: 0, total: 0 },
    hr: { unlocked: 0, total: 0 },
    production: { unlocked: 0, total: 0 },
    international: { unlocked: 0, total: 0 },
    legal: { unlocked: 0, total: 0 }
  };
  
  skills.forEach(skill => {
    tierProgress[skill.tier].total++;
    if (skill.currentLevel > 0) tierProgress[skill.tier].unlocked++;
    
    categoryProgress[skill.category].total++;
    if (skill.currentLevel > 0) categoryProgress[skill.category].unlocked++;
  });
  
  return {
    totalSkills,
    unlockedSkills,
    totalLevels,
    maxLevels,
    percentage: Math.round((totalLevels / maxLevels) * 100),
    tierProgress,
    categoryProgress
  };
}

// Calculer les points de compétence gagnés par actions
export function calculateSkillPointsFromAction(action: string, value: number): number {
  const rewards: Record<string, number> = {
    'revenue_milestone': 1, // Par tranche de 100k€ de revenus
    'employee_milestone': 1, // Par tranche de 10 employés
    'product_launch': 2,
    'market_expansion': 3,
    'crisis_survived': 2,
    'achievement_unlocked': 1,
    'year_completed': 2
  };
  
  return rewards[action] || 0;
}

// Réinitialiser une branche de compétences (respec partiel)
export function respecCategory(state: SkillTreeState, category: SkillCategory): SkillTreeState {
  let refundedPoints = 0;
  
  const newSkills = { ...state.skills };
  
  Object.keys(newSkills).forEach(skillId => {
    const skill = newSkills[skillId];
    if (skill.category === category && skill.currentLevel > 0) {
      // Rembourser 75% des points investis
      for (let i = 0; i < skill.currentLevel; i++) {
        const cost = Math.ceil(skill.cost * (1 + i * 0.5));
        refundedPoints += Math.floor(cost * 0.75);
      }
      newSkills[skillId] = {
        ...skill,
        currentLevel: 0,
        isUnlocked: skill.tier === 1 && skill.prerequisites.length === 0
      };
    }
  });
  
  // Recalculer les débloquages
  Object.keys(newSkills).forEach(skillId => {
    const skill = newSkills[skillId];
    if (!skill.isUnlocked && skill.prerequisites.every(prereqId => newSkills[prereqId]?.currentLevel > 0)) {
      // Garde le skill verrouillé si les prérequis ne sont plus remplis
    } else if (skill.prerequisites.length > 0 && !skill.prerequisites.every(prereqId => newSkills[prereqId]?.currentLevel > 0)) {
      newSkills[skillId] = { ...skill, isUnlocked: false };
    }
  });
  
  return {
    ...state,
    skillPoints: state.skillPoints + refundedPoints,
    skills: newSkills
  };
}

// Réinitialisation complète (respec total)
export function fullRespec(state: SkillTreeState): SkillTreeState {
  // Rembourser 50% des points totaux gagnés
  const refundedPoints = Math.floor(state.totalSkillPointsEarned * 0.5);
  
  const newSkills: Record<string, Skill> = {};
  
  Object.keys(state.skills).forEach(skillId => {
    const skill = state.skills[skillId];
    newSkills[skillId] = {
      ...skill,
      currentLevel: 0,
      isUnlocked: skill.tier === 1 && skill.prerequisites.length === 0
    };
  });
  
  return {
    ...state,
    skillPoints: refundedPoints,
    skills: newSkills,
    activeSpecialization: undefined,
    unlockedSpecializations: []
  };
}
