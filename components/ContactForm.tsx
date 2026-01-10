'use client';

import { useState } from 'react';

interface ContactFormData {
  name: string;
  phone: string;
  telegram: string;
  instagram: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
  onFormChange?: (data: ContactFormData) => void;
}

export default function ContactForm({ onSubmit, onFormChange }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    telegram: '',
    instagram: ''
  });
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  // Функція для форматування телефону (маска)
  const formatPhoneNumber = (value: string): string => {
    // Видаляємо всі нецифрові символи
    const digits = value.replace(/\D/g, '');
    
    // Обмежуємо до 10 цифр (український номер)
    const limitedDigits = digits.slice(0, 10);
    
    // Форматуємо: 097 123 4567
    if (limitedDigits.length === 0) return '';
    if (limitedDigits.length <= 3) return limitedDigits;
    if (limitedDigits.length <= 6) {
      return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
    }
    return `${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    if (onFormChange) {
      onFormChange(newData);
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleChange('phone', formatted);
  };

  const handleNickChange = (field: 'telegram' | 'instagram', value: string) => {
    // Якщо поле пусте, просто додаємо @
    if (value === '') {
      handleChange(field, '');
      return;
    }
    
    // Видаляємо всі @ з початку
    let cleanValue = value.replace(/^@+/, '');
    
    // Додаємо один @ на початок
    const formattedValue = '@' + cleanValue;
    
    handleChange(field, formattedValue);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Обов\'язкове поле';
    }

    // Валідація телефону: перевіряємо, чи є 10 цифр
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Обов\'язкове поле';
    } else if (phoneDigits.length !== 10) {
      newErrors.phone = 'Введіть правильний номер телефону (10 цифр)';
    }

    // Валідація Telegram
    if (!formData.telegram.trim()) {
      newErrors.telegram = 'Обов\'язкове поле';
    } else if (!formData.telegram.startsWith('@')) {
      newErrors.telegram = 'Нік має починатися з @';
    } else if (formData.telegram.trim() === '@') {
      newErrors.telegram = 'Введіть нік після @';
    }

    // Валідація Instagram
    if (!formData.instagram.trim()) {
      newErrors.instagram = 'Обов\'язкове поле';
    } else if (!formData.instagram.startsWith('@')) {
      newErrors.instagram = 'Нік має починатися з @';
    } else if (formData.instagram.trim() === '@') {
      newErrors.instagram = 'Введіть нік після @';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Скролимо до початку тесту після відправки форми
      setTimeout(() => {
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <>
      <style jsx>{`
        .form-container {
          --card-width: 542px;
          width: 100%;
          max-width: var(--card-width);
          margin: 32px auto;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .form-card {
          background: #F1EEE9;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          box-sizing: border-box;
        }

        .form-title {
          font-family: 'Craftwork Grotesk', sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 120%;
          color: #0E4486;
          margin-bottom: 24px;
          text-align: left;
        }

        @media (max-width: 768px) {
          .form-container {
            --card-width: 100%;
            padding: 0 12px;
          }
          
          .form-card {
            padding: 24px;
            border-radius: 20px;
          }
          
          .form-title {
            font-size: 20px;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .form-container {
            padding: 0 8px;
          }
          
          .form-card {
            padding: 20px;
            border-radius: 18px;
          }
          
          .form-title {
            font-size: 18px;
            margin-bottom: 18px;
          }
        }
      `}</style>
      <div className="form-container">
        <div className="form-card">
          <h2 className="form-title">
            Ваші контактні дані:
          </h2>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              color: '#0E4486',
              marginBottom: '8px'
            }}>
              Ваше Ім'я та Прізвище<span style={{ color: '#F44336' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Анастасія Бойко"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `2px solid ${errors.name ? '#F44336' : '#0E4486'}`,
                background: '#F5F5F5',
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontSize: '16px',
                color: '#0E4486',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#167DAB';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.name ? '#F44336' : '#0E4486';
                e.currentTarget.style.background = '#F5F5F5';
              }}
            />
            {errors.name && (
              <div style={{
                color: '#F44336',
                fontSize: '14px',
                marginTop: '4px',
                fontFamily: 'Craftwork Grotesk, sans-serif'
              }}>
                {errors.name}
              </div>
            )}
          </div>

          {/* Phone Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              color: '#0E4486',
              marginBottom: '8px'
            }}>
              Номер телефону<span style={{ color: '#F44336' }}>*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="097 123 4567"
              maxLength={13}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `2px solid ${errors.phone ? '#F44336' : '#0E4486'}`,
                background: '#F5F5F5',
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontSize: '16px',
                color: '#0E4486',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#167DAB';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.phone ? '#F44336' : '#0E4486';
                e.currentTarget.style.background = '#F5F5F5';
              }}
            />
            {errors.phone && (
              <div style={{
                color: '#F44336',
                fontSize: '14px',
                marginTop: '4px',
                fontFamily: 'Craftwork Grotesk, sans-serif'
              }}>
                {errors.phone}
              </div>
            )}
          </div>

          {/* Telegram Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              color: '#0E4486',
              marginBottom: '8px'
            }}>
              Нік в телеграм через @<span style={{ color: '#F44336' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.telegram}
              onChange={(e) => handleNickChange('telegram', e.target.value)}
              placeholder="@your_nick"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `2px solid ${errors.telegram ? '#F44336' : '#0E4486'}`,
                background: '#F5F5F5',
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontSize: '16px',
                color: '#0E4486',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#167DAB';
                e.currentTarget.style.background = '#FFFFFF';
                // Якщо поле пусте при фокусі, додаємо @
                if (e.currentTarget.value === '') {
                  handleChange('telegram', '@');
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.telegram ? '#F44336' : '#0E4486';
                e.currentTarget.style.background = '#F5F5F5';
              }}
            />
            {errors.telegram && (
              <div style={{
                color: '#F44336',
                fontSize: '14px',
                marginTop: '4px',
                fontFamily: 'Craftwork Grotesk, sans-serif'
              }}>
                {errors.telegram}
              </div>
            )}
          </div>

          {/* Instagram Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontSize: '16px',
              fontWeight: 500,
              color: '#0E4486',
              marginBottom: '8px'
            }}>
              Нік в інстаграм<span style={{ color: '#F44336' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => handleNickChange('instagram', e.target.value)}
              placeholder="@your_nick"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: `2px solid ${errors.instagram ? '#F44336' : '#0E4486'}`,
                background: '#F5F5F5',
                fontFamily: 'Craftwork Grotesk, sans-serif',
                fontSize: '16px',
                color: '#0E4486',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#167DAB';
                e.currentTarget.style.background = '#FFFFFF';
                // Якщо поле пусте при фокусі, додаємо @
                if (e.currentTarget.value === '') {
                  handleChange('instagram', '@');
                }
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.instagram ? '#F44336' : '#0E4486';
                e.currentTarget.style.background = '#F5F5F5';
              }}
            />
            {errors.instagram && (
              <div style={{
                color: '#F44336',
                fontSize: '14px',
                marginTop: '4px',
                fontFamily: 'Craftwork Grotesk, sans-serif'
              }}>
                {errors.instagram}
              </div>
            )}
            <p style={{
              fontFamily: 'Craftwork Grotesk, sans-serif',
              fontSize: '14px',
              color: '#0E4486',
              marginTop: '8px',
              lineHeight: '140%'
            }}>
              <span style={{ color: '#F44336' }}>*</span>додатково просимо нік в Instagram на випадок, якщо через налаштування конфіденційності ми не знайдемо вас у Telegram
            </p>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
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
              transition: 'all 0.3s ease',
              marginTop: '8px'
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
        </form>
      </div>
    </div>
    </>
  );
}
