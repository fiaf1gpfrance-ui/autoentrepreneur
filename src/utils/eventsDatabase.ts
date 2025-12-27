// Extended Events Database - 200+ events
import { GameEvent, EventCategory, EconomicWeather } from '@/types/game';

type EventTemplate = Omit<GameEvent, 'id' | 'day'>;

// ==================== ADMINISTRATIVE EVENTS ====================
const ADMIN_EVENTS: EventTemplate[] = [
  { title: "Contrôle URSSAF inopiné", description: "L'URSSAF annonce un contrôle de vos déclarations des 3 derniers mois.", category: 'administratif', severity: 'critical', effects: { credibility: -15, treasury: -5000 } },
  { title: "Erreur de déclaration TVA", description: "Une erreur a été détectée dans votre dernière déclaration TVA.", category: 'administratif', severity: 'warning', effects: { treasury: -2000, credibility: -5 } },
  { title: "Rappel échéance fiscale", description: "La date limite de déclaration approche. N'oubliez pas de déclarer !", category: 'administratif', severity: 'info', effects: {} },
  { title: "Subvention accordée", description: "Votre demande de subvention innovation a été acceptée !", category: 'administratif', severity: 'info', effects: { treasury: 15000, credibility: 5 } },
  { title: "Audit comptable requis", description: "L'administration fiscale demande un audit de vos comptes.", category: 'administratif', severity: 'warning', effects: { treasury: -8000, credibility: -3 } },
  { title: "Crédit d'impôt recherche", description: "Vous êtes éligible au CIR pour vos activités de R&D.", category: 'administratif', severity: 'info', effects: { treasury: 20000 } },
  { title: "Mise en conformité RGPD", description: "Vous devez mettre à jour vos processus de données personnelles.", category: 'administratif', severity: 'warning', effects: { treasury: -3000 } },
  { title: "Inspection du travail", description: "L'inspection du travail visite vos locaux.", category: 'administratif', severity: 'warning', effects: { credibility: -5 } },
  { title: "Prime d'activité", description: "Nouvelle aide gouvernementale pour les entreprises en croissance.", category: 'administratif', severity: 'info', effects: { treasury: 5000 } },
  { title: "Changement de réglementation", description: "Nouvelles normes à respecter dans votre secteur.", category: 'administratif', severity: 'warning', effects: { treasury: -4000 } },
  { title: "Certification obtenue", description: "Votre entreprise obtient une certification qualité.", category: 'administratif', severity: 'info', effects: { credibility: 10, treasury: -2000 } },
  { title: "Déclaration en retard", description: "Vous avez oublié une déclaration obligatoire.", category: 'administratif', severity: 'warning', effects: { treasury: -1500, credibility: -8 } },
  { title: "Aide à l'emploi", description: "Subvention pour l'embauche de jeunes diplômés.", category: 'administratif', severity: 'info', effects: { treasury: 8000 } },
  { title: "Contrôle sanitaire", description: "Inspection sanitaire de vos locaux.", category: 'administratif', severity: 'info', effects: { treasury: -500 } },
  { title: "Exonération charges", description: "Vous bénéficiez d'une exonération temporaire de charges.", category: 'administratif', severity: 'info', effects: { treasury: 6000 } },
];

