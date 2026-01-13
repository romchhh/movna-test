'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface ResultsSectionProps {
  score: number;
  totalQuestions: number;
}

// Правильні відповіді (імпортуємо з QuizSection або визначаємо тут)
const correctAnswers: Record<number, string> = {
  1: 'mind-ear',
  2: 'speak-up-message',
  3: 'insomniac-nap',
  4: 'live-up-mess',
  5: 'vary-cut',
  6: 'taxing-zone',
  7: 'red-away',
  8: 'grow-there',
  9: 'out-amend',
  10: 'allowances-tooth',
  11: 'correct',
  12: 'incorrect',
  13: 'to-feed',
  14: 'was-was',
  15: 'had-would',
  16: 'whilst',
  17: 'could-not',
  18: 'arranged',
  19: 'dont-you',
  20: 'both'
};

// Питання для відображення
const allQuestions = [
  { id: 1, text: "I forgot to buy vegetables for the curry. It totally slipped my _____. Things go in one _____ and out the other all the time!" },
  { id: 2, text: "Make sure you ______ so everyone can hear you. To ______ clearly, use visuals like photos or pictures" },
  { id: 3, text: "I'm a(n) ______, so I often have a ______ in the afternoon to try to catch up on sleep" },
  { id: 4, text: "My first stand-up comedy didn't quite ______ my expectations. Actually, it was a complete disaster, but I was determined not to ______" },
  { id: 5, text: "I suddenly realised how unhealthy my diet was — full of sugar and salt. So, I made the decision to ______ my diet more and ______ processed foods" },
  { id: 6, description: 'Choose the correct chunks / idioms / phrasal verbs or their forms to complete the sentences below', text: "After months of constant overtime, the project became so ______ that I started to ______ during meetings without realising it" },
  { id: 7, text: "After reviewing the finances, it became clear that the company was _____ this quarter. The management decided to ______ several outdated policies to cut costs" },
  { id: 8, text: "Although those siblings used to be inseparable, they slowly began to ______, but the older sister promised she would always ______ him when things got tough" },
  { id: 9, text: "Orest tried to keep the party a secret, but the information managed to slip _____ before the event. So, he decided to _____ the invitations" },
  { id: 10, text: "Solomiia had to ______ her colleague's mistakes and fight ______ to defend her team during the negotiations" },
  { id: 11, text: "I do really want to take up the guitar" },
  { id: 12, text: "Be bound to give me a call when you arrive at the hotel" },
  { id: 13, description: 'Choose the correct option to fill in the gaps in the sentences below', text: "__________ (feed) the dog!" },
  { id: 14, text: "What ____ most impressive in my childhood are the songs I recorded at home. It ____ my parents I had to thank for their understanding" },
  { id: 15, text: "Orest was lucky. If his plane ________ crashed into the houses, some people ________ died" },
  { id: 16, text: '**The word "whereas" in the sentence below can be replaced by…**\n__Whereas__ Orest is very sociable and outgoing, I am quiet and shy' },
  { id: 17, text: "**Which one DOESN'T show that something is possible, but not certain?**" },
  { id: 18, text: "Choose the option that has the same meaning as the sentence below:\n**I had a plan to meet Taras, and it didn't change**" },
  { id: 19, text: "Choose the option that **CANNOT** be used to fill in the gap in the sentence below:\n\n**Pick me up at eight, ______?**" },
  { id: 20, text: "Choose the option that best describes the future action mentioned in the sentence below\n\n**Don't worry. __I'll have the report finished__ before the meeting**" },
];

