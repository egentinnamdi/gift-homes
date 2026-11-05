export type UserRole = "buyer" | "owner" | "diaspora" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  location?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  refreshToken?: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
}

export interface LoginDTO {
  email: string;
  password?: string;
}
