export interface ActivityChartDataPoint {
  date: string;
  count: number;
}

export interface ActivityChartData {
  data: ActivityChartDataPoint[];
  synchronizationName: string;
  synchronizationFrequency: number;
}

export interface DurationChartDataPoint {
  date: string;
  duration: number;
}

export interface DurationChartData {
  data: DurationChartDataPoint[];
  synchronizationFrequency: number;
}

export interface ProjectChangesChartData {
  project: string;
  sourceChanges: number;
  targetChanges: number;
}

export interface ProjectTypeChangesChartData {
  type: string;
  changes: number;
}

export interface ConnectActivityChartData {
  synchronizationName: string;
  synchronizationGuid: string;
  totalChanges: number;
  successfulChanges: number;
  failedChanges: number;
}

export interface MostActiveConnectionData {
  synchronizationName: string;
  synchronizationGuid: string;
  iterationCount: number;
}

export interface AuditActivityData {
  date: string;
  sourceAdded: number;
  sourceModified: number;
  sourceDeleted: number;
  targetAdded: number;
  targetModified: number;
  targetDeleted: number;
}
