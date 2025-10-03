
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { TransactionList } from './TransactionList';

interface DashboardProps {
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">الرصيد الحالي</h2>
          <p className="text-4xl font-bold mt-2">{balance.toLocaleString('ar-EG')} ج.م</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">إجمالي الإيرادات</h2>
          <p className="text-4xl font-bold mt-2">{totalIncome.toLocaleString('ar-EG')} ج.م</p>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-red-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold">إجمالي المصروفات</h2>
          <p className="text-4xl font-bold mt-2">{totalExpense.toLocaleString('ar-EG')} ج.م</p>
        </div>
      </div>
      <TransactionList transactions={sortedTransactions} title="أحدث المعاملات" limit={10} />
    </div>
  );
};
