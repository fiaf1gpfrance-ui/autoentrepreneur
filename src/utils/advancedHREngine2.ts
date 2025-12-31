import {
  PerformanceReview,
  PerformanceRating,
  Goal,
  CareerPath,
  RecruitmentCampaign,
  JobApplication,
  LeaveRequest,
  TimeTracking,
  Payroll,
  RecruitmentChannel,
} from '@/types/advancedSystems';
import { Employee } from '@/types/game';

// Performance review templates
export const PERFORMANCE_CRITERIA = {
  productivity: { weight: 25, description: 'Productivité et efficacité' },
  quality: { weight: 20, description: 'Qualité du travail' },
  teamwork: { weight: 15, description: 'Travail en équipe' },
  communication: { weight: 15, description: 'Communication' },
  initiative: { weight: 15, description: 'Initiative et proactivité' },
  attendance: { weight: 10, description: 'Assiduité et ponctualité' },
};

export const RECRUITMENT_CHANNELS: Record<string, RecruitmentChannel> = {
  linkedin: { name: 'linkedin', cost: 500, applicationsReceived: 0, conversionRate: 15 },
  indeed: { name: 'indeed', cost: 300, applicationsReceived: 0, conversionRate: 10 },
  website: { name: 'website', cost: 0, applicationsReceived: 0, conversionRate: 20 },
  referral: { name: 'referral', cost: 1000, applicationsReceived: 0, conversionRate: 40 },
  headhunter: { name: 'headhunter', cost: 5000, applicationsReceived: 0, conversionRate: 50 },
  job_fair: { name: 'job_fair', cost: 2000, applicationsReceived: 0, conversionRate: 25 },
};

export function createPerformanceReview(
  employeeId: string,
  reviewerId: string,
  periodStart: number,
  periodEnd: number,
  goals: Goal[],
  currentDay: number
): PerformanceReview {
  const completedGoals = goals.filter(g => g.status === 'completed');
  const avgCompletion = goals.length > 0 
    ? completedGoals.length / goals.length 
    : 0.5;
  
  const rating = Math.min(5, Math.max(1, Math.round(avgCompletion * 4 + 1))) as PerformanceRating;
  
  return {
    id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    reviewerId,
    period: { start: periodStart, end: periodEnd },
    rating,
    goals,
    strengths: generateStrengths(rating),
    improvements: generateImprovements(rating),
    comments: '',
    promotionRecommended: rating >= 4,
    date: currentDay,
  };
}

function generateStrengths(rating: PerformanceRating): string[] {
  const allStrengths = [
    'Excellent travail en équipe',
    'Communication efficace',
    'Résolution de problèmes',
    'Respect des délais',
    'Qualité du travail',
    'Initiative',
    'Leadership naturel',
    'Adaptabilité',
  ];
  
  const count = Math.min(rating, 4);
  return allStrengths.slice(0, count);
}

function generateImprovements(rating: PerformanceRating): string[] {
  const allImprovements = [
    'Améliorer la gestion du temps',
    'Développer les compétences techniques',
    'Renforcer la communication écrite',
    'Prendre plus d\'initiatives',
    'Améliorer la collaboration',
  ];
  
  const count = Math.max(1, 5 - rating);
  return allImprovements.slice(0, count);
}

export function createGoal(
  description: string,
  target: number,
  deadline: number,
  weight: number
): Goal {
  return {
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    description,
    target,
    current: 0,
    deadline,
    status: 'not_started',
    weight,
  };
}

export function updateGoalProgress(goal: Goal, progress: number, currentDay: number): Goal {
  const newCurrent = Math.min(goal.target, goal.current + progress);
  let status = goal.status;
  
  if (newCurrent >= goal.target) {
    status = 'completed';
  } else if (currentDay > goal.deadline && status !== 'completed') {
    status = 'overdue';
  } else if (newCurrent > 0) {
    status = 'in_progress';
  }
  
  return { ...goal, current: newCurrent, status };
}

export function createCareerPath(
  employeeId: string,
  currentRole: string,
  targetRole: string,
  timeframe: number
): CareerPath {
  const steps = generateCareerSteps(currentRole, targetRole);
  
  return {
    id: `career_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    currentRole,
    targetRole,
    steps,
    estimatedTimeframe: timeframe,
    progress: 0,
  };
}

function generateCareerSteps(currentRole: string, targetRole: string): CareerPath['steps'] {
  return [
    {
      id: 'step_1',
      title: 'Formation technique',
      description: 'Acquérir les compétences techniques nécessaires',
      requirements: ['Formation certifiante', '40 heures de formation'],
      completed: false,
    },
    {
      id: 'step_2',
      title: 'Expérience projet',
      description: 'Participer à des projets stratégiques',
      requirements: ['2 projets majeurs', 'Évaluation positive'],
      completed: false,
    },
    {
      id: 'step_3',
      title: 'Mentorat',
      description: 'Être mentoré par un senior',
      requirements: ['6 mois de mentorat', 'Validation du mentor'],
      completed: false,
    },
    {
      id: 'step_4',
      title: 'Évaluation finale',
      description: 'Passer l\'évaluation de promotion',
      requirements: ['Entretien réussi', 'Validation RH'],
      completed: false,
    },
  ];
}

export function createRecruitmentCampaign(
  role: string,
  department: string,
  salaryMin: number,
  salaryMax: number,
  requirements: string[],
  budget: number,
  currentDay: number,
  deadline: number
): RecruitmentCampaign {
  return {
    id: `recruit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    role,
    department,
    salary: { min: salaryMin, max: salaryMax },
    requirements,
    applications: [],
    status: 'draft',
    budget,
    spent: 0,
    startDate: currentDay,
    deadline,
    channels: [],
  };
}

