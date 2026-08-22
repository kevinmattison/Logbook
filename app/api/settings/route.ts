import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, getSettings, upsertSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not load settings.", detail: err?.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();

    const settings = await upsertSettings({
      pilot_name: body.pilot_name || null,
      sahpa_number: body.sahpa_number || null,
      email: body.email || null,
      phone: body.phone || null,
    });

    return NextResponse.json({ settings });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not save settings.", detail: err?.message },
      { status: 500 }
    );
  }
}
