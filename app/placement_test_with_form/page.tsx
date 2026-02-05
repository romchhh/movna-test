'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroSection from '@/components/HeroSection';
import ContactForm from '@/components/ContactForm';
import QuizSection from '@/components/QuizSection';

interface ContactFormData {
  name: string;
  phone: string;
  telegram: string;
  instagram: string;
}

function PlacementTestWithFormContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    telegram: '',
    instagram: ''
  });

  // Зчитуємо UTM-мітки з URL та зберігаємо в sessionStorage
  useEffect(() => {
    const utmParams = {
      utm_source: searchParams.get('utm_source') || '',
      utm_medium: searchParams.get('utm_medium') || '',
      utm_campaign: searchParams.get('utm_campaign') || '',
      utm_content: searchParams.get('utm_content') || '',
      utm_term: searchParams.get('utm_term') || '',
    };

    if (Object.values(utmParams).some(val => val)) {
      sessionStorage.setItem('utm_params', JSON.stringify(utmParams));
    }
  }, [searchParams]);

  const handleFormSubmit = (data: ContactFormData) => {
    setFormData(data);
  };

  const handleFormChange = (data: ContactFormData) => {
    setFormData(data);
  };

  // Перевірка правильності форми
  const phoneDigits = formData.phone.replace(/\D/g, '');
  const isFormValid =
    formData.name.trim() !== '' &&
    formData.phone.trim() !== '' &&
    phoneDigits.length === 10 &&
    formData.telegram.trim() !== '' &&
    formData.telegram.startsWith('@') &&
    formData.telegram.trim() !== '@' &&
    formData.instagram.trim() !== '' &&
    formData.instagram.startsWith('@') &&
    formData.instagram.trim() !== '@';

  return (
    <div style={{ background: '#C7D2DF', minHeight: '100vh', paddingBottom: '70px' }}>
      <HeroSection />

      <div id="contact-form-section">
        <ContactForm onSubmit={handleFormSubmit} onFormChange={handleFormChange} />
      </div>

      <div id="quiz-section" style={{ marginTop: '32px' }}>
        <QuizSection isFormValid={isFormValid} formData={formData} />
      </div>
    </div>
  );
}

export default function PlacementTestWithFormPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#C7D2DF', minHeight: '100vh', paddingBottom: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <HeroSection />
      </div>
    }>
      <PlacementTestWithFormContent />
    </Suspense>
  );
}
