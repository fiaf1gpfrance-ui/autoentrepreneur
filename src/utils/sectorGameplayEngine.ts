// ===== MOTEUR DE GAMEPLAY PAR SECTEUR =====
// Chaque secteur a des mécaniques totalement différentes

import { BusinessSector, SectorJobProfile, SectorFinancials, SectorRegulations } from '@/types/businessSectors';
import { getSectorById } from '@/data/businessSectors';

// ==================== PROFILS D'EMPLOI PAR SECTEUR ====================

const SECTOR_JOB_PROFILES: Record<BusinessSector, SectorJobProfile[]> = {
  // INDUSTRIE
  automobile: [
    { id: 'ing-meca', title: 'Ingénieur mécanique', category: 'technique', baseSalary: 4500, seniorityMultiplier: 2.0, skillsRequired: ['CAO', 'Mécanique', 'Matériaux'], rarenessIndex: 40, productivityImpact: 1.2 },
    { id: 'chef-ligne', title: 'Chef de ligne production', category: 'production', baseSalary: 3200, seniorityMultiplier: 1.6, skillsRequired: ['Management', 'Lean', 'Qualité'], rarenessIndex: 35, productivityImpact: 1.5 },
    { id: 'operateur', title: 'Opérateur assemblage', category: 'production', baseSalary: 2200, seniorityMultiplier: 1.3, skillsRequired: ['Assemblage', 'Soudure'], rarenessIndex: 20, productivityImpact: 1.0 },
    { id: 'designer-auto', title: 'Designer automobile', category: 'technique', baseSalary: 5500, seniorityMultiplier: 2.2, skillsRequired: ['Design', '3D', 'Ergonomie'], rarenessIndex: 70, productivityImpact: 0.8 },
    { id: 'responsable-qualite', title: 'Responsable qualité', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.8, skillsRequired: ['ISO', 'Audit', 'Métrologie'], rarenessIndex: 45, productivityImpact: 1.3 },
  ],
  aeronautique: [
    { id: 'ing-aero', title: 'Ingénieur aéronautique', category: 'technique', baseSalary: 5500, seniorityMultiplier: 2.2, skillsRequired: ['Aérodynamique', 'Structures', 'Propulsion'], rarenessIndex: 65, productivityImpact: 1.3 },
    { id: 'ing-systemes', title: 'Ingénieur systèmes embarqués', category: 'technique', baseSalary: 5200, seniorityMultiplier: 2.0, skillsRequired: ['Avionique', 'Temps réel', 'DO-178'], rarenessIndex: 70, productivityImpact: 1.2 },
    { id: 'technicien-composite', title: 'Technicien composite', category: 'production', baseSalary: 2800, seniorityMultiplier: 1.5, skillsRequired: ['Composites', 'Stratification'], rarenessIndex: 50, productivityImpact: 1.1 },
    { id: 'pilote-essai', title: 'Pilote d\'essai', category: 'technique', baseSalary: 12000, seniorityMultiplier: 1.5, skillsRequired: ['Pilotage', 'Ingénierie vol'], rarenessIndex: 95, productivityImpact: 0.5 },
  ],
  siderurgie: [
    { id: 'ing-metallurgie', title: 'Ingénieur métallurgiste', category: 'technique', baseSalary: 4200, seniorityMultiplier: 1.8, skillsRequired: ['Métallurgie', 'Thermique', 'Procédés'], rarenessIndex: 55, productivityImpact: 1.2 },
    { id: 'fondeur', title: 'Opérateur fonderie', category: 'production', baseSalary: 2600, seniorityMultiplier: 1.4, skillsRequired: ['Fonderie', 'Sécurité haute temp'], rarenessIndex: 40, productivityImpact: 1.0 },
    { id: 'lamineur', title: 'Lamineur', category: 'production', baseSalary: 2400, seniorityMultiplier: 1.4, skillsRequired: ['Laminage', 'Contrôle'], rarenessIndex: 35, productivityImpact: 1.0 },
  ],
  chimie: [
    { id: 'ing-procedes', title: 'Ingénieur procédés', category: 'technique', baseSalary: 4800, seniorityMultiplier: 2.0, skillsRequired: ['Génie chimique', 'Simulation', 'Scale-up'], rarenessIndex: 50, productivityImpact: 1.3 },
    { id: 'chimiste-rd', title: 'Chimiste R&D', category: 'technique', baseSalary: 4200, seniorityMultiplier: 2.2, skillsRequired: ['Chimie organique', 'Analyse', 'Synthèse'], rarenessIndex: 45, productivityImpact: 1.1 },
    { id: 'operateur-chimie', title: 'Opérateur de production', category: 'production', baseSalary: 2500, seniorityMultiplier: 1.4, skillsRequired: ['Process', 'Sécurité SEVESO'], rarenessIndex: 30, productivityImpact: 1.0 },
    { id: 'hse', title: 'Responsable HSE', category: 'support', baseSalary: 4500, seniorityMultiplier: 1.8, skillsRequired: ['HSE', 'Réglementation', 'Audit'], rarenessIndex: 40, productivityImpact: 0.5 },
  ],
  energie: [
    { id: 'ing-energie', title: 'Ingénieur énergie', category: 'technique', baseSalary: 5000, seniorityMultiplier: 2.0, skillsRequired: ['Réseaux électriques', 'ENR', 'Stockage'], rarenessIndex: 55, productivityImpact: 1.2 },
    { id: 'technicien-reseau', title: 'Technicien réseau', category: 'production', baseSalary: 2800, seniorityMultiplier: 1.5, skillsRequired: ['HT/BT', 'Maintenance', 'Sécurité'], rarenessIndex: 40, productivityImpact: 1.0 },
    { id: 'trader-energie', title: 'Trader énergie', category: 'commercial', baseSalary: 8000, seniorityMultiplier: 2.5, skillsRequired: ['Trading', 'Marchés', 'Analyse'], rarenessIndex: 75, productivityImpact: 0.8 },
  ],
  construction: [
    { id: 'chef-chantier', title: 'Chef de chantier', category: 'production', baseSalary: 3500, seniorityMultiplier: 1.7, skillsRequired: ['BTP', 'Planning', 'Sécurité'], rarenessIndex: 35, productivityImpact: 1.5 },
    { id: 'conducteur-travaux', title: 'Conducteur de travaux', category: 'management', baseSalary: 4200, seniorityMultiplier: 1.9, skillsRequired: ['Gestion projet', 'Budget', 'Technique'], rarenessIndex: 40, productivityImpact: 1.3 },
    { id: 'macon', title: 'Maçon', category: 'production', baseSalary: 2200, seniorityMultiplier: 1.4, skillsRequired: ['Maçonnerie', 'Lecture plans'], rarenessIndex: 25, productivityImpact: 1.0 },
    { id: 'architecte', title: 'Architecte', category: 'technique', baseSalary: 4500, seniorityMultiplier: 2.0, skillsRequired: ['Architecture', 'CAO', 'Réglementation'], rarenessIndex: 50, productivityImpact: 0.7 },
  ],
  
  // TECH
  software: [
    { id: 'dev-senior', title: 'Développeur Senior', category: 'technique', baseSalary: 5500, seniorityMultiplier: 1.8, skillsRequired: ['Programmation', 'Architecture', 'DevOps'], rarenessIndex: 35, productivityImpact: 1.5 },
    { id: 'dev-junior', title: 'Développeur Junior', category: 'technique', baseSalary: 3200, seniorityMultiplier: 1.5, skillsRequired: ['Programmation', 'Git'], rarenessIndex: 20, productivityImpact: 0.8 },
    { id: 'product-manager', title: 'Product Manager', category: 'management', baseSalary: 5000, seniorityMultiplier: 2.0, skillsRequired: ['Product', 'Agile', 'UX'], rarenessIndex: 45, productivityImpact: 1.2 },
    { id: 'ux-designer', title: 'UX Designer', category: 'technique', baseSalary: 4200, seniorityMultiplier: 1.7, skillsRequired: ['UX', 'UI', 'Figma'], rarenessIndex: 40, productivityImpact: 0.9 },
    { id: 'devops', title: 'DevOps Engineer', category: 'technique', baseSalary: 5200, seniorityMultiplier: 1.8, skillsRequired: ['CI/CD', 'Cloud', 'Kubernetes'], rarenessIndex: 50, productivityImpact: 1.3 },
  ],
  intelligence_artificielle: [
    { id: 'ml-engineer', title: 'ML Engineer', category: 'technique', baseSalary: 7000, seniorityMultiplier: 2.0, skillsRequired: ['ML', 'Python', 'TensorFlow'], rarenessIndex: 65, productivityImpact: 1.4 },
    { id: 'data-scientist', title: 'Data Scientist', category: 'technique', baseSalary: 6000, seniorityMultiplier: 1.9, skillsRequired: ['Stats', 'ML', 'Python'], rarenessIndex: 55, productivityImpact: 1.3 },
    { id: 'research-scientist', title: 'Research Scientist', category: 'technique', baseSalary: 9000, seniorityMultiplier: 2.2, skillsRequired: ['PhD', 'Publications', 'Deep Learning'], rarenessIndex: 85, productivityImpact: 1.2 },
    { id: 'mlops', title: 'MLOps Engineer', category: 'technique', baseSalary: 6500, seniorityMultiplier: 1.8, skillsRequired: ['MLOps', 'Infra', 'Monitoring'], rarenessIndex: 70, productivityImpact: 1.1 },
  ],
  cloud_computing: [
    { id: 'cloud-architect', title: 'Cloud Architect', category: 'technique', baseSalary: 8000, seniorityMultiplier: 2.0, skillsRequired: ['AWS/Azure/GCP', 'Architecture', 'Sécurité'], rarenessIndex: 60, productivityImpact: 1.4 },
    { id: 'sre', title: 'Site Reliability Engineer', category: 'technique', baseSalary: 6500, seniorityMultiplier: 1.9, skillsRequired: ['SRE', 'Monitoring', 'Automation'], rarenessIndex: 55, productivityImpact: 1.3 },
    { id: 'network-engineer', title: 'Network Engineer', category: 'technique', baseSalary: 5000, seniorityMultiplier: 1.7, skillsRequired: ['Réseaux', 'Cisco', 'SDN'], rarenessIndex: 45, productivityImpact: 1.1 },
  ],
  cybersecurite: [
    { id: 'pentester', title: 'Pentester', category: 'technique', baseSalary: 5500, seniorityMultiplier: 1.9, skillsRequired: ['Pentest', 'Hacking éthique', 'Outils sécu'], rarenessIndex: 60, productivityImpact: 1.2 },
    { id: 'analyste-soc', title: 'Analyste SOC', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.6, skillsRequired: ['SIEM', 'Threat Intel', 'Incident Response'], rarenessIndex: 45, productivityImpact: 1.0 },
    { id: 'rssi', title: 'RSSI', category: 'management', baseSalary: 9000, seniorityMultiplier: 2.0, skillsRequired: ['Gouvernance', 'Risk', 'Conformité'], rarenessIndex: 70, productivityImpact: 0.8 },
  ],
  fintech: [
    { id: 'quant', title: 'Quant Developer', category: 'technique', baseSalary: 9000, seniorityMultiplier: 2.3, skillsRequired: ['Maths', 'Finance', 'Python/C++'], rarenessIndex: 80, productivityImpact: 1.3 },
    { id: 'compliance-officer', title: 'Compliance Officer', category: 'support', baseSalary: 5500, seniorityMultiplier: 1.8, skillsRequired: ['AML', 'KYC', 'Réglementation'], rarenessIndex: 50, productivityImpact: 0.6 },
    { id: 'product-fintech', title: 'Product Manager Fintech', category: 'management', baseSalary: 6000, seniorityMultiplier: 2.0, skillsRequired: ['Fintech', 'Product', 'Réglementation'], rarenessIndex: 55, productivityImpact: 1.1 },
  ],
  gaming: [
    { id: 'game-designer', title: 'Game Designer', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.8, skillsRequired: ['Game Design', 'UX', 'Narration'], rarenessIndex: 50, productivityImpact: 1.3 },
    { id: 'dev-gameplay', title: 'Gameplay Programmer', category: 'technique', baseSalary: 4500, seniorityMultiplier: 1.7, skillsRequired: ['C++', 'Unreal/Unity', 'Gameplay'], rarenessIndex: 45, productivityImpact: 1.2 },
    { id: 'artiste-3d', title: 'Artiste 3D', category: 'technique', baseSalary: 3800, seniorityMultiplier: 1.6, skillsRequired: ['3D', 'Maya/Blender', 'Texturing'], rarenessIndex: 40, productivityImpact: 1.0 },
    { id: 'qa-gaming', title: 'QA Tester', category: 'technique', baseSalary: 2500, seniorityMultiplier: 1.3, skillsRequired: ['Testing', 'Bugs', 'Documentation'], rarenessIndex: 20, productivityImpact: 0.8 },
  ],
  biotech: [
    { id: 'chercheur-biotech', title: 'Chercheur principal', category: 'technique', baseSalary: 7500, seniorityMultiplier: 2.2, skillsRequired: ['PhD', 'Biologie mol.', 'Publications'], rarenessIndex: 75, productivityImpact: 1.2 },
    { id: 'technicien-labo', title: 'Technicien laboratoire', category: 'production', baseSalary: 2800, seniorityMultiplier: 1.4, skillsRequired: ['Techniques labo', 'BPL'], rarenessIndex: 30, productivityImpact: 1.0 },
    { id: 'regulatory-affairs', title: 'Responsable affaires réglementaires', category: 'support', baseSalary: 6000, seniorityMultiplier: 1.9, skillsRequired: ['FDA', 'EMA', 'Dossiers CTD'], rarenessIndex: 60, productivityImpact: 0.5 },
  ],
  
  // SERVICES
  conseil: [
    { id: 'consultant-junior', title: 'Consultant Junior', category: 'technique', baseSalary: 3500, seniorityMultiplier: 1.5, skillsRequired: ['Analyse', 'PowerPoint', 'Excel'], rarenessIndex: 20, productivityImpact: 0.8 },
    { id: 'consultant-senior', title: 'Consultant Senior', category: 'technique', baseSalary: 5000, seniorityMultiplier: 1.8, skillsRequired: ['Stratégie', 'Client', 'Expertise'], rarenessIndex: 35, productivityImpact: 1.2 },
    { id: 'manager', title: 'Manager', category: 'management', baseSalary: 7000, seniorityMultiplier: 2.0, skillsRequired: ['Leadership', 'Vente', 'Delivery'], rarenessIndex: 50, productivityImpact: 1.5 },
    { id: 'partner', title: 'Partner', category: 'management', baseSalary: 15000, seniorityMultiplier: 2.5, skillsRequired: ['Business Dev', 'Réseau', 'Expertise'], rarenessIndex: 85, productivityImpact: 2.0 },
  ],
  banque: [
    { id: 'conseiller-clientele', title: 'Conseiller clientèle', category: 'commercial', baseSalary: 2800, seniorityMultiplier: 1.4, skillsRequired: ['Commercial', 'Produits bancaires'], rarenessIndex: 20, productivityImpact: 1.0 },
    { id: 'analyste-credit', title: 'Analyste crédit', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.7, skillsRequired: ['Analyse financière', 'Risque'], rarenessIndex: 40, productivityImpact: 1.1 },
    { id: 'trader', title: 'Trader', category: 'technique', baseSalary: 10000, seniorityMultiplier: 3.0, skillsRequired: ['Trading', 'Marchés', 'Stress'], rarenessIndex: 75, productivityImpact: 1.5 },
    { id: 'risk-manager', title: 'Risk Manager', category: 'technique', baseSalary: 7000, seniorityMultiplier: 2.0, skillsRequired: ['Risk', 'Modélisation', 'Bâle III'], rarenessIndex: 60, productivityImpact: 0.7 },
  ],
  assurance: [
    { id: 'actuaire', title: 'Actuaire', category: 'technique', baseSalary: 6000, seniorityMultiplier: 2.0, skillsRequired: ['Actuariat', 'Stats', 'Modélisation'], rarenessIndex: 70, productivityImpact: 1.3 },
    { id: 'souscripteur', title: 'Souscripteur', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.7, skillsRequired: ['Souscription', 'Risque', 'Négociation'], rarenessIndex: 45, productivityImpact: 1.2 },
    { id: 'gestionnaire-sinistres', title: 'Gestionnaire sinistres', category: 'support', baseSalary: 2800, seniorityMultiplier: 1.4, skillsRequired: ['Sinistres', 'Client', 'Expertise'], rarenessIndex: 25, productivityImpact: 1.0 },
  ],
  immobilier: [
    { id: 'agent-immo', title: 'Agent immobilier', category: 'commercial', baseSalary: 2500, seniorityMultiplier: 2.5, skillsRequired: ['Commercial', 'Négociation', 'Réseau'], rarenessIndex: 20, productivityImpact: 1.2 },
    { id: 'promoteur', title: 'Directeur de programme', category: 'management', baseSalary: 6000, seniorityMultiplier: 2.0, skillsRequired: ['Promotion', 'Finance', 'Urbanisme'], rarenessIndex: 55, productivityImpact: 1.5 },
    { id: 'gestionnaire-patrimoine', title: 'Gestionnaire de patrimoine', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.8, skillsRequired: ['Gestion locative', 'Comptabilité'], rarenessIndex: 35, productivityImpact: 1.0 },
  ],
  juridique: [
    { id: 'avocat-junior', title: 'Avocat Junior', category: 'technique', baseSalary: 4000, seniorityMultiplier: 1.6, skillsRequired: ['Droit', 'Plaidoirie', 'Rédaction'], rarenessIndex: 30, productivityImpact: 0.9 },
    { id: 'avocat-senior', title: 'Avocat Senior', category: 'technique', baseSalary: 8000, seniorityMultiplier: 2.5, skillsRequired: ['Expertise', 'Clientèle', 'Stratégie'], rarenessIndex: 50, productivityImpact: 1.3 },
    { id: 'associe', title: 'Associé', category: 'management', baseSalary: 20000, seniorityMultiplier: 3.0, skillsRequired: ['Business Dev', 'Expertise', 'Management'], rarenessIndex: 80, productivityImpact: 1.8 },
    { id: 'paralegal', title: 'Paralegal', category: 'support', baseSalary: 2800, seniorityMultiplier: 1.4, skillsRequired: ['Recherche', 'Documentation', 'Organisation'], rarenessIndex: 25, productivityImpact: 0.7 },
  ],
  sante: [
    { id: 'medecin', title: 'Médecin', category: 'technique', baseSalary: 8000, seniorityMultiplier: 2.0, skillsRequired: ['Médecine', 'Diagnostic', 'Patient'], rarenessIndex: 70, productivityImpact: 1.5 },
    { id: 'infirmier', title: 'Infirmier', category: 'production', baseSalary: 2800, seniorityMultiplier: 1.4, skillsRequired: ['Soins', 'Empathie', 'Organisation'], rarenessIndex: 35, productivityImpact: 1.0 },
    { id: 'directeur-clinique', title: 'Directeur de clinique', category: 'management', baseSalary: 10000, seniorityMultiplier: 1.8, skillsRequired: ['Management', 'Santé', 'Gestion'], rarenessIndex: 60, productivityImpact: 1.3 },
  ],
  transport: [
    { id: 'chauffeur', title: 'Chauffeur routier', category: 'production', baseSalary: 2200, seniorityMultiplier: 1.3, skillsRequired: ['Permis', 'Conduite', 'Logistique'], rarenessIndex: 25, productivityImpact: 1.0 },
    { id: 'responsable-flotte', title: 'Responsable flotte', category: 'management', baseSalary: 4000, seniorityMultiplier: 1.7, skillsRequired: ['Gestion flotte', 'Maintenance', 'Optimisation'], rarenessIndex: 40, productivityImpact: 1.2 },
    { id: 'logisticien', title: 'Logisticien', category: 'technique', baseSalary: 3500, seniorityMultiplier: 1.6, skillsRequired: ['Supply chain', 'WMS', 'Optimisation'], rarenessIndex: 35, productivityImpact: 1.1 },
  ],
  
  // COMMERCE
  grande_distribution: [
    { id: 'chef-rayon', title: 'Chef de rayon', category: 'management', baseSalary: 2800, seniorityMultiplier: 1.5, skillsRequired: ['Commerce', 'Gestion stock', 'Management'], rarenessIndex: 25, productivityImpact: 1.2 },
    { id: 'directeur-magasin', title: 'Directeur de magasin', category: 'management', baseSalary: 5000, seniorityMultiplier: 1.8, skillsRequired: ['Management', 'P&L', 'Commercial'], rarenessIndex: 40, productivityImpact: 1.5 },
    { id: 'acheteur', title: 'Acheteur', category: 'commercial', baseSalary: 4000, seniorityMultiplier: 1.7, skillsRequired: ['Négociation', 'Sourcing', 'Analyse'], rarenessIndex: 45, productivityImpact: 1.3 },
  ],
  ecommerce: [
    { id: 'growth-manager', title: 'Growth Manager', category: 'commercial', baseSalary: 5000, seniorityMultiplier: 1.9, skillsRequired: ['Growth', 'Data', 'Marketing'], rarenessIndex: 50, productivityImpact: 1.4 },
    { id: 'traffic-manager', title: 'Traffic Manager', category: 'commercial', baseSalary: 3500, seniorityMultiplier: 1.6, skillsRequired: ['SEO', 'SEA', 'Analytics'], rarenessIndex: 35, productivityImpact: 1.2 },
    { id: 'responsable-logistique', title: 'Responsable logistique e-commerce', category: 'production', baseSalary: 4000, seniorityMultiplier: 1.7, skillsRequired: ['Logistique', 'Fulfilment', 'Retours'], rarenessIndex: 40, productivityImpact: 1.3 },
  ],
  luxe: [
    { id: 'artisan', title: 'Artisan d\'art', category: 'production', baseSalary: 3500, seniorityMultiplier: 2.0, skillsRequired: ['Artisanat', 'Savoir-faire', 'Excellence'], rarenessIndex: 70, productivityImpact: 1.2 },
    { id: 'vendeur-luxe', title: 'Conseiller de vente luxe', category: 'commercial', baseSalary: 3000, seniorityMultiplier: 1.8, skillsRequired: ['Vente', 'Clienteling', 'Langues'], rarenessIndex: 35, productivityImpact: 1.1 },
    { id: 'directeur-boutique', title: 'Directeur de boutique', category: 'management', baseSalary: 6000, seniorityMultiplier: 2.0, skillsRequired: ['Management', 'Luxe', 'VIP'], rarenessIndex: 55, productivityImpact: 1.4 },
  ],
  restauration: [
    { id: 'chef-cuisine', title: 'Chef de cuisine', category: 'production', baseSalary: 3500, seniorityMultiplier: 2.0, skillsRequired: ['Cuisine', 'Créativité', 'Gestion'], rarenessIndex: 45, productivityImpact: 1.5 },
    { id: 'serveur', title: 'Serveur', category: 'production', baseSalary: 1900, seniorityMultiplier: 1.2, skillsRequired: ['Service', 'Rapidité', 'Sourire'], rarenessIndex: 15, productivityImpact: 0.9 },
    { id: 'gerant-restaurant', title: 'Gérant de restaurant', category: 'management', baseSalary: 3500, seniorityMultiplier: 1.7, skillsRequired: ['Gestion', 'RH', 'Hygiène'], rarenessIndex: 35, productivityImpact: 1.3 },
  ],
  mode: [
    { id: 'styliste', title: 'Styliste', category: 'technique', baseSalary: 4000, seniorityMultiplier: 2.2, skillsRequired: ['Design', 'Tendances', 'Créativité'], rarenessIndex: 55, productivityImpact: 1.2 },
    { id: 'modelist', title: 'Modéliste', category: 'production', baseSalary: 3000, seniorityMultiplier: 1.6, skillsRequired: ['Patronage', 'Couture', 'CAO'], rarenessIndex: 45, productivityImpact: 1.0 },
    { id: 'directeur-collection', title: 'Directeur de collection', category: 'management', baseSalary: 7000, seniorityMultiplier: 2.0, skillsRequired: ['Vision', 'Management', 'Commercial'], rarenessIndex: 65, productivityImpact: 1.4 },
  ],
  medias: [
    { id: 'journaliste', title: 'Journaliste', category: 'technique', baseSalary: 3000, seniorityMultiplier: 1.6, skillsRequired: ['Rédaction', 'Investigation', 'Actualité'], rarenessIndex: 30, productivityImpact: 1.0 },
    { id: 'producteur', title: 'Producteur', category: 'management', baseSalary: 6000, seniorityMultiplier: 2.2, skillsRequired: ['Production', 'Budget', 'Créatif'], rarenessIndex: 55, productivityImpact: 1.3 },
    { id: 'community-manager', title: 'Community Manager', category: 'commercial', baseSalary: 2800, seniorityMultiplier: 1.4, skillsRequired: ['Réseaux sociaux', 'Contenu', 'Engagement'], rarenessIndex: 25, productivityImpact: 1.0 },
  ],
};

