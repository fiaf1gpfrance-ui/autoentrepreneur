import { z } from 'zod';
import type { Json } from '@/integrations/supabase/types';

// Maximum sizes to prevent storage abuse
const MAX_STRING_LENGTH = 500;
const MAX_ARRAY_LENGTH = 1000;
const MAX_HISTORY_LENGTH = 3650; // 10 years of daily history

// Basic validators
const safeString = z.string().max(MAX_STRING_LENGTH);
const safeNumber = z.number().finite();
const safeBoolean = z.boolean();

// Enum validators
const LegalStatusSchema = z.enum(['auto-entrepreneur', 'sarl', 'sas']);
const SectorSchema = z.enum(['tech', 'artisanat', 'services', 'industrie']);
const ContractTypeSchema = z.enum(['cdi', 'cdd', 'alternance']);
const EmployeeTraitSchema = z.enum(['syndicaliste', 'workaholic', 'creatif', 'rigoureux', 'leader', 'discret', 'negociateur', 'perfectionniste']);
const ProductPhaseSchema = z.enum(['rd', 'lancement', 'maturite', 'declin']);

// Simplified schemas for nested objects - using passthrough for flexibility
const EmployeeSchema = z.object({
  id: safeString,
  name: safeString,
  role: safeString,
  skills: safeNumber,
  moral: safeNumber,
  contractType: ContractTypeSchema,
  trait: EmployeeTraitSchema,
  brutSalary: safeNumber,
  hireDate: safeNumber,
  productivity: safeNumber,
}).passthrough();

const ProductSchema = z.object({
  id: safeString,
  name: safeString,
  phase: ProductPhaseSchema,
  rdCost: safeNumber,
  rdProgress: safeNumber,
  basePrice: safeNumber,
  currentPrice: safeNumber,
  quality: safeNumber,
  marketingBudget: safeNumber,
  salesVolume: safeNumber,
  phaseStartDay: safeNumber,
}).passthrough();

const TaxDeclarationSchema = z.object({
  type: z.enum(['tva', 'urssaf', 'is', 'cfe', 'cvae', 'taxe_apprentissage']),
  amount: safeNumber,
  dueDate: safeNumber,
  paid: safeBoolean,
}).passthrough();

const FinancialHistorySchema = z.object({
  day: safeNumber,
  treasury: safeNumber,
  revenue: safeNumber,
  expenses: safeNumber,
  netResult: safeNumber,
}).passthrough();

// Bank and financial schemas
const BankLoanSchema = z.object({
  id: safeString,
  amount: safeNumber,
  remainingAmount: safeNumber,
}).passthrough();

const InvestmentSchema = z.object({
  id: safeString,
  amount: safeNumber,
}).passthrough();

const BankAccountSchema = z.object({
  bankName: safeString,
  creditScore: safeNumber,
  loans: z.array(BankLoanSchema).max(MAX_ARRAY_LENGTH),
  investments: z.array(InvestmentSchema).max(MAX_ARRAY_LENGTH),
}).passthrough();

// Generic passthrough schemas for complex nested objects
const PropertySchema = z.object({
  id: safeString,
  name: safeString,
}).passthrough();

const SupplierSchema = z.object({
  id: safeString,
  name: safeString,
}).passthrough();

const ClientSchema = z.object({
  id: safeString,
  name: safeString,
}).passthrough();

const AchievementSchema = z.object({
  id: safeString,
  name: safeString,
  unlocked: safeBoolean,
}).passthrough();

const MissionSchema = z.object({
  id: safeString,
  title: safeString,
}).passthrough();

const CompetitorSchema = z.object({
  id: safeString,
  name: safeString,
}).passthrough();

