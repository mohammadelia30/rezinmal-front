"use client";

import { useEffect, useState } from "react";
import { AuthField, AuthSubmitButton } from "@/components/auth/AuthFields";
import {
  formatPhoneDisplay,
  readUserSession,
  updateUserSession,
  type UserSession,
} from "@/lib/auth-flow";

export function DashboardProfile() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = readUserSession();
    if (!session) return;
    setUser(session);
    setFirstName(session.firstName ?? "");
    setLastName(session.lastName ?? "");
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    updateUserSession({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    setUser({
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  if (!user) return null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-6">
      <div className="mb-6 text-right">
        <h2 className="text-lg font-bold text-foreground">پروفایل</h2>
        <p className="mt-1 text-sm text-muted">
          اطلاعات حساب کاربری خود را مشاهده و ویرایش کنید.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          id="profile-first-name"
          label="نام"
          value={firstName}
          onChange={setFirstName}
          placeholder="نام"
          autoComplete="given-name"
        />

        <AuthField
          id="profile-last-name"
          label="نام خانوادگی"
          value={lastName}
          onChange={setLastName}
          placeholder="نام خانوادگی"
          autoComplete="family-name"
        />

        <div className="text-right">
          <label className="mb-2 block text-sm font-medium text-foreground">
            شماره موبایل
          </label>
          <div
            className="rounded-xl border border-[#e6dcc2] bg-[#f7f2ea] px-4 py-3 text-sm text-muted"
            dir="ltr"
          >
            {formatPhoneDisplay(user.phone)}
          </div>
          <p className="mt-1.5 text-xs text-muted">
            شماره موبایل قابل تغییر نیست.
          </p>
        </div>

        <AuthSubmitButton>{saved ? "ذخیره شد" : "ذخیره تغییرات"}</AuthSubmitButton>
      </form>
    </div>
  );
}
