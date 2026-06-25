import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import type { Transaction } from '../../types';
import { useCashflowStore } from '../../store/useCashflowStore';
import { translations } from '../../utils/translations';

interface CashflowChartProps {
  transactions: Transaction[];
}

export const CashflowChart: React.FC<CashflowChartProps> = ({ transactions }) => {
  const { lang, theme } = useCashflowStore();
  const t = translations[lang];

  // Group transactions by date for the chart
  const groupedData = transactions.reduce((acc, curr) => {
    try {
      const dateStr = format(parseISO(curr.date), 'MMM dd', {
        locale: lang === 'id' ? id : enUS
      });
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, income: 0, expense: 0 };
      }
      if (curr.type === 'income') {
        acc[dateStr].income += curr.amount;
      } else {
        acc[dateStr].expense += curr.amount;
      }
    } catch (e) {
      console.error('Error grouping chart data', e);
    }
    return acc;
  }, {} as Record<string, { date: string; income: number; expense: number }>);

  const data = (Object.values(groupedData) as Array<{ date: string; income: number; expense: number }>).sort((a, b) => {
    try {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } catch {
      return 0;
    }
  });

  const isDark = theme === 'dark';

  return (
    <div className={`p-6 rounded-3xl shadow-sm border h-[350px] flex flex-col transition-all hover:shadow-md duration-300 ${
      theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-6 transition-colors duration-300 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
        {t.cashflowOverview}
      </h3>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
          {t.noChartData}
        </div>
      ) : (
        <div className="flex-1 min-h-0 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? '#334155' : '#e2e8f0'} 
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748b' }}
                tickFormatter={(val) => `Rp ${val / 1000}k`}
                width={80}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: isDark ? '1px solid #334155' : 'none', 
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }}
                itemStyle={{ fontSize: '14px', fontWeight: 500 }}
                labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                name={lang === 'id' ? 'Pemasukan' : 'Income'}
              />
              <Area 
                type="monotone" 
                dataKey="expense" 
                stroke="#f43f5e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorExpense)" 
                name={lang === 'id' ? 'Pengeluaran' : 'Expense'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
