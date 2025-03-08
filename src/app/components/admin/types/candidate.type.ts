export interface Candidate {
  email: string;
  firstName?: string;
  lastName?: string;
  tags: string[];
}

export interface CandidateInviteData {
  candidates: Candidate[];
  testId: number;
}
