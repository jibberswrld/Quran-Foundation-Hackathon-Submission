import type { GoalType } from "./types";

export const GOAL_DESCRIPTIONS: Record<
  GoalType,
  { label: string; unit: string; min: number; max: number; defaultVal: number }
> = {
  finish_in_days: {
    label: "Finish the Quran in",
    unit: "days",
    min: 30,
    max: 3650,
    defaultVal: 365,
  },
  memorize_per_week: {
    label: "Memorise",
    unit: "ayahs per week",
    min: 1,
    max: 100,
    defaultVal: 5,
  },
};