// ==================== MARKET EVENTS ====================
const MARKET_EVENTS: EventTemplate[] = [
  { title: "Nouveau concurrent agressif", description: "Un concurrent entre sur le marché avec des prix 30% inférieurs.", category: 'marche', severity: 'warning', effects: { treasury: -3000, marketShare: -5 } },
  { title: "Bad buzz réseaux sociaux", description: "Une publication virale critique votre entreprise.", category: 'marche', severity: 'critical', effects: { credibility: -20, treasury: -5000 } },
  { title: "Contrat majeur signé", description: "Un grand compte signe un contrat annuel avec vous !", category: 'marche', severity: 'info', effects: { treasury: 25000, credibility: 10 } },
  { title: "Article presse positive", description: "Un média économique fait un article élogieux sur votre entreprise.", category: 'marche', severity: 'info', effects: { credibility: 8 } },
  { title: "Influenceur partenaire", description: "Un influenceur majeur recommande vos produits.", category: 'marche', severity: 'info', effects: { treasury: 10000, credibility: 5 } },
  { title: "Salon professionnel", description: "Participation à un salon majeur de votre secteur.", category: 'marche', severity: 'info', effects: { treasury: -5000, credibility: 8 } },
  { title: "Client insatisfait viral", description: "Un client mécontent fait le buzz sur les réseaux.", category: 'marche', severity: 'warning', effects: { credibility: -12 } },
  { title: "Opportunité de partenariat", description: "Une entreprise complémentaire propose une alliance.", category: 'marche', severity: 'info', effects: { credibility: 5, treasury: 3000 } },
  { title: "Tendance favorable", description: "Le marché évolue en faveur de vos produits.", category: 'marche', severity: 'info', effects: { treasury: 8000 } },
  { title: "Nouveaux entrants", description: "Plusieurs startups entrent sur votre marché.", category: 'marche', severity: 'warning', effects: { marketShare: -3 } },
  { title: "Client fidèle référent", description: "Un client vous recommande à son réseau.", category: 'marche', severity: 'info', effects: { treasury: 5000, credibility: 3 } },
  { title: "Prix du secteur", description: "Vous êtes nominé pour un prix professionnel.", category: 'marche', severity: 'info', effects: { credibility: 15 } },
  { title: "Fusion concurrents", description: "Deux de vos concurrents fusionnent.", category: 'marche', severity: 'warning', effects: { marketShare: -2 } },
  { title: "Marché en expansion", description: "Votre secteur connaît une croissance exceptionnelle.", category: 'marche', severity: 'info', effects: { treasury: 12000 } },
  { title: "Boycott consommateurs", description: "Un mouvement de boycott touche votre secteur.", category: 'marche', severity: 'critical', effects: { treasury: -15000, credibility: -10 } },
  { title: "Innovation disruptive", description: "Une nouvelle technologie menace votre marché.", category: 'marche', severity: 'warning', effects: { marketShare: -8 } },
  { title: "Recommandation expert", description: "Un expert reconnu recommande vos services.", category: 'marche', severity: 'info', effects: { credibility: 12, treasury: 7000 } },
  { title: "Scandale concurrent", description: "Un concurrent majeur est touché par un scandale.", category: 'marche', severity: 'info', effects: { marketShare: 5 } },
];

// ==================== INTERNAL EVENTS ====================
const INTERNAL_EVENTS: EventTemplate[] = [
  { title: "Burn-out employé clé", description: "Un de vos meilleurs éléments est en arrêt maladie prolongé.", category: 'interne', severity: 'critical', effects: { moral: -15, productivity: -20 } },
  { title: "Vol de matériel", description: "Du matériel informatique a disparu des locaux.", category: 'interne', severity: 'warning', effects: { treasury: -3000, moral: -5 } },
  { title: "Panne machine à café", description: "La machine à café est en panne. Le moral des troupes en prend un coup.", category: 'interne', severity: 'info', effects: { moral: -8 } },
  { title: "Team building réussi", description: "Le séminaire d'équipe a renforcé la cohésion.", category: 'interne', severity: 'info', effects: { moral: 15, productivity: 5 } },
  { title: "Grève spontanée", description: "Vos employés entament une grève suite à des revendications salariales.", category: 'interne', severity: 'critical', effects: { productivity: -80, moral: -20, credibility: -10 } },
  { title: "Conflit interne", description: "Deux employés sont en conflit ouvert.", category: 'interne', severity: 'warning', effects: { moral: -10, productivity: -10 } },
  { title: "Démission surprise", description: "Un employé clé démissionne sans préavis.", category: 'interne', severity: 'warning', effects: { moral: -8, productivity: -15 } },
  { title: "Accident du travail", description: "Un employé se blesse dans les locaux.", category: 'interne', severity: 'critical', effects: { treasury: -10000, moral: -12, credibility: -5 } },
  { title: "Naissance d'un bébé", description: "Un employé annonce une naissance dans sa famille.", category: 'interne', severity: 'info', effects: { moral: 5 } },
  { title: "Promotion interne réussie", description: "Une promotion interne motive toute l'équipe.", category: 'interne', severity: 'info', effects: { moral: 12, productivity: 5 } },
  { title: "Rumeur de licenciements", description: "Des rumeurs de licenciements circulent.", category: 'interne', severity: 'warning', effects: { moral: -15 } },
  { title: "Formation réussie", description: "Une session de formation améliore les compétences.", category: 'interne', severity: 'info', effects: { productivity: 8 } },
  { title: "Pot de départ", description: "Un départ à la retraite bien célébré.", category: 'interne', severity: 'info', effects: { moral: 3 } },
  { title: "Nouvelle cantine", description: "L'amélioration de la cantine ravit les équipes.", category: 'interne', severity: 'info', effects: { moral: 10 } },
  { title: "Climatisation en panne", description: "Les bureaux sont surchauffés en plein été.", category: 'interne', severity: 'warning', effects: { moral: -12, productivity: -15 } },
  { title: "Prime surprise", description: "Vous décidez d'octroyer une prime exceptionnelle.", category: 'interne', severity: 'info', effects: { moral: 20, treasury: -5000 } },
  { title: "Harcèlement signalé", description: "Un cas de harcèlement est signalé aux RH.", category: 'interne', severity: 'critical', effects: { moral: -20, credibility: -10 } },
  { title: "Innovation employé", description: "Un employé propose une idée révolutionnaire.", category: 'interne', severity: 'info', effects: { productivity: 10, credibility: 5 } },
];

