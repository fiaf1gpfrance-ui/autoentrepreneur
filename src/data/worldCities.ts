// Comprehensive database of world cities with coordinates and economic data
export interface WorldCity {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  economicIndex: number; // 0-100, affects business opportunities
  costOfLiving: number; // multiplier, 1.0 = average
  techHub: boolean;
  financialCenter: boolean;
  industrialHub: boolean;
  portCity: boolean;
  capital: boolean;
  bonus: {
    revenue?: number;
    costs?: number;
    tech?: number;
    international?: number;
    industry?: number;
    finance?: number;
    logistics?: number;
    reputation?: number;
  };
}

export const WORLD_CITIES: WorldCity[] = [
  // ============ EUROPE ============
  // France
  { id: "paris", name: "Paris", country: "France", countryCode: "FR", continent: "Europe", lat: 48.8566, lng: 2.3522, population: 2161000, timezone: "Europe/Paris", economicIndex: 95, costOfLiving: 1.4, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { revenue: 30, costs: 40, reputation: 20, finance: 25 } },
  { id: "lyon", name: "Lyon", country: "France", countryCode: "FR", continent: "Europe", lat: 45.7640, lng: 4.8357, population: 516092, timezone: "Europe/Paris", economicIndex: 80, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { industry: 15, tech: 10 } },
  { id: "marseille", name: "Marseille", country: "France", countryCode: "FR", continent: "Europe", lat: 43.2965, lng: 5.3698, population: 861635, timezone: "Europe/Paris", economicIndex: 70, costOfLiving: 1.0, techHub: false, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 25, international: 15 } },
  { id: "toulouse", name: "Toulouse", country: "France", countryCode: "FR", continent: "Europe", lat: 43.6047, lng: 1.4442, population: 471941, timezone: "Europe/Paris", economicIndex: 85, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 30, industry: 20 } },
  { id: "nice", name: "Nice", country: "France", countryCode: "FR", continent: "Europe", lat: 43.7102, lng: 7.2620, population: 342522, timezone: "Europe/Paris", economicIndex: 75, costOfLiving: 1.2, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 15, reputation: 10 } },
  { id: "nantes", name: "Nantes", country: "France", countryCode: "FR", continent: "Europe", lat: 47.2184, lng: -1.5536, population: 303382, timezone: "Europe/Paris", economicIndex: 78, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 20, reputation: 15 } },
  { id: "strasbourg", name: "Strasbourg", country: "France", countryCode: "FR", continent: "Europe", lat: 48.5734, lng: 7.7521, population: 280966, timezone: "Europe/Paris", economicIndex: 80, costOfLiving: 1.0, techHub: false, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { international: 30 } },
  { id: "bordeaux", name: "Bordeaux", country: "France", countryCode: "FR", continent: "Europe", lat: 44.8378, lng: -0.5792, population: 254436, timezone: "Europe/Paris", economicIndex: 78, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 15, reputation: 10 } },
  { id: "lille", name: "Lille", country: "France", countryCode: "FR", continent: "Europe", lat: 50.6292, lng: 3.0573, population: 232787, timezone: "Europe/Paris", economicIndex: 75, costOfLiving: 0.95, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { international: 20, industry: 10 } },
  { id: "rennes", name: "Rennes", country: "France", countryCode: "FR", continent: "Europe", lat: 48.1173, lng: -1.6778, population: 216815, timezone: "Europe/Paris", economicIndex: 75, costOfLiving: 0.95, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 20 } },
  { id: "montpellier", name: "Montpellier", country: "France", countryCode: "FR", continent: "Europe", lat: 43.6108, lng: 3.8767, population: 285121, timezone: "Europe/Paris", economicIndex: 72, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 15 } },
  { id: "grenoble", name: "Grenoble", country: "France", countryCode: "FR", continent: "Europe", lat: 45.1885, lng: 5.7245, population: 158454, timezone: "Europe/Paris", economicIndex: 80, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 25, industry: 15 } },
  
  // UK
  { id: "london", name: "London", country: "United Kingdom", countryCode: "GB", continent: "Europe", lat: 51.5074, lng: -0.1278, population: 8982000, timezone: "Europe/London", economicIndex: 98, costOfLiving: 1.6, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { revenue: 35, costs: 50, finance: 40, international: 30 } },
  { id: "manchester", name: "Manchester", country: "United Kingdom", countryCode: "GB", continent: "Europe", lat: 53.4808, lng: -2.2426, population: 547627, timezone: "Europe/London", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 20, industry: 15 } },
  { id: "birmingham", name: "Birmingham", country: "United Kingdom", countryCode: "GB", continent: "Europe", lat: 52.4862, lng: -1.8904, population: 1141816, timezone: "Europe/London", economicIndex: 78, costOfLiving: 1.0, techHub: false, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { industry: 20 } },
  { id: "edinburgh", name: "Edinburgh", country: "United Kingdom", countryCode: "GB", continent: "Europe", lat: 55.9533, lng: -3.1883, population: 518500, timezone: "Europe/London", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 20, tech: 15 } },
  { id: "glasgow", name: "Glasgow", country: "United Kingdom", countryCode: "GB", continent: "Europe", lat: 55.8642, lng: -4.2518, population: 626410, timezone: "Europe/London", economicIndex: 75, costOfLiving: 0.95, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { industry: 15, tech: 10 } },
  
  // Germany
  { id: "berlin", name: "Berlin", country: "Germany", countryCode: "DE", continent: "Europe", lat: 52.5200, lng: 13.4050, population: 3644826, timezone: "Europe/Berlin", economicIndex: 92, costOfLiving: 1.2, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: true, bonus: { tech: 30, reputation: 20 } },
  { id: "munich", name: "Munich", country: "Germany", countryCode: "DE", continent: "Europe", lat: 48.1351, lng: 11.5820, population: 1471508, timezone: "Europe/Berlin", economicIndex: 95, costOfLiving: 1.4, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 25, industry: 30 } },
  { id: "frankfurt", name: "Frankfurt", country: "Germany", countryCode: "DE", continent: "Europe", lat: 50.1109, lng: 8.6821, population: 753056, timezone: "Europe/Berlin", economicIndex: 95, costOfLiving: 1.3, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: false, bonus: { finance: 40, international: 25 } },
  { id: "hamburg", name: "Hamburg", country: "Germany", countryCode: "DE", continent: "Europe", lat: 53.5511, lng: 9.9937, population: 1841179, timezone: "Europe/Berlin", economicIndex: 88, costOfLiving: 1.2, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 30, international: 20 } },
  { id: "cologne", name: "Cologne", country: "Germany", countryCode: "DE", continent: "Europe", lat: 50.9375, lng: 6.9603, population: 1085664, timezone: "Europe/Berlin", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 15, industry: 15 } },
  { id: "stuttgart", name: "Stuttgart", country: "Germany", countryCode: "DE", continent: "Europe", lat: 48.7758, lng: 9.1829, population: 634830, timezone: "Europe/Berlin", economicIndex: 90, costOfLiving: 1.2, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { industry: 35, tech: 20 } },
  { id: "dusseldorf", name: "Düsseldorf", country: "Germany", countryCode: "DE", continent: "Europe", lat: 51.2277, lng: 6.7735, population: 619294, timezone: "Europe/Berlin", economicIndex: 85, costOfLiving: 1.2, techHub: false, financialCenter: true, industrialHub: false, portCity: false, capital: false, bonus: { finance: 20, reputation: 15 } },
  
  // Spain
  { id: "madrid", name: "Madrid", country: "Spain", countryCode: "ES", continent: "Europe", lat: 40.4168, lng: -3.7038, population: 3223334, timezone: "Europe/Madrid", economicIndex: 88, costOfLiving: 1.1, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { revenue: 20, finance: 20, international: 15 } },
  { id: "barcelona", name: "Barcelona", country: "Spain", countryCode: "ES", continent: "Europe", lat: 41.3851, lng: 2.1734, population: 1620343, timezone: "Europe/Madrid", economicIndex: 88, costOfLiving: 1.15, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 25, logistics: 15, reputation: 15 } },
  { id: "valencia", name: "Valencia", country: "Spain", countryCode: "ES", continent: "Europe", lat: 39.4699, lng: -0.3763, population: 791413, timezone: "Europe/Madrid", economicIndex: 75, costOfLiving: 0.95, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 20, industry: 15 } },
  { id: "seville", name: "Seville", country: "Spain", countryCode: "ES", continent: "Europe", lat: 37.3891, lng: -5.9845, population: 688711, timezone: "Europe/Madrid", economicIndex: 70, costOfLiving: 0.9, techHub: false, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { reputation: 10 } },
  
  // Italy
  { id: "rome", name: "Rome", country: "Italy", countryCode: "IT", continent: "Europe", lat: 41.9028, lng: 12.4964, population: 2872800, timezone: "Europe/Rome", economicIndex: 82, costOfLiving: 1.15, techHub: false, financialCenter: false, industrialHub: false, portCity: false, capital: true, bonus: { reputation: 25, international: 15 } },
  { id: "milan", name: "Milan", country: "Italy", countryCode: "IT", continent: "Europe", lat: 45.4642, lng: 9.1900, population: 1352000, timezone: "Europe/Rome", economicIndex: 92, costOfLiving: 1.25, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: false, bonus: { finance: 30, reputation: 25, industry: 20 } },
  { id: "turin", name: "Turin", country: "Italy", countryCode: "IT", continent: "Europe", lat: 45.0703, lng: 7.6869, population: 870952, timezone: "Europe/Rome", economicIndex: 82, costOfLiving: 1.05, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { industry: 30, tech: 15 } },
  { id: "florence", name: "Florence", country: "Italy", countryCode: "IT", continent: "Europe", lat: 43.7696, lng: 11.2558, population: 382258, timezone: "Europe/Rome", economicIndex: 78, costOfLiving: 1.1, techHub: false, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { reputation: 20 } },
  
  // Netherlands
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", countryCode: "NL", continent: "Europe", lat: 52.3676, lng: 4.9041, population: 872680, timezone: "Europe/Amsterdam", economicIndex: 92, costOfLiving: 1.35, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { tech: 25, finance: 25, international: 30, logistics: 20 } },
  { id: "rotterdam", name: "Rotterdam", country: "Netherlands", countryCode: "NL", continent: "Europe", lat: 51.9244, lng: 4.4777, population: 651446, timezone: "Europe/Amsterdam", economicIndex: 88, costOfLiving: 1.15, techHub: false, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 40, international: 25 } },
  { id: "the_hague", name: "The Hague", country: "Netherlands", countryCode: "NL", continent: "Europe", lat: 52.0705, lng: 4.3007, population: 545163, timezone: "Europe/Amsterdam", economicIndex: 85, costOfLiving: 1.2, techHub: false, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { international: 30, reputation: 15 } },
  { id: "eindhoven", name: "Eindhoven", country: "Netherlands", countryCode: "NL", continent: "Europe", lat: 51.4416, lng: 5.4697, population: 234456, timezone: "Europe/Amsterdam", economicIndex: 88, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 35, industry: 25 } },
  
  // Belgium
  { id: "brussels", name: "Brussels", country: "Belgium", countryCode: "BE", continent: "Europe", lat: 50.8503, lng: 4.3517, population: 1209000, timezone: "Europe/Brussels", economicIndex: 88, costOfLiving: 1.2, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { international: 35, finance: 20 } },
  { id: "antwerp", name: "Antwerp", country: "Belgium", countryCode: "BE", continent: "Europe", lat: 51.2194, lng: 4.4025, population: 529247, timezone: "Europe/Brussels", economicIndex: 85, costOfLiving: 1.1, techHub: false, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 35, international: 20 } },
  
  // Switzerland
  { id: "zurich", name: "Zurich", country: "Switzerland", countryCode: "CH", continent: "Europe", lat: 47.3769, lng: 8.5417, population: 428737, timezone: "Europe/Zurich", economicIndex: 98, costOfLiving: 1.8, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: false, bonus: { finance: 50, reputation: 30, costs: 60 } },
  { id: "geneva", name: "Geneva", country: "Switzerland", countryCode: "CH", continent: "Europe", lat: 46.2044, lng: 6.1432, population: 201818, timezone: "Europe/Zurich", economicIndex: 95, costOfLiving: 1.7, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: false, bonus: { finance: 40, international: 45, reputation: 25 } },
  { id: "basel", name: "Basel", country: "Switzerland", countryCode: "CH", continent: "Europe", lat: 47.5596, lng: 7.5886, population: 177654, timezone: "Europe/Zurich", economicIndex: 92, costOfLiving: 1.5, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 30, industry: 25 } },
  
  // Austria
  { id: "vienna", name: "Vienna", country: "Austria", countryCode: "AT", continent: "Europe", lat: 48.2082, lng: 16.3738, population: 1911191, timezone: "Europe/Vienna", economicIndex: 88, costOfLiving: 1.2, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { finance: 25, international: 25, reputation: 20 } },
  
  // Poland
  { id: "warsaw", name: "Warsaw", country: "Poland", countryCode: "PL", continent: "Europe", lat: 52.2297, lng: 21.0122, population: 1790658, timezone: "Europe/Warsaw", economicIndex: 82, costOfLiving: 0.85, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { tech: 25, costs: -20 } },
  { id: "krakow", name: "Krakow", country: "Poland", countryCode: "PL", continent: "Europe", lat: 50.0647, lng: 19.9450, population: 779115, timezone: "Europe/Warsaw", economicIndex: 78, costOfLiving: 0.75, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 20, costs: -25 } },
  
  // Czech Republic
  { id: "prague", name: "Prague", country: "Czech Republic", countryCode: "CZ", continent: "Europe", lat: 50.0755, lng: 14.4378, population: 1309000, timezone: "Europe/Prague", economicIndex: 82, costOfLiving: 0.9, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: true, bonus: { tech: 20, industry: 15, costs: -15 } },
  
  // Sweden
  { id: "stockholm", name: "Stockholm", country: "Sweden", countryCode: "SE", continent: "Europe", lat: 59.3293, lng: 18.0686, population: 975904, timezone: "Europe/Stockholm", economicIndex: 90, costOfLiving: 1.35, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { tech: 35, reputation: 20, finance: 15 } },
  { id: "gothenburg", name: "Gothenburg", country: "Sweden", countryCode: "SE", continent: "Europe", lat: 57.7089, lng: 11.9746, population: 579281, timezone: "Europe/Stockholm", economicIndex: 85, costOfLiving: 1.2, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { industry: 25, logistics: 20 } },
  
  // Norway
  { id: "oslo", name: "Oslo", country: "Norway", countryCode: "NO", continent: "Europe", lat: 59.9139, lng: 10.7522, population: 693494, timezone: "Europe/Oslo", economicIndex: 92, costOfLiving: 1.6, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { finance: 25, reputation: 20, costs: 40 } },
  
  // Denmark
  { id: "copenhagen", name: "Copenhagen", country: "Denmark", countryCode: "DK", continent: "Europe", lat: 55.6761, lng: 12.5683, population: 794128, timezone: "Europe/Copenhagen", economicIndex: 90, costOfLiving: 1.4, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 25, reputation: 25 } },
  
  // Finland
  { id: "helsinki", name: "Helsinki", country: "Finland", countryCode: "FI", continent: "Europe", lat: 60.1699, lng: 24.9384, population: 656229, timezone: "Europe/Helsinki", economicIndex: 88, costOfLiving: 1.3, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 30, reputation: 15 } },
  
  // Ireland
  { id: "dublin", name: "Dublin", country: "Ireland", countryCode: "IE", continent: "Europe", lat: 53.3498, lng: -6.2603, population: 1173179, timezone: "Europe/Dublin", economicIndex: 90, costOfLiving: 1.35, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { tech: 35, finance: 25, international: 20 } },
  
  // Portugal
  { id: "lisbon", name: "Lisbon", country: "Portugal", countryCode: "PT", continent: "Europe", lat: 38.7223, lng: -9.1393, population: 544851, timezone: "Europe/Lisbon", economicIndex: 78, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 20, costs: -10, reputation: 10 } },
  { id: "porto", name: "Porto", country: "Portugal", countryCode: "PT", continent: "Europe", lat: 41.1579, lng: -8.6291, population: 287591, timezone: "Europe/Lisbon", economicIndex: 72, costOfLiving: 0.9, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 15, logistics: 15, costs: -15 } },
  
  // Greece
  { id: "athens", name: "Athens", country: "Greece", countryCode: "GR", continent: "Europe", lat: 37.9838, lng: 23.7275, population: 664046, timezone: "Europe/Athens", economicIndex: 68, costOfLiving: 0.85, techHub: false, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { international: 15, costs: -20 } },
  
  // Russia
  { id: "moscow", name: "Moscow", country: "Russia", countryCode: "RU", continent: "Europe", lat: 55.7558, lng: 37.6173, population: 12678079, timezone: "Europe/Moscow", economicIndex: 85, costOfLiving: 1.0, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { industry: 25, finance: 20, revenue: 20 } },
  { id: "saint_petersburg", name: "Saint Petersburg", country: "Russia", countryCode: "RU", continent: "Europe", lat: 59.9343, lng: 30.3351, population: 5383890, timezone: "Europe/Moscow", economicIndex: 80, costOfLiving: 0.85, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { industry: 20, logistics: 15, tech: 15 } },

  // ============ NORTH AMERICA ============
  { id: "new_york", name: "New York", country: "United States", countryCode: "US", continent: "North America", lat: 40.7128, lng: -74.0060, population: 8336817, timezone: "America/New_York", economicIndex: 98, costOfLiving: 1.7, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 50, revenue: 40, reputation: 30, costs: 55 } },
  { id: "los_angeles", name: "Los Angeles", country: "United States", countryCode: "US", continent: "North America", lat: 34.0522, lng: -118.2437, population: 3979576, timezone: "America/Los_Angeles", economicIndex: 92, costOfLiving: 1.5, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 30, reputation: 35, logistics: 20 } },
  { id: "san_francisco", name: "San Francisco", country: "United States", countryCode: "US", continent: "North America", lat: 37.7749, lng: -122.4194, population: 883305, timezone: "America/Los_Angeles", economicIndex: 98, costOfLiving: 1.8, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { tech: 50, finance: 30, costs: 60 } },
  { id: "chicago", name: "Chicago", country: "United States", countryCode: "US", continent: "North America", lat: 41.8781, lng: -87.6298, population: 2693976, timezone: "America/Chicago", economicIndex: 88, costOfLiving: 1.2, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { finance: 30, industry: 25, logistics: 25 } },
  { id: "houston", name: "Houston", country: "United States", countryCode: "US", continent: "North America", lat: 29.7604, lng: -95.3698, population: 2320268, timezone: "America/Chicago", economicIndex: 85, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { industry: 35, logistics: 20 } },
  { id: "phoenix", name: "Phoenix", country: "United States", countryCode: "US", continent: "North America", lat: 33.4484, lng: -112.0740, population: 1660272, timezone: "America/Phoenix", economicIndex: 78, costOfLiving: 0.95, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 20, costs: -10 } },
  { id: "philadelphia", name: "Philadelphia", country: "United States", countryCode: "US", continent: "North America", lat: 39.9526, lng: -75.1652, population: 1584064, timezone: "America/New_York", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { finance: 20, industry: 15 } },
  { id: "san_antonio", name: "San Antonio", country: "United States", countryCode: "US", continent: "North America", lat: 29.4241, lng: -98.4936, population: 1547253, timezone: "America/Chicago", economicIndex: 75, costOfLiving: 0.9, techHub: false, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { costs: -15 } },
  { id: "san_diego", name: "San Diego", country: "United States", countryCode: "US", continent: "North America", lat: 32.7157, lng: -117.1611, population: 1423851, timezone: "America/Los_Angeles", economicIndex: 85, costOfLiving: 1.25, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 25, logistics: 15 } },
  { id: "dallas", name: "Dallas", country: "United States", countryCode: "US", continent: "North America", lat: 32.7767, lng: -96.7970, population: 1343573, timezone: "America/Chicago", economicIndex: 85, costOfLiving: 1.05, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: false, bonus: { finance: 25, tech: 20 } },
  { id: "austin", name: "Austin", country: "United States", countryCode: "US", continent: "North America", lat: 30.2672, lng: -97.7431, population: 978908, timezone: "America/Chicago", economicIndex: 90, costOfLiving: 1.15, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 40, reputation: 15 } },
  { id: "seattle", name: "Seattle", country: "United States", countryCode: "US", continent: "North America", lat: 47.6062, lng: -122.3321, population: 753675, timezone: "America/Los_Angeles", economicIndex: 92, costOfLiving: 1.4, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 45, logistics: 15 } },
  { id: "boston", name: "Boston", country: "United States", countryCode: "US", continent: "North America", lat: 42.3601, lng: -71.0589, population: 692600, timezone: "America/New_York", economicIndex: 92, costOfLiving: 1.4, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { tech: 35, finance: 25, reputation: 20 } },
  { id: "denver", name: "Denver", country: "United States", countryCode: "US", continent: "North America", lat: 39.7392, lng: -104.9903, population: 727211, timezone: "America/Denver", economicIndex: 85, costOfLiving: 1.15, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 25, reputation: 10 } },
  { id: "atlanta", name: "Atlanta", country: "United States", countryCode: "US", continent: "North America", lat: 33.7490, lng: -84.3880, population: 498715, timezone: "America/New_York", economicIndex: 88, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 25, logistics: 30 } },
  { id: "miami", name: "Miami", country: "United States", countryCode: "US", continent: "North America", lat: 25.7617, lng: -80.1918, population: 467963, timezone: "America/New_York", economicIndex: 85, costOfLiving: 1.2, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 25, international: 30, reputation: 15 } },
  { id: "washington_dc", name: "Washington D.C.", country: "United States", countryCode: "US", continent: "North America", lat: 38.9072, lng: -77.0369, population: 689545, timezone: "America/New_York", economicIndex: 90, costOfLiving: 1.35, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: true, bonus: { reputation: 30, international: 25 } },
  
  // Canada
  { id: "toronto", name: "Toronto", country: "Canada", countryCode: "CA", continent: "North America", lat: 43.6532, lng: -79.3832, population: 2731571, timezone: "America/Toronto", economicIndex: 90, costOfLiving: 1.3, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 30, tech: 25, international: 20 } },
  { id: "vancouver", name: "Vancouver", country: "Canada", countryCode: "CA", continent: "North America", lat: 49.2827, lng: -123.1207, population: 631486, timezone: "America/Vancouver", economicIndex: 88, costOfLiving: 1.35, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 25, logistics: 25, international: 20 } },
  { id: "montreal", name: "Montreal", country: "Canada", countryCode: "CA", continent: "North America", lat: 45.5017, lng: -73.5673, population: 1762949, timezone: "America/Toronto", economicIndex: 85, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 20, industry: 15 } },
  { id: "calgary", name: "Calgary", country: "Canada", countryCode: "CA", continent: "North America", lat: 51.0447, lng: -114.0719, population: 1239220, timezone: "America/Edmonton", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { industry: 25, tech: 15 } },
  { id: "ottawa", name: "Ottawa", country: "Canada", countryCode: "CA", continent: "North America", lat: 45.4215, lng: -75.6972, population: 934243, timezone: "America/Toronto", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: true, bonus: { tech: 20, reputation: 15 } },
  
  // Mexico
  { id: "mexico_city", name: "Mexico City", country: "Mexico", countryCode: "MX", continent: "North America", lat: 19.4326, lng: -99.1332, population: 8918653, timezone: "America/Mexico_City", economicIndex: 82, costOfLiving: 0.7, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { industry: 25, costs: -30, international: 15 } },
  { id: "guadalajara", name: "Guadalajara", country: "Mexico", countryCode: "MX", continent: "North America", lat: 20.6597, lng: -103.3496, population: 1495182, timezone: "America/Mexico_City", economicIndex: 78, costOfLiving: 0.6, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 25, industry: 20, costs: -35 } },
  { id: "monterrey", name: "Monterrey", country: "Mexico", countryCode: "MX", continent: "North America", lat: 25.6866, lng: -100.3161, population: 1135512, timezone: "America/Monterrey", economicIndex: 80, costOfLiving: 0.65, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { industry: 30, tech: 15, costs: -30 } },

  // ============ SOUTH AMERICA ============
  { id: "sao_paulo", name: "São Paulo", country: "Brazil", countryCode: "BR", continent: "South America", lat: -23.5505, lng: -46.6333, population: 12325232, timezone: "America/Sao_Paulo", economicIndex: 85, costOfLiving: 0.8, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: false, bonus: { finance: 25, industry: 25, revenue: 20, costs: -25 } },
  { id: "rio_de_janeiro", name: "Rio de Janeiro", country: "Brazil", countryCode: "BR", continent: "South America", lat: -22.9068, lng: -43.1729, population: 6747815, timezone: "America/Sao_Paulo", economicIndex: 78, costOfLiving: 0.75, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 20, reputation: 20, costs: -30 } },
  { id: "buenos_aires", name: "Buenos Aires", country: "Argentina", countryCode: "AR", continent: "South America", lat: -34.6037, lng: -58.3816, population: 2891082, timezone: "America/Argentina/Buenos_Aires", economicIndex: 75, costOfLiving: 0.6, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { tech: 20, costs: -40, reputation: 15 } },
  { id: "bogota", name: "Bogotá", country: "Colombia", countryCode: "CO", continent: "South America", lat: 4.7110, lng: -74.0721, population: 7412566, timezone: "America/Bogota", economicIndex: 72, costOfLiving: 0.55, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: true, bonus: { tech: 20, costs: -45 } },
  { id: "santiago", name: "Santiago", country: "Chile", countryCode: "CL", continent: "South America", lat: -33.4489, lng: -70.6693, population: 5614000, timezone: "America/Santiago", economicIndex: 80, costOfLiving: 0.75, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { finance: 20, tech: 15, costs: -25 } },
  { id: "lima", name: "Lima", country: "Peru", countryCode: "PE", continent: "South America", lat: -12.0464, lng: -77.0428, population: 9751717, timezone: "America/Lima", economicIndex: 70, costOfLiving: 0.55, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 15, logistics: 15, costs: -45 } },
  { id: "medellin", name: "Medellín", country: "Colombia", countryCode: "CO", continent: "South America", lat: 6.2442, lng: -75.5812, population: 2508452, timezone: "America/Bogota", economicIndex: 72, costOfLiving: 0.5, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 25, costs: -50 } },

  // ============ ASIA ============
  { id: "tokyo", name: "Tokyo", country: "Japan", countryCode: "JP", continent: "Asia", lat: 35.6762, lng: 139.6503, population: 13960000, timezone: "Asia/Tokyo", economicIndex: 98, costOfLiving: 1.5, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: true, bonus: { tech: 40, finance: 35, industry: 30, reputation: 25 } },
  { id: "osaka", name: "Osaka", country: "Japan", countryCode: "JP", continent: "Asia", lat: 34.6937, lng: 135.5023, population: 2691185, timezone: "Asia/Tokyo", economicIndex: 88, costOfLiving: 1.25, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { industry: 30, finance: 20, logistics: 20 } },
  { id: "kyoto", name: "Kyoto", country: "Japan", countryCode: "JP", continent: "Asia", lat: 35.0116, lng: 135.7681, population: 1475183, timezone: "Asia/Tokyo", economicIndex: 82, costOfLiving: 1.15, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 25, reputation: 20 } },
  
  { id: "seoul", name: "Seoul", country: "South Korea", countryCode: "KR", continent: "Asia", lat: 37.5665, lng: 126.9780, population: 9733509, timezone: "Asia/Seoul", economicIndex: 95, costOfLiving: 1.2, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { tech: 45, industry: 30, finance: 20 } },
  { id: "busan", name: "Busan", country: "South Korea", countryCode: "KR", continent: "Asia", lat: 35.1796, lng: 129.0756, population: 3429000, timezone: "Asia/Seoul", economicIndex: 85, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { logistics: 30, industry: 25 } },
  
  { id: "shanghai", name: "Shanghai", country: "China", countryCode: "CN", continent: "Asia", lat: 31.2304, lng: 121.4737, population: 24870895, timezone: "Asia/Shanghai", economicIndex: 95, costOfLiving: 1.1, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { finance: 35, industry: 35, logistics: 30, international: 25 } },
  { id: "beijing", name: "Beijing", country: "China", countryCode: "CN", continent: "Asia", lat: 39.9042, lng: 116.4074, population: 21542000, timezone: "Asia/Shanghai", economicIndex: 92, costOfLiving: 1.0, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { tech: 35, finance: 25, reputation: 25 } },
  { id: "shenzhen", name: "Shenzhen", country: "China", countryCode: "CN", continent: "Asia", lat: 22.5431, lng: 114.0579, population: 12528300, timezone: "Asia/Shanghai", economicIndex: 95, costOfLiving: 1.0, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 50, industry: 35 } },
  { id: "guangzhou", name: "Guangzhou", country: "China", countryCode: "CN", continent: "Asia", lat: 23.1291, lng: 113.2644, population: 14904400, timezone: "Asia/Shanghai", economicIndex: 88, costOfLiving: 0.9, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { industry: 30, logistics: 25 } },
  { id: "hong_kong", name: "Hong Kong", country: "China", countryCode: "HK", continent: "Asia", lat: 22.3193, lng: 114.1694, population: 7496988, timezone: "Asia/Hong_Kong", economicIndex: 95, costOfLiving: 1.5, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 45, international: 40, reputation: 25 } },
  
  { id: "singapore", name: "Singapore", country: "Singapore", countryCode: "SG", continent: "Asia", lat: 1.3521, lng: 103.8198, population: 5685807, timezone: "Asia/Singapore", economicIndex: 98, costOfLiving: 1.4, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: true, bonus: { finance: 45, tech: 35, logistics: 40, international: 40 } },
  
  { id: "mumbai", name: "Mumbai", country: "India", countryCode: "IN", continent: "Asia", lat: 19.0760, lng: 72.8777, population: 12478447, timezone: "Asia/Kolkata", economicIndex: 82, costOfLiving: 0.65, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { finance: 30, tech: 25, costs: -40, industry: 20 } },
  { id: "bangalore", name: "Bangalore", country: "India", countryCode: "IN", continent: "Asia", lat: 12.9716, lng: 77.5946, population: 8443675, timezone: "Asia/Kolkata", economicIndex: 85, costOfLiving: 0.55, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 45, costs: -50 } },
  { id: "delhi", name: "New Delhi", country: "India", countryCode: "IN", continent: "Asia", lat: 28.6139, lng: 77.2090, population: 16787941, timezone: "Asia/Kolkata", economicIndex: 80, costOfLiving: 0.6, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: true, bonus: { tech: 25, industry: 20, costs: -45 } },
  { id: "hyderabad", name: "Hyderabad", country: "India", countryCode: "IN", continent: "Asia", lat: 17.3850, lng: 78.4867, population: 6993262, timezone: "Asia/Kolkata", economicIndex: 80, costOfLiving: 0.5, techHub: true, financialCenter: false, industrialHub: false, portCity: false, capital: false, bonus: { tech: 35, costs: -55 } },
  { id: "chennai", name: "Chennai", country: "India", countryCode: "IN", continent: "Asia", lat: 13.0827, lng: 80.2707, population: 4681087, timezone: "Asia/Kolkata", economicIndex: 78, costOfLiving: 0.5, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 25, industry: 25, logistics: 15, costs: -55 } },
  { id: "pune", name: "Pune", country: "India", countryCode: "IN", continent: "Asia", lat: 18.5204, lng: 73.8567, population: 3124458, timezone: "Asia/Kolkata", economicIndex: 78, costOfLiving: 0.45, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: false, bonus: { tech: 30, industry: 20, costs: -55 } },
  
  { id: "bangkok", name: "Bangkok", country: "Thailand", countryCode: "TH", continent: "Asia", lat: 13.7563, lng: 100.5018, population: 10539000, timezone: "Asia/Bangkok", economicIndex: 80, costOfLiving: 0.6, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { tech: 20, industry: 20, costs: -40, international: 20 } },
  
  { id: "kuala_lumpur", name: "Kuala Lumpur", country: "Malaysia", countryCode: "MY", continent: "Asia", lat: 3.1390, lng: 101.6869, population: 1768000, timezone: "Asia/Kuala_Lumpur", economicIndex: 82, costOfLiving: 0.6, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { tech: 25, finance: 20, costs: -40, industry: 20 } },
  
  { id: "jakarta", name: "Jakarta", country: "Indonesia", countryCode: "ID", continent: "Asia", lat: -6.2088, lng: 106.8456, population: 10562088, timezone: "Asia/Jakarta", economicIndex: 78, costOfLiving: 0.5, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: true, bonus: { industry: 25, costs: -50, logistics: 20 } },
  
  { id: "manila", name: "Manila", country: "Philippines", countryCode: "PH", continent: "Asia", lat: 14.5995, lng: 120.9842, population: 1780148, timezone: "Asia/Manila", economicIndex: 72, costOfLiving: 0.45, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 20, costs: -55, logistics: 15 } },
  
  { id: "ho_chi_minh", name: "Ho Chi Minh City", country: "Vietnam", countryCode: "VN", continent: "Asia", lat: 10.8231, lng: 106.6297, population: 8993082, timezone: "Asia/Ho_Chi_Minh", economicIndex: 75, costOfLiving: 0.4, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { tech: 25, industry: 30, costs: -60 } },
  { id: "hanoi", name: "Hanoi", country: "Vietnam", countryCode: "VN", continent: "Asia", lat: 21.0278, lng: 105.8342, population: 8053663, timezone: "Asia/Ho_Chi_Minh", economicIndex: 72, costOfLiving: 0.38, techHub: true, financialCenter: false, industrialHub: true, portCity: false, capital: true, bonus: { tech: 20, industry: 25, costs: -60 } },
  
  { id: "taipei", name: "Taipei", country: "Taiwan", countryCode: "TW", continent: "Asia", lat: 25.0330, lng: 121.5654, population: 2646204, timezone: "Asia/Taipei", economicIndex: 88, costOfLiving: 0.9, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { tech: 40, industry: 30, finance: 20 } },

  // ============ MIDDLE EAST ============
  { id: "dubai", name: "Dubai", country: "UAE", countryCode: "AE", continent: "Asia", lat: 25.2048, lng: 55.2708, population: 3331420, timezone: "Asia/Dubai", economicIndex: 92, costOfLiving: 1.3, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 40, international: 45, reputation: 35, logistics: 30 } },
  { id: "abu_dhabi", name: "Abu Dhabi", country: "UAE", countryCode: "AE", continent: "Asia", lat: 24.4539, lng: 54.3773, population: 1483000, timezone: "Asia/Dubai", economicIndex: 90, costOfLiving: 1.25, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { finance: 35, international: 35, reputation: 30 } },
  { id: "doha", name: "Doha", country: "Qatar", countryCode: "QA", continent: "Asia", lat: 25.2854, lng: 51.5310, population: 2382000, timezone: "Asia/Qatar", economicIndex: 90, costOfLiving: 1.35, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: true, bonus: { finance: 35, international: 35, reputation: 25 } },
  { id: "riyadh", name: "Riyadh", country: "Saudi Arabia", countryCode: "SA", continent: "Asia", lat: 24.7136, lng: 46.6753, population: 7676654, timezone: "Asia/Riyadh", economicIndex: 85, costOfLiving: 1.0, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { finance: 30, international: 25 } },
  { id: "tel_aviv", name: "Tel Aviv", country: "Israel", countryCode: "IL", continent: "Asia", lat: 32.0853, lng: 34.7818, population: 460613, timezone: "Asia/Jerusalem", economicIndex: 92, costOfLiving: 1.35, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { tech: 50, finance: 25, costs: 30 } },

  // ============ OCEANIA ============
  { id: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", continent: "Oceania", lat: -33.8688, lng: 151.2093, population: 5312163, timezone: "Australia/Sydney", economicIndex: 90, costOfLiving: 1.35, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 30, tech: 25, international: 25 } },
  { id: "melbourne", name: "Melbourne", country: "Australia", countryCode: "AU", continent: "Oceania", lat: -37.8136, lng: 144.9631, population: 5078193, timezone: "Australia/Melbourne", economicIndex: 88, costOfLiving: 1.25, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { finance: 25, tech: 25, reputation: 20 } },
  { id: "brisbane", name: "Brisbane", country: "Australia", countryCode: "AU", continent: "Oceania", lat: -27.4698, lng: 153.0251, population: 2514184, timezone: "Australia/Brisbane", economicIndex: 82, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 20, logistics: 15 } },
  { id: "perth", name: "Perth", country: "Australia", countryCode: "AU", continent: "Oceania", lat: -31.9505, lng: 115.8605, population: 2085973, timezone: "Australia/Perth", economicIndex: 82, costOfLiving: 1.15, techHub: true, financialCenter: false, industrialHub: true, portCity: true, capital: false, bonus: { industry: 25, logistics: 20 } },
  { id: "auckland", name: "Auckland", country: "New Zealand", countryCode: "NZ", continent: "Oceania", lat: -36.8509, lng: 174.7645, population: 1657200, timezone: "Pacific/Auckland", economicIndex: 82, costOfLiving: 1.2, techHub: true, financialCenter: true, industrialHub: false, portCity: true, capital: false, bonus: { tech: 20, finance: 15, reputation: 15 } },
  { id: "wellington", name: "Wellington", country: "New Zealand", countryCode: "NZ", continent: "Oceania", lat: -41.2866, lng: 174.7756, population: 212700, timezone: "Pacific/Auckland", economicIndex: 78, costOfLiving: 1.1, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 15, reputation: 15 } },

  // ============ AFRICA ============
  { id: "johannesburg", name: "Johannesburg", country: "South Africa", countryCode: "ZA", continent: "Africa", lat: -26.2041, lng: 28.0473, population: 5635127, timezone: "Africa/Johannesburg", economicIndex: 78, costOfLiving: 0.6, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: false, bonus: { finance: 25, industry: 20, costs: -40 } },
  { id: "cape_town", name: "Cape Town", country: "South Africa", countryCode: "ZA", continent: "Africa", lat: -33.9249, lng: 18.4241, population: 4004793, timezone: "Africa/Johannesburg", economicIndex: 75, costOfLiving: 0.55, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: false, bonus: { tech: 20, logistics: 15, reputation: 15, costs: -45 } },
  { id: "cairo", name: "Cairo", country: "Egypt", countryCode: "EG", continent: "Africa", lat: 30.0444, lng: 31.2357, population: 9540000, timezone: "Africa/Cairo", economicIndex: 70, costOfLiving: 0.4, techHub: true, financialCenter: true, industrialHub: true, portCity: false, capital: true, bonus: { industry: 20, costs: -55 } },
  { id: "nairobi", name: "Nairobi", country: "Kenya", countryCode: "KE", continent: "Africa", lat: -1.2921, lng: 36.8219, population: 4397073, timezone: "Africa/Nairobi", economicIndex: 68, costOfLiving: 0.45, techHub: true, financialCenter: true, industrialHub: false, portCity: false, capital: true, bonus: { tech: 25, costs: -55 } },
  { id: "lagos", name: "Lagos", country: "Nigeria", countryCode: "NG", continent: "Africa", lat: 6.5244, lng: 3.3792, population: 14862000, timezone: "Africa/Lagos", economicIndex: 70, costOfLiving: 0.4, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { tech: 20, industry: 20, costs: -55 } },
  { id: "casablanca", name: "Casablanca", country: "Morocco", countryCode: "MA", continent: "Africa", lat: 33.5731, lng: -7.5898, population: 3359818, timezone: "Africa/Casablanca", economicIndex: 72, costOfLiving: 0.5, techHub: true, financialCenter: true, industrialHub: true, portCity: true, capital: false, bonus: { finance: 20, industry: 20, logistics: 20, costs: -50 } },
  { id: "accra", name: "Accra", country: "Ghana", countryCode: "GH", continent: "Africa", lat: 5.6037, lng: -0.1870, population: 2291352, timezone: "Africa/Accra", economicIndex: 65, costOfLiving: 0.45, techHub: true, financialCenter: false, industrialHub: false, portCity: true, capital: true, bonus: { tech: 20, costs: -55 } },
  { id: "addis_ababa", name: "Addis Ababa", country: "Ethiopia", countryCode: "ET", continent: "Africa", lat: 9.0250, lng: 38.7469, population: 3352000, timezone: "Africa/Addis_Ababa", economicIndex: 60, costOfLiving: 0.35, techHub: false, financialCenter: false, industrialHub: true, portCity: false, capital: true, bonus: { industry: 20, costs: -60 } },
];

