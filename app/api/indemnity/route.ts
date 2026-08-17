import { NextRequest, NextResponse } from "next/server";
import { ensureSchema, insertIndemnityForm } from "@/lib/db";
import { sendIndemnityCopy } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await ensureSchema();
    const body = await req.json();

    if (!body.passenger_name || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    if (
      !body.confirmed_adult ||
      !body.confirmed_risk ||
      !body.confirmed_insurance ||
      !body.confirmed_signature
    ) {
      return NextResponse.json(
        { error: "All confirmations must be accepted before submitting." },
        { status: 400 }
      );
    }

    if (!body.signature_data_url) {
      return NextResponse.json({ error: "A signature is required." }, { status: 400 });
    }

    const form = await insertIndemnityForm({
      passenger_name: body.passenger_name,
      email: body.email,
      phone: body.phone,
      confirmed_adult: true,
      confirmed_risk: true,
      confirmed_insurance: true,
      confirmed_signature: true,
      signature_data_url: body.signature_data_url,
    });

    try {
      await sendIndemnityCopy(form);
    } catch (emailErr) {
      console.error("Could not email signed indemnity copy:", emailErr);
    }

    return NextResponse.json({ form }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not save the indemnity form.", detail: err?.message },
      { status: 500 }
    );
  }
}
