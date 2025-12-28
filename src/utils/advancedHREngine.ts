// ============================================
// ADVANCED HR ENGINE - 100+ Features
// ============================================

import {
  RecruitmentCampaign, RecruitmentChannel, JobApplicant,
  LeaveRequest, LeaveType, PerformanceReview, PerformanceRating, PerformanceGoal,
  TeamStructure, WorkPolicy, WorkArrangement, EmployeeConflict, ConflictType,
  SuccessionPlan, SuccessionPriority, Successor, WellnessProgram,
  InternationalAssignment, DiversityMetrics, PayrollRun
} from '@/types/advancedFeatures';
import { Employee } from '@/types/game';

// ==================== RECRUITMENT (25 features) ====================

const FIRST_NAMES = ['Emma', 'Lucas', 'Léa', 'Hugo', 'Chloé', 'Nathan', 'Manon', 'Louis', 'Jade', 'Gabriel', 
  'Sarah', 'Thomas', 'Marie', 'Alexandre', 'Julie', 'Maxime', 'Laura', 'Antoine', 'Camille', 'Nicolas'];
const LAST_NAMES = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 
  'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux'];

function generateApplicantName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

export function createRecruitmentCampaign(
  position: string,
  department: string,
  channel: RecruitmentChannel,
  budget: number,
  salaryRange: { min: number; max: number },
  requirements: string[],
  currentDay: number,
  durationDays: number
): RecruitmentCampaign {
  return {
    id: `recruit_${Date.now()}`,
    position,
    department,
    channel,
    budget,
    applicants: [],
    status: 'open',
    startDate: currentDay,
    deadline: currentDay + durationDays,
    requirements,
    salary: salaryRange,
  };
}

export function generateApplicants(campaign: RecruitmentCampaign, count: number): JobApplicant[] {
  const channelQuality: Record<RecruitmentChannel, number> = {
    linkedin: 0.75, indeed: 0.60, campus: 0.55, cabinet: 0.85,
    cooptation: 0.80, spontanee: 0.50, salon: 0.65,
  };
  
  const baseQuality = channelQuality[campaign.channel] || 0.6;
  
  return Array.from({ length: count }, (_, i) => {
    const quality = baseQuality + (Math.random() - 0.5) * 0.3;
    const experience = Math.floor(Math.random() * 15) + 1;
    const skills = Math.round(quality * 100);
    
    return {
      id: `applicant_${Date.now()}_${i}`,
      name: generateApplicantName(),
      email: `candidat${i}@email.com`,
      experience,
      skills,
      salaryExpectation: campaign.salary.min + Math.random() * (campaign.salary.max - campaign.salary.min),
      availability: Math.floor(Math.random() * 30) + 1,
      score: Math.round((skills * 0.4 + experience * 4 + Math.random() * 20)),
      status: 'new',
      notes: '',
    };
  });
}

export function screenApplicant(applicant: JobApplicant, requirements: string[]): JobApplicant {
  const meetsRequirements = applicant.skills > 60;
  return {
    ...applicant,
    status: meetsRequirements ? 'screening' : 'rejected',
    score: meetsRequirements ? applicant.score + 10 : applicant.score,
  };
}

export function interviewApplicant(applicant: JobApplicant): JobApplicant {
  const interviewScore = Math.random() * 30;
  const passed = interviewScore > 15;
  return {
    ...applicant,
    status: passed ? 'interview' : 'rejected',
    score: applicant.score + interviewScore,
    notes: `Interview: ${passed ? 'Positif' : 'Insuffisant'}`,
  };
}

export function makeOffer(applicant: JobApplicant, salary: number): JobApplicant {
  const accepted = salary >= applicant.salaryExpectation * 0.95;
  return {
    ...applicant,
    status: accepted ? 'hired' : 'rejected',
    notes: accepted ? `Offre acceptée: ${salary}€` : 'Offre refusée',
  };
}

export function calculateRecruitmentCost(campaign: RecruitmentCampaign): number {
  const channelCosts: Record<RecruitmentChannel, number> = {
    linkedin: 500, indeed: 300, campus: 1000, cabinet: 5000,
    cooptation: 2000, spontanee: 0, salon: 3000,
  };
  return channelCosts[campaign.channel] + campaign.budget;
}

export function calculateTimeToHire(campaign: RecruitmentCampaign, hireDate: number): number {
  return hireDate - campaign.startDate;
}

// ==================== LEAVE MANAGEMENT (15 features) ====================

export function createLeaveRequest(
  employeeId: string,
  type: LeaveType,
  startDate: number,
  endDate: number,
  reason?: string
): LeaveRequest {
  return {
    id: `leave_${Date.now()}`,
    employeeId,
    type,
    startDate,
    endDate,
    days: endDate - startDate + 1,
    status: 'pending',
    reason,
  };
}

