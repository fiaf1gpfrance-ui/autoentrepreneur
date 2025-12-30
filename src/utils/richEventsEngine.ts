// Engine for rich events and opportunities

import { Company, GameState, Sector } from '@/types/game';
import { 
  RichEvent, 
  RichEventType, 
  EventChoice, 
  EventEffects,
  EVENT_TEMPLATES,
  EconomicNews,
  ECONOMIC_NEWS_TEMPLATES,
} from '@/types/events';

// Generate a random rich event based on game state
export function generateRichEvent(company: Company, state: GameState): RichEvent | null {
  // Base chance of event per day
  let eventChance = 0.08; // 8% base chance
  
  // Increase chance based on game state
  if (state.economicWeather === 'crise') eventChance += 0.1;
  if (state.economicWeather === 'recession') eventChance += 0.05;
  if (company.employees.length > 20) eventChance += 0.02;
  if (company.marketShare > 15) eventChance += 0.03;
  
  // Check for seasonal events
  const month = state.month;
  if (month === 12) eventChance += 0.1; // More events in December
  if (month === 7 || month === 8) eventChance += 0.05; // Summer events
  
  if (Math.random() > eventChance) return null;
  
  // Filter eligible events
  const eligibleTemplates = EVENT_TEMPLATES.filter(template => {
    // Check sector relevance
    if (template.sectorRelevance && !template.sectorRelevance.includes(company.sector)) {
      return false;
    }
    
    // Check company size
    if (template.minCompanySize && company.employees.length < template.minCompanySize) {
      return false;
    }
    
    // Check requirements
    if (template.requirements) {
      for (const req of template.requirements) {
        let value = 0;
        switch (req.type) {
          case 'treasury': value = company.treasury; break;
          case 'employees': value = company.employees.length; break;
          case 'revenue': value = company.monthlyRevenue * 12; break;
          case 'reputation': value = company.reputation; break;
          case 'credibility': value = company.credibility; break;
          case 'marketShare': value = company.marketShare; break;
        }
        
        const met = evaluateRequirement(value, req.operator, req.value);
        if (!met) return false;
      }
    }
    
    return true;
  });
  
  if (eligibleTemplates.length === 0) return null;
  
  // Weight selection by event type based on current situation
  const weights = calculateEventWeights(company, state);
  const template = weightedRandomSelect(eligibleTemplates, weights);
  
  return {
    ...template,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    day: state.day,
    acknowledged: false,
  };
}

function evaluateRequirement(value: number, operator: string, target: number): boolean {
  switch (operator) {
    case '>': return value > target;
    case '<': return value < target;
    case '>=': return value >= target;
    case '<=': return value <= target;
    case '==': return value === target;
    default: return false;
  }
}

function calculateEventWeights(company: Company, state: GameState): Record<RichEventType, number> {
  const weights: Record<RichEventType, number> = {
    news: 1,
    opportunity: 1,
    crisis: 1,
    regulatory: 1,
    internal: 1,
    competitor: 1,
    market: 1,
    technology: 1,
    social: 1,
    random: 1,
    seasonal: 1,
    milestone: 0.5,
  };
  
  // Increase crisis chance in bad economic weather
  if (state.economicWeather === 'crise') weights.crisis = 2;
  if (state.economicWeather === 'recession') weights.crisis = 1.5;
  
  // Increase opportunity in good weather
  if (state.economicWeather === 'croissance') weights.opportunity = 1.5;
  
  // More internal events with more employees
  if (company.employees.length > 30) weights.internal = 1.5;
  
  // More competitor events with higher market share
  if (company.marketShare > 10) weights.competitor = 1.3;
  
  // Seasonal events based on month
  const month = state.month;
  if (month === 12 || month === 7 || month === 8) weights.seasonal = 2;
  
  return weights;
}

function weightedRandomSelect<T extends { type: RichEventType }>(
  items: T[],
  weights: Record<RichEventType, number>
): T {
  const totalWeight = items.reduce((sum, item) => sum + (weights[item.type] || 1), 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    const weight = weights[item.type] || 1;
    random -= weight;
    if (random <= 0) return item;
  }
  
  return items[items.length - 1];
}

