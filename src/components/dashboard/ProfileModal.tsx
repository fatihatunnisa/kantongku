import React, { useState } from 'react';
import { X, Check, RefreshCw, Sparkles, User, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useCashflowStore } from '../../store/useCashflowStore';
import { translations } from '../../utils/translations';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CUTE_SEEDS = [
  { name: 'Cute Cat 🐱', seed: 'Felix' },
  { name: 'Playful Dog 🐶', seed: 'Buddy' },
  { name: 'Sweet Bunny 🐰', seed: 'Cookie' },
  { name: 'Cozy Bear 🐻', seed: 'Bear' },
  { name: 'Clever Fox 🦊', seed: 'Foxy' },
  { name: 'Happy Panda 🐼', seed: 'Panda' },
  { name: 'Sleepy Koala 🐨', seed: 'Koala' },
  { name: 'Magic Unicorn 🦄', seed: 'Unicorn' },
  { name: 'Tiny Hamster 🐹', seed: 'Hammy' },
  { name: 'Brave Lion 🦁', seed: 'Simba' },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const { theme, lang } = useCashflowStore();

  const t = translations[lang];

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectSeed = (seed: string) => {
    setAvatarUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`);
  };

  const handleRandomizeAvatar = () => {
    const randomSeeds = ['Milo', 'Luna', 'Gizmo', 'Oliver', 'Bella', 'Simba', 'Chloe', 'Coco', 'Rocky', 'Ginger', 'Angel', 'Nugget', 'Waffles', 'Peanut', 'Cupcake'];
    const randomSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];
    setAvatarUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save Profile
    updateProfile({
      name,
      email,
      avatarUrl
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className={`rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border transition-all duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black">{t.profileTitle || 'Pengaturan Profil'}</h2>
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
              <span>{t.settingsSaved || 'Profil berhasil disimpan!'}</span>
            </div>
          )}

          {/* Section 1: Avatar Selection */}
          <div className="space-y-3">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.profileAvatar || 'Pilih Avatar Lucu'}
            </h3>
            
            {/* Current Avatar Frame */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-800/20 border-dashed border-slate-200 dark:border-slate-800">
              <div className="relative group shrink-0">
                <img 
                  src={avatarUrl} 
                  alt="Current Cute Avatar" 
                  className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-100 dark:border-blue-950 shadow-md transition-transform group-hover:scale-105 duration-300" 
                />
                <button
                  type="button"
                  onClick={handleRandomizeAvatar}
                  className="absolute -bottom-1.5 -right-1.5 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  title="Generate Random Avatar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 w-full space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {lang === 'id' 
                    ? 'Klik salah satu karakter lucu di bawah, atau buat random menggunakan tombol putar!'
                    : 'Click one of the cute characters below, or generate a random one using the spin button!'}
                </p>
                
                {/* Custom Avatar URL */}
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    {t.customAvatarUrl || 'Atau URL Avatar Kustom'}
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.png"
                    className={`w-full px-3 py-1.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Avatar List Grid */}
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {CUTE_SEEDS.map((item) => {
                const itemUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${item.seed}`;
                const isSelected = avatarUrl === itemUrl;
                return (
                  <button
                    key={item.seed}
                    type="button"
                    onClick={() => handleSelectSeed(item.seed)}
                    className={`aspect-square rounded-xl bg-slate-50 dark:bg-slate-800/40 p-1 flex items-center justify-center border-2 transition-all cursor-pointer relative hover:scale-110 ${
                      isSelected ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                    title={item.name}
                  >
                    <img src={itemUrl} alt={item.name} className="w-full h-full rounded-lg" />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-2.5 h-2.5 font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Personal Info */}
          <div className="space-y-4">
            <h3 className={`text-sm font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.editProfile || 'Edit Profil'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.profileName || 'Nama Lengkap'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatihatunnisa"
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.profileEmail || 'Email'}</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                />
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
            {t.saveProfileBtn || 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};
