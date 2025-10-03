
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // ISO string format
  description: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface UserProfile {
  name: string;
  photo: string | null; // Base64 string
}

export enum View {
  DASHBOARD = 'dashboard',
  REPORTS = 'reports',
}

export enum ReportPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}
