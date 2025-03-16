export enum UserRole {
  Admin = "Admin",
  User = "User"
}

export enum PermissionType {
  View = "View",
  Edit = "Edit"
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  role: UserRole;
}

export interface UserFacilityPermission {
  id: number;
  userId: number;
  facilityId: string;
  permissionType: PermissionType;
}
