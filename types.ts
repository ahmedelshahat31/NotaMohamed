
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // ISO string format
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export type View = 'dashboard' | 'reports' | 'settings';
