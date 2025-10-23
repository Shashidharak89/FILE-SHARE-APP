import fs from "fs";
import path from "path";

// Set the exact upload directory path
const UPLOAD_DIR = "C:\\share";

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
