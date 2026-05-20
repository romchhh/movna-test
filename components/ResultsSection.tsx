'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
  placementSteps,
  correctAnswers,
  PLACEMENT_TOTAL_QUESTIONS,
  recommendedLevelFromPlacement,
  recommendationBodyFromPlacement,
} from '@/lib/placementQuizData';

interface ResultsSectionProps {
  score: number;
  totalQuestions: number;
  outcome?: string;
}

const allQuestions: { id: number; text: string; description?: string }[] = [];
const answerLabels: Record<string, string> = { 'not-sure': 'not sure' };
placementSteps.forEach((st) => {
  st.questions.forEach((q) => {
    allQuestions.push({ id: q.id, text: q.text, description: q.description });
    q.options.forEach((o) => {
      answerLabels[o.value] = o.label;
    });
  });
});

function getResultCategory(score: number, outcome: string) {
  const max = PLACEMENT_TOTAL_QUESTIONS;
  const range = `${score} / ${max}`;
  const level = recommendedLevelFromPlacement(score, outcome);
  const levelLabel =
    level === 'C1'
      ? 'Level Up → C1'
      : level === 'A1-A2'
        ? 'A1–A2'
        : `рекомендація: ${level}`;
  return {
    range,
    level: levelLabel,
    text: recommendationBodyFromPlacement(score, outcome),
  };
}

