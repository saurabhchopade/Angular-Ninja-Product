export interface Candidate {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?:string
  tags: string[];
}

export interface CandidateInviteData {
  candidates: Candidate[];
  testId: number;
}