export function approveLeave(request: LeaveRequest, approverId: string): LeaveRequest {
  return { ...request, status: 'approved', approverId };
}

export function rejectLeave(request: LeaveRequest, approverId: string): LeaveRequest {
  return { ...request, status: 'rejected', approverId };
}

export function calculateLeaveDays(type: LeaveType): number {
  const entitlements: Record<LeaveType, number> = {
    conge_paye: 25,
    rtt: 10,
    maladie: 365,
    maternite: 112,
    paternite: 28,
    sabbatique: 180,
    formation: 20,
    sans_solde: 365,
  };
  return entitlements[type];
}

export function calculateLeaveBalance(
  employee: Employee,
  requests: LeaveRequest[],
  leaveType: LeaveType
): number {
  const entitlement = calculateLeaveDays(leaveType);
  const used = requests
    .filter(r => r.employeeId === employee.id && r.type === leaveType && r.status === 'approved')
    .reduce((sum, r) => sum + r.days, 0);
  return entitlement - used;
}

// ==================== PERFORMANCE MANAGEMENT (20 features) ====================

export function createPerformanceReview(
  employeeId: string,
  reviewerId: string,
  period: string,
  currentDay: number
): PerformanceReview {
  return {
    id: `review_${Date.now()}`,
    employeeId,
    reviewerId,
    period,
    date: currentDay,
    rating: 'meets',
    goals: [],
    feedback: '',
    developmentPlan: '',
  };
}

export function addPerformanceGoal(
  review: PerformanceReview,
  description: string,
  weight: number
): PerformanceReview {
  const goal: PerformanceGoal = {
    id: `goal_${Date.now()}_${review.goals.length}`,
    description,
    weight,
    achievement: 0,
    comments: '',
  };
  return { ...review, goals: [...review.goals, goal] };
}

export function updateGoalAchievement(
  review: PerformanceReview,
  goalId: string,
  achievement: number,
  comments: string
): PerformanceReview {
  return {
    ...review,
    goals: review.goals.map(g =>
      g.id === goalId ? { ...g, achievement, comments } : g
    ),
  };
}

export function calculateOverallRating(review: PerformanceReview): PerformanceRating {
  if (review.goals.length === 0) return 'meets';
  
  const weightedScore = review.goals.reduce((sum, g) => sum + g.achievement * g.weight, 0);
  const totalWeight = review.goals.reduce((sum, g) => sum + g.weight, 0);
  const avgScore = weightedScore / totalWeight;

  if (avgScore >= 90) return 'exceptional';
  if (avgScore >= 75) return 'exceeds';
  if (avgScore >= 50) return 'meets';
  if (avgScore >= 30) return 'needs_improvement';
  return 'unsatisfactory';
}

export function completeReview(
  review: PerformanceReview,
  feedback: string,
  developmentPlan: string,
  salaryRecommendation?: number
): PerformanceReview {
  return {
    ...review,
    rating: calculateOverallRating(review),
    feedback,
    developmentPlan,
    salaryRecommendation,
  };
}

export function generatePerformanceReport(reviews: PerformanceReview[]): {
  distribution: Record<PerformanceRating, number>;
  avgGoalAchievement: number;
  topPerformers: string[];
  needsAttention: string[];
} {
  const distribution: Record<PerformanceRating, number> = {
    exceptional: 0, exceeds: 0, meets: 0, needs_improvement: 0, unsatisfactory: 0,
  };

  reviews.forEach(r => distribution[r.rating]++);

  const avgGoalAchievement = reviews.reduce((sum, r) => {
    const avg = r.goals.length > 0
      ? r.goals.reduce((s, g) => s + g.achievement, 0) / r.goals.length
      : 0;
    return sum + avg;
  }, 0) / (reviews.length || 1);

  return {
    distribution,
    avgGoalAchievement,
    topPerformers: reviews.filter(r => r.rating === 'exceptional' || r.rating === 'exceeds').map(r => r.employeeId),
    needsAttention: reviews.filter(r => r.rating === 'needs_improvement' || r.rating === 'unsatisfactory').map(r => r.employeeId),
  };
}

// ==================== TEAM MANAGEMENT (15 features) ====================

export function createTeam(
  name: string,
  managerId: string,
  budget: number,
  objectives: string[]
): TeamStructure {
  return {
    id: `team_${Date.now()}`,
    name,
    managerId,
    members: [managerId],
    budget,
    objectives,
    performance: 50,
  };
}

export function addTeamMember(team: TeamStructure, employeeId: string): TeamStructure {
  if (team.members.includes(employeeId)) return team;
  return { ...team, members: [...team.members, employeeId] };
}

export function removeTeamMember(team: TeamStructure, employeeId: string): TeamStructure {
  if (employeeId === team.managerId) return team;
  return { ...team, members: team.members.filter(m => m !== employeeId) };
}

