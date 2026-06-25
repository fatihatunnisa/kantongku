import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CashflowState } from '../types';

export const useCashflowStore = create<CashflowState>()(
  persist(
    (set) => ({
      transactions: [],
      period: 'monthly',
      nextPayday: '',
      goals: [
        { id: '1', name: 'Tiket Coldplay', target: 4500000, current: 2500000, emoji: '🎟️' },
        { id: '2', name: 'MacBook M4 Pro', target: 32000000, current: 18500000, emoji: '💻' },
        { id: '3', name: 'Liburan ke Jepang', target: 20000000, current: 6000000, emoji: '🇯🇵' },
      ],
      secureMode: false,
      theme: 'light',
      lang: 'id',
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [
          ...state.transactions,
          { ...transaction, id: crypto.randomUUID() }
        ]
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      
      setPeriod: (period) => set({ period }),
      setNextPayday: (nextPayday) => set({ nextPayday }),

      addGoal: (goal) => set((state) => ({
        goals: [
          ...state.goals,
          { ...goal, id: crypto.randomUUID() }
        ]
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      contributeGoal: (id, amount) => set((state) => ({
        goals: state.goals.map((g) => 
          g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g
        )
      })),

      toggleSecureMode: () => set((state) => ({ secureMode: !state.secureMode })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'cashflow-storage',
    }
  )
);
