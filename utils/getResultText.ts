// Функція для отримання текстового результату тесту для CRM
export function getResultTextForCRM(score: number): string {
  let range: string;
  let level: string;
  
  if (score >= 0 && score <= 3) {
    range = '0-3 бали';
    level = 'B2.1 (початковий рівень)';
  } else if (score >= 4 && score <= 8) {
    range = '4-8 балів';
    level = 'B2.1 (середній рівень)';
  } else if (score >= 9 && score <= 12) {
    range = '9-12 балів';
    level = 'B2.2';
  } else if (score >= 13 && score <= 17) {
    range = '13-17 балів';
    level = 'B2 (просунутий) / C1 (початковий)';
  } else {
    range = '18-20 балів';
    level = 'C1';
  }
  
  return `Результат тестування: ${score} - ${range} — ${level}`;
}
