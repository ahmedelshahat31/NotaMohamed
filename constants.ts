
import { Category, TransactionType } from './types';

export const INITIAL_INCOME_CATEGORIES: Category[] = [
  { id: 'inc-1', name: 'راتب', type: TransactionType.INCOME },
  { id: 'inc-2', name: 'أعمال حرة', type: TransactionType.INCOME },
  { id: 'inc-3', name: 'هدايا', type: TransactionType.INCOME },
];

export const INITIAL_EXPENSE_CATEGORIES: Category[] = [
  { id: 'exp-1', name: 'طعام ومشروبات', type: TransactionType.EXPENSE },
  { id: 'exp-2', name: 'مواصلات', type: TransactionType.EXPENSE },
  { id: 'exp-3', name: 'فواتير', type: TransactionType.EXPENSE },
  { id: 'exp-4', name: 'تسوق', type: TransactionType.EXPENSE },
  { id: 'exp-5', name: 'ترفيه', type: TransactionType.EXPENSE },
];
