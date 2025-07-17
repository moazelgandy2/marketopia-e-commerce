"use server";

import { createSession, destroySession, getSession } from "@/lib/session";
import { LoginResponseType, LoginType, RegisterType } from "@/types";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function loginAction(values: LoginType) {
  try {
    const { identifier, password } = values;
    const response = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });
    console.log("Login request sent to:", `${baseUrl}/auth/login`, response);
    const data: LoginResponseType = await response.json();
    if (!response.ok) {
      console.error("Login error:", data);
      throw new Error(`Login failed: ${data.message}`);
    }

    const session = await createSession(data.data.user, data.data.token);
    if (!session) {
      throw new Error("Session creation failed");
    }

    return session;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login error:", error.message);
      throw new Error(`${error.message}`);
    } else {
      console.error("Login error:", error);
      throw new Error("Login failed due to an unknown error");
    }
  }
}

export async function registerAction(values: RegisterType) {
  try {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
        password_confirmation: values.confirmPassword,
      }),
    });
    console.log(
      "Register request sent to:",
      `${baseUrl}/auth/register`,
      response
    );
    const data: LoginResponseType = await response.json();
    if (!response.ok) {
      console.error("Register error:", data);
      throw new Error(`Register failed: ${data.message}`);
    }

    const session = await createSession(data.data.user, data.data.token);
    if (!session) {
      throw new Error("Session creation failed");
    }

    return session;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Register error:", error.message);
      throw new Error(`${error.message}`);
    } else {
      console.error("Register error:", error);
      throw new Error("Register failed due to an unknown error");
    }
  }
}

export async function logoutAction() {
  try {
    const session = await getSession();
    if (!session) {
      console.warn("No session found to destroy.");
      return;
    }

    await destroySession();
    console.log("Session destroyed successfully.");
    return { message: "Logout successful" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Logout error:", error.message);
      throw new Error(`Logout failed: ${error.message}`);
    } else {
      console.error("Logout error:", error);
      throw new Error("Logout failed due to an unknown error");
    }
  }
}
