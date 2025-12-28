// ============================================
// SHOP ENGINE - 100+ Items
// ============================================

export type ItemCategory = 'boost' | 'upgrade' | 'cosmetic' | 'resource' | 'pack' | 'premium' | 'seasonal' | 'limited';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type CurrencyType = 'coins' | 'gems' | 'prestige_tokens';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  price: number;
  currency: CurrencyType;
  effect?: ItemEffect;
  duration?: number; // in days, undefined = permanent
  stackable: boolean;
  maxStack: number;
  icon: string;
  unlockRequirement?: string;
  limitedStock?: number;
  discountPercent?: number;
}

export interface ItemEffect {
  type: string;
  value: number;
  target?: string;
}

export interface PlayerInventory {
  coins: number;
  gems: number;
  prestigeTokens: number;
  items: OwnedItem[];
  activeBoosts: ActiveBoost[];
}

export interface OwnedItem {
  itemId: string;
  quantity: number;
  purchaseDate: number;
}

export interface ActiveBoost {
  itemId: string;
  activatedAt: number;
  expiresAt: number;
  effect: ItemEffect;
}

// ==================== BOOST ITEMS (Items 1-25) ====================
const boostItems: ShopItem[] = [
  { id: 'boost_revenue_1', name: 'Boost Revenus I', description: '+10% revenus pendant 24h', category: 'boost', rarity: 'common', price: 500, currency: 'coins', effect: { type: 'revenue_multiplier', value: 1.1 }, duration: 1, stackable: true, maxStack: 5, icon: '💰' },
  { id: 'boost_revenue_2', name: 'Boost Revenus II', description: '+25% revenus pendant 24h', category: 'boost', rarity: 'uncommon', price: 1200, currency: 'coins', effect: { type: 'revenue_multiplier', value: 1.25 }, duration: 1, stackable: true, maxStack: 5, icon: '💵' },
  { id: 'boost_revenue_3', name: 'Boost Revenus III', description: '+50% revenus pendant 24h', category: 'boost', rarity: 'rare', price: 100, currency: 'gems', effect: { type: 'revenue_multiplier', value: 1.5 }, duration: 1, stackable: true, maxStack: 3, icon: '💎' },
  { id: 'boost_xp_1', name: 'Boost XP I', description: '+20% XP pendant 24h', category: 'boost', rarity: 'common', price: 400, currency: 'coins', effect: { type: 'xp_multiplier', value: 1.2 }, duration: 1, stackable: true, maxStack: 5, icon: '⭐' },
  { id: 'boost_xp_2', name: 'Boost XP II', description: '+50% XP pendant 24h', category: 'boost', rarity: 'uncommon', price: 900, currency: 'coins', effect: { type: 'xp_multiplier', value: 1.5 }, duration: 1, stackable: true, maxStack: 5, icon: '🌟' },
  { id: 'boost_xp_3', name: 'Double XP', description: 'x2 XP pendant 24h', category: 'boost', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'xp_multiplier', value: 2 }, duration: 1, stackable: false, maxStack: 1, icon: '✨' },
  { id: 'boost_production_1', name: 'Turbo Production', description: '+15% productivité pendant 24h', category: 'boost', rarity: 'common', price: 600, currency: 'coins', effect: { type: 'productivity_multiplier', value: 1.15 }, duration: 1, stackable: true, maxStack: 5, icon: '⚡' },
  { id: 'boost_production_2', name: 'Super Production', description: '+30% productivité pendant 24h', category: 'boost', rarity: 'uncommon', price: 1400, currency: 'coins', effect: { type: 'productivity_multiplier', value: 1.3 }, duration: 1, stackable: true, maxStack: 3, icon: '🔥' },
  { id: 'boost_moral_1', name: 'Happy Hour', description: '+20% moral employés pendant 24h', category: 'boost', rarity: 'common', price: 350, currency: 'coins', effect: { type: 'moral_boost', value: 20 }, duration: 1, stackable: true, maxStack: 5, icon: '😊' },
  { id: 'boost_moral_2', name: 'Super Happy', description: '+50% moral employés pendant 3 jours', category: 'boost', rarity: 'rare', price: 80, currency: 'gems', effect: { type: 'moral_boost', value: 50 }, duration: 3, stackable: false, maxStack: 1, icon: '🎉' },
  { id: 'boost_reputation_1', name: 'PR Boost', description: '+10% réputation pendant 24h', category: 'boost', rarity: 'common', price: 700, currency: 'coins', effect: { type: 'reputation_boost', value: 10 }, duration: 1, stackable: true, maxStack: 5, icon: '📣' },
  { id: 'boost_reputation_2', name: 'Viral Buzz', description: '+30% réputation pendant 3 jours', category: 'boost', rarity: 'rare', price: 120, currency: 'gems', effect: { type: 'reputation_boost', value: 30 }, duration: 3, stackable: false, maxStack: 1, icon: '🚀' },
  { id: 'boost_luck', name: 'Chance Boost', description: '+15% chance événements positifs', category: 'boost', rarity: 'uncommon', price: 1000, currency: 'coins', effect: { type: 'luck_boost', value: 15 }, duration: 1, stackable: true, maxStack: 3, icon: '🍀' },
  { id: 'boost_negotiation', name: 'Master Négociateur', description: '+20% réduction achats', category: 'boost', rarity: 'rare', price: 100, currency: 'gems', effect: { type: 'purchase_discount', value: 20 }, duration: 1, stackable: false, maxStack: 1, icon: '🤝' },
  { id: 'boost_speed_1', name: 'Time Warp I', description: 'R&D 25% plus rapide', category: 'boost', rarity: 'uncommon', price: 800, currency: 'coins', effect: { type: 'rd_speed', value: 1.25 }, duration: 1, stackable: true, maxStack: 3, icon: '⏰' },
  { id: 'boost_speed_2', name: 'Time Warp II', description: 'R&D 50% plus rapide', category: 'boost', rarity: 'rare', price: 90, currency: 'gems', effect: { type: 'rd_speed', value: 1.5 }, duration: 1, stackable: false, maxStack: 1, icon: '⏱️' },
  { id: 'boost_training', name: 'Formation Express', description: 'Formations 2x plus rapides', category: 'boost', rarity: 'rare', price: 110, currency: 'gems', effect: { type: 'training_speed', value: 2 }, duration: 3, stackable: false, maxStack: 1, icon: '📚' },
  { id: 'boost_marketing', name: 'Marketing Blitz', description: '+40% efficacité marketing', category: 'boost', rarity: 'rare', price: 130, currency: 'gems', effect: { type: 'marketing_efficiency', value: 1.4 }, duration: 3, stackable: false, maxStack: 1, icon: '📢' },
  { id: 'boost_crisis_shield', name: 'Bouclier Anti-Crise', description: 'Immunité crises mineures', category: 'boost', rarity: 'epic', price: 200, currency: 'gems', effect: { type: 'crisis_immunity', value: 1 }, duration: 7, stackable: false, maxStack: 1, icon: '🛡️' },
  { id: 'boost_golden_touch', name: 'Toucher d\'Or', description: 'Double les gains de quêtes', category: 'boost', rarity: 'epic', price: 250, currency: 'gems', effect: { type: 'quest_reward_multiplier', value: 2 }, duration: 3, stackable: false, maxStack: 1, icon: '👑' },
  { id: 'boost_insight', name: 'Vision du Marché', description: 'Prédit les tendances économiques', category: 'boost', rarity: 'epic', price: 300, currency: 'gems', effect: { type: 'market_insight', value: 1 }, duration: 7, stackable: false, maxStack: 1, icon: '🔮' },
  { id: 'boost_recruitment', name: 'Talent Scout', description: 'Candidats de meilleure qualité', category: 'boost', rarity: 'rare', price: 95, currency: 'gems', effect: { type: 'recruitment_quality', value: 30 }, duration: 3, stackable: false, maxStack: 1, icon: '🎯' },
  { id: 'boost_international', name: 'Passeport VIP', description: '-30% barrières à l\'entrée marchés', category: 'boost', rarity: 'rare', price: 140, currency: 'gems', effect: { type: 'entry_barrier_reduction', value: 30 }, duration: 7, stackable: false, maxStack: 1, icon: '🌍' },
  { id: 'boost_tax', name: 'Optimisation Fiscale', description: '-15% impôts', category: 'boost', rarity: 'uncommon', price: 1100, currency: 'coins', effect: { type: 'tax_reduction', value: 15 }, duration: 1, stackable: true, maxStack: 3, icon: '📊' },
  { id: 'boost_ultimate', name: 'Boost Ultime', description: 'Tous les bonus x1.5', category: 'boost', rarity: 'legendary', price: 500, currency: 'gems', effect: { type: 'all_multiplier', value: 1.5 }, duration: 1, stackable: false, maxStack: 1, icon: '🌈' },
];

