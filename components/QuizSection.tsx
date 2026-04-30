'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import {
  placementSteps,
  correctAnswers,
  PLACEMENT_TOTAL_QUESTIONS,
  PLACEMENT_PASS_PER_STEP,
  failMessages,
  outcomeForFailedStep,
  type Question,
  type PlacementOutcome,
} from '@/lib/placementQuizData';

interface ContactFormData {
  name: string;
  phone: string;
  telegram: string;
  instagram: string;
}

interface QuizSectionProps {
  isFormValid?: boolean;
  formData?: ContactFormData;
  leadId?: number;
}

export default function QuizSection({ isFormValid = true, formData, leadId }: QuizSectionProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  /** Sum of correct answers on steps already passed (confirmed «Наступний етап») */
  const [confirmedScore, setConfirmedScore] = useState(0);
  const [highlightUnanswered, setHighlightUnanswered] = useState<number | null>(null);
  const [showFormMessage, setShowFormMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  /** After «Далі»: show green/red on options until user continues or finishes */
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [stepOutcome, setStepOutcome] = useState<'pending' | 'pass' | 'fail' | null>(null);
  const [lastStepCorrectCount, setLastStepCorrectCount] = useState(0);
  const submittingRef = useRef(false);
  const lastScrolledToStepRef = useRef<number | null>(null);

  const stepQuestions = placementSteps[currentStepIndex].questions;

  /** Плавний скрол до нового етапу після «Наступний етап» */
  useEffect(() => {
    if (currentStepIndex === 0) {
      lastScrolledToStepRef.current = 0;
      return;
    }
    if (lastScrolledToStepRef.current === currentStepIndex) return;
    lastScrolledToStepRef.current = currentStepIndex;
    const timer = window.setTimeout(() => {
      document.getElementById(`quiz-step-${currentStepIndex}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }, 90);
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  /** Після перевірки етапу — прокрутка до панелі результату / кнопки */
  useEffect(() => {
    if (!showAnswerFeedback || !stepOutcome) return;
    const timer = window.setTimeout(() => {
      document.getElementById('quiz-feedback-anchor')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }, 120);
    return () => clearTimeout(timer);
  }, [showAnswerFeedback, stepOutcome, currentStepIndex]);

  const stepIndexForQuestion = (questionId: number) => {
    for (let i = 0; i < placementSteps.length; i++) {
      if (placementSteps[i].questions.some((q) => q.id === questionId)) return i;
    }
    return -1;
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    const si = stepIndexForQuestion(questionId);
    if (si < currentStepIndex) return;
    if (si === currentStepIndex && showAnswerFeedback) return;
    if (isFormValid === false) {
      setShowFormMessage(true);
      setTimeout(() => {
        const formSection = document.getElementById('contact-form-section');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          formSection.style.transition = 'all 0.3s ease';
          formSection.style.transform = 'scale(1.02)';
          setTimeout(() => {
            formSection.style.transform = 'scale(1)';
          }, 300);
        }
      }, 100);
      setTimeout(() => setShowFormMessage(false), 4000);
      return;
    }
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (highlightUnanswered === questionId) setHighlightUnanswered(null);
    if (showFormMessage) setShowFormMessage(false);
  };

  const countCorrectInStep = (stepIdx: number): number => {
    const qs = placementSteps[stepIdx].questions;
    let n = 0;
    for (const q of qs) {
      if (answers[q.id] && correctAnswers[q.id] === answers[q.id]) n++;
    }
    return n;
  };

  const runningTotalScore =
    confirmedScore + (showAnswerFeedback || stepOutcome === 'fail' ? lastStepCorrectCount : 0);

  const progressDen = PLACEMENT_TOTAL_QUESTIONS;
  const progressNum = Math.min(progressDen, Object.keys(answers).length);

  const handleCheckStep = () => {
    if (showAnswerFeedback) return;
    const firstMissing = stepQuestions.find((q) => !answers[q.id]);
    if (firstMissing) {
      setHighlightUnanswered(firstMissing.id);
      setTimeout(() => {
        const el = document.getElementById(`question-${firstMissing.id}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    const correctInStep = countCorrectInStep(currentStepIndex);
    setLastStepCorrectCount(correctInStep);
    setShowAnswerFeedback(true);
    const isLastStep = currentStepIndex === placementSteps.length - 1;
    if (isLastStep || correctInStep >= PLACEMENT_PASS_PER_STEP) {
      setStepOutcome('pass');
    } else {
      setStepOutcome('fail');
    }
  };

  const persistAndNavigate = (finalScore: number, outcome: PlacementOutcome) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSaving(true);
    sessionStorage.setItem('quizScore', String(finalScore));
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    sessionStorage.setItem('quizOutcome', outcome);

    let utmParams = null;
    try {
      const storedUtm = sessionStorage.getItem('utm_params');
      if (storedUtm) utmParams = JSON.parse(storedUtm);
    } catch {
      /* ignore */
    }

    const payload = {
      formData: formData || undefined,
      answers,
      score: finalScore,
      outcome,
      leadId,
      utmParams,
    };
    fetch('/api/sheets/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((result) => {
        if (!result.success) console.error('Failed to save data:', result.error);
      })
      .catch((err) => console.error('Error saving data:', err));

    if (leadId) {
      fetch('/api/crm/complete-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, test_result: finalScore, outcome }),
      })
        .then((r) => r.json())
        .then((crm) => {
          if (!crm.success) console.error('Failed to update CRM:', crm.error);
        })
        .catch((err) => console.error('Error updating CRM:', err));
    }

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      window.setTimeout(() => {
        router.push(`/results?score=${finalScore}&outcome=${encodeURIComponent(outcome)}`);
      }, 220);
    } else {
      router.push(`/results?score=${finalScore}&outcome=${encodeURIComponent(outcome)}`);
    }
  };

  const handleNextStepAfterPass = () => {
    if (stepOutcome !== 'pass' || !showAnswerFeedback) return;
    const newConfirmed = confirmedScore + lastStepCorrectCount;
    setConfirmedScore(newConfirmed);
    setShowAnswerFeedback(false);
    setStepOutcome(null);
    setLastStepCorrectCount(0);
    if (currentStepIndex >= placementSteps.length - 1) {
      persistAndNavigate(newConfirmed, 'completed');
      return;
    }
    setCurrentStepIndex((i) => i + 1);
  };

  const handleFinishAfterFail = () => {
    if (stepOutcome !== 'fail') return;
    const finalScore = confirmedScore + lastStepCorrectCount;
    const sn = (currentStepIndex + 1) as 1 | 2 | 3 | 4 | 5;
    const outcome = outcomeForFailedStep(sn);
    persistAndNavigate(finalScore, outcome);
  };

  const renderQuestionText = (text: string, isHighlighted: boolean) => {
    if (!text) return null;
    const color = isHighlighted ? '#F44336' : '#0E4486';
    let processedText = text
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n/g, '<br />')
      .replace(/(_{2,})/g, (match) => {
        const length = match.length;
        return `<span class="gap-underline" data-length="${length}" style="border-bottom: 2px solid ${color}; display: inline-block; min-width: ${length * 0.6}em; height: 1em; vertical-align: baseline; text-decoration: none;"></span>`;
      });
    return (
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          p: ({ children }: { children?: React.ReactNode }) => <span>{children}</span>,
          strong: ({ children }: { children?: React.ReactNode }) => (
            <strong style={{ color, textDecoration: 'none' }}>{children}</strong>
          ),
          em: ({ children }: { children?: React.ReactNode }) => <em>{children}</em>,
          br: () => <br />,
          span: ({
            className,
            style,
            ...props
          }: {
            className?: string;
            style?: React.CSSProperties;
          }) => {
            if (className === 'gap-underline') {
              return <span className={className} style={style} {...props} />;
            }
            return <span style={style} {...props} />;
          },
        }}
      >
        {processedText}
      </ReactMarkdown>
    );
  };

  const optionStyle = (
    question: Question,
    option: { label: string; value: string },
    isHighlighted: boolean,
    stepIdx: number
  ) => {
    const chosen = answers[question.id] === option.value;
    const correctVal = correctAnswers[question.id];
    const isCorrectOption = option.value === correctVal;
    let bg = 'transparent';
    let border = isHighlighted ? '#F44336' : '#0E4486';
    let color = isHighlighted ? '#D32F2F' : '#0E4486';
    const feedbackOn =
      stepIdx < currentStepIndex || (stepIdx === currentStepIndex && showAnswerFeedback);
    if (feedbackOn) {
      if (isCorrectOption) {
        bg = '#E8F5E9';
        border = '#2E7D32';
        color = '#1B5E20';
      } else if (chosen && !isCorrectOption) {
        bg = '#FFEBEE';
        border = '#C62828';
        color = '#B71C1C';
      }
    }
    return { bg, border, color };
  };

  const renderQuestion = (question: Question, isFirstInSection: boolean, stepIdx: number) => {
    const isHighlighted =
      highlightUnanswered === question.id && stepIdx === currentStepIndex;
    const st = optionStyle;
    const stepLocked =
      stepIdx < currentStepIndex || (stepIdx === currentStepIndex && showAnswerFeedback);
    return (
      <div
        id={`question-${question.id}`}
        key={question.id}
        style={{
          marginBottom: isFirstInSection ? 'var(--spacing-section)' : '0',
          marginLeft: isHighlighted ? '-16px' : '0',
          marginRight: isHighlighted ? '-16px' : '0',
          padding: isHighlighted ? '16px' : '0',
          borderRadius: isHighlighted ? '12px' : '0',
          backgroundColor: isHighlighted ? '#FFEBEE' : 'transparent',
          border: isHighlighted ? '2px solid #F44336' : 'none',
          transition:
            'background-color 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease, margin 0.35s ease, padding 0.35s ease',
        }}
      >
        {question.description && (
          <div
            style={{
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontWeight: 500,
              fontSize: 'var(--desc-size)',
              lineHeight: '140%',
              color: isHighlighted ? '#F44336' : '#0E4486',
              marginBottom: 'var(--spacing-question)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <Image
              src="/Vector.svg"
              alt=""
              width={24}
              height={24}
              style={{ marginTop: '2px', flexShrink: 0, width: 'var(--radio-size)', height: 'auto' }}
            />
            <span>{renderQuestionText(question.description, isHighlighted)}</span>
          </div>
        )}
        {question.text && (
          <p
            style={{
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontWeight: 400,
              fontSize: 'var(--question-size)',
              lineHeight: '150%',
              color: isHighlighted ? '#F44336' : '#0E4486',
              marginBottom: 'var(--spacing-question)',
            }}
          >
            <strong>{question.id}.</strong> {renderQuestionText(question.text, isHighlighted)}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-option)' }}>
          {question.options.map((option, idx) => {
            const feedbackOn =
              stepIdx < currentStepIndex || (stepIdx === currentStepIndex && showAnswerFeedback);
            const { bg, border, color } = st(question, option, isHighlighted, stepIdx);
            const chosen = answers[question.id] === option.value;
            return (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: stepLocked ? 'default' : 'pointer',
                  fontFamily: 'Craftwork Grotesk, sans-serif',
                  fontSize: 'var(--question-size)',
                  color,
                  padding: feedbackOn ? '10px 12px' : '0',
                  borderRadius: feedbackOn ? '10px' : '0',
                  background: bg,
                  border: feedbackOn ? `2px solid ${border}` : 'none',
                  transition:
                    'background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, padding 0.25s ease',
                }}
                onClick={() => handleAnswerChange(question.id, option.value)}
              >
                <div
                  style={{
                    width: 'var(--radio-size)',
                    height: 'var(--radio-size)',
                    borderRadius: '50%',
                    border: `2px solid ${border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: chosen ? border : 'transparent',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  {chosen && (
                    <div
                      style={{
                        width: 'var(--radio-inner)',
                        height: 'var(--radio-inner)',
                        borderRadius: '50%',
                        background: '#FFFFFF',
                      }}
                    />
                  )}
                </div>
                {option.label}
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const failStepNum = (currentStepIndex + 1) as 1 | 2 | 3 | 4 | 5;
  const failCopy =
    stepOutcome === 'fail' && currentStepIndex < placementSteps.length - 1
      ? failMessages[failStepNum]
      : null;

  return (
    <>
      {showFormMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#F44336',
            color: '#FFFFFF',
            padding: '16px 24px',
            borderRadius: '12px',
            fontFamily: 'Craftwork Grotesk, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            zIndex: 1002,
            boxShadow: '0 4px 20px rgba(244, 67, 54, 0.4)',
            maxWidth: '90%',
            textAlign: 'center',
          }}
        >
          Спочатку заповніть форму!
        </div>
      )}

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'rgba(14, 68, 134, 0.1)',
          zIndex: 1000,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #0E4486 0%, #167DAB 100%)',
            width: `${(progressNum / progressDen) * 100}%`,
            transition: 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#0E4486',
          color: '#FFFFFF',
          padding: '8px 16px',
          borderRadius: '20px',
          fontFamily: 'Craftwork Grotesk, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
        }}
      >
        <span>
          Балів загалом:{' '}
          {showAnswerFeedback || stepOutcome === 'fail'
            ? runningTotalScore
            : confirmedScore}
        </span>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes quizStepReveal {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes quizPanelIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .quiz-step-block,
          .quiz-feedback-panel {
            animation: none !important;
          }
        }
      `}</style>
      <style jsx>{`
        .quiz-wrapper {
          --card-width: 542px;
          --border-radius: 24px;
          --header-py: 48px;
          --header-px: 32px;
          --content-padding: 32px;
          --content-pt: 40px;
          --title-size: 40px;
          --desc-size: 18px;
          --question-size: 16px;
          --radio-size: 24px;
          --radio-inner: 12px;
          --circle-size: 48px;
          --circle-offset: -34px;
          --spacing-section: 24px;
          --spacing-question: 16px;
          --spacing-option: 10px;
          --button-size: 20px;
          --button-py: 20px;
          --button-px: 32px;
          width: 100%;
          max-width: var(--card-width);
          margin: 0 auto;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .quiz-container {
          width: 100%;
          box-sizing: border-box;
        }
        .quiz-step-block {
          scroll-margin-top: 88px;
          animation: quizStepReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .quiz-feedback-panel {
          animation: quizPanelIn 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .quiz-primary-btn {
          transition: background 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease,
            opacity 0.25s ease;
        }
        .quiz-primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .quiz-primary-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .quiz-pass-btn:hover:not(:disabled) {
          box-shadow: 0 6px 22px rgba(46, 125, 50, 0.4);
        }
        @media (max-width: 768px) {
          .quiz-wrapper {
            --card-width: 100%;
            --border-radius: 20px;
            --header-py: 40px;
            --header-px: 24px;
            --content-padding: 24px;
            --content-pt: 32px;
            --title-size: 32px;
            --desc-size: 16px;
            --question-size: 15px;
            --radio-size: 22px;
            --radio-inner: 11px;
            --circle-size: 40px;
            --circle-offset: -28px;
            padding: 0 12px;
          }
        }
      `}</style>

      <div className="quiz-wrapper">
        <div
          className="quiz-container"
          style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
        >
          {placementSteps.slice(0, currentStepIndex + 1).map((stepData, stepIdx) => {
            const qs = stepData.questions;
            return (
              <div
                key={stepIdx}
                id={`quiz-step-${stepIdx}`}
                className="quiz-step-block"
                style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}
              >
                <div
                  className="relative shadow-xl"
                  style={{ background: '#0E4486', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}
                >
                  <div
                    className="relative"
                    style={{
                      paddingTop: 'var(--header-py)',
                      paddingBottom: 'var(--header-py)',
                      paddingLeft: 'var(--header-px)',
                      paddingRight: 'var(--header-px)',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 'var(--title-size)',
                        lineHeight: '120%',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      {stepData.title}
                    </h3>
                  </div>
                  <div
                    className="relative"
                    style={{
                      background: '#F1EEE9',
                      borderRadius: '0 0 var(--border-radius) var(--border-radius)',
                      padding: 'var(--content-padding)',
                      paddingTop: 'var(--content-pt)',
                    }}
                  >
                    <div
                      className="absolute left-0 right-0 flex justify-between items-center"
                      style={{ top: 'calc(var(--circle-size) / -2)', overflow: 'visible' }}
                    >
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={`c-${stepIdx}-${i}`}
                          className="rounded-full"
                          style={{
                            width: 'var(--circle-size)',
                            height: 'var(--circle-size)',
                            marginLeft: i === 0 ? 'var(--circle-offset)' : '0',
                            marginRight: i === 5 ? 'var(--circle-offset)' : '0',
                            background: '#F1EEE9',
                          }}
                        />
                      ))}
                    </div>
                    {stepData.sectionDescription ? (
                      <div
                        style={{
                          fontFamily: 'Craftwork Grotesk, sans-serif',
                          fontWeight: 500,
                          fontSize: 'var(--desc-size)',
                          lineHeight: '140%',
                          color: '#0E4486',
                          marginBottom: 'var(--spacing-section)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                        }}
                      >
                        <Image
                          src="/Vector.svg"
                          alt=""
                          width={24}
                          height={24}
                          style={{
                            marginTop: '2px',
                            flexShrink: 0,
                            width: 'var(--radio-size)',
                            height: 'auto',
                          }}
                        />
                        <span>{stepData.sectionDescription}</span>
                      </div>
                    ) : null}
                    {renderQuestion(qs[0], true, stepIdx)}
                  </div>
                </div>

                {qs.slice(1).map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: '#F1EEE9',
                      borderRadius: 'var(--border-radius)',
                      padding: 'var(--content-padding)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    {renderQuestion(q, false, stepIdx)}
                  </div>
                ))}

                {stepIdx === currentStepIndex && showAnswerFeedback && stepOutcome === 'fail' && failCopy && (
                  <div
                    id="quiz-feedback-anchor"
                    className="quiz-feedback-panel"
                    style={{
                      background: '#F1EEE9',
                      borderRadius: 'var(--border-radius)',
                      padding: 'var(--content-padding)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      border: '2px solid #0E4486',
                      scrollMarginTop: '72px',
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontWeight: 700,
                        fontSize: 'var(--desc-size)',
                        color: '#0E4486',
                        margin: '0 0 12px 0',
                      }}
                    >
                      {failCopy.title}: {runningTotalScore} / {PLACEMENT_TOTAL_QUESTIONS}
                    </h4>
                    <p
                      style={{
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontSize: 'var(--question-size)',
                        lineHeight: '150%',
                        color: '#0E4486',
                        margin: 0,
                        textAlign: 'justify',
                      }}
                    >
                      {failCopy.body}
                    </p>
                    <button
                      type="button"
                      className="quiz-primary-btn"
                      disabled={isSaving}
                      style={{
                        marginTop: '20px',
                        width: '100%',
                        background: '#0E4486',
                        color: '#fff',
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontWeight: 600,
                        fontSize: 'var(--button-size)',
                        padding: 'var(--button-py) var(--button-px)',
                        borderRadius: 'var(--border-radius)',
                        border: 'none',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 16px rgba(14, 68, 134, 0.25)',
                      }}
                      onClick={handleFinishAfterFail}
                    >
                      {isSaving ? 'Збереження…' : 'Перейти до підсумку'}
                    </button>
                  </div>
                )}

                {stepIdx === currentStepIndex && showAnswerFeedback && stepOutcome === 'pass' && (
                  <div
                    id="quiz-feedback-anchor"
                    className="quiz-feedback-panel"
                    style={{
                      background: '#E8F5E9',
                      borderRadius: 'var(--border-radius)',
                      padding: 'var(--content-padding)',
                      border: '2px solid #2E7D32',
                      scrollMarginTop: '72px',
                    }}
                  >
                    <p
                      style={{
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontSize: 'var(--question-size)',
                        color: '#1B5E20',
                        margin: 0,
                      }}
                    >
                      На цьому етапі: {lastStepCorrectCount} / {stepQuestions.length} правильних. Загалом:{' '}
                      {runningTotalScore} балів.
                    </p>
                    <button
                      type="button"
                      className="quiz-primary-btn quiz-pass-btn"
                      disabled={isSaving}
                      style={{
                        marginTop: '16px',
                        width: '100%',
                        background: '#2E7D32',
                        color: '#fff',
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontWeight: 600,
                        fontSize: 'var(--button-size)',
                        padding: 'var(--button-py) var(--button-px)',
                        borderRadius: 'var(--border-radius)',
                        border: 'none',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
                      }}
                      onClick={handleNextStepAfterPass}
                    >
                      {currentStepIndex >= placementSteps.length - 1 ? 'Завершити тест' : 'Наступний етап'}
                    </button>
                  </div>
                )}

                {stepIdx === currentStepIndex && !showAnswerFeedback && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      className="quiz-primary-btn"
                      disabled={isSaving}
                      style={{
                        width: '100%',
                        background: '#0E4486',
                        color: '#FFFFFF',
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontWeight: 600,
                        fontSize: 'var(--button-size)',
                        padding: 'var(--button-py) var(--button-px)',
                        borderRadius: 'var(--border-radius)',
                        border: 'none',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 16px rgba(14, 68, 134, 0.25)',
                      }}
                      onClick={handleCheckStep}
                    >
                      Далі — перевірити етап
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
