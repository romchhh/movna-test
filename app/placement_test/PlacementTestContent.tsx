'use client';

import { useSearchParams } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import QuizSection from '@/components/QuizSection';

export default function PlacementTestContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('id') ? parseInt(searchParams.get('id')!, 10) : undefined;

  return (
    <div style={{ background: '#A7DAB6', minHeight: '100vh', paddingBottom: '70px' }}>
      <HeroSection />
      <div className="mt-8">
        <QuizSection leadId={leadId} />
      </div>
    </div>
  );
}
