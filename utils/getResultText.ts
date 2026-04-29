import type { PlacementOutcome } from '@/lib/placementQuizData';
import { PLACEMENT_TOTAL_QUESTIONS } from '@/lib/placementQuizData';

function summaryForOutcome(outcome: PlacementOutcome | string | undefined): string {
  const o = outcome || 'completed';
  if (o === 'completed') {
    return 'рекомендація: Level Up C1';
  }
  if (o === 'failed_step_1') {
    return 'рекомендація: майбутні програми A1-A2';
  }
  if (o === 'failed_step_2' || o === 'failed_step_3') {
    return 'рекомендація: Level Up B1';
  }
  if (o === 'failed_step_4' || o === 'failed_step_5') {
    return 'рекомендація: Level Up B2';
  }
  return 'результат placement';
}

/** Текст одним рядком у поле результату CRM */
export function getResultTextForCRM(
  score: number,
  outcome?: PlacementOutcome | string
): string {
  const max = PLACEMENT_TOTAL_QUESTIONS;
  const summary = summaryForOutcome(outcome);
  return `Placement Level Up (B1/B2/C1): ${score}/${max} — ${summary}`;
}
