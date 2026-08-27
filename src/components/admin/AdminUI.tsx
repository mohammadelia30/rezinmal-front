import type { ReactNode } from "react";

export function AdminStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand sm:text-3xl">{value}</p>
      {hint ? <p className="mt-2 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function AdminBadge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${className}`}
    >
      {children}
    </span>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="text-right">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-[0_4px_20px_rgba(78,42,84,0.06)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-[0_4px_20px_rgba(78,42,84,0.06)]">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-[#efe6d4] bg-[#fbf9f1] text-right">
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 font-bold text-foreground whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminEmpty({ message }: { message: string }) {
  return (
    <AdminCard className="py-10 text-center text-sm text-muted">{message}</AdminCard>
  );
}
