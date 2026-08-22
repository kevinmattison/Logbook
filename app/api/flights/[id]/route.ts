import { NextRequest, NextResponse } from "next/server";
import { deleteFlight, updateFlight } from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid flight id." }, { status: 400 });
    }
    await deleteFlight(id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not delete flight.", detail: err?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid flight id." }, { status: 400 });
    }

    const body = await req.json();
    if (!body.flight_date || !body.duration_minutes) {
      return NextResponse.json(
        { error: "flight_date and duration_minutes are required." },
        { status: 400 }
      );
    }

    const flight = await updateFlight(id, {
      flight_date: body.flight_date,
      duration_minutes: Number(body.duration_minutes),
      site: body.site || null,
      wing: body.wing || null,
      comments: body.comments || null,
      max_elevation_m: body.max_elevation_m ? Number(body.max_elevation_m) : null,
      distance_km: body.distance_km ? Number(body.distance_km) : null,
    });

    return NextResponse.json({ flight });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not update flight.", detail: err?.message },
      { status: 500 }
    );
  }
}
