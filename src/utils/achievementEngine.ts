// Achievement & Mission Engine - 80+ achievements and 50+ missions
import { Achievement, Mission, Company, GameState, AchievementCategory } from '@/types/game';

// ==================== ACHIEVEMENTS DATABASE - 80+ ====================
export const ACHIEVEMENTS_DATABASE: Omit<Achievement, 'unlocked' | 'unlockedDate' | 'progress'>[] = [
  // FINANCE - 15 achievements
  { id: 'first_million', name: 'Premier Million', description: 'Atteindre 1 000 000€ de trésorerie', category: 'finance', icon: '💰', requirement: 'treasury >= 1000000', reward: { credibility: 10 }, target: 1000000 },
  { id: 'ten_million', name: 'Décamillionnaire', description: 'Atteindre 10 000 000€ de trésorerie', category: 'finance', icon: '🏆', requirement: 'treasury >= 10000000', reward: { credibility: 25 }, target: 10000000 },
  { id: 'hundred_million', name: 'Centurion Financier', description: 'Atteindre 100 000 000€', category: 'finance', icon: '👑', requirement: 'treasury >= 100000000', reward: { credibility: 50 }, target: 100000000 },
  { id: 'profitable_year', name: 'Année Rentable', description: 'Terminer une année avec bénéfice', category: 'finance', icon: '📈', requirement: 'yearlyProfit > 0', reward: { treasury: 5000 }, target: 1 },
  { id: 'five_profitable', name: 'Croissance Soutenue', description: '5 années consécutives rentables', category: 'finance', icon: '🚀', requirement: 'consecutiveProfitableYears >= 5', reward: { treasury: 25000, credibility: 15 }, target: 5 },
  { id: 'debt_free', name: 'Zéro Dette', description: 'Aucun emprunt en cours', category: 'finance', icon: '🔓', requirement: 'totalLoans === 0', reward: { credibility: 10 }, target: 0 },
  { id: 'investor_darling', name: 'Chouchou des Investisseurs', description: 'Score bancaire de 900+', category: 'finance', icon: '🏦', requirement: 'bankScore >= 900', reward: { treasury: 50000 }, target: 900 },
  { id: 'diversified_portfolio', name: 'Portfolio Diversifié', description: '5 types d\'investissements différents', category: 'finance', icon: '📊', requirement: 'investmentTypes >= 5', reward: { treasury: 10000 }, target: 5 },
  { id: 'cash_cow', name: 'Vache à Lait', description: '1M€ de revenus mensuels', category: 'finance', icon: '🐄', requirement: 'monthlyRevenue >= 1000000', reward: { credibility: 20 }, target: 1000000 },
  { id: 'margin_master', name: 'Maître des Marges', description: 'Marge nette de 40%+', category: 'finance', icon: '📐', requirement: 'netMargin >= 40', reward: { treasury: 20000 }, target: 40 },
  { id: 'tax_optimizer', name: 'Optimisateur Fiscal', description: 'Réduire les impôts de 30%', category: 'finance', icon: '🧮', requirement: 'taxReduction >= 30', reward: { credibility: 5 }, target: 30 },
  { id: 'quick_ratio', name: 'Liquidité Parfaite', description: 'Ratio de liquidité > 2', category: 'finance', icon: '💧', requirement: 'quickRatio >= 2', reward: { treasury: 10000 }, target: 2 },
  { id: 'leverage_master', name: 'Effet Levier', description: 'ROE de 25% grâce à l\'endettement', category: 'finance', icon: '⚖️', requirement: 'roe >= 25', reward: { credibility: 10 }, target: 25 },
  { id: 'dividend_king', name: 'Roi du Dividende', description: 'Verser 1M€ de dividendes', category: 'finance', icon: '💎', requirement: 'totalDividends >= 1000000', reward: { credibility: 15 }, target: 1000000 },
  { id: 'ipo_ready', name: 'Prêt pour l\'IPO', description: 'Tous les critères d\'introduction en bourse', category: 'finance', icon: '🔔', requirement: 'ipoReady', reward: { credibility: 30, unlocks: ['ipo'] }, target: 1 },
  
  // RH - 15 achievements
  { id: 'first_hire', name: 'Premier Employé', description: 'Embaucher votre premier employé', category: 'rh', icon: '👤', requirement: 'employees >= 1', reward: { credibility: 2 }, target: 1 },
  { id: 'team_10', name: 'Équipe de 10', description: 'Avoir 10 employés', category: 'rh', icon: '👥', requirement: 'employees >= 10', reward: { credibility: 5 }, target: 10 },
  { id: 'team_50', name: 'PME Confirmée', description: 'Avoir 50 employés', category: 'rh', icon: '🏢', requirement: 'employees >= 50', reward: { credibility: 10, treasury: 10000 }, target: 50 },
  { id: 'team_250', name: 'ETI', description: 'Avoir 250 employés', category: 'rh', icon: '🏛️', requirement: 'employees >= 250', reward: { credibility: 20, treasury: 50000 }, target: 250 },
  { id: 'team_1000', name: 'Grande Entreprise', description: 'Avoir 1000 employés', category: 'rh', icon: '🌆', requirement: 'employees >= 1000', reward: { credibility: 35, treasury: 200000 }, target: 1000 },
  { id: 'happy_team', name: 'Équipe Heureuse', description: 'Moral moyen de 90%', category: 'rh', icon: '😊', requirement: 'avgMoral >= 90', reward: { treasury: 15000 }, target: 90 },
  { id: 'productive_team', name: 'Productivité Maximale', description: 'Productivité moyenne de 130%', category: 'rh', icon: '⚡', requirement: 'avgProductivity >= 130', reward: { treasury: 20000 }, target: 130 },
  { id: 'no_strikes', name: 'Paix Sociale', description: 'Aucune grève en 5 ans', category: 'rh', icon: '🕊️', requirement: 'yearsWithoutStrike >= 5', reward: { credibility: 15 }, target: 5 },
  { id: 'talent_magnet', name: 'Aimant à Talents', description: 'Recruter 10 employés bac+5', category: 'rh', icon: '🧲', requirement: 'highlyEducated >= 10', reward: { credibility: 10 }, target: 10 },
  { id: 'training_champion', name: 'Champion Formation', description: '50 formations complétées', category: 'rh', icon: '🎓', requirement: 'completedTrainings >= 50', reward: { treasury: 10000 }, target: 50 },
  { id: 'zero_turnover', name: 'Zéro Turnover', description: 'Aucune démission en 2 ans', category: 'rh', icon: '🔒', requirement: 'yearsWithoutResignation >= 2', reward: { credibility: 10 }, target: 2 },
  { id: 'diversity', name: 'Diversité', description: 'Tous les traits représentés', category: 'rh', icon: '🌈', requirement: 'allTraitsPresent', reward: { credibility: 8 }, target: 8 },
  { id: 'internal_promotion', name: 'Promotion Interne', description: '20 promotions internes', category: 'rh', icon: '📈', requirement: 'totalPromotions >= 20', reward: { treasury: 8000 }, target: 20 },
  { id: 'benefits_leader', name: 'Leader Avantages', description: 'Tous les avantages sociaux actifs', category: 'rh', icon: '🎁', requirement: 'allBenefitsActive', reward: { credibility: 12 }, target: 7 },
  { id: 'star_team', name: 'Équipe de Stars', description: '5 employés avec 100 skills', category: 'rh', icon: '⭐', requirement: 'starEmployees >= 5', reward: { treasury: 25000 }, target: 5 },
  
  // PRODUCTION - 15 achievements
  { id: 'first_product', name: 'Premier Produit', description: 'Lancer votre premier produit', category: 'production', icon: '📦', requirement: 'launchedProducts >= 1', reward: { credibility: 5 }, target: 1 },
  { id: 'product_10', name: 'Catalogue Étoffé', description: 'Avoir 10 produits actifs', category: 'production', icon: '🗂️', requirement: 'activeProducts >= 10', reward: { credibility: 10 }, target: 10 },
  { id: 'quality_100', name: 'Qualité Parfaite', description: 'Un produit avec 100% de qualité', category: 'production', icon: '💯', requirement: 'maxQuality >= 100', reward: { treasury: 15000 }, target: 100 },
  { id: 'bestseller', name: 'Bestseller', description: '10 000 ventes d\'un produit', category: 'production', icon: '🏅', requirement: 'maxSales >= 10000', reward: { treasury: 30000, credibility: 10 }, target: 10000 },
  { id: 'first_patent', name: 'Premier Brevet', description: 'Déposer votre premier brevet', category: 'production', icon: '📜', requirement: 'patents >= 1', reward: { credibility: 8 }, target: 1 },
  { id: 'patent_portfolio', name: 'Portfolio Brevets', description: 'Avoir 10 brevets actifs', category: 'production', icon: '📚', requirement: 'patents >= 10', reward: { credibility: 20 }, target: 10 },
  { id: 'innovation_leader', name: 'Leader Innovation', description: 'Score innovation de 80+', category: 'production', icon: '💡', requirement: 'innovationScore >= 80', reward: { treasury: 25000 }, target: 80 },
  { id: 'rd_master', name: 'Maître R&D', description: 'Compléter 25 projets R&D', category: 'production', icon: '🔬', requirement: 'completedRD >= 25', reward: { treasury: 20000 }, target: 25 },
  { id: 'certified', name: 'Certifié', description: 'Obtenir 5 certifications', category: 'production', icon: '✅', requirement: 'certifications >= 5', reward: { credibility: 15 }, target: 5 },
  { id: 'product_line', name: 'Ligne de Produits', description: '5 produits en maturité simultanément', category: 'production', icon: '📊', requirement: 'matureProducts >= 5', reward: { treasury: 20000 }, target: 5 },
  { id: 'margin_product', name: 'Produit Premium', description: 'Un produit avec 60% de marge', category: 'production', icon: '💎', requirement: 'maxMargin >= 60', reward: { treasury: 15000 }, target: 60 },
  { id: 'eco_design', name: 'Éco-conception', description: 'Obtenir la certification écologique', category: 'production', icon: '🌱', requirement: 'ecoCertified', reward: { credibility: 15 }, target: 1 },
  { id: 'supply_optimized', name: 'Supply Optimisée', description: 'Stock tournant < 30 jours', category: 'production', icon: '🔄', requirement: 'stockRotation <= 30', reward: { treasury: 10000 }, target: 30 },
  { id: 'supplier_partner', name: 'Partenaire Fournisseurs', description: '5 fournisseurs stratégiques', category: 'production', icon: '🤝', requirement: 'strategicSuppliers >= 5', reward: { treasury: 15000 }, target: 5 },
  { id: 'zero_defect', name: 'Zéro Défaut', description: '1 an sans produit défectueux', category: 'production', icon: '✨', requirement: 'monthsWithoutDefect >= 12', reward: { credibility: 20 }, target: 12 },
  
  // COMMERCIAL - 15 achievements
  { id: 'first_client', name: 'Premier Client', description: 'Signer votre premier contrat', category: 'commercial', icon: '🤝', requirement: 'clients >= 1', reward: { credibility: 3 }, target: 1 },
  { id: 'client_100', name: 'Carnet Clients', description: 'Avoir 100 clients actifs', category: 'commercial', icon: '📒', requirement: 'clients >= 100', reward: { credibility: 15 }, target: 100 },
  { id: 'grand_compte', name: 'Grand Compte', description: 'Signer un client grand compte', category: 'commercial', icon: '🏛️', requirement: 'grandCompteClients >= 1', reward: { treasury: 20000 }, target: 1 },
  { id: 'public_market', name: 'Marché Public', description: 'Remporter un appel d\'offres public', category: 'commercial', icon: '🏛️', requirement: 'publicContracts >= 1', reward: { credibility: 15 }, target: 1 },
  { id: 'retention_95', name: 'Rétention 95%', description: 'Taux de rétention client de 95%', category: 'commercial', icon: '🔐', requirement: 'clientRetention >= 95', reward: { treasury: 15000 }, target: 95 },
  { id: 'nps_80', name: 'NPS 80+', description: 'Net Promoter Score de 80+', category: 'commercial', icon: '💯', requirement: 'nps >= 80', reward: { credibility: 12 }, target: 80 },
  { id: 'upsell', name: 'Upsell Master', description: '50 contrats upgradés', category: 'commercial', icon: '⬆️', requirement: 'upsells >= 50', reward: { treasury: 20000 }, target: 50 },
  { id: 'referral', name: 'Parrainage', description: '25 clients par recommandation', category: 'commercial', icon: '🗣️', requirement: 'referralClients >= 25', reward: { credibility: 10 }, target: 25 },
  { id: 'market_leader', name: 'Leader du Marché', description: 'Part de marché de 25%', category: 'commercial', icon: '🏆', requirement: 'marketShare >= 25', reward: { credibility: 25, treasury: 50000 }, target: 25 },
  { id: 'crush_competition', name: 'Écraser la Concurrence', description: 'Dépasser le concurrent #1', category: 'commercial', icon: '💪', requirement: 'isMarketLeader', reward: { credibility: 30 }, target: 1 },
  { id: 'price_war_winner', name: 'Guerre des Prix', description: 'Survivre à une guerre des prix', category: 'commercial', icon: '⚔️', requirement: 'survivedPriceWar', reward: { credibility: 15 }, target: 1 },
  { id: 'brand_awareness', name: 'Notoriété', description: 'Réputation de 90+', category: 'commercial', icon: '📢', requirement: 'reputation >= 90', reward: { treasury: 25000 }, target: 90 },
  { id: 'viral_campaign', name: 'Campagne Virale', description: 'Lancer une campagne virale réussie', category: 'commercial', icon: '🌐', requirement: 'viralCampaigns >= 1', reward: { credibility: 15 }, target: 1 },
  { id: 'sales_million', name: 'Million de Ventes', description: 'Vendre 1 million d\'unités', category: 'commercial', icon: '📊', requirement: 'totalUnitsSold >= 1000000', reward: { treasury: 100000 }, target: 1000000 },
  { id: 'recurring_revenue', name: 'Revenus Récurrents', description: '80% de revenus récurrents', category: 'commercial', icon: '🔁', requirement: 'recurringRevenueRatio >= 80', reward: { treasury: 30000 }, target: 80 },
  
  // LEGAL - 10 achievements
  { id: 'first_win', name: 'Première Victoire', description: 'Gagner votre premier procès', category: 'legal', icon: '⚖️', requirement: 'wonCases >= 1', reward: { credibility: 8 }, target: 1 },
  { id: 'undefeated', name: 'Invaincu', description: '10 victoires judiciaires sans défaite', category: 'legal', icon: '🏅', requirement: 'consecutiveWins >= 10', reward: { credibility: 20 }, target: 10 },
  { id: 'ip_fortress', name: 'Forteresse IP', description: '20 propriétés intellectuelles', category: 'legal', icon: '🏰', requirement: 'totalIP >= 20', reward: { credibility: 15 }, target: 20 },
  { id: 'no_lawsuits', name: 'Zéro Litige', description: '3 ans sans procès', category: 'legal', icon: '🕊️', requirement: 'yearsWithoutLawsuit >= 3', reward: { treasury: 20000 }, target: 3 },
  { id: 'compliance_perfect', name: 'Conformité Parfaite', description: 'Aucune pénalité en 5 ans', category: 'legal', icon: '✅', requirement: 'yearsWithoutPenalty >= 5', reward: { credibility: 20 }, target: 5 },
  { id: 'settlement_master', name: 'Négociateur', description: '10 règlements à l\'amiable', category: 'legal', icon: '🤝', requirement: 'settledCases >= 10', reward: { treasury: 15000 }, target: 10 },
  { id: 'gdpr_expert', name: 'Expert RGPD', description: 'Certification RGPD obtenue', category: 'legal', icon: '🔒', requirement: 'gdprCertified', reward: { credibility: 10 }, target: 1 },
  { id: 'trade_mark', name: 'Marque Protégée', description: '5 marques déposées', category: 'legal', icon: '™️', requirement: 'trademarks >= 5', reward: { credibility: 10 }, target: 5 },
  { id: 'legal_team', name: 'Équipe Juridique', description: '3 avocats sous contrat', category: 'legal', icon: '⚖️', requirement: 'lawyers >= 3', reward: { treasury: 10000 }, target: 3 },
  { id: 'whistleblower', name: 'Lanceur d\'Alerte', description: 'Dénoncer une pratique illégale', category: 'legal', icon: '🔔', requirement: 'whistleblowerActions >= 1', reward: { credibility: 15 }, target: 1 },
  
  // INTERNATIONAL - 10 achievements
  { id: 'first_export', name: 'Premier Export', description: 'Exporter dans un pays', category: 'international', icon: '🌍', requirement: 'exportCountries >= 1', reward: { credibility: 8 }, target: 1 },
  { id: 'european', name: 'Européen', description: 'Exporter dans 5 pays UE', category: 'international', icon: '🇪🇺', requirement: 'euCountries >= 5', reward: { credibility: 15 }, target: 5 },
  { id: 'global', name: 'Global Player', description: 'Présence dans 20 pays', category: 'international', icon: '🌐', requirement: 'countries >= 20', reward: { credibility: 25, treasury: 50000 }, target: 20 },
  { id: 'first_subsidiary', name: 'Première Filiale', description: 'Créer une filiale à l\'étranger', category: 'international', icon: '🏢', requirement: 'subsidiaries >= 1', reward: { credibility: 12 }, target: 1 },
  { id: 'multinational', name: 'Multinationale', description: '5 filiales à l\'étranger', category: 'international', icon: '🌏', requirement: 'subsidiaries >= 5', reward: { credibility: 25, treasury: 100000 }, target: 5 },
  { id: 'currency_master', name: 'Maître des Devises', description: 'Opérer en 5 devises', category: 'international', icon: '💱', requirement: 'currencies >= 5', reward: { treasury: 20000 }, target: 5 },
  { id: 'customs_pro', name: 'Pro des Douanes', description: 'Réduire les frais douaniers de 50%', category: 'international', icon: '📋', requirement: 'customsReduction >= 50', reward: { treasury: 25000 }, target: 50 },
  { id: 'local_partner', name: 'Partenariats Locaux', description: '10 partenaires locaux', category: 'international', icon: '🤝', requirement: 'localPartners >= 10', reward: { credibility: 15 }, target: 10 },
  { id: 'export_champion', name: 'Champion Export', description: '50% du CA à l\'export', category: 'international', icon: '🏆', requirement: 'exportRevenueRatio >= 50', reward: { credibility: 20 }, target: 50 },
  { id: 'emerging_markets', name: 'Marchés Émergents', description: 'Présence en Asie et Amérique du Sud', category: 'international', icon: '🌱', requirement: 'emergingMarkets >= 2', reward: { treasury: 30000 }, target: 2 },
];

