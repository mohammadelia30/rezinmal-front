const LOGIN_PHONE_KEY = "auth:login:phone";
const REGISTER_DATA_KEY = "auth:register:data";
const USER_SESSION_KEY = "auth:user";

export type RegisterData = {
  firstName: string;
  lastName: string;
  phone: string;
};

export type UserSession = {
  phone: string;
  firstName?: string;
  lastName?: string;
};

export function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("98") && digits.length === 12) {
    return `0${digits.slice(2)}`;
  }
  if (digits.startsWith("9") && digits.length === 10) {
    return `0${digits}`;
  }
  return digits;
}

export function isValidPhone(phone: string) {
  return /^09\d{9}$/.test(normalizePhone(phone));
}

export function formatPhoneDisplay(phone: string) {
  const normalized = normalizePhone(phone);
  if (normalized.length !== 11) return phone;
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
}

export function saveLoginPhone(phone: string) {
  sessionStorage.setItem(LOGIN_PHONE_KEY, normalizePhone(phone));
}

export function readLoginPhone() {
  return sessionStorage.getItem(LOGIN_PHONE_KEY);
}

export function clearLoginPhone() {
  sessionStorage.removeItem(LOGIN_PHONE_KEY);
}

export function saveRegisterData(data: RegisterData) {
  sessionStorage.setItem(
    REGISTER_DATA_KEY,
    JSON.stringify({
      ...data,
      phone: normalizePhone(data.phone),
    }),
  );
}

export function readRegisterData(): RegisterData | null {
  const raw = sessionStorage.getItem(REGISTER_DATA_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RegisterData;
  } catch {
    return null;
  }
}

export function clearRegisterData() {
  sessionStorage.removeItem(REGISTER_DATA_KEY);
}

export function isValidOtp(code: string) {
  return /^\d{5}$/.test(code);
}

export function saveUserSession(user: UserSession) {
  sessionStorage.setItem(
    USER_SESSION_KEY,
    JSON.stringify({
      ...user,
      phone: normalizePhone(user.phone),
    }),
  );
}

export function readUserSession(): UserSession | null {
  const raw = sessionStorage.getItem(USER_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function updateUserSession(data: Partial<UserSession>) {
  const current = readUserSession();
  if (!current) return;

  saveUserSession({
    ...current,
    ...data,
    phone: normalizePhone(data.phone ?? current.phone),
  });
}

export function clearUserSession() {
  sessionStorage.removeItem(USER_SESSION_KEY);
}

export function getUserDisplayName(user: UserSession) {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || "کاربر عزیز";
}