// ==================== UPGRADE ITEMS (Items 26-50) ====================
const upgradeItems: ShopItem[] = [
  { id: 'upgrade_hq_1', name: 'Bureau Amélioré', description: '+5 capacité employés', category: 'upgrade', rarity: 'common', price: 2000, currency: 'coins', effect: { type: 'employee_capacity', value: 5 }, stackable: false, maxStack: 1, icon: '🏢' },
  { id: 'upgrade_hq_2', name: 'Siège Social', description: '+15 capacité employés', category: 'upgrade', rarity: 'uncommon', price: 5000, currency: 'coins', effect: { type: 'employee_capacity', value: 15 }, stackable: false, maxStack: 1, icon: '🏛️' },
  { id: 'upgrade_hq_3', name: 'Campus Corporate', description: '+50 capacité employés', category: 'upgrade', rarity: 'rare', price: 200, currency: 'gems', effect: { type: 'employee_capacity', value: 50 }, stackable: false, maxStack: 1, icon: '🏰' },
  { id: 'upgrade_warehouse_1', name: 'Entrepôt', description: '+100% stockage', category: 'upgrade', rarity: 'common', price: 1500, currency: 'coins', effect: { type: 'storage_capacity', value: 100 }, stackable: false, maxStack: 1, icon: '📦' },
  { id: 'upgrade_warehouse_2', name: 'Centre Logistique', description: '+300% stockage', category: 'upgrade', rarity: 'uncommon', price: 4000, currency: 'coins', effect: { type: 'storage_capacity', value: 300 }, stackable: false, maxStack: 1, icon: '🏭' },
  { id: 'upgrade_lab_1', name: 'Labo R&D Basic', description: '+1 projet R&D simultané', category: 'upgrade', rarity: 'uncommon', price: 3000, currency: 'coins', effect: { type: 'concurrent_research', value: 1 }, stackable: false, maxStack: 1, icon: '🔬' },
  { id: 'upgrade_lab_2', name: 'Centre Innovation', description: '+3 projets R&D simultanés', category: 'upgrade', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'concurrent_research', value: 3 }, stackable: false, maxStack: 1, icon: '🧪' },
  { id: 'upgrade_marketing_1', name: 'Agence Marketing', description: '+2 campagnes simultanées', category: 'upgrade', rarity: 'uncommon', price: 2500, currency: 'coins', effect: { type: 'concurrent_campaigns', value: 2 }, stackable: false, maxStack: 1, icon: '📺' },
  { id: 'upgrade_marketing_2', name: 'Studio Créatif', description: '+5 campagnes simultanées', category: 'upgrade', rarity: 'rare', price: 130, currency: 'gems', effect: { type: 'concurrent_campaigns', value: 5 }, stackable: false, maxStack: 1, icon: '🎬' },
  { id: 'upgrade_hr_1', name: 'Département RH', description: 'Recrutement automatisé', category: 'upgrade', rarity: 'uncommon', price: 3500, currency: 'coins', effect: { type: 'auto_recruitment', value: 1 }, stackable: false, maxStack: 1, icon: '👥' },
  { id: 'upgrade_hr_2', name: 'HR Excellence', description: 'Formation automatisée', category: 'upgrade', rarity: 'rare', price: 160, currency: 'gems', effect: { type: 'auto_training', value: 1 }, stackable: false, maxStack: 1, icon: '🎓' },
  { id: 'upgrade_finance_1', name: 'Comptabilité Pro', description: 'Rapports financiers détaillés', category: 'upgrade', rarity: 'uncommon', price: 2000, currency: 'coins', effect: { type: 'financial_reports', value: 1 }, stackable: false, maxStack: 1, icon: '📈' },
  { id: 'upgrade_finance_2', name: 'CFO Virtuel', description: 'Optimisation trésorerie auto', category: 'upgrade', rarity: 'rare', price: 180, currency: 'gems', effect: { type: 'auto_treasury', value: 1 }, stackable: false, maxStack: 1, icon: '🤖' },
  { id: 'upgrade_legal_1', name: 'Service Juridique', description: '-20% risques légaux', category: 'upgrade', rarity: 'uncommon', price: 4000, currency: 'coins', effect: { type: 'legal_risk_reduction', value: 20 }, stackable: false, maxStack: 1, icon: '⚖️' },
  { id: 'upgrade_legal_2', name: 'Cabinet Avocat', description: 'Protection litiges auto', category: 'upgrade', rarity: 'rare', price: 170, currency: 'gems', effect: { type: 'lawsuit_protection', value: 1 }, stackable: false, maxStack: 1, icon: '🏛️' },
  { id: 'upgrade_security_1', name: 'Cybersécurité', description: '-30% risques cyber', category: 'upgrade', rarity: 'uncommon', price: 3500, currency: 'coins', effect: { type: 'cyber_protection', value: 30 }, stackable: false, maxStack: 1, icon: '🔒' },
  { id: 'upgrade_automation_1', name: 'Automatisation L1', description: 'Tâches basiques automatisées', category: 'upgrade', rarity: 'uncommon', price: 5000, currency: 'coins', effect: { type: 'automation_level', value: 1 }, stackable: false, maxStack: 1, icon: '⚙️' },
  { id: 'upgrade_automation_2', name: 'IA Management', description: 'Décisions assistées par IA', category: 'upgrade', rarity: 'epic', price: 400, currency: 'gems', effect: { type: 'ai_assist', value: 1 }, stackable: false, maxStack: 1, icon: '🧠' },
  { id: 'upgrade_network_1', name: 'Réseau Business', description: '+10% chance partenariats', category: 'upgrade', rarity: 'uncommon', price: 2500, currency: 'coins', effect: { type: 'partnership_chance', value: 10 }, stackable: false, maxStack: 1, icon: '🌐' },
  { id: 'upgrade_network_2', name: 'Club VIP', description: 'Accès investisseurs premium', category: 'upgrade', rarity: 'rare', price: 190, currency: 'gems', effect: { type: 'premium_investors', value: 1 }, stackable: false, maxStack: 1, icon: '💼' },
  { id: 'upgrade_production_1', name: 'Ligne Production+', description: '+20% capacité production', category: 'upgrade', rarity: 'uncommon', price: 4500, currency: 'coins', effect: { type: 'production_capacity', value: 20 }, stackable: false, maxStack: 1, icon: '🔧' },
  { id: 'upgrade_production_2', name: 'Usine 4.0', description: '+50% capacité production', category: 'upgrade', rarity: 'rare', price: 220, currency: 'gems', effect: { type: 'production_capacity', value: 50 }, stackable: false, maxStack: 1, icon: '🏗️' },
  { id: 'upgrade_fleet_1', name: 'Flotte Véhicules', description: 'Livraisons accélérées', category: 'upgrade', rarity: 'uncommon', price: 3000, currency: 'coins', effect: { type: 'delivery_speed', value: 30 }, stackable: false, maxStack: 1, icon: '🚚' },
  { id: 'upgrade_global_1', name: 'Bureau International', description: '+2 marchés accessibles', category: 'upgrade', rarity: 'rare', price: 250, currency: 'gems', effect: { type: 'market_access', value: 2 }, stackable: false, maxStack: 1, icon: '🌏' },
  { id: 'upgrade_prestige', name: 'Tour Prestige', description: '+10% points prestige', category: 'upgrade', rarity: 'epic', price: 500, currency: 'gems', effect: { type: 'prestige_bonus', value: 10 }, stackable: false, maxStack: 1, icon: '🗼' },
];

