
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, ReportPeriod } from '../types';
import { getFinancialSummary } from '../services/geminiService';
import { AiIcon } from './icons';

interface ReportsProps {
  transactions: Transaction[];
}

interface GroupedTransactions {
  [key: string]: Transaction[];
}

export const Reports: React.FC<ReportsProps> = ({ transactions }) => {
  const [period, setPeriod] = useState<ReportPeriod>(ReportPeriod.MONTHLY);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      if (period === ReportPeriod.DAILY) {
        return transactionDate.toDateString() === now.toDateString();
      }
      if (period === ReportPeriod.WEEKLY) {
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return transactionDate >= weekStart && transactionDate <= weekEnd;
      }
      if (period === ReportPeriod.MONTHLY) {
        return transactionDate.getFullYear() === now.getFullYear() && transactionDate.getMonth() === now.getMonth();
      }
      return true;
    });
  }, [transactions, period]);

  const totalIncome = filteredTransactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const groupedByCategory = filteredTransactions.reduce((acc, t) => {
    (acc[t.category] = acc[t.category] || []).push(t);
    return acc;
  }, {} as GroupedTransactions);

  const handleGenerateSummary = async () => {
    setIsLoadingAi(true);
    setAiSummary('');
    const periodName = period === ReportPeriod.DAILY ? 'اليوم' : period === ReportPeriod.WEEKLY ? 'الأسبوع' : 'الشهر';
    const summary = await getFinancialSummary(filteredTransactions, `هذا ${periodName}`);
    setAiSummary(summary);
    setIsLoadingAi(false);
  };
  
  const periodNames = {
      [ReportPeriod.DAILY]: 'يومي',
      [ReportPeriod.WEEKLY]: 'أسبوعي',
      [ReportPeriod.MONTHLY]: 'شهري',
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-center items-center gap-2 mb-4">
          {Object.values(ReportPeriod).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-semibold ${period === p ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`}
            >
              {periodNames[p]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-700">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-800">{totalIncome.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="p-4 bg-red-100 rounded-lg">
                <p className="text-sm text-red-700">إجمالي المصروفات</p>
                <p className="text-2xl font-bold text-red-800">{totalExpense.toLocaleString('ar-EG')} ج.م</p>
            </div>
            <div className="p-4 bg-indigo-100 rounded-lg">
                <p className="text-sm text-indigo-700">الصافي</p>
                <p className="text-2xl font-bold text-indigo-800">{(totalIncome - totalExpense).toLocaleString('ar-EG')} ج.م</p>
            </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-xl font-bold mb-2">الملخص الذكي</h3>
        <button 
          onClick={handleGenerateSummary}
          disabled={isLoadingAi}
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 flex items-center justify-center gap-2 disabled:bg-indigo-300"
        >
          <AiIcon className="w-5 h-5"/>
          {isLoadingAi ? 'جاري التحليل...' : 'احصل على تحليل ذكي لوضعك المالي'}
        </button>
        {aiSummary && (
          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg whitespace-pre-wrap">
            <p className="text-gray-800">{aiSummary}</p>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">تفاصيل حسب الفئة</h3>
        {Object.keys(groupedByCategory).length === 0 ? (
          <p className="text-gray-500">لا توجد معاملات لهذه الفترة.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {Object.entries(groupedByCategory).map(([category, items]) => {
              const categoryTotal = items.reduce((sum, i) => sum + i.amount, 0);
              const type = items[0].type;
              return (
                <li key={category} className="py-3">
                  <div onClick={() => setSelectedCategory(selectedCategory === category ? null : category)} className="cursor-pointer flex justify-between items-center">
                    <span className="font-semibold">{category}</span>
                    <span className={`font-bold ${type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                      {categoryTotal.toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                  {selectedCategory === category && (
                    <ul className="mt-2 pr-4 border-r-2 border-indigo-200">
                      {items.map(item => (
                        <li key={item.id} className="flex justify-between items-center py-1">
                           <span className="text-sm text-gray-600">{new Date(item.date).toLocaleDateString('ar-EG')} - {item.description || 'لا يوجد وصف'}</span>
                           <span className={`text-sm font-medium ${type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                             {item.amount.toLocaleString('ar-EG')} ج.م
                           </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
