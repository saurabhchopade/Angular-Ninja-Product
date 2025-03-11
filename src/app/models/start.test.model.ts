// Define models for the API response
export interface InviteDto {
    inviteId: number;
    inviteStatus: string;
    inviteLink: string;
    clickCount: number;
    expiryAt: string;
  }
  
  export interface AssessmentDto {
    assessmentId: number;
    assessmentName: string;
    assessmentType: string;
    assessmentStatus: string;
    assessmentStartTime: string;
    assessmentEndTime: string;
    duration: string;
    assessmentAccess: boolean;
    difficultyLevel: string;
    jobRoleDto: any;
    testLink: string;
    practiceLink: string;
    aiPoweredQuestion: boolean;
    assessmentSectionDto: any;
    assessmentSettingDto: any;
    assessmentAdminDto: any;
  }
  
  export interface CandidateDto {
    candidateId: number;
    candidateEmail: string;
    candidateFullName: string;
    candidatePhone: string;
    candidateStatus: string;
  }
  
  export interface AssessmentSection {
    sectionId: number;
    name: string;
    description: string;
    sequenceNo: number;
    minRandomQuestions: number;
    questionIds: any;
  }
  
  export interface CandidateAssessmentSessionDto {
    candidateAssessmentSessionId: number;
    finalRank: any;
    attemptNumber: number;
    status: string;
    startTime: string;
    endTime: string;
    totalScore: number;
    lastActiveAt: string;
  }
  
  export interface StartAssessmentResponse {
    code: number;
    status: string;
    message: string;
    data: {
      inviteDto: InviteDto;
      assessmentDto: AssessmentDto;
      candidateDto: CandidateDto;
      assessmentSectionList: AssessmentSection[];
      candidateAssessmentSessionDto: CandidateAssessmentSessionDto;
    };
    timestamp: string;
  }