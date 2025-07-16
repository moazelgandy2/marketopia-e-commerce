"use client";

import { SessionType } from "@/types/auth";
import { useState } from "react";

export const useAuth = () => {
  try {
    const [session, setSession] = useState<SessionType | null>(null);
    const fetchSession = async () => {
      const res = await fetch("/ar/api/auth/session");
      if (!res.ok) {
        console.error("Failed to fetch session:", res.statusText);
        return null;
      }
      const data: SessionType | null = await res.json();
      setSession(data);
      return data;
    };
    fetchSession();
    return session;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};
