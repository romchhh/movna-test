'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface QuizOption {
  label: string;
  value: string;
}

interface Question {
  id: number;
  text: string;
  options: QuizOption[];
  description?: string;
}

interface QuizSection {
  title: string;
  description?: string;
  questions: Question[];
}

// Правильні відповіді
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

const quizSections: QuizSection[] = [
  {
    title: 'Your Vocabulary Range🚀',
    description: 'Complete the social media threads below with the correct words / phrases',
    questions: [
      {
        id: 1,
        text: "I forgot to buy vegetables for the curry. It totally slipped my _____. Things go in one _____ and out the other all the time!",
        options: [
          { label: 'mind, tongue', value: 'mind-tongue' },
          { label: 'mind, ear', value: 'mind-ear' },
          { label: 'tongue, ear', value: 'tongue-ear' },
          { label: 'tongue, mind', value: 'tongue-mind' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 2,
        text: "Make sure you ______ so everyone can hear you. To ______ clearly, use visuals like photos or pictures",
        options: [
          { label: 'speak up, get your message across', value: 'speak-up-message' },
          { label: 'point out, get your message across', value: 'point-out-message' },
          { label: 'speak up, come across', value: 'speak-up-come' },
          { label: 'point out, come across', value: 'point-out-come' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 3,
        text: "I'm a(n) ______, so I often have a ______ in the afternoon to try to catch up on sleep",
        options: [
          { label: 'insomniac, lie-in', value: 'insomniac-lie-in' },
          { label: 'insomniac, nap', value: 'insomniac-nap' },
          { label: 'heavy sleeper, nap', value: 'heavy-nap' },
          { label: 'heavy sleeper, lie-in', value: 'heavy-lie-in' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 4,
        text: "My first stand-up comedy didn't quite ______ my expectations. Actually, it was a complete disaster, but I was determined not to ______",
        options: [
          { label: 'come up with, mess up', value: 'come-up-mess' },
          { label: 'live up to, mess up', value: 'live-up-mess' },
          { label: 'come up with, end up', value: 'come-up-end' },
          { label: 'live up to, end up', value: 'live-up-end' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 5,
        text: "I suddenly realised how unhealthy my diet was — full of sugar and salt. So, I made the decision to ______ my diet more and ______ processed foods",
        options: [
          { label: 'expand, cut down on', value: 'expand-cut' },
          { label: 'expand, keep down', value: 'expand-keep' },
          { label: 'vary, cut down on', value: 'vary-cut' },
          { label: 'vary, keep down', value: 'vary-keep' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 6,
        description: 'Choose the correct chunks / idioms / phrasal verbs or their forms to complete the sentences below',
        text: "After months of constant overtime, the project became so ______ that I started to ______ during meetings without realising it",
        options: [
          { label: 'exhausted, drift apart', value: 'exhausted-drift' },
          { label: 'exhausted, zone out', value: 'exhausted-zone' },
          { label: 'mentally taxing, drift apart', value: 'taxing-drift' },
          { label: 'mentally taxing, zone out', value: 'taxing-zone' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 7,
        text: "After reviewing the finances, it became clear that the company was _____ this quarter. The management decided to ______ several outdated policies to cut costs",
        options: [
          { label: 'in the red, do away with', value: 'red-away' },
          { label: 'in the red, slip out', value: 'red-slip' },
          { label: 'drifting, do away with', value: 'drifting-away' },
          { label: 'drifting, slip out', value: 'drifting-slip' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 8,
        text: "Although those siblings used to be inseparable, they slowly began to ______, but the older sister promised she would always ______ him when things got tough",
        options: [
          { label: 'fall off, stand with', value: 'fall-stand' },
          { label: 'fall off, be there for', value: 'fall-there' },
          { label: 'grow apart, be there for', value: 'grow-there' },
          { label: 'grow apart, stand with', value: 'grow-stand' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 9,
        text: "Orest tried to keep the party a secret, but the information managed to slip _____ before the event. So, he decided to _____ the invitations",
        options: [
          { label: 'out, amend', value: 'out-amend' },
          { label: 'out, decline', value: 'out-decline' },
          { label: 'in, amend', value: 'in-amend' },
          { label: 'in, decline', value: 'in-decline' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 10,
        text: "Solomiia had to ______ her colleague's mistakes and fight ______ to defend her team during the negotiations",
        options: [
          { label: 'stand firm for, cats and dogs', value: 'firm-cats' },
          { label: 'stand firm for, tooth and nail', value: 'firm-tooth' },
          { label: 'make allowances for, cats and dogs', value: 'allowances-cats' },
          { label: 'make allowances for, tooth and nail', value: 'allowances-tooth' },
          { label: 'not sure', value: 'not-sure' }
        ]
      }
    ]
  },
  {
    title: 'Your Grammar Range & Accuracy📓',
    description: 'Decide if the sentences below are correct',
    questions: [
      {
        id: 11,
        text: "I do really want to take up the guitar",
        options: [
          { label: 'correct', value: 'correct' },
          { label: 'incorrect', value: 'incorrect' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 12,
        text: "Be bound to give me a call when you arrive at the hotel",
        options: [
          { label: 'correct', value: 'correct' },
          { label: 'incorrect', value: 'incorrect' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 13,
        description: 'Choose the correct option to fill in the gaps in the sentences below',
        text: "__________ (feed) the dog!",
        options: [
          { label: 'Remember feeding', value: 'feeding' },
          { label: 'Remember to feed', value: 'to-feed' },
          { label: 'Both', value: 'both' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 14,
        text: "What ____ most impressive in my childhood are the songs I recorded at home. It ____ my parents I had to thank for their understanding",
        options: [
          { label: 'is, are', value: 'is-are' },
          { label: 'was, were', value: 'was-were' },
          { label: 'is, is', value: 'is-is' },
          { label: 'was, was', value: 'was-was' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 15,
        text: "Orest was lucky. If his plane ________ crashed into the houses, some people ________ died",
        options: [
          { label: "wouldn't, had", value: 'wouldnt-had' },
          { label: 'would, had', value: 'would-had' },
          { label: "hadn't, would have", value: 'hadnt-would' },
          { label: 'had, would have', value: 'had-would' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 16,
        text: '**The word "whereas" in the sentence below can be replaced by…**\n<u>Whereas</u> Orest is very sociable and outgoing, I am quiet and shy',
        options: [
          { label: 'In spite', value: 'in-spite' },
          { label: 'Whilst', value: 'whilst' },
          { label: 'Through', value: 'through' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 17,
        text: "**Which one DOESN'T show that something is possible, but not certain?**",
        options: [
          { label: 'Machines could not replace human workers for many years', value: 'could-not' },
          { label: "Machines probably won't replace human workers for many years", value: 'probably-wont' },
          { label: 'Machines may not replace human workers for many years', value: 'may-not' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 18,
        text: "Choose the option that has the same meaning as the sentence below:\n**I had a plan to meet Taras, and it didn't change**",
        options: [
          { label: 'I had arranged to meet Taras after the show', value: 'arranged' },
          { label: 'I was planning to meet Taras after the show', value: 'planning' },
          { label: 'I was meant to meet Taras after the show', value: 'meant' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 19,
        text: "Choose the option that **CANNOT** be used to fill in the gap in the sentence below:\n**Pick me up at eight, ______?**",
        options: [
          { label: 'could you', value: 'could-you' },
          { label: "won't you", value: 'wont-you' },
          { label: "don't you", value: 'dont-you' },
          { label: 'will you', value: 'will-you' },
          { label: 'not sure', value: 'not-sure' }
        ]
      },
      {
        id: 20,
        text: "Choose the option that best describes the future action mentioned in the sentence below\n**Don't worry. <u>I'll have the report finished</u> before the meeting**",
        options: [
          { label: 'I will do the report', value: 'will-do' },
          { label: 'I will get the report done', value: 'will-get' },
          { label: 'Both', value: 'both' },
          { label: 'not sure', value: 'not-sure' }
        ]
      }
    ]
  }
];

interface ContactFormData {
  name: string;
  phone: string;
  telegram: string;
  instagram: string;
}

interface QuizSectionProps {
  isFormValid?: boolean;
  formData?: ContactFormData;
  leadId?: number; // ID ліда з CRM
}

export default function QuizSection({ isFormValid = true, formData, leadId }: QuizSectionProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [highlightedQuestion, setHighlightedQuestion] = useState<number | null>(null);
  const [showFormMessage, setShowFormMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const submittingRef = useRef(false);

  const handleAnswerChange = (questionId: number, value: string) => {
    // Якщо форма не заповнена, показуємо повідомлення та прокручуємо до форми
    if (isFormValid === false) {
      setShowFormMessage(true);
      setTimeout(() => {
        const formSection = document.getElementById('contact-form-section');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Підсвічуємо форму
          formSection.style.transition = 'all 0.3s ease';
          formSection.style.transform = 'scale(1.02)';
          setTimeout(() => {
            formSection.style.transform = 'scale(1)';
          }, 300);
        }
      }, 100);
      
      // Ховаємо повідомлення через 4 секунди
      setTimeout(() => {
        setShowFormMessage(false);
      }, 4000);
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    if (highlightedQuestion === questionId) {
      setHighlightedQuestion(null);
    }
    if (showFormMessage) {
      setShowFormMessage(false);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const qId = parseInt(questionId);
      if (correctAnswers[qId] === answer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const getAllQuestionIds = (): number[] => {
    const ids: number[] = [];
    quizSections.forEach(section => {
      section.questions.forEach(question => {
        ids.push(question.id);
      });
    });
    return ids;
  };

  const handleSubmit = () => {
    // Захист від дублів: один сабміт за раз (подвійний клік, Strict Mode тощо)
    if (submittingRef.current) return;
    const allQuestionIds = getAllQuestionIds();
    const answeredQuestionIds = Object.keys(answers).map(id => parseInt(id, 10));
    const firstUnansweredId = allQuestionIds.find(id => !answeredQuestionIds.includes(id));

    if (firstUnansweredId !== undefined) {
      setHighlightedQuestion(firstUnansweredId);
      setTimeout(() => {
        const questionElement = document.getElementById(`question-${firstUnansweredId}`);
        if (questionElement) {
          questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          questionElement.style.transition = 'all 0.3s ease';
        }
      }, 100);
      return;
    }

    const finalScore = calculateScore();
    submittingRef.current = true;
    setIsSaving(true);

    // Зберігаємо в sessionStorage одразу — сторінка результатів їх використає
    sessionStorage.setItem('quizScore', finalScore.toString());
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));

    // Відправка в таблицю та CRM асинхронно (fire-and-forget), щоб не блокувати перехід
    const payload = {
      formData: formData || undefined,
      answers,
      score: finalScore,
      leadId,
    };
    fetch('/api/sheets/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.success) console.error('Failed to save data:', result.error);
      })
      .catch((err) => console.error('Error saving data:', err));

    if (leadId) {
      fetch('/api/crm/complete-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lead_id: leadId, test_result: finalScore }),
      })
        .then((res) => res.json())
        .then((crmResult) => {
          if (!crmResult.success) console.error('Failed to update CRM:', crmResult.error);
        })
        .catch((err) => console.error('Error updating CRM:', err));
    }

    // Одразу перехід на результати — без очікування таблиць/CRM
    router.push(`/results?score=${finalScore}`);
  };

  const renderQuestionText = (text: string, isHighlighted: boolean) => {
    if (!text) return null;
    
    const color = isHighlighted ? '#F44336' : '#0E4486';
    
    // Замінюємо підкреслення для пропусків (gap) на HTML span перед обробкою маркдауном
    // Також обробляємо переноси рядків
    let processedText = text
      .replace(/\n\n/g, '<br /><br />') // Подвійні переноси
      .replace(/\n/g, '<br />') // Одиночні переноси
      .replace(/(_{2,})/g, (match) => {
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
          br: () => <br />,
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

  const renderQuestion = (question: Question, isFirstInSection: boolean = false) => {
    const isHighlighted = highlightedQuestion === question.id;
    
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
          transition: 'all 0.3s ease',
          animation: isHighlighted ? 'pulse 0.5s ease-in-out' : 'none',
          boxShadow: isHighlighted ? '0 4px 12px rgba(244, 67, 54, 0.2)' : 'none'
        }}
      >
        {question.description && (
          <div style={{
            fontFamily: 'Craftwork Grotesk, sans-serif',
            fontWeight: 500,
            fontSize: 'var(--desc-size)',
            lineHeight: '140%',
            color: isHighlighted ? '#F44336' : '#0E4486',
            marginBottom: 'var(--spacing-question)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <Image 
              src="/Vector.svg" 
              alt="" 
              width={24} 
              height={24}
              style={{ 
                marginTop: '2px',
                flexShrink: 0,
                width: 'var(--radio-size)',
                height: 'auto'
              }}
            />
            <span style={{ textDecoration: 'none' }}>{renderQuestionText(question.description, isHighlighted)}</span>
          </div>
        )}
        {question.text && (
          <p style={{
            fontFamily: 'Craftwork Grotesk, sans-serif',
            fontWeight: 400,
            fontSize: 'var(--question-size)',
            lineHeight: '150%',
            color: isHighlighted ? '#F44336' : '#0E4486',
            marginBottom: 'var(--spacing-question)'
          }}>
            <strong>{question.id}.</strong> {renderQuestionText(question.text, isHighlighted)}
          </p>
        )}
        {!question.text && !question.description && (
          <p style={{
            fontFamily: 'Craftwork Grotesk, sans-serif',
            fontWeight: 400,
            fontSize: 'var(--question-size)',
            lineHeight: '150%',
            color: isHighlighted ? '#F44336' : '#0E4486',
            marginBottom: 'var(--spacing-question)'
          }}>
            <strong>{question.id}.</strong>
          </p>
        )}
      
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-option)' }}>
          {question.options.map((option, idx) => (
            <label 
              key={idx} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontSize: 'var(--question-size)',
                color: isHighlighted ? '#D32F2F' : '#0E4486'
              }}
              onClick={() => handleAnswerChange(question.id, option.value)}
            >
              <div style={{
                width: 'var(--radio-size)',
                height: 'var(--radio-size)',
                borderRadius: '50%',
                border: `2px solid ${isHighlighted ? '#F44336' : '#0E4486'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: answers[question.id] === option.value ? (isHighlighted ? '#F44336' : '#0E4486') : 'transparent',
                transition: 'all 0.2s',
                flexShrink: 0
              }}>
                {answers[question.id] === option.value && (
                  <div style={{
                    width: 'var(--radio-inner)',
                    height: 'var(--radio-inner)',
                    borderRadius: '50%',
                    background: '#FFFFFF'
                  }} />
                )}
              </div>
              {option.label}
            </label>
          ))}
        </div>
      </div>
    );
  };

  const totalQuestions = getAllQuestionIds().length;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / totalQuestions) * 100;

  return (
    <>
      {/* Form Message Alert */}
      {showFormMessage && (
        <div style={{
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
          animation: 'slideDown 0.3s ease-out',
          maxWidth: '90%',
          textAlign: 'center'
        }}>
          Спочатку заповніть форму!
        </div>
      )}

      {/* Progress Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'rgba(14, 68, 134, 0.1)',
        zIndex: 1000,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #0E4486 0%, #167DAB 100%)',
          width: `${progressPercentage}%`,
          transition: 'width 0.3s ease',
          boxShadow: progressPercentage > 0 ? '0 0 10px rgba(14, 68, 134, 0.5)' : 'none'
        }} />
      </div>

      {/* Progress Counter */}
      <div style={{
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
        transition: 'all 0.3s ease'
      }}>
        {answeredQuestions} / {totalQuestions}
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
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
            --spacing-section: 20px;
            --spacing-question: 14px;
            --spacing-option: 9px;
            --button-size: 18px;
            --button-py: 18px;
            --button-px: 28px;
            padding: 0 12px;
          }
        }

        @media (max-width: 480px) {
          .quiz-wrapper {
            --border-radius: 18px;
            --header-py: 32px;
            --header-px: 20px;
            --content-padding: 20px;
            --content-pt: 28px;
            --title-size: 28px;
            --desc-size: 15px;
            --question-size: 14px;
            --radio-size: 20px;
            --radio-inner: 10px;
            --circle-size: 36px;
            --circle-offset: -25px;
            --spacing-section: 18px;
            --spacing-question: 12px;
            --spacing-option: 8px;
            --button-size: 17px;
            --button-py: 16px;
            --button-px: 24px;
            padding: 0 8px;
          }
        }

        @media (max-width: 375px) {
          .quiz-wrapper {
            --border-radius: 16px;
            --header-py: 28px;
            --header-px: 18px;
            --content-padding: 18px;
            --content-pt: 24px;
            --title-size: 24px;
            --desc-size: 14px;
            --question-size: 13px;
            --radio-size: 18px;
            --radio-inner: 9px;
            --circle-size: 32px;
            --circle-offset: -22px;
            --spacing-section: 16px;
            --spacing-question: 10px;
            --spacing-option: 7px;
            --button-size: 16px;
            --button-py: 14px;
            --button-px: 20px;
            padding: 0 8px;
          }
        }
      `}</style>
      
      <div className="quiz-wrapper">
        <div className="quiz-container">
          <div className="space-y-6">
          {quizSections.map((section, sectionIdx) => {
            const firstQuestionInSection = section.questions[0];
            const restQuestions = section.questions.slice(1);

            return (
              <div key={sectionIdx}>
                {/* Section with header */}
                <div className="relative shadow-xl" style={{
                  background: '#0E4486',
                  borderRadius: 'var(--border-radius)',
                  overflow: 'hidden'
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
                      margin: '0'
                    }}>
                      {section.title}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="relative" style={{
                    background: '#F1EEE9',
                    borderRadius: '0 0 var(--border-radius) var(--border-radius)',
                    padding: 'var(--content-padding)',
                    paddingTop: 'var(--content-pt)'
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
                          key={`circle-${sectionIdx}-${i}`}
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

                    {section.description && (
                      <div style={{
                        fontFamily: 'Craftwork Grotesk, sans-serif',
                        fontWeight: 500,
                        fontSize: 'var(--desc-size)',
                        lineHeight: '140%',
                        color: '#0E4486',
                        marginBottom: 'var(--spacing-section)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}>
                        <Image 
                          src="/Vector.svg" 
                          alt="" 
                          width={24} 
                          height={24}
                          style={{ 
                            marginTop: '2px',
                            flexShrink: 0,
                            width: 'var(--radio-size)',
                            height: 'auto'
                          }}
                        />
                        <span>{section.description}</span>
                      </div>
                    )}

                    {/* First question in section */}
                    {renderQuestion(firstQuestionInSection, true)}
                  </div>
                </div>

                {/* Rest of questions in section */}
                {restQuestions.map((question) => (
                  <div key={question.id} style={{
                    background: '#F1EEE9',
                    borderRadius: 'var(--border-radius)',
                    padding: 'var(--content-padding)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    marginTop: 'var(--spacing-section)'
                  }}>
                    {renderQuestion(question)}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Submit Button */}
          <div style={{ marginTop: 'calc(var(--spacing-section) + 8px)' }}>
            <button
              type="button"
              disabled={isSaving}
              style={{
                width: '100%',
                background: isSaving ? '#6B8BA4' : '#0E4486',
                color: '#FFFFFF',
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontWeight: 600,
                fontSize: 'var(--button-size)',
                padding: 'var(--button-py) var(--button-px)',
                borderRadius: 'var(--border-radius)',
                border: 'none',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                opacity: isSaving ? 0.9 : 1,
              }}
              onMouseEnter={(e) => {
                if (isSaving) return;
                e.currentTarget.style.background = '#0D3D76';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isSaving ? '#6B8BA4' : '#0E4486';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
              onClick={handleSubmit}
            >
              {isSaving ? 'Перехід до результатів…' : 'Дізнатися результат'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}