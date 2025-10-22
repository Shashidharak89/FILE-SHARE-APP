import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const uploadDir = "C:/share";

export async function GET() {
  try {
    const files = fs.readdirSync(uploadDir);

    // Return file names
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