// ==================== FINANCES PAR SECTEUR ====================

const SECTOR_FINANCIALS: Partial<Record<BusinessSector, SectorFinancials>> = {
  software: {
    typicalMargins: {
      gross: { min: 70, max: 95, average: 85 },
      operating: { min: 15, max: 40, average: 25 },
      net: { min: 10, max: 35, average: 20 }
    },
    costStructure: {
      rawMaterials: 0,
      labor: 60,
      rd: 20,
      marketing: 15,
      overhead: 3,
      depreciation: 2
    },
    capitalIntensity: 'low',
    breakEvenTimeline: '18-36 mois',
    typicalValuationMultiples: {
      revenueMultiple: { min: 5, max: 20 },
      ebitdaMultiple: { min: 15, max: 50 }
    },
    fundingSources: [
      { type: 'venture_capital', availability: 90, typicalAmount: { min: 500000, max: 50000000 }, equityDilution: 20, requirements: ['Croissance >50%/an', 'Marché adressable >$1B'] },
      { type: 'bank_loan', availability: 40, typicalAmount: { min: 50000, max: 500000 }, interestRate: 5, requirements: ['12+ mois d\'historique', 'Rentabilité'] }
    ],
    economicCycleSensitivity: 'defensive'
  },
  automobile: {
    typicalMargins: {
      gross: { min: 15, max: 25, average: 20 },
      operating: { min: 3, max: 10, average: 6 },
      net: { min: 2, max: 7, average: 4 }
    },
    costStructure: {
      rawMaterials: 55,
      labor: 15,
      rd: 5,
      marketing: 10,
      overhead: 8,
      depreciation: 7
    },
    capitalIntensity: 'very_high',
    breakEvenTimeline: '5-10 ans',
    typicalValuationMultiples: {
      revenueMultiple: { min: 0.3, max: 1.5 },
      ebitdaMultiple: { min: 4, max: 10 }
    },
    fundingSources: [
      { type: 'bank_loan', availability: 80, typicalAmount: { min: 10000000, max: 500000000 }, interestRate: 4, requirements: ['Actifs immobiliers', 'Garanties'] },
      { type: 'bonds', availability: 70, typicalAmount: { min: 50000000, max: 2000000000 }, interestRate: 5, requirements: ['Notation investment grade'] }
    ],
    economicCycleSensitivity: 'highly_cyclical'
  },
  luxe: {
    typicalMargins: {
      gross: { min: 60, max: 80, average: 70 },
      operating: { min: 20, max: 35, average: 27 },
      net: { min: 15, max: 25, average: 20 }
    },
    costStructure: {
      rawMaterials: 20,
      labor: 25,
      rd: 5,
      marketing: 20,
      overhead: 15,
      depreciation: 5
    },
    capitalIntensity: 'medium',
    breakEvenTimeline: '3-5 ans',
    typicalValuationMultiples: {
      revenueMultiple: { min: 3, max: 8 },
      ebitdaMultiple: { min: 15, max: 30 }
    },
    fundingSources: [
      { type: 'private_equity', availability: 60, typicalAmount: { min: 20000000, max: 500000000 }, equityDilution: 30, requirements: ['Marque établie', 'Rentabilité'] }
    ],
    economicCycleSensitivity: 'cyclical'
  },
  restauration: {
    typicalMargins: {
      gross: { min: 55, max: 70, average: 62 },
      operating: { min: 3, max: 15, average: 8 },
      net: { min: 2, max: 10, average: 5 }
    },
    costStructure: {
      rawMaterials: 30,
      labor: 35,
      rd: 0,
      marketing: 5,
      overhead: 25,
      depreciation: 5
    },
    capitalIntensity: 'medium',
    breakEvenTimeline: '12-24 mois',
    typicalValuationMultiples: {
      revenueMultiple: { min: 0.3, max: 1 },
      ebitdaMultiple: { min: 3, max: 8 }
    },
    fundingSources: [
      { type: 'bank_loan', availability: 60, typicalAmount: { min: 30000, max: 500000 }, interestRate: 6, requirements: ['Apport personnel 30%', 'Business plan'] },
      { type: 'crowdfunding', availability: 40, typicalAmount: { min: 10000, max: 100000 }, requirements: ['Concept original', 'Communauté'] }
    ],
    economicCycleSensitivity: 'cyclical'
  }
};

