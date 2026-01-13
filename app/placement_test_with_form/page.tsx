'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ContactForm from '@/components/ContactForm';
import QuizSection from '@/components/QuizSection';

interface ContactFormData {
  name: string;
  phone: string;
  telegram: string;
  instagram: string;
}

export default function PlacementTestWithFormPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    telegram: '',
    instagram: ''
  });

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
    <div style={{ background: '#A7DAB6', minHeight: '100vh', paddingBottom: '70px' }}>
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
