export interface Server {
  serverGuid: string | null;
  status: string | null;
  heartBeat: string | null;
  startupStatus: string | null;
  host: string | null;
  port: number | null;
  maxNumJobs: number | null;
  numOfRunningJobs: number | null;
  contentVersion: string | null;
  uptime: string | null;
  processCpuUsage: number | null;
  systemCpuUsage: number | null;
  freeDiskSpace: number | null;
  appDataUsedDiskSpace: number | null;
  appDataFiles: number | null;
  usedMemory: number | null;
  freeMemory: number | null;
  totalMemory: number | null;
  maxMemory: number | null;
}

export interface ServerListResponse {
  Server: Server[];
}
