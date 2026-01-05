// Moteur de recherche de villes avec API Nominatim (OpenStreetMap)

import { ExtendedCityData } from '@/types/ultraRealism';
import { extendedWorldCities } from '@/data/extendedWorldCities';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country?: string;
    country_code?: string;
    state?: string;
  };
}

// Cache pour éviter les requêtes répétitives
const searchCache = new Map<string, ExtendedCityData[]>();

// Génère des données économiques estimées pour une ville non référencée
const generateEstimatedEconomics = (
  country: string,
  countryCode: string,
  importance: number
): ExtendedCityData['economics'] => {
  // Facteurs de base par région
  const regionFactors: Record<string, number> = {
    'US': 1.5, 'CA': 1.3, 'GB': 1.4, 'DE': 1.3, 'FR': 1.2, 'JP': 1.4,
    'CN': 0.8, 'IN': 0.4, 'BR': 0.5, 'MX': 0.6, 'AU': 1.3, 'SG': 1.6,
    'CH': 1.8, 'AE': 1.4, 'KR': 1.2, 'NL': 1.3, 'SE': 1.4, 'NO': 1.5
  };
  
  const factor = regionFactors[countryCode.toUpperCase()] || 0.5;
  const importanceFactor = 0.5 + importance;
  
  return {
    gdpPerCapita: Math.round(30000 * factor * importanceFactor),
    gdpGrowth: 1.5 + Math.random() * 3,
    unemploymentRate: 3 + Math.random() * 10,
    inflationRate: 1.5 + Math.random() * 5,
    costOfLivingIndex: Math.round(80 * factor * importanceFactor),
    averageSalary: Math.round(2500 * factor * importanceFactor),
    minimumWage: Math.round(800 * factor),
    corporateTaxRate: 15 + Math.random() * 20,
    incomeTaxRate: 20 + Math.random() * 30,
    vatRate: 5 + Math.random() * 20,
    corruptionIndex: 20 + Math.random() * 50,
    easeOfBusinessIndex: Math.round(10 + Math.random() * 100),
    economicFreedomIndex: 50 + Math.random() * 40
  };
};

// Génère des scores de secteurs estimés
const generateEstimatedSectors = (importance: number): ExtendedCityData['sectors'] => {
  const baseScore = 30 + importance * 50;
  const variance = () => Math.max(10, Math.min(100, baseScore + (Math.random() - 0.5) * 40));
  
  return {
    technology: Math.round(variance()),
    finance: Math.round(variance()),
    manufacturing: Math.round(variance()),
    healthcare: Math.round(variance()),
    energy: Math.round(variance()),
    tourism: Math.round(variance()),
    agriculture: Math.round(variance()),
    logistics: Math.round(variance()),
    retail: Math.round(variance()),
    realEstate: Math.round(variance())
  };
};

// Génère des données d'infrastructure estimées
const generateEstimatedInfrastructure = (importance: number): ExtendedCityData['infrastructure'] => {
  const baseScore = 40 + importance * 50;
  
  return {
    internetSpeedMbps: Math.round(30 + importance * 150),
    airportConnectivity: Math.round(Math.min(100, baseScore + Math.random() * 30)),
    portAccess: Math.random() > 0.6,
    railNetwork: Math.round(Math.min(100, baseScore + Math.random() * 30)),
    roadQuality: Math.round(Math.min(100, baseScore + Math.random() * 30)),
    powerReliability: Math.round(Math.min(100, baseScore + Math.random() * 20 + 20))
  };
};

// Génère des données de main d'œuvre estimées
const generateEstimatedWorkforce = (countryCode: string, importance: number): ExtendedCityData['workforce'] => {
  const developedCountries = ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'NZ', 'CH', 'SE', 'NO', 'DK', 'FI', 'NL', 'BE', 'AT', 'SG', 'KR'];
  const isDeveloped = developedCountries.includes(countryCode.toUpperCase());
  const baseScore = isDeveloped ? 70 : 50;
  
  const englishNative = ['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'SG'];
  const englishProficiency = englishNative.includes(countryCode.toUpperCase()) 
    ? 95 + Math.random() * 5 
    : 30 + Math.random() * 50;
  
  return {
    educationLevel: Math.round(Math.min(100, baseScore + importance * 20 + Math.random() * 15)),
    englishProficiency: Math.round(englishProficiency),
    techTalentPool: Math.round(Math.min(100, baseScore - 10 + importance * 30 + Math.random() * 20)),
    laborLaws: ['flexible', 'moderate', 'strict'][Math.floor(Math.random() * 3)] as 'flexible' | 'moderate' | 'strict',
    unionStrength: Math.round(10 + Math.random() * 60)
  };
};