// Helper functions
export const getCitiesByContinent = (continent: string): WorldCity[] => {
  return WORLD_CITIES.filter(city => city.continent === continent);
};

export const getCitiesByCountry = (countryCode: string): WorldCity[] => {
  return WORLD_CITIES.filter(city => city.countryCode === countryCode);
};

export const getCitiesByFeature = (feature: 'techHub' | 'financialCenter' | 'industrialHub' | 'portCity' | 'capital'): WorldCity[] => {
  return WORLD_CITIES.filter(city => city[feature]);
};

export const getTopCitiesByEconomicIndex = (count: number = 20): WorldCity[] => {
  return [...WORLD_CITIES].sort((a, b) => b.economicIndex - a.economicIndex).slice(0, count);
};

export const CONTINENTS = ['Europe', 'North America', 'South America', 'Asia', 'Oceania', 'Africa'];

export const COUNTRY_FLAGS: Record<string, string> = {
  FR: "🇫🇷", GB: "🇬🇧", DE: "🇩🇪", ES: "🇪🇸", IT: "🇮🇹", NL: "🇳🇱", BE: "🇧🇪", CH: "🇨🇭", AT: "🇦🇹",
  PL: "🇵🇱", CZ: "🇨🇿", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰", FI: "🇫🇮", IE: "🇮🇪", PT: "🇵🇹", GR: "🇬🇷",
  RU: "🇷🇺", US: "🇺🇸", CA: "🇨🇦", MX: "🇲🇽", BR: "🇧🇷", AR: "🇦🇷", CO: "🇨🇴", CL: "🇨🇱", PE: "🇵🇪",
  JP: "🇯🇵", KR: "🇰🇷", CN: "🇨🇳", HK: "🇭🇰", SG: "🇸🇬", IN: "🇮🇳", TH: "🇹🇭", MY: "🇲🇾", ID: "🇮🇩",
  PH: "🇵🇭", VN: "🇻🇳", TW: "🇹🇼", AE: "🇦🇪", QA: "🇶🇦", SA: "🇸🇦", IL: "🇮🇱", AU: "🇦🇺", NZ: "🇳🇿",
  ZA: "🇿🇦", EG: "🇪🇬", KE: "🇰🇪", NG: "🇳🇬", MA: "🇲🇦", GH: "🇬🇭", ET: "🇪🇹"
};
