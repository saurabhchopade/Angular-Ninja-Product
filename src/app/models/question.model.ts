export interface McqQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface CodingQuestion {
  id: number;
  question: string;
  sampleInput?: string;
  sampleOutput?: string;
  testCases?: { input: string; output: string }[];
}

export interface SubjectiveQuestion {
  id: number;
  question: string;
  maxWords?: number;
}