// Main Company schema
export const CompanySchema = z.object({
  name: safeString.min(1, 'Company name is required'),
  legalStatus: LegalStatusSchema,
  sector: SectorSchema,
  capital: safeNumber.min(0),
  treasury: safeNumber,
  credibility: safeNumber.min(0).max(200),
  employees: z.array(EmployeeSchema).max(MAX_ARRAY_LENGTH),
  products: z.array(ProductSchema).max(MAX_ARRAY_LENGTH),
  taxDeclarations: z.array(TaxDeclarationSchema).max(MAX_ARRAY_LENGTH),
  monthlyRevenue: safeNumber,
  monthlyExpenses: safeNumber,
  tvaCollected: safeNumber,
  tvaDeductible: safeNumber,
  urssafDebt: safeNumber,
  isDebt: safeNumber,
  financialHistory: z.array(FinancialHistorySchema).max(MAX_HISTORY_LENGTH),
  bankAccount: BankAccountSchema,
  properties: z.array(PropertySchema).max(MAX_ARRAY_LENGTH),
  suppliers: z.array(SupplierSchema).max(MAX_ARRAY_LENGTH),
  inventory: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  clients: z.array(ClientSchema).max(MAX_ARRAY_LENGTH),
  invoices: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  legalCases: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  lawyers: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  intellectualProperty: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  socialBenefits: z.array(z.object({ type: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  unions: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  foreignMarkets: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  subsidiaries: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  achievements: z.array(AchievementSchema).max(MAX_ARRAY_LENGTH),
  missions: z.array(MissionSchema).max(MAX_ARRAY_LENGTH),
  competitors: z.array(CompetitorSchema).max(MAX_ARRAY_LENGTH),
  foundedDate: safeNumber,
  ceo: safeString,
  marketShare: safeNumber,
  reputation: safeNumber,
  innovationScore: safeNumber,
  totalAssets: safeNumber,
  totalLiabilities: safeNumber,
  marketingCampaigns: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  technologies: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  activeCrises: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  resolvedCrises: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
  coins: safeNumber.min(0),
  gems: safeNumber.min(0),
  lastDailyReward: safeNumber,
  dailyRewardStreak: safeNumber.min(0),
  purchasedItems: z.array(safeString).max(MAX_ARRAY_LENGTH),
  activeBoosts: z.array(z.object({ id: safeString }).passthrough()).max(MAX_ARRAY_LENGTH),
}).passthrough();

// Game State schema
export const GameStateSchema = z.object({
  day: safeNumber.int().min(1),
  month: safeNumber.int().min(1).max(12),
  year: safeNumber.int().min(2000).max(3000),
  isPaused: safeBoolean,
  speed: safeNumber.min(0).max(10),
  coins: safeNumber.min(0).optional(),
}).passthrough();

// Game Settings schema
export const GameSettingsSchema = z.object({
  difficulty: z.enum(['tutorial', 'easy', 'normal', 'hard', 'hardcore']),
  gameMode: z.enum(['sandbox', 'scenario', 'challenge', 'campaign']),
  founderType: z.enum(['entrepreneur', 'manager', 'technicien', 'commercial']),
  location: z.enum(['paris', 'lyon', 'marseille', 'bordeaux', 'lille', 'toulouse', 'nantes', 'strasbourg']),
  startingBonus: z.enum(['aucun', 'heritage', 'investisseur', 'subvention']),
  objective: z.enum(['survie', 'croissance', 'empire', 'exit', 'ipo']),
  legalStructure: z.enum(['auto-entrepreneur', 'eurl', 'sarl', 'sas', 'sasu', 'sa', 'sca', 'sci', 'scop', 'association']),
}).passthrough();

// Full Game Save schema
export const GameSaveSchema = z.object({
  id: safeString.optional(),
  save_name: safeString.min(1, 'Save name is required').max(100),
  company_data: CompanySchema,
  game_state: GameStateSchema,
  game_settings: GameSettingsSchema,
  play_time: safeNumber.min(0),
  is_auto_save: safeBoolean,
  created_at: safeString.optional(),
  updated_at: safeString.optional(),
});

// Result type for validation
export type ValidationResult<T> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

// Validation function with error handling
export function validateGameSave(data: unknown): ValidationResult<z.infer<typeof GameSaveSchema>> {
  try {
    const validated = GameSaveSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `Validation error: ${firstError.path.join('.')} - ${firstError.message}` 
      };
    }
    return { success: false, error: 'Unknown validation error' };
  }
}

// Individual validators for partial saves - returns Json-compatible data
export function validateCompanyData(data: unknown): ValidationResult<Json> {
  try {
    const validated = CompanySchema.parse(data);
    return { success: true, data: validated as unknown as Json };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `Company data error: ${firstError.path.join('.')} - ${firstError.message}` 
      };
    }
    return { success: false, error: 'Invalid company data' };
  }
}

export function validateGameState(data: unknown): ValidationResult<Json> {
  try {
    const validated = GameStateSchema.parse(data);
    return { success: true, data: validated as unknown as Json };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `Game state error: ${firstError.path.join('.')} - ${firstError.message}` 
      };
    }
    return { success: false, error: 'Invalid game state' };
  }
}

export function validateGameSettings(data: unknown): ValidationResult<Json> {
  try {
    const validated = GameSettingsSchema.parse(data);
    return { success: true, data: validated as unknown as Json };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return { 
        success: false, 
        error: `Game settings error: ${firstError.path.join('.')} - ${firstError.message}` 
      };
    }
    return { success: false, error: 'Invalid game settings' };
  }
}
