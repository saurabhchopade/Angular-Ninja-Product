export interface QuestionRequest {
    assessmentId: number;
    candidateId: number;
    sectionId: number;
  }
  
  export interface Question {
    questionId: number;
    type: string;
    title: string;
    problemStatement: string;
    difficultyLevel: string;
    maxScore: number;
    tags: string[] | null;
    visibility: string;
    aiEvaluationEnabled: boolean;
    timeBoundSeconds: number;
    isDraft: boolean;
  }
  
  export interface QuestionResponse {
    code: number;
    status: string;
    message: string;
    data: Question[];
    timestamp: string;
  }