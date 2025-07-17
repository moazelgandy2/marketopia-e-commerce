"use server";

import { SessionType, UserType } from "@/types";
import { cookies } from "next/headers";

export const createSession = async (
  user: UserType,
  token: string
): Promise<SessionType> => {
  try {
    const cookieStore = await cookies();
    const session: SessionType = {
      user: user,
      token: token,
    };
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    cookieStore.set("session", JSON.stringify(session), {
      expires: expiresAt,
      httpOnly: true,
    });

    return Promise.resolve(session);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating session:", error.message);
      throw new Error(`Session creation failed: ${error.message}`);
    }
    throw new Error("Unknown error during session creation.");
  }
};

export const destroySession = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    console.log("Session destroyed successfully.");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error destroying session:", error.message);
      throw new Error(`Session destruction failed: ${error.message}`);
    }
    throw new Error("Unknown error during session destruction.");
  }
};

export const getSession = async (): Promise<SessionType | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie || !sessionCookie.value) {
      console.log("No session found.");
      return null;
    }

    const session: SessionType = JSON.parse(sessionCookie.value);
    return session;
  } catch (error) {
    console.error("Error retrieving session:", error);
    return null;
  }
};