// ==================== RESOURCE ITEMS (Items 51-70) ====================
const resourceItems: ShopItem[] = [
  { id: 'resource_cash_1', name: 'Petit Coffre', description: '10,000€ en trésorerie', category: 'resource', rarity: 'common', price: 50, currency: 'gems', effect: { type: 'cash', value: 10000 }, stackable: true, maxStack: 99, icon: '💰' },
  { id: 'resource_cash_2', name: 'Coffre Moyen', description: '50,000€ en trésorerie', category: 'resource', rarity: 'uncommon', price: 200, currency: 'gems', effect: { type: 'cash', value: 50000 }, stackable: true, maxStack: 99, icon: '💵' },
  { id: 'resource_cash_3', name: 'Grand Coffre', description: '200,000€ en trésorerie', category: 'resource', rarity: 'rare', price: 700, currency: 'gems', effect: { type: 'cash', value: 200000 }, stackable: true, maxStack: 99, icon: '💎' },
  { id: 'resource_xp_1', name: 'Fiole XP', description: '+500 XP', category: 'resource', rarity: 'common', price: 300, currency: 'coins', effect: { type: 'xp', value: 500 }, stackable: true, maxStack: 99, icon: '⭐' },
  { id: 'resource_xp_2', name: 'Élixir XP', description: '+2,500 XP', category: 'resource', rarity: 'uncommon', price: 1200, currency: 'coins', effect: { type: 'xp', value: 2500 }, stackable: true, maxStack: 99, icon: '🌟' },
  { id: 'resource_xp_3', name: 'Cristal XP', description: '+10,000 XP', category: 'resource', rarity: 'rare', price: 80, currency: 'gems', effect: { type: 'xp', value: 10000 }, stackable: true, maxStack: 99, icon: '💫' },
  { id: 'resource_skill_1', name: 'Livre Compétence', description: '+1 point compétence', category: 'resource', rarity: 'uncommon', price: 1500, currency: 'coins', effect: { type: 'skill_points', value: 1 }, stackable: true, maxStack: 99, icon: '📕' },
  { id: 'resource_skill_2', name: 'Tome Sagesse', description: '+5 points compétence', category: 'resource', rarity: 'rare', price: 100, currency: 'gems', effect: { type: 'skill_points', value: 5 }, stackable: true, maxStack: 99, icon: '📚' },
  { id: 'resource_prestige_1', name: 'Token Prestige', description: '+100 points prestige', category: 'resource', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'prestige_points', value: 100 }, stackable: true, maxStack: 99, icon: '🏆' },
  { id: 'resource_reputation_1', name: 'Badge Réputation', description: '+5 réputation', category: 'resource', rarity: 'uncommon', price: 800, currency: 'coins', effect: { type: 'reputation', value: 5 }, stackable: true, maxStack: 20, icon: '🎖️' },
  { id: 'resource_moral_1', name: 'Cadeau Employés', description: '+10 moral tous', category: 'resource', rarity: 'common', price: 500, currency: 'coins', effect: { type: 'moral_all', value: 10 }, stackable: true, maxStack: 20, icon: '🎁' },
  { id: 'resource_quest_skip', name: 'Skip Quête', description: 'Complete une quête instantanément', category: 'resource', rarity: 'epic', price: 300, currency: 'gems', effect: { type: 'quest_complete', value: 1 }, stackable: true, maxStack: 10, icon: '⏭️' },
  { id: 'resource_crisis_solve', name: 'Kit Anti-Crise', description: 'Résout une crise instantanément', category: 'resource', rarity: 'epic', price: 250, currency: 'gems', effect: { type: 'crisis_solve', value: 1 }, stackable: true, maxStack: 5, icon: '🛠️' },
  { id: 'resource_employee_1', name: 'Candidat Qualifié', description: 'Recrute un employé rare', category: 'resource', rarity: 'rare', price: 120, currency: 'gems', effect: { type: 'rare_employee', value: 1 }, stackable: true, maxStack: 10, icon: '👤' },
  { id: 'resource_employee_2', name: 'Talent Exceptionnel', description: 'Recrute un employé épique', category: 'resource', rarity: 'epic', price: 350, currency: 'gems', effect: { type: 'epic_employee', value: 1 }, stackable: true, maxStack: 5, icon: '🦸' },
  { id: 'resource_product_1', name: 'Blueprint Produit', description: 'Lance un produit sans coût', category: 'resource', rarity: 'rare', price: 180, currency: 'gems', effect: { type: 'free_product', value: 1 }, stackable: true, maxStack: 5, icon: '📋' },
  { id: 'resource_research_1', name: 'Accélérateur R&D', description: 'Termine une recherche instantanément', category: 'resource', rarity: 'epic', price: 280, currency: 'gems', effect: { type: 'instant_research', value: 1 }, stackable: true, maxStack: 5, icon: '⚗️' },
  { id: 'resource_time_1', name: 'Sablier', description: 'Avance d\'un jour', category: 'resource', rarity: 'common', price: 100, currency: 'coins', effect: { type: 'skip_day', value: 1 }, stackable: true, maxStack: 99, icon: '⏳' },
  { id: 'resource_time_2', name: 'Horloge Magique', description: 'Avance d\'une semaine', category: 'resource', rarity: 'uncommon', price: 50, currency: 'gems', effect: { type: 'skip_week', value: 1 }, stackable: true, maxStack: 30, icon: '🕰️' },
  { id: 'resource_respec', name: 'Reset Compétences', description: 'Réinitialise l\'arbre de compétences', category: 'resource', rarity: 'legendary', price: 500, currency: 'gems', effect: { type: 'skill_reset', value: 1 }, stackable: true, maxStack: 3, icon: '🔄' },
];