// Génère des données de qualité de vie estimées
const generateEstimatedQualityOfLife = (countryCode: string, importance: number): ExtendedCityData['qualityOfLife'] => {
  const safeCountries = ['JP', 'SG', 'CH', 'NO', 'DK', 'FI', 'SE', 'NZ', 'AU', 'NL', 'AT', 'DE'];
  const isSafe = safeCountries.includes(countryCode.toUpperCase());
  
  return {
    safetyIndex: Math.round(isSafe ? 70 + Math.random() * 25 : 30 + Math.random() * 40),
    healthcareQuality: Math.round(50 + importance * 30 + Math.random() * 20),
    pollutionIndex: Math.round(20 + Math.random() * 50),
    climateScore: Math.round(40 + Math.random() * 50)
  };
};

// Génère des bonus de gameplay estimés
const generateEstimatedBonuses = (economics: ExtendedCityData['economics']): ExtendedCityData['bonuses'] => {
  const costFactor = economics.costOfLivingIndex / 100;
  const developmentFactor = economics.gdpPerCapita / 50000;
  
  return {
    productionMultiplier: Math.max(0.7, Math.min(1.6, 1.3 - costFactor * 0.5)),
    salesMultiplier: Math.max(0.8, Math.min(1.5, 0.9 + developmentFactor * 0.4)),
    rdMultiplier: Math.max(0.7, Math.min(1.6, 0.8 + developmentFactor * 0.5)),
    recruitmentMultiplier: Math.max(0.8, Math.min(1.6, 1.4 - costFactor * 0.4)),
    brandValueMultiplier: Math.max(0.75, Math.min(1.5, 0.85 + developmentFactor * 0.4))
  };
};

// Détermine le continent basé sur le code pays
const getContinent = (countryCode: string): string => {
  const continentMap: Record<string, string> = {
    // Amérique du Nord
    'US': 'Amérique du Nord', 'CA': 'Amérique du Nord', 'MX': 'Amérique du Nord',
    // Europe
    'GB': 'Europe', 'DE': 'Europe', 'FR': 'Europe', 'IT': 'Europe', 'ES': 'Europe',
    'NL': 'Europe', 'BE': 'Europe', 'CH': 'Europe', 'AT': 'Europe', 'SE': 'Europe',
    'NO': 'Europe', 'DK': 'Europe', 'FI': 'Europe', 'PL': 'Europe', 'CZ': 'Europe',
    'PT': 'Europe', 'IE': 'Europe', 'GR': 'Europe', 'RO': 'Europe', 'HU': 'Europe',
    // Asie
    'JP': 'Asie', 'CN': 'Asie', 'KR': 'Asie', 'IN': 'Asie', 'SG': 'Asie',
    'HK': 'Asie', 'TW': 'Asie', 'TH': 'Asie', 'MY': 'Asie', 'ID': 'Asie',
    'VN': 'Asie', 'PH': 'Asie', 'AE': 'Asie', 'SA': 'Asie', 'IL': 'Asie',
    // Océanie
    'AU': 'Océanie', 'NZ': 'Océanie',
    // Amérique du Sud
    'BR': 'Amérique du Sud', 'AR': 'Amérique du Sud', 'CL': 'Amérique du Sud',
    'CO': 'Amérique du Sud', 'PE': 'Amérique du Sud', 'VE': 'Amérique du Sud',
    // Afrique
    'ZA': 'Afrique', 'EG': 'Afrique', 'NG': 'Afrique', 'KE': 'Afrique',
    'MA': 'Afrique', 'TN': 'Afrique', 'GH': 'Afrique', 'ET': 'Afrique'
  };
  
  return continentMap[countryCode.toUpperCase()] || 'Autre';
};

