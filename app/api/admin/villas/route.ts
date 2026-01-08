import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price_per_night, amenities, images } = body;

    if (!name || !description || !price_per_night || !amenities || !images) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from("villas")
      .insert({
        name,
        description,
        price_per_night,
        amenities,
        images,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating villa:", error);
      return NextResponse.json(
        { error: "Failed to create villa" },
        { status: 500 }
      );
    }

    return NextResponse.json({ villa: data });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
