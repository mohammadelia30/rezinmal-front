import {
  defaultDiscounts,
  defaultRoles,
  defaultSettings,
  type AdminDiscount,
  type AdminRole,
  type AdminSettings,
} from "@/data/admin";

const DISCOUNTS_KEY = "admin:discounts";
const ROLES_KEY = "admin:roles";
const SETTINGS_KEY = "admin:settings";
const PRODUCTS_ACTIVE_KEY = "admin:products:active";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("admin:store-change"));
}

export function readDiscounts(): AdminDiscount[] {
  return readJson(DISCOUNTS_KEY, defaultDiscounts);
}

export function writeDiscounts(items: AdminDiscount[]) {
  writeJson(DISCOUNTS_KEY, items);
}

export function readRoles(): AdminRole[] {
  return readJson(ROLES_KEY, defaultRoles);
}

export function writeRoles(items: AdminRole[]) {
  writeJson(ROLES_KEY, items);
}

export function readSettings(): AdminSettings {
  return readJson(SETTINGS_KEY, defaultSettings);
}

export function writeSettings(settings: AdminSettings) {
  writeJson(SETTINGS_KEY, settings);
}

export function readProductActiveMap(): Record<string, boolean> {
  return readJson(PRODUCTS_ACTIVE_KEY, {});
}

export function writeProductActive(productId: string, active: boolean) {
  const map = readProductActiveMap();
  map[productId] = active;
  writeJson(PRODUCTS_ACTIVE_KEY, map);
}
