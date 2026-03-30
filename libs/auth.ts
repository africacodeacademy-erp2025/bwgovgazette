import { createClient } from "@supabase/supabase-js";
import { prisma } from "./prisma";

/**
 * Extract the JWT token from the Authorization header
 */
export function extractToken(authHeader: string | null | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}

/**
 * Verify the JWT token and extract the user ID from Supabase
 */
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase config missing for token verification");
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the token using Supabase's JWT verification
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Token verification failed:", error?.message);
      return null;
    }

    return { userId: user.id };
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

/**
 * Get user from headers (extract token and verify)
 */
export async function getUserFromHeaders(
  headers: Headers,
): Promise<{ userId: string; email: string } | null> {
  const authHeader = headers.get("authorization");
  const token = extractToken(authHeader);

  if (!token) return null;

  const verification = await verifyToken(token);
  if (!verification) return null;

  // Get user email from database
  const user = await prisma.user.findUnique({
    where: { id: verification.userId },
    select: { id: true, email: true },
  });

  if (!user) return null;

  return { userId: user.id, email: user.email };
}

/**
 * Sync or create user from Supabase auth data
 */
export async function syncSupabaseUser(
  supabaseUserId: string,
  email: string,
  firstName?: string,
  lastName?: string,
) {
  const user = await prisma.user.upsert({
    where: { id: supabaseUserId },
    update: {
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      isActive: true,
    },
    create: {
      id: supabaseUserId,
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      role: "user",
      isActive: true,
    },
  });

  return user;
}