// Estime la population basée sur l'importance
const estimatePopulation = (importance: number): number => {
  if (importance > 0.8) return Math.round(5000000 + Math.random() * 15000000);
  if (importance > 0.6) return Math.round(1000000 + Math.random() * 4000000);
  if (importance > 0.4) return Math.round(200000 + Math.random() * 800000);
  if (importance > 0.2) return Math.round(50000 + Math.random() * 150000);
  return Math.round(10000 + Math.random() * 40000);
};

// Convertit un résultat Nominatim en ExtendedCityData
const nominatimToExtendedCity = (result: NominatimResult): ExtendedCityData => {
  const cityName = result.address?.city || result.address?.town || result.address?.village || result.address?.municipality || result.display_name.split(',')[0];
  const country = result.address?.country || 'Unknown';
  const countryCode = result.address?.country_code?.toUpperCase() || 'XX';
  const importance = result.importance || 0.5;
  
  const economics = generateEstimatedEconomics(country, countryCode, importance);
  
  return {
    id: `nominatim-${result.place_id}`,
    name: cityName,
    country: country,
    countryCode: countryCode,
    continent: getContinent(countryCode),
    lat: parseFloat(result.lat),
    lng: parseFloat(result.lon),
    population: estimatePopulation(importance),
    timezone: 'UTC', // Simplifié
    economics: economics,
    sectors: generateEstimatedSectors(importance),
    infrastructure: generateEstimatedInfrastructure(importance),
    workforce: generateEstimatedWorkforce(countryCode, importance),
    qualityOfLife: generateEstimatedQualityOfLife(countryCode, importance),
    bonuses: generateEstimatedBonuses(economics)
  };
};

// Recherche de villes avec API Nominatim
export const searchCitiesOnline = async (query: string): Promise<ExtendedCityData[]> => {
  if (!query || query.length < 2) return [];
  
  const cacheKey = query.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey)!;
  }
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=15&featuretype=city`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'BusinessTycoonGame/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const results: NominatimResult[] = await response.json();
    
    // Filtrer pour ne garder que les villes/villages/municipalités
    const cityResults = results.filter(r => 
      ['city', 'town', 'village', 'municipality', 'administrative'].includes(r.type)
    );
    
    const cities = cityResults.map(nominatimToExtendedCity);
    
    // Mettre en cache les résultats
    searchCache.set(cacheKey, cities);
    
    return cities;
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

// Recherche hybride : d'abord dans la base locale, puis en ligne si besoin
export const searchCitiesHybrid = async (query: string): Promise<ExtendedCityData[]> => {
  if (!query || query.length < 2) return [];
  
  const queryLower = query.toLowerCase();
  
  // Recherche dans la base locale d'abord
  const localResults = extendedWorldCities.filter(city =>
    city.name.toLowerCase().includes(queryLower) ||
    city.country.toLowerCase().includes(queryLower)
  );
  
  // Si on a assez de résultats locaux, on les retourne
  if (localResults.length >= 5) {
    return localResults.slice(0, 20);
  }
  
  // Sinon, on cherche en ligne
  try {
    const onlineResults = await searchCitiesOnline(query);
    
    // Fusionner les résultats en évitant les doublons
    const localIds = new Set(localResults.map(c => c.id));
    const mergedResults = [
      ...localResults,
      ...onlineResults.filter(c => !localIds.has(c.id))
    ];
    
    return mergedResults.slice(0, 20);
  } catch (error) {
    // En cas d'erreur, retourner les résultats locaux
    return localResults;
  }
};

// Recherche de ville par coordonnées (reverse geocoding)
export const getCityByCoordinates = async (lat: number, lng: number): Promise<ExtendedCityData | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'fr',
          'User-Agent': 'BusinessTycoonGame/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const result: NominatimResult = await response.json();
    
    if (result) {
      // Vérifier d'abord si on a cette ville dans notre base locale
      const cityName = result.address?.city || result.address?.town || result.address?.village;
      if (cityName) {
        const localCity = extendedWorldCities.find(c => 
          c.name.toLowerCase() === cityName.toLowerCase()
        );
        if (localCity) return localCity;
      }
      
      return nominatimToExtendedCity(result);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting city by coordinates:', error);
    return null;
  }
};

// Nettoyer le cache (utile pour les tests ou après un certain temps)
export const clearSearchCache = () => {
  searchCache.clear();
};
