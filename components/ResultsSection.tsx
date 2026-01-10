'use client';

import Image from 'next/image';

interface ResultsSectionProps {
  score: number;
  totalQuestions: number;
}

export default function ResultsSection({ score, totalQuestions }: ResultsSectionProps) {
  const getResultCategory = (score: number) => {
    if (score >= 0 && score <= 3) {
      return {
        range: '0-3 бали',
        text: '— якщо ви зрозуміли суть завдань, (хоча і не знали правильної відповіді), вам буде комфортно на курсі B2.1: весь цей матеріал ми опануємо разом'
      };
    } else if (score >= 4 && score <= 8) {
      return {
        range: '4-8 балів',
        text: '— ви вже маєте потрібну базу і курс Level Up В2.1 стане дуже потужним бустом для вашої англійської. Найбільше для себе ви візьмете на тарифі з груповими/індивідуальними заняттями'
      };
    } else if (score >= 9 && score <= 12) {
      return {
        range: '9-12 балів',
        text: '— ви вже маєте непоганий В2. Вам добре підійде курс B2.2, зокрема тариф зі зворотним зв\'язком від ментора (щоб ставити уточнювальні запитання) або з груповими чи індивідуальними заняттями'
      };
    } else if (score >= 13 && score <= 17) {
      return {
        range: '13-17 балів',
        text: '— у вас вже хороший В2! Можливо, має сенс розглянути рівень B2, але самостійний тариф з матеріалами, щоб допрацювати невеликі прогалини самостійно. Або ж, пірнати у вивчення англи на рівні С1'
      };
    } else {
      return {
        range: '18-20 балів',
        text: '— у вас дуже класний В2! Настав час опанувати англійську на рівні С1, щоб завдяки підтримці ментора вільно висловлювати свої думки, володіючи тонкощами високого рівня'
      };
    }
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

  const allResults = [
    {
      range: '0-3 бали',
      text: '— якщо ви зрозуміли суть завдань, (хоча і не знали правильної відповіді), вам буде комфортно на курсі B2.1: весь цей матеріал ми опануємо разом'
    },
    {
      range: '4-8 балів',
      text: '— ви вже маєте потрібну базу і курс Level Up В2.1 стане дуже потужним бустом для вашої англійської. Найбільше для себе ви візьмете на тарифі з груповими/індивідуальними заняттями'
    },
    {
      range: '9-12 балів',
      text: '— ви вже маєте непоганий В2. Вам добре підійде курс B2.2, зокрема тариф зі зворотним зв\'язком від ментора (щоб ставити уточнювальні запитання) або з груповими чи індивідуальними заняттями'
    },
    {
      range: '13-17 балів',
      text: '— у вас вже хороший В2! Можливо, має сенс розглянути рівень B2, але самостійний тариф з матеріалами, щоб допрацювати невеликі прогалини самостійно. Або ж, пірнати у вивчення англи на рівні С1'
    },
    {
      range: '18-20 балів',
      text: '— у вас дуже класний В2! Настав час опанувати англійську на рівні С1, щоб завдяки підтримці ментора вільно висловлювати свої думки, володіючи тонкощами високого рівня'
    }
  ];

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
          --text-size: 16px;
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
            --text-size: 15px;
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
            --text-size: 14px;
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
            --text-size: 13px;
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
                margin: '0'
              }}>
                Ваш результат: {score}
              </p>
            </div>

            {/* Content with emoji */}
            <div className="relative" style={{
              background: '#F1EEE9',
              borderRadius: '0 0 var(--border-radius) var(--border-radius)',
              padding: 'var(--content-padding)',
              paddingTop: 'var(--content-pt)',
              paddingBottom: 'var(--content-pt)'
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
                marginBottom: 'calc(var(--spacing-section) + 8px)',
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

          {/* Results Categories */}
          {allResults.map((result, idx) => (
            <div 
              key={idx} 
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
                    {result.range}
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
                    {renderFormattedText(result.text)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
