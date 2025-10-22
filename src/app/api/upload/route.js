// app/api/upload/route.js
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "C:/share";

export async function POST(req) {
  try {
    // ensure folder exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await req.formData();
    // the frontend will send files under name "files"
    const files = formData.getAll("files"); // array of File objects

    const saved = [];
    for (const file of files) {
      if (!file || typeof file.name !== "string") continue;

      // basic filename validation to avoid traversal
      const filename = path.basename(file.name);

      // read file bytes
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // write to C:/share keeping original name
      const dest = path.join(UPLOAD_DIR, filename);
      await fs.promises.writeFile(dest, buffer);
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
