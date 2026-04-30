/** Placement test: 6 steps × 5 questions. Pass step = ≥3 correct on that step. */

export const PLACEMENT_TOTAL_QUESTIONS = 30;
export const PLACEMENT_PASS_PER_STEP = 3;
export const PLACEMENT_STEP_COUNT = 6;

export type QuizOption = { label: string; value: string };

export type Question = {
  id: number;
  text: string;
  options: QuizOption[];
  description?: string;
};

export type QuizStep = {
  stepNumber: number;
  title: string;
  sectionDescription: string;
  questions: Question[];
};

/** Outcome for CRM / results page */
export type PlacementOutcome =
  | 'completed'
  | 'failed_step_1'
  | 'failed_step_2'
  | 'failed_step_3'
  | 'failed_step_4'
  | 'failed_step_5';

export const correctAnswers: Record<number, string> = {
  1: 'could-swim',
  2: 'mustnt',
  3: 'better',
  4: 'will-arrive',
  5: 'has-visited-was',
  6: 'flu-fever',
  7: 'stay-share',
  8: 'dress-handbag',
  9: 'shape-unfit',
  10: 'early-shower',
  11: 'correct',
  12: 'incorrect',
  13: 'to-feed',
  14: 'was-was',
  15: 'had-would-have',
  16: 'mind-ear',
  17: 'speak-up-message',
  18: 'insomniac-nap',
  19: 'live-up-mess',
  20: 'vary-cut',
  21: 'whilst',
  22: 'could-not',
  23: 'arranged',
  24: 'dont-you',
  25: 'both',
  26: 'taxing-zone',
  27: 'red-away',
  28: 'grow-there',
  29: 'out-amend',
  30: 'allowances-tooth',
};