export default function ResultsSection({ score, totalQuestions, outcome = 'completed' }: ResultsSectionProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    // Отримуємо відповіді користувача з sessionStorage
    const storedAnswers = sessionStorage.getItem('quizAnswers');
    if (storedAnswers) {
      try {
        setUserAnswers(JSON.parse(storedAnswers));
      } catch (e) {
        console.error('Failed to parse answers:', e);
      }
    }
  }, []);

  const renderQuestionText = (text: string) => {
    if (!text) return null;
    
    const color = '#0E4486';
    
    // Замінюємо підкреслення для пропусків (gap) на HTML span перед обробкою маркдауном
    let processedText = text.replace(/(_{2,})/g, (match) => {
      const length = match.length;
      return `<span class="gap-underline" data-length="${length}" style="border-bottom: 2px solid ${color}; display: inline-block; min-width: ${length * 0.6}em; height: 1em; vertical-align: baseline; text-decoration: none;"></span>`;
    });
    
    // Використовуємо react-markdown для обробки маркдауну
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }: any) => <span>{children}</span>,
          strong: ({ children }: any) => <strong style={{ color, textDecoration: 'none' }}>{children}</strong>,
          em: ({ children }: any) => <em>{children}</em>,
          // Обробка HTML span для підкреслень
          span: ({ className, style, ...props }: any) => {
            if (className === 'gap-underline') {
              return <span className={className} style={style} {...props} />;
            }
            return <span {...props} />;
          },
        }}
      >
        {processedText}
      </ReactMarkdown>
    );
  };
  const currentResult = getResultCategory(score, outcome);

  const renderFormattedText = (text: string) => {
    const boldPhrases = ['Level Up', 'B1', 'B2', 'C1', 'A1-A2', 'A2'];
    let parts: Array<{ text: string; bold: boolean }> = [{ text, bold: false }];
    boldPhrases.forEach((phrase) => {
      const newParts: Array<{ text: string; bold: boolean }> = [];
      parts.forEach((part) => {
        if (part.bold) {
          newParts.push(part);
        } else {
          const segments = part.text.split(phrase);
          segments.forEach((segment, idx) => {
            if (segment) newParts.push({ text: segment, bold: false });
            if (idx < segments.length - 1) {
              newParts.push({ text: phrase, bold: true });
            }
          });
        }
      });
      parts = newParts;
    });
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx} style={{ fontWeight: part.bold ? 600 : 400 }}>
            {part.text}
          </span>
        ))}
      </>
    );
  };


  return (
    <>
      <style jsx>{`
        .results-wrapper {
          --card-width: 542px;
          --border-radius: 24px;
          --header-py: 48px;
          --header-px: 32px;
          --content-padding: 32px;
          --content-pt: 40px;
          --title-size: 40px;
          --subtitle-size: 32px;
          --text-size: 18px;
          --circle-size: 48px;
          --circle-offset: -34px;
          --spacing-section: 24px;
          --emoji-size: 276px;

          width: 100%;
        }
        
        .results-container {
          width: 100%;
          max-width: var(--card-width);
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .results-wrapper {
            --card-width: 100%;
            --border-radius: 20px;
            --header-py: 40px;
            --header-px: 24px;
            --content-padding: 24px;
            --content-pt: 32px;
            --title-size: 32px;
            --subtitle-size: 28px;
            --text-size: 17px;
            --circle-size: 40px;
            --circle-offset: -28px;
            --spacing-section: 20px;
            --emoji-size: 221px;
          }
        }

        @media (max-width: 480px) {
          .results-wrapper {
            --border-radius: 18px;
            --header-py: 32px;
            --header-px: 20px;
            --content-padding: 20px;
            --content-pt: 28px;
            --title-size: 28px;
            --subtitle-size: 24px;
            --text-size: 16px;
            --circle-size: 36px;
            --circle-offset: -25px;
            --spacing-section: 18px;
            --emoji-size: 193px;
          }
        }

        @media (max-width: 375px) {
          .results-wrapper {
            --border-radius: 16px;
            --header-py: 28px;
            --header-px: 18px;
            --content-padding: 18px;
            --content-pt: 24px;
            --title-size: 24px;
            --subtitle-size: 20px;
            --text-size: 15px;
            --circle-size: 32px;
            --circle-offset: -22px;
            --spacing-section: 16px;
            --emoji-size: 166px;
          }
        }
      `}</style>
      
      <div className="results-wrapper">
        <div className="results-container">
          {/* Main Results Card */}
          <div className="relative shadow-xl" style={{
            background: '#0E4486',
            borderRadius: 'var(--border-radius)',
            overflow: 'hidden',
            marginBottom: 'var(--spacing-section)'
          }}>
            {/* Header with title */}
            <div className="relative" style={{ 
              paddingTop: 'var(--header-py)', 
              paddingBottom: 'var(--header-py)',
              paddingLeft: 'var(--header-px)',
              paddingRight: 'var(--header-px)'
            }}>
              <h3 style={{
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 'var(--title-size)',
                lineHeight: '120%',
                letterSpacing: '0%',
                textAlign: 'center',
                color: '#FFFFFF',
                margin: '0',
                marginBottom: '16px'
              }}>
                Results🧡
              </h3>
              <p style={{
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: 'var(--subtitle-size)',
                lineHeight: '120%',
                textAlign: 'center',
                color: '#FFFFFF',
                margin: '0',
                marginBottom: '8px'
              }}>
                Ваш результат: {score} / {totalQuestions}
              </p>
              <p style={{
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 500,
                fontSize: 'calc(var(--subtitle-size) * 0.75)',
                lineHeight: '140%',
                textAlign: 'center',
                color: '#FFFFFF',
                margin: '0',
                opacity: 0.9
              }}>
                {currentResult.range} — {currentResult.level}
              </p>
            </div>

            {/* Content with emoji */}
            <div className="relative" style={{
              background: '#F1EEE9',
              borderRadius: '0 0 var(--border-radius) var(--border-radius)',
              padding: 'var(--content-padding)',
              paddingTop: 'calc(var(--content-pt) * 0.6)',
              paddingBottom: 'calc(var(--content-pt) * 0.6)'
            }}>
              {/* Circles divider */}
              <div className="absolute left-0 right-0 flex justify-between items-center" style={{ 
                top: 'calc(var(--circle-size) / -2)',
                paddingLeft: '0',
                paddingRight: '0',
                overflow: 'visible'
              }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`circle-${i}`}
                    className="rounded-full"
                    style={{
                      width: 'var(--circle-size)',
                      height: 'var(--circle-size)',
                      marginLeft: i === 0 ? 'var(--circle-offset)' : '0',
                      marginRight: i === 5 ? 'var(--circle-offset)' : '0',
                      background: '#F1EEE9'
                    }}
                  />
                ))}
              </div>

              {/* Emoji/Image Display */}
              <div style={{
                textAlign: 'center',
                marginBottom: 'calc(var(--spacing-section) * 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  width: 'var(--emoji-size)',
                  height: 'var(--emoji-size)',
                  position: 'relative'
                }}>
                  <Image
                    src="/result-emoji.png"
                    alt="Result"
                    width={200}
                    height={200}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain'
                    }}
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Result Category - показуємо тільки один результат, що відповідає score */}
          <div 
            style={{
              background: '#F1EEE9',
              borderRadius: 'var(--border-radius)',
              padding: 'var(--content-padding)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              marginBottom: 'var(--spacing-section)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                flexShrink: 0,
                marginTop: '2px',
                width: '24px',
                height: '24px'
              }}>
                <Image 
                  src="/Vector.svg" 
                  alt="" 
                  width={24} 
                  height={24}
                  style={{ 
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
              <div>
                <h4 style={{
                  fontFamily: 'Craftwork Grotesk, sans-serif',
                  fontWeight: 700,
                  fontSize: 'var(--text-size)',
                  lineHeight: '120%',
                  letterSpacing: '0%',
                  color: '#0E4486',
                  margin: '0 0 8px 0',
                  textAlign: 'justify'
                }}>
                  {currentResult.range}
                </h4>
                <p style={{
                  fontFamily: 'Craftwork Grotesk, sans-serif',
                  fontWeight: 400,
                  fontSize: 'var(--text-size)',
                  lineHeight: '120%',
                  letterSpacing: '0%',
                  color: '#0E4486',
                  margin: '0',
                  textAlign: 'justify'
                }}>
                  {renderFormattedText(currentResult.text)}
                </p>
              </div>
            </div>
          </div>

          {/* Answers Review Section — лише питання з непорожньою відповіддю */}
          {allQuestions.some((question) => {
            const ua = userAnswers[question.id];
            return typeof ua === 'string' && ua.length > 0;
          }) && (
            <div 
              style={{
                background: '#F1EEE9',
                borderRadius: 'var(--border-radius)',
                padding: 'var(--content-padding)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                marginBottom: 'var(--spacing-section)'
              }}
            >
              <h4 style={{
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: 'var(--text-size)',
                lineHeight: '120%',
                letterSpacing: '0%',
                color: '#0E4486',
                margin: '0 0 20px 0',
                textAlign: 'left'
              }}>
                Ваші відповіді:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {allQuestions
                  .filter((question) => {
                    const ua = userAnswers[question.id];
                    return typeof ua === 'string' && ua.length > 0;
                  })
                  .sort((a, b) => a.id - b.id)
                  .map((question) => {
                  const userAnswer = userAnswers[question.id];
                  const correctAnswer = correctAnswers[question.id];
                  const isCorrect =
                    Boolean(userAnswer) && Boolean(correctAnswer) && userAnswer === correctAnswer;
                  const userAnswerLabel = answerLabels[userAnswer] || userAnswer;
                  const correctAnswerLabel = answerLabels[correctAnswer] || correctAnswer;

                  return (
                    <div 
                      key={question.id}
                      style={{
                        padding: '16px',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: `2px solid ${isCorrect ? '#4CAF50' : '#F44336'}`,
                      }}
                    >
                      {(question as any).description && (
                        <div style={{
                          fontFamily: 'Craftwork Grotesk, sans-serif',
                          fontWeight: 500,
                          fontSize: 'calc(var(--text-size) * 0.85)',
                          lineHeight: '140%',
                          color: '#0E4486',
                          margin: '0 0 8px 0',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px'
                        }}>
                          <Image 
                            src="/Vector.svg" 
                            alt="" 
                            width={20} 
                            height={20}
                            style={{ 
                              marginTop: '2px',
                              flexShrink: 0,
                              width: '20px',
                              height: 'auto'
                            }}
                          />
                          <span>{renderQuestionText((question as any).description || '')}</span>
                        </div>
                      )}
                      {question.text && (
                        <p style={{
                          fontFamily: 'Craftwork Grotesk, sans-serif',
                          fontWeight: 600,
                          fontSize: 'calc(var(--text-size) * 0.9)',
                          lineHeight: '140%',
                          color: '#0E4486',
                          margin: '0 0 12px 0',
                        }}>
                          <strong>Питання {question.id}:</strong> {renderQuestionText(question.text)}
                        </p>
                      )}
                      {!question.text && !(question as any).description && (
                        <p style={{
                          fontFamily: 'Craftwork Grotesk, sans-serif',
                          fontWeight: 600,
                          fontSize: 'calc(var(--text-size) * 0.9)',
                          lineHeight: '140%',
                          color: '#0E4486',
                          margin: '0 0 12px 0',
                        }}>
                          <strong>Питання {question.id}</strong>
                        </p>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div>
                          <span style={{
                            fontFamily: 'Craftwork Grotesk, sans-serif',
                            fontWeight: 600,
                            fontSize: 'calc(var(--text-size) * 0.85)',
                            color: '#0E4486',
                          }}>
                            Ваша відповідь: 
                          </span>
                          <span style={{
                            fontFamily: 'Craftwork Grotesk, sans-serif',
                            fontWeight: 700,
                            fontSize: 'calc(var(--text-size) * 0.85)',
                            color: isCorrect ? '#4CAF50' : '#F44336',
                            marginLeft: '8px',
                          }}>
                            {userAnswerLabel}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div>
                            <span style={{
                              fontFamily: 'Craftwork Grotesk, sans-serif',
                              fontWeight: 600,
                              fontSize: 'calc(var(--text-size) * 0.85)',
                              color: '#0E4486',
                            }}>
                              Правильна відповідь: 
                            </span>
                            <span style={{
                              fontFamily: 'Craftwork Grotesk, sans-serif',
                              fontWeight: 700,
                              fontSize: 'calc(var(--text-size) * 0.85)',
                              color: '#4CAF50',
                              marginLeft: '8px',
                            }}>
                              {correctAnswerLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
