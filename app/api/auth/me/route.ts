import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/libs/utils/authHelpers";

export async function GET(request: NextRequest) {
  const { authenticated, user, error } = await authenticateRequest(request);

  if (!authenticated) {
    return error;
  }

  return NextResponse.json(
    {
      user,
    },
    { status: 200 },
  );
}