// Мапінг значень відповідей на читабельні тексти
const answerLabels: Record<string, string> = {
  'mind-tongue': 'mind, tongue',
  'mind-ear': 'mind, ear',
  'tongue-ear': 'tongue, ear',
  'tongue-mind': 'tongue, mind',
  'speak-up-message': 'speak up, get your message across',
  'point-out-message': 'point out, get your message across',
  'speak-up-come': 'speak up, come across',
  'point-out-come': 'point out, come across',
  'insomniac-lie-in': 'insomniac, lie-in',
  'insomniac-nap': 'insomniac, nap',
  'heavy-nap': 'heavy sleeper, nap',
  'heavy-lie-in': 'heavy sleeper, lie-in',
  'come-up-mess': 'come up with, mess up',
  'live-up-mess': 'live up to, mess up',
  'come-up-end': 'come up with, end up',
  'live-up-end': 'live up to, end up',
  'expand-cut': 'expand, cut down on',
  'expand-keep': 'expand, keep down',
  'vary-cut': 'vary, cut down on',
  'vary-keep': 'vary, keep down',
  'exhausted-drift': 'exhausted, drift apart',
  'exhausted-zone': 'exhausted, zone out',
  'taxing-drift': 'mentally taxing, drift apart',
  'taxing-zone': 'mentally taxing, zone out',
  'red-away': 'in the red, do away with',
  'red-slip': 'in the red, slip out',
  'drifting-away': 'drifting, do away with',
  'drifting-slip': 'drifting, slip out',
  'fall-stand': 'fall off, stand with',
  'fall-there': 'fall off, be there for',
  'grow-there': 'grow apart, be there for',
  'grow-stand': 'grow apart, stand with',
  'out-amend': 'out, amend',
  'out-decline': 'out, decline',
  'in-amend': 'in, amend',
  'in-decline': 'in, decline',
  'firm-cats': 'stand firm for, cats and dogs',
  'firm-tooth': 'stand firm for, tooth and nail',
  'allowances-cats': 'make allowances for, cats and dogs',
  'allowances-tooth': 'make allowances for, tooth and nail',
  'correct': 'correct',
  'incorrect': 'incorrect',
  'feeding': 'Remember feeding',
  'to-feed': 'Remember to feed',
  'is-are': 'is, are',
  'was-were': 'was, were',
  'is-is': 'is, is',
  'was-was': 'was, was',
  'wouldnt-had': "wouldn't, had",
  'would-had': 'would, had',
  'hadnt-would': "hadn't, would have",
  'had-would': 'had, would have',
  'in-spite': 'In spite',
  'whilst': 'Whilst',
  'through': 'Through',
  'could-not': 'Machines could not replace human workers for many years',
  'probably-wont': "Machines probably won't replace human workers for many years",
  'may-not': 'Machines may not replace human workers for many years',
  'arranged': 'I had arranged to meet Taras after the show',
  'planning': 'I was planning to meet Taras after the show',
  'meant': 'I was meant to meet Taras after the show',
  'could-you': 'could you',
  'wont-you': "won't you",
  'dont-you': "don't you",
  'will-you': 'will you',
  'will-do': 'I will do the report',
  'will-get': 'I will get the report done',
  'both': 'Both',
  'not-sure': 'not sure',
};

export default function ResultsSection({ score, totalQuestions }: ResultsSectionProps) {
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
  const getResultCategory = (score: number) => {
    if (score >= 0 && score <= 3) {
      return {
        range: '0-3 бали',
        text: '— якщо ви зрозуміли суть завдань, (хоча і не знали правильної відповіді), вам буде комфортно на курсі B2.1: весь цей матеріал ми опануємо разом',
        level: 'B2.1 (початковий рівень)'
      };
    } else if (score >= 4 && score <= 8) {
      return {
        range: '4-8 балів',
        text: '— ви вже маєте потрібну базу і курс Level Up В2.1 стане дуже потужним бустом для вашої англійської. Найбільше для себе ви візьмете на тарифі з груповими/індивідуальними заняттями',
        level: 'B2.1 (середній рівень)'
      };
    } else if (score >= 9 && score <= 12) {
      return {
        range: '9-12 балів',
        text: '— ви вже маєте непоганий В2. Вам добре підійде курс B2.2, зокрема тариф зі зворотним зв\'язком від ментора (щоб ставити уточнювальні запитання) або з груповими чи індивідуальними заняттями',
        level: 'B2.2'
      };
    } else if (score >= 13 && score <= 17) {
      return {
        range: '13-17 балів',
        text: '— у вас вже хороший В2! Можливо, має сенс розглянути рівень B2, але самостійний тариф з матеріалами, щоб допрацювати невеликі прогалини самостійно. Або ж, пірнати у вивчення англи на рівні С1',
        level: 'B2 (просунутий) / C1 (початковий)'
      };
    } else {
      return {
        range: '18-20 балів',
        text: '— у вас дуже класний В2! Настав час опанувати англійську на рівні С1, щоб завдяки підтримці ментора вільно висловлювати свої думки, володіючи тонкощами високого рівня',
        level: 'C1'
      };
    }
  };

  // Функція для отримання текстового результату для CRM
  const getResultTextForCRM = (score: number): string => {
    const result = getResultCategory(score);
    return `${result.range} — ${result.level}`;
  };

  const currentResult = getResultCategory(score);

  const renderFormattedText = (text: string) => {
    // Слова/фрази що повинні бути жирними (600)
    const boldPhrases = ['Level Up В2.1', 'курс B2.2', 'рівні С1'];
    
    let parts: Array<{ text: string; bold: boolean }> = [{ text, bold: false }];
    
    // Розбиваємо текст на частини з жирними фразами
    boldPhrases.forEach(phrase => {
      const newParts: Array<{ text: string; bold: boolean }> = [];
      parts.forEach(part => {
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

          {/* Answers Review Section */}
          {Object.keys(userAnswers).length > 0 && (
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
                {allQuestions.map((question) => {
                  const userAnswer = userAnswers[question.id];
                  const correctAnswer = correctAnswers[question.id];
                  
                  // Перевіряємо чи відповідь правильна (порівнюємо значення)
                  const isCorrect = userAnswer && correctAnswer && userAnswer === correctAnswer;
                  
                  const userAnswerLabel = answerLabels[userAnswer] || userAnswer || 'Не відповів';
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