// ==================== COSMETIC ITEMS (Items 71-85) ====================
const cosmeticItems: ShopItem[] = [
  { id: 'cosmetic_theme_dark', name: 'Thème Sombre', description: 'Interface en mode sombre', category: 'cosmetic', rarity: 'uncommon', price: 30, currency: 'gems', stackable: false, maxStack: 1, icon: '🌙' },
  { id: 'cosmetic_theme_gold', name: 'Thème Doré', description: 'Interface luxueuse dorée', category: 'cosmetic', rarity: 'rare', price: 100, currency: 'gems', stackable: false, maxStack: 1, icon: '✨' },
  { id: 'cosmetic_theme_cyber', name: 'Thème Cyberpunk', description: 'Interface futuriste néon', category: 'cosmetic', rarity: 'epic', price: 200, currency: 'gems', stackable: false, maxStack: 1, icon: '🔮' },
  { id: 'cosmetic_avatar_1', name: 'Avatar Business', description: 'Portrait professionnel', category: 'cosmetic', rarity: 'common', price: 500, currency: 'coins', stackable: false, maxStack: 1, icon: '👔' },
  { id: 'cosmetic_avatar_2', name: 'Avatar Tech CEO', description: 'Style Steve Jobs', category: 'cosmetic', rarity: 'uncommon', price: 40, currency: 'gems', stackable: false, maxStack: 1, icon: '🖥️' },
  { id: 'cosmetic_avatar_3', name: 'Avatar Mogul', description: 'Tycoon classique', category: 'cosmetic', rarity: 'rare', price: 80, currency: 'gems', stackable: false, maxStack: 1, icon: '🎩' },
  { id: 'cosmetic_avatar_4', name: 'Avatar Légende', description: 'Icône du business', category: 'cosmetic', rarity: 'legendary', price: 300, currency: 'gems', stackable: false, maxStack: 1, icon: '👑' },
  { id: 'cosmetic_building_1', name: 'Siège Moderne', description: 'Apparence bâtiment moderne', category: 'cosmetic', rarity: 'uncommon', price: 50, currency: 'gems', stackable: false, maxStack: 1, icon: '🏢' },
  { id: 'cosmetic_building_2', name: 'Tour de Verre', description: 'Gratte-ciel impressionnant', category: 'cosmetic', rarity: 'rare', price: 120, currency: 'gems', stackable: false, maxStack: 1, icon: '🏙️' },
  { id: 'cosmetic_building_3', name: 'Château Corporate', description: 'Siège social château', category: 'cosmetic', rarity: 'epic', price: 250, currency: 'gems', stackable: false, maxStack: 1, icon: '🏰' },
  { id: 'cosmetic_logo_1', name: 'Logo Pack Basic', description: '10 logos d\'entreprise', category: 'cosmetic', rarity: 'common', price: 300, currency: 'coins', stackable: false, maxStack: 1, icon: '🎨' },
  { id: 'cosmetic_logo_2', name: 'Logo Pack Premium', description: '30 logos premium', category: 'cosmetic', rarity: 'uncommon', price: 60, currency: 'gems', stackable: false, maxStack: 1, icon: '🖌️' },
  { id: 'cosmetic_effects_1', name: 'Effets Visuels', description: 'Particules et animations', category: 'cosmetic', rarity: 'rare', price: 100, currency: 'gems', stackable: false, maxStack: 1, icon: '💥' },
  { id: 'cosmetic_nameplate_1', name: 'Plaque Dorée', description: 'Nom d\'entreprise doré', category: 'cosmetic', rarity: 'uncommon', price: 45, currency: 'gems', stackable: false, maxStack: 1, icon: '📛' },
  { id: 'cosmetic_badge_1', name: 'Badge Fondateur', description: 'Badge exclusif fondateur', category: 'cosmetic', rarity: 'legendary', price: 500, currency: 'gems', stackable: false, maxStack: 1, icon: '🏅' },
];

