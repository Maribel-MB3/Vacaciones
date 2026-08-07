export type ViewMode = '1m' | '3m' | '6m' | '12m';

export type VacationType = 'vacation' | 'personal' | 'sick' | 'special' | 'remote';

export type VacationStatus = 'approved' | 'pending' | 'rejected';

export interface VacationRequest {
  id: string;
  employee: string;
  department: string;
  avatarColor?: string;
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  type: VacationType;
  status: VacationStatus;
  notes?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  avatarColor: string;
  annualAllowance: number;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

export interface FilterOptions {
  department: string;
  status: string;
  search: string;
  groupByDepartment: boolean;
}

export type FilterState = FilterOptions;
