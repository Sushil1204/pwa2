"use client";

import { useEffect } from "react";

declare global {
  interface WindowEventMap {
    "fixora:sw-update": CustomEvent<void>;
  }
}

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    let registration: ServiceWorkerRegistration | null = null;
    let refreshing = false;

    const announce = (reg: ServiceWorkerRegistration) => {
      window.dispatchEvent(new window.Event("fixora:sw-update"));
      // stash on window so the prompt can activate the waiting worker
      (window as unknown as { __fixoraReg?: ServiceWorkerRegistration }).__fixoraReg = reg;
    };

    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((reg) => {
        registration = reg;
        if (reg.waiting && navigator.serviceWorker.controller) announce(reg);
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              announce(reg);
            }
          });
        });
      })
      .catch(() => {
        /* offline-first browsers without SW support still work as a web app */
      });

    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      void registration;
    };
  }, []);

  return null;
}
