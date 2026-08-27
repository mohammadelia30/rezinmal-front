import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/BrandLogo";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#f6f1e7]">
      <header className="px-4 py-5 sm:px-6">
        <BrandLogo
          imageClassName="h-9 w-9 rounded-full object-cover"
          textClassName="text-lg font-bold text-brand"
          size={36}
        />
      </header>

      <main className="flex flex-1 items-start justify-center px-4 pb-10 pt-2 sm:px-6 sm:pt-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(78,42,84,0.08)] sm:p-8">
            <div className="mb-6 text-right">
              <h1 className="text-xl font-bold text-foreground sm:text-2xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm leading-7 text-muted">{subtitle}</p>
              ) : null}
            </div>

            {children}
          </div>

          {footer ? <div className="mt-5 text-center text-sm">{footer}</div> : null}
        </div>
      </main>
    </div>
  );
}

export function AuthSwitchLink({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="text-muted">
      {prompt}{" "}
      <Link href={href} className="font-bold text-brand transition hover:text-brand-dark">
        {label}
      </Link>
    </p>
  );
}
