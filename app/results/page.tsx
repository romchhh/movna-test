'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResultsSection from '@/components/ResultsSection';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<string>('completed');

  useEffect(() => {
    const urlScore = searchParams.get('score');
    const urlOutcome = searchParams.get('outcome');
    const storedScore = sessionStorage.getItem('quizScore');
    const storedOutcome = sessionStorage.getItem('quizOutcome');

    if (urlOutcome) {
      setOutcome(decodeURIComponent(urlOutcome));
      sessionStorage.setItem('quizOutcome', decodeURIComponent(urlOutcome));
    } else if (storedOutcome) {
      setOutcome(storedOutcome);
    }

    if (urlScore) {
      const parsedScore = parseInt(urlScore, 10);
      if (!isNaN(parsedScore)) {
        setScore(parsedScore);
        sessionStorage.setItem('quizScore', urlScore);
      } else {
        router.push('/');
      }
    } else if (storedScore) {
      const parsedScore = parseInt(storedScore, 10);
      if (!isNaN(parsedScore)) {
        setScore(parsedScore);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (score === null) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [score]);

  if (score === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: '#C7D2DF'
      }}>
        <div>Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ 
      background: '#C7D2DF',
      padding: '16px 0'
    }}>
      <style jsx global>{`
        @keyframes resultsPageIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .results-page-enter {
            animation: none !important;
          }
        }
      `}</style>
      <style jsx>{`
        .results-page-container {
          --card-width: 542px;
          
          width: 100%;
          max-width: var(--card-width);
          margin: 0 auto;
          padding: 0 16px;
        }

        .results-page-enter {
          animation: resultsPageIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (max-width: 768px) {
          .results-page-container {
            --card-width: 100%;
            padding: 0 12px;
          }
        }

        @media (max-width: 480px) {
          .results-page-container {
            padding: 0 8px;
          }
        }
      `}</style>
      
      <div className="results-page-container results-page-enter">
        <ResultsSection score={score} totalQuestions={30} outcome={outcome} />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ 
        background: '#C7D2DF'
      }}>
        <div>Завантаження...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
