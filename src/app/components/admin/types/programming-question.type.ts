export interface TestCase {
  inputData: string;
  expectedOutput: string;
  scoreWeight: number;
  isSample: boolean;
  timeLimitOverride: number;
  memoryLimitOverride: number;
  isPublic: boolean;
}

export interface CodeSnippet {
  languageId: string;
  snippet: string;
}

export interface ProgrammingQuestion {
  id: string | null;
  type: string;
  title: string;
  problemStatement: string;
  difficultyLevel: 'EASY' | 'MEDIUM' | 'HARD';
  maxScore: number;
  negativeScore: number;
  isDraft: boolean;
  timeLimit: number;
  memoryLimit: number;
  timeBoundSeconds: number;
  tags: string[];
  solutionTemplate: string;
  editorial: string;
  ai_evaluation_enabled: boolean;
  visibility: 'PUBLIC' | 'PRIVATE';
  templates: CodeSnippet[];
  testCases: TestCase[];
}