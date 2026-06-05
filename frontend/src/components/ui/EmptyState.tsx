'use client';

interface Props { icon?: string; title: string; description?: string; actionLabel?: string; onAction?: () => void; }

export default function EmptyState({ icon = '📦', title, description, actionLabel, onAction }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{description}</p>}
      {actionLabel && onAction && <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>}
    </div>
  );
}
