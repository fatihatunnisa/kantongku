import React from 'react';
import { ArrowDownRight, ArrowUpRight, WalletCards, Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatRupiah } from '../../utils/currencyUtils';
import { useCashflowStore } from '../../store/useCashflowStore';
import { translations } from '../../utils/translations';

interface SummaryCardsProps {
  income: number;
  expense: number;
  net: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ income, expense, net }) => {
  const { secureMode, toggleSecureMode, lang, theme } = useCashflowStore();
  const t = translations[lang];

  const displayVal = (val: number) => {
    return secureMode ? "Rp ••••••" : formatRupiah(val);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      {/* Total Income */}
      <div className={`p-6 rounded-3xl shadow-sm border flex flex-col space-y-2 hover:shadow-md transition-all hover:-translate-y-0.5 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.totalIncome}</p>
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
            <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {displayVal(income)}
          </h3>
          <button 
            onClick={toggleSecureMode}
            className="text-slate-300 hover:text-blue-500 dark:text-slate-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg cursor-pointer"
            title={secureMode ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          >
            {secureMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Total Expense */}
      <div className={`p-6 rounded-3xl shadow-sm border flex flex-col space-y-2 hover:shadow-md transition-all hover:-translate-y-0.5 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.totalExpense}</p>
          <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
            <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h3 className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            {displayVal(expense)}
          </h3>
          <button 
            onClick={toggleSecureMode}
            className="text-slate-300 hover:text-blue-500 dark:text-slate-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg cursor-pointer"
            title={secureMode ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          >
            {secureMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Net Cashflow */}
      <div className={`p-6 rounded-3xl shadow-sm border flex flex-col space-y-2 hover:shadow-md transition-all hover:-translate-y-0.5 duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t.netCashflow}</p>
          <div className={cn(
            "p-2 rounded-xl",
            net >= 0 
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400" 
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
          )}>
            <WalletCards className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h3 className={cn(
            "text-2xl font-bold tracking-tight transition-colors duration-300",
            net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          )}>
            {displayVal(net)}
          </h3>
          <button 
            onClick={toggleSecureMode}
            className="text-slate-300 hover:text-blue-500 dark:text-slate-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg cursor-pointer"
            title={secureMode ? "Tampilkan Saldo" : "Sembunyikan Saldo"}
          >
            {secureMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
