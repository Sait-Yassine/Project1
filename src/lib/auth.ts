// src/lib/auth.ts

export interface User { 
  email: string; 
  password: string; 
}

export interface LoginResponse {
  token: string;
  userId: number;
  email: string;
  roles: string[];
}

const API = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(user: User): Promise<boolean> {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return res.status === 201;
}

export async function loginUser(user: User): Promise<LoginResponse> {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  const payload = (await res.json()) as LoginResponse;
  localStorage.setItem("brilliant_token", payload.token);
  return payload;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("brilliant_token");
}
