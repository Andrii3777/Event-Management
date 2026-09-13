export interface User {
  id: number;
  email: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export type RegisterResponse = User;
