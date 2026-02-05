'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import QuizSection from '@/components/QuizSection';

export default function PlacementTestContent() {
  const searchParams = useSearchParams();
  const leadId = searchParams.get('id') ? parseInt(searchParams.get('id')!, 10) : undefined;

  // Зчитуємо UTM-мітки з URL та зберігаємо в sessionStorage
  useEffect(() => {
    const utmParams = {
      utm_source: searchParams.get('utm_source') || '',
      utm_medium: searchParams.get('utm_medium') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_content: searchParams.get('utm_content') || '',
      utm_term: searchParams.get('utm_term') || '',
    };

    // Зберігаємо тільки якщо є хоча б одна мітка
    if (Object.values(utmParams).some(val => val)) {
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
  }, [searchParams]);

  return (
    <div style={{ background: '#C7D2DF', minHeight: '100vh', paddingBottom: '70px' }}>
      <HeroSection />
      <div className="mt-8">
        <QuizSection leadId={leadId} />
      </div>
    </div>
  );
}
