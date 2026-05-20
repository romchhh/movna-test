import type { PlacementOutcome } from '@/lib/placementQuizData';
import {
  PLACEMENT_TOTAL_QUESTIONS,
  crmSummaryFromPlacement,
} from '@/lib/placementQuizData';

/** Текст одним рядком у поле результату CRM */
export function getResultTextForCRM(
  score: number,
  outcome?: PlacementOutcome | string
): string {
  const max = PLACEMENT_TOTAL_QUESTIONS;
  const summary = crmSummaryFromPlacement(score, outcome);
  return `Placement Level Up (B1/B2/C1): ${score}/${max} — ${summary}`;
}
