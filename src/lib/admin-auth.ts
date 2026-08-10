const ADMIN_SESSION_KEY = "admin:session";

export type AdminSession = {
  username: string;
  loggedInAt: string;
};

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "admin123";

export function validateAdminCredentials(username: string, password: string) {
  return username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD;
}

export function saveAdminSession(username: string) {
  const session: AdminSession = {
    username: username.trim(),
    loggedInAt: new Date().toISOString(),
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn() {
  return Boolean(readAdminSession());
}
