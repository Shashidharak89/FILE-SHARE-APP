import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Set the exact upload directory path
const UPLOAD_DIR = "C:\\share";

export async function GET() {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    
    const files = fs.readdirSync(UPLOAD_DIR);

    // Return file names
    return NextResponse.json({ files });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
