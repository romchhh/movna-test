'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ResultsSection from '@/components/ResultsSection';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    // Отримуємо score з URL параметрів або sessionStorage
    const urlScore = searchParams.get('score');
    const storedScore = sessionStorage.getItem('quizScore');
    
    if (urlScore) {
      const parsedScore = parseInt(urlScore, 10);
      if (!isNaN(parsedScore)) {
        setScore(parsedScore);
        // Зберігаємо в sessionStorage для безпеки
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
      // Якщо немає score, перенаправляємо на головну
      router.push('/');
    }
  }, [searchParams, router]);

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
      <style jsx>{`
        .results-page-container {
          --card-width: 542px;
          
          width: 100%;
          max-width: var(--card-width);
          margin: 0 auto;
          padding: 0 16px;
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
      
      <div className="results-page-container">
        <ResultsSection score={score} totalQuestions={20} />
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
