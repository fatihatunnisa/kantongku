import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCashflowStore } from '../../store/useCashflowStore';
import type { TransactionType } from '../../types';
import { cn } from '../../lib/utils';
import { translations } from '../../utils/translations';

export const TransactionForm: React.FC = () => {
  const { addTransaction, lang, theme } = useCashflowStore();
  const t = translations[lang];

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [type, setType] = useState<TransactionType>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) return;

    addTransaction({
      title,
      amount: parseFloat(amount),
      date: new Date(date).toISOString(),
      category,
      type,
    });

    // Reset form
    setTitle('');
    setAmount('');
    setCategory('');
  };

  return (
    <div className={`p-6 rounded-3xl shadow-sm border transition-all hover:shadow-md duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <h3 className={`text-lg font-semibold mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.addTransaction}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className={`flex rounded-xl p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategory('');
            }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer",
              type === 'expense' 
                ? theme === 'dark'
                  ? "bg-slate-900 text-rose-400 shadow-sm font-bold"
                  : "bg-white text-rose-600 shadow-sm font-bold" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {t.expense}
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('');
            }}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer",
              type === 'income' 
                ? theme === 'dark'
                  ? "bg-slate-900 text-emerald-400 shadow-sm font-bold"
                  : "bg-white text-emerald-600 shadow-sm font-bold" 
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            {t.income}
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t.title}</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.placeholderTitle}
            className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t.amount}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-medium">Rp</span>
            <input
              type="number"
              required
              min="100"
              step="100"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`w-full pl-9 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-800' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t.date}</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{t.category}</label>
            <select
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                theme === 'dark' 
                  ? 'bg-slate-800 border-slate-700 text-white' 
                  : 'bg-white border-slate-200 text-slate-800'
              }`}
            >
              <option value="" disabled>{t.selectCategory}</option>
              {type === 'income' ? (
                <>
                  <option value="Salary">{lang === 'id' ? 'Gaji' : 'Salary'}</option>
                  <option value="Freelance">{lang === 'id' ? 'Sampingan' : 'Freelance'}</option>
                  <option value="Investments">{lang === 'id' ? 'Investasi' : 'Investments'}</option>
                  <option value="Other">{lang === 'id' ? 'Lainnya' : 'Other'}</option>
                </>
              ) : (
                <>
                  <option value="Food & Dining">{lang === 'id' ? 'Makanan & Minuman' : 'Food & Dining'}</option>
                  <option value="Housing">{lang === 'id' ? 'Kost / Sewa' : 'Housing'}</option>
                  <option value="Transportation">{lang === 'id' ? 'Transportasi' : 'Transportation'}</option>
                  <option value="Entertainment">{lang === 'id' ? 'Hiburan' : 'Entertainment'}</option>
                  <option value="Shopping">{lang === 'id' ? 'Belanja' : 'Shopping'}</option>
                  <option value="Utilities">{lang === 'id' ? 'Tagihan' : 'Utilities'}</option>
                  <option value="Other">{lang === 'id' ? 'Lainnya' : 'Other'}</option>
                </>
              )}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all font-bold shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 mt-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addTransactionBtn}</span>
        </button>
      </form>
    </div>
  );
};