// Apply event choice effects
export function applyEventChoice(
  company: Company,
  event: RichEvent,
  choice: EventChoice
): { company: Company; message: string } {
  const updatedCompany = { ...company };
  const effects = choice.effects;
  let message = '';
  
  // Apply effects with possible variance based on risk
  const variance = choice.riskFactor || 0;
  
  if (effects.treasury) {
    const actualEffect = applyVariance(effects.treasury, variance);
    updatedCompany.treasury += actualEffect;
    message += actualEffect > 0 ? `+${actualEffect}€ ` : `${actualEffect}€ `;
  }
  
  if (effects.reputation) {
    const actualEffect = applyVariance(effects.reputation, variance);
    updatedCompany.reputation = Math.max(0, Math.min(100, updatedCompany.reputation + actualEffect));
    message += actualEffect > 0 ? `+${actualEffect} réputation ` : `${actualEffect} réputation `;
  }
  
  if (effects.credibility) {
    const actualEffect = applyVariance(effects.credibility, variance);
    updatedCompany.credibility = Math.max(0, Math.min(100, updatedCompany.credibility + actualEffect));
  }
  
  if (effects.moralAll) {
    const actualEffect = applyVariance(effects.moralAll, variance);
    updatedCompany.employees = updatedCompany.employees.map(e => ({
      ...e,
      moral: Math.max(0, Math.min(100, e.moral + actualEffect)),
    }));
    message += actualEffect > 0 ? `+${actualEffect} moral ` : `${actualEffect} moral `;
  }
  
  if (effects.productivity) {
    const actualEffect = applyVariance(effects.productivity, variance);
    updatedCompany.employees = updatedCompany.employees.map(e => ({
      ...e,
      productivity: Math.max(50, Math.min(150, e.productivity + actualEffect)),
    }));
  }
  
  if (effects.marketShare) {
    const actualEffect = applyVariance(effects.marketShare, variance);
    updatedCompany.marketShare = Math.max(0, Math.min(100, updatedCompany.marketShare + actualEffect));
    message += actualEffect > 0 ? `+${actualEffect}% marché ` : `${actualEffect}% marché `;
  }
  
  return { company: updatedCompany, message };
}

function applyVariance(value: number, variance: number): number {
  if (variance === 0) return value;
  
  // Random outcome based on variance
  const roll = Math.random();
  
  // Bad luck
  if (roll < variance * 0.5) {
    return value < 0 ? Math.round(value * 1.5) : Math.round(value * 0.5);
  }
  
  // Good luck
  if (roll > 1 - variance * 0.3) {
    return value > 0 ? Math.round(value * 1.5) : Math.round(value * 0.5);
  }
  
  return value;
}

// Generate economic news
export function generateEconomicNews(state: GameState): EconomicNews | null {
  // 5% chance per day for new economic news
  if (Math.random() > 0.05) return null;
  
  const template = ECONOMIC_NEWS_TEMPLATES[Math.floor(Math.random() * ECONOMIC_NEWS_TEMPLATES.length)];
  
  return {
    ...template,
    id: `news_${Date.now()}`,
    date: state.day,
  };
}

// Check for milestone events
export function checkMilestones(company: Company, state: GameState): RichEvent | null {
  const milestones = EVENT_TEMPLATES.filter(e => e.type === 'milestone');
  
  for (const milestone of milestones) {
    if (!milestone.requirements) continue;
    
    let allMet = true;
    for (const req of milestone.requirements) {
      let value = 0;
      switch (req.type) {
        case 'revenue': value = company.monthlyRevenue * 12; break;
        case 'employees': value = company.employees.length; break;
        case 'reputation': value = company.reputation; break;
        case 'marketShare': value = company.marketShare; break;
      }
      
      if (!evaluateRequirement(value, req.operator, req.value)) {
        allMet = false;
        break;
      }
    }
    
    if (allMet) {
      return {
        ...milestone,
        id: `milestone_${Date.now()}`,
        day: state.day,
        acknowledged: false,
      };
    }
  }
  
  return null;
}

// Get event severity color
export function getEventSeverityColor(severity: RichEvent['severity']): string {
  switch (severity) {
    case 'positive': return 'text-success';
    case 'neutral': return 'text-muted-foreground';
    case 'negative': return 'text-warning';
    case 'critical': return 'text-destructive';
    default: return 'text-foreground';
  }
}

// Get event severity background
export function getEventSeverityBg(severity: RichEvent['severity']): string {
  switch (severity) {
    case 'positive': return 'bg-success/10 border-success/30';
    case 'neutral': return 'bg-muted/10 border-muted/30';
    case 'negative': return 'bg-warning/10 border-warning/30';
    case 'critical': return 'bg-destructive/10 border-destructive/30';
    default: return 'bg-card';
  }
}
