import React from 'react';
import { format, parseISO } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';
import { cn } from '../../lib/utils';
import { useCashflowStore } from '../../store/useCashflowStore';
import { formatRupiah } from '../../utils/currencyUtils';
import { translations } from '../../utils/translations';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const { deleteTransaction, secureMode, lang, theme } = useCashflowStore();
  const t = translations[lang];

  if (transactions.length === 0) {
    return (
      <div className={`p-6 rounded-3xl shadow-sm border flex-1 flex flex-col items-center justify-center text-center min-h-[300px] duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <span className="text-2xl">📝</span>
        </div>
        <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{t.noTransactions}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{lang === 'id' ? 'Tambahkan transaksi untuk melihatnya di sini.' : 'Add a transaction to see it here.'}</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedTransactions = [...transactions].sort((a, b) => {
    try {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } catch {
      return 0;
    }
  });

  // Helper to resolve category emoji icons
  const getCategoryEmoji = (category: string, title: string): string => {
    const cat = category.toLowerCase();
    const t = title.toLowerCase();
    
    if (cat.includes('food') || cat.includes('makan') || t.includes('starbucks') || t.includes('coffee') || t.includes('cafe')) return '☕';
    if (cat.includes('transport') || cat.includes('ojek') || cat.includes('gojek') || cat.includes('grab') || t.includes('gojek') || t.includes('grab') || t.includes('ride') || t.includes('ojek')) return '🚗';
    if (cat.includes('salary') || cat.includes('gaji') || t.includes('salary') || t.includes('gaji')) return '💰';
    if (cat.includes('freelance') || t.includes('project') || t.includes('freelance')) return '💻';
    if (cat.includes('investment') || cat.includes('investasi') || t.includes('saham') || t.includes('crypto')) return '📈';
    if (cat.includes('shopping') || cat.includes('belanja') || t.includes('tokopedia') || t.includes('shopee') || t.includes('mall') || t.includes('indomaret')) return '🛍️';
    if (cat.includes('entertainment') || cat.includes('hiburan') || t.includes('game') || t.includes('steam') || t.includes('netflix') || t.includes('playstation')) return '🎮';
    if (cat.includes('utilities') || cat.includes('listrik') || cat.includes('air') || t.includes('wifi') || t.includes('pulsa') || cat.includes('utility')) return '⚡';
    if (cat.includes('housing') || cat.includes('kost') || cat.includes('sewa')) return '🏠';
    
    // Fallback based on typical words
    if (t.includes('makan') || t.includes('resto') || t.includes('bakso') || t.includes('mie')) return '🍔';
    
    return '';
  };

  return (
    <div className={`p-6 rounded-3xl shadow-sm border flex flex-col flex-1 max-h-[500px] transition-all hover:shadow-md duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.recentTransactions}</h3>
      
      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
        {sortedTransactions.map((transaction) => {
          let dateStr = '';
          try {
            dateStr = format(parseISO(transaction.date), 'MMM dd, yyyy', {
              locale: lang === 'id' ? id : enUS
            });
          } catch {
            dateStr = t.unknownDate;
          }
          
          const emoji = getCategoryEmoji(transaction.category, transaction.title);
          
          return (
            <div 
              key={transaction.id}
              className={`flex items-center justify-between p-3 rounded-2xl border border-transparent transition-all group ${
                theme === 'dark'
                  ? 'hover:bg-slate-800/80 hover:border-slate-700/50'
                  : 'hover:bg-blue-50/45 hover:border-blue-100/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg shadow-sm border",
                  transaction.type === 'income' 
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50" 
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50"
                )}>
                  <span>
                    {emoji || transaction.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-bold transition-colors ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{transaction.title}</p>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className={`px-2 py-0.5 rounded-md ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{transaction.category}</span>
                    <span>•</span>
                    <span>{dateStr}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <p className={cn(
                  "text-sm font-black",
                  transaction.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                )}>
                  {secureMode ? "Rp ••••••" : `${transaction.type === 'income' ? '+' : '-'}${formatRupiah(transaction.amount)}`}
                </p>
                
                <button
                  onClick={() => deleteTransaction(transaction.id)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Delete transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
