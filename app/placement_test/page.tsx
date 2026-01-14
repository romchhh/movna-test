'use client';

import { Suspense } from 'react';
import HeroSection from '@/components/HeroSection';
import QuizSection from '@/components/QuizSection';
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