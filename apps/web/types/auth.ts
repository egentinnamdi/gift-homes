export type UserRole = "buyer" | "owner" | "diaspora" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  location?: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
  }) => Promise<AuthResult>;
  logout: () => void;
}
