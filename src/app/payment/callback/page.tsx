import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { PayOrderButton } from "@/components/checkout/PayOrderButton";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { shopNavLinks } from "@/data/home";
import { API_PATHS, getApiBaseUrl } from "@/lib/api/config";
import { formatPrice, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "نتیجه پرداخت | رزین‌مال",
  robots: { index: false },
};

type CallbackPayment = {
  order?: number;
  order_code?: string;
  amount?: number;
  status?: string;
  reference_id?: string | null;
};

type CallbackResponse = {
  success?: boolean;
  payment?: CallbackPayment;
  reference_id?: string | null;
};

type Outcome =
  | { kind: "success"; payment: CallbackPayment; referenceId: string }
  | { kind: "cancelled"; payment?: CallbackPayment }
  | { kind: "failed"; payment?: CallbackPayment; retryable: boolean };

/**
 * زرین‌پال مشتری را با Authority و Status به اینجا برمی‌گرداند.
 *
 * تأیید پرداخت روی بک‌اند و مستقیم با خود زرین‌پال انجام می‌شود؛ این
 * صفحه فقط نتیجه را نشان می‌دهد و به پارامترهای آدرس اعتماد نمی‌کند.
 * بازخوانی صفحه بی‌خطر است: پرداختِ تأییدشده دوباره تأیید نمی‌شود.
 */
async function verify(authority: string, status: string): Promise<Outcome> {
  const query = new URLSearchParams({ Authority: authority, Status: status });

  let response: Response;
  try {
    response = await fetch(
      `${getApiBaseUrl()}${API_PATHS.zarinpalCallback}?${query}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    );
  } catch {
    return { kind: "failed", retryable: true };
  }

  const data = (await response.json().catch(() => null)) as CallbackResponse | null;
  const payment = data?.payment;

  if (response.ok && data?.success && payment?.status === "success") {
    return {
      kind: "success",
      payment,
      referenceId: String(data.reference_id ?? payment.reference_id ?? ""),
    };
  }

  if (payment?.status === "cancelled" || status !== "OK") {
    return { kind: "cancelled", payment };
  }

  // خطای شبکه یا زمان‌بر شدن تأیید: پرداخت هنوز pending است و بازخوانی
  // صفحه تأیید را دوباره امتحان می‌کند
  return {
    kind: "failed",
    payment,
    retryable: !payment || payment.status === "pending",
  };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#f6f1e7]">
      <Header links={shopNavLinks} />
      <main className="flex-1">
        <Container className="py-10 sm:py-14">
          <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 text-center shadow-[0_8px_30px_rgba(78,42,84,0.08)] sm:p-8">
            {children}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

function Row({
  label,
  value,
  ltr = false,
}: {
  label: string;
  value: string;
  /** کدها چپ‌به‌راست؛ مبلغ نه، وگرنه «تومان» پیش از عدد می‌آید */
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#efe6d4] py-2.5 text-sm last:border-b-0">
      <span className="font-bold text-foreground" dir={ltr ? "ltr" : undefined}>
        {value}
      </span>
      <span className="text-muted">{label}</span>
    </div>
  );
}

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const authority = typeof params.Authority === "string" ? params.Authority : "";
  const status = typeof params.Status === "string" ? params.Status : "";

  if (!authority) {
    return (
      <Shell>
        <h1 className="text-xl font-bold text-foreground">اطلاعات پرداخت یافت نشد</h1>
        <p className="mt-2 text-sm leading-7 text-muted">
          برای دیدن وضعیت سفارش‌هایتان به بخش سفارش‌ها بروید.
        </p>
        <Link
          href="/dashboard/orders"
          className="mt-6 inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
        >
          سفارش‌های من
        </Link>
      </Shell>
    );
  }

  const outcome = await verify(authority, status);

  if (outcome.kind === "success") {
    const { payment, referenceId } = outcome;
    return (
      <Shell>
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#e4f5ea] text-2xl text-[#2f6b45]">
          ✓
        </div>
        <h1 className="text-xl font-bold text-foreground">پرداخت با موفقیت انجام شد</h1>
        <p className="mt-2 text-sm leading-7 text-muted">
          سفارش شما ثبت و تأیید شد و به‌زودی آماده‌سازی می‌شود.
        </p>
        <div className="mt-5 rounded-xl bg-[#fbf9f1] px-4 py-2 text-right">
          {payment.order_code ? <Row label="کد سفارش" value={payment.order_code} ltr /> : null}
          {referenceId ? <Row label="کد پیگیری پرداخت" value={toPersianDigits(referenceId)} ltr /> : null}
          {payment.amount ? <Row label="مبلغ پرداختی" value={formatPrice(payment.amount)} /> : null}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard/orders"
            className="inline-flex rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            مشاهده سفارش
          </Link>
          <Link
            href="/products"
            className="inline-flex rounded-xl border border-[#e6dcc2] px-5 py-3 text-sm font-bold text-brand transition hover:bg-[#f6f1e7]"
          >
            ادامه خرید
          </Link>
        </div>
      </Shell>
    );
  }

  const orderId = outcome.payment?.order;
  const cancelled = outcome.kind === "cancelled";

  return (
    <Shell>
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#fde8e8] text-2xl text-[#9b3d3d]">
        !
      </div>
      <h1 className="text-xl font-bold text-foreground">
        {cancelled ? "پرداخت انجام نشد" : "تأیید پرداخت ناموفق بود"}
      </h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        {cancelled
          ? "پرداخت لغو شد یا ناموفق بود. سفارش شما ثبت شده و در انتظار پرداخت است."
          : "اگر مبلغی از حساب شما کسر شده باشد، حداکثر تا ۷۲ ساعت به حسابتان بازمی‌گردد."}
      </p>
      {outcome.payment?.order_code ? (
        <div className="mt-5 rounded-xl bg-[#fbf9f1] px-4 py-2 text-right">
          <Row label="کد سفارش" value={outcome.payment.order_code} ltr />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-start justify-center gap-3">
        {outcome.kind === "failed" && outcome.retryable ? (
          // همان آدرس: بک‌اند تأیید را دوباره امتحان می‌کند
          <a
            href={`/payment/callback?${new URLSearchParams({ Authority: authority, Status: status })}`}
            className="inline-flex min-h-10 items-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark"
          >
            بررسی دوباره
          </a>
        ) : orderId ? (
          <PayOrderButton orderId={orderId} label="پرداخت دوباره" />
        ) : null}
        <Link
          href="/dashboard/orders"
          className="inline-flex min-h-10 items-center rounded-xl border border-[#e6dcc2] px-5 py-2.5 text-sm font-bold text-brand transition hover:bg-[#f6f1e7]"
        >
          سفارش‌های من
        </Link>
      </div>
    </Shell>
  );
}
