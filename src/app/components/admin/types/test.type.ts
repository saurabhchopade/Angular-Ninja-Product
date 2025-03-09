export type TestType = {
  assessmentId: number;
  assessmentName: string;
  assessmentType: string;
  assessmentStatus: "Active" | "Completed" | "Archived";
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
};