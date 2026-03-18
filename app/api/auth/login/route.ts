import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/libs/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await authenticateUser({ email, password });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: result.id,
          email: result.email,
          role: result.role,
        },
      },
      { status: 200 },
    );

    // Set token as HttpOnly cookie
    response.cookies.set("authToken", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 1 day
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 401 },
    );
  }
}
