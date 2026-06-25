import type { Transaction } from '../types';
import { calculateSummary } from './dateUtils';
import { formatRupiah } from './currencyUtils';

export interface AdvisorResult {
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

export const getFinancialAdvice = (transactions: Transaction[], lang: 'id' | 'en' = 'id'): AdvisorResult => {
  if (transactions.length === 0) {
    return {
      message: lang === 'id' 
        ? "Selamat datang! Tambahkan transaksi pertama Anda untuk mulai mendapatkan rekomendasi finansial pintar."
        : "Welcome! Start by adding your first transaction to get personalized financial advice.",
      type: "info"
    };
  }

  const { income, expense, net } = calculateSummary(transactions);

  if (income === 0 && expense > 0) {
    return {
      message: lang === 'id'
        ? "Ada pengeluaran tanpa pemasukan dalam periode ini. Harap catat pemasukan Anda atau kurangi pengeluaran."
        : "You have expenses but no income this period. Please track your income or try to minimize spending.",
      type: "danger"
    };
  }

  if (expense > income) {
    return {
      message: lang === 'id'
        ? `Pengeluaran melebihi pemasukan sebanyak ${formatRupiah(Math.abs(net))}. Segera pangkas jajan non-esensial!`
        : `Your expenses exceed your income by ${formatRupiah(Math.abs(net))}. It's highly recommended to cut non-essential spending.`,
      type: "danger"
    };
  }

  const savingRate = (net / income) * 100;

  if (savingRate >= 20) {
    return {
      message: lang === 'id'
        ? `Keren! Rasio menabungmu mencapai ${savingRate.toFixed(1)}%. Alokasikan sisa uang ini ke instrumen investasi untuk masa depan.`
        : `Great job! Your saving rate is ${savingRate.toFixed(1)}%. Consider investing your surplus cashflow for long-term growth.`,
      type: "success"
    };
  } else if (savingRate > 0) {
    return {
      message: lang === 'id'
        ? `Rasio menabungmu ${savingRate.toFixed(1)}%. Coba terapkan aturan 50/30/20 untuk meningkatkan porsi tabungan ke 20%.`
        : `You are saving ${savingRate.toFixed(1)}% of your income. Try aiming for the 50/30/20 rule to boost your savings to 20%.`,
      type: "warning"
    };
  }

  return {
    message: lang === 'id'
      ? "Aliran kas cukup stabil, namun selalu ada ruang untuk berhemat. Perhatikan terus pengeluaranmu!"
      : "Your cashflow is stable, but there's room for improvement. Keep an eye on your expenses.",
    type: "info"
  };
};
