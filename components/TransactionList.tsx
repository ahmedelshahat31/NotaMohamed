
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  title: string;
  limit?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, title, limit }) => {
  const transactionsToDisplay = limit ? transactions.slice(0, limit) : transactions;

  if (transactionsToDisplay.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500">لا توجد معاملات لعرضها.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>
      <ul className="divide-y divide-gray-200">
        {transactionsToDisplay.map((transaction) => (
          <li key={transaction.id} className="py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">{transaction.category}</p>
              <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString('ar-EG')}</p>
            </div>
            <p className={`font-bold text-lg ${transaction.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.type === TransactionType.INCOME ? '+' : '-'}
              {transaction.amount.toLocaleString('ar-EG')} ج.م
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
