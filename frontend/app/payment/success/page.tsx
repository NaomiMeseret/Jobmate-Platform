"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/redux/api/baseQuery";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref") || "";
  const [status, setStatus] = useState<"checking" | "paid" | "failed">(
    "checking"
  );
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    if (!txRef) {
      setStatus("failed");
      setMessage("Missing payment reference.");
      return;
    }

    fetch(`${API_BASE_URL}/payments/chapa/verify/${encodeURIComponent(txRef)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Payment verification failed.");
        }
        const paymentStatus = data?.payment?.status;
        if (paymentStatus === "paid") {
          setStatus("paid");
          setMessage("Your Career Pro payment is verified.");
        } else {
          setStatus("failed");
          setMessage("Payment was not completed yet.");
        }
      })
      .catch((error) => {
        setStatus("failed");
        setMessage(error.message || "Payment verification failed.");
      });
  }, [txRef]);

  const Icon =
    status === "checking" ? Loader2 : status === "paid" ? CheckCircle2 : XCircle;

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-4 py-24 text-[var(--text-primary)]">
      <section className="glass-card mx-auto max-w-xl p-8 text-center">
        <Icon
          className={`mx-auto h-12 w-12 ${
            status === "checking" ? "animate-spin text-[var(--accent-gold)]" : ""
          }`}
        />
        <h1 className="mt-6 font-display text-4xl font-semibold">
          {status === "paid" ? "Payment Verified" : "Payment Status"}
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--text-muted)]">
          {message}
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex rounded-lg bg-[var(--accent-gold)] px-5 py-3 text-sm font-bold text-[#080C18]"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
