import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { SicLevel } from "@prisma/client";

const ACTIVE_ORDERED = {
  where: { isActive: true },
  orderBy: { code: "asc" },
} as const;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const industry = await prisma.sicNode.findFirst({
      where: {
        id,
        level: SicLevel.industry,
        isActive: true,
      },
      include: {
        // divisions
        children: {
          ...ACTIVE_ORDERED,
          include: {
            // groups
            children: {
              ...ACTIVE_ORDERED,
              include: {
                // classes
                children: {
                  ...ACTIVE_ORDERED,
                },
              },
            },
          },
        },
      },
    });

    if (!industry) {
      return NextResponse.json(
        { error: "Industry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(industry, { status: 200 });
  } catch (error) {
    console.error(`[GET /api/sic/industries/${id}/hierarchy]`, error);
    return NextResponse.json(
      { error: "Failed to fetch industry hierarchy" },
      { status: 500 }
    );
  }
}