// ==================== RÉGLEMENTATIONS PAR SECTEUR ====================

const SECTOR_REGULATIONS: Partial<Record<BusinessSector, Partial<SectorRegulations>>> = {
  banque: {
    licenses: [
      { id: 'agrement-bancaire', name: 'Agrément établissement de crédit', description: 'Autorisation ACPR obligatoire', cost: 500000, renewalCost: 50000, renewalPeriodMonths: 12, processingTimeMonths: 18, requirements: ['Capital minimum 5M€', 'Dirigeants agréés', 'Plan d\'activité'], penalty: 10000000, isMandatory: true }
    ],
    entryBarriers: [
      { type: 'capital', level: 'extreme', description: 'Capital minimum réglementaire', minimumRequirement: 5000000 },
      { type: 'regulatory', level: 'extreme', description: 'Agrément ACPR/BCE', minimumRequirement: '18-24 mois de procédure' }
    ]
  },
  chimie: {
    environmentalNorms: [
      { id: 'seveso', name: 'Directive Seveso III', description: 'Sites à risques majeurs', complianceCost: 2000000, annualCost: 200000, penalty: 5000000, reputationImpact: -30 },
      { id: 'reach', name: 'Règlement REACH', description: 'Enregistrement substances chimiques', complianceCost: 500000, annualCost: 100000, penalty: 1000000, reputationImpact: -15 }
    ],
    qualityStandards: [
      { id: 'iso-14001', name: 'ISO 14001', description: 'Management environnemental', certificationBody: 'Bureau Veritas', implementationCost: 50000, auditCost: 10000, auditFrequencyMonths: 12, requirements: ['SME en place'], marketAccessRequired: false }
    ]
  },
  biotech: {
    licenses: [
      { id: 'autorisation-essais', name: 'Autorisation essais cliniques', description: 'ANSM + Comité éthique', cost: 100000, renewalCost: 0, renewalPeriodMonths: 0, processingTimeMonths: 6, requirements: ['Dossier préclinique complet', 'Assurance'], penalty: 0, isMandatory: true }
    ],
    qualityStandards: [
      { id: 'bpf', name: 'Bonnes Pratiques de Fabrication', description: 'GMP pour production pharma', certificationBody: 'ANSM', implementationCost: 1000000, auditCost: 50000, auditFrequencyMonths: 24, requirements: ['Locaux conformes', 'Personnel qualifié', 'Validation procédés'], marketAccessRequired: true }
    ]
  }
};

