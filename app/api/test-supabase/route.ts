import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Initialize using the same env vars the main project will use
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Perform a trivial query to confirm connectivity
    const { data, error } = await supabase
      .from("pg_tables") // built-in postgres metadata table
      .select("tablename")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: "Connection failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Supabase connection successful",
        exampleResult: data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Unexpected error initializing Supabase",
        error: err?.message || err,
      },
      { status: 500 }
    );
  }
}
