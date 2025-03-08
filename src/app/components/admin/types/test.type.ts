export type TestType = {
  id: number;
  name: string;
  inviteType: "Invite Only" | "Public";
  duration: string;
  testDate: string;
  endDate?: string;
  invitedCount: number;
  completedCount: number;
  status: "Active" | "Completed" | "Archived";
};
