export interface WizardState {
  mode: 'CREATE' | 'UPDATE';
  currentStep: number;
  sourceProduct: string | null;
  targetProduct: string | null;
  sourceDataSourceGuid: string | null;
  targetDataSourceGuid: string | null;
  connectionName: string;
  connectionDescription: string;
  direction: string;
  frequency: number;
  enabled: boolean;
  sourceDataSourceProperties: WizardDataSourceProperty[];
  targetDataSourceProperties: WizardDataSourceProperty[];
  typeMappings: WizardTypeMapping[];
  syncRules: WizardSyncRule[];
  projectMaps: WizardProjectMap[];
  fallbackUsers: WizardFallbackUser[];
  existingConnectionGuid: string | null;
}

export interface WizardDataSourceProperty {
  name: string;
  value: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  displayName: string;
  description: string;
  options: string[] | null;
}

export interface WizardTypeMapping {
  sourceType: string;
  sourceTypeLabel: string;
  targetType: string;
  targetTypeLabel: string;
}

export interface WizardSyncRule {
  connectId: string | null;
  source: string;
  sourceLabel: string;
  target: string;
  targetLabel: string;
}

export interface WizardProjectMap {
  connectId: string | null;
  sourceProject: string;
  targetProject: string;
  sourceProjectLabel: string;
  targetProjectLabel: string;
}

export interface WizardFallbackUser {
  connectId: string | null;
  sourceUser: string;
  targetUser: string;
}

export interface ImportExportElements {
  connections: string[];
  servers: string[];
  dataSources: string[];
  users: string[];
  logicalGroups: string[];
  globalProperties: string[];
}

export interface ImportResult {
  connections: number;
  dataSources: number;
  servers: number;
  users: number;
  logicalGroups: number;
  importMessages: ImportMessage[];
  exceptionData: string | null;
}

export interface ImportMessage {
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  entityType: string;
  entityName: string;
}
