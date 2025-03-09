export interface TestSection {
  id: string;
  title: string;
  minRandomQuestions: number;
  questions: TestQuestion[];
}

export interface TestQuestion {
  difficulty: string;
  type: string;
  score: number;
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface AssessmentAdmin {
  firstName: string;
  lastName: string;
  email: string;
}

export interface AssessmentSettings {
  testDescription: string;
  testInstruction: string;
  enableAudioProctoring: boolean;
  enableSmartBrowser: boolean;
  idVerification: boolean;
  enableRandomQuestionShuffling: boolean;
  disableSubmissionResults: boolean;
  disableCopyPasteInCodeEditor: boolean;
  takeCandidateSnapshots: boolean;
  restrictFullScreenMode: boolean;
  logoutOnLeavingTest: boolean;
  restrictTestAccessForIP: boolean;
  emailReport: boolean;
  plagiarismReport: boolean;
  detailedAssessmentReport: boolean;
  slackReport: boolean;
  candidateSelfAssessmentReport: boolean;
  showQuestions: boolean;
  showCandidateAnswers: boolean;
  showCorrectAnswers: boolean;
  autoReminder: boolean;
  enableChatGPTInAssessments: boolean;
  audioProctoring: boolean;
  cutoffEnabled: boolean;
}

export interface TestPublishDetails {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: "Invite Only" | "Public";
  isAccessEnabled: boolean;
  testLink: string;
  practiceLink?: string;
  tags: string[];
  sections: TestSection[];
  settings: AssessmentSettings;
  admins: AssessmentAdmin[];
}
