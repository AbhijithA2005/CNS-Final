"use client";
import { useEffect } from "react";

/**
 * PortGuard – client-side redirect safety net.
 *
 * If the user opens the app on plain `localhost` (port 80) instead of
 * `localhost:3000`, every API fetch fails with a network TypeError because
 * the Next.js proxy only listens on port 3000.
 *
 * This component runs once on mount and, if we detect we are on localhost
 * with the wrong port, immediately replaces the URL with the correct one so
 * the user never notices.  In production (non-localhost) or when the port is
 * already correct, it is a no-op.
 */
export function PortGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const { hostname, port, pathname, search, hash } = window.location;
    const isLocalhost =
      hostname === "localhost" || hostname === "127.0.0.1";
    const correctPort = "3000";

    if (isLocalhost && port !== correctPort) {
      const target = `http://${hostname}:${correctPort}${pathname}${search}${hash}`;
      // replace() so the wrong-port entry isn't kept in browser history
      window.location.replace(target);
    }
  }, []);

  return null;
}