export function generateApplications(
  campaign: RecruitmentCampaign,
  channels: RecruitmentChannel['name'][],
  currentDay: number
): JobApplication[] {
  const applications: JobApplication[] = [];
  
  channels.forEach(channel => {
    const channelConfig = RECRUITMENT_CHANNELS[channel];
    const numApplications = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numApplications; i++) {
      const experience = Math.floor(Math.random() * 15) + 1;
      const skills = 40 + Math.floor(Math.random() * 50);
      
      applications.push({
        id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        candidateName: generateCandidateName(),
        email: `candidate${Math.random().toString(36).substr(2, 6)}@email.com`,
        experience,
        skills,
        salaryExpectation: campaign.salary.min + Math.random() * (campaign.salary.max - campaign.salary.min),
        status: 'new',
        score: skills + experience * 2,
        interviewNotes: [],
        appliedAt: currentDay,
      });
    }
  });
  
  return applications;
}

function generateCandidateName(): string {
  const firstNames = ['Marc', 'Sophie', 'Thomas', 'Julie', 'Pierre', 'Marie', 'Nicolas', 'Emma'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Moreau'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

export function screenApplication(app: JobApplication, campaign: RecruitmentCampaign): JobApplication {
  const meetsRequirements = app.skills >= 60 && app.experience >= 2;
  const salaryFit = app.salaryExpectation <= campaign.salary.max * 1.1;
  
  const newStatus = meetsRequirements && salaryFit ? 'screening' : 'rejected';
  const newScore = app.score + (meetsRequirements ? 10 : 0) + (salaryFit ? 10 : 0);
  
  return { ...app, status: newStatus, score: newScore };
}

export function createLeaveRequest(
  employeeId: string,
  type: LeaveRequest['type'],
  startDate: number,
  endDate: number,
  reason?: string
): LeaveRequest {
  return {
    id: `leave_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    type,
    startDate,
    endDate,
    days: Math.ceil((endDate - startDate) / 1),
    status: 'pending',
    reason,
  };
}

export function recordTimeTracking(
  employeeId: string,
  date: number,
  hoursWorked: number,
  overtime: number,
  tasks: string[]
): TimeTracking {
  const breaks = hoursWorked >= 6 ? 0.5 : 0;
  const productivity = 70 + Math.random() * 30;
  
  return {
    id: `time_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    date,
    hoursWorked,
    overtime,
    breaks,
    productivity,
    tasks,
  };
}

export function calculatePayroll(
  employee: Employee,
  month: number,
  year: number,
  overtime: number,
  bonus: number,
  commissions: number
): Payroll {
  const baseSalary = employee.brutSalary;
  const overtimePay = overtime * (baseSalary / 151.67) * 1.25;
  
  const deductions = [
    { type: 'Sécurité sociale', amount: baseSalary * 0.075 },
    { type: 'Retraite complémentaire', amount: baseSalary * 0.031 },
    { type: 'Assurance chômage', amount: baseSalary * 0.024 },
    { type: 'CSG/CRDS', amount: baseSalary * 0.098 },
  ];
  
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const grossPay = baseSalary + overtimePay + bonus + commissions;
  const taxes = grossPay * 0.22;
  const netPay = grossPay - totalDeductions - taxes;
  
  return {
    id: `payroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId: employee.id,
    period: { month, year },
    baseSalary,
    overtime: overtimePay,
    bonus,
    commissions,
    deductions,
    taxes,
    netPay,
    status: 'pending',
  };
}

export function calculateLeaveBalance(
  timeTracking: TimeTracking[],
  leaveRequests: LeaveRequest[],
  startDate: number
): {
  earnedDays: number;
  usedDays: number;
  remainingDays: number;
  sickDays: number;
} {
  const workedMonths = timeTracking.filter(t => t.date >= startDate).length / 20;
  const earnedDays = Math.floor(workedMonths * 2.5);
  
  const approvedLeave = leaveRequests.filter(l => l.status === 'approved');
  const usedDays = approvedLeave
    .filter(l => l.type === 'vacation')
    .reduce((sum, l) => sum + l.days, 0);
  const sickDays = approvedLeave
    .filter(l => l.type === 'sick')
    .reduce((sum, l) => sum + l.days, 0);
  
  return {
    earnedDays,
    usedDays,
    remainingDays: earnedDays - usedDays,
    sickDays,
  };
}

export function calculateTurnoverRate(
  hiredCount: number,
  terminatedCount: number,
  avgHeadcount: number
): number {
  if (avgHeadcount === 0) return 0;
  return ((hiredCount + terminatedCount) / 2 / avgHeadcount) * 100;
}

export function calculateAbsenteeismRate(
  totalAbsentDays: number,
  totalWorkDays: number,
  employeeCount: number
): number {
  const expectedWorkDays = totalWorkDays * employeeCount;
  if (expectedWorkDays === 0) return 0;
  return (totalAbsentDays / expectedWorkDays) * 100;
}
