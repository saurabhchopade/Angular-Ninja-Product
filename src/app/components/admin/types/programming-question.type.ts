export interface TestCase {
    input: string;
    output: string;
    score: number;
    isVisible: boolean;
    explanation?: string;
  }
  
  export interface CodeSnippet {
    language: string;
    code: string;
  }
  
  export interface ProgrammingQuestion {
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    title: string;
    problemStatement: string;
    maxScore: number;
    tags: string[];
    sampleInput: string;
    sampleOutput: string;
    sampleExplanation: string;
    testCases: TestCase[];
    allowedLanguages: string[];
    codeSnippets: CodeSnippet[];
    editorial: string;
  }