// ==================== FONCTIONS D'ACCÈS ====================

export const getJobProfilesForSector = (sectorId: BusinessSector): SectorJobProfile[] => {
  return SECTOR_JOB_PROFILES[sectorId] || [];
};

export const getFinancialsForSector = (sectorId: BusinessSector): SectorFinancials | undefined => {
  return SECTOR_FINANCIALS[sectorId];
};

export const getRegulationsForSector = (sectorId: BusinessSector): Partial<SectorRegulations> | undefined => {
  return SECTOR_REGULATIONS[sectorId];
};

// Calcule les modificateurs de gameplay en fonction du secteur et de la ville
export const calculateSectorCityModifiers = (
  sectorId: BusinessSector,
  cityEconomics: { gdpPerCapita: number; costOfLivingIndex: number }
) => {
  const sector = getSectorById(sectorId);
  if (!sector) return { production: 1, revenue: 1, costs: 1, talent: 1 };

  const baseCostFactor = cityEconomics.costOfLivingIndex / 100;
  const baseDevelopmentFactor = cityEconomics.gdpPerCapita / 50000;

  // Modificateurs selon la catégorie de secteur
  const categoryModifiers: Record<string, { production: number; revenue: number; costs: number; talent: number }> = {
    industrie: { production: 1.2 - baseCostFactor * 0.3, revenue: 0.9 + baseDevelopmentFactor * 0.2, costs: 0.8 + baseCostFactor * 0.4, talent: 0.7 + baseDevelopmentFactor * 0.2 },
    tech: { production: 1.0, revenue: 1.0 + baseDevelopmentFactor * 0.3, costs: 0.6 + baseCostFactor * 0.6, talent: 0.5 + baseDevelopmentFactor * 0.5 },
    services: { production: 1.0, revenue: 0.8 + baseDevelopmentFactor * 0.4, costs: 0.7 + baseCostFactor * 0.5, talent: 0.6 + baseDevelopmentFactor * 0.4 },
    commerce: { production: 1.1 - baseCostFactor * 0.2, revenue: 0.7 + baseDevelopmentFactor * 0.5, costs: 0.7 + baseCostFactor * 0.5, talent: 0.8 + baseDevelopmentFactor * 0.2 }
  };

  return categoryModifiers[sector.category] || { production: 1, revenue: 1, costs: 1, talent: 1 };
};

