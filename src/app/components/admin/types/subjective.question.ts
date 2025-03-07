export interface SubjectiveQuestion {
    type: string;
    title: string;
    problemStatement: string;
    difficultyLevel: 'Basic' | 'Intermediate' | 'Advanced';
    maxScore: number;
    tags: string[];
    visibility: string;
    createdBy: string;
    aiEvaluationEnabled: boolean;
    evaluationMode: string;
    mustInclude: string[];
    optional: string[];
    negativeKeywords: string[];
    scoringWeights: {
      mustInclude: number;
      optional: number;
      negativeKeywords: number;
    };
    expectedResponseFormat: string;
    minWords: number;
    maxWords: number;
    sampleAnswer: string;
    evaluationCriteria:string
  }
  