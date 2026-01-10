'use client';

import HeroSection from '@/components/HeroSection';
import QuizSection from '@/components/QuizSection';

export default function PlacementTestPage() {
  return (
    <div style={{ background: '#A7DAB6', minHeight: '100vh', paddingBottom: '70px' }}>
      <HeroSection />
      <div className="mt-8">
        <QuizSection />
      </div>
    </div>
  );
}