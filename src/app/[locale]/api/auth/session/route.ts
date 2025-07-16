import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      console.log("No session found, returning null");
      return NextResponse.json(null);
    }

    console.log("Session found, returning session data");
    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in GET handler:", error.message);
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 500 }
      );
    } else {
      console.error("An unknown error occurred in GET handler:", error);
      return NextResponse.json(
        {
          error: "An unknown error occurred during the GET request.",
        },
        { status: 500 }
      );
    }
  }
}
