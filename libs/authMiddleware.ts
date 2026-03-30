import { NextResponse, NextRequest } from "next/server";
import { getUserFromHeaders } from "./auth";

export interface AuthRequest {
  user: {
    userId: string;
    email: string;
  };
}

/**
 * Middleware to protect API routes
 * Returns 401 if user is not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const user = await getUserFromHeaders(request.headers);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized: Missing or invalid authentication token" },
      { status: 401 },
    );
  }

  return user;
}

/**
 * Parse authentication from request headers
 * Returns null if not authenticated (doesn't throw)
 */
export async function getOptionalUser(request: NextRequest) {
  return await getUserFromHeaders(request.headers);
}
