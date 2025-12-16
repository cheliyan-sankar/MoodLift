export type MoodAssessment = {
  id: string;
  user_session: string;
  responses: { question: string; answer: string }[];
  mood_result: string | null;
  mood_score: number | null;
  recommendations: string[] | null;
  created_at: string;
};
