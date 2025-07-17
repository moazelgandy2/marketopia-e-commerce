"use client";

import { SessionType } from "@/types/auth";
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [session, setSession] = useState<SessionType | null>(null);

  const fetchSession = async () => {
    try {
      const res = await fetch("/ar/api/auth/session", {
        credentials: "include",
      });
      if (!res.ok) {
        setSession(null);
        return;
      }
      const data: SessionType | null = await res.json();
      setSession(data);
    } catch (error) {
      console.error("Session fetch error:", error);
      setSession(null);
    }
  };

  useEffect(() => {
    fetchSession();

    const interval = setInterval(() => {
      fetchSession();
    }, 10_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return session;
};
