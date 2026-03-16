export const API_BASE = '/connectRest/rest';

export const API_URLS = {
  // Authentication
  AUTH_MODE: `${API_BASE}/noauth/server/authmode`,
  AUTHENTICATORS_NOAUTH: `${API_BASE}/noauth/server/authenticators`,
  LOGIN: `${API_BASE}/users/logon`,
  LOGGED_IN: (userId: string) => `${API_BASE}/users/loggedIn/${userId}`,
  LOGOUT: `${API_BASE}/users/logout`,
  PERMISSIONS: `${API_BASE}/users/permissions`,
  CHANGE_PASSWORD: `${API_BASE}/users/changePassword`,

  // Connections / Synchronizations
  SYNCHRONIZATIONS: `${API_BASE}/connect/synchronizations`,
  SYNCHRONIZATION_DELETE: (guid: string) => `${API_BASE}/v2/synchronizations/${guid}`,
  SYNCHRONIZATION_ACTION: (guid: string, action: string) => `${API_BASE}/connect/synchronizations/${guid}/${action}`,
  CONNECTIONS: `${API_BASE}/connect/synchronizations`,
  CONNECTION: (guid: string) => `${API_BASE}/connect/synchronizations/${guid}`,
  RUN_CONNECTION: (guid: string) => `${API_BASE}/connect/synchronizations/${guid}/run`,
  RUN_FULL_CONNECTION: (guid: string) => `${API_BASE}/connect/synchronizations/${guid}/runFull`,
  STOP_CONNECTION: (guid: string) => `${API_BASE}/connect/synchronizations/${guid}/stop`,
  ENABLE_CONNECTION: (guid: string) => `${API_BASE}/connect/synchronizations/${guid}/enable`,
  DISABLE_CONNECTION: (guid: string) => `${API_BASE}/connect/synchronizations/${guid}/disable`,

  // Servers
  SERVERS: `${API_BASE}/server/servers`,
  SERVER: (guid: string) => `${API_BASE}/server/servers/${guid}`,
  STOP_SERVERS_FOR_UPGRADE: `${API_BASE}/server/stopServersForUpgrade`,
  SERVER_CHOICES: (guid: string) => `${API_BASE}/server/servers/${guid}/choices`,

  // Jobs
  JOBS: `${API_BASE}/job/jobs`,
  JOB: (syncGuid: string) => `${API_BASE}/job/jobs/${syncGuid}`,
  JOBS_ASSIGNED_TO_SERVER: (serverGuid: string) => `${API_BASE}/job/jobs/${serverGuid}/jobsAssignedToServer`,
  UNASSIGNED_JOBS: `${API_BASE}/job/jobs/unassignedJobs`,

  // Data Sources
  DATA_SOURCES: `${API_BASE}/connect/dataSources`,
  DATA_SOURCE_DELETE: (guid: string) => `${API_BASE}/v2/datasources/${guid}`,
  DATA_SOURCE_PROPERTIES: (guid: string) => `${API_BASE}/connect/dataSource/${guid}/properties`,
  DATA_SOURCE_TYPES: (guid: string) => `${API_BASE}/connect/dataSource/${guid}/types`,
  DATA_SOURCE_TYPE_PROPERTIES: (guid: string, typeGuid: string) => `${API_BASE}/connect/dataSource/${guid}/types/${typeGuid}/properties`,
  DATA_SOURCE_PROJECTS: `${API_BASE}/connect/dataSource/projects`,
  DATA_SOURCE_IS_VALID: `${API_BASE}/connect/isvalid`,
  SUPPORTED_PRODUCTS: `${API_BASE}/connect/supportedProducts`,
  DATA_SOURCE_RELATIONSHIPS: (guid: string) => `${API_BASE}/connect/dataSource/${guid}/relationships`,

  // Users
  USERS: `${API_BASE}/users/connectUsers`,
  USER_DELETE: (userId: string) => `${API_BASE}/users/connectUsers/${userId}`,

  // User Maps
  USER_MAPS: `${API_BASE}/connect/userMaps`,
  USER_MAP_LIST: `${API_BASE}/connect/userMapList`,

  // Authenticators
  AUTHENTICATORS: `${API_BASE}/connect/authenticators`,
  AUTHENTICATOR_DELETE: (product: string) => `${API_BASE}/connect/authenticators/${product}`,
  AUTHENTICATOR_PRODUCTS: `${API_BASE}/connect/authenticators/products`,
  AUTHENTICATOR_DATA_SOURCES: `${API_BASE}/connect/authenticatorDataSources`,

  // Access Tokens
  ACCESS_TOKENS: `${API_BASE}/users/accessTokens`,
  ACCESS_TOKEN_DELETE: (id: string) => `${API_BASE}/users/accessTokens/${id}`,

  // Email Settings
  EMAIL_SETTINGS_CONNECTIONS: `${API_BASE}/mailsettings/connections`,
  EMAIL_SETTINGS_CONFIGS: `${API_BASE}/mailsettings/syncsetmailconfigurations`,

  // Charts / Activity
  ACTIVITY_CHART: `${API_BASE}/chart/connectActivityChart`,
  DURATION_CHART: `${API_BASE}/chart/durationChart`,
  ACTIVITY_AUDIT_TREE: (syncGuid: string) => `${API_BASE}/chart/activityAuditTree/${syncGuid}`,
  EXPORT_ACTIVITY_AUDIT: `${API_BASE}/v2/charts/export-activity-audit-tree`,
  PROJECT_CHANGES_CHART: `${API_BASE}/chart/projectChangesChart`,
  ITERATION_MESSAGES: (syncGuid: string) => `${API_BASE}/chart/iterationMessages/${syncGuid}`,

  // Global Settings
  GLOBAL_PROPERTIES: `${API_BASE}/connect/globalProperties`,
  FEATURE_FLAGS: `${API_BASE}/featureflags/statuses`,
  STATUS: `${API_BASE}/connect/getstatus`,

  // Cross References
  CROSS_REFERENCES: (syncGuid: string) => `${API_BASE}/connect/crossReferences/${syncGuid}`,

  // Import / Export
  IMPORT: `${API_BASE}/connect/import`,
  EXPORT: `${API_BASE}/connect/export`,
  EXPORT_CONNECTION: `${API_BASE}/connect/export`,
  IMPORT_PROJECT_MAPPING: (syncName: string) => `${API_BASE}/connect/importProjectMapping/${syncName}`,

  // Logical Groups
  LOGICAL_GROUPS: `${API_BASE}/connect/logicalGroups`,
  LOGICAL_GROUP: (guid: string) => `${API_BASE}/connect/logicalGroups/${guid}`,

  // Cache
  CLEAR_CACHE: `${API_BASE}/connect/clearCache`,
  CLEAR_SESSION_CACHE: `${API_BASE}/connect/clearSessionCache`,

  // Enums
  ENUMS: `${API_BASE}/connect/enums`,

  // Server Metrics
  SERVER_METRICS: `${API_BASE}/server/metrics`,

  // Watermarks
  WATERMARKS: (syncGuid: string) => `${API_BASE}/connect/syncSetWatermarks/${syncGuid}`
};
