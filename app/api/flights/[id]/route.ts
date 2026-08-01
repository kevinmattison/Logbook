import { NextRequest, NextResponse } from "next/server";
import { deleteFlight } from "@/lib/db";

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
