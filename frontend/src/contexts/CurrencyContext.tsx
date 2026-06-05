'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface Currency {
  code: string;
  name: { ar: string; en: string };
  symbol: string;
  rate: number;
}

interface CurrencyContextType {
  currency: string;
  currencies: Currency[];
  setCurrency: (code: string) => void;
  formatPrice: (prices: { YER?: number; SAR?: number; USD?: number } | number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState('YER');
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('currency');
    if (saved) setCurrencyState(saved);

    api.get<Currency[]>('/currencies').then(setCurrencies).catch(() => {
      setCurrencies([
        { code: 'YER', name: { ar: 'ريال يمني', en: 'Yemeni Rial' }, symbol: '﷼', rate: 1 },
        { code: 'SAR', name: { ar: 'ريال سعودي', en: 'Saudi Riyal' }, symbol: 'ر.س', rate: 0.0067 },
        { code: 'USD', name: { ar: 'دولار', en: 'USD' }, symbol: '$', rate: 0.004 },
      ]);
    });
  }, []);

  const setCurrency = (code: string) => {
    setCurrencyState(code);
    localStorage.setItem('currency', code);
  };

  const currentCurrency = currencies.find(c => c.code === currency);
  const symbol = currentCurrency?.symbol || '﷼';

  const formatPrice = (prices: { YER?: number; SAR?: number; USD?: number } | number): string => {
    let amount: number;
    if (typeof prices === 'number') {
      amount = prices;
    } else {
      amount = (prices as any)[currency] ?? (prices as any).YER ?? 0;
    }
    return `${amount.toLocaleString()} ${symbol}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, currencies, setCurrency, formatPrice, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
