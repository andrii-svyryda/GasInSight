export enum UserRole {
  Admin = "Admin",
  User = "User"
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
  userId: number;
  facilityId: string;
}
