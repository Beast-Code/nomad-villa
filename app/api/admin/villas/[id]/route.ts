import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";


// =======================
// UPDATE VILLA (PUT)
// =======================
export async function PUT(request: Request, context: any) {
  const { id } = context.params;
try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price_per_night, amenities, images } = body;

    if (
      !name ||
      !description ||
      !price_per_night ||
      !amenities ||
      !images
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from("villas")
      .update({
        name,
        description,
        price_per_night,
        amenities,
        images,
      })
      .eq("id",id)
      .select()
      .single();

    if (error) {
      console.error("Error updating villa:", error);
      return NextResponse.json(
        { error: "Failed to update villa" },
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

// =======================
// DELETE VILLA
// =======================
export async function DELETE(request: Request, context: any) {
  const { id } = context.params;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from("villas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting villa:", error);
      return NextResponse.json(
        { error: "Failed to delete villa" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