// ==================== PACK ITEMS (Items 86-95) ====================
const packItems: ShopItem[] = [
  { id: 'pack_starter', name: 'Pack Débutant', description: '5000€ + 500 XP + 3 boosts', category: 'pack', rarity: 'common', price: 50, currency: 'gems', effect: { type: 'pack_starter', value: 1 }, stackable: true, maxStack: 1, icon: '📦' },
  { id: 'pack_business', name: 'Pack Business', description: '25000€ + 2500 XP + 5 boosts + 1 upgrade', category: 'pack', rarity: 'uncommon', price: 150, currency: 'gems', effect: { type: 'pack_business', value: 1 }, stackable: true, maxStack: 1, icon: '🎁' },
  { id: 'pack_tycoon', name: 'Pack Tycoon', description: '100000€ + 10000 XP + 10 boosts + 3 upgrades', category: 'pack', rarity: 'rare', price: 400, currency: 'gems', effect: { type: 'pack_tycoon', value: 1 }, stackable: true, maxStack: 1, icon: '💎' },
  { id: 'pack_legendary', name: 'Pack Légendaire', description: '500000€ + 50000 XP + Tout débloqué 7j', category: 'pack', rarity: 'legendary', price: 1000, currency: 'gems', effect: { type: 'pack_legendary', value: 1 }, stackable: true, maxStack: 1, icon: '👑' },
  { id: 'pack_boosts', name: 'Pack Boosts', description: '10 boosts aléatoires', category: 'pack', rarity: 'uncommon', price: 100, currency: 'gems', effect: { type: 'pack_boosts', value: 10 }, stackable: true, maxStack: 5, icon: '⚡' },
  { id: 'pack_resources', name: 'Pack Ressources', description: '5 ressources aléatoires', category: 'pack', rarity: 'uncommon', price: 80, currency: 'gems', effect: { type: 'pack_resources', value: 5 }, stackable: true, maxStack: 5, icon: '🎲' },
  { id: 'pack_skills', name: 'Pack Compétences', description: '+10 points compétence', category: 'pack', rarity: 'rare', price: 180, currency: 'gems', effect: { type: 'skill_points', value: 10 }, stackable: true, maxStack: 3, icon: '📚' },
  { id: 'pack_prestige', name: 'Pack Prestige', description: '+500 points prestige + bonus exclusifs', category: 'pack', rarity: 'epic', price: 350, currency: 'gems', effect: { type: 'pack_prestige', value: 1 }, stackable: true, maxStack: 3, icon: '🏆' },
  { id: 'pack_international', name: 'Pack International', description: 'Débloque 5 marchés + boosts export', category: 'pack', rarity: 'epic', price: 450, currency: 'gems', effect: { type: 'pack_international', value: 1 }, stackable: true, maxStack: 1, icon: '🌍' },
  { id: 'pack_cosmetic', name: 'Pack Cosmétique', description: '5 cosmétiques aléatoires', category: 'pack', rarity: 'rare', price: 200, currency: 'gems', effect: { type: 'pack_cosmetic', value: 5 }, stackable: true, maxStack: 3, icon: '✨' },
];

