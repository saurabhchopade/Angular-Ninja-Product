export interface Framework {
  name: string;
  version: string;
  isCustom: boolean;
}

export interface ProjectSetup {
  type: "zip" | "github" | "sample";
  url?: string;
  frontendFramework: Framework;
  backendFramework: Framework;
}

export interface FullStackQuestion {
  difficulty: "Basic" | "Intermediate" | "Advanced";
  title: string;
  problemStatement: string;
  maxScore: number;
  tags: string[];
  frontendFrameworks: Framework[];
  backendFrameworks: Framework[];
  projectSetup: ProjectSetup;
}


export interface FullStackQuestionRequest {
  questionId?: number; // Optional, can be auto-generated by the backend
  type: string; // Fixed as "Coding"
  title: string;
  problemStatement: string;
  difficultyLevel: string; // Map from "difficulty"
  maxScore: number;
  tags: string[];
  visibility: string; // Fixed as "Public"
  aiEvaluationEnabled: boolean; // Fixed as true
  timeBoundSeconds: number; // Fixed as 300
  isDraft: boolean; // Fixed as false
}