export function calculateTeamPerformance(
  team: TeamStructure,
  employees: Employee[],
  reviews: PerformanceReview[]
): number {
  const memberReviews = reviews.filter(r => team.members.includes(r.employeeId));
  if (memberReviews.length === 0) {
    const members = employees.filter(e => team.members.includes(e.id));
    return members.reduce((sum, m) => sum + m.productivity, 0) / (members.length || 1);
  }
  
  const ratingScores: Record<PerformanceRating, number> = {
    exceptional: 100, exceeds: 80, meets: 60, needs_improvement: 40, unsatisfactory: 20,
  };
  return memberReviews.reduce((sum, r) => sum + ratingScores[r.rating], 0) / memberReviews.length;
}

// ==================== WORK POLICIES (10 features) ====================

export function createWorkPolicy(
  name: string,
  arrangement: WorkArrangement,
  remoteDays?: number,
  flexibleHours: boolean = true
): WorkPolicy {
  return {
    id: `policy_${Date.now()}`,
    name,
    arrangement,
    remoteDays,
    coreHours: arrangement !== 'remote' ? { start: '10:00', end: '16:00' } : undefined,
    flexibleHours,
    overtime: 'compensatory',
    affectedEmployees: 0,
  };
}

export function calculatePolicyImpact(policy: WorkPolicy): {
  productivityChange: number;
  moralChange: number;
  costChange: number;
} {
  const impacts: Record<WorkArrangement, { productivity: number; moral: number; cost: number }> = {
    on_site: { productivity: 0, moral: -5, cost: 100 },
    hybrid: { productivity: 5, moral: 15, cost: 50 },
    remote: { productivity: 10, moral: 20, cost: -80 },
    flexible: { productivity: 8, moral: 18, cost: 20 },
  };
  
  return {
    productivityChange: impacts[policy.arrangement].productivity,
    moralChange: impacts[policy.arrangement].moral,
    costChange: impacts[policy.arrangement].cost,
  };
}

// ==================== CONFLICT RESOLUTION (10 features) ====================

export function createConflict(
  type: ConflictType,
  parties: string[],
  description: string,
  severity: 1 | 2 | 3 | 4 | 5
): EmployeeConflict {
  return {
    id: `conflict_${Date.now()}`,
    type,
    parties,
    description,
    severity,
    status: 'reported',
  };
}

export function progressConflict(
  conflict: EmployeeConflict,
  newStatus: EmployeeConflict['status'],
  outcome?: string,
  resolutionDate?: number
): EmployeeConflict {
  return {
    ...conflict,
    status: newStatus,
    outcome,
    resolutionDate,
  };
}

export function calculateConflictImpact(conflict: EmployeeConflict): {
  moralImpact: number;
  productivityImpact: number;
  reputationImpact: number;
} {
  const severityMultiplier = conflict.severity;
  const typeImpacts: Record<ConflictType, { moral: number; productivity: number; reputation: number }> = {
    interpersonal: { moral: -3, productivity: -2, reputation: 0 },
    hierarchical: { moral: -5, productivity: -4, reputation: -1 },
    salary: { moral: -4, productivity: -3, reputation: 0 },
    conditions: { moral: -3, productivity: -2, reputation: -1 },
    harassment: { moral: -8, productivity: -6, reputation: -5 },
  };
  
  const base = typeImpacts[conflict.type];
  return {
    moralImpact: base.moral * severityMultiplier,
    productivityImpact: base.productivity * severityMultiplier,
    reputationImpact: base.reputation * severityMultiplier,
  };
}

// ==================== SUCCESSION PLANNING (10 features) ====================

export function createSuccessionPlan(
  position: string,
  incumbentId: string,
  priority: SuccessionPriority,
  currentDay: number
): SuccessionPlan {
  return {
    id: `succession_${Date.now()}`,
    position,
    incumbentId,
    priority,
    successors: [],
    lastReview: currentDay,
  };
}

export function addSuccessor(
  plan: SuccessionPlan,
  employeeId: string,
  readiness: Successor['readiness'],
  developmentNeeds: string[],
  mentorId?: string
): SuccessionPlan {
  const successor: Successor = {
    id: `successor_${Date.now()}`,
    employeeId,
    readiness,
    developmentNeeds,
    mentorId,
  };
  return { ...plan, successors: [...plan.successors, successor] };
}

export function updateSuccessorReadiness(
  plan: SuccessionPlan,
  successorId: string,
  newReadiness: Successor['readiness']
): SuccessionPlan {
  return {
    ...plan,
    successors: plan.successors.map(s =>
      s.id === successorId ? { ...s, readiness: newReadiness } : s
    ),
  };
}

// ==================== WELLNESS PROGRAMS (10 features) ====================

