import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getAllFlights, insertFlight, getNextFlightNumber } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const flights = await getAllFlights();
    return NextResponse.json({ flights });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not load flights. Is the database connected?", detail: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();

    if (!body.flight_date || !body.duration_minutes) {
      return NextResponse.json(
        { error: "flight_date and duration_minutes are required." },
        { status: 400 }
      );
    }

    const flight_number = await getNextFlightNumber();

    const flight = await insertFlight({
      flight_number,
      flight_date: body.flight_date,
      duration_minutes: Number(body.duration_minutes),
      max_elevation_m: body.max_elevation_m ? Number(body.max_elevation_m) : null,
      distance_km: body.distance_km ? Number(body.distance_km) : null,
      wing: body.wing || null,
      flight_type: body.flight_type || "Pg",
      site: body.site || null,
      comments: body.comments || null,
    });

    return NextResponse.json({ flight }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not save flight.", detail: err?.message },
      { status: 500 }
    );
  }
}
