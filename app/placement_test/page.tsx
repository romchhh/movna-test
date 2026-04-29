'use client';

import { Suspense } from 'react';
import PlacementTestContent from './PlacementTestContent';

export default function PlacementTestPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#C7D2DF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Завантаження...</div>
      </div>
    }>
      <PlacementTestContent />
    </Suspense>
  );
}