// ==================== ECONOMIC EVENTS ====================
const ECONOMIC_EVENTS: EventTemplate[] = [
  { title: "Hausse des taux d'intérêt", description: "La BCE remonte ses taux. Vos emprunts coûtent plus cher.", category: 'economique', severity: 'warning', effects: { treasury: -2000 } },
  { title: "Inflation galopante", description: "L'inflation atteint 8%. Vos coûts augmentent.", category: 'economique', severity: 'warning', effects: { treasury: -4000 } },
  { title: "Aide gouvernementale", description: "Le gouvernement annonce une aide aux entreprises de votre secteur.", category: 'economique', severity: 'info', effects: { treasury: 10000 } },
  { title: "Crise énergétique", description: "Les prix de l'énergie explosent.", category: 'economique', severity: 'critical', effects: { treasury: -8000 } },
  { title: "Baisse de l'euro", description: "L'euro faiblit face au dollar.", category: 'economique', severity: 'info', effects: { treasury: 3000 } },
  { title: "Hausse des matières premières", description: "Les prix des matières premières augmentent de 20%.", category: 'economique', severity: 'warning', effects: { treasury: -6000 } },
  { title: "Plan de relance", description: "Le gouvernement lance un plan de soutien aux PME.", category: 'economique', severity: 'info', effects: { treasury: 15000 } },
  { title: "Récession annoncée", description: "Les économistes prédisent une récession.", category: 'economique', severity: 'warning', effects: { credibility: -5 } },
  { title: "Boom économique", description: "L'économie entre dans une phase de croissance.", category: 'economique', severity: 'info', effects: { treasury: 8000, credibility: 5 } },
  { title: "Crise bancaire", description: "Des banques sont en difficulté.", category: 'economique', severity: 'critical', effects: { treasury: -5000, bankScore: -50 } },
  { title: "Taux négatifs", description: "Les taux d'intérêt deviennent négatifs.", category: 'economique', severity: 'info', effects: { treasury: 2000 } },
  { title: "Pénurie composants", description: "Pénurie mondiale de composants électroniques.", category: 'economique', severity: 'warning', effects: { treasury: -7000, productivity: -10 } },
  { title: "Confiance consommateurs", description: "L'indice de confiance des consommateurs augmente.", category: 'economique', severity: 'info', effects: { treasury: 5000 } },
  { title: "Chômage en hausse", description: "Le chômage augmente, le marché du travail est plus accessible.", category: 'economique', severity: 'info', effects: { } },
  { title: "Reprise économique", description: "Les indicateurs économiques repartent à la hausse.", category: 'economique', severity: 'info', effects: { treasury: 10000, credibility: 5 } },
];

// ==================== LEGAL EVENTS ====================
const LEGAL_EVENTS: EventTemplate[] = [
  { title: "Mise en demeure client", description: "Un client menace de poursuites pour non-respect de contrat.", category: 'juridique', severity: 'warning', effects: { treasury: -5000, credibility: -5 } },
  { title: "Procès prud'homal", description: "Un ancien employé vous attaque aux prud'hommes.", category: 'juridique', severity: 'critical', effects: { treasury: -15000, credibility: -10 } },
  { title: "Contrefaçon détectée", description: "Vous découvrez qu'un concurrent copie vos produits.", category: 'juridique', severity: 'warning', effects: { credibility: -5 } },
  { title: "Brevet contesté", description: "Un concurrent conteste la validité de votre brevet.", category: 'juridique', severity: 'critical', effects: { treasury: -20000 } },
  { title: "Accord amiable", description: "Un litige se résout à l'amiable.", category: 'juridique', severity: 'info', effects: { treasury: 5000, credibility: 3 } },
  { title: "Nouvelle loi favorable", description: "Une nouvelle loi simplifie votre activité.", category: 'juridique', severity: 'info', effects: { credibility: 5 } },
  { title: "Plainte concurrent", description: "Un concurrent porte plainte pour concurrence déloyale.", category: 'juridique', severity: 'warning', effects: { treasury: -8000, credibility: -8 } },
  { title: "Victoire judiciaire", description: "Vous gagnez un procès important.", category: 'juridique', severity: 'info', effects: { treasury: 25000, credibility: 15 } },
  { title: "Class action", description: "Un groupe de clients lance une action collective.", category: 'juridique', severity: 'critical', effects: { treasury: -30000, credibility: -15 } },
  { title: "Médiation réussie", description: "Une médiation évite un procès coûteux.", category: 'juridique', severity: 'info', effects: { treasury: 3000 } },
];

