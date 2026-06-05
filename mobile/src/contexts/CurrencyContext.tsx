import React, { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'YER' | 'SAR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (price: any) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const symbols: Record<Currency, string> = { YER: '﷼', SAR: 'ر.س', USD: '$' };

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('YER');

  const formatPrice = (price: any) => {
    if (!price) return '—';
    if (typeof price === 'number') return `${price.toLocaleString()} ${symbols[currency]}`;
    const val = price[currency] || price.YER || 0;
    return `${val.toLocaleString()} ${symbols[currency]}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