// ==================== PREMIUM ITEMS (Items 96-100) ====================
const premiumItems: ShopItem[] = [
  { id: 'premium_vip_1', name: 'VIP Bronze', description: 'Avantages VIP pendant 7 jours', category: 'premium', rarity: 'rare', price: 200, currency: 'gems', effect: { type: 'vip_status', value: 1 }, duration: 7, stackable: false, maxStack: 1, icon: '🥉' },
  { id: 'premium_vip_2', name: 'VIP Argent', description: 'Avantages VIP pendant 30 jours', category: 'premium', rarity: 'epic', price: 600, currency: 'gems', effect: { type: 'vip_status', value: 2 }, duration: 30, stackable: false, maxStack: 1, icon: '🥈' },
  { id: 'premium_vip_3', name: 'VIP Or', description: 'Avantages VIP pendant 90 jours', category: 'premium', rarity: 'legendary', price: 1500, currency: 'gems', effect: { type: 'vip_status', value: 3 }, duration: 90, stackable: false, maxStack: 1, icon: '🥇' },
  { id: 'premium_season_pass', name: 'Season Pass', description: 'Débloque récompenses premium de saison', category: 'premium', rarity: 'epic', price: 800, currency: 'gems', effect: { type: 'season_premium', value: 1 }, stackable: false, maxStack: 1, icon: '🎫' },
  { id: 'premium_lifetime', name: 'Pack Lifetime', description: 'Tous les avantages à vie', category: 'premium', rarity: 'legendary', price: 5000, currency: 'gems', effect: { type: 'lifetime_premium', value: 1 }, stackable: false, maxStack: 1, icon: '💫' },
];

