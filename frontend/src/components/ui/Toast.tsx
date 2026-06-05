'use client';

import styles from './Toast.module.css';
import { useEffect, useState } from 'react';

interface ToastData { message: string; type: 'success' | 'error' | 'info'; }

let showToastFn: (data: ToastData) => void;
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => showToastFn?.({ message, type });

export default function ToastContainer() {
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => { showToastFn = (data) => { setToast(data); setTimeout(() => setToast(null), 3000); }; }, []);

  if (!toast) return null;

  const typeClass = toast.type === 'success' ? styles.success : toast.type === 'error' ? styles.error : styles.info;
  const icon = toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ';

  return (
    <div className={`${styles.toast} ${typeClass}`}>
      <span className={styles.icon}>{icon}</span>
      <span>{toast.message}</span>
    </div>
  );
}
