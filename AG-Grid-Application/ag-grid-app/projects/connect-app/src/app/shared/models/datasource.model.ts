export interface DataSource {
  connectId: string | null;
  name: string | null;
  product: string | null;
  modifierRole: string | null;
  contextType: string | null;
  vsmMaster: boolean | null;
  productDisplayName: string | null;
  loadErrorMessage: string | null;
  properties: Record<string, unknown> | null;
  types: unknown[] | null;
  model: unknown | null;
}

export interface DataSourceListResponse {
  DataSource: DataSource[];
}

export interface DataSourceProperty {
  connectId: string | null;
  name: string | null;
  value: string | null;
  type: string | null;
  required: boolean;
  readOnly: boolean;
  displayName: string | null;
  description: string | null;
  options: string[] | null;
}

export interface DataSourceType {
  connectId: string | null;
  name: string | null;
  displayName: string | null;
  dataSourceGuid: string | null;
}

export interface DataSourceTypeProperty {
  connectId: string | null;
  name: string | null;
  value: string | null;
  type: string | null;
  required: boolean;
  readOnly: boolean;
  displayName: string | null;
  description: string | null;
}
