import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useCashflowStore } from './store/useCashflowStore';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { SmartAdvisorCard } from './components/dashboard/SmartAdvisorCard';
import { BudgetAssistant } from './components/dashboard/BudgetAssistant';
import { CashflowChart } from './components/dashboard/CashflowChart';
import { TransactionForm } from './components/dashboard/TransactionForm';
import { TransactionList } from './components/dashboard/TransactionList';
import { SavingsGoalsHub } from './components/dashboard/SavingsGoalsHub';
import { SplitBillModal } from './components/split-bill/SplitBillModal';
import { filterTransactionsByPeriod, calculateSummary } from './utils/dateUtils';
import { cn } from './lib/utils';
import { Users } from 'lucide-react';
import { translations } from './utils/translations';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { transactions, period, setPeriod, theme, lang } = useCashflowStore();
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Filter transactions based on current period selection
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  const { income, expense, net } = calculateSummary(filteredTransactions);

  return (
    <DashboardLayout>
      {/* Upper Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-3xl font-black tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {lang === 'id' ? 'Arus Kas' : 'Finances'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'id' ? 'Kelola budget dan tabunganmu secara sehat.' : 'Keep your budget sound and healthy.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Period Selector Tabs */}
          <div className={`flex p-1 rounded-xl border shadow-sm backdrop-blur-md transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
            {(['daily', 'monthly', 'yearly'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-all cursor-pointer",
                  period === p 
                    ? "bg-blue-600 text-white shadow-sm" 
                    : theme === 'dark'
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                )}
              >
                {t[p]}
              </button>
            ))}
          </div>

          {/* OCR Split Bill Trigger */}
          <button
            onClick={() => setIsSplitBillOpen(true)}
            className="flex items-center justify-center space-x-1.5 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>
              <span className="inline sm:hidden">{lang === 'id' ? 'Patungan' : 'Split'}</span>
              <span className="hidden sm:inline">{t.splitBill}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <SummaryCards income={income} expense={expense} net={net} />

      {/* Main Bento Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Top Row: Cashflow Chart & Add Transaction */}
        <div className="lg:col-span-8 flex flex-col">
          <CashflowChart transactions={filteredTransactions} />
        </div>
        
        <div className="lg:col-span-4 flex flex-col">
          <TransactionForm />
        </div>

        {/* Middle Row: Smart Advisor, Budget Assistant, Savings Goals */}
        <div className="lg:col-span-4 flex flex-col">
          <SmartAdvisorCard transactions={filteredTransactions} />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <BudgetAssistant />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <SavingsGoalsHub />
        </div>

        {/* Bottom Row: Recent Transactions full width */}
        <div className="lg:col-span-12 flex flex-col">
          <TransactionList transactions={filteredTransactions} />
        </div>
      </div>

      {/* OCR Split Bill Modal */}
      <SplitBillModal 
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
      />
    </DashboardLayout>
  );
}