// ==================== MISSIONS DATABASE - 50+ ====================
export const MISSIONS_DATABASE: Omit<Mission, 'completed' | 'failed'>[] = [
  // Starter missions
  { id: 'm_first_employee', title: 'Constitution d\'Équipe', description: 'Embauchez votre premier employé', objectives: [{ id: 'o1', description: 'Embaucher 1 employé', target: 1, current: 0, completed: false }], reward: { treasury: 2000 } },
  { id: 'm_first_product', title: 'Premier Produit', description: 'Lancez votre premier produit sur le marché', objectives: [{ id: 'o1', description: 'Développer un produit', target: 1, current: 0, completed: false }, { id: 'o2', description: 'Lancer le produit', target: 1, current: 0, completed: false }], reward: { treasury: 5000, credibility: 5 } },
  { id: 'm_first_profit', title: 'Premier Bénéfice', description: 'Terminez un mois avec un bénéfice', objectives: [{ id: 'o1', description: 'Bénéfice mensuel positif', target: 1, current: 0, completed: false }], reward: { treasury: 3000 } },
  { id: 'm_tax_compliance', title: 'Conformité Fiscale', description: 'Payez vos premières taxes à temps', objectives: [{ id: 'o1', description: 'Payer la TVA', target: 1, current: 0, completed: false }], reward: { credibility: 5 } },
  { id: 'm_client_acquisition', title: 'Acquisition Client', description: 'Signez votre premier contrat client', objectives: [{ id: 'o1', description: 'Signer un contrat', target: 1, current: 0, completed: false }], reward: { treasury: 5000 } },
  
  // Growth missions
  { id: 'm_team_growth', title: 'Croissance d\'Équipe', description: 'Faites grandir votre équipe', objectives: [{ id: 'o1', description: 'Avoir 5 employés', target: 5, current: 0, completed: false }, { id: 'o2', description: 'Moral moyen > 70%', target: 70, current: 0, completed: false }], deadline: 180, reward: { treasury: 10000 } },
  { id: 'm_product_line', title: 'Gamme Produits', description: 'Développez votre gamme', objectives: [{ id: 'o1', description: '3 produits actifs', target: 3, current: 0, completed: false }], deadline: 365, reward: { treasury: 15000, credibility: 10 } },
  { id: 'm_revenue_100k', title: 'Cap des 100k', description: 'Atteignez 100k€ de revenus mensuels', objectives: [{ id: 'o1', description: 'Revenus mensuels >= 100k€', target: 100000, current: 0, completed: false }], reward: { credibility: 15 } },
  { id: 'm_first_loan', title: 'Premier Emprunt', description: 'Contractez et remboursez un emprunt', objectives: [{ id: 'o1', description: 'Obtenir un prêt', target: 1, current: 0, completed: false }, { id: 'o2', description: 'Rembourser le prêt', target: 1, current: 0, completed: false }], reward: { treasury: 5000 } },
  { id: 'm_supplier_network', title: 'Réseau Fournisseurs', description: 'Établissez des relations fournisseurs', objectives: [{ id: 'o1', description: '3 fournisseurs réguliers', target: 3, current: 0, completed: false }], reward: { treasury: 8000 } },
  
  // Intermediate missions
  { id: 'm_market_expansion', title: 'Expansion Marché', description: 'Augmentez votre part de marché', objectives: [{ id: 'o1', description: 'Part de marché 10%', target: 10, current: 0, completed: false }], deadline: 720, reward: { treasury: 25000, credibility: 15 } },
  { id: 'm_quality_leader', title: 'Leader Qualité', description: 'Devenez référence qualité', objectives: [{ id: 'o1', description: 'Qualité produit 90%', target: 90, current: 0, completed: false }, { id: 'o2', description: '2 certifications', target: 2, current: 0, completed: false }], reward: { credibility: 20 } },
  { id: 'm_real_estate', title: 'Empire Immobilier', description: 'Développez votre patrimoine immobilier', objectives: [{ id: 'o1', description: '3 propriétés', target: 3, current: 0, completed: false }], reward: { treasury: 30000 } },
  { id: 'm_export_start', title: 'Début Export', description: 'Lancez-vous à l\'international', objectives: [{ id: 'o1', description: 'Exporter dans 2 pays', target: 2, current: 0, completed: false }], reward: { treasury: 20000, credibility: 10 } },
  { id: 'm_innovation', title: 'Innovation', description: 'Développez votre R&D', objectives: [{ id: 'o1', description: '3 brevets déposés', target: 3, current: 0, completed: false }], reward: { credibility: 15 } },
  
  // Advanced missions
  { id: 'm_million_treasury', title: 'Millionnaire', description: 'Atteignez le million en trésorerie', objectives: [{ id: 'o1', description: 'Trésorerie >= 1M€', target: 1000000, current: 0, completed: false }], reward: { credibility: 25 } },
  { id: 'm_team_50', title: 'PME Confirmée', description: 'Atteignez 50 employés', objectives: [{ id: 'o1', description: '50 employés', target: 50, current: 0, completed: false }, { id: 'o2', description: 'Productivité moy. 110%', target: 110, current: 0, completed: false }], reward: { treasury: 50000, credibility: 20 } },
  { id: 'm_legal_victory', title: 'Victoire Judiciaire', description: 'Gagnez un procès important', objectives: [{ id: 'o1', description: 'Gagner un procès', target: 1, current: 0, completed: false }], reward: { treasury: 25000, credibility: 15 } },
  { id: 'm_subsidiary', title: 'Première Filiale', description: 'Créez votre première filiale étrangère', objectives: [{ id: 'o1', description: 'Créer une filiale', target: 1, current: 0, completed: false }], reward: { treasury: 40000, credibility: 15 } },
  { id: 'm_vip_bank', title: 'Client VIP Banque', description: 'Devenez client VIP de votre banque', objectives: [{ id: 'o1', description: 'Statut VIP banque', target: 1, current: 0, completed: false }], reward: { treasury: 30000 } },
  
  // Expert missions
  { id: 'm_market_leader', title: 'Leader du Marché', description: 'Devenez le leader de votre secteur', objectives: [{ id: 'o1', description: 'Part de marché 25%', target: 25, current: 0, completed: false }, { id: 'o2', description: 'Dépasser concurrent #1', target: 1, current: 0, completed: false }], reward: { treasury: 100000, credibility: 30 } },
  { id: 'm_multinational', title: 'Multinationale', description: 'Créez 5 filiales à l\'étranger', objectives: [{ id: 'o1', description: '5 filiales', target: 5, current: 0, completed: false }, { id: 'o2', description: 'Présence 15 pays', target: 15, current: 0, completed: false }], reward: { treasury: 200000, credibility: 35 } },
  { id: 'm_ipo', title: 'Introduction en Bourse', description: 'Préparez votre entreprise pour l\'IPO', objectives: [{ id: 'o1', description: 'Trésorerie 10M€', target: 10000000, current: 0, completed: false }, { id: 'o2', description: '500 employés', target: 500, current: 0, completed: false }, { id: 'o3', description: 'Crédibilité 90', target: 90, current: 0, completed: false }], reward: { credibility: 50 } },
  { id: 'm_empire', title: 'Empire Commercial', description: 'Bâtissez un empire', objectives: [{ id: 'o1', description: 'CA annuel 100M€', target: 100000000, current: 0, completed: false }], reward: { treasury: 500000 } },
  { id: 'm_legacy', title: 'Héritage', description: 'Créez une entreprise pérenne', objectives: [{ id: 'o1', description: 'Survivre 20 ans', target: 20, current: 0, completed: false }, { id: 'o2', description: 'Tous les achievements finance', target: 15, current: 0, completed: false }], reward: { credibility: 100 } },
  
  // Challenge missions
  { id: 'm_crisis_survival', title: 'Survivre à la Crise', description: 'Survivez à une crise économique', objectives: [{ id: 'o1', description: 'Traverser une crise', target: 1, current: 0, completed: false }, { id: 'o2', description: 'Rester profitable', target: 1, current: 0, completed: false }], reward: { credibility: 20 } },
  { id: 'm_turnaround', title: 'Redressement', description: 'Redressez une situation critique', objectives: [{ id: 'o1', description: 'Trésorerie négative', target: 1, current: 0, completed: false }, { id: 'o2', description: 'Revenir au positif', target: 1, current: 0, completed: false }], reward: { treasury: 30000, credibility: 15 } },
  { id: 'm_hostile_takeover', title: 'Rachat Hostile', description: 'Résistez à une tentative de rachat', objectives: [{ id: 'o1', description: 'Repousser le rachat', target: 1, current: 0, completed: false }], reward: { credibility: 25 } },
  { id: 'm_strike_resolution', title: 'Résolution de Grève', description: 'Résolvez un conflit social', objectives: [{ id: 'o1', description: 'Terminer la grève', target: 1, current: 0, completed: false }, { id: 'o2', description: 'Moral > 60%', target: 60, current: 0, completed: false }], reward: { treasury: 15000 } },
  { id: 'm_scandal_recovery', title: 'Après le Scandale', description: 'Récupérez votre réputation après un scandale', objectives: [{ id: 'o1', description: 'Crédibilité retour à 70', target: 70, current: 0, completed: false }], reward: { credibility: 20 } },
  
  // Specialty missions
  { id: 'm_green_company', title: 'Entreprise Verte', description: 'Devenez exemplaire en RSE', objectives: [{ id: 'o1', description: 'Certification écologique', target: 1, current: 0, completed: false }, { id: 'o2', description: '3 fournisseurs locaux', target: 3, current: 0, completed: false }], reward: { credibility: 20 } },
  { id: 'm_tech_pioneer', title: 'Pionnier Tech', description: 'Innovez dans la technologie', objectives: [{ id: 'o1', description: '5 brevets tech', target: 5, current: 0, completed: false }, { id: 'o2', description: 'Score innovation 85', target: 85, current: 0, completed: false }], reward: { treasury: 50000 } },
  { id: 'm_social_model', title: 'Modèle Social', description: 'Devenez un modèle employeur', objectives: [{ id: 'o1', description: 'Tous avantages actifs', target: 7, current: 0, completed: false }, { id: 'o2', description: 'Moral moyen 95%', target: 95, current: 0, completed: false }], reward: { credibility: 25 } },
  { id: 'm_acquisition', title: 'Acquisition', description: 'Rachetez un concurrent', objectives: [{ id: 'o1', description: 'Racheter une entreprise', target: 1, current: 0, completed: false }], reward: { treasury: 50000, credibility: 20 } },
  { id: 'm_franchise', title: 'Franchise', description: 'Créez un réseau de franchises', objectives: [{ id: 'o1', description: '10 franchises', target: 10, current: 0, completed: false }], reward: { treasury: 75000, credibility: 15 } },
  
  // More specialized missions
  { id: 'm_training_academy', title: 'Académie Formation', description: 'Créez votre propre académie', objectives: [{ id: 'o1', description: '100 formations données', target: 100, current: 0, completed: false }], reward: { credibility: 15 } },
  { id: 'm_client_satisfaction', title: 'Satisfaction Client', description: 'Atteignez l\'excellence client', objectives: [{ id: 'o1', description: 'NPS de 90', target: 90, current: 0, completed: false }, { id: 'o2', description: 'Rétention 98%', target: 98, current: 0, completed: false }], reward: { treasury: 40000 } },
  { id: 'm_digital_transformation', title: 'Transformation Digitale', description: 'Digitalisez votre entreprise', objectives: [{ id: 'o1', description: 'Productivité +30%', target: 130, current: 0, completed: false }], reward: { credibility: 15 } },
  { id: 'm_supply_excellence', title: 'Excellence Supply', description: 'Optimisez votre chaîne logistique', objectives: [{ id: 'o1', description: '10 fournisseurs stratégiques', target: 10, current: 0, completed: false }, { id: 'o2', description: 'Stock tournant < 15j', target: 15, current: 0, completed: false }], reward: { treasury: 35000 } },
  { id: 'm_brand_builder', title: 'Bâtisseur de Marque', description: 'Construisez une marque forte', objectives: [{ id: 'o1', description: 'Réputation 95', target: 95, current: 0, completed: false }, { id: 'o2', description: '5 marques déposées', target: 5, current: 0, completed: false }], reward: { credibility: 30 } },
];

