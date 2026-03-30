import { NextResponse, NextRequest } from "next/server";
import { requireAuth } from "@/libs/authMiddleware";
import { prisma } from "@/libs/prisma";

export async function GET(request: NextRequest) {
  // Require authentication
  const authUser = await requireAuth(request);
  if (authUser instanceof NextResponse) {
    return authUser;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
