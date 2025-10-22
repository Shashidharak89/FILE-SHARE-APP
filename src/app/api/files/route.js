// app/api/files/route.js
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "C:/share";

export async function GET() {
  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      return new Response(JSON.stringify({ files: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    const names = await fs.promises.readdir(UPLOAD_DIR);
    const files = await Promise.all(
      names.map(async (name) => {
        const full = path.join(UPLOAD_DIR, name);
        const stat = await fs.promises.stat(full);
        return { name, size: stat.size, mtime: stat.mtime };
      })
    );

    return new Response(JSON.stringify({ files }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    console.error("List files error:", err);
    return new Response(JSON.stringify({ files: [], error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
