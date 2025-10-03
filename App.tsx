
import React, { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Transaction, Category, View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Settings from './components/Settings';

const DEFAULT_BG = "https://picsum.photos/1920/1080?grayscale&blur=2";

const App: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', [
    { id: 'cat-1', name: 'راتب' },
    { id: 'cat-2', name: 'طعام' },
    { id: 'cat-3', name: 'مواصلات' },
    { id: 'cat-4', name: 'فواتير' },
    { id: 'cat-5', name: 'ترفيه' },
  ]);
  const [backgroundImage, setBackgroundImage] = useLocalStorage<string>('backgroundImage', DEFAULT_BG);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleAddTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...transaction, id: `trans-${Date.now()}` }, ...prev]);
  }, [setTransactions]);

  const handleDeleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);

  const handleAddCategory = useCallback((name: string) => {
    if (name && !categories.some(c => c.name === name)) {
      setCategories(prev => [...prev, { id: `cat-${Date.now()}`, name }]);
      return true;
    }
    return false;
  }, [categories, setCategories]);
  
  const handleDeleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  const handleUpdateCategory = useCallback((id: string, newName: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  }, [setCategories]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const renderView = () => {
    switch (currentView) {
      case 'reports':
        return <Reports transactions={sortedTransactions} />;
      case 'settings':
        return (
          <Settings
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onUpdateCategory={handleUpdateCategory}
            currentBackground={backgroundImage}
            onSetBackground={setBackgroundImage}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            transactions={sortedTransactions.slice(0, 10)}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            categories={categories}
            onAddCategory={handleAddCategory}
          />
        );
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed text-white transition-all duration-500"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="min-h-screen w-full bg-gray-900 bg-opacity-80 backdrop-blur-sm">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className="p-4 sm:p-6 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
