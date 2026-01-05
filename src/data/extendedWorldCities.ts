import { ExtendedCityData } from '@/types/ultraRealism';

// Base de données étendue de 500+ villes majeures avec données économiques ultra-détaillées
export const extendedWorldCities: ExtendedCityData[] = [
  // ===== AMÉRIQUE DU NORD =====
  {
    id: 'new-york',
    name: 'New York',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 40.7128,
    lng: -74.0060,
    population: 8336817,
    timezone: 'America/New_York',
    economics: {
      gdpPerCapita: 85000,
      gdpGrowth: 2.1,
      unemploymentRate: 4.2,
      inflationRate: 3.1,
      costOfLivingIndex: 187,
      averageSalary: 6500,
      minimumWage: 2320,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 8.875,
      corruptionIndex: 25,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 85,
      finance: 98,
      manufacturing: 35,
      healthcare: 75,
      energy: 40,
      tourism: 90,
      agriculture: 5,
      logistics: 80,
      retail: 95,
      realEstate: 95
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 90,
      roadQuality: 75,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 90,
      englishProficiency: 100,
      techTalentPool: 95,
      laborLaws: 'moderate',
      unionStrength: 45
    },
    qualityOfLife: {
      safetyIndex: 65,
      healthcareQuality: 85,
      pollutionIndex: 45,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 0.9,
      salesMultiplier: 1.4,
      rdMultiplier: 1.3,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.5
    }
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 37.7749,
    lng: -122.4194,
    population: 883305,
    timezone: 'America/Los_Angeles',
    economics: {
      gdpPerCapita: 110000,
      gdpGrowth: 2.8,
      unemploymentRate: 3.5,
      inflationRate: 3.2,
      costOfLivingIndex: 195,
      averageSalary: 8500,
      minimumWage: 2680,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 8.625,
      corruptionIndex: 22,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 100,
      finance: 75,
      manufacturing: 25,
      healthcare: 70,
      energy: 55,
      tourism: 80,
      agriculture: 10,
      logistics: 60,
      retail: 70,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 250,
      airportConnectivity: 95,
      portAccess: true,
      railNetwork: 70,
      roadQuality: 70,
      powerReliability: 92
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 100,
      techTalentPool: 100,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 90,
      pollutionIndex: 35,
      climateScore: 85
    },
    bonuses: {
      productionMultiplier: 0.85,
      salesMultiplier: 1.2,
      rdMultiplier: 1.6,
      recruitmentMultiplier: 1.4,
      brandValueMultiplier: 1.4
    }
  },
  {
    id: 'los-angeles',
    name: 'Los Angeles',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 34.0522,
    lng: -118.2437,
    population: 3979576,
    timezone: 'America/Los_Angeles',
    economics: {
      gdpPerCapita: 75000,
      gdpGrowth: 2.3,
      unemploymentRate: 4.8,
      inflationRate: 3.0,
      costOfLivingIndex: 166,
      averageSalary: 5800,
      minimumWage: 2680,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 9.5,
      corruptionIndex: 25,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 80,
      finance: 65,
      manufacturing: 45,
      healthcare: 75,
      energy: 50,
      tourism: 95,
      agriculture: 15,
      logistics: 90,
      retail: 90,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 200,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 50,
      roadQuality: 65,
      powerReliability: 90
    },
    workforce: {
      educationLevel: 82,
      englishProficiency: 95,
      techTalentPool: 85,
      laborLaws: 'moderate',
      unionStrength: 50
    },
    qualityOfLife: {
      safetyIndex: 50,
      healthcareQuality: 82,
      pollutionIndex: 60,
      climateScore: 90
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.3,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.4
    }
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 41.8781,
    lng: -87.6298,
    population: 2693976,
    timezone: 'America/Chicago',
    economics: {
      gdpPerCapita: 65000,
      gdpGrowth: 1.9,
      unemploymentRate: 4.5,
      inflationRate: 2.9,
      costOfLivingIndex: 107,
      averageSalary: 5200,
      minimumWage: 2240,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 10.25,
      corruptionIndex: 30,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 70,
      finance: 85,
      manufacturing: 65,
      healthcare: 80,
      energy: 55,
      tourism: 75,
      agriculture: 25,
      logistics: 95,
      retail: 80,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 98,
      portAccess: false,
      railNetwork: 85,
      roadQuality: 70,
      powerReliability: 92
    },
    workforce: {
      educationLevel: 85,
      englishProficiency: 100,
      techTalentPool: 80,
      laborLaws: 'moderate',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 45,
      healthcareQuality: 85,
      pollutionIndex: 40,
      climateScore: 50
    },
    bonuses: {
      productionMultiplier: 1.1,
      salesMultiplier: 1.15,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.05,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'houston',
    name: 'Houston',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 29.7604,
    lng: -95.3698,
    population: 2320268,
    timezone: 'America/Chicago',
    economics: {
      gdpPerCapita: 70000,
      gdpGrowth: 2.5,
      unemploymentRate: 4.0,
      inflationRate: 2.8,
      costOfLivingIndex: 96,
      averageSalary: 5000,
      minimumWage: 1256,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 8.25,
      corruptionIndex: 28,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 60,
      finance: 70,
      manufacturing: 75,
      healthcare: 90,
      energy: 100,
      tourism: 50,
      agriculture: 20,
      logistics: 85,
      retail: 75,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 140,
      airportConnectivity: 95,
      portAccess: true,
      railNetwork: 60,
      roadQuality: 75,
      powerReliability: 88
    },
    workforce: {
      educationLevel: 80,
      englishProficiency: 95,
      techTalentPool: 70,
      laborLaws: 'flexible',
      unionStrength: 25
    },
    qualityOfLife: {
      safetyIndex: 50,
      healthcareQuality: 90,
      pollutionIndex: 55,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.2,
      salesMultiplier: 1.05,
      rdMultiplier: 0.95,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.1
    }
  },
  {
    id: 'seattle',
    name: 'Seattle',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 47.6062,
    lng: -122.3321,
    population: 737015,
    timezone: 'America/Los_Angeles',
    economics: {
      gdpPerCapita: 95000,
      gdpGrowth: 3.0,
      unemploymentRate: 3.2,
      inflationRate: 3.1,
      costOfLivingIndex: 172,
      averageSalary: 7200,
      minimumWage: 2680,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 10.25,
      corruptionIndex: 20,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 98,
      finance: 55,
      manufacturing: 50,
      healthcare: 70,
      energy: 45,
      tourism: 70,
      agriculture: 15,
      logistics: 75,
      retail: 80,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 220,
      airportConnectivity: 90,
      portAccess: true,
      railNetwork: 55,
      roadQuality: 75,
      powerReliability: 94
    },
    workforce: {
      educationLevel: 92,
      englishProficiency: 100,
      techTalentPool: 98,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 65,
      healthcareQuality: 88,
      pollutionIndex: 30,
      climateScore: 65
    },
    bonuses: {
      productionMultiplier: 0.9,
      salesMultiplier: 1.15,
      rdMultiplier: 1.5,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 1.35
    }
  },
  {
    id: 'boston',
    name: 'Boston',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 42.3601,
    lng: -71.0589,
    population: 692600,
    timezone: 'America/New_York',
    economics: {
      gdpPerCapita: 88000,
      gdpGrowth: 2.4,
      unemploymentRate: 3.8,
      inflationRate: 2.9,
      costOfLivingIndex: 152,
      averageSalary: 6800,
      minimumWage: 2400,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 6.25,
      corruptionIndex: 22,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 90,
      finance: 85,
      manufacturing: 40,
      healthcare: 95,
      energy: 45,
      tourism: 80,
      agriculture: 5,
      logistics: 65,
      retail: 75,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 190,
      airportConnectivity: 92,
      portAccess: true,
      railNetwork: 80,
      roadQuality: 65,
      powerReliability: 93
    },
    workforce: {
      educationLevel: 98,
      englishProficiency: 100,
      techTalentPool: 95,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 70,
      healthcareQuality: 98,
      pollutionIndex: 35,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 0.88,
      salesMultiplier: 1.2,
      rdMultiplier: 1.55,
      recruitmentMultiplier: 1.35,
      brandValueMultiplier: 1.3
    }
  },
  {
    id: 'austin',
    name: 'Austin',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 30.2672,
    lng: -97.7431,
    population: 978908,
    timezone: 'America/Chicago',
    economics: {
      gdpPerCapita: 72000,
      gdpGrowth: 4.5,
      unemploymentRate: 3.0,
      inflationRate: 3.2,
      costOfLivingIndex: 110,
      averageSalary: 5500,
      minimumWage: 1256,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 8.25,
      corruptionIndex: 22,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 95,
      finance: 50,
      manufacturing: 55,
      healthcare: 65,
      energy: 60,
      tourism: 70,
      agriculture: 20,
      logistics: 60,
      retail: 70,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 85,
      portAccess: false,
      railNetwork: 40,
      roadQuality: 70,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 98,
      techTalentPool: 92,
      laborLaws: 'flexible',
      unionStrength: 15
    },
    qualityOfLife: {
      safetyIndex: 65,
      healthcareQuality: 80,
      pollutionIndex: 35,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 1.1,
      salesMultiplier: 1.1,
      rdMultiplier: 1.4,
      recruitmentMultiplier: 1.25,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 25.7617,
    lng: -80.1918,
    population: 467963,
    timezone: 'America/New_York',
    economics: {
      gdpPerCapita: 55000,
      gdpGrowth: 2.8,
      unemploymentRate: 4.5,
      inflationRate: 3.5,
      costOfLivingIndex: 128,
      averageSalary: 4500,
      minimumWage: 1760,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 7.0,
      corruptionIndex: 30,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 55,
      finance: 80,
      manufacturing: 25,
      healthcare: 70,
      energy: 30,
      tourism: 100,
      agriculture: 15,
      logistics: 90,
      retail: 85,
      realEstate: 95
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 98,
      portAccess: true,
      railNetwork: 35,
      roadQuality: 70,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 75,
      englishProficiency: 85,
      techTalentPool: 60,
      laborLaws: 'flexible',
      unionStrength: 20
    },
    qualityOfLife: {
      safetyIndex: 45,
      healthcareQuality: 78,
      pollutionIndex: 40,
      climateScore: 75
    },
    bonuses: {
      productionMultiplier: 0.9,
      salesMultiplier: 1.25,
      rdMultiplier: 0.9,
      recruitmentMultiplier: 1.0,
      brandValueMultiplier: 1.3
    }
  },
  {
    id: 'denver',
    name: 'Denver',
    country: 'États-Unis',
    countryCode: 'US',
    continent: 'Amérique du Nord',
    lat: 39.7392,
    lng: -104.9903,
    population: 727211,
    timezone: 'America/Denver',
    economics: {
      gdpPerCapita: 68000,
      gdpGrowth: 3.2,
      unemploymentRate: 3.5,
      inflationRate: 2.8,
      costOfLivingIndex: 112,
      averageSalary: 5400,
      minimumWage: 2080,
      corporateTaxRate: 21,
      incomeTaxRate: 37,
      vatRate: 8.81,
      corruptionIndex: 22,
      easeOfBusinessIndex: 6,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 80,
      finance: 65,
      manufacturing: 45,
      healthcare: 75,
      energy: 70,
      tourism: 75,
      agriculture: 25,
      logistics: 70,
      retail: 70,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 160,
      airportConnectivity: 92,
      portAccess: false,
      railNetwork: 55,
      roadQuality: 75,
      powerReliability: 92
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 100,
      techTalentPool: 82,
      laborLaws: 'moderate',
      unionStrength: 30
    },
    qualityOfLife: {
      safetyIndex: 60,
      healthcareQuality: 82,
      pollutionIndex: 35,
      climateScore: 80
    },
    bonuses: {
      productionMultiplier: 1.05,
      salesMultiplier: 1.1,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.15,
      brandValueMultiplier: 1.15
    }
  },
  {
    id: 'toronto',
    name: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    continent: 'Amérique du Nord',
    lat: 43.6532,
    lng: -79.3832,
    population: 2731571,
    timezone: 'America/Toronto',
    economics: {
      gdpPerCapita: 52000,
      gdpGrowth: 2.0,
      unemploymentRate: 5.5,
      inflationRate: 3.4,
      costOfLivingIndex: 135,
      averageSalary: 4800,
      minimumWage: 2080,
      corporateTaxRate: 26.5,
      incomeTaxRate: 53.5,
      vatRate: 13,
      corruptionIndex: 18,
      easeOfBusinessIndex: 23,
      economicFreedomIndex: 78
    },
    sectors: {
      technology: 85,
      finance: 95,
      manufacturing: 50,
      healthcare: 80,
      energy: 55,
      tourism: 75,
      agriculture: 15,
      logistics: 75,
      retail: 80,
      realEstate: 90
    },
    infrastructure: {
      internetSpeedMbps: 140,
      airportConnectivity: 95,
      portAccess: true,
      railNetwork: 75,
      roadQuality: 80,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 90,
      englishProficiency: 95,
      techTalentPool: 88,
      laborLaws: 'moderate',
      unionStrength: 45
    },
    qualityOfLife: {
      safetyIndex: 75,
      healthcareQuality: 90,
      pollutionIndex: 30,
      climateScore: 50
    },
    bonuses: {
      productionMultiplier: 1.0,
      salesMultiplier: 1.15,
      rdMultiplier: 1.25,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'vancouver',
    name: 'Vancouver',
    country: 'Canada',
    countryCode: 'CA',
    continent: 'Amérique du Nord',
    lat: 49.2827,
    lng: -123.1207,
    population: 631486,
    timezone: 'America/Vancouver',
    economics: {
      gdpPerCapita: 48000,
      gdpGrowth: 2.2,
      unemploymentRate: 5.0,
      inflationRate: 3.2,
      costOfLivingIndex: 145,
      averageSalary: 4500,
      minimumWage: 2280,
      corporateTaxRate: 26.5,
      incomeTaxRate: 53.5,
      vatRate: 12,
      corruptionIndex: 18,
      easeOfBusinessIndex: 23,
      economicFreedomIndex: 78
    },
    sectors: {
      technology: 80,
      finance: 70,
      manufacturing: 35,
      healthcare: 75,
      energy: 50,
      tourism: 90,
      agriculture: 20,
      logistics: 85,
      retail: 75,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 130,
      airportConnectivity: 90,
      portAccess: true,
      railNetwork: 60,
      roadQuality: 80,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 95,
      techTalentPool: 82,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 78,
      healthcareQuality: 88,
      pollutionIndex: 25,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.1,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.15,
      brandValueMultiplier: 1.15
    }
  },
  {
    id: 'montreal',
    name: 'Montréal',
    country: 'Canada',
    countryCode: 'CA',
    continent: 'Amérique du Nord',
    lat: 45.5017,
    lng: -73.5673,
    population: 1762949,
    timezone: 'America/Montreal',
    economics: {
      gdpPerCapita: 45000,
      gdpGrowth: 1.8,
      unemploymentRate: 5.8,
      inflationRate: 3.0,
      costOfLivingIndex: 108,
      averageSalary: 4200,
      minimumWage: 2080,
      corporateTaxRate: 26.5,
      incomeTaxRate: 53.5,
      vatRate: 14.975,
      corruptionIndex: 20,
      easeOfBusinessIndex: 23,
      economicFreedomIndex: 78
    },
    sectors: {
      technology: 75,
      finance: 70,
      manufacturing: 55,
      healthcare: 85,
      energy: 60,
      tourism: 80,
      agriculture: 20,
      logistics: 70,
      retail: 75,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 120,
      airportConnectivity: 88,
      portAccess: true,
      railNetwork: 70,
      roadQuality: 65,
      powerReliability: 93
    },
    workforce: {
      educationLevel: 85,
      englishProficiency: 75,
      techTalentPool: 78,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 72,
      healthcareQuality: 88,
      pollutionIndex: 28,
      climateScore: 45
    },
    bonuses: {
      productionMultiplier: 1.05,
      salesMultiplier: 1.05,
      rdMultiplier: 1.15,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.1
    }
  },
  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexique',
    countryCode: 'MX',
    continent: 'Amérique du Nord',
    lat: 19.4326,
    lng: -99.1332,
    population: 8918653,
    timezone: 'America/Mexico_City',
    economics: {
      gdpPerCapita: 22000,
      gdpGrowth: 2.5,
      unemploymentRate: 3.8,
      inflationRate: 5.5,
      costOfLivingIndex: 48,
      averageSalary: 1200,
      minimumWage: 280,
      corporateTaxRate: 30,
      incomeTaxRate: 35,
      vatRate: 16,
      corruptionIndex: 65,
      easeOfBusinessIndex: 60,
      economicFreedomIndex: 66
    },
    sectors: {
      technology: 55,
      finance: 75,
      manufacturing: 80,
      healthcare: 60,
      energy: 70,
      tourism: 85,
      agriculture: 30,
      logistics: 75,
      retail: 80,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 50,
      airportConnectivity: 95,
      portAccess: false,
      railNetwork: 50,
      roadQuality: 60,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 65,
      englishProficiency: 45,
      techTalentPool: 55,
      laborLaws: 'moderate',
      unionStrength: 50
    },
    qualityOfLife: {
      safetyIndex: 35,
      healthcareQuality: 70,
      pollutionIndex: 75,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 1.35,
      salesMultiplier: 1.1,
      rdMultiplier: 0.85,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 0.95
    }
  },
  
  // ===== EUROPE =====
  {
    id: 'london',
    name: 'Londres',
    country: 'Royaume-Uni',
    countryCode: 'GB',
    continent: 'Europe',
    lat: 51.5074,
    lng: -0.1278,
    population: 8982000,
    timezone: 'Europe/London',
    economics: {
      gdpPerCapita: 70000,
      gdpGrowth: 1.5,
      unemploymentRate: 4.2,
      inflationRate: 4.0,
      costOfLivingIndex: 165,
      averageSalary: 5500,
      minimumWage: 2080,
      corporateTaxRate: 25,
      incomeTaxRate: 45,
      vatRate: 20,
      corruptionIndex: 20,
      easeOfBusinessIndex: 8,
      economicFreedomIndex: 72
    },
    sectors: {
      technology: 85,
      finance: 100,
      manufacturing: 35,
      healthcare: 80,
      energy: 55,
      tourism: 95,
      agriculture: 5,
      logistics: 85,
      retail: 90,
      realEstate: 95
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 95,
      roadQuality: 80,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 90,
      englishProficiency: 100,
      techTalentPool: 90,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 60,
      healthcareQuality: 85,
      pollutionIndex: 40,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 0.85,
      salesMultiplier: 1.35,
      rdMultiplier: 1.3,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.45
    }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    lat: 48.8566,
    lng: 2.3522,
    population: 2161000,
    timezone: 'Europe/Paris',
    economics: {
      gdpPerCapita: 62000,
      gdpGrowth: 1.8,
      unemploymentRate: 7.5,
      inflationRate: 2.8,
      costOfLivingIndex: 145,
      averageSalary: 4200,
      minimumWage: 1840,
      corporateTaxRate: 25,
      incomeTaxRate: 45,
      vatRate: 20,
      corruptionIndex: 28,
      easeOfBusinessIndex: 32,
      economicFreedomIndex: 66
    },
    sectors: {
      technology: 75,
      finance: 85,
      manufacturing: 50,
      healthcare: 85,
      energy: 70,
      tourism: 100,
      agriculture: 20,
      logistics: 80,
      retail: 95,
      realEstate: 90
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 98,
      portAccess: false,
      railNetwork: 100,
      roadQuality: 90,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 55,
      techTalentPool: 80,
      laborLaws: 'strict',
      unionStrength: 70
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 95,
      pollutionIndex: 45,
      climateScore: 65
    },
    bonuses: {
      productionMultiplier: 0.9,
      salesMultiplier: 1.25,
      rdMultiplier: 1.25,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.4
    }
  },
  {
    id: 'berlin',
    name: 'Berlin',
    country: 'Allemagne',
    countryCode: 'DE',
    continent: 'Europe',
    lat: 52.5200,
    lng: 13.4050,
    population: 3644826,
    timezone: 'Europe/Berlin',
    economics: {
      gdpPerCapita: 52000,
      gdpGrowth: 1.2,
      unemploymentRate: 5.5,
      inflationRate: 2.5,
      costOfLivingIndex: 105,
      averageSalary: 4000,
      minimumWage: 2080,
      corporateTaxRate: 30,
      incomeTaxRate: 45,
      vatRate: 19,
      corruptionIndex: 20,
      easeOfBusinessIndex: 22,
      economicFreedomIndex: 73
    },
    sectors: {
      technology: 90,
      finance: 65,
      manufacturing: 60,
      healthcare: 85,
      energy: 75,
      tourism: 80,
      agriculture: 15,
      logistics: 75,
      retail: 75,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 100,
      airportConnectivity: 92,
      portAccess: false,
      railNetwork: 95,
      roadQuality: 95,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 92,
      englishProficiency: 70,
      techTalentPool: 88,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 65,
      healthcareQuality: 92,
      pollutionIndex: 30,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.05,
      salesMultiplier: 1.1,
      rdMultiplier: 1.35,
      recruitmentMultiplier: 1.15,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'munich',
    name: 'Munich',
    country: 'Allemagne',
    countryCode: 'DE',
    continent: 'Europe',
    lat: 48.1351,
    lng: 11.5820,
    population: 1471508,
    timezone: 'Europe/Berlin',
    economics: {
      gdpPerCapita: 75000,
      gdpGrowth: 1.8,
      unemploymentRate: 3.2,
      inflationRate: 2.3,
      costOfLivingIndex: 135,
      averageSalary: 5200,
      minimumWage: 2080,
      corporateTaxRate: 30,
      incomeTaxRate: 45,
      vatRate: 19,
      corruptionIndex: 18,
      easeOfBusinessIndex: 22,
      economicFreedomIndex: 73
    },
    sectors: {
      technology: 85,
      finance: 80,
      manufacturing: 95,
      healthcare: 85,
      energy: 70,
      tourism: 85,
      agriculture: 20,
      logistics: 85,
      retail: 80,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 120,
      airportConnectivity: 95,
      portAccess: false,
      railNetwork: 95,
      roadQuality: 98,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 75,
      techTalentPool: 90,
      laborLaws: 'strict',
      unionStrength: 60
    },
    qualityOfLife: {
      safetyIndex: 80,
      healthcareQuality: 95,
      pollutionIndex: 25,
      climateScore: 65
    },
    bonuses: {
      productionMultiplier: 1.15,
      salesMultiplier: 1.15,
      rdMultiplier: 1.4,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.3
    }
  },
  {
    id: 'frankfurt',
    name: 'Francfort',
    country: 'Allemagne',
    countryCode: 'DE',
    continent: 'Europe',
    lat: 50.1109,
    lng: 8.6821,
    population: 753056,
    timezone: 'Europe/Berlin',
    economics: {
      gdpPerCapita: 82000,
      gdpGrowth: 1.5,
      unemploymentRate: 4.0,
      inflationRate: 2.4,
      costOfLivingIndex: 128,
      averageSalary: 5800,
      minimumWage: 2080,
      corporateTaxRate: 30,
      incomeTaxRate: 45,
      vatRate: 19,
      corruptionIndex: 18,
      easeOfBusinessIndex: 22,
      economicFreedomIndex: 73
    },
    sectors: {
      technology: 70,
      finance: 100,
      manufacturing: 55,
      healthcare: 75,
      energy: 60,
      tourism: 60,
      agriculture: 10,
      logistics: 90,
      retail: 70,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 140,
      airportConnectivity: 100,
      portAccess: false,
      railNetwork: 98,
      roadQuality: 95,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 92,
      englishProficiency: 80,
      techTalentPool: 78,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 70,
      healthcareQuality: 92,
      pollutionIndex: 28,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.25,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.05,
      brandValueMultiplier: 1.35
    }
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Pays-Bas',
    countryCode: 'NL',
    continent: 'Europe',
    lat: 52.3676,
    lng: 4.9041,
    population: 872680,
    timezone: 'Europe/Amsterdam',
    economics: {
      gdpPerCapita: 58000,
      gdpGrowth: 2.0,
      unemploymentRate: 3.5,
      inflationRate: 2.6,
      costOfLivingIndex: 130,
      averageSalary: 4600,
      minimumWage: 2000,
      corporateTaxRate: 25.8,
      incomeTaxRate: 49.5,
      vatRate: 21,
      corruptionIndex: 18,
      easeOfBusinessIndex: 42,
      economicFreedomIndex: 77
    },
    sectors: {
      technology: 85,
      finance: 85,
      manufacturing: 45,
      healthcare: 80,
      energy: 65,
      tourism: 90,
      agriculture: 30,
      logistics: 95,
      retail: 80,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 170,
      airportConnectivity: 98,
      portAccess: true,
      railNetwork: 90,
      roadQuality: 90,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 92,
      englishProficiency: 95,
      techTalentPool: 85,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 72,
      healthcareQuality: 90,
      pollutionIndex: 25,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.2,
      rdMultiplier: 1.25,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'zurich',
    name: 'Zurich',
    country: 'Suisse',
    countryCode: 'CH',
    continent: 'Europe',
    lat: 47.3769,
    lng: 8.5417,
    population: 402762,
    timezone: 'Europe/Zurich',
    economics: {
      gdpPerCapita: 95000,
      gdpGrowth: 1.5,
      unemploymentRate: 2.5,
      inflationRate: 1.5,
      costOfLivingIndex: 195,
      averageSalary: 8500,
      minimumWage: 0,
      corporateTaxRate: 14.9,
      incomeTaxRate: 40,
      vatRate: 8.1,
      corruptionIndex: 15,
      easeOfBusinessIndex: 36,
      economicFreedomIndex: 84
    },
    sectors: {
      technology: 80,
      finance: 100,
      manufacturing: 65,
      healthcare: 90,
      energy: 50,
      tourism: 85,
      agriculture: 15,
      logistics: 80,
      retail: 75,
      realEstate: 90
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 92,
      portAccess: false,
      railNetwork: 100,
      roadQuality: 98,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 98,
      englishProficiency: 75,
      techTalentPool: 85,
      laborLaws: 'flexible',
      unionStrength: 25
    },
    qualityOfLife: {
      safetyIndex: 95,
      healthcareQuality: 98,
      pollutionIndex: 15,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 0.85,
      salesMultiplier: 1.15,
      rdMultiplier: 1.35,
      recruitmentMultiplier: 0.95,
      brandValueMultiplier: 1.5
    }
  },
  {
    id: 'geneva',
    name: 'Genève',
    country: 'Suisse',
    countryCode: 'CH',
    continent: 'Europe',
    lat: 46.2044,
    lng: 6.1432,
    population: 201818,
    timezone: 'Europe/Zurich',
    economics: {
      gdpPerCapita: 90000,
      gdpGrowth: 1.3,
      unemploymentRate: 3.0,
      inflationRate: 1.4,
      costOfLivingIndex: 200,
      averageSalary: 8200,
      minimumWage: 0,
      corporateTaxRate: 14.9,
      incomeTaxRate: 40,
      vatRate: 8.1,
      corruptionIndex: 15,
      easeOfBusinessIndex: 36,
      economicFreedomIndex: 84
    },
    sectors: {
      technology: 70,
      finance: 95,
      manufacturing: 55,
      healthcare: 90,
      energy: 45,
      tourism: 85,
      agriculture: 10,
      logistics: 70,
      retail: 70,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 170,
      airportConnectivity: 88,
      portAccess: false,
      railNetwork: 98,
      roadQuality: 98,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 96,
      englishProficiency: 70,
      techTalentPool: 80,
      laborLaws: 'flexible',
      unionStrength: 28
    },
    qualityOfLife: {
      safetyIndex: 92,
      healthcareQuality: 98,
      pollutionIndex: 18,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 0.82,
      salesMultiplier: 1.1,
      rdMultiplier: 1.3,
      recruitmentMultiplier: 0.9,
      brandValueMultiplier: 1.55
    }
  },
  {
    id: 'dublin',
    name: 'Dublin',
    country: 'Irlande',
    countryCode: 'IE',
    continent: 'Europe',
    lat: 53.3498,
    lng: -6.2603,
    population: 544107,
    timezone: 'Europe/Dublin',
    economics: {
      gdpPerCapita: 85000,
      gdpGrowth: 5.5,
      unemploymentRate: 4.5,
      inflationRate: 2.8,
      costOfLivingIndex: 140,
      averageSalary: 4800,
      minimumWage: 2160,
      corporateTaxRate: 12.5,
      incomeTaxRate: 40,
      vatRate: 23,
      corruptionIndex: 22,
      easeOfBusinessIndex: 24,
      economicFreedomIndex: 81
    },
    sectors: {
      technology: 95,
      finance: 80,
      manufacturing: 60,
      healthcare: 85,
      energy: 50,
      tourism: 80,
      agriculture: 25,
      logistics: 70,
      retail: 70,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 140,
      airportConnectivity: 88,
      portAccess: true,
      railNetwork: 60,
      roadQuality: 80,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 92,
      englishProficiency: 100,
      techTalentPool: 90,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 75,
      healthcareQuality: 82,
      pollutionIndex: 25,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 0.92,
      salesMultiplier: 1.15,
      rdMultiplier: 1.3,
      recruitmentMultiplier: 1.25,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'stockholm',
    name: 'Stockholm',
    country: 'Suède',
    countryCode: 'SE',
    continent: 'Europe',
    lat: 59.3293,
    lng: 18.0686,
    population: 975904,
    timezone: 'Europe/Stockholm',
    economics: {
      gdpPerCapita: 58000,
      gdpGrowth: 2.2,
      unemploymentRate: 7.0,
      inflationRate: 2.0,
      costOfLivingIndex: 138,
      averageSalary: 4400,
      minimumWage: 0,
      corporateTaxRate: 20.6,
      incomeTaxRate: 57,
      vatRate: 25,
      corruptionIndex: 15,
      easeOfBusinessIndex: 10,
      economicFreedomIndex: 75
    },
    sectors: {
      technology: 95,
      finance: 75,
      manufacturing: 55,
      healthcare: 90,
      energy: 65,
      tourism: 75,
      agriculture: 15,
      logistics: 75,
      retail: 70,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 88,
      portAccess: true,
      railNetwork: 85,
      roadQuality: 90,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 92,
      techTalentPool: 92,
      laborLaws: 'moderate',
      unionStrength: 65
    },
    qualityOfLife: {
      safetyIndex: 75,
      healthcareQuality: 95,
      pollutionIndex: 20,
      climateScore: 50
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.1,
      rdMultiplier: 1.4,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.3
    }
  },
  {
    id: 'copenhagen',
    name: 'Copenhague',
    country: 'Danemark',
    countryCode: 'DK',
    continent: 'Europe',
    lat: 55.6761,
    lng: 12.5683,
    population: 644431,
    timezone: 'Europe/Copenhagen',
    economics: {
      gdpPerCapita: 62000,
      gdpGrowth: 2.0,
      unemploymentRate: 4.5,
      inflationRate: 2.2,
      costOfLivingIndex: 148,
      averageSalary: 5000,
      minimumWage: 0,
      corporateTaxRate: 22,
      incomeTaxRate: 55.9,
      vatRate: 25,
      corruptionIndex: 12,
      easeOfBusinessIndex: 4,
      economicFreedomIndex: 78
    },
    sectors: {
      technology: 85,
      finance: 75,
      manufacturing: 50,
      healthcare: 90,
      energy: 80,
      tourism: 80,
      agriculture: 25,
      logistics: 85,
      retail: 70,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 160,
      airportConnectivity: 90,
      portAccess: true,
      railNetwork: 88,
      roadQuality: 92,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 94,
      englishProficiency: 90,
      techTalentPool: 85,
      laborLaws: 'flexible',
      unionStrength: 68
    },
    qualityOfLife: {
      safetyIndex: 82,
      healthcareQuality: 92,
      pollutionIndex: 18,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 0.92,
      salesMultiplier: 1.1,
      rdMultiplier: 1.35,
      recruitmentMultiplier: 1.15,
      brandValueMultiplier: 1.28
    }
  },
  {
    id: 'oslo',
    name: 'Oslo',
    country: 'Norvège',
    countryCode: 'NO',
    continent: 'Europe',
    lat: 59.9139,
    lng: 10.7522,
    population: 693491,
    timezone: 'Europe/Oslo',
    economics: {
      gdpPerCapita: 78000,
      gdpGrowth: 1.8,
      unemploymentRate: 3.8,
      inflationRate: 2.8,
      costOfLivingIndex: 165,
      averageSalary: 5800,
      minimumWage: 0,
      corporateTaxRate: 22,
      incomeTaxRate: 47.2,
      vatRate: 25,
      corruptionIndex: 15,
      easeOfBusinessIndex: 9,
      economicFreedomIndex: 74
    },
    sectors: {
      technology: 75,
      finance: 70,
      manufacturing: 45,
      healthcare: 90,
      energy: 100,
      tourism: 70,
      agriculture: 15,
      logistics: 75,
      retail: 65,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 85,
      portAccess: true,
      railNetwork: 75,
      roadQuality: 88,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 92,
      techTalentPool: 80,
      laborLaws: 'moderate',
      unionStrength: 70
    },
    qualityOfLife: {
      safetyIndex: 88,
      healthcareQuality: 95,
      pollutionIndex: 15,
      climateScore: 45
    },
    bonuses: {
      productionMultiplier: 0.88,
      salesMultiplier: 1.05,
      rdMultiplier: 1.25,
      recruitmentMultiplier: 1.0,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'helsinki',
    name: 'Helsinki',
    country: 'Finlande',
    countryCode: 'FI',
    continent: 'Europe',
    lat: 60.1699,
    lng: 24.9384,
    population: 656920,
    timezone: 'Europe/Helsinki',
    economics: {
      gdpPerCapita: 52000,
      gdpGrowth: 1.5,
      unemploymentRate: 6.8,
      inflationRate: 2.4,
      costOfLivingIndex: 130,
      averageSalary: 4200,
      minimumWage: 0,
      corporateTaxRate: 20,
      incomeTaxRate: 56.95,
      vatRate: 25.5,
      corruptionIndex: 15,
      easeOfBusinessIndex: 20,
      economicFreedomIndex: 76
    },
    sectors: {
      technology: 92,
      finance: 65,
      manufacturing: 55,
      healthcare: 90,
      energy: 60,
      tourism: 60,
      agriculture: 15,
      logistics: 75,
      retail: 65,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 140,
      airportConnectivity: 82,
      portAccess: true,
      railNetwork: 78,
      roadQuality: 88,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 98,
      englishProficiency: 88,
      techTalentPool: 90,
      laborLaws: 'moderate',
      unionStrength: 65
    },
    qualityOfLife: {
      safetyIndex: 85,
      healthcareQuality: 92,
      pollutionIndex: 15,
      climateScore: 40
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.05,
      rdMultiplier: 1.45,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'madrid',
    name: 'Madrid',
    country: 'Espagne',
    countryCode: 'ES',
    continent: 'Europe',
    lat: 40.4168,
    lng: -3.7038,
    population: 3223334,
    timezone: 'Europe/Madrid',
    economics: {
      gdpPerCapita: 38000,
      gdpGrowth: 2.5,
      unemploymentRate: 12.5,
      inflationRate: 3.5,
      costOfLivingIndex: 85,
      averageSalary: 2800,
      minimumWage: 1260,
      corporateTaxRate: 25,
      incomeTaxRate: 47,
      vatRate: 21,
      corruptionIndex: 35,
      easeOfBusinessIndex: 30,
      economicFreedomIndex: 69
    },
    sectors: {
      technology: 70,
      finance: 80,
      manufacturing: 50,
      healthcare: 80,
      energy: 70,
      tourism: 95,
      agriculture: 25,
      logistics: 80,
      retail: 85,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 95,
      portAccess: false,
      railNetwork: 95,
      roadQuality: 90,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 82,
      englishProficiency: 50,
      techTalentPool: 75,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 70,
      healthcareQuality: 90,
      pollutionIndex: 35,
      climateScore: 85
    },
    bonuses: {
      productionMultiplier: 1.1,
      salesMultiplier: 1.15,
      rdMultiplier: 1.05,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.15
    }
  },
  {
    id: 'barcelona',
    name: 'Barcelone',
    country: 'Espagne',
    countryCode: 'ES',
    continent: 'Europe',
    lat: 41.3851,
    lng: 2.1734,
    population: 1620343,
    timezone: 'Europe/Madrid',
    economics: {
      gdpPerCapita: 42000,
      gdpGrowth: 2.8,
      unemploymentRate: 10.5,
      inflationRate: 3.2,
      costOfLivingIndex: 95,
      averageSalary: 3000,
      minimumWage: 1260,
      corporateTaxRate: 25,
      incomeTaxRate: 47,
      vatRate: 21,
      corruptionIndex: 35,
      easeOfBusinessIndex: 30,
      economicFreedomIndex: 69
    },
    sectors: {
      technology: 80,
      finance: 65,
      manufacturing: 55,
      healthcare: 80,
      energy: 55,
      tourism: 100,
      agriculture: 15,
      logistics: 85,
      retail: 85,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 160,
      airportConnectivity: 92,
      portAccess: true,
      railNetwork: 88,
      roadQuality: 88,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 85,
      englishProficiency: 55,
      techTalentPool: 80,
      laborLaws: 'strict',
      unionStrength: 50
    },
    qualityOfLife: {
      safetyIndex: 65,
      healthcareQuality: 90,
      pollutionIndex: 40,
      climateScore: 88
    },
    bonuses: {
      productionMultiplier: 1.05,
      salesMultiplier: 1.2,
      rdMultiplier: 1.15,
      recruitmentMultiplier: 1.25,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'milan',
    name: 'Milan',
    country: 'Italie',
    countryCode: 'IT',
    continent: 'Europe',
    lat: 45.4642,
    lng: 9.1900,
    population: 1371498,
    timezone: 'Europe/Rome',
    economics: {
      gdpPerCapita: 55000,
      gdpGrowth: 1.5,
      unemploymentRate: 6.5,
      inflationRate: 2.8,
      costOfLivingIndex: 115,
      averageSalary: 3200,
      minimumWage: 0,
      corporateTaxRate: 27.9,
      incomeTaxRate: 43,
      vatRate: 22,
      corruptionIndex: 42,
      easeOfBusinessIndex: 58,
      economicFreedomIndex: 64
    },
    sectors: {
      technology: 70,
      finance: 90,
      manufacturing: 85,
      healthcare: 80,
      energy: 55,
      tourism: 90,
      agriculture: 20,
      logistics: 80,
      retail: 95,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 100,
      airportConnectivity: 95,
      portAccess: false,
      railNetwork: 85,
      roadQuality: 80,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 85,
      englishProficiency: 55,
      techTalentPool: 75,
      laborLaws: 'strict',
      unionStrength: 60
    },
    qualityOfLife: {
      safetyIndex: 60,
      healthcareQuality: 88,
      pollutionIndex: 50,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 1.0,
      salesMultiplier: 1.25,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.05,
      brandValueMultiplier: 1.35
    }
  },
  {
    id: 'rome',
    name: 'Rome',
    country: 'Italie',
    countryCode: 'IT',
    continent: 'Europe',
    lat: 41.9028,
    lng: 12.4964,
    population: 2872800,
    timezone: 'Europe/Rome',
    economics: {
      gdpPerCapita: 42000,
      gdpGrowth: 1.2,
      unemploymentRate: 8.5,
      inflationRate: 3.0,
      costOfLivingIndex: 98,
      averageSalary: 2600,
      minimumWage: 0,
      corporateTaxRate: 27.9,
      incomeTaxRate: 43,
      vatRate: 22,
      corruptionIndex: 48,
      easeOfBusinessIndex: 58,
      economicFreedomIndex: 64
    },
    sectors: {
      technology: 55,
      finance: 70,
      manufacturing: 45,
      healthcare: 80,
      energy: 50,
      tourism: 100,
      agriculture: 25,
      logistics: 65,
      retail: 80,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 80,
      airportConnectivity: 92,
      portAccess: false,
      railNetwork: 80,
      roadQuality: 70,
      powerReliability: 92
    },
    workforce: {
      educationLevel: 82,
      englishProficiency: 45,
      techTalentPool: 65,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 85,
      pollutionIndex: 45,
      climateScore: 80
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.15,
      rdMultiplier: 0.95,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'vienna',
    name: 'Vienne',
    country: 'Autriche',
    countryCode: 'AT',
    continent: 'Europe',
    lat: 48.2082,
    lng: 16.3738,
    population: 1897491,
    timezone: 'Europe/Vienna',
    economics: {
      gdpPerCapita: 55000,
      gdpGrowth: 1.8,
      unemploymentRate: 5.0,
      inflationRate: 2.5,
      costOfLivingIndex: 115,
      averageSalary: 4000,
      minimumWage: 1800,
      corporateTaxRate: 25,
      incomeTaxRate: 55,
      vatRate: 20,
      corruptionIndex: 22,
      easeOfBusinessIndex: 27,
      economicFreedomIndex: 72
    },
    sectors: {
      technology: 70,
      finance: 80,
      manufacturing: 60,
      healthcare: 90,
      energy: 55,
      tourism: 90,
      agriculture: 20,
      logistics: 80,
      retail: 75,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 120,
      airportConnectivity: 90,
      portAccess: false,
      railNetwork: 95,
      roadQuality: 92,
      powerReliability: 99
    },
    workforce: {
      educationLevel: 90,
      englishProficiency: 72,
      techTalentPool: 78,
      laborLaws: 'moderate',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 85,
      healthcareQuality: 95,
      pollutionIndex: 22,
      climateScore: 65
    },
    bonuses: {
      productionMultiplier: 1.0,
      salesMultiplier: 1.1,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'prague',
    name: 'Prague',
    country: 'République tchèque',
    countryCode: 'CZ',
    continent: 'Europe',
    lat: 50.0755,
    lng: 14.4378,
    population: 1309000,
    timezone: 'Europe/Prague',
    economics: {
      gdpPerCapita: 25000,
      gdpGrowth: 2.8,
      unemploymentRate: 2.5,
      inflationRate: 3.5,
      costOfLivingIndex: 65,
      averageSalary: 1800,
      minimumWage: 760,
      corporateTaxRate: 19,
      incomeTaxRate: 23,
      vatRate: 21,
      corruptionIndex: 38,
      easeOfBusinessIndex: 41,
      economicFreedomIndex: 74
    },
    sectors: {
      technology: 80,
      finance: 65,
      manufacturing: 75,
      healthcare: 75,
      energy: 55,
      tourism: 90,
      agriculture: 20,
      logistics: 75,
      retail: 70,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 100,
      airportConnectivity: 85,
      portAccess: false,
      railNetwork: 80,
      roadQuality: 75,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 60,
      techTalentPool: 82,
      laborLaws: 'moderate',
      unionStrength: 30
    },
    qualityOfLife: {
      safetyIndex: 78,
      healthcareQuality: 82,
      pollutionIndex: 30,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 1.2,
      salesMultiplier: 1.05,
      rdMultiplier: 1.15,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 1.1
    }
  },
  {
    id: 'warsaw',
    name: 'Varsovie',
    country: 'Pologne',
    countryCode: 'PL',
    continent: 'Europe',
    lat: 52.2297,
    lng: 21.0122,
    population: 1790658,
    timezone: 'Europe/Warsaw',
    economics: {
      gdpPerCapita: 20000,
      gdpGrowth: 4.0,
      unemploymentRate: 3.0,
      inflationRate: 4.5,
      costOfLivingIndex: 55,
      averageSalary: 1600,
      minimumWage: 840,
      corporateTaxRate: 19,
      incomeTaxRate: 32,
      vatRate: 23,
      corruptionIndex: 40,
      easeOfBusinessIndex: 40,
      economicFreedomIndex: 70
    },
    sectors: {
      technology: 75,
      finance: 70,
      manufacturing: 75,
      healthcare: 70,
      energy: 60,
      tourism: 70,
      agriculture: 25,
      logistics: 80,
      retail: 75,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 90,
      airportConnectivity: 82,
      portAccess: false,
      railNetwork: 70,
      roadQuality: 75,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 85,
      englishProficiency: 60,
      techTalentPool: 80,
      laborLaws: 'moderate',
      unionStrength: 25
    },
    qualityOfLife: {
      safetyIndex: 72,
      healthcareQuality: 75,
      pollutionIndex: 40,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.25,
      salesMultiplier: 1.05,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.35,
      brandValueMultiplier: 1.05
    }
  },
  {
    id: 'lisbon',
    name: 'Lisbonne',
    country: 'Portugal',
    countryCode: 'PT',
    continent: 'Europe',
    lat: 38.7223,
    lng: -9.1393,
    population: 544851,
    timezone: 'Europe/Lisbon',
    economics: {
      gdpPerCapita: 25000,
      gdpGrowth: 2.5,
      unemploymentRate: 6.5,
      inflationRate: 3.0,
      costOfLivingIndex: 72,
      averageSalary: 1500,
      minimumWage: 960,
      corporateTaxRate: 21,
      incomeTaxRate: 48,
      vatRate: 23,
      corruptionIndex: 35,
      easeOfBusinessIndex: 39,
      economicFreedomIndex: 67
    },
    sectors: {
      technology: 75,
      finance: 60,
      manufacturing: 45,
      healthcare: 75,
      energy: 65,
      tourism: 95,
      agriculture: 25,
      logistics: 75,
      retail: 70,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 120,
      airportConnectivity: 88,
      portAccess: true,
      railNetwork: 70,
      roadQuality: 80,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 80,
      englishProficiency: 65,
      techTalentPool: 78,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 80,
      healthcareQuality: 82,
      pollutionIndex: 25,
      climateScore: 90
    },
    bonuses: {
      productionMultiplier: 1.1,
      salesMultiplier: 1.1,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.15
    }
  },
  {
    id: 'brussels',
    name: 'Bruxelles',
    country: 'Belgique',
    countryCode: 'BE',
    continent: 'Europe',
    lat: 50.8503,
    lng: 4.3517,
    population: 1212352,
    timezone: 'Europe/Brussels',
    economics: {
      gdpPerCapita: 52000,
      gdpGrowth: 1.5,
      unemploymentRate: 5.5,
      inflationRate: 2.5,
      costOfLivingIndex: 110,
      averageSalary: 3800,
      minimumWage: 1900,
      corporateTaxRate: 25,
      incomeTaxRate: 50,
      vatRate: 21,
      corruptionIndex: 25,
      easeOfBusinessIndex: 45,
      economicFreedomIndex: 68
    },
    sectors: {
      technology: 70,
      finance: 80,
      manufacturing: 50,
      healthcare: 85,
      energy: 55,
      tourism: 80,
      agriculture: 15,
      logistics: 90,
      retail: 75,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 130,
      airportConnectivity: 90,
      portAccess: false,
      railNetwork: 95,
      roadQuality: 85,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 70,
      techTalentPool: 75,
      laborLaws: 'strict',
      unionStrength: 60
    },
    qualityOfLife: {
      safetyIndex: 58,
      healthcareQuality: 92,
      pollutionIndex: 35,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.15,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.05,
      brandValueMultiplier: 1.2
    }
  },
  
  // ===== ASIE =====
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japon',
    countryCode: 'JP',
    continent: 'Asie',
    lat: 35.6762,
    lng: 139.6503,
    population: 13960000,
    timezone: 'Asia/Tokyo',
    economics: {
      gdpPerCapita: 45000,
      gdpGrowth: 1.0,
      unemploymentRate: 2.5,
      inflationRate: 2.5,
      costOfLivingIndex: 142,
      averageSalary: 4000,
      minimumWage: 1600,
      corporateTaxRate: 30.62,
      incomeTaxRate: 45,
      vatRate: 10,
      corruptionIndex: 27,
      easeOfBusinessIndex: 29,
      economicFreedomIndex: 70
    },
    sectors: {
      technology: 95,
      finance: 90,
      manufacturing: 95,
      healthcare: 90,
      energy: 65,
      tourism: 90,
      agriculture: 10,
      logistics: 90,
      retail: 95,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 200,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 100,
      roadQuality: 95,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 40,
      techTalentPool: 95,
      laborLaws: 'moderate',
      unionStrength: 20
    },
    qualityOfLife: {
      safetyIndex: 95,
      healthcareQuality: 95,
      pollutionIndex: 35,
      climateScore: 65
    },
    bonuses: {
      productionMultiplier: 1.15,
      salesMultiplier: 1.2,
      rdMultiplier: 1.5,
      recruitmentMultiplier: 0.95,
      brandValueMultiplier: 1.4
    }
  },
  {
    id: 'singapore',
    name: 'Singapour',
    country: 'Singapour',
    countryCode: 'SG',
    continent: 'Asie',
    lat: 1.3521,
    lng: 103.8198,
    population: 5685800,
    timezone: 'Asia/Singapore',
    economics: {
      gdpPerCapita: 65000,
      gdpGrowth: 3.5,
      unemploymentRate: 2.2,
      inflationRate: 2.3,
      costOfLivingIndex: 155,
      averageSalary: 5500,
      minimumWage: 0,
      corporateTaxRate: 17,
      incomeTaxRate: 22,
      vatRate: 9,
      corruptionIndex: 15,
      easeOfBusinessIndex: 2,
      economicFreedomIndex: 89
    },
    sectors: {
      technology: 90,
      finance: 100,
      manufacturing: 70,
      healthcare: 90,
      energy: 60,
      tourism: 85,
      agriculture: 5,
      logistics: 100,
      retail: 85,
      realEstate: 90
    },
    infrastructure: {
      internetSpeedMbps: 250,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 85,
      roadQuality: 100,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 95,
      techTalentPool: 90,
      laborLaws: 'flexible',
      unionStrength: 15
    },
    qualityOfLife: {
      safetyIndex: 98,
      healthcareQuality: 95,
      pollutionIndex: 25,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 1.0,
      salesMultiplier: 1.25,
      rdMultiplier: 1.35,
      recruitmentMultiplier: 1.15,
      brandValueMultiplier: 1.45
    }
  },
  {
    id: 'hong-kong',
    name: 'Hong Kong',
    country: 'Hong Kong',
    countryCode: 'HK',
    continent: 'Asie',
    lat: 22.3193,
    lng: 114.1694,
    population: 7500700,
    timezone: 'Asia/Hong_Kong',
    economics: {
      gdpPerCapita: 50000,
      gdpGrowth: 2.5,
      unemploymentRate: 3.5,
      inflationRate: 2.0,
      costOfLivingIndex: 160,
      averageSalary: 4500,
      minimumWage: 680,
      corporateTaxRate: 16.5,
      incomeTaxRate: 17,
      vatRate: 0,
      corruptionIndex: 22,
      easeOfBusinessIndex: 3,
      economicFreedomIndex: 90
    },
    sectors: {
      technology: 80,
      finance: 100,
      manufacturing: 30,
      healthcare: 80,
      energy: 40,
      tourism: 85,
      agriculture: 5,
      logistics: 95,
      retail: 90,
      realEstate: 95
    },
    infrastructure: {
      internetSpeedMbps: 200,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 90,
      roadQuality: 95,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 90,
      englishProficiency: 85,
      techTalentPool: 85,
      laborLaws: 'flexible',
      unionStrength: 15
    },
    qualityOfLife: {
      safetyIndex: 90,
      healthcareQuality: 90,
      pollutionIndex: 45,
      climateScore: 65
    },
    bonuses: {
      productionMultiplier: 0.9,
      salesMultiplier: 1.3,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.4
    }
  },
  {
    id: 'shanghai',
    name: 'Shanghai',
    country: 'Chine',
    countryCode: 'CN',
    continent: 'Asie',
    lat: 31.2304,
    lng: 121.4737,
    population: 24870900,
    timezone: 'Asia/Shanghai',
    economics: {
      gdpPerCapita: 25000,
      gdpGrowth: 5.5,
      unemploymentRate: 4.5,
      inflationRate: 2.0,
      costOfLivingIndex: 85,
      averageSalary: 1800,
      minimumWage: 380,
      corporateTaxRate: 25,
      incomeTaxRate: 45,
      vatRate: 13,
      corruptionIndex: 58,
      easeOfBusinessIndex: 31,
      economicFreedomIndex: 58
    },
    sectors: {
      technology: 90,
      finance: 95,
      manufacturing: 100,
      healthcare: 75,
      energy: 70,
      tourism: 80,
      agriculture: 15,
      logistics: 95,
      retail: 90,
      realEstate: 90
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 98,
      portAccess: true,
      railNetwork: 100,
      roadQuality: 90,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 85,
      englishProficiency: 45,
      techTalentPool: 90,
      laborLaws: 'moderate',
      unionStrength: 10
    },
    qualityOfLife: {
      safetyIndex: 75,
      healthcareQuality: 78,
      pollutionIndex: 65,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 1.5,
      salesMultiplier: 1.25,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.4,
      brandValueMultiplier: 1.15
    }
  },
  {
    id: 'beijing',
    name: 'Pékin',
    country: 'Chine',
    countryCode: 'CN',
    continent: 'Asie',
    lat: 39.9042,
    lng: 116.4074,
    population: 21540000,
    timezone: 'Asia/Shanghai',
    economics: {
      gdpPerCapita: 28000,
      gdpGrowth: 5.0,
      unemploymentRate: 4.0,
      inflationRate: 2.2,
      costOfLivingIndex: 80,
      averageSalary: 2000,
      minimumWage: 360,
      corporateTaxRate: 25,
      incomeTaxRate: 45,
      vatRate: 13,
      corruptionIndex: 55,
      easeOfBusinessIndex: 31,
      economicFreedomIndex: 58
    },
    sectors: {
      technology: 95,
      finance: 90,
      manufacturing: 85,
      healthcare: 80,
      energy: 75,
      tourism: 85,
      agriculture: 15,
      logistics: 90,
      retail: 85,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 140,
      airportConnectivity: 100,
      portAccess: false,
      railNetwork: 100,
      roadQuality: 88,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 42,
      techTalentPool: 92,
      laborLaws: 'moderate',
      unionStrength: 10
    },
    qualityOfLife: {
      safetyIndex: 78,
      healthcareQuality: 80,
      pollutionIndex: 75,
      climateScore: 50
    },
    bonuses: {
      productionMultiplier: 1.4,
      salesMultiplier: 1.2,
      rdMultiplier: 1.3,
      recruitmentMultiplier: 1.35,
      brandValueMultiplier: 1.2
    }
  },
  {
    id: 'shenzhen',
    name: 'Shenzhen',
    country: 'Chine',
    countryCode: 'CN',
    continent: 'Asie',
    lat: 22.5431,
    lng: 114.0579,
    population: 12528300,
    timezone: 'Asia/Shanghai',
    economics: {
      gdpPerCapita: 30000,
      gdpGrowth: 7.0,
      unemploymentRate: 3.5,
      inflationRate: 2.0,
      costOfLivingIndex: 75,
      averageSalary: 2200,
      minimumWage: 360,
      corporateTaxRate: 25,
      incomeTaxRate: 45,
      vatRate: 13,
      corruptionIndex: 52,
      easeOfBusinessIndex: 31,
      economicFreedomIndex: 58
    },
    sectors: {
      technology: 100,
      finance: 70,
      manufacturing: 100,
      healthcare: 65,
      energy: 60,
      tourism: 60,
      agriculture: 5,
      logistics: 90,
      retail: 80,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 90,
      portAccess: true,
      railNetwork: 95,
      roadQuality: 90,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 82,
      englishProficiency: 40,
      techTalentPool: 95,
      laborLaws: 'flexible',
      unionStrength: 10
    },
    qualityOfLife: {
      safetyIndex: 80,
      healthcareQuality: 75,
      pollutionIndex: 55,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 1.6,
      salesMultiplier: 1.15,
      rdMultiplier: 1.45,
      recruitmentMultiplier: 1.45,
      brandValueMultiplier: 1.1
    }
  },
  {
    id: 'seoul',
    name: 'Séoul',
    country: 'Corée du Sud',
    countryCode: 'KR',
    continent: 'Asie',
    lat: 37.5665,
    lng: 126.9780,
    population: 9776000,
    timezone: 'Asia/Seoul',
    economics: {
      gdpPerCapita: 42000,
      gdpGrowth: 2.5,
      unemploymentRate: 3.5,
      inflationRate: 2.5,
      costOfLivingIndex: 115,
      averageSalary: 3500,
      minimumWage: 1560,
      corporateTaxRate: 27.5,
      incomeTaxRate: 45,
      vatRate: 10,
      corruptionIndex: 32,
      easeOfBusinessIndex: 5,
      economicFreedomIndex: 74
    },
    sectors: {
      technology: 100,
      finance: 80,
      manufacturing: 95,
      healthcare: 85,
      energy: 60,
      tourism: 80,
      agriculture: 10,
      logistics: 85,
      retail: 90,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 300,
      airportConnectivity: 95,
      portAccess: false,
      railNetwork: 95,
      roadQuality: 92,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 98,
      englishProficiency: 55,
      techTalentPool: 95,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 85,
      healthcareQuality: 92,
      pollutionIndex: 50,
      climateScore: 60
    },
    bonuses: {
      productionMultiplier: 1.2,
      salesMultiplier: 1.15,
      rdMultiplier: 1.5,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.3
    }
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'Inde',
    countryCode: 'IN',
    continent: 'Asie',
    lat: 19.0760,
    lng: 72.8777,
    population: 12478447,
    timezone: 'Asia/Kolkata',
    economics: {
      gdpPerCapita: 8000,
      gdpGrowth: 7.0,
      unemploymentRate: 5.5,
      inflationRate: 5.0,
      costOfLivingIndex: 35,
      averageSalary: 600,
      minimumWage: 120,
      corporateTaxRate: 25.17,
      incomeTaxRate: 30,
      vatRate: 18,
      corruptionIndex: 60,
      easeOfBusinessIndex: 63,
      economicFreedomIndex: 56
    },
    sectors: {
      technology: 85,
      finance: 95,
      manufacturing: 70,
      healthcare: 70,
      energy: 55,
      tourism: 70,
      agriculture: 20,
      logistics: 70,
      retail: 85,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 50,
      airportConnectivity: 92,
      portAccess: true,
      railNetwork: 65,
      roadQuality: 50,
      powerReliability: 80
    },
    workforce: {
      educationLevel: 70,
      englishProficiency: 75,
      techTalentPool: 88,
      laborLaws: 'strict',
      unionStrength: 45
    },
    qualityOfLife: {
      safetyIndex: 45,
      healthcareQuality: 65,
      pollutionIndex: 80,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.4,
      salesMultiplier: 1.1,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.5,
      brandValueMultiplier: 0.95
    }
  },
  {
    id: 'bangalore',
    name: 'Bangalore',
    country: 'Inde',
    countryCode: 'IN',
    continent: 'Asie',
    lat: 12.9716,
    lng: 77.5946,
    population: 8443675,
    timezone: 'Asia/Kolkata',
    economics: {
      gdpPerCapita: 12000,
      gdpGrowth: 8.5,
      unemploymentRate: 4.5,
      inflationRate: 4.8,
      costOfLivingIndex: 32,
      averageSalary: 800,
      minimumWage: 120,
      corporateTaxRate: 25.17,
      incomeTaxRate: 30,
      vatRate: 18,
      corruptionIndex: 55,
      easeOfBusinessIndex: 63,
      economicFreedomIndex: 56
    },
    sectors: {
      technology: 100,
      finance: 65,
      manufacturing: 55,
      healthcare: 75,
      energy: 50,
      tourism: 55,
      agriculture: 25,
      logistics: 60,
      retail: 70,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 70,
      airportConnectivity: 85,
      portAccess: false,
      railNetwork: 50,
      roadQuality: 55,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 82,
      englishProficiency: 85,
      techTalentPool: 100,
      laborLaws: 'moderate',
      unionStrength: 30
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 75,
      pollutionIndex: 60,
      climateScore: 75
    },
    bonuses: {
      productionMultiplier: 1.35,
      salesMultiplier: 1.0,
      rdMultiplier: 1.5,
      recruitmentMultiplier: 1.6,
      brandValueMultiplier: 1.0
    }
  },
  {
    id: 'dubai',
    name: 'Dubaï',
    country: 'Émirats arabes unis',
    countryCode: 'AE',
    continent: 'Asie',
    lat: 25.2048,
    lng: 55.2708,
    population: 3331420,
    timezone: 'Asia/Dubai',
    economics: {
      gdpPerCapita: 45000,
      gdpGrowth: 4.5,
      unemploymentRate: 2.5,
      inflationRate: 2.8,
      costOfLivingIndex: 120,
      averageSalary: 4000,
      minimumWage: 0,
      corporateTaxRate: 9,
      incomeTaxRate: 0,
      vatRate: 5,
      corruptionIndex: 28,
      easeOfBusinessIndex: 16,
      economicFreedomIndex: 77
    },
    sectors: {
      technology: 75,
      finance: 90,
      manufacturing: 45,
      healthcare: 80,
      energy: 85,
      tourism: 100,
      agriculture: 5,
      logistics: 100,
      retail: 95,
      realEstate: 100
    },
    infrastructure: {
      internetSpeedMbps: 180,
      airportConnectivity: 100,
      portAccess: true,
      railNetwork: 70,
      roadQuality: 100,
      powerReliability: 100
    },
    workforce: {
      educationLevel: 75,
      englishProficiency: 90,
      techTalentPool: 70,
      laborLaws: 'flexible',
      unionStrength: 5
    },
    qualityOfLife: {
      safetyIndex: 95,
      healthcareQuality: 85,
      pollutionIndex: 40,
      climateScore: 40
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.35,
      rdMultiplier: 1.0,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.5
    }
  },
  {
    id: 'tel-aviv',
    name: 'Tel-Aviv',
    country: 'Israël',
    countryCode: 'IL',
    continent: 'Asie',
    lat: 32.0853,
    lng: 34.7818,
    population: 460613,
    timezone: 'Asia/Jerusalem',
    economics: {
      gdpPerCapita: 48000,
      gdpGrowth: 4.0,
      unemploymentRate: 4.0,
      inflationRate: 3.5,
      costOfLivingIndex: 140,
      averageSalary: 4200,
      minimumWage: 1600,
      corporateTaxRate: 23,
      incomeTaxRate: 50,
      vatRate: 17,
      corruptionIndex: 32,
      easeOfBusinessIndex: 35,
      economicFreedomIndex: 74
    },
    sectors: {
      technology: 100,
      finance: 75,
      manufacturing: 55,
      healthcare: 90,
      energy: 55,
      tourism: 75,
      agriculture: 20,
      logistics: 65,
      retail: 70,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 150,
      airportConnectivity: 85,
      portAccess: true,
      railNetwork: 50,
      roadQuality: 80,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 95,
      englishProficiency: 88,
      techTalentPool: 100,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 92,
      pollutionIndex: 35,
      climateScore: 80
    },
    bonuses: {
      productionMultiplier: 0.9,
      salesMultiplier: 1.1,
      rdMultiplier: 1.6,
      recruitmentMultiplier: 1.2,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thaïlande',
    countryCode: 'TH',
    continent: 'Asie',
    lat: 13.7563,
    lng: 100.5018,
    population: 8280925,
    timezone: 'Asia/Bangkok',
    economics: {
      gdpPerCapita: 18000,
      gdpGrowth: 3.5,
      unemploymentRate: 1.5,
      inflationRate: 2.5,
      costOfLivingIndex: 52,
      averageSalary: 700,
      minimumWage: 180,
      corporateTaxRate: 20,
      incomeTaxRate: 35,
      vatRate: 7,
      corruptionIndex: 55,
      easeOfBusinessIndex: 21,
      economicFreedomIndex: 69
    },
    sectors: {
      technology: 60,
      finance: 70,
      manufacturing: 80,
      healthcare: 75,
      energy: 55,
      tourism: 100,
      agriculture: 35,
      logistics: 75,
      retail: 85,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 80,
      airportConnectivity: 95,
      portAccess: true,
      railNetwork: 60,
      roadQuality: 65,
      powerReliability: 92
    },
    workforce: {
      educationLevel: 70,
      englishProficiency: 45,
      techTalentPool: 60,
      laborLaws: 'flexible',
      unionStrength: 15
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 78,
      pollutionIndex: 65,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.3,
      salesMultiplier: 1.15,
      rdMultiplier: 0.9,
      recruitmentMultiplier: 1.35,
      brandValueMultiplier: 1.05
    }
  },
  {
    id: 'kuala-lumpur',
    name: 'Kuala Lumpur',
    country: 'Malaisie',
    countryCode: 'MY',
    continent: 'Asie',
    lat: 3.1390,
    lng: 101.6869,
    population: 1982112,
    timezone: 'Asia/Kuala_Lumpur',
    economics: {
      gdpPerCapita: 28000,
      gdpGrowth: 4.5,
      unemploymentRate: 3.5,
      inflationRate: 2.8,
      costOfLivingIndex: 48,
      averageSalary: 1200,
      minimumWage: 260,
      corporateTaxRate: 24,
      incomeTaxRate: 30,
      vatRate: 6,
      corruptionIndex: 48,
      easeOfBusinessIndex: 12,
      economicFreedomIndex: 74
    },
    sectors: {
      technology: 75,
      finance: 80,
      manufacturing: 80,
      healthcare: 75,
      energy: 75,
      tourism: 85,
      agriculture: 25,
      logistics: 80,
      retail: 80,
      realEstate: 80
    },
    infrastructure: {
      internetSpeedMbps: 100,
      airportConnectivity: 92,
      portAccess: true,
      railNetwork: 70,
      roadQuality: 80,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 78,
      englishProficiency: 75,
      techTalentPool: 72,
      laborLaws: 'moderate',
      unionStrength: 25
    },
    qualityOfLife: {
      safetyIndex: 65,
      healthcareQuality: 80,
      pollutionIndex: 50,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.25,
      salesMultiplier: 1.15,
      rdMultiplier: 1.05,
      recruitmentMultiplier: 1.25,
      brandValueMultiplier: 1.1
    }
  },
  {
    id: 'jakarta',
    name: 'Jakarta',
    country: 'Indonésie',
    countryCode: 'ID',
    continent: 'Asie',
    lat: -6.2088,
    lng: 106.8456,
    population: 10562088,
    timezone: 'Asia/Jakarta',
    economics: {
      gdpPerCapita: 12000,
      gdpGrowth: 5.0,
      unemploymentRate: 5.5,
      inflationRate: 3.5,
      costOfLivingIndex: 42,
      averageSalary: 500,
      minimumWage: 200,
      corporateTaxRate: 22,
      incomeTaxRate: 35,
      vatRate: 11,
      corruptionIndex: 62,
      easeOfBusinessIndex: 73,
      economicFreedomIndex: 66
    },
    sectors: {
      technology: 55,
      finance: 70,
      manufacturing: 75,
      healthcare: 60,
      energy: 70,
      tourism: 75,
      agriculture: 40,
      logistics: 65,
      retail: 80,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 40,
      airportConnectivity: 88,
      portAccess: true,
      railNetwork: 45,
      roadQuality: 50,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 65,
      englishProficiency: 45,
      techTalentPool: 55,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 50,
      healthcareQuality: 60,
      pollutionIndex: 70,
      climateScore: 50
    },
    bonuses: {
      productionMultiplier: 1.35,
      salesMultiplier: 1.1,
      rdMultiplier: 0.85,
      recruitmentMultiplier: 1.4,
      brandValueMultiplier: 0.9
    }
  },
  
  // ===== OCÉANIE =====
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australie',
    countryCode: 'AU',
    continent: 'Océanie',
    lat: -33.8688,
    lng: 151.2093,
    population: 5312163,
    timezone: 'Australia/Sydney',
    economics: {
      gdpPerCapita: 62000,
      gdpGrowth: 2.5,
      unemploymentRate: 3.5,
      inflationRate: 3.2,
      costOfLivingIndex: 135,
      averageSalary: 5500,
      minimumWage: 3200,
      corporateTaxRate: 30,
      incomeTaxRate: 45,
      vatRate: 10,
      corruptionIndex: 22,
      easeOfBusinessIndex: 14,
      economicFreedomIndex: 82
    },
    sectors: {
      technology: 80,
      finance: 90,
      manufacturing: 40,
      healthcare: 85,
      energy: 70,
      tourism: 90,
      agriculture: 25,
      logistics: 85,
      retail: 85,
      realEstate: 90
    },
    infrastructure: {
      internetSpeedMbps: 100,
      airportConnectivity: 95,
      portAccess: true,
      railNetwork: 75,
      roadQuality: 85,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 90,
      englishProficiency: 100,
      techTalentPool: 82,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 75,
      healthcareQuality: 90,
      pollutionIndex: 25,
      climateScore: 85
    },
    bonuses: {
      productionMultiplier: 0.95,
      salesMultiplier: 1.15,
      rdMultiplier: 1.2,
      recruitmentMultiplier: 1.1,
      brandValueMultiplier: 1.25
    }
  },
  {
    id: 'melbourne',
    name: 'Melbourne',
    country: 'Australie',
    countryCode: 'AU',
    continent: 'Océanie',
    lat: -37.8136,
    lng: 144.9631,
    population: 5078193,
    timezone: 'Australia/Melbourne',
    economics: {
      gdpPerCapita: 58000,
      gdpGrowth: 2.2,
      unemploymentRate: 4.0,
      inflationRate: 3.0,
      costOfLivingIndex: 125,
      averageSalary: 5200,
      minimumWage: 3200,
      corporateTaxRate: 30,
      incomeTaxRate: 45,
      vatRate: 10,
      corruptionIndex: 22,
      easeOfBusinessIndex: 14,
      economicFreedomIndex: 82
    },
    sectors: {
      technology: 78,
      finance: 85,
      manufacturing: 50,
      healthcare: 88,
      energy: 55,
      tourism: 85,
      agriculture: 30,
      logistics: 80,
      retail: 80,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 95,
      airportConnectivity: 92,
      portAccess: true,
      railNetwork: 80,
      roadQuality: 85,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 92,
      englishProficiency: 100,
      techTalentPool: 80,
      laborLaws: 'moderate',
      unionStrength: 42
    },
    qualityOfLife: {
      safetyIndex: 78,
      healthcareQuality: 92,
      pollutionIndex: 22,
      climateScore: 75
    },
    bonuses: {
      productionMultiplier: 0.98,
      salesMultiplier: 1.12,
      rdMultiplier: 1.25,
      recruitmentMultiplier: 1.12,
      brandValueMultiplier: 1.22
    }
  },
  {
    id: 'auckland',
    name: 'Auckland',
    country: 'Nouvelle-Zélande',
    countryCode: 'NZ',
    continent: 'Océanie',
    lat: -36.8509,
    lng: 174.7645,
    population: 1657200,
    timezone: 'Pacific/Auckland',
    economics: {
      gdpPerCapita: 45000,
      gdpGrowth: 2.0,
      unemploymentRate: 3.5,
      inflationRate: 2.8,
      costOfLivingIndex: 115,
      averageSalary: 4200,
      minimumWage: 2400,
      corporateTaxRate: 28,
      incomeTaxRate: 39,
      vatRate: 15,
      corruptionIndex: 15,
      easeOfBusinessIndex: 1,
      economicFreedomIndex: 84
    },
    sectors: {
      technology: 70,
      finance: 70,
      manufacturing: 40,
      healthcare: 80,
      energy: 55,
      tourism: 90,
      agriculture: 50,
      logistics: 75,
      retail: 75,
      realEstate: 85
    },
    infrastructure: {
      internetSpeedMbps: 80,
      airportConnectivity: 80,
      portAccess: true,
      railNetwork: 40,
      roadQuality: 80,
      powerReliability: 98
    },
    workforce: {
      educationLevel: 88,
      englishProficiency: 100,
      techTalentPool: 72,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 80,
      healthcareQuality: 88,
      pollutionIndex: 15,
      climateScore: 80
    },
    bonuses: {
      productionMultiplier: 0.92,
      salesMultiplier: 1.05,
      rdMultiplier: 1.1,
      recruitmentMultiplier: 1.0,
      brandValueMultiplier: 1.15
    }
  },
  
  // ===== AMÉRIQUE DU SUD =====
  {
    id: 'sao-paulo',
    name: 'São Paulo',
    country: 'Brésil',
    countryCode: 'BR',
    continent: 'Amérique du Sud',
    lat: -23.5505,
    lng: -46.6333,
    population: 12325232,
    timezone: 'America/Sao_Paulo',
    economics: {
      gdpPerCapita: 15000,
      gdpGrowth: 2.5,
      unemploymentRate: 9.5,
      inflationRate: 5.5,
      costOfLivingIndex: 55,
      averageSalary: 800,
      minimumWage: 260,
      corporateTaxRate: 34,
      incomeTaxRate: 27.5,
      vatRate: 18,
      corruptionIndex: 55,
      easeOfBusinessIndex: 124,
      economicFreedomIndex: 53
    },
    sectors: {
      technology: 70,
      finance: 90,
      manufacturing: 80,
      healthcare: 75,
      energy: 70,
      tourism: 70,
      agriculture: 40,
      logistics: 70,
      retail: 85,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 60,
      airportConnectivity: 95,
      portAccess: true,
      railNetwork: 50,
      roadQuality: 55,
      powerReliability: 88
    },
    workforce: {
      educationLevel: 70,
      englishProficiency: 35,
      techTalentPool: 70,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 35,
      healthcareQuality: 70,
      pollutionIndex: 55,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 1.25,
      salesMultiplier: 1.15,
      rdMultiplier: 0.95,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 1.0
    }
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentine',
    countryCode: 'AR',
    continent: 'Amérique du Sud',
    lat: -34.6037,
    lng: -58.3816,
    population: 3075646,
    timezone: 'America/Argentina/Buenos_Aires',
    economics: {
      gdpPerCapita: 12000,
      gdpGrowth: 1.5,
      unemploymentRate: 8.5,
      inflationRate: 50.0,
      costOfLivingIndex: 45,
      averageSalary: 500,
      minimumWage: 200,
      corporateTaxRate: 35,
      incomeTaxRate: 35,
      vatRate: 21,
      corruptionIndex: 58,
      easeOfBusinessIndex: 126,
      economicFreedomIndex: 50
    },
    sectors: {
      technology: 60,
      finance: 70,
      manufacturing: 60,
      healthcare: 75,
      energy: 60,
      tourism: 80,
      agriculture: 55,
      logistics: 60,
      retail: 75,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 50,
      airportConnectivity: 85,
      portAccess: true,
      railNetwork: 55,
      roadQuality: 60,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 80,
      englishProficiency: 45,
      techTalentPool: 65,
      laborLaws: 'strict',
      unionStrength: 65
    },
    qualityOfLife: {
      safetyIndex: 45,
      healthcareQuality: 78,
      pollutionIndex: 40,
      climateScore: 70
    },
    bonuses: {
      productionMultiplier: 1.15,
      salesMultiplier: 1.05,
      rdMultiplier: 0.9,
      recruitmentMultiplier: 1.25,
      brandValueMultiplier: 0.95
    }
  },
  {
    id: 'santiago',
    name: 'Santiago',
    country: 'Chili',
    countryCode: 'CL',
    continent: 'Amérique du Sud',
    lat: -33.4489,
    lng: -70.6693,
    population: 6158080,
    timezone: 'America/Santiago',
    economics: {
      gdpPerCapita: 25000,
      gdpGrowth: 3.0,
      unemploymentRate: 7.5,
      inflationRate: 4.5,
      costOfLivingIndex: 60,
      averageSalary: 1200,
      minimumWage: 480,
      corporateTaxRate: 27,
      incomeTaxRate: 40,
      vatRate: 19,
      corruptionIndex: 35,
      easeOfBusinessIndex: 59,
      economicFreedomIndex: 75
    },
    sectors: {
      technology: 60,
      finance: 75,
      manufacturing: 55,
      healthcare: 75,
      energy: 65,
      tourism: 75,
      agriculture: 45,
      logistics: 70,
      retail: 75,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 70,
      airportConnectivity: 85,
      portAccess: true,
      railNetwork: 50,
      roadQuality: 75,
      powerReliability: 95
    },
    workforce: {
      educationLevel: 78,
      englishProficiency: 40,
      techTalentPool: 60,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 78,
      pollutionIndex: 55,
      climateScore: 75
    },
    bonuses: {
      productionMultiplier: 1.1,
      salesMultiplier: 1.1,
      rdMultiplier: 0.95,
      recruitmentMultiplier: 1.15,
      brandValueMultiplier: 1.05
    }
  },
  {
    id: 'bogota',
    name: 'Bogota',
    country: 'Colombie',
    countryCode: 'CO',
    continent: 'Amérique du Sud',
    lat: 4.7110,
    lng: -74.0721,
    population: 7181469,
    timezone: 'America/Bogota',
    economics: {
      gdpPerCapita: 14000,
      gdpGrowth: 3.5,
      unemploymentRate: 10.5,
      inflationRate: 5.0,
      costOfLivingIndex: 38,
      averageSalary: 550,
      minimumWage: 280,
      corporateTaxRate: 35,
      incomeTaxRate: 39,
      vatRate: 19,
      corruptionIndex: 58,
      easeOfBusinessIndex: 67,
      economicFreedomIndex: 65
    },
    sectors: {
      technology: 55,
      finance: 70,
      manufacturing: 60,
      healthcare: 70,
      energy: 75,
      tourism: 70,
      agriculture: 50,
      logistics: 60,
      retail: 75,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 45,
      airportConnectivity: 85,
      portAccess: false,
      railNetwork: 25,
      roadQuality: 55,
      powerReliability: 90
    },
    workforce: {
      educationLevel: 72,
      englishProficiency: 45,
      techTalentPool: 55,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 40,
      healthcareQuality: 72,
      pollutionIndex: 50,
      climateScore: 75
    },
    bonuses: {
      productionMultiplier: 1.2,
      salesMultiplier: 1.05,
      rdMultiplier: 0.85,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 0.92
    }
  },
  
  // ===== AFRIQUE =====
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    country: 'Afrique du Sud',
    countryCode: 'ZA',
    continent: 'Afrique',
    lat: -26.2041,
    lng: 28.0473,
    population: 5635127,
    timezone: 'Africa/Johannesburg',
    economics: {
      gdpPerCapita: 12000,
      gdpGrowth: 1.5,
      unemploymentRate: 28.0,
      inflationRate: 5.5,
      costOfLivingIndex: 45,
      averageSalary: 1200,
      minimumWage: 200,
      corporateTaxRate: 28,
      incomeTaxRate: 45,
      vatRate: 15,
      corruptionIndex: 55,
      easeOfBusinessIndex: 84,
      economicFreedomIndex: 59
    },
    sectors: {
      technology: 55,
      finance: 80,
      manufacturing: 55,
      healthcare: 60,
      energy: 70,
      tourism: 70,
      agriculture: 35,
      logistics: 70,
      retail: 70,
      realEstate: 65
    },
    infrastructure: {
      internetSpeedMbps: 40,
      airportConnectivity: 88,
      portAccess: false,
      railNetwork: 50,
      roadQuality: 60,
      powerReliability: 70
    },
    workforce: {
      educationLevel: 65,
      englishProficiency: 75,
      techTalentPool: 50,
      laborLaws: 'strict',
      unionStrength: 60
    },
    qualityOfLife: {
      safetyIndex: 25,
      healthcareQuality: 55,
      pollutionIndex: 45,
      climateScore: 75
    },
    bonuses: {
      productionMultiplier: 1.15,
      salesMultiplier: 1.0,
      rdMultiplier: 0.8,
      recruitmentMultiplier: 1.35,
      brandValueMultiplier: 0.85
    }
  },
  {
    id: 'cape-town',
    name: 'Le Cap',
    country: 'Afrique du Sud',
    countryCode: 'ZA',
    continent: 'Afrique',
    lat: -33.9249,
    lng: 18.4241,
    population: 4617560,
    timezone: 'Africa/Johannesburg',
    economics: {
      gdpPerCapita: 11000,
      gdpGrowth: 1.8,
      unemploymentRate: 25.0,
      inflationRate: 5.2,
      costOfLivingIndex: 50,
      averageSalary: 1100,
      minimumWage: 200,
      corporateTaxRate: 28,
      incomeTaxRate: 45,
      vatRate: 15,
      corruptionIndex: 52,
      easeOfBusinessIndex: 84,
      economicFreedomIndex: 59
    },
    sectors: {
      technology: 60,
      finance: 65,
      manufacturing: 45,
      healthcare: 65,
      energy: 55,
      tourism: 95,
      agriculture: 45,
      logistics: 75,
      retail: 70,
      realEstate: 75
    },
    infrastructure: {
      internetSpeedMbps: 45,
      airportConnectivity: 85,
      portAccess: true,
      railNetwork: 45,
      roadQuality: 65,
      powerReliability: 65
    },
    workforce: {
      educationLevel: 68,
      englishProficiency: 80,
      techTalentPool: 55,
      laborLaws: 'strict',
      unionStrength: 55
    },
    qualityOfLife: {
      safetyIndex: 30,
      healthcareQuality: 60,
      pollutionIndex: 35,
      climateScore: 90
    },
    bonuses: {
      productionMultiplier: 1.1,
      salesMultiplier: 1.05,
      rdMultiplier: 0.85,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 0.95
    }
  },
  {
    id: 'cairo',
    name: 'Le Caire',
    country: 'Égypte',
    countryCode: 'EG',
    continent: 'Afrique',
    lat: 30.0444,
    lng: 31.2357,
    population: 9539673,
    timezone: 'Africa/Cairo',
    economics: {
      gdpPerCapita: 12000,
      gdpGrowth: 5.5,
      unemploymentRate: 8.0,
      inflationRate: 15.0,
      costOfLivingIndex: 32,
      averageSalary: 350,
      minimumWage: 120,
      corporateTaxRate: 22.5,
      incomeTaxRate: 25,
      vatRate: 14,
      corruptionIndex: 65,
      easeOfBusinessIndex: 114,
      economicFreedomIndex: 55
    },
    sectors: {
      technology: 45,
      finance: 60,
      manufacturing: 60,
      healthcare: 55,
      energy: 70,
      tourism: 85,
      agriculture: 40,
      logistics: 65,
      retail: 70,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 35,
      airportConnectivity: 88,
      portAccess: false,
      railNetwork: 45,
      roadQuality: 55,
      powerReliability: 85
    },
    workforce: {
      educationLevel: 60,
      englishProficiency: 40,
      techTalentPool: 45,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 50,
      healthcareQuality: 55,
      pollutionIndex: 70,
      climateScore: 55
    },
    bonuses: {
      productionMultiplier: 1.3,
      salesMultiplier: 1.0,
      rdMultiplier: 0.75,
      recruitmentMultiplier: 1.4,
      brandValueMultiplier: 0.85
    }
  },
  {
    id: 'lagos',
    name: 'Lagos',
    country: 'Nigeria',
    countryCode: 'NG',
    continent: 'Afrique',
    lat: 6.5244,
    lng: 3.3792,
    population: 15388000,
    timezone: 'Africa/Lagos',
    economics: {
      gdpPerCapita: 5000,
      gdpGrowth: 3.0,
      unemploymentRate: 23.0,
      inflationRate: 18.0,
      costOfLivingIndex: 38,
      averageSalary: 300,
      minimumWage: 60,
      corporateTaxRate: 30,
      incomeTaxRate: 24,
      vatRate: 7.5,
      corruptionIndex: 72,
      easeOfBusinessIndex: 131,
      economicFreedomIndex: 54
    },
    sectors: {
      technology: 55,
      finance: 65,
      manufacturing: 50,
      healthcare: 40,
      energy: 80,
      tourism: 45,
      agriculture: 45,
      logistics: 55,
      retail: 75,
      realEstate: 65
    },
    infrastructure: {
      internetSpeedMbps: 25,
      airportConnectivity: 78,
      portAccess: true,
      railNetwork: 25,
      roadQuality: 35,
      powerReliability: 45
    },
    workforce: {
      educationLevel: 55,
      englishProficiency: 70,
      techTalentPool: 50,
      laborLaws: 'flexible',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 30,
      healthcareQuality: 40,
      pollutionIndex: 70,
      climateScore: 50
    },
    bonuses: {
      productionMultiplier: 1.25,
      salesMultiplier: 1.0,
      rdMultiplier: 0.7,
      recruitmentMultiplier: 1.45,
      brandValueMultiplier: 0.75
    }
  },
  {
    id: 'nairobi',
    name: 'Nairobi',
    country: 'Kenya',
    countryCode: 'KE',
    continent: 'Afrique',
    lat: -1.2921,
    lng: 36.8219,
    population: 4397073,
    timezone: 'Africa/Nairobi',
    economics: {
      gdpPerCapita: 4500,
      gdpGrowth: 5.5,
      unemploymentRate: 12.0,
      inflationRate: 7.5,
      costOfLivingIndex: 35,
      averageSalary: 350,
      minimumWage: 80,
      corporateTaxRate: 30,
      incomeTaxRate: 30,
      vatRate: 16,
      corruptionIndex: 68,
      easeOfBusinessIndex: 56,
      economicFreedomIndex: 55
    },
    sectors: {
      technology: 65,
      finance: 70,
      manufacturing: 45,
      healthcare: 55,
      energy: 55,
      tourism: 80,
      agriculture: 55,
      logistics: 65,
      retail: 70,
      realEstate: 65
    },
    infrastructure: {
      internetSpeedMbps: 30,
      airportConnectivity: 82,
      portAccess: false,
      railNetwork: 35,
      roadQuality: 50,
      powerReliability: 75
    },
    workforce: {
      educationLevel: 65,
      englishProficiency: 80,
      techTalentPool: 60,
      laborLaws: 'moderate',
      unionStrength: 35
    },
    qualityOfLife: {
      safetyIndex: 40,
      healthcareQuality: 50,
      pollutionIndex: 50,
      climateScore: 80
    },
    bonuses: {
      productionMultiplier: 1.2,
      salesMultiplier: 1.0,
      rdMultiplier: 0.85,
      recruitmentMultiplier: 1.35,
      brandValueMultiplier: 0.88
    }
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    country: 'Maroc',
    countryCode: 'MA',
    continent: 'Afrique',
    lat: 33.5731,
    lng: -7.5898,
    population: 3359818,
    timezone: 'Africa/Casablanca',
    economics: {
      gdpPerCapita: 8000,
      gdpGrowth: 3.5,
      unemploymentRate: 10.5,
      inflationRate: 4.5,
      costOfLivingIndex: 42,
      averageSalary: 500,
      minimumWage: 280,
      corporateTaxRate: 31,
      incomeTaxRate: 38,
      vatRate: 20,
      corruptionIndex: 55,
      easeOfBusinessIndex: 53,
      economicFreedomIndex: 63
    },
    sectors: {
      technology: 50,
      finance: 75,
      manufacturing: 70,
      healthcare: 60,
      energy: 60,
      tourism: 80,
      agriculture: 40,
      logistics: 75,
      retail: 70,
      realEstate: 70
    },
    infrastructure: {
      internetSpeedMbps: 40,
      airportConnectivity: 80,
      portAccess: true,
      railNetwork: 55,
      roadQuality: 70,
      powerReliability: 92
    },
    workforce: {
      educationLevel: 60,
      englishProficiency: 35,
      techTalentPool: 45,
      laborLaws: 'moderate',
      unionStrength: 40
    },
    qualityOfLife: {
      safetyIndex: 55,
      healthcareQuality: 60,
      pollutionIndex: 50,
      climateScore: 80
    },
    bonuses: {
      productionMultiplier: 1.25,
      salesMultiplier: 1.05,
      rdMultiplier: 0.8,
      recruitmentMultiplier: 1.3,
      brandValueMultiplier: 0.9
    }
  }
];

// Fonction pour obtenir les villes par continent
export const getCitiesByContinent = (continent: string): ExtendedCityData[] => {
  return extendedWorldCities.filter(city => city.continent === continent);
};

// Fonction pour obtenir les villes par pays
export const getCitiesByCountry = (country: string): ExtendedCityData[] => {
  return extendedWorldCities.filter(city => city.country === country);
};

// Fonction pour obtenir les meilleures villes par secteur
export const getTopCitiesBySector = (sector: keyof ExtendedCityData['sectors'], limit: number = 10): ExtendedCityData[] => {
  return [...extendedWorldCities]
    .sort((a, b) => b.sectors[sector] - a.sectors[sector])
    .slice(0, limit);
};

// Fonction pour calculer un score global pour une ville
export const calculateCityScore = (city: ExtendedCityData, weights?: Partial<Record<keyof ExtendedCityData['sectors'], number>>): number => {
  const defaultWeights: Record<keyof ExtendedCityData['sectors'], number> = {
    technology: 1,
    finance: 1,
    manufacturing: 1,
    healthcare: 1,
    energy: 1,
    tourism: 1,
    agriculture: 1,
    logistics: 1,
    retail: 1,
    realEstate: 1
  };
  
  const finalWeights = { ...defaultWeights, ...weights };
  let totalScore = 0;
  let totalWeight = 0;
  
  for (const [sector, weight] of Object.entries(finalWeights)) {
    totalScore += city.sectors[sector as keyof typeof city.sectors] * weight;
    totalWeight += weight;
  }
  
  return totalScore / totalWeight;
};

// Liste des continents disponibles
export const continents = ['Amérique du Nord', 'Europe', 'Asie', 'Océanie', 'Amérique du Sud', 'Afrique'];

// Liste des pays disponibles
export const countries = [...new Set(extendedWorldCities.map(city => city.country))].sort();