// Génère des événements aléatoires selon le secteur
export const generateSectorEvent = (sectorId: BusinessSector): { name: string; description: string; impact: Record<string, number> } | null => {
  const events: Record<string, Array<{ name: string; description: string; impact: Record<string, number> }>> = {
    automobile: [
      { name: 'Rappel massif', description: 'Un défaut de fabrication nécessite un rappel de véhicules', impact: { revenue: -15, reputation: -20, costs: 30 } },
      { name: 'Nouvelle norme Euro', description: 'Nouvelle réglementation émissions plus stricte', impact: { costs: 10, rd: 20 } },
    ],
    software: [
      { name: 'Faille de sécurité', description: 'Une vulnérabilité critique découverte', impact: { reputation: -15, costs: 10 } },
      { name: 'Adoption virale', description: 'Votre produit devient viral sur les réseaux', impact: { revenue: 50, users: 100 } },
    ],
    restauration: [
      { name: 'Inspection sanitaire', description: 'Contrôle hygiène inopiné', impact: { reputation: -5, costs: 2 } },
      { name: 'Étoile Michelin', description: 'Distinction gastronomique prestigieuse', impact: { revenue: 40, reputation: 30 } },
    ]
  };

  const sectorEvents = events[sectorId];
  if (!sectorEvents || sectorEvents.length === 0) return null;

  return sectorEvents[Math.floor(Math.random() * sectorEvents.length)];
};
