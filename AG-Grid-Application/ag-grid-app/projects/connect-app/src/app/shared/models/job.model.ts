export interface Job {
  syncGuid: string | null;
  syncName: string | null;
  assignedServerGuid: string | null;
  server: string | null;
  status: string | null;
  timeOfStateChange: Date | null;
  unifiedStatus: string | null;
  runType: string | null;
  contentVersion: string | null;
}

export interface JobListResponse {
  Job: Job[];
}
