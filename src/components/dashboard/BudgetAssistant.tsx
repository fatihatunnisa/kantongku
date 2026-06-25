import React, { useState } from 'react';
import { Calendar, TrendingUp, AlertCircle, Edit2 } from 'lucide-react';
import { differenceInDays, isPast, isToday, parseISO } from 'date-fns';
import { useCashflowStore } from '../../store/useCashflowStore';
import { calculateSummary } from '../../utils/dateUtils';
import { formatRupiah } from '../../utils/currencyUtils';
import { cn } from '../../lib/utils';
import { translations } from '../../utils/translations';

export const BudgetAssistant: React.FC = () => {
  const { transactions, nextPayday, setNextPayday, secureMode, lang, theme } = useCashflowStore();
  const t = translations[lang];

  const [isEditing, setIsEditing] = useState(!nextPayday);
  const [tempDate, setTempDate] = useState(nextPayday || new Date().toISOString().split('T')[0]);

  const { income, expense } = calculateSummary(transactions);
  const netCashflow = income - expense;

  const calculateDaysRemaining = () => {
    if (!nextPayday) return 0;
    try {
      const targetDate = parseISO(nextPayday);
      if (isToday(targetDate)) return 0;
      if (isPast(targetDate)) return -1;
      return differenceInDays(targetDate, new Date());
    } catch {
      return 0;
    }
  };

  const daysRemaining = calculateDaysRemaining();
  
  // Safe daily budget is net cashflow divided by remaining days
  const dailyBudget = daysRemaining > 0 && netCashflow > 0 
    ? Math.floor(netCashflow / daysRemaining)
    : 0;

  const handleSave = () => {
    if (tempDate) {
      setNextPayday(tempDate);
      setIsEditing(false);
    }
  };

  return (
    <div className={`p-6 rounded-3xl shadow-sm border flex flex-col space-y-4 h-full relative overflow-hidden transition-all hover:shadow-md duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className={`text-lg font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.aiBudgetPlanner}</h3>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center">
        {isEditing ? (
          <div className="space-y-3">
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
              {lang === 'id' ? 'Kapan tanggal gajian berikutnya?' : 'When is your next payday?'}
            </label>
            <input 
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
            <button 
              onClick={handleSave}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {t.saveDate}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {daysRemaining < 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                  {lang === 'id' ? 'Tanggal gajianmu sudah lewat. Harap ubah tanggal untuk merencanakan budget berikutnya.' : 'Your payday has passed. Please update the date to plan your next budget.'}
                </p>
              </div>
            ) : daysRemaining === 0 ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                  {lang === 'id' ? 'Hari gajian tiba! Waktunya mencatat pemasukan baru dan set target impian.' : "It's payday! Time to record your new income and set a fresh target."}
                </p>
              </div>
            ) : (
              <>
                <div className={`flex items-end justify-between border-b pb-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{t.safeDailyBudget}</p>
                    <h4 className={cn(
                      "text-3xl font-black tracking-tight",
                      dailyBudget > 50000 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"
                    )}>
                      {secureMode ? "Rp ••••••" : formatRupiah(dailyBudget)}
                    </h4>
                  </div>
                  <div className="text-right pb-1">
                    <span className="text-sm font-bold text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/50 px-2.5 py-1 rounded-md">
                      {daysRemaining} {lang === 'id' ? 'Hari Lagi' : 'Days Left'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {netCashflow <= 0 ? (
                    <span className="text-rose-600 dark:text-rose-400">{t.outOfFunds}</span>
                  ) : dailyBudget > 100000 ? (
                    <span>{t.greatPosition} <strong className="text-blue-600 dark:text-blue-400">{formatRupiah(dailyBudget)}</strong> {t.perDay}</span>
                  ) : dailyBudget > 0 ? (
                    <span>{t.tightBudget} <strong className="text-amber-600 dark:text-amber-400">{formatRupiah(dailyBudget)}</strong> {t.toSurvive}</span>
                  ) : null}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
