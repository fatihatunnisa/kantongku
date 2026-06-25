import React, { useState } from 'react';
import { Wallet, LayoutDashboard, Settings, LogOut, Sun, Moon, Globe } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCashflowStore } from '../../store/useCashflowStore';
import { formatRupiah } from '../../utils/currencyUtils';
import { translations } from '../../utils/translations';
import { SettingsModal } from '../dashboard/SettingsModal';
import { ProfileModal } from '../dashboard/ProfileModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const { transactions, secureMode, toggleSecureMode, goals, theme, toggleTheme, lang, setLang } = useCashflowStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const t = translations[lang];

  // Coffee & Boba spending calculation
  const bobaKopiTotal = transactions
    .filter(t => {
      const title = t.title.toLowerCase();
      const cat = t.category.toLowerCase();
      return (
        t.type === 'expense' &&
        (title.includes('kopi') ||
          title.includes('coffee') ||
          title.includes('boba') ||
          title.includes('starbucks') ||
          title.includes('jco') ||
          title.includes('chatime') ||
          title.includes('kopi susu') ||
          cat.includes('food') ||
          cat.includes('makan'))
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);

  // Boba/Coffee cup approximation (avg 25000 Rp per cup)
  const cupCount = Math.floor(bobaKopiTotal / 25000);

  const getGenzSavageStatus = () => {
    if (cupCount === 0) return { text: t.noCaffeine, color: "text-emerald-600 dark:text-emerald-400" };
    if (cupCount < 3) return { text: t.normalCaffeine, color: "text-blue-600 dark:text-blue-400 font-semibold" };
    if (cupCount < 6) return { text: t.warningCaffeine, color: "text-amber-600 dark:text-amber-400 font-bold" };
    return { text: t.dangerCaffeine, color: "text-rose-600 dark:text-rose-400 font-black animate-pulse" };
  };
  const savageStatus = getGenzSavageStatus();
  
  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#F1F5F9] text-slate-900'}`}>
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex w-64 flex-col p-8 shrink-0 z-10 border-r transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
              K
            </div>
            <span className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Kantongku</span>
          </div>
          
          {/* Theme & Lang Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className={`p-1.5 rounded-lg border text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}
              title="Change Language"
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${theme === 'dark' ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <nav className="space-y-2 shrink-0">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-3 shadow-md shadow-blue-500/10">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> 
            <span>{t.dashboard}</span>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span>{t.settings}</span>
          </button>
        </nav>

        {/* Dynamic Gen Z Widgets in Sidebar */}
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-5 flex-1 overflow-y-auto no-scrollbar pb-4">
          {/* Boba & Kopi Tax Tracker */}
          <div className={`p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200/60'} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.lifestyleTax}</span>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900">
                {cupCount} {lang === 'id' ? 'Gelas' : 'Cups'}
              </span>
            </div>
            <p className={`text-[11px] leading-relaxed ${savageStatus.color}`}>
              {savageStatus.text}
            </p>
            <div className="mt-2 text-[10px] text-slate-400 font-medium">
              {lang === 'id' ? 'Total jajan:' : 'Total spent:'} <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-600'}`}>{secureMode ? 'Rp ••••••' : formatRupiah(bobaKopiTotal)}</span>
            </div>
          </div>

          {/* Mini Savings Goal */}
          {goals && goals.length > 0 && (
            <div className={`p-4 rounded-2xl border transition-colors ${theme === 'dark' ? 'bg-gradient-to-br from-blue-950/20 to-sky-950/20 border-blue-950' : 'bg-gradient-to-br from-blue-50/60 to-sky-50/60 border-blue-100/50'} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${theme === 'dark' ? 'text-blue-300' : 'text-blue-950'}`}>{t.nearestGoal}</span>
                <span className="text-xs">{goals[0].emoji}</span>
              </div>
              <p className={`text-xs font-bold truncate mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{goals[0].name}</p>
              <div className={`w-full h-1.5 rounded-full overflow-hidden mb-1 ${theme === 'dark' ? 'bg-blue-950' : 'bg-blue-100'}`}>
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((goals[0].current / goals[0].target) * 100)}%` }}
                />
              </div>
              <div className={`flex justify-between text-[10px] font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                <span>{Math.round((goals[0].current / goals[0].target) * 100)}%</span>
                <span>{secureMode ? 'Rp ••••••' : formatRupiah(goals[0].target)}</span>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        {user && (
          <div className={`pt-4 border-t mt-auto shrink-0 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
            <div 
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center space-x-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity animate-fade-in"
              title={t.profileTitle || "Edit Profil"}
            >
              <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full bg-blue-50 border-2 border-blue-100 shadow-sm" />
              <div className="overflow-hidden">
                <p className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer ${theme === 'dark' ? 'text-slate-400 hover:bg-rose-950/30 hover:text-rose-400' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'}`}
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto overflow-x-hidden">
        {/* Topbar - Mobile */}
        <header className={`md:hidden flex items-center justify-between p-4 border-b shrink-0 sticky top-0 z-20 shadow-sm transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Kantongku</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* User Avatar on Mobile */}
            {user && (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="w-8 h-8 rounded-full overflow-hidden bg-blue-50 border-2 border-blue-100 shadow-sm mr-1 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title={t.profileTitle || "Edit Profil"}
              >
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </button>
            )}

            {/* Theme & Lang Controls Mobile */}
            <button
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              title="Change Language"
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${theme === 'dark' ? 'border-slate-800 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              title={t.settings}
            >
              <Settings className="w-4 h-4" />
            </button>
            {user && (
              <button onClick={logout} className={`p-2 rounded-full cursor-pointer transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/30' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'}`}>
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </header>
        
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};
