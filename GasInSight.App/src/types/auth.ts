export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Admin' | 'User';
  lastLogin: string;
}
