
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { CloseIcon } from './icons';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  incomeCategories: Category[];
  expenseCategories: Category[];
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  addTransaction,
  addCategory,
  incomeCategories,
  expenseCategories,
}) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = category;

    if (category === 'new' && newCategory.trim() !== '') {
      addCategory({ name: newCategory, type });
      finalCategory = newCategory;
    }

    if (!amount || !finalCategory) {
      alert('الرجاء تعبئة المبلغ والفئة.');
      return;
    }
    
    addTransaction({
      type,
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      description,
    });
    
    // Reset form and close
    setAmount('');
    setCategory('');
    setNewCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    onClose();
  };

  const categories = type === TransactionType.INCOME ? incomeCategories : expenseCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">إضافة معاملة جديدة</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => { setType(TransactionType.EXPENSE); setCategory(''); }}
                className={`flex-1 py-2 px-4 rounded-r-md border border-gray-300 ${type === TransactionType.EXPENSE ? 'bg-red-500 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                مصروف
              </button>
              <button
                type="button"
                onClick={() => { setType(TransactionType.INCOME); setCategory(''); }}
                className={`flex-1 py-2 px-4 rounded-l-md border border-gray-300 ${type === TransactionType.INCOME ? 'bg-green-500 text-white' : 'bg-white hover:bg-gray-50'}`}
              >
                إيراد
              </button>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ج.م)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">اختر فئة</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              <option value="new">-- إضافة فئة جديدة --</option>
            </select>
          </div>
          {category === 'new' && (
            <div className="mb-4">
              <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">اسم الفئة الجديدة</label>
              <input
                type="text"
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="مثال: تعليم"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف (اختياري)</label>
            <textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="تفاصيل إضافية..."
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
