import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getStoragePath } from '../../lib/storage';

export async function GET() {
  try {
    const UPLOAD_DIR = getStoragePath();
    const files = fs.readdirSync(UPLOAD_DIR);

    // Return file names
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
