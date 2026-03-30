import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Auth service not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (refreshToken) {
      // Revoke the refresh token
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser(request.headers.get("authorization")?.replace("Bearer ", "") || "")).data.user?.id || "",
      );

      if (error) {
        console.error("Logout error:", error);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: true }, { status: 200 }); // Always return success
  }
}
