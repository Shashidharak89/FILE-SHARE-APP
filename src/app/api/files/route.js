import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Try to use C:/share, fallback to project root if not accessible
const PRIMARY_UPLOAD_DIR = "C:/share";
const FALLBACK_UPLOAD_DIR = path.join(process.cwd(), 'share');

// Check if we can access C:/share
let UPLOAD_DIR = PRIMARY_UPLOAD_DIR;
try {
    // Try to access or create C:/share
    if (!fs.existsSync(PRIMARY_UPLOAD_DIR)) {
        fs.mkdirSync(PRIMARY_UPLOAD_DIR, { recursive: true });
    }
    // Test write access
    fs.accessSync(PRIMARY_UPLOAD_DIR, fs.constants.W_OK);
} catch (error) {
    console.log('Cannot access C:/share, using fallback location:', FALLBACK_UPLOAD_DIR);
    UPLOAD_DIR = FALLBACK_UPLOAD_DIR;
    if (!fs.existsSync(FALLBACK_UPLOAD_DIR)) {
        fs.mkdirSync(FALLBACK_UPLOAD_DIR, { recursive: true });
    }
}

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
