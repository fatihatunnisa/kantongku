import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { getFinancialAdvice } from '../../utils/financialAdvisor';
import type { Transaction } from '../../types';
import { cn } from '../../lib/utils';
import { useCashflowStore } from '../../store/useCashflowStore';
import { translations } from '../../utils/translations';

interface SmartAdvisorCardProps {
  transactions: Transaction[];
}

export const SmartAdvisorCard: React.FC<SmartAdvisorCardProps> = ({ transactions }) => {
  const { lang, theme } = useCashflowStore();
  const advice = getFinancialAdvice(transactions, lang);
  const t = translations[lang];

  const getIcon = () => {
    switch (advice.type) {
      case 'success':
        return <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getBgColor = () => {
    if (theme === 'dark') {
      switch (advice.type) {
        case 'success':
          return "bg-emerald-950/20 border-emerald-900/50 text-emerald-300";
        case 'warning':
          return "bg-amber-950/20 border-amber-900/50 text-amber-300";
        case 'danger':
          return "bg-rose-950/20 border-rose-900/50 text-rose-300";
        default:
          return "bg-blue-950/20 border-blue-900/50 text-blue-300";
      }
    } else {
      switch (advice.type) {
        case 'success':
          return "bg-emerald-50 border-emerald-200 text-emerald-800";
        case 'warning':
          return "bg-amber-50 border-amber-200 text-amber-800";
        case 'danger':
          return "bg-rose-50 border-rose-200 text-rose-800";
        default:
          return "bg-blue-50 border-blue-100 text-blue-800";
      }
    }
  };

  return (
    <div className={cn("p-6 rounded-3xl shadow-sm border flex flex-col space-y-4 transition-all hover:shadow-md duration-300", getBgColor())}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-2xl shadow-sm flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
          {getIcon()}
        </div>
        <h3 className={`text-lg font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.smartAdvisor}</h3>
      </div>
      
      <p className={`leading-relaxed font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
        {advice.message}
      </p>
    </div>
  );
};