export const placementSteps: QuizStep[] = [
  {
    stepNumber: 1,
    title: 'Step 1 — Your Grammar Range & Accuracy📓',
    sectionDescription:
      'Оберіть правильний варіант, аби заповнити пропуски в наведених нижче реченнях',
    questions: [
      {
        id: 1,
        text: 'I ______ when I was 5',
        options: [
          { label: 'can swim', value: 'can-swim' },
          { label: 'can swam', value: 'can-swam' },
          { label: 'could swim', value: 'could-swim' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 2,
        text: 'Orest, you ______ smoke here!',
        options: [
          { label: "haven't to", value: 'havent-to' },
          { label: "mustn't", value: 'mustnt' },
          { label: 'should not to', value: 'should-not-to' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 3,
        text: 'This restaurant is ______ than the café nearby',
        options: [
          { label: 'good', value: 'good' },
          { label: 'better', value: 'better' },
          { label: 'the best', value: 'the-best' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 4,
        text: 'Colleagues ______ late because of traffic',
        options: [
          { label: 'are arrive', value: 'are-arrive' },
          { label: 'will arrive', value: 'will-arrive' },
          { label: 'would arrive', value: 'would-arrive' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 5,
        text: 'Solomiia ______ Warsaw three times. The first time ______ in 2018.',
        options: [
          { label: 'visited, was', value: 'visited-was' },
          { label: 'visited, has been', value: 'visited-has-been' },
          { label: 'has visited, was', value: 'has-visited-was' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
    ],
  },
  {
    stepNumber: 2,
    title: 'Step 2 — Your Vocabulary Range🚀',
    sectionDescription:
      'Доповніть наведені нижче речення природними для англійської словами / фразами',
    questions: [
      {
        id: 6,
        text: 'Asia stayed home because she caught the _____ and had a high _____.',
        options: [
          { label: 'flu, fever', value: 'flu-fever' },
          { label: 'cold, cough', value: 'cold-cough' },
          { label: 'fever, pain', value: 'fever-pain' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 7,
        text: 'Bohdan decided to _____ after the party. I have two bedrooms, but my roommate was at home. So, we had to _____',
        options: [
          { label: 'stay, go home', value: 'stay-go' },
          { label: 'take a taxi, stay late', value: 'taxi-late' },
          { label: 'stay over, share a room', value: 'stay-share' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 8,
        text: 'Zlata likes to _____ for parties and carries a small _____ with her things inside',
        options: [
          { label: 'be beautiful, suitcase', value: 'beautiful-suitcase' },
          { label: 'dress up, handbag', value: 'dress-handbag' },
          { label: 'wear off, wallet', value: 'wear-wallet' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 9,
        text: 'Taras wants to _____ because he feels _____ after not exercising for a long time',
        options: [
          { label: 'get in shape, unfit', value: 'shape-unfit' },
          { label: 'lose weight, tired', value: 'lose-tired' },
          { label: 'get stronger, busy', value: 'stronger-busy' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 10,
        text: 'My sister is a(n) _____ because she wakes up at 7AM and likes to _____ before breakfast',
        options: [
          { label: 'quiet person, drink coffee', value: 'quiet-coffee' },
          { label: 'night owl, watch TV', value: 'owl-tv' },
          { label: 'early bird, take a shower', value: 'early-shower' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
    ],
  },
  {
    stepNumber: 3,
    title: 'Step 3 — Your Grammar Range & Accuracy📓',
    sectionDescription: 'Decide if the sentences below are correct',
    questions: [
      {
        id: 11,
        text: 'I do really want to take up the guitar',
        options: [
          { label: 'correct', value: 'correct' },
          { label: 'incorrect', value: 'incorrect' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 12,
        text: 'Be bound to give me a call when you arrive at the hotel',
        options: [
          { label: 'correct', value: 'correct' },
          { label: 'incorrect', value: 'incorrect' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 13,
        description: 'Choose the correct option to fill in the gaps in the sentences below',
        text: '__________ (feed) the dog!',
        options: [
          { label: 'Remember feeding', value: 'feeding' },
          { label: 'Remember to feed', value: 'to-feed' },
          { label: 'Both', value: 'both-feed' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 14,
        text: 'What ____ most impressive in my childhood are the songs I recorded at home. It ____ my parents I had to thank for their understanding',
        options: [
          { label: 'is, are', value: 'is-are' },
          { label: 'was, were', value: 'was-were' },
          { label: 'is, is', value: 'is-is' },
          { label: 'was, was', value: 'was-was' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 15,
        text: 'Orest was lucky. If his plane ________ crashed into the houses, some people ________ died',
        options: [
          { label: "wouldn't, had", value: 'wouldnt-had' },
          { label: 'would, had', value: 'would-had' },
          { label: "hadn't, would have", value: 'hadnt-would-have' },
          { label: 'had, would have', value: 'had-would-have' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
    ],
  },
  {
    stepNumber: 4,
    title: 'Step 4 — Your Vocabulary Range🚀',
    sectionDescription: 'Complete the social media threads below with the correct words / phrases',
    questions: [
      {
        id: 16,
        text: 'I forgot to buy vegetables for the curry. It totally slipped my _____. Things go in one _____ and out the other all the time!',
        options: [
          { label: 'mind, tongue', value: 'mind-tongue' },
          { label: 'mind, ear', value: 'mind-ear' },
          { label: 'tongue, ear', value: 'tongue-ear' },
          { label: 'tongue, mind', value: 'tongue-mind' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 17,
        text: 'Make sure you ______ so everyone can hear you. To ______ clearly, use visuals like photos or pictures',
        options: [
          { label: 'speak up, get your message across', value: 'speak-up-message' },
          { label: 'point out, get your message across', value: 'point-out-message' },
          { label: 'speak up, come across', value: 'speak-up-come' },
          { label: 'point out, come across', value: 'point-out-come' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 18,
        text: "I'm a(n) ______, so I often have a ______ in the afternoon to try to catch up on sleep",
        options: [
          { label: 'insomniac, lie-in', value: 'insomniac-lie-in' },
          { label: 'insomniac, nap', value: 'insomniac-nap' },
          { label: 'heavy sleeper, nap', value: 'heavy-nap' },
          { label: 'heavy sleeper, lie-in', value: 'heavy-lie-in' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 19,
        text: "My first stand-up comedy didn't quite ______ my expectations. Actually, it was a complete disaster, but I was determined not to ______",
        options: [
          { label: 'come up with, mess up', value: 'come-up-mess' },
          { label: 'live up to, mess up', value: 'live-up-mess' },
          { label: 'come up with, end up', value: 'come-up-end' },
          { label: 'live up to, end up', value: 'live-up-end' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 20,
        text: 'I suddenly realised how unhealthy my diet was — full of sugar and salt. So, I made the decision to ______ my diet more and ______ processed foods',
        options: [
          { label: 'expand, cut down on', value: 'expand-cut' },
          { label: 'expand, keep down', value: 'expand-keep' },
          { label: 'vary, cut down on', value: 'vary-cut' },
          { label: 'vary, keep down', value: 'vary-keep' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
    ],
  },
  {
    stepNumber: 5,
    title: 'Step 5 — Your Grammar Range & Accuracy📓',
    sectionDescription: '',
    questions: [
      {
        id: 21,
        text: 'The word “whereas” in the sentence below can be replaced by…\n**Whereas** Orest is very sociable and outgoing, I am quiet and shy',
        options: [
          { label: 'In spite', value: 'in-spite' },
          { label: 'Whilst', value: 'whilst' },
          { label: 'Through', value: 'through' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 22,
        text: "Which one DOESN'T show that something is possible, but not certain?",
        options: [
          {
            label: 'Machines could not replace human workers for many years',
            value: 'could-not',
          },
          {
            label: "Machines probably won't replace human workers for many years",
            value: 'probably-wont',
          },
          {
            label: 'Machines may not replace human workers for many years',
            value: 'may-not',
          },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 23,
        text: "Choose the option that has the same meaning as the sentence below:\n**I had a plan to meet Taras, and it didn't change**",
        options: [
          {
            label: 'I had arranged to meet Taras after the show',
            value: 'arranged',
          },
          {
            label: 'I was planning to meet Taras after the show',
            value: 'planning',
          },
          {
            label: 'I was meant to meet Taras after the show',
            value: 'meant',
          },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 24,
        text: "Choose the option that **CANNOT** be used to fill in the gap in the sentence below:\n**Pick me up at eight, ______?**",
        options: [
          { label: 'could you', value: 'could-you' },
          { label: "won't you", value: 'wont-you' },
          { label: "don't you", value: 'dont-you' },
          { label: 'will you', value: 'will-you' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 25,
        text: "Choose the option that best describes the future action mentioned in the sentence below\n**Don't worry. I'll have the report finished before the meeting**",
        options: [
          { label: 'I will do the report', value: 'will-do' },
          { label: 'I will get the report done', value: 'will-get' },
          { label: 'Both', value: 'both' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
    ],
  },
  {
    stepNumber: 6,
    title: 'Step 6 — Your Vocabulary Range🚀',
    sectionDescription:
      'Choose the correct chunks / idioms / phrasal verbs or their forms to complete the sentences below',
    questions: [
      {
        id: 26,
        text: 'After months of constant overtime, the project became so ______ that I started to ______ during meetings without realising it',
        options: [
          { label: 'exhausted, drift apart', value: 'exhausted-drift' },
          { label: 'exhausted, zone out', value: 'exhausted-zone' },
          { label: 'mentally taxing, drift apart', value: 'taxing-drift' },
          { label: 'mentally taxing, zone out', value: 'taxing-zone' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 27,
        text: 'After reviewing the finances, it became clear that the company was _____ this quarter. The management decided to ______ several outdated policies to cut costs',
        options: [
          { label: 'in the red, do away with', value: 'red-away' },
          { label: 'in the red, slip out', value: 'red-slip' },
          { label: 'drifting, do away with', value: 'drifting-away' },
          { label: 'drifting, slip out', value: 'drifting-slip' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 28,
        text: 'Although those siblings used to be inseparable, they slowly began to ______, but the older sister promised she would always ______ him when things got tough',
        options: [
          { label: 'fall off, back up', value: 'fall-backup' },
          { label: 'fall off, be there for', value: 'fall-there' },
          { label: 'grow apart, be there for', value: 'grow-there' },
          { label: 'grow apart, back up', value: 'grow-backup' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 29,
        text: 'Orest tried to keep the party a secret, but the information managed to slip _____ before the event. So, he decided to _____ the invitations',
        options: [
          { label: 'out, amend', value: 'out-amend' },
          { label: 'out, decline', value: 'out-decline' },
          { label: 'in, amend', value: 'in-amend' },
          { label: 'in, decline', value: 'in-decline' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
      {
        id: 30,
        text: "Solomiia had to ______ her colleague's mistakes and fight ______ to defend her team during the negotiations",
        options: [
          { label: 'stand firm for, cats and dogs', value: 'firm-cats' },
          { label: 'stand firm for, tooth and nail', value: 'firm-tooth' },
          { label: 'make allowances for, cats and dogs', value: 'allowances-cats' },
          { label: 'make allowances for, tooth and nail', value: 'allowances-tooth' },
          { label: 'not sure', value: 'not-sure' },
        ],
      },
    ],
  },
];

/** Early-exit copy after failing a step (1–2 correct on that step) */
export const failMessages: Record<
  1 | 2 | 3 | 4 | 5,
  { title: string; body: string }
> = {
  1: {
    title: 'Ваш результат',
    body: 'Наразі програми Level Up B1, B2 та C1 можуть бути для вас дещо заскладними. Проте це чудова можливість закласти міцну базу та впевнено підготуватися до подальшого навчання. Ми будемо раді бачити вас на наших майбутніх програмах для початкових рівнів A1-A2, де ви зможете комфортно розвивати мовні навички у власному темпі та поступово перейти до вищих рівнів 🧡',
  },
  2: {
    title: 'Ваш результат',
    body: 'Ви добре зрозуміли суть завдань, навіть якщо не всі відповіді були правильними. Це свідчить про наявність міцної бази та потенціалу для подальшого розвитку. Вам буде комфортно навчатися на курсі рівня B1, адже саме там ми детально опрацюємо цей матеріал, систематизуємо знання та пригадаємо ключові теми рівня A2 🧡',
  },
  3: {
    title: 'Ваш результат',
    body: 'Ви добре зрозуміли суть завдань, навіть якщо не всі відповіді були правильними. Це свідчить про наявність міцної бази та потенціалу для подальшого розвитку. Вам буде комфортно навчатися на курсі рівня B1, адже саме там ми детально опрацюємо цей матеріал, систематизуємо знання та пригадаємо ключові теми рівня A2 🧡',
  },
  4: {
    title: 'Ваш результат',
    body: 'Ви вже маєте необхідну мовну базу, щоб впевнено навчатися на цьому рівні B2. Курс Level Up стане для вас потужним кроком уперед: допоможе розширити словниковий запас, покращити граматику та розвинути впевненість у спілкуванні англійською. Це чудова можливість систематизувати знання та вивести свою англійську на новий рівень 🧡',
  },
  5: {
    title: 'Ваш результат',
    body: 'Ви вже маєте необхідну мовну базу, щоб впевнено навчатися на цьому рівні B2. Курс Level Up стане для вас потужним кроком уперед: допоможе розширити словниковий запас, покращити граматику та розвинути впевненість у спілкуванні англійською. Це чудова можливість систематизувати знання та вивести свою англійську на новий рівень 🧡',
  },
};

export const completedMessage = {
  title: 'Ваш результат',
  body: 'У вас дуже впевнений рівень B2 — ви добре орієнтуєтеся в граматиці, розумієте складні конструкції та орієнтуєтеся в лексиці в різних ситуаціях. Саме час зробити наступний крок і перейти на рівень C1 разом з нами на Level Up. Це допоможе вам вдосконалити мовну точність, збагатити словниковий запас і досягти ще більшої впевненості у спілкуванні англійською 🧡',
};

export function outcomeForFailedStep(stepNumber: 1 | 2 | 3 | 4 | 5): PlacementOutcome {
  return `failed_step_${stepNumber}` as PlacementOutcome;
}

export function allQuestionIds(): number[] {
  const ids: number[] = [];
  placementSteps.forEach((s) => s.questions.forEach((q) => ids.push(q.id)));
  return ids;
}
