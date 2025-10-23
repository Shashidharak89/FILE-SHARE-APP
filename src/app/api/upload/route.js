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

export async function POST(req) {
  try {
    // Create share directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await req.formData();
    const files = formData.getAll("files");
    const saved = [];

    for (const file of files) {
      if (!file || typeof file.name !== "string") continue;

      const filename = path.basename(file.name);
      const dest = path.join(UPLOAD_DIR, filename);

      // Check if file already exists
      if (fs.existsSync(dest)) {
        // Skip overwriting to preserve original metadata
        saved.push(`${filename} (already exists)`);
        continue;
      }

      // Read file bytes
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Write file
      await fs.promises.writeFile(dest, buffer);

      // Preserve original file timestamp if possible (use file lastModified from client)
      if (file.lastModified) {
        const mtime = new Date(file.lastModified);
        fs.utimesSync(dest, mtime, mtime); // set access & modified time
      }

      saved.push(filename);
    }

    return new Response(JSON.stringify({ ok: true, saved }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
