export type TransactionType = 'income' | 'expense';
export type PeriodType = 'daily' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
  category: string;
  type: TransactionType;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  emoji: string;
}

export interface CashflowState {
  transactions: Transaction[];
  period: PeriodType;
  nextPayday: string; // ISO string
  goals: SavingsGoal[];
  secureMode: boolean;
  theme: 'light' | 'dark';
  lang: 'id' | 'en';
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setPeriod: (period: PeriodType) => void;
  setNextPayday: (date: string) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  contributeGoal: (id: string, amount: number) => void;
  toggleSecureMode: () => void;
  toggleTheme: () => void;
  setLang: (lang: 'id' | 'en') => void;
}