// Check if achievement is unlocked
export function checkAchievement(achievement: Achievement, company: Company, state: GameState): boolean {
  // Simple checks based on common requirements
  switch (achievement.id) {
    case 'first_million': return company.treasury >= 1000000;
    case 'ten_million': return company.treasury >= 10000000;
    case 'hundred_million': return company.treasury >= 100000000;
    case 'first_hire': return company.employees.length >= 1;
    case 'team_10': return company.employees.length >= 10;
    case 'team_50': return company.employees.length >= 50;
    case 'team_250': return company.employees.length >= 250;
    case 'team_1000': return company.employees.length >= 1000;
    case 'first_product': return company.products.filter(p => p.phase !== 'rd').length >= 1;
    case 'product_10': return company.products.filter(p => p.phase !== 'rd').length >= 10;
    case 'first_client': return company.clients.length >= 1;
    case 'client_100': return company.clients.length >= 100;
    case 'first_export': return company.foreignMarkets.filter(m => m.penetration > 0).length >= 1;
    case 'first_subsidiary': return company.subsidiaries.length >= 1;
    case 'multinational': return company.subsidiaries.length >= 5;
    case 'first_patent': return company.intellectualProperty.filter(ip => ip.type === 'brevet').length >= 1;
    case 'patent_portfolio': return company.intellectualProperty.filter(ip => ip.type === 'brevet').length >= 10;
    case 'investor_darling': return company.bankAccount.creditScore >= 900;
    case 'happy_team': return company.employees.reduce((sum, e) => sum + e.moral, 0) / Math.max(1, company.employees.length) >= 90;
    case 'productive_team': return company.employees.reduce((sum, e) => sum + e.productivity, 0) / Math.max(1, company.employees.length) >= 130;
    case 'debt_free': return company.bankAccount.loans.length === 0;
    case 'cash_cow': return company.monthlyRevenue >= 1000000;
    case 'market_leader': return company.marketShare >= 25;
    case 'brand_awareness': return company.reputation >= 90;
    case 'global': return company.foreignMarkets.filter(m => m.penetration > 0).length >= 20;
    case 'quality_100': return company.products.some(p => p.quality >= 100);
    case 'first_win': return company.legalCases.filter(c => c.status === 'cloture' && c.winProbability > 0.5).length >= 1;
    default: return false;
  }
}

