export type QuestionType = {
    id: number;
    title: string;
    description: string;
    difficulty: 'Basic' | 'Intermediate' | 'Advanced';
    score: number;
    technologies: string[];
    categories: string[];
  };