import React, { useState } from 'react';
import { X, Check, Calendar, Moon, Globe, Shield, Settings } from 'lucide-react';
import { useCashflowStore } from '../../store/useCashflowStore';
import { translations } from '../../utils/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { 
    theme, toggleTheme, 
    lang, setLang, 
    secureMode, toggleSecureMode,
    nextPayday, setNextPayday
  } = useCashflowStore();

  const t = translations[lang];

  const [payday, setPayday] = useState(nextPayday || new Date().toISOString().split('T')[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save Payday
    setNextPayday(payday);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className={`rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border transition-all duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black">{t.settingsTitle || 'Pengaturan Sistem'}</h2>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 font-bold text-sm animate-bounce">
              <Check className="w-5 h-5 shrink-0" />
              <span>{t.settingsSaved || 'Pengaturan berhasil disimpan!'}</span>
            </div>
          )}

          {/* Section 1: Financial & Payday */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.paydayDate || 'Tanggal Gajian Selanjutnya'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'id' ? 'Tanggal Gajian' : 'Payday Date'}</span>
                </label>
                <input
                  type="date"
                  required
                  value={payday}
                  onChange={(e) => setPayday(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Secure Mode quick toggle inside settings */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.secureMode}</span>
                </label>
                <div className={`flex items-center justify-between p-2.5 border rounded-xl ${
                  theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    {secureMode ? (lang === 'id' ? 'Sensor Aktif' : 'Censor On') : (lang === 'id' ? 'Sensor Mati' : 'Censor Off')}
                  </span>
                  <button 
                    type="button"
                    onClick={toggleSecureMode}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${secureMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform duration-200 ${secureMode ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Preferences */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'id' ? 'Preferensi Tampilan' : 'Display Preferences'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Language */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'id' ? 'Bahasa Utama' : 'Primary Language'}</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLang('id')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      lang === 'id' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : theme === 'dark'
                          ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Bahasa Indonesia (ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      lang === 'en' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : theme === 'dark'
                          ? 'border-slate-800 text-slate-400 hover:bg-slate-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'id' ? 'Tema Warna' : 'Color Theme'}</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      theme === 'light' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'id' ? 'Terang' : 'Light'}
                  </button>
                  <button
                    type="button"
                    onClick={() => theme === 'light' && toggleTheme()}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lang === 'id' ? 'Gelap' : 'Dark'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row justify-end items-center gap-3 shrink-0 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-850' : 'border-slate-100 bg-slate-50'
        }`}>
          <button 
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-5 py-2.5 font-bold text-xs rounded-xl transition-colors cursor-pointer ${
              theme === 'dark' ? 'bg-slate-850 hover:bg-slate-800 text-slate-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {t.cancel}
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            {lang === 'id' ? 'Simpan' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
