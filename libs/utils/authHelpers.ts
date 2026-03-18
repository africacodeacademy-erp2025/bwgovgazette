import { NextRequest, NextResponse } from "next/server";
import { verifyTokenFromRequest } from "./jwtUtils";
import { getUserById } from "../services/authService";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Authenticate user from request and attach to request.user
 * Returns error response if auth fails
 */
export async function authenticateRequest(
  request: NextRequest,
): Promise<{
  authenticated: boolean;
  user?: any;
  error?: NextResponse;
}> {
  const payload = verifyTokenFromRequest(request);

  if (!payload) {
    return {
      authenticated: false,
      error: NextResponse.json(
        { error: "Unauthorized - missing or invalid token" },
        { status: 401 },
      ),
    };
  }

  const user = await getUserById(payload.userId);
  if (!user) {
    return {
      authenticated: false,
      error: NextResponse.json(
        { error: "Unauthorized - user not found" },
        { status: 401 },
      ),
    };
  }

  return {
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role.name,
      roleId: user.role.id,
      permissions: user.role.permissions,
    },
  };
}

/**
 * Require specific roles for a route
 */
export function requireRole(allowedRoles: string | string[]) {
  return (user: any) => {
    const roles = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        {
          error: `Forbidden - required role: ${roles.join(" or ")}`,
        },
        { status: 403 },
      );
    }

    return null; // No error
  };
}

/**
 * Require specific permissions
 */
export function requirePermission(permission: string) {
  return (user: any) => {
    if (!user.permissions?.includes(permission)) {
      return NextResponse.json(
        { error: `Forbidden - required permission: ${permission}` },
        { status: 403 },
      );
    }

    return null; // No error
  };
}

/**
 * Compose multiple authorization checks
 */
export function composeAuthChecks(
  ...checks: Array<(user: any) => NextResponse | null>
) {
  return (user: any) => {
    for (const check of checks) {
      const error = check(user);
      if (error) return error;
    }
    return null;
  };
}
