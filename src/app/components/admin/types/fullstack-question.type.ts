export interface Framework {
    name: string;
    version: string;
    isCustom: boolean;
  }
  
  export interface ProjectSetup {
    type: 'zip' | 'github' | 'sample';
    url?: string;
    frontendFramework: Framework;
    backendFramework: Framework;
  }
  
  export interface FullStackQuestion {
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    title: string;
    problemStatement: string;
    maxScore: number;
    tags: string[];
    frontendFrameworks: Framework[];
    backendFrameworks: Framework[];
    projectSetup: ProjectSetup;
  }