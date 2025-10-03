
import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { AddTransactionModal } from './components/AddTransactionModal';
import { Transaction, Category, UserProfile, View, TransactionType } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { INITIAL_INCOME_CATEGORIES, INITIAL_EXPENSE_CATEGORIES } from './constants';
import { PlusIcon, BackupIcon, RestoreIcon } from './components/icons';

const App: React.FC = () => {
  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', {
    name: 'محمد طلبة',
    photo: null,
  });
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [incomeCategories, setIncomeCategories] = useLocalStorage<Category[]>('income-categories', INITIAL_INCOME_CATEGORIES);
  const [expenseCategories, setExpenseCategories] = useLocalStorage<Category[]>('expense-categories', INITIAL_EXPENSE_CATEGORIES);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const restoreInputRef = useRef<HTMLInputElement>(null);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: crypto.randomUUID() };
    if (category.type === TransactionType.INCOME) {
      setIncomeCategories(prev => [...prev, newCategory]);
    } else {
      setExpenseCategories(prev => [...prev, newCategory]);
    }
  };

  const handleBackup = () => {
    const data = {
      profile,
      transactions,
      incomeCategories,
      expenseCategories,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('تم إنشاء نسخة احتياطية بنجاح! تحقق من مجلد التنزيلات.');
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (confirm('هل أنت متأكد من أنك تريد استعادة البيانات؟ سيتم الكتابة فوق البيانات الحالية.')) {
            setProfile(data.profile);
            setTransactions(data.transactions);
            setIncomeCategories(data.incomeCategories);
            setExpenseCategories(data.expenseCategories);
            alert('تم استعادة البيانات بنجاح!');
          }
        } catch (error) {
          alert('ملف النسخ الاحتياطي غير صالح.');
        } finally {
          // Reset file input
          if(restoreInputRef.current) {
            restoreInputRef.current.value = "";
          }
        }
      };
      reader.readAsText(file);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      <Header profile={profile} setProfile={setProfile} activeView={activeView} setActiveView={setActiveView} />
      <main>
        {activeView === View.DASHBOARD && <Dashboard transactions={transactions} />}
        {activeView === View.REPORTS && <Reports transactions={transactions} />}
      </main>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTransaction={addTransaction}
        addCategory={addCategory}
        incomeCategories={incomeCategories}
        expenseCategories={expenseCategories}
      />
      
      <div className="fixed bottom-4 left-4 flex flex-col gap-3">
        <button onClick={handleBackup} className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition" title="نسخ احتياطي">
            <BackupIcon className="w-7 h-7" />
        </button>
        <button onClick={() => restoreInputRef.current?.click()} className="bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition" title="استعادة نسخة احتياطية">
            <RestoreIcon className="w-7 h-7" />
        </button>
         <input
              type="file"
              ref={restoreInputRef}
              className="hidden"
              accept="application/json"
              onChange={handleRestore}
            />
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition transform hover:scale-110"
        title="إضافة معاملة جديدة"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      <div className="fixed bottom-20 left-4 bg-yellow-100 border border-yellow-300 p-3 rounded-lg shadow-lg text-sm text-yellow-800 max-w-xs">
          <p className="font-bold">ملاحظات النسخ الاحتياطي:</p>
          <ul className="list-disc list-inside mt-1">
              <li>يتم حفظ بياناتك تلقائيًا في هذا المتصفح.</li>
              <li>استخدم زر "نسخ احتياطي" لحفظ ملف بياناتك على جهازك.</li>
              <li>استخدم "استعادة" لتحميل بيانات من ملف تم حفظه مسبقًا.</li>
          </ul>
      </div>

    </div>
  );
};

export default App;
