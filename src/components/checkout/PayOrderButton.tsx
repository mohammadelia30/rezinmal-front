"use client";

import { useState } from "react";
import { CheckoutError, redirectToGateway } from "@/lib/checkout";

/** پرداخت دوبارهٔ سفارشی که در انتظار پرداخت مانده است. */
export function PayOrderButton({
  orderId,
  label = "پرداخت",
  className = "",
}: {
  orderId: number | string;
  label?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      await redirectToGateway(orderId);
    } catch (failure) {
      setError(
        failure instanceof CheckoutError
          ? failure.message
          : "اتصال به درگاه پرداخت ناموفق بود.",
      );
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={pay}
        disabled={busy}
        className="inline-flex min-h-10 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {busy ? "در حال انتقال به درگاه..." : label}
      </button>
      {error ? (
        <p className="mt-2 text-right text-sm text-[#9b3d3d]">{error}</p>
      ) : null}
    </div>
  );
}
