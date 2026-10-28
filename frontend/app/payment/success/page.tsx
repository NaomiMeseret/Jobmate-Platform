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
  const iconColor =
    status === "failed" ? "text-[var(--danger)]" : "text-[var(--accent)]";

  return (
    <main className="page-enter flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 py-16 text-[var(--text-primary)]">
      <section className="card mx-auto w-full max-w-md p-8 text-center">
        <Icon className={`mx-auto size-10 ${iconColor} ${status === "checking" ? "animate-spin" : ""}`} />
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          {status === "paid" ? "Payment verified" : "Payment status"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {message}
        </p>
        <Link href="/dashboard" className="btn-primary mt-6">
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