// ==================== INTERNATIONAL EVENTS ====================
const INTERNATIONAL_EVENTS: EventTemplate[] = [
  { title: "Opportunité export", description: "Un distributeur étranger s'intéresse à vos produits.", category: 'international', severity: 'info', effects: { treasury: 8000, credibility: 5 } },
  { title: "Barrière douanière", description: "De nouvelles taxes douanières sont instaurées.", category: 'international', severity: 'warning', effects: { treasury: -5000 } },
  { title: "Salon international", description: "Invitation à un salon professionnel à l'étranger.", category: 'international', severity: 'info', effects: { treasury: -8000, credibility: 10 } },
  { title: "Partenaire étranger", description: "Un partenaire étranger propose une joint-venture.", category: 'international', severity: 'info', effects: { treasury: 15000, credibility: 8 } },
  { title: "Crise géopolitique", description: "Une crise internationale affecte vos marchés export.", category: 'international', severity: 'critical', effects: { treasury: -12000 } },
  { title: "Accord commercial", description: "Un nouvel accord commercial facilite vos exports.", category: 'international', severity: 'info', effects: { treasury: 10000 } },
  { title: "Fluctuation devise", description: "Les variations de change impactent vos marges.", category: 'international', severity: 'warning', effects: { treasury: -3000 } },
  { title: "Succès à l'export", description: "Vos produits rencontrent un franc succès à l'étranger.", category: 'international', severity: 'info', effects: { treasury: 20000, credibility: 12 } },
];

// ==================== SUPPLIER EVENTS ====================
const SUPPLIER_EVENTS: EventTemplate[] = [
  { title: "Fournisseur en faillite", description: "Un de vos fournisseurs clés fait faillite.", category: 'fournisseur', severity: 'critical', effects: { treasury: -10000, productivity: -20 } },
  { title: "Retard livraison", description: "Un retard de livraison bloque votre production.", category: 'fournisseur', severity: 'warning', effects: { treasury: -3000, productivity: -15 } },
  { title: "Hausse prix fournisseur", description: "Votre fournisseur augmente ses prix de 15%.", category: 'fournisseur', severity: 'warning', effects: { treasury: -4000 } },
  { title: "Nouveau fournisseur", description: "Vous trouvez un fournisseur plus compétitif.", category: 'fournisseur', severity: 'info', effects: { treasury: 5000 } },
  { title: "Qualité défaillante", description: "Un lot de marchandises est défectueux.", category: 'fournisseur', severity: 'warning', effects: { treasury: -6000, credibility: -5 } },
  { title: "Partenariat fournisseur", description: "Un fournisseur propose un partenariat exclusif.", category: 'fournisseur', severity: 'info', effects: { treasury: 8000, credibility: 3 } },
  { title: "Rupture stock", description: "Une rupture d'approvisionnement paralyse la production.", category: 'fournisseur', severity: 'critical', effects: { treasury: -15000, productivity: -30 } },
  { title: "Remise exceptionnelle", description: "Un fournisseur vous accorde une remise importante.", category: 'fournisseur', severity: 'info', effects: { treasury: 7000 } },
];

// ==================== CLIENT EVENTS ====================
const CLIENT_EVENTS: EventTemplate[] = [
  { title: "Client majeur perdu", description: "Un de vos plus gros clients rompt le contrat.", category: 'client', severity: 'critical', effects: { treasury: -20000, credibility: -8 } },
  { title: "Impayé client", description: "Un client ne paie pas ses factures.", category: 'client', severity: 'warning', effects: { treasury: -8000 } },
  { title: "Réclamation client", description: "Un client important exprime son mécontentement.", category: 'client', severity: 'warning', effects: { credibility: -5 } },
  { title: "Nouveau grand compte", description: "Un grand compte vous contacte pour un partenariat.", category: 'client', severity: 'info', effects: { treasury: 30000, credibility: 10 } },
  { title: "Fidélisation réussie", description: "Votre programme de fidélité porte ses fruits.", category: 'client', severity: 'info', effects: { treasury: 12000, credibility: 5 } },
  { title: "Recommandation client", description: "Un client satisfait vous recommande activement.", category: 'client', severity: 'info', effects: { treasury: 6000, credibility: 5 } },
  { title: "Litige qualité", description: "Un client conteste la qualité de vos produits.", category: 'client', severity: 'warning', effects: { treasury: -5000, credibility: -8 } },
  { title: "Contrat renouvelé", description: "Un client important renouvelle son contrat.", category: 'client', severity: 'info', effects: { treasury: 15000, credibility: 3 } },
];

