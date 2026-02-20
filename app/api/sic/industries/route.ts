import { NextResponse } from "next/server";
import { sicService } from "@/libs/services/sicService";

export async function GET() {
  try {
    const industries = await sicService.getIndustries();
    return NextResponse.json(industries, { status: 200 });
  } catch (error) {
    console.error("[GET /api/sic/industries]", error);
    return NextResponse.json(
      { error: "Failed to fetch industries" },
      { status: 500 }
    );
  }
}