// ==================== SEASONAL ITEMS (Items 101-105) ====================
const seasonalItems: ShopItem[] = [
  { id: 'seasonal_winter', name: 'Pack Hiver', description: 'Bonus festifs + cosmétiques hiver', category: 'seasonal', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'seasonal_bonus', value: 1 }, duration: 30, stackable: false, maxStack: 1, icon: '❄️', limitedStock: 100 },
  { id: 'seasonal_spring', name: 'Pack Printemps', description: 'Renouveau + croissance accélérée', category: 'seasonal', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'seasonal_bonus', value: 2 }, duration: 30, stackable: false, maxStack: 1, icon: '🌸', limitedStock: 100 },
  { id: 'seasonal_summer', name: 'Pack Été', description: 'Vacances + bonus moral', category: 'seasonal', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'seasonal_bonus', value: 3 }, duration: 30, stackable: false, maxStack: 1, icon: '☀️', limitedStock: 100 },
  { id: 'seasonal_autumn', name: 'Pack Automne', description: 'Récolte + revenus bonus', category: 'seasonal', rarity: 'rare', price: 150, currency: 'gems', effect: { type: 'seasonal_bonus', value: 4 }, duration: 30, stackable: false, maxStack: 1, icon: '🍂', limitedStock: 100 },
  { id: 'seasonal_anniversary', name: 'Pack Anniversaire', description: 'Célébration exclusive', category: 'seasonal', rarity: 'legendary', price: 300, currency: 'gems', effect: { type: 'anniversary_bonus', value: 1 }, duration: 7, stackable: false, maxStack: 1, icon: '🎂', limitedStock: 50 },
];

// ==================== ALL ITEMS COMBINED ====================
export const ALL_SHOP_ITEMS: ShopItem[] = [
  ...boostItems,
  ...upgradeItems,
  ...resourceItems,
  ...cosmeticItems,
  ...packItems,
  ...premiumItems,
  ...seasonalItems,
];

