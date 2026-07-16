import React from 'react';

export const SkeletonBox = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, ...style }}
  />
);

export const SkeletonCard = ({ height = '120px' }) => (
  <div className="card" style={{ height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <SkeletonBox width="40%" height="16px" />
      <SkeletonBox width="32px" height="32px" borderRadius="50%" />
    </div>
    <SkeletonBox width="60%" height="28px" />
    <SkeletonBox width="30%" height="14px" />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <SkeletonBox width="200px" height="24px" />
      <SkeletonBox width="120px" height="36px" />
    </div>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonBox key={i} width={`${100 / cols}%`} height="18px" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rIndex) => (
      <div key={rIndex} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
        {Array.from({ length: cols }).map((_, cIndex) => (
          <SkeletonBox key={cIndex} width={`${100 / cols}%`} height="16px" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonPage = () => (
  <div style={{ padding: '0.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div>
        <SkeletonBox width="250px" height="32px" style={{ marginBottom: '0.5rem' }} />
        <SkeletonBox width="180px" height="16px" />
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <SkeletonBox width="120px" height="40px" />
        <SkeletonBox width="120px" height="40px" />
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <SkeletonTable rows={6} cols={5} />
  </div>
);
