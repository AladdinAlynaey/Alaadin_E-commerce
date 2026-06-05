'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import api from '@/lib/api';
import styles from './ChatWidget.module.css';

interface Message { role: string; content: string }

export default function ChatWidget() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post<{ reply: string }>('/ai/chat', { messages: newMessages }, undefined);
      setMessages([...newMessages, { role: 'assistant', content: res.reply }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: locale === 'ar' ? 'عذراً، حدث خطأ.' : 'Sorry, an error occurred.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      <button className={styles.fab} onClick={() => setIsOpen(!isOpen)} aria-label="Chat">
        {isOpen ? '✕' : '💬'}
      </button>
      {isOpen && (
        <div className={styles.widget}>
          <div className={styles.header}>
            <span className={styles.headerIcon}>✦</span>
            <span>{locale === 'ar' ? 'مساعد التسوق' : 'Shopping Assistant'}</span>
          </div>
          <div className={styles.body}>
            {messages.length === 0 && (
              <div className={styles.welcome}>
                <p>{locale === 'ar' ? 'مرحباً! كيف يمكنني مساعدتك؟' : 'Hi! How can I help you?'}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`${styles.message} ${m.role === 'user' ? styles.user : styles.assistant}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className={`${styles.message} ${styles.assistant}`}><span className={styles.typing}>...</span></div>}
          </div>
          <div className={styles.footer}>
            <input className={styles.input} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={locale === 'ar' ? 'اكتب رسالتك...' : 'Type a message...'} />
            <button className={styles.sendBtn} onClick={send} disabled={loading}>→</button>
          </div>
        </div>
      )}
    </>
  );
}
