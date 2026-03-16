export interface User {
  connectId: string | null;
  userId: string | null;
  name: string | null;
  status: string | null;
  lastPasswordChange: Date | null;
  password: string | null;
  role: string | null;
}

export interface UserListResponse {
  users: User[];
}

export interface UserInfo {
  id: string;
  name: string;
  role: string;
  sessionToken: string;
}

export interface UserPermissions {
  permissions: Record<string, string[]>;
}