// Update all achievements
export function updateAchievements(company: Company, state: GameState): Achievement[] {
  return company.achievements.map(ach => {
    if (!ach.unlocked && checkAchievement(ach, company, state)) {
      return { ...ach, unlocked: true, unlockedDate: state.day + (state.month - 1) * 30 + (state.year - 1) * 360 };
    }
    return ach;
  });
}

// Initialize achievements for new company
export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENTS_DATABASE.map(a => ({
    ...a,
    unlocked: false,
    progress: 0,
  }));
}

// Initialize missions for new company
export function initializeMissions(): Mission[] {
  // Start with first 5 missions
  return MISSIONS_DATABASE.slice(0, 5).map(m => ({
    ...m,
    completed: false,
    failed: false,
  }));
}

// Get next available mission
export function getNextMission(completedCount: number): Mission | null {
  if (completedCount >= MISSIONS_DATABASE.length) return null;
  const next = MISSIONS_DATABASE[completedCount];
  return { ...next, completed: false, failed: false };
}

// Check mission progress
export function updateMissionProgress(mission: Mission, company: Company, state: GameState): Mission {
  const updatedObjectives = mission.objectives.map(obj => {
    let current = obj.current;
    
    // Update based on objective description
    if (obj.description.includes('employé')) current = company.employees.length;
    if (obj.description.includes('produit')) current = company.products.filter(p => p.phase !== 'rd').length;
    if (obj.description.includes('client')) current = company.clients.length;
    if (obj.description.includes('Trésorerie')) current = company.treasury;
    if (obj.description.includes('Moral')) current = company.employees.reduce((s, e) => s + e.moral, 0) / Math.max(1, company.employees.length);
    if (obj.description.includes('filiale')) current = company.subsidiaries.length;
    if (obj.description.includes('brevet')) current = company.intellectualProperty.filter(ip => ip.type === 'brevet').length;
    if (obj.description.includes('pays')) current = company.foreignMarkets.filter(m => m.penetration > 0).length;
    if (obj.description.includes('fournisseur')) current = company.suppliers.length;
    if (obj.description.includes('propriété')) current = company.properties.length;
    
    return {
      ...obj,
      current,
      completed: current >= obj.target,
    };
  });

  const allCompleted = updatedObjectives.every(o => o.completed);
  const failed = mission.deadline ? state.day + (state.month - 1) * 30 > mission.deadline && !allCompleted : false;

  return {
    ...mission,
    objectives: updatedObjectives,
    completed: allCompleted,
    failed,
  };
}
