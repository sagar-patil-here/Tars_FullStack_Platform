"use client";

import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

const HEARTBEAT_INTERVAL = 30_000; // 30 seconds

export function usePresence() {
  const heartbeat = useMutation(api.presence.heartbeat);

  useEffect(() => {
    // Send initial heartbeat
    heartbeat().catch(console.error);

    // Send periodic heartbeats
    const interval = setInterval(() => {
      heartbeat().catch(console.error);
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(interval);
  }, [heartbeat]);
}
