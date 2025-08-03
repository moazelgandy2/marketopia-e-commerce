import { registerAction } from "@/actions/auth";
import { UserRoleType } from "@/types";
import { getLocale } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale = await getLocale();
    const { name, email, phone, password, confirmPassword } = body;
    const values = {
      name,
      email,
      phone,
      password,
      confirmPassword,
      user_type: UserRoleType.USER,
      fcm_token: undefined,
    };
    const session = await registerAction(values, locale);

    return NextResponse.json({
      message: "Data received successfully",
      data: {
        session,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in POST handler:", error.message);
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred during the POST request.",
      },
      { status: 500 }
    );
  }
}
