'use client';

interface Props { page: number; totalPages: number; onPageChange: (page: number) => void; }

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + Math.max(1, page - 3)).filter(p => p >= 1 && p <= totalPages);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
      <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>←</button>
      {pages.map(p => (
        <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`} onClick={() => onPageChange(p)}>{p}</button>
      ))}
      <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>→</button>
    </div>
  );
}