// ==================== SHOP FUNCTIONS ====================
export function initializeInventory(): PlayerInventory {
  return {
    coins: 5000,
    gems: 50,
    prestigeTokens: 0,
    items: [],
    activeBoosts: [],
  };
}

export function getShopItems(category?: ItemCategory): ShopItem[] {
  if (!category) return ALL_SHOP_ITEMS;
  return ALL_SHOP_ITEMS.filter(item => item.category === category);
}

export function getItemsByRarity(rarity: ItemRarity): ShopItem[] {
  return ALL_SHOP_ITEMS.filter(item => item.rarity === rarity);
}

export function purchaseItem(inventory: PlayerInventory, itemId: string): { success: boolean; inventory: PlayerInventory; message: string } {
  const item = ALL_SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return { success: false, inventory, message: 'Article non trouvé' };
  
  const currencyAmount = item.currency === 'coins' ? inventory.coins : 
    item.currency === 'gems' ? inventory.gems : inventory.prestigeTokens;
  
  if (currencyAmount < item.price) {
    return { success: false, inventory, message: `${item.currency === 'coins' ? 'Pièces' : item.currency === 'gems' ? 'Gemmes' : 'Tokens'} insuffisants` };
  }
  
  const existingItem = inventory.items.find(i => i.itemId === itemId);
  if (existingItem && existingItem.quantity >= item.maxStack) {
    return { success: false, inventory, message: 'Stock maximum atteint' };
  }
  
  const newInventory = { ...inventory };
  if (item.currency === 'coins') newInventory.coins -= item.price;
  else if (item.currency === 'gems') newInventory.gems -= item.price;
  else newInventory.prestigeTokens -= item.price;
  
  if (existingItem) {
    newInventory.items = newInventory.items.map(i => 
      i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
    );
  } else {
    newInventory.items = [...newInventory.items, { itemId, quantity: 1, purchaseDate: Date.now() }];
  }
  
  return { success: true, inventory: newInventory, message: `${item.name} acheté !` };
}

export function useItem(inventory: PlayerInventory, itemId: string): { success: boolean; inventory: PlayerInventory; effect?: ItemEffect; message: string } {
  const item = ALL_SHOP_ITEMS.find(i => i.id === itemId);
  if (!item) return { success: false, inventory, message: 'Article non trouvé' };
  
  const ownedItem = inventory.items.find(i => i.itemId === itemId);
  if (!ownedItem || ownedItem.quantity <= 0) {
    return { success: false, inventory, message: 'Article non possédé' };
  }
  
  const newInventory = { ...inventory };
  newInventory.items = newInventory.items.map(i => 
    i.itemId === itemId ? { ...i, quantity: i.quantity - 1 } : i
  ).filter(i => i.quantity > 0);
  
  if (item.category === 'boost' && item.duration && item.effect) {
    const boost: ActiveBoost = {
      itemId,
      activatedAt: Date.now(),
      expiresAt: Date.now() + item.duration * 24 * 60 * 60 * 1000,
      effect: item.effect,
    };
    newInventory.activeBoosts = [...newInventory.activeBoosts, boost];
  }
  
  return { success: true, inventory: newInventory, effect: item.effect, message: `${item.name} utilisé !` };
}

export function updateActiveBoosts(inventory: PlayerInventory): PlayerInventory {
  const now = Date.now();
  return {
    ...inventory,
    activeBoosts: inventory.activeBoosts.filter(boost => boost.expiresAt > now),
  };
}

export function getActiveEffects(inventory: PlayerInventory): ItemEffect[] {
  return inventory.activeBoosts.map(boost => boost.effect);
}

export function getTotalBonus(inventory: PlayerInventory, effectType: string): number {
  return inventory.activeBoosts
    .filter(boost => boost.effect.type === effectType)
    .reduce((sum, boost) => sum + boost.effect.value, 0);
}

export function addCurrency(inventory: PlayerInventory, currency: CurrencyType, amount: number): PlayerInventory {
  const newInventory = { ...inventory };
  if (currency === 'coins') newInventory.coins += amount;
  else if (currency === 'gems') newInventory.gems += amount;
  else newInventory.prestigeTokens += amount;
  return newInventory;
}

export function getFeaturedItems(): ShopItem[] {
  const featured = ALL_SHOP_ITEMS.filter(item => 
    item.rarity === 'legendary' || item.category === 'seasonal' || item.discountPercent
  );
  return featured.slice(0, 6);
}

export function getDailyDeals(seed: number): ShopItem[] {
  const shuffled = [...ALL_SHOP_ITEMS].sort(() => Math.sin(seed) - 0.5);
  return shuffled.slice(0, 4).map(item => ({
    ...item,
    discountPercent: 20 + Math.floor(Math.random() * 30),
  }));
}
