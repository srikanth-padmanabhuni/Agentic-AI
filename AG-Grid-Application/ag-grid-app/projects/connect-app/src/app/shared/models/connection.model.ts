export interface Connection {
  connectId: string | null;
  contextType: string | null;
  lastSaved: Date | null;
  direction: string | null;
  emailFrequency: number | null;
  name: string | null;
  description: string | null;
  smtpToAddressList: string | null;
  source: string | null;
  sourceDataSourceGuid: string | null;
  target: string | null;
  targetDataSourceGuid: string | null;
  enabled: boolean | null;
  jobEnabled: boolean | null;
  repeat: number | null;
  defaultFrequency: number | null;
  lastSuccessfulSync: number;
  lastSync: number;
  lastSyncDuration: string;
  lastSyncSpan: string;
  lastSyncChanges: number;
  iterationsPerDay: number;
  lastSyncError: string;
  server: string | null;
  jobRules: string | null;
  status: string | null;
  jobStatus: string | null;
  unifiedStatus: string | null;
  logicalGroupGuid: string | null;
  projectMaps: unknown[] | null;
  typeMaps: unknown[] | null;
  syncRules: unknown[] | null;
  itemFilters: unknown[] | null;
  xmlFallbackUsers: unknown[] | null;
  jobAllocationRules: unknown[] | null;
  nextExecutionTime: Date | null;
  cacheable: boolean;
}

export interface ConnectionListResponse {
  Synchronization: Connection[];
}
