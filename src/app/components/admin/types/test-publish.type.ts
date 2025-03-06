export interface TestSection {
    id: string;
    title: string;
    minRandomQuestions: number;
    questions: TestQuestion[];
  }
  
  export interface TestQuestion {
    id: string;
    title: string;
    description: string;
    tags: string[];
  }
  
  export interface TestPublishDetails {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    type: 'Invite Only' | 'Public';
    isAccessEnabled: boolean;
    testLink: string;
    practiceLink?: string;
    tags: string[];
    sections: TestSection[];
    settings: {
      audioProctoring: boolean;
      cutoffEnabled: boolean;
    };
  }