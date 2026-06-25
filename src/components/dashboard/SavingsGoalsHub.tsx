import React, { useState } from 'react';
import { Target, Plus, Trash2, PiggyBank } from 'lucide-react';
import { useCashflowStore } from '../../store/useCashflowStore';
import { formatRupiah } from '../../utils/currencyUtils';
import { cn } from '../../lib/utils';
import { translations } from '../../utils/translations';

export const SavingsGoalsHub: React.FC = () => {
  const { goals, addGoal, deleteGoal, contributeGoal, secureMode, lang, theme } = useCashflowStore();
  const t = translations[lang];

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const emojis = ['🎯', '🎟️', '💻', '🇯🇵', '👟', '🚗', '🏠', '🎮', '☕', '🍕'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(target, 10);
    if (!name || isNaN(targetNum) || targetNum <= 0) return;

    addGoal({
      name,
      target: targetNum,
      current: 0,
      emoji
    });

    setName('');
    setTarget('');
    setEmoji('🎯');
    setIsAdding(false);
  };

  return (
    <div className={`p-6 rounded-3xl shadow-sm border flex flex-col h-full transition-all hover:shadow-md duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl">
            <PiggyBank className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className={`text-lg font-bold transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.mimpiHub}</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/80 rounded-xl transition-colors cursor-pointer"
          title="Add saving goal"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className={`mb-4 p-4 rounded-2xl border space-y-3 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t.targetName}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tiket Konser Coldplay"
              className={`w-full px-3 py-1.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t.targetPrice}</label>
              <input
                type="number"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target Price"
                className={`w-full px-3 py-1.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{t.iconEmoji}</label>
              <select
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className={`w-full px-3 py-1.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                {emojis.map((em) => (
                  <option key={em} value={em}>{em}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {t.addGoalBtn}
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={`px-3 py-2 font-bold text-xs rounded-xl transition-colors cursor-pointer ${
                theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 max-h-[320px] pr-1">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">{t.noWishlist}</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
            return (
              <div key={goal.id} className={`p-3 rounded-2xl border shadow-sm relative overflow-hidden group hover:border-blue-200/80 transition-all ${
                theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200/60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span className={`text-xl p-1.5 rounded-xl shadow-sm border ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
                    }`}>{goal.emoji}</span>
                    <div className="overflow-hidden">
                      <h4 className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{goal.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {secureMode ? 'Rp ••••••' : formatRupiah(goal.current)} / {secureMode ? 'Rp ••••••' : formatRupiah(goal.target)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className={`p-1 text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer ${
                      theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                    }`}
                    title={t.hapusMimpi}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      percent >= 100 ? "bg-emerald-500" : "bg-blue-600"
                    )}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-xs font-black",
                    percent >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"
                  )}>
                    {percent}% {percent >= 100 ? t.achieved : t.saved}
                  </span>

                  {/* Interactive Save Shortcuts */}
                  {percent < 100 && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => contributeGoal(goal.id, 50000)}
                        className={`px-2 py-1 text-[9px] font-black border rounded-lg transition-colors cursor-pointer shadow-sm ${
                          theme === 'dark' 
                            ? 'text-blue-300 bg-blue-950/40 border-blue-900 hover:bg-blue-950' 
                            : 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100'
                        }`}
                      >
                        +50k
                      </button>
                      <button
                        onClick={() => contributeGoal(goal.id, 100000)}
                        className={`px-2 py-1 text-[9px] font-black border rounded-lg transition-colors cursor-pointer shadow-sm ${
                          theme === 'dark' 
                            ? 'text-blue-300 bg-blue-950/40 border-blue-900 hover:bg-blue-950' 
                            : 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100'
                        }`}
                      >
                        +100k
                      </button>
                      <button
                        onClick={() => contributeGoal(goal.id, 500000)}
                        className={`px-2 py-1 text-[9px] font-black border rounded-lg transition-colors cursor-pointer shadow-sm ${
                          theme === 'dark' 
                            ? 'text-blue-300 bg-blue-950/40 border-blue-900 hover:bg-blue-950' 
                            : 'text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100'
                        }`}
                      >
                        +500k
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