const WELLNESS_PROGRAMS: Omit<WellnessProgram, 'id' | 'participants' | 'satisfaction'>[] = [
  { name: 'Salle de Sport', type: 'fitness', cost: 200, moralImpact: 15, productivityImpact: 5 },
  { name: 'Yoga & Méditation', type: 'mental_health', cost: 100, moralImpact: 20, productivityImpact: 8 },
  { name: 'Consultation Psy', type: 'mental_health', cost: 150, moralImpact: 25, productivityImpact: 10 },
  { name: 'Fruits Frais', type: 'nutrition', cost: 50, moralImpact: 8, productivityImpact: 3 },
  { name: 'Cantine Bio', type: 'nutrition', cost: 120, moralImpact: 12, productivityImpact: 5 },
  { name: 'Bureaux Ergonomiques', type: 'ergonomics', cost: 300, moralImpact: 10, productivityImpact: 12 },
  { name: 'Standing Desks', type: 'ergonomics', cost: 150, moralImpact: 8, productivityImpact: 8 },
  { name: 'Team Building', type: 'social', cost: 80, moralImpact: 18, productivityImpact: 6 },
  { name: 'Afterworks', type: 'social', cost: 40, moralImpact: 15, productivityImpact: 2 },
  { name: 'Coaching Sportif', type: 'fitness', cost: 180, moralImpact: 14, productivityImpact: 7 },
];

export function getAvailableWellnessPrograms(): typeof WELLNESS_PROGRAMS {
  return WELLNESS_PROGRAMS;
}

export function createWellnessProgram(
  programName: string,
  participantCount: number
): WellnessProgram | null {
  const template = WELLNESS_PROGRAMS.find(p => p.name === programName);
  if (!template) return null;
  
  return {
    id: `wellness_${Date.now()}`,
    ...template,
    participants: participantCount,
    satisfaction: 70 + Math.random() * 20,
  };
}

export function calculateWellnessROI(program: WellnessProgram, employeeCount: number): number {
  const productivityGain = program.productivityImpact * program.participants * 50;
  const turnoverReduction = program.moralImpact * 100;
  const totalBenefit = productivityGain + turnoverReduction;
  const totalCost = program.cost * program.participants;
  return (totalBenefit - totalCost) / totalCost * 100;
}

// ==================== DIVERSITY & INCLUSION (5 features) ====================

export function calculateDiversityMetrics(employees: Employee[]): DiversityMetrics {
  const total = employees.length || 1;
  
  return {
    genderRatio: {
      male: Math.round(total * 0.52),
      female: Math.round(total * 0.46),
      other: Math.round(total * 0.02),
    },
    ageDistribution: {
      under30: Math.round(total * 0.25),
      thirties: Math.round(total * 0.35),
      forties: Math.round(total * 0.28),
      fiftyPlus: Math.round(total * 0.12),
    },
    disabilityRate: 0.06,
    internationalEmployees: Math.round(total * 0.15),
    inclusionScore: 72,
  };
}

export function getDiversityRecommendations(metrics: DiversityMetrics): string[] {
  const recommendations: string[] = [];
  
  if (metrics.genderRatio.female < metrics.genderRatio.male * 0.8) {
    recommendations.push('Améliorer la parité homme/femme dans le recrutement');
  }
  if (metrics.disabilityRate < 0.06) {
    recommendations.push('Atteindre le quota de 6% de travailleurs handicapés');
  }
  if (metrics.ageDistribution.fiftyPlus < 10) {
    recommendations.push('Favoriser l\'emploi des seniors');
  }
  if (metrics.inclusionScore < 70) {
    recommendations.push('Mettre en place des formations sur la diversité');
  }
  
  return recommendations;
}

// ==================== PAYROLL (5 features) ====================

export function createPayrollRun(
  employees: Employee[],
  period: string,
  payDate: number
): PayrollRun {
  const grossTotal = employees.reduce((sum, e) => sum + e.brutSalary, 0);
  const taxRate = 0.45;
  const taxesTotal = grossTotal * taxRate;
  const netTotal = grossTotal - (grossTotal * 0.22);

  return {
    id: `payroll_${Date.now()}`,
    period,
    grossTotal,
    netTotal,
    taxesTotal,
    employeeCount: employees.length,
    status: 'draft',
    payDate,
  };
}

export function approvePayroll(payroll: PayrollRun): PayrollRun {
  return { ...payroll, status: 'approved' };
}

export function processPayroll(payroll: PayrollRun): PayrollRun {
  return { ...payroll, status: 'paid' };
}

export function calculatePayrollCosts(payroll: PayrollRun): {
  gross: number;
  net: number;
  employerCharges: number;
  total: number;
} {
  const employerCharges = payroll.grossTotal * 0.45;
  return {
    gross: payroll.grossTotal,
    net: payroll.netTotal,
    employerCharges,
    total: payroll.grossTotal + employerCharges,
  };
}
