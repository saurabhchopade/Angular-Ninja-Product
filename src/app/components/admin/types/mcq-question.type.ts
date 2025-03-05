export interface MCQOption {
    id: string;
    text: string;
    isCorrect: boolean;
  }
  
  export interface MCQQuestion {
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    question: string;
    options: MCQOption[];
    allowMultipleAnswers: boolean;
    enablePartialScoring: boolean;
    maxScore: number;
    negativeScore: number;
    tags: string[];
  }