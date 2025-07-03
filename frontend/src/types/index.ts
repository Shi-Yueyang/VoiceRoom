// Script related types
export interface ScriptSummary {
  _id: string;
  title: string;
  creator:string;
  editors: string[]; // Array of user IDs who can edit the script
  createdAt: string;
  updatedAt: string;
  lastModified: string; // Alias for updatedAt for backwards compatibility
}

export interface ScriptResponse {
  scripts: ScriptSummary[];
  currentPage: number;
  totalPages: number;
}

export interface CreateScriptRequest {
  title: string;
  description?: string;
}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}
