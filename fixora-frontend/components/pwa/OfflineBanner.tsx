"use client";

import { useEffect, useState } from "react";
import { RefreshCw, WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-ink px-4 py-2 text-body-sm-strong text-canvas"
      style={{ paddingTop: "max(8px, env(safe-area-inset-top))" }}
    >
      <WifiOff className="h-4 w-4 shrink-0" aria-hidden />
      <span>You&apos;re offline — some actions need a connection.</span>
    </div>
  );
}

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const on_update = () => setVisible(true);
    window.addEventListener("fixora:sw-update", on_update);
    return () => window.removeEventListener("fixora:sw-update", on_update);
  }, []);

  if (!visible) return null;

  const activate = () => {
    const reg = (window as unknown as { __fixoraReg?: ServiceWorkerRegistration }).__fixoraReg;
    reg?.waiting?.postMessage({ type: "SKIP_WAITING" });
    setVisible(false);
  };

  return (
    <div
      role="status"
      className="fixed inset-x-4 bottom-[calc(var(--bottom-nav-height)+16px+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center gap-3 rounded-xl bg-ink px-4 py-3 text-canvas shadow-raised md:bottom-6"
    >
      <RefreshCw className="h-5 w-5 shrink-0 text-primary" aria-hidden />
      <p className="flex-1 text-body-sm">A new version of Fixora is ready.</p>
      <button
        type="button"
        onClick={activate}
        className="rounded-sm bg-primary px-3 py-1.5 text-body-sm-strong text-on-primary transition-colors hover:bg-primary-active"
      >
        Update
      </button>
    </div>
  );
}
