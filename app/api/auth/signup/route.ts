import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { syncSupabaseUser } from "@/libs/auth";

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase config missing for auth");
    return NextResponse.json({ error: "Auth service not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
    });

    if (error) {
      console.error("Supabase signup error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create user" },
        { status: 400 },
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "User creation failed" },
        { status: 500 },
      );
    }

    // Sync user to database
    const user = await syncSupabaseUser(data.user.id, email, firstName, lastName);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
