export interface Authenticator {
  connectId: string | null;
  product: string;
  productDisplayName: string;
  dataSourceName: string;
}

export interface AuthenticatorListResponse {
  Authenticator: Authenticator[];
}

export interface AuthenticatorDataSource {
  connectId: string | null;
  name: string | null;
  product: string | null;
}

export interface AuthenticatorProduct {
  connectId: string | null;
  product: string | null;
  productDisplayName: string | null;
}
