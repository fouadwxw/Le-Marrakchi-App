import Constants from "expo-constants";
import { storage } from "@/src/utils/storage";

const BASE = (process.env.EXPO_PUBLIC_BACKEND_URL || "") + "/api";

async function req(path: string, opts: any = {}) {
  const token = await storage.secureGet("token", "");
  const headers: any = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(BASE + path, { ...opts, headers });
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error((data && data.detail) || "Request failed");
  return data;
}

export const api = {
  get: (p: string) => req(p),
  post: (p: string, body?: any) => req(p, { method: "POST", body: JSON.stringify(body || {}) }),
  put: (p: string, body?: any) => req(p, { method: "PUT", body: JSON.stringify(body || {}) }),
};
export { BASE };
