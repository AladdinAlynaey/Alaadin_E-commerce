export function formatDate(date: string | Date, locale: 'ar' | 'en' = 'en'): string {
  return new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-YE' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCurrency(amount: number, currency: string = 'YER'): string {
  const symbols: Record<string, string> = { YER: '﷼', SAR: 'ر.س', USD: '$' };
  return `${amount.toLocaleString()} ${symbols[currency] || currency}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateOrderNumber(): string {
  return 'ALD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