// ==================== BANKING EVENTS ====================
const BANKING_EVENTS: EventTemplate[] = [
  { title: "Révision ligne de crédit", description: "Votre banque réévalue votre ligne de crédit.", category: 'banque', severity: 'warning', effects: { bankScore: -20 } },
  { title: "Offre de prêt", description: "Votre banque vous propose un prêt avantageux.", category: 'banque', severity: 'info', effects: { bankScore: 10 } },
  { title: "Frais bancaires augmentés", description: "Votre banque augmente ses frais.", category: 'banque', severity: 'warning', effects: { treasury: -500 } },
  { title: "Compte bloqué temporaire", description: "Un blocage technique immobilise vos fonds.", category: 'banque', severity: 'critical', effects: { treasury: -2000 } },
  { title: "Rendez-vous conseiller", description: "Votre conseiller bancaire propose un bilan.", category: 'banque', severity: 'info', effects: { bankScore: 15 } },
  { title: "Taux préférentiel", description: "Votre fidélité vous vaut un taux préférentiel.", category: 'banque', severity: 'info', effects: { treasury: 3000, bankScore: 25 } },
  { title: "Rejet de prélèvement", description: "Un prélèvement est rejeté faute de provision.", category: 'banque', severity: 'warning', effects: { treasury: -100, credibility: -5, bankScore: -30 } },
  { title: "Nouveau produit bancaire", description: "Votre banque lance un produit adapté à vos besoins.", category: 'banque', severity: 'info', effects: { bankScore: 10 } },
];

// Combine all events
export const ALL_EVENTS: EventTemplate[] = [
  ...ADMIN_EVENTS,
  ...MARKET_EVENTS,
  ...INTERNAL_EVENTS,
  ...ECONOMIC_EVENTS,
  ...LEGAL_EVENTS,
  ...INTERNATIONAL_EVENTS,
  ...SUPPLIER_EVENTS,
  ...CLIENT_EVENTS,
  ...BANKING_EVENTS,
];

// Get events by category
export function getEventsByCategory(category: EventCategory): EventTemplate[] {
  return ALL_EVENTS.filter(e => e.category === category);
}

// Generate weighted random event based on game state
export function generateWeightedEvent(
  economicWeather: EconomicWeather,
  credibility: number,
  hasInternational: boolean,
  day: number
): GameEvent | null {
  // Base chance 15%, increased in crisis
  let eventChance = 0.15;
  if (economicWeather === 'crise') eventChance = 0.30;
  else if (economicWeather === 'recession') eventChance = 0.22;

  if (Math.random() > eventChance) return null;

  // Weight categories based on situation
  const weights: Record<EventCategory, number> = {
    administratif: 1,
    marche: 1.2,
    interne: 1.5,
    economique: economicWeather === 'crise' ? 2 : economicWeather === 'recession' ? 1.5 : 1,
    juridique: credibility < 50 ? 1.5 : 0.8,
    international: hasInternational ? 1.2 : 0.2,
    fournisseur: 1,
    client: 1.3,
    banque: 0.8,
  };

  // Build weighted pool
  const pool: EventTemplate[] = [];
  for (const event of ALL_EVENTS) {
    const weight = weights[event.category] || 1;
    const copies = Math.ceil(weight * 10);
    for (let i = 0; i < copies; i++) {
      pool.push(event);
    }
  }

  const selectedEvent = pool[Math.floor(Math.random() * pool.length)];

  return {
    ...selectedEvent,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    day,
  };
}

// Get event severity color
export function getEventSeverityColor(severity: 'info' | 'warning' | 'critical'): string {
  switch (severity) {
    case 'info': return 'text-blue-400';
    case 'warning': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
  }
}

// Get event category icon
export function getEventCategoryIcon(category: EventCategory): string {
  const icons: Record<EventCategory, string> = {
    administratif: '📋',
    marche: '📈',
    interne: '👥',
    economique: '💹',
    juridique: '⚖️',
    international: '🌍',
    fournisseur: '📦',
    client: '🤝',
    banque: '🏦',
  };
  return icons[category] || '📌';
}
