export interface MCQOption {
  optionText: string;
  isCorrect: boolean;
  scoreIfSelected: number;
}

export interface MCQQuestion {
  type: "MCQ";
  title: string;
  problemStatement: string;
  difficultyLevel: "Basic" | "Intermediate" | "Advanced";
  maxScore: number;
  negativeScore: number;
  timeBoundSeconds: number;
  tags: string[];
  options: MCQOption[];
  isDraft: boolean;
  allowMultipleAnswers: boolean;
  enablePartialScoring: boolean;
  aiEvaluationEnabled: boolean;
}
