"use server";

import { createSession, destroySession, getSession } from "@/lib/session";
import { LoginResponseType, LoginType, RegisterType } from "@/types";
import { getLocale } from "next-intl/server";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

export async function loginAction(values: LoginType) {
  try {
    const { identifier, password } = values;
    const locale = await getLocale();

    const response = await fetch(`${baseUrl}/auth/login?lang=${locale}`, {
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
    const locale = await getLocale();

    const response = await fetch(`${baseUrl}/auth/register?lang=${locale}`, {
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

export async function updateProfileAction(token: string, formData: FormData) {
  try {
    const locale = await getLocale();

    const updateResponse = await fetch(
      `${baseUrl}/auth/profile/update?lang=${locale}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const updateData = await updateResponse.json();
    if (!updateResponse.ok) {
      console.error("Update profile error:", updateData);
      throw new Error(`Update profile failed: ${updateData.message}`);
    }

    const profileResponse = await fetch(`${baseUrl}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const profileData = await profileResponse.json();
    if (!profileResponse.ok) {
      throw new Error("Failed to fetch updated profile");
    }

    const session = await createSession(profileData.data, token);
    if (!session) {
      throw new Error("Session update failed");
    }

    return session;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Update profile error:", error.message);
      throw new Error(`${error.message}`);
    } else {
      console.error("Update profile error:", error);
      throw new Error("Update profile failed due to an unknown error");
    }
  }
}
