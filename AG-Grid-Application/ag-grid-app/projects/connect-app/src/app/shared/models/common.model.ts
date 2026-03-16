export interface AccessToken {
  id: string;
  name: string;
  role: string;
  expirationDate: string;
  status: string;
}

export interface AccessTokenListResponse {
  AccessToken: AccessToken[];
}

export interface EmailSettings {
  syncGuid: string;
  syncName: string;
}

export interface EmailSettingsConnection {
  syncGuid: string;
  syncName: string;
  smtpToAddressList: string;
  emailFrequency: number;
}

export interface SyncRule {
  connectId: string | null;
  source: string | null;
  sourceLabel: string | null;
  target: string | null;
  targetLabel: string | null;
  typeMap: unknown | null;
}

export interface UserMap {
  name: string | null;
}

export interface UserMapTreeNode {
  id: string;
  text: string;
  leaf: boolean;
  children?: UserMapTreeNode[];
}

export interface ServerMetrics {
  id: number;
  timestamp: number | null;
  serverGuid: string | null;
  diskUsage: string | null;
  ramUsage: string | null;
  jvmUsage: string | null;
  appDataDiskUsage: number | null;
  processCpuUsage: string | null;
  systemCpuUsage: string | null;
  cpuCores: string | null;
}

export interface CrossReference {
  connectId: string | null;
  sourceId: string | null;
  targetId: string | null;
  sourceDataSource: string | null;
  targetDataSource: string | null;
  synchronization: string | null;
}

export interface LogicalGroup {
  connectId: string | null;
  name: string | null;
  type: string | null;
  parentGuid: string | null;
  position: number | null;
}

export interface ProjectMap {
  connectId: string | null;
  sourceProject: string | null;
  targetProject: string | null;
  sourceProjectLabel: string | null;
  targetProjectLabel: string | null;
}

export interface SyncSetWaterMark {
  connectId: string | null;
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface ValueMap {
  connectId: string | null;
  source: string | null;
  target: string | null;
  sourceLabel: string | null;
  targetLabel: string | null;
}

export interface Filter {
  connectId: string | null;
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface FeatureFlagItem {
  name: string;
  enabled: boolean;
}

export interface GlobalProperty {
  name: string;
  value: string;
}

export interface ImportExportElement {
  name: string;
  type: string;
  selected: boolean;
}

export interface SupportedProduct {
  connectId: string | null;
  product: string;
  productDisplayName: string;
}

export interface ActivityAuditTreeNode {
  id: string;
  text: string;
  leaf: boolean;
  expanded?: boolean;
  children?: ActivityAuditTreeNode[];
}

export interface IterationMessage {
  connectId: string | null;
  message: string | null;
  severity: string | null;
  timestamp: Date | null;
}

export interface Relationship {
  connectId: string | null;
  sourceDataSourceGuid: string | null;
  targetDataSourceGuid: string | null;
  sourceDataSourceName: string | null;
  targetDataSourceName: string | null;
}

export interface StatusResponse {
  licenseStatus: string;
  uptime: string;
  version: string;
}
