// app/api/download/route.js
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "C:/share";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
    if (!name) {
      return new Response("Missing file name", { status: 400 });
    }

    // prevent path traversal
    if (name.includes("..") || name.includes("/") || name.includes("\\")) {
      return new Response("Invalid file name", { status: 400 });
    }

    const filePath = path.join(UPLOAD_DIR, path.basename(name));
    if (!fs.existsSync(filePath)) {
      return new Response("File not found", { status: 404 });
    }

    const stat = await fs.promises.stat(filePath);
    const stream = fs.createReadStream(filePath);

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Length": String(stat.size),
        "Content-Disposition": `attachment; filename="${name}"`,
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return new Response(String(err), { status: 500 });
  }
}
