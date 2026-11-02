"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/Button";
import { FormField, TextField } from "@/components/ui/FormField";
import { useApp } from "@/components/providers/AppProviders";

type Phase = "phone" | "otp";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { authenticated, sendOtp, verifyOtp } = useApp();

  const [phase, setPhase] = useState<Phase>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (authenticated) router.replace(next);
  }, [authenticated, router, next]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await sendOtp(phone);
      if (res.ok) {
        setPhase("otp");
        setResent(false);
      } else {
        setError(res.error ?? "Could not send the code.");
      }
    } finally {
      setSending(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setVerifying(true);
    try {
      const res = await verifyOtp(phone, otp);
      if (res.ok) {
        router.replace(next);
      } else {
        setError(res.error ?? "Verification failed.");
      }
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setError("");
    setResending(true);
    try {
      const res = await sendOtp(phone);
      setResent(res.ok);
      if (!res.ok) setError(res.error ?? "Could not resend the code.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas-soft">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-10">
        <Link href="/" aria-label="Fixora home" className="mb-8 self-start">
          <Brand />
        </Link>

        <div className="rounded-xl bg-canvas p-6 shadow-card">
          {phase === "phone" ? (
            <>
              <h1 className="display-md text-ink">Sign in to Fixora</h1>
              <p className="mt-2 text-body-sm text-body">
                Enter your mobile number and we&apos;ll text you a one-time code.
              </p>
              <form onSubmit={handleSend} className="mt-6 flex flex-col gap-4" noValidate>
                <FormField
                  label="Mobile number"
                  required
                  error={error || undefined}
                  hint="Indian mobile numbers, e.g. 98765 43210"
                >
                  {(p) => (
                    <TextField
                      {...p}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  )}
                </FormField>
                <Button type="submit" loading={sending} disabled={!phone.trim()}>
                  Send code
                  <ArrowRight className="h-5 w-5" aria-hidden />
                </Button>
              </form>
            </>
          ) : (
            <>
              <h1 className="display-md text-ink">Enter the code</h1>
              <p className="mt-2 flex items-center gap-2 text-body-sm text-body">
                <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
                Sent to <span className="font-semibold text-ink">{phone}</span>
              </p>
              <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-4" noValidate>
                <FormField
                  label="6-digit code"
                  required
                  error={error || undefined}
                  hint={
                    process.env.NODE_ENV === "production"
                      ? "Development adapter: any 6 digits will verify."
                      : "Enter the code from your SMS."
                  }
                >
                  {(p) => (
                    <TextField
                      {...p}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      pattern="\d{6}"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-md border border-ink bg-canvas px-4 py-3 text-center text-body-lg font-semibold tracking-[0.4em] text-ink placeholder:tracking-normal placeholder:text-mute focus:outline-none focus-visible:outline-2 focus-visible:outline-ink tnum"
                    />
                  )}
                </FormField>
                <Button type="submit" loading={verifying} disabled={otp.length !== 6}>
                  Verify &amp; continue
                </Button>
                <div className="flex items-center justify-between text-body-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setPhase("phone");
                      setOtp("");
                      setError("");
                    }}
                    className="text-body underline underline-offset-4 hover:text-ink"
                  >
                    Change number
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-body-sm-strong text-ink underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {resending ? "Resending…" : resent ? "Code sent again" : "Resend code"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-caption text-mute">
          By continuing you agree to the{" "}
          <Link href="/legal#terms" className="underline underline-offset-2">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/legal#privacy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-canvas-soft">
          <p role="status" className="text-body-sm text-body">
            Loading…
          </p>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
