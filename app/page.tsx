'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import HeroSection from '@/components/HeroSection';

function WelcomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStartTest = () => {
    // Зберігаємо UTM-мітки перед переходом (якщо є)
    const utmParams = new URLSearchParams();
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'id'];

    utmKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        utmParams.set(key, value);
      }
    });

    const queryString = utmParams.toString();
    const targetUrl = queryString ? `/placement_test_with_form?${queryString}` : '/placement_test_with_form';
    router.push(targetUrl);
  };

  return (
    <div style={{ background: '#C7D2DF', minHeight: '100vh', paddingBottom: '70px' }}>
      <HeroSection />
      <div style={{
        width: '100%',
        maxWidth: '542px',
        margin: '32px auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleStartTest}
          style={{
            background: '#0E4486',
            color: '#FFFFFF',
            fontFamily: 'Craftwork Grotesk, sans-serif',
            fontWeight: 600,
            fontSize: '20px',
            padding: '20px 32px',
            borderRadius: '24px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0D3D76';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0E4486';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
          }}
        >
          Почати тест
        </button>
      </div>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#C7D2DF', minHeight: '100vh', paddingBottom: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeroSection />
      </div>
    }>
      <WelcomePageContent />
    </Suspense>
  );